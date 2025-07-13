const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/battle64_friends_groups',
});

// Validation schemas
const createGroupSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(1000).required(),
  type: Joi.string().valid('public', 'private', 'hidden').required(),
  category: Joi.string().valid('speedrun', 'trading', 'regional', 'fanart', 'competitive', 'casual', 'modding', 'other').required(),
  tags: Joi.array().items(Joi.string()).max(10),
  gameAssociations: Joi.array().items(Joi.string()).max(20),
  maxMembers: Joi.number().integer().min(1).max(10000).optional(),
  settings: Joi.object({
    allowMemberPosts: Joi.boolean(),
    requireApproval: Joi.boolean(),
    allowImageUploads: Joi.boolean(),
    allowPolls: Joi.boolean(),
    allowEvents: Joi.boolean(),
    allowChallenges: Joi.boolean()
  }).optional()
});

const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  type: Joi.string().valid('text', 'image', 'poll', 'event', 'challenge').required(),
  images: Joi.array().items(Joi.string()).max(10).optional(),
  poll: Joi.object({
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).min(2).max(10).required(),
    endDate: Joi.date().greater('now').required(),
    allowMultiple: Joi.boolean().default(false)
  }).optional(),
  event: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    location: Joi.string().optional(),
    maxParticipants: Joi.number().integer().min(1).optional()
  }).optional(),
  challenge: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().valid('quiz', 'screenshot', 'speedrun', 'creative').required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required()
  }).optional()
});

// Get user's groups
router.get('/my', async (req, res) => {
  try {
    const userId = req.user.id;

    const groupsResult = await pool.query(
      `SELECT g.*, gm.role, gm.joined_at,
              u.username as founder_username, u.avatar as founder_avatar
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       JOIN users u ON g.founder_id = u.id
       WHERE gm.user_id = $1
       ORDER BY gm.joined_at DESC`,
      [userId]
    );

    const groups = groupsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      avatar: row.avatar,
      banner: row.banner,
      type: row.type,
      category: row.category,
      tags: row.tags || [],
      gameAssociations: row.game_associations || [],
      memberCount: row.member_count,
      maxMembers: row.max_members,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      role: row.role,
      joinedAt: row.joined_at,
      founder: {
        id: row.founder_id,
        username: row.founder_username,
        avatar: row.founder_avatar
      },
      settings: {
        allowMemberPosts: row.allow_member_posts,
        requireApproval: row.require_approval,
        allowImageUploads: row.allow_image_uploads,
        allowPolls: row.allow_polls,
        allowEvents: row.allow_events,
        allowChallenges: row.allow_challenges
      }
    }));

    res.json({
      success: true,
      data: { groups }
    });

  } catch (error) {
    console.error('Get my groups error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get groups'
    });
  }
});

// Get public groups
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    let whereClause = "WHERE g.type = 'public'";
    let params = [userId, limit, offset];
    let paramIndex = 4;

    if (category) {
      whereClause += ` AND g.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (g.name ILIKE $${paramIndex} OR g.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const groupsResult = await pool.query(
      `SELECT g.*, u.username as founder_username, u.avatar as founder_avatar,
              CASE WHEN gm.user_id IS NOT NULL THEN gm.role ELSE NULL END as user_role
       FROM groups g
       JOIN users u ON g.founder_id = u.id
       LEFT JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = $1
       ${whereClause}
       ORDER BY g.member_count DESC, g.created_at DESC
       LIMIT $2 OFFSET $3`,
      params
    );

    const groups = groupsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      avatar: row.avatar,
      banner: row.banner,
      type: row.type,
      category: row.category,
      tags: row.tags || [],
      gameAssociations: row.game_associations || [],
      memberCount: row.member_count,
      maxMembers: row.max_members,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userRole: row.user_role,
      founder: {
        id: row.founder_id,
        username: row.founder_username,
        avatar: row.founder_avatar
      }
    }));

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM groups g ${whereClause}`,
      params.slice(3)
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        groups,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Get public groups error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get public groups'
    });
  }
});

