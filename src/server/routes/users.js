const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/battle64_friends_groups',
});

// Validation schemas
const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  avatar: Joi.string().uri().optional()
});

const updatePrivacySchema = Joi.object({
  showOnlineStatus: Joi.boolean(),
  showLastSeen: Joi.boolean(),
  allowFriendRequests: Joi.boolean(),
  allowGroupInvites: Joi.boolean(),
  showProfileToGroups: Joi.boolean()
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      `SELECT u.id, u.username, u.email, u.avatar, u.status, u.last_seen, u.xp, u.level,
              ps.show_online_status, ps.show_last_seen, ps.allow_friend_requests,
              ps.allow_group_invites, ps.show_profile_to_groups
       FROM users u
       LEFT JOIN privacy_settings ps ON u.id = ps.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          status: user.status,
          lastSeen: user.last_seen,
          xp: user.xp,
          level: user.level,
          privacySettings: {
            showOnlineStatus: user.show_online_status,
            showLastSeen: user.show_last_seen,
            allowFriendRequests: user.allow_friend_requests,
            allowGroupInvites: user.allow_group_invites,
            showProfileToGroups: user.show_profile_to_groups
          }
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

// Update user profile
router.patch('/profile', async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const userId = req.user.id;
    const { username, avatar } = value;

    // Check if username is already taken
    if (username) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Username already taken'
        });
      }
    }

    // Build update query
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (username) {
      updates.push(`username = $${paramIndex}`);
      params.push(username);
      paramIndex++;
    }

    if (avatar) {
      updates.push(`avatar = $${paramIndex}`);
      params.push(avatar);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    params.push(userId);

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING id, username, email, avatar, status, last_seen, xp, level`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          status: user.status,
          lastSeen: user.last_seen,
          xp: user.xp,
          level: user.level
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Update privacy settings
router.patch('/privacy', async (req, res) => {
  try {
    const { error, value } = updatePrivacySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const userId = req.user.id;
    const {
      showOnlineStatus, showLastSeen, allowFriendRequests,
      allowGroupInvites, showProfileToGroups
    } = value;

    // Update privacy settings
    await pool.query(
      `UPDATE privacy_settings 
       SET show_online_status = COALESCE($1, show_online_status),
           show_last_seen = COALESCE($2, show_last_seen),
           allow_friend_requests = COALESCE($3, allow_friend_requests),
           allow_group_invites = COALESCE($4, allow_group_invites),
           show_profile_to_groups = COALESCE($5, show_profile_to_groups),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6`,
      [showOnlineStatus, showLastSeen, allowFriendRequests, allowGroupInvites, showProfileToGroups, userId]
    );

    res.json({
      success: true,
      message: 'Privacy settings updated successfully'
    });

  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update privacy settings'
    });
  }
});

// Get user badges
router.get('/badges', async (req, res) => {
  try {
    const userId = req.user.id;

    const badgesResult = await pool.query(
      `SELECT b.id, b.name, b.description, b.icon, b.category, b.rarity,
              ub.unlocked_at
       FROM user_badges ub
       JOIN badges b ON ub.badge_id = b.id
       WHERE ub.user_id = $1
       ORDER BY ub.unlocked_at DESC`,
      [userId]
    );

    const badges = badgesResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      category: row.category,
      rarity: row.rarity,
      unlockedAt: row.unlocked_at
    }));

    res.json({
      success: true,
      data: { badges }
    });

  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get badges'
    });
  }
});

// Get user stats
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get friend count
    const friendCountResult = await pool.query(
      `SELECT COUNT(*) FROM friendships 
       WHERE status = 'accepted' 
         AND (user_id = $1 OR friend_id = $1)`,
      [userId]
    );

    // Get group count
    const groupCountResult = await pool.query(
      'SELECT COUNT(*) FROM group_members WHERE user_id = $1',
      [userId]
    );

    // Get post count
    const postCountResult = await pool.query(
      'SELECT COUNT(*) FROM group_posts WHERE author_id = $1',
      [userId]
    );

    // Get message count
    const messageCountResult = await pool.query(
      'SELECT COUNT(*) FROM messages WHERE sender_id = $1',
      [userId]
    );

    // Get badge count
    const badgeCountResult = await pool.query(
      'SELECT COUNT(*) FROM user_badges WHERE user_id = $1',
      [userId]
    );

    const stats = {
      friendCount: parseInt(friendCountResult.rows[0].count),
      groupCount: parseInt(groupCountResult.rows[0].count),
      postCount: parseInt(postCountResult.rows[0].count),
      messageCount: parseInt(messageCountResult.rows[0].count),
      badgeCount: parseInt(badgeCountResult.rows[0].count)
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get stats'
    });
  }
});

// Get public user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Get user info
    const userResult = await pool.query(
      `SELECT u.id, u.username, u.avatar, u.status, u.last_seen, u.xp, u.level,
              ps.show_online_status, ps.show_last_seen
       FROM users u
       LEFT JOIN privacy_settings ps ON u.id = ps.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Check friendship status
    const friendshipResult = await pool.query(
      `SELECT status FROM friendships 
       WHERE status = 'accepted' 
         AND ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1))`,
      [currentUserId, userId]
    );

    const isFriend = friendshipResult.rows.length > 0;

    // Build public profile based on privacy settings
    const publicProfile = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level
    };

    // Add status and last seen if allowed
    if (user.show_online_status || isFriend) {
      publicProfile.status = user.status;
    }

    if (user.show_last_seen || isFriend) {
      publicProfile.lastSeen = user.last_seen;
    }

    res.json({
      success: true,
      data: {
        user: publicProfile,
        isFriend
      }
    });

  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// Update user status
router.patch('/status', async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;

    if (!['online', 'offline', 'away', 'busy'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    await pool.query(
      'UPDATE users SET status = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2',
      [status, userId]
    );

    res.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status'
    });
  }
});

module.exports = router;