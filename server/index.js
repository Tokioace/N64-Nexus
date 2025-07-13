const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Import routes
const teamRoutes = require('./routes/teams');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Socket.IO connection handling
const { handleSocketConnection } = require('./socket/teamSocket');
handleSocketConnection(io);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🏁 Battle64 Gruppen-Speedruns Server running on port ${PORT}`);
  console.log(`🎮 Team Mode ready for action!`);
});