// Create new group
router.post('/', async (req, res) => {
  try {
    const { error, value } = createGroupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const {
      name, description, type, category, tags, gameAssociations,
      maxMembers, settings
    } = value;
    const founderId = req.user.id;

    // Create group
    const groupResult = await pool.query(
      `INSERT INTO groups (
        name, description, type, category, tags, game_associations,
        max_members, founder_id, allow_member_posts, require_approval,
        allow_image_uploads, allow_polls, allow_events, allow_challenges
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        name, description, type, category, tags || [], gameAssociations || [],
        maxMembers, founderId,
        settings?.allowMemberPosts ?? true,
        settings?.requireApproval ?? false,
        settings?.allowImageUploads ?? true,
        settings?.allowPolls ?? true,
        settings?.allowEvents ?? true,
        settings?.allowChallenges ?? true
      ]
    );

    const group = groupResult.rows[0];

    // Add founder as member
    await pool.query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, $3)`,
      [group.id, founderId, 'founder']
    );

    // Update member count
    await pool.query(
      'UPDATE groups SET member_count = 1 WHERE id = $1',
      [group.id]
    );

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: {
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          type: group.type,
          category: group.category,
          tags: group.tags,
          gameAssociations: group.game_associations,
          memberCount: 1,
          maxMembers: group.max_members,
          createdAt: group.created_at,
          updatedAt: group.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create group'
    });
  }
});

// Get group details
router.get('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const groupResult = await pool.query(
      `SELECT g.*, u.username as founder_username, u.avatar as founder_avatar,
              gm.role as user_role, gm.joined_at
       FROM groups g
       JOIN users u ON g.founder_id = u.id
       LEFT JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = $1
       WHERE g.id = $2`,
      [userId, groupId]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    const group = groupResult.rows[0];

    // Check if user can access the group
    if (group.type === 'hidden' && !group.user_role) {
      return res.status(403).json({
        success: false,
        error: 'Group is hidden'
      });
    }

    res.json({
      success: true,
      data: {
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          avatar: group.avatar,
          banner: group.banner,
          type: group.type,
          category: group.category,
          tags: group.tags || [],
          gameAssociations: group.game_associations || [],
          memberCount: group.member_count,
          maxMembers: group.max_members,
          createdAt: group.created_at,
          updatedAt: group.updated_at,
          userRole: group.user_role,
          joinedAt: group.joined_at,
          founder: {
            id: group.founder_id,
            username: group.founder_username,
            avatar: group.founder_avatar
          },
          settings: {
            allowMemberPosts: group.allow_member_posts,
            requireApproval: group.require_approval,
            allowImageUploads: group.allow_image_uploads,
            allowPolls: group.allow_polls,
            allowEvents: group.allow_events,
            allowChallenges: group.allow_challenges
          }
        }
      }
    });

  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get group'
    });
  }
});

