const express = require('express');
const { Pool } = require('pg');
const Joi = require('joi');

const router = express.Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/battle64_friends_groups',
});

// Validation schemas
const sendMessageSchema = Joi.object({
  conversationId: Joi.string().uuid().required(),
  content: Joi.string().min(1).max(5000).required(),
  type: Joi.string().valid('text', 'image', 'quote', 'system').default('text'),
  quotedMessageId: Joi.string().uuid().optional(),
  images: Joi.array().items(Joi.string()).max(10).optional(),
  isEncrypted: Joi.boolean().default(false)
});

const createConversationSchema = Joi.object({
  participantId: Joi.string().uuid().required()
});

// Get user's conversations
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user.id;

    const conversationsResult = await pool.query(
      `SELECT c.*, 
              m.content as last_message_content, m.created_at as last_message_time,
              m.sender_id as last_message_sender_id,
              u.username as last_message_sender_name
       FROM conversations c
       LEFT JOIN LATERAL (
         SELECT content, created_at, sender_id
         FROM messages 
         WHERE conversation_id = c.id 
         ORDER BY created_at DESC 
         LIMIT 1
       ) m ON true
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE $1 = ANY(c.participants)
       ORDER BY c.updated_at DESC`,
      [userId]
    );

    const conversations = await Promise.all(
      conversationsResult.rows.map(async (row) => {
        // Get other participants for direct conversations
        let participants = [];
        if (row.type === 'direct') {
          const otherUserId = row.participants.find(id => id !== userId);
          const participantResult = await pool.query(
            'SELECT id, username, avatar, status FROM users WHERE id = $1',
            [otherUserId]
          );
          participants = participantResult.rows;
        }

        return {
          id: row.id,
          type: row.type,
          participants: participants,
          lastMessage: row.last_message_content ? {
            content: row.last_message_content,
            createdAt: row.last_message_time,
            sender: {
              id: row.last_message_sender_id,
              username: row.last_message_sender_name
            }
          } : null,
          unreadCount: row.unread_count,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
      })
    );

    res.json({
      success: true,
      data: { conversations }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations'
    });
  }
});

// Create or get direct conversation
router.post('/conversations', async (req, res) => {
  try {
    const { error, value } = createConversationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { participantId } = value;
    const userId = req.user.id;

    // Check if users are friends
    const friendshipResult = await pool.query(
      `SELECT id FROM friendships 
       WHERE status = 'accepted' 
         AND ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1))`,
      [userId, participantId]
    );

    if (friendshipResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Can only message friends'
      });
    }

    // Check if conversation already exists
    const existingConversation = await pool.query(
      `SELECT id FROM conversations 
       WHERE type = 'direct' 
         AND participants @> ARRAY[$1, $2]::uuid[]
         AND array_length(participants, 1) = 2`,
      [userId, participantId]
    );

    if (existingConversation.rows.length > 0) {
      return res.json({
        success: true,
        data: { conversationId: existingConversation.rows[0].id }
      });
    }

    // Create new conversation
    const conversationResult = await pool.query(
      `INSERT INTO conversations (type, participants)
       VALUES ($1, $2)
       RETURNING id`,
      ['direct', [userId, participantId]]
    );

    res.status(201).json({
      success: true,
      message: 'Conversation created',
      data: { conversationId: conversationResult.rows[0].id }
    });

  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// Get messages for a conversation
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    // Check if user is part of conversation
    const conversationResult = await pool.query(
      'SELECT id, type FROM conversations WHERE id = $1 AND $2 = ANY(participants)',
      [conversationId, userId]
    );

    if (conversationResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to conversation'
      });
    }

    // Get messages
    const messagesResult = await pool.query(
      `SELECT m.*, u.username, u.avatar,
              qm.content as quoted_content, qm.sender_id as quoted_sender_id,
              qu.username as quoted_sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       LEFT JOIN messages qm ON m.quoted_message_id = qm.id
       LEFT JOIN users qu ON qm.sender_id = qu.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [conversationId, limit, offset]
    );

    const messages = messagesResult.rows.map(row => ({
      id: row.id,
      content: row.content,
      type: row.type,
      images: row.images || [],
      isEncrypted: row.is_encrypted,
      createdAt: row.created_at,
      sender: {
        id: row.sender_id,
        username: row.username,
        avatar: row.avatar
      },
      quotedMessage: row.quoted_message_id ? {
        id: row.quoted_message_id,
        content: row.quoted_content,
        sender: {
          id: row.quoted_sender_id,
          username: row.quoted_sender_name
        }
      } : null
    }));

    // Mark messages as read
    await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false`,
      [conversationId, userId]
    );

    // Update conversation unread count
    await pool.query(
      `UPDATE conversations 
       SET unread_count = 0, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [conversationId]
    );

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM messages WHERE conversation_id = $1',
      [conversationId]
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messages'
    });
  }
});

// Send message
router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { error, value } = sendMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { conversationId } = req.params;
    const { content, type, quotedMessageId, images, isEncrypted } = value;
    const senderId = req.user.id;

    // Check if user is part of conversation
    const conversationResult = await pool.query(
      'SELECT id, type FROM conversations WHERE id = $1 AND $2 = ANY(participants)',
      [conversationId, senderId]
    );

    if (conversationResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to conversation'
      });
    }

    // Create message
    const messageResult = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, content, type, quoted_message_id, images, is_encrypted)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [conversationId, senderId, content, type, quotedMessageId, images || [], isEncrypted]
    );

    const message = messageResult.rows[0];

    // Update conversation
    await pool.query(
      `UPDATE conversations 
       SET updated_at = CURRENT_TIMESTAMP,
           unread_count = unread_count + 1
       WHERE id = $1`,
      [conversationId]
    );

    // Get sender info
    const senderResult = await pool.query(
      'SELECT username, avatar FROM users WHERE id = $1',
      [senderId]
    );

    const sender = senderResult.rows[0];

    const messageData = {
      id: message.id,
      content: message.content,
      type: message.type,
      images: message.images,
      isEncrypted: message.is_encrypted,
      createdAt: message.created_at,
      sender: {
        id: senderId,
        username: sender.username,
        avatar: sender.avatar
      }
    };

    // Add quoted message if exists
    if (quotedMessageId) {
      const quotedResult = await pool.query(
        `SELECT m.content, u.username
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.id = $1`,
        [quotedMessageId]
      );

      if (quotedResult.rows.length > 0) {
        const quoted = quotedResult.rows[0];
        messageData.quotedMessage = {
          id: quotedMessageId,
          content: quoted.content,
          sender: {
            username: quoted.username
          }
        };
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: messageData }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// Delete message
router.delete('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Check if user owns the message
    const messageResult = await pool.query(
      'SELECT id FROM messages WHERE id = $1 AND sender_id = $2',
      [messageId, userId]
    );

    if (messageResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or access denied'
      });
    }

    // Delete message
    await pool.query(
      'DELETE FROM messages WHERE id = $1',
      [messageId]
    );

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
});

module.exports = router;