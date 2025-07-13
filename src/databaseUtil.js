const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseUtil {
    constructor() {
        this.dbPath = path.join(__dirname, '..', 'data', 'n64nexus.db');
        this.initializeDatabase();
    }
    
    initializeDatabase() {
        const db = new sqlite3.Database(this.dbPath);
        
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                developer TEXT,
                year INTEGER,
                genre TEXT,
                added_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
        });
        
        // Fixed: Properly close database connection after initialization
        db.close((err) => {
            if (err) {
                console.error('Error closing database after initialization:', err);
            }
        });
    }
    
    async getUser(username) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            // Fixed: Use parameterized query to prevent SQL injection
            const query = `SELECT * FROM users WHERE username = ?`;
            
            db.get(query, [username], (err, row) => {
                // Fixed: Properly close database connection
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                });
                
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    async createUser(username, hashedPassword, email) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
            
            db.run(query, [username, hashedPassword, email], function(err) {
                const lastID = this.lastID;
                
                // Fixed: Properly close database connection
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                });
                
                if (err) {
                    reject(err);
                } else {
                    resolve(lastID);
                }
            });
        });
    }
    
    async getAllGames() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            const query = `SELECT * FROM games ORDER BY title`;
            
            db.all(query, (err, rows) => {
                // Fixed: Properly close database connection
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                });
                
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    async addGame(game) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            const query = `INSERT INTO games (title, developer, year, genre) VALUES (?, ?, ?, ?)`;
            
            db.run(query, [game.title, game.developer, game.year, game.genre], function(err) {
                const lastID = this.lastID;
                
                // Fixed: Properly close database connection
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                });
                
                if (err) {
                    reject(err);
                } else {
                    resolve(lastID);
                }
            });
        });
    }
    
    async searchGames(searchTerm) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            
            const query = `SELECT * FROM games WHERE title LIKE ? OR developer LIKE ? OR genre LIKE ?`;
            const searchPattern = `%${searchTerm}%`;
            
            db.all(query, [searchPattern, searchPattern, searchPattern], (err, rows) => {
                // Fixed: Properly close database connection
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr);
                    }
                });
                
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = DatabaseUtil;