// Join group
router.post('/:groupId/join', async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    // Check if group exists and is joinable
    const groupResult = await pool.query(
      'SELECT id, type, member_count, max_members FROM groups WHERE id = $1',
      [groupId]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    const group = groupResult.rows[0];

    if (group.type === 'hidden') {
      return res.status(403).json({
        success: false,
        error: 'Cannot join hidden group'
      });
    }

    if (group.max_members && group.member_count >= group.max_members) {
      return res.status(400).json({
        success: false,
        error: 'Group is full'
      });
    }

    // Check if already a member
    const memberResult = await pool.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    if (memberResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Already a member of this group'
      });
    }

    // Add member
    await pool.query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, $3)`,
      [groupId, userId, 'member']
    );

    // Update member count
    await pool.query(
      'UPDATE groups SET member_count = member_count + 1 WHERE id = $1',
      [groupId]
    );

    res.json({
      success: true,
      message: 'Joined group successfully'
    });

  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join group'
    });
  }
});

// Leave group
router.post('/:groupId/leave', async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    // Check if member
    const memberResult = await pool.query(
      'SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    if (memberResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Not a member of this group'
      });
    }

    const member = memberResult.rows[0];

    // Founder cannot leave (must transfer ownership or delete group)
    if (member.role === 'founder') {
      return res.status(400).json({
        success: false,
        error: 'Founder cannot leave group. Transfer ownership or delete the group.'
      });
    }

    // Remove member
    await pool.query(
      'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    // Update member count
    await pool.query(
      'UPDATE groups SET member_count = member_count - 1 WHERE id = $1',
      [groupId]
    );

    res.json({
      success: true,
      message: 'Left group successfully'
    });

  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to leave group'
    });
  }
});

// Get group posts
router.get('/:groupId/posts', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    // Check if user can access group
    const accessResult = await pool.query(
      `SELECT g.type, gm.role
       FROM groups g
       LEFT JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = $1
       WHERE g.id = $2`,
      [userId, groupId]
    );

    if (accessResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    const group = accessResult.rows[0];

    if (group.type === 'hidden' && !group.role) {
      return res.status(403).json({
        success: false,
        error: 'Cannot access hidden group'
      });
    }

    // Get posts
    const postsResult = await pool.query(
      `SELECT gp.*, u.username, u.avatar,
              COUNT(c.id) as comment_count
       FROM group_posts gp
       JOIN users u ON gp.author_id = u.id
       LEFT JOIN comments c ON gp.id = c.post_id
       WHERE gp.group_id = $1
       GROUP BY gp.id, u.username, u.avatar
       ORDER BY gp.created_at DESC
       LIMIT $2 OFFSET $3`,
      [groupId, limit, offset]
    );

    const posts = postsResult.rows.map(row => ({
      id: row.id,
      content: row.content,
      type: row.type,
      images: row.images || [],
      likes: row.likes,
      commentCount: parseInt(row.comment_count),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      author: {
        id: row.author_id,
        username: row.username,
        avatar: row.avatar
      }
    }));

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM group_posts WHERE group_id = $1',
      [groupId]
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Get group posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get group posts'
    });
  }
});

// Create group post
router.post('/:groupId/posts', async (req, res) => {
  try {
    const { error, value } = createPostSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { groupId } = req.params;
    const { content, type, images, poll, event, challenge } = value;
    const authorId = req.user.id;

    // Check if user can post
    const accessResult = await pool.query(
      `SELECT g.allow_member_posts, gm.role
       FROM groups g
       LEFT JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = $1
       WHERE g.id = $2`,
      [authorId, groupId]
    );

    if (accessResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    const group = accessResult.rows[0];

    if (!group.role && !group.allow_member_posts) {
      return res.status(403).json({
        success: false,
        error: 'Only members can post in this group'
      });
    }

    // Create post
    const postResult = await pool.query(
      `INSERT INTO group_posts (group_id, author_id, content, type, images)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [groupId, authorId, content, type, images || []]
    );

    const post = postResult.rows[0];

    // Create poll if provided
    if (poll && type === 'poll') {
      const pollResult = await pool.query(
        `INSERT INTO polls (post_id, question, end_date, allow_multiple)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [post.id, poll.question, poll.endDate, poll.allowMultiple]
      );

      const pollId = pollResult.rows[0].id;

      // Create poll options
      for (const option of poll.options) {
        await pool.query(
          'INSERT INTO poll_options (poll_id, text) VALUES ($1, $2)',
          [pollId, option]
        );
      }
    }

    // Create event if provided
    if (event && type === 'event') {
      await pool.query(
        `INSERT INTO group_events (post_id, title, description, start_date, end_date, location, max_participants)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [post.id, event.title, event.description, event.startDate, event.endDate, event.location, event.maxParticipants]
      );
    }

    // Create challenge if provided
    if (challenge && type === 'challenge') {
      await pool.query(
        `INSERT INTO challenges (post_id, title, description, type, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [post.id, challenge.title, challenge.description, challenge.type, challenge.startDate, challenge.endDate]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post: {
          id: post.id,
          content: post.content,
          type: post.type,
          images: post.images,
          likes: post.likes,
          createdAt: post.created_at,
          updatedAt: post.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post'
    });
  }
});

module.exports = router;