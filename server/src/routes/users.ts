import express from 'express';
import { getDatabase } from '../database/init';
import { authenticateToken } from './auth';

const router = express.Router();

// Get user profile
router.get('/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDatabase();

    const query = `
      SELECT u.id, u.username, u.points, u.createdAt,
             COUNT(DISTINCT c.id) as totalGames,
             COUNT(DISTINCT r.id) as totalRatings,
             COUNT(DISTINCT rev.id) as totalReviews
      FROM users u
      LEFT JOIN collections c ON u.id = c.userId
      LEFT JOIN ratings r ON u.id = r.userId
      LEFT JOIN reviews rev ON u.id = rev.userId
      WHERE u.id = ?
      GROUP BY u.id
    `;

    db.get(query, [userId], (err, profile) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!profile) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ profile });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDatabase();

    const query = `
      SELECT 
        (SELECT COUNT(*) FROM collections WHERE userId = ?) as totalGames,
        (SELECT COUNT(*) FROM ratings WHERE userId = ?) as totalRatings,
        (SELECT COUNT(*) FROM reviews WHERE userId = ?) as totalReviews,
        (SELECT points FROM users WHERE id = ?) as points,
        (SELECT COUNT(*) FROM collections WHERE userId = ? AND status = 'owned') as ownedGames,
        (SELECT COUNT(*) FROM collections WHERE userId = ? AND status = 'wanted') as wantedGames,
        (SELECT COUNT(*) FROM collections WHERE userId = ? AND status = 'traded') as tradedGames,
        (SELECT COALESCE(AVG(overall), 0) FROM ratings WHERE userId = ?) as avgRating,
        (SELECT COUNT(*) FROM review_likes WHERE userId IN (
          SELECT id FROM reviews WHERE userId = ?
        )) as totalLikesReceived
    `;

    db.get(query, [userId, userId, userId, userId, userId, userId, userId, userId, userId], (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ stats });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const { type = 'points', limit = 20 } = req.query;
    const db = getDatabase();

    let query = '';
    let orderBy = '';

    switch (type) {
      case 'points':
        query = `
          SELECT u.id, u.username, u.points, u.createdAt
          FROM users u
          ORDER BY u.points DESC
          LIMIT ?
        `;
        break;
      case 'games':
        query = `
          SELECT u.id, u.username, u.points, COUNT(c.id) as gameCount
          FROM users u
          LEFT JOIN collections c ON u.id = c.userId AND c.status = 'owned'
          GROUP BY u.id
          ORDER BY gameCount DESC, u.points DESC
          LIMIT ?
        `;
        break;
      case 'ratings':
        query = `
          SELECT u.id, u.username, u.points, COUNT(r.id) as ratingCount
          FROM users u
          LEFT JOIN ratings r ON u.id = r.userId
          GROUP BY u.id
          ORDER BY ratingCount DESC, u.points DESC
          LIMIT ?
        `;
        break;
      case 'reviews':
        query = `
          SELECT u.id, u.username, u.points, COUNT(rev.id) as reviewCount
          FROM users u
          LEFT JOIN reviews rev ON u.id = rev.userId
          GROUP BY u.id
          ORDER BY reviewCount DESC, u.points DESC
          LIMIT ?
        `;
        break;
      default:
        return res.status(400).json({ error: 'Invalid leaderboard type' });
    }

    db.all(query, [Number(limit)], (err, leaderboard) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ leaderboard, type });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's recent activity
router.get('/activity', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;
    
    const db = getDatabase();
    const offset = (Number(page) - 1) * Number(limit);

    const query = `
      SELECT 
        'rating' as type,
        r.createdAt as date,
        g.title as gameTitle,
        g.coverImage,
        r.overall as rating,
        NULL as content
      FROM ratings r
      JOIN games g ON r.gameId = g.id
      WHERE r.userId = ?
      
      UNION ALL
      
      SELECT 
        'review' as type,
        rev.createdAt as date,
        g.title as gameTitle,
        g.coverImage,
        NULL as rating,
        rev.title as content
      FROM reviews rev
      JOIN games g ON rev.gameId = g.id
      WHERE rev.userId = ?
      
      UNION ALL
      
      SELECT 
        'collection' as type,
        c.createdAt as date,
        g.title as gameTitle,
        g.coverImage,
        NULL as rating,
        c.status as content
      FROM collections c
      JOIN games g ON c.gameId = g.id
      WHERE c.userId = ?
      
      ORDER BY date DESC
      LIMIT ? OFFSET ?
    `;

    db.all(query, [userId, userId, userId, Number(limit), offset], (err, activities) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count
      const countQuery = `
        SELECT (
          (SELECT COUNT(*) FROM ratings WHERE userId = ?) +
          (SELECT COUNT(*) FROM reviews WHERE userId = ?) +
          (SELECT COUNT(*) FROM collections WHERE userId = ?)
        ) as total
      `;

      db.get(countQuery, [userId, userId, userId], (err, result: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          activities,
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

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email } = req.body;
    
    const db = getDatabase();

    // Check if username/email already exists
    if (username || email) {
      const checkQuery = 'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?';
      db.get(checkQuery, [username, email, userId], (err, existingUser) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (existingUser) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Update profile
        const updateQuery = 'UPDATE users SET username = ?, email = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
        db.run(updateQuery, [username, email, userId], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update profile' });
          }

          res.json({ message: 'Profile updated successfully' });
        });
      });
    } else {
      res.status(400).json({ error: 'No fields to update' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;