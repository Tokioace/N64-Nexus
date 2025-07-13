const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/battle64_friends_groups',
});

// Store connected users
const connectedUsers = new Map();

const handleSocketConnection = (socket, io) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Authenticate user
  socket.on('authenticate', async (data) => {
    try {
      const { token } = data;
      
      if (!token) {
        socket.emit('error', { message: 'Authentication token required' });
        return;
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user info
      const userResult = await pool.query(
        'SELECT id, username, avatar, status FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (userResult.rows.length === 0) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      const user = userResult.rows[0];

      // Store user connection
      connectedUsers.set(socket.id, {
        userId: user.id,
        username: user.username,
        avatar: user.avatar
      });

      // Update user status to online
      await pool.query(
        'UPDATE users SET status = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2',
        ['online', user.id]
      );

      // Join user to their personal room
      socket.join(`user:${user.id}`);

      // Notify friends about status change
      const friendsResult = await pool.query(
        `SELECT DISTINCT 
          CASE 
            WHEN f.user_id = $1 THEN f.friend_id 
            ELSE f.user_id 
          END as friend_id
         FROM friendships f
         WHERE f.status = 'accepted' 
           AND (f.user_id = $1 OR f.friend_id = $1)`,
        [user.id]
      );

      friendsResult.rows.forEach(friend => {
        io.to(`user:${friend.friend_id}`).emit('friend:status', {
          userId: user.id,
          status: 'online'
        });
      });

      socket.emit('authenticated', { user });
      console.log(`✅ User authenticated: ${user.username} (${user.id})`);

    } catch (error) {
      console.error('Socket authentication error:', error);
      socket.emit('error', { message: 'Authentication failed' });
    }
  });

  // Handle private messages
  socket.on('message:send', async (data) => {
    try {
      const { conversationId, content, type, quotedMessageId, images, isEncrypted } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Check if user is part of conversation
      const conversationResult = await pool.query(
        'SELECT id, type FROM conversations WHERE id = $1 AND $2 = ANY(participants)',
        [conversationId, user.userId]
      );

      if (conversationResult.rows.length === 0) {
        socket.emit('error', { message: 'Access denied to conversation' });
        return;
      }

      // Create message
      const messageResult = await pool.query(
        `INSERT INTO messages (conversation_id, sender_id, content, type, quoted_message_id, images, is_encrypted)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [conversationId, user.userId, content, type, quotedMessageId, images || [], isEncrypted]
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

      const messageData = {
        id: message.id,
        conversationId: message.conversation_id,
        content: message.content,
        type: message.type,
        images: message.images,
        isEncrypted: message.is_encrypted,
        createdAt: message.created_at,
        sender: {
          id: user.userId,
          username: user.username,
          avatar: user.avatar
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

      // Send to all participants in the conversation
      const participantsResult = await pool.query(
        'SELECT participants FROM conversations WHERE id = $1',
        [conversationId]
      );

      if (participantsResult.rows.length > 0) {
        const participants = participantsResult.rows[0].participants;
        
        participants.forEach(participantId => {
          if (participantId !== user.userId) {
            // Create notification for recipient
            pool.query(
              `INSERT INTO notifications (user_id, type, title, message, data)
               VALUES ($1, $2, $3, $4, $5)`,
              [
                participantId,
                'message',
                'New Message',
                `${user.username} sent you a message`,
                { conversationId, messageId: message.id }
              ]
            );

            // Emit to recipient
            io.to(`user:${participantId}`).emit('message:receive', messageData);
          }
        });
      }

      // Confirm message sent
      socket.emit('message:sent', messageData);

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('message:typing', async (data) => {
    try {
      const { conversationId } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) return;

      // Check if user is part of conversation
      const conversationResult = await pool.query(
        'SELECT participants FROM conversations WHERE id = $1 AND $2 = ANY(participants)',
        [conversationId, user.userId]
      );

      if (conversationResult.rows.length === 0) return;

      const participants = conversationResult.rows[0].participants;
      
      // Emit typing indicator to other participants
      participants.forEach(participantId => {
        if (participantId !== user.userId) {
          io.to(`user:${participantId}`).emit('message:typing', {
            conversationId,
            userId: user.userId,
            username: user.username
          });
        }
      });

    } catch (error) {
      console.error('Typing indicator error:', error);
    }
  });

  socket.on('message:stop-typing', async (data) => {
    try {
      const { conversationId } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) return;

      // Check if user is part of conversation
      const conversationResult = await pool.query(
        'SELECT participants FROM conversations WHERE id = $1 AND $2 = ANY(participants)',
        [conversationId, user.userId]
      );

      if (conversationResult.rows.length === 0) return;

      const participants = conversationResult.rows[0].participants;
      
      // Emit stop typing to other participants
      participants.forEach(participantId => {
        if (participantId !== user.userId) {
          io.to(`user:${participantId}`).emit('message:stop-typing', {
            conversationId,
            userId: user.userId
          });
        }
      });

    } catch (error) {
      console.error('Stop typing error:', error);
    }
  });

  // Handle friend requests
  socket.on('friend:request', async (data) => {
    try {
      const { toUserId, message } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Create friend request
      const requestResult = await pool.query(
        `INSERT INTO friend_requests (from_user_id, to_user_id, message)
         VALUES ($1, $2, $3)
         RETURNING id, created_at`,
        [user.userId, toUserId, message]
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
          `${user.username} sent you a friend request`,
          { requestId: request.id, fromUserId: user.userId }
        ]
      );

      // Emit to recipient
      io.to(`user:${toUserId}`).emit('friend:request', {
        id: request.id,
        message: message,
        createdAt: request.created_at,
        fromUser: {
          id: user.userId,
          username: user.username,
          avatar: user.avatar
        }
      });

      socket.emit('friend:request:sent', { requestId: request.id });

    } catch (error) {
      console.error('Friend request error:', error);
      socket.emit('error', { message: 'Failed to send friend request' });
    }
  });

  // Handle friend request responses
  socket.on('friend:accept', async (data) => {
    try {
      const { requestId } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Get friend request
      const requestResult = await pool.query(
        `SELECT fr.*, u.username as from_username
         FROM friend_requests fr
         JOIN users u ON fr.from_user_id = u.id
         WHERE fr.id = $1 AND fr.to_user_id = $2 AND fr.status = 'pending'`,
        [requestId, user.userId]
      );

      if (requestResult.rows.length === 0) {
        socket.emit('error', { message: 'Friend request not found' });
        return;
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
          `${user.username} accepted your friend request`,
          { userId: user.userId }
        ]
      );

      // Emit to both users
      io.to(`user:${request.from_user_id}`).emit('friend:accept', {
        id: requestId,
        friend: {
          id: user.userId,
          username: user.username,
          avatar: user.avatar
        }
      });

      socket.emit('friend:accept:confirmed', { requestId });

    } catch (error) {
      console.error('Accept friend request error:', error);
      socket.emit('error', { message: 'Failed to accept friend request' });
    }
  });

  socket.on('friend:reject', async (data) => {
    try {
      const { requestId } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Update request status
      const result = await pool.query(
        'UPDATE friend_requests SET status = $1 WHERE id = $2 AND to_user_id = $3 AND status = $4',
        ['rejected', requestId, user.userId, 'pending']
      );

      if (result.rowCount === 0) {
        socket.emit('error', { message: 'Friend request not found' });
        return;
      }

      socket.emit('friend:reject:confirmed', { requestId });

    } catch (error) {
      console.error('Reject friend request error:', error);
      socket.emit('error', { message: 'Failed to reject friend request' });
    }
  });

  // Handle status updates
  socket.on('status:update', async (data) => {
    try {
      const { status } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) return;

      if (!['online', 'offline', 'away', 'busy'].includes(status)) {
        socket.emit('error', { message: 'Invalid status' });
        return;
      }

      // Update user status
      await pool.query(
        'UPDATE users SET status = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2',
        [status, user.userId]
      );

      // Notify friends about status change
      const friendsResult = await pool.query(
        `SELECT DISTINCT 
          CASE 
            WHEN f.user_id = $1 THEN f.friend_id 
            ELSE f.user_id 
          END as friend_id
         FROM friendships f
         WHERE f.status = 'accepted' 
           AND (f.user_id = $1 OR f.friend_id = $1)`,
        [user.userId]
      );

      friendsResult.rows.forEach(friend => {
        io.to(`user:${friend.friend_id}`).emit('friend:status', {
          userId: user.userId,
          status: status
        });
      });

    } catch (error) {
      console.error('Status update error:', error);
      socket.emit('error', { message: 'Failed to update status' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    try {
      const user = connectedUsers.get(socket.id);
      
      if (user) {
        console.log(`🔌 User disconnected: ${user.username} (${user.userId})`);

        // Update user status to offline
        await pool.query(
          'UPDATE users SET status = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2',
          ['offline', user.userId]
        );

        // Notify friends about status change
        const friendsResult = await pool.query(
          `SELECT DISTINCT 
            CASE 
              WHEN f.user_id = $1 THEN f.friend_id 
              ELSE f.user_id 
            END as friend_id
           FROM friendships f
           WHERE f.status = 'accepted' 
             AND (f.user_id = $1 OR f.friend_id = $1)`,
          [user.userId]
        );

        friendsResult.rows.forEach(friend => {
          io.to(`user:${friend.friend_id}`).emit('friend:status', {
            userId: user.userId,
            status: 'offline'
          });
        });

        // Remove from connected users
        connectedUsers.delete(socket.id);
      }

    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
};

module.exports = { handleSocketConnection };