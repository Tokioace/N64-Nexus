import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init';
import { authenticateToken } from './auth';
import { Rating } from '../types';

const router = express.Router();

// Get ratings for a game
router.get('/game/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const db = getDatabase();
    const offset = (Number(page) - 1) * Number(limit);

    const query = `
      SELECT r.*, u.username
      FROM ratings r
      JOIN users u ON r.userId = u.id
      WHERE r.gameId = ?
      ORDER BY r.createdAt DESC
      LIMIT ? OFFSET ?
    `;

    db.all(query, [gameId, Number(limit), offset], (err, ratings) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      db.get('SELECT COUNT(*) as total FROM ratings WHERE gameId = ?', [gameId], (err, result: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          ratings,
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

// Get user's rating for a game
router.get('/game/:gameId/user', authenticateToken, (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId;
    
    const db = getDatabase();

    db.get(
      'SELECT * FROM ratings WHERE gameId = ? AND userId = ?',
      [gameId, userId],
      (err, rating: Rating) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ rating });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create or update rating
router.post('/game/:gameId', authenticateToken, (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId;
    const { gameplay, graphics, music, nostalgia, comment } = req.body;

    if (!gameplay || !graphics || !music || !nostalgia) {
      return res.status(400).json({ error: 'All rating categories are required' });
    }

    // Validate rating values (1-5)
    if (gameplay < 1 || gameplay > 5 || graphics < 1 || graphics > 5 || 
        music < 1 || music > 5 || nostalgia < 1 || nostalgia > 5) {
      return res.status(400).json({ error: 'Ratings must be between 1 and 5' });
    }

    const overall = (gameplay + graphics + music + nostalgia) / 4;
    const db = getDatabase();

    // Check if rating already exists
    db.get(
      'SELECT id FROM ratings WHERE gameId = ? AND userId = ?',
      [gameId, userId],
      (err, existingRating) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingRating) {
          // Update existing rating
          db.run(
            `UPDATE ratings 
             SET gameplay = ?, graphics = ?, music = ?, nostalgia = ?, overall = ?, 
                 comment = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE gameId = ? AND userId = ?`,
            [gameplay, graphics, music, nostalgia, overall, comment, gameId, userId],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to update rating' });
              }

              res.json({ message: 'Rating updated successfully' });
            }
          );
        } else {
          // Create new rating
          const ratingId = uuidv4();
          db.run(
            `INSERT INTO ratings (id, userId, gameId, gameplay, graphics, music, nostalgia, overall, comment)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [ratingId, userId, gameId, gameplay, graphics, music, nostalgia, overall, comment],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to create rating' });
              }

              // Award points for rating
              db.run(
                'UPDATE users SET points = points + 10 WHERE id = ?',
                [userId]
              );

              res.status(201).json({ 
                message: 'Rating created successfully',
                ratingId
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

// Delete rating
router.delete('/game/:gameId', authenticateToken, (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId;
    
    const db = getDatabase();

    db.run(
      'DELETE FROM ratings WHERE gameId = ? AND userId = ?',
      [gameId, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete rating' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Rating not found' });
        }

        res.json({ message: 'Rating deleted successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's ratings
router.get('/user', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;
    
    const db = getDatabase();
    const offset = (Number(page) - 1) * Number(limit);

    const query = `
      SELECT r.*, g.title, g.coverImage, g.genre
      FROM ratings r
      JOIN games g ON r.gameId = g.id
      WHERE r.userId = ?
      ORDER BY r.updatedAt DESC
      LIMIT ? OFFSET ?
    `;

    db.all(query, [userId, Number(limit), offset], (err, ratings) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      db.get('SELECT COUNT(*) as total FROM ratings WHERE userId = ?', [userId], (err, result: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          ratings,
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

// Get top rated games
router.get('/top-rated', (req, res) => {
  try {
    const { limit = 10, minRatings = 5 } = req.query;
    
    const db = getDatabase();

    const query = `
      SELECT 
        g.*,
        COALESCE(AVG(r.overall), 0) as averageRating,
        COUNT(r.id) as totalRatings
      FROM games g
      LEFT JOIN ratings r ON g.id = r.gameId
      GROUP BY g.id
      HAVING totalRatings >= ?
      ORDER BY averageRating DESC, totalRatings DESC
      LIMIT ?
    `;

    db.all(query, [Number(minRatings), Number(limit)], (err, games) => {
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