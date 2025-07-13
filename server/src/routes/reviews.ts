import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init';
import { authenticateToken } from './auth';

const router = express.Router();

// Get reviews for a game
router.get('/game/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const db = getDatabase();
    const offset = (Number(page) - 1) * Number(limit);

    const query = `
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.gameId = ?
      ORDER BY r.likes DESC, r.createdAt DESC
      LIMIT ? OFFSET ?
    `;

    db.all(query, [gameId, Number(limit), offset], (err, reviews) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      db.get('SELECT COUNT(*) as total FROM reviews WHERE gameId = ?', [gameId], (err, result: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          reviews,
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

// Create review
router.post('/game/:gameId', authenticateToken, (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (title.length < 3 || content.length < 10) {
      return res.status(400).json({ error: 'Title must be at least 3 characters and content at least 10 characters' });
    }

    const db = getDatabase();
    const reviewId = uuidv4();

    db.run(
      `INSERT INTO reviews (id, userId, gameId, title, content)
       VALUES (?, ?, ?, ?, ?)`,
      [reviewId, userId, gameId, title, content],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create review' });
        }

        // Award points for writing review
        db.run(
          'UPDATE users SET points = points + 25 WHERE id = ?',
          [userId]
        );

        res.status(201).json({ 
          message: 'Review created successfully',
          reviewId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update review
router.put('/:reviewId', authenticateToken, (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const db = getDatabase();

    db.run(
      `UPDATE reviews 
       SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ? AND userId = ?`,
      [title, content, reviewId, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update review' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Review not found or not authorized' });
        }

        res.json({ message: 'Review updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review
router.delete('/:reviewId', authenticateToken, (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    
    const db = getDatabase();

    db.run(
      'DELETE FROM reviews WHERE id = ? AND userId = ?',
      [reviewId, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete review' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Review not found or not authorized' });
        }

        res.json({ message: 'Review deleted successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike review
router.post('/:reviewId/like', authenticateToken, (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    
    const db = getDatabase();

    // Check if already liked
    db.get(
      'SELECT id FROM review_likes WHERE reviewId = ? AND userId = ?',
      [reviewId, userId],
      (err, existingLike) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingLike) {
          // Unlike
          db.run(
            'DELETE FROM review_likes WHERE reviewId = ? AND userId = ?',
            [reviewId, userId],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to unlike review' });
              }

              // Decrease like count
              db.run(
                'UPDATE reviews SET likes = likes - 1 WHERE id = ?',
                [reviewId]
              );

              res.json({ message: 'Review unliked successfully' });
            }
          );
        } else {
          // Like
          const likeId = uuidv4();
          db.run(
            'INSERT INTO review_likes (id, userId, reviewId) VALUES (?, ?, ?)',
            [likeId, userId, reviewId],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to like review' });
              }

              // Increase like count
              db.run(
                'UPDATE reviews SET likes = likes + 1 WHERE id = ?',
                [reviewId]
              );

              res.json({ message: 'Review liked successfully' });
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's reviews
router.get('/user', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;
    
    const db = getDatabase();
    const offset = (Number(page) - 1) * Number(limit);

    const query = `
      SELECT r.*, g.title, g.coverImage
      FROM reviews r
      JOIN games g ON r.gameId = g.id
      WHERE r.userId = ?
      ORDER BY r.updatedAt DESC
      LIMIT ? OFFSET ?
    `;

    db.all(query, [userId, Number(limit), offset], (err, reviews) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      db.get('SELECT COUNT(*) as total FROM reviews WHERE userId = ?', [userId], (err, result: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          reviews,
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

export default router;