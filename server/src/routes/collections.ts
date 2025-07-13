import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init';
import { authenticateToken } from './auth';
import { Collection } from '../types';

const router = express.Router();

// Get user's collection
router.get('/user', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 20 } = req.query;
    
    const db = getDatabase();
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT c.*, g.title, g.coverImage, g.genre, g.region, g.releaseYear
      FROM collections c
      JOIN games g ON c.gameId = g.id
      WHERE c.userId = ?
    `;
    const params: any[] = [userId];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.updatedAt DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    db.all(query, params, (err, collections) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM collections c WHERE c.userId = ?';
      const countParams: any[] = [userId];
      
      if (status) {
        countQuery += ' AND c.status = ?';
        countParams.push(status);
      }

      db.get(countQuery, countParams, (err, result: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          collections,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: result.total,
            pages: Math.ceil(result.total / Number(limit))
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add game to collection
router.post('/game/:gameId', authenticateToken, (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId;
    const { status, condition, hasManual, hasBox } = req.body;

    if (!status || !['owned', 'wanted', 'traded'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const db = getDatabase();

    // Check if already in collection
    db.get(
      'SELECT id FROM collections WHERE gameId = ? AND userId = ?',
      [gameId, userId],
      (err, existingCollection) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingCollection) {
          // Update existing collection
          db.run(
            `UPDATE collections 
             SET status = ?, condition = ?, hasManual = ?, hasBox = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE gameId = ? AND userId = ?`,
            [status, condition, hasManual, hasBox, gameId, userId],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to update collection' });
              }

              res.json({ message: 'Collection updated successfully' });
            }
          );
        } else {
          // Add to collection
          const collectionId = uuidv4();
          db.run(
            `INSERT INTO collections (id, userId, gameId, status, condition, hasManual, hasBox)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [collectionId, userId, gameId, status, condition, hasManual, hasBox],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to add to collection' });
              }

              // Award points for adding to collection
              let points = 0;
              if (status === 'owned') points = 50;
              else if (status === 'wanted') points = 5;
              else if (status === 'traded') points = 25;

              if (points > 0) {
                db.run(
                  'UPDATE users SET points = points + ? WHERE id = ?',
                  [points, userId]
                );
              }

              res.status(201).json({ 
                message: 'Game added to collection successfully',
                collectionId
              });
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove game from collection
router.delete('/game/:gameId', authenticateToken, (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId;
    
    const db = getDatabase();

    db.run(
      'DELETE FROM collections WHERE gameId = ? AND userId = ?',
      [gameId, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to remove from collection' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Game not found in collection' });
        }

        res.json({ message: 'Game removed from collection successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get collection statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();

    const query = `
      SELECT 
        COUNT(*) as totalGames,
        SUM(CASE WHEN status = 'owned' THEN 1 ELSE 0 END) as ownedCount,
        SUM(CASE WHEN status = 'wanted' THEN 1 ELSE 0 END) as wantedCount,
        SUM(CASE WHEN status = 'traded' THEN 1 ELSE 0 END) as tradedCount,
        SUM(CASE WHEN condition = 'sealed' THEN 1 ELSE 0 END) as sealedCount,
        SUM(CASE WHEN condition = 'complete' THEN 1 ELSE 0 END) as completeCount,
        SUM(CASE WHEN condition = 'loose' THEN 1 ELSE 0 END) as looseCount
      FROM collections
      WHERE userId = ?
    `;

    db.get(query, [userId], (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ stats });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get most collected games
router.get('/most-collected', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const db = getDatabase();

    const query = `
      SELECT 
        g.*,
        COUNT(c.id) as collectionCount,
        SUM(CASE WHEN c.status = 'owned' THEN 1 ELSE 0 END) as ownedCount
      FROM games g
      LEFT JOIN collections c ON g.id = c.gameId
      GROUP BY g.id
      ORDER BY collectionCount DESC, ownedCount DESC
      LIMIT ?
    `;

    db.all(query, [Number(limit)], (err, games) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ games });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;