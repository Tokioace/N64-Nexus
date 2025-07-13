const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log(`🎮 User connected: ${socket.id}`);
    
    // Join team room
    socket.on('join-team', (data) => {
      const { teamId, userId, userName } = data;
      socket.join(`team-${teamId}`);
      
      // Notify team members
      socket.to(`team-${teamId}`).emit('member-joined', {
        userId,
        userName,
        timestamp: new Date().toISOString()
      });
      
      console.log(`👥 ${userName} joined team ${teamId}`);
    });
    
    // Leave team room
    socket.on('leave-team', (data) => {
      const { teamId, userId, userName } = data;
      socket.leave(`team-${teamId}`);
      
      // Notify team members
      socket.to(`team-${teamId}`).emit('member-left', {
        userId,
        userName,
        timestamp: new Date().toISOString()
      });
      
      console.log(`👋 ${userName} left team ${teamId}`);
    });
    
    // Team chat message
    socket.on('team-message', (data) => {
      const { teamId, userId, userName, message } = data;
      
      const chatMessage = {
        id: Date.now().toString(),
        userId,
        userName,
        message,
        timestamp: new Date().toISOString()
      };
      
      // Broadcast to team room
      io.to(`team-${teamId}`).emit('team-message', chatMessage);
      
      console.log(`💬 Team ${teamId}: ${userName}: ${message}`);
    });
    
    // Time submission update
    socket.on('time-submitted', (data) => {
      const { teamId, eventId, userId, userName, time, teamTotal } = data;
      
      const submission = {
        userId,
        userName,
        time,
        teamTotal,
        timestamp: new Date().toISOString()
      };
      
      // Notify team members
      socket.to(`team-${teamId}`).emit('time-submitted', submission);
      
      // Update live rankings for the event
      io.to(`event-${eventId}`).emit('rankings-updated', {
        eventId,
        timestamp: new Date().toISOString()
      });
      
      console.log(`⏱️ ${userName} submitted time: ${time}s (Team total: ${teamTotal}s)`);
    });
    
    // Join event room for live updates
    socket.on('join-event', (data) => {
      const { eventId } = data;
      socket.join(`event-${eventId}`);
      console.log(`🏁 User joined event ${eventId}`);
    });
    
    // Leave event room
    socket.on('leave-event', (data) => {
      const { eventId } = data;
      socket.leave(`event-${eventId}`);
      console.log(`🏁 User left event ${eventId}`);
    });
    
    // Team status update
    socket.on('team-status-update', (data) => {
      const { teamId, status, message } = data;
      
      const statusUpdate = {
        status,
        message,
        timestamp: new Date().toISOString()
      };
      
      // Notify team members
      io.to(`team-${teamId}`).emit('team-status-update', statusUpdate);
      
      console.log(`📊 Team ${teamId} status: ${status} - ${message}`);
    });
    
    // Motivational message
    socket.on('send-motivation', (data) => {
      const { teamId, message, type } = data;
      
      const motivation = {
        type: type || 'general',
        message,
        timestamp: new Date().toISOString()
      };
      
      // Notify team members
      io.to(`team-${teamId}`).emit('motivation', motivation);
      
      console.log(`💪 Team ${teamId} motivation: ${message}`);
    });
    
    // Event start notification
    socket.on('event-started', (data) => {
      const { eventId, eventName } = data;
      
      io.to(`event-${eventId}`).emit('event-started', {
        eventId,
        eventName,
        timestamp: new Date().toISOString()
      });
      
      console.log(`🚀 Event ${eventId} (${eventName}) has started!`);
    });
    
    // Event end notification
    socket.on('event-ended', (data) => {
      const { eventId, eventName, finalRankings } = data;
      
      io.to(`event-${eventId}`).emit('event-ended', {
        eventId,
        eventName,
        finalRankings,
        timestamp: new Date().toISOString()
      });
      
      console.log(`🏆 Event ${eventId} (${eventName}) has ended!`);
    });
    
    // Achievement unlocked
    socket.on('achievement-unlocked', (data) => {
      const { userId, userName, achievement } = data;
      
      const achievementNotification = {
        userId,
        userName,
        achievement,
        timestamp: new Date().toISOString()
      };
      
      // Broadcast to all connected users
      io.emit('achievement-unlocked', achievementNotification);
      
      console.log(`🏅 ${userName} unlocked: ${achievement.name}`);
    });
    
    // Disconnect handling
    socket.on('disconnect', () => {
      console.log(`👋 User disconnected: ${socket.id}`);
    });
  });
  
  // Helper function to send motivational messages
  const sendMotivationalMessage = (teamId, submissions, totalMembers) => {
    const remaining = totalMembers - submissions.length;
    
    let message = '';
    let type = 'info';
    
    if (remaining === 0) {
      message = '🎉 Alle Zeiten eingereicht! Ihr seid ein fantastisches Team!';
      type = 'success';
    } else if (remaining === 1) {
      message = '🔥 Nur noch 1 Teammitglied fehlt! Ihr schafft das!';
      type = 'warning';
    } else if (remaining <= 2) {
      message = `⚡ Noch ${remaining} Teammitglieder fehlen! Bleibt dran!`;
      type = 'warning';
    } else {
      message = `🏃‍♂️ ${remaining} Teammitglieder haben noch nicht eingereicht. Ihr seid auf einem guten Weg!`;
      type = 'info';
    }
    
    io.to(`team-${teamId}`).emit('motivation', {
      type,
      message,
      timestamp: new Date().toISOString()
    });
  };
  
  // Export helper function
  return { sendMotivationalMessage };
};

module.exports = { handleSocketConnection };