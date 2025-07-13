const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/battle64_friends_groups',
});

// Validation schemas
const sendFriendRequestSchema = Joi.object({
  toUserId: Joi.string().uuid().required(),
  message: Joi.string().max(500).optional()
});

// Get user's friends
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const friendsResult = await pool.query(
      `SELECT f.id, f.status, f.created_at,
              u.id as friend_id, u.username, u.avatar, u.status as friend_status, 
              u.last_seen, u.xp, u.level
       FROM friendships f
       JOIN users u ON (f.user_id = $1 AND f.friend_id = u.id) 
                    OR (f.friend_id = $1 AND f.user_id = u.id)
       WHERE f.status = 'accepted'
       ORDER BY u.username`,
      [userId]
    );

    const friends = friendsResult.rows.map(row => ({
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      friend: {
        id: row.friend_id,
        username: row.username,
        avatar: row.avatar,
        status: row.friend_status,
        lastSeen: row.last_seen,
        xp: row.xp,
        level: row.level
      }
    }));

    res.json({
      success: true,
      data: { friends }
    });

  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get friends'
    });
  }
});

// Get pending friend requests
router.get('/requests', async (req, res) => {
  try {
    const userId = req.user.id;

    const requestsResult = await pool.query(
      `SELECT fr.id, fr.message, fr.created_at,
              u.id as from_user_id, u.username, u.avatar, u.status, u.xp, u.level
       FROM friend_requests fr
       JOIN users u ON fr.from_user_id = u.id
       WHERE fr.to_user_id = $1 AND fr.status = 'pending'
       ORDER BY fr.created_at DESC`,
      [userId]
    );

    const requests = requestsResult.rows.map(row => ({
      id: row.id,
      message: row.message,
      createdAt: row.created_at,
      fromUser: {
        id: row.from_user_id,
        username: row.username,
        avatar: row.avatar,
        status: row.status,
        xp: row.xp,
        level: row.level
      }
    }));

    res.json({
      success: true,
      data: { requests }
    });

  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get friend requests'
    });
  }
});

// Send friend request
router.post('/request', async (req, res) => {
  try {
    const { error, value } = sendFriendRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { toUserId, message } = value;
    const fromUserId = req.user.id;

    // Check if users are the same
    if (fromUserId === toUserId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot send friend request to yourself'
      });
    }

    // Check if target user exists
    const targetUserResult = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [toUserId]
    );

    if (targetUserResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if friendship already exists
    const existingFriendship = await pool.query(
      'SELECT id, status FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
      [fromUserId, toUserId]
    );

    if (existingFriendship.rows.length > 0) {
      const friendship = existingFriendship.rows[0];
      if (friendship.status === 'accepted') {
        return res.status(400).json({
          success: false,
          error: 'Already friends with this user'
        });
      } else if (friendship.status === 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Friend request already pending'
        });
      }
    }

    // Check if friend request already exists
    const existingRequest = await pool.query(
      'SELECT id FROM friend_requests WHERE from_user_id = $1 AND to_user_id = $2 AND status = $3',
      [fromUserId, toUserId, 'pending']
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Friend request already sent'
      });
    }

    // Create friend request
    const requestResult = await pool.query(
      `INSERT INTO friend_requests (from_user_id, to_user_id, message)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [fromUserId, toUserId, message]
    );

    const request = requestResult.rows[0];

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        toUserId,
        'friend_request',
        'New Friend Request',
        `${req.user.username} sent you a friend request`,
        { requestId: request.id, fromUserId }
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      data: { requestId: request.id }
    });

  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send friend request'
    });
  }
});

// Accept friend request
router.post('/request/:requestId/accept', async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Get friend request
    const requestResult = await pool.query(
      `SELECT fr.*, u.username as from_username
       FROM friend_requests fr
       JOIN users u ON fr.from_user_id = u.id
       WHERE fr.id = $1 AND fr.to_user_id = $2 AND fr.status = 'pending'`,
      [requestId, userId]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friend request not found'
      });
    }

    const request = requestResult.rows[0];

    // Update request status
    await pool.query(
      'UPDATE friend_requests SET status = $1 WHERE id = $2',
      ['accepted', requestId]
    );

    // Create friendship
    await pool.query(
      `INSERT INTO friendships (user_id, friend_id, status)
       VALUES ($1, $2, $3)`,
      [request.from_user_id, request.to_user_id, 'accepted']
    );

    // Create notification for sender
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        request.from_user_id,
        'friend_accept',
        'Friend Request Accepted',
        `${req.user.username} accepted your friend request`,
        { userId }
      ]
    );

    res.json({
      success: true,
      message: 'Friend request accepted'
    });

  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to accept friend request'
    });
  }
});

// Reject friend request
router.post('/request/:requestId/reject', async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Update request status
    const result = await pool.query(
      'UPDATE friend_requests SET status = $1 WHERE id = $2 AND to_user_id = $3 AND status = $4',
      ['rejected', requestId, userId, 'pending']
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friend request not found'
      });
    }

    res.json({
      success: true,
      message: 'Friend request rejected'
    });

  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject friend request'
    });
  }
});

// Remove friend
router.delete('/:friendshipId', async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.user.id;

    // Delete friendship
    const result = await pool.query(
      'DELETE FROM friendships WHERE id = $1 AND (user_id = $2 OR friend_id = $2)',
      [friendshipId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Friendship not found'
      });
    }

    res.json({
      success: true,
      message: 'Friend removed successfully'
    });

  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove friend'
    });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    const searchResult = await pool.query(
      `SELECT u.id, u.username, u.avatar, u.status, u.xp, u.level,
              CASE 
                WHEN f.status = 'accepted' THEN 'friend'
                WHEN f.status = 'pending' THEN 'pending'
                WHEN fr.status = 'pending' THEN 'requested'
                ELSE 'none'
              END as relationship
       FROM users u
       LEFT JOIN friendships f ON (f.user_id = $1 AND f.friend_id = u.id) 
                              OR (f.friend_id = $1 AND f.user_id = u.id)
       LEFT JOIN friend_requests fr ON fr.from_user_id = $1 AND fr.to_user_id = u.id
       WHERE u.id != $1 
         AND u.username ILIKE $2
       ORDER BY u.username
       LIMIT 20`,
      [userId, `%${q}%`]
    );

    const users = searchResult.rows.map(row => ({
      id: row.id,
      username: row.username,
      avatar: row.avatar,
      status: row.status,
      xp: row.xp,
      level: row.level,
      relationship: row.relationship
    }));

    res.json({
      success: true,
      data: { users }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
});

module.exports = router;