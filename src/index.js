const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const GameManager = require('./gameManager');
const DatabaseUtil = require('./databaseUtil');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || (() => {
    throw new Error('JWT_SECRET environment variable is required');
})();

app.use(express.json());

// Initialize database and game manager
const db = new DatabaseUtil();
const gameManager = new GameManager(db);

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.sendStatus(401);
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // BUG 2: No input validation - SQL injection vulnerability
        const user = await db.getUser(username);
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all games endpoint
app.get('/api/games', authenticateToken, async (req, res) => {
    try {
        const games = await gameManager.getAllGames();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// Search games endpoint
app.get('/api/games/search', authenticateToken, async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        
        const games = await gameManager.searchGames(query);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Add new game endpoint
app.post('/api/games', authenticateToken, async (req, res) => {
    try {
        const { title, developer, year, genre } = req.body;
        const gameId = await gameManager.addGame({ title, developer, year, genre });
        res.status(201).json({ id: gameId, message: 'Game added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add game' });
    }
});

app.listen(PORT, () => {
    console.log(`N64-Nexus server running on port ${PORT}`);
});

module.exports = app;