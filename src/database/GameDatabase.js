const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class GameDatabase {
    constructor() {
        this.dbPath = path.join(__dirname, '../../data/games.db');
        this.db = null;
    }

    async initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening games database:', err);
                    reject(err);
                } else {
                    console.log('✅ Games database connected');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const tables = [
            `CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                release_date DATE,
                publisher TEXT,
                developer TEXT,
                genre TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const table of tables) {
            await this.run(table);
        }
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getAllGames() {
        return await this.all('SELECT * FROM games ORDER BY name');
    }

    async getGameById(id) {
        return await this.get('SELECT * FROM games WHERE id = ?', [id]);
    }

    async populateWithN64Games() {
        const n64Games = [
            { name: 'Super Mario 64', release_date: '1996-06-23', publisher: 'Nintendo', developer: 'Nintendo EAD', genre: 'Platformer' },
            { name: 'The Legend of Zelda: Ocarina of Time', release_date: '1998-11-21', publisher: 'Nintendo', developer: 'Nintendo EAD', genre: 'Action-Adventure' },
            { name: 'GoldenEye 007', release_date: '1997-08-25', publisher: 'Nintendo', developer: 'Rare', genre: 'First-Person Shooter' },
            { name: 'Mario Kart 64', release_date: '1996-12-14', publisher: 'Nintendo', developer: 'Nintendo EAD', genre: 'Racing' },
            { name: 'Super Smash Bros.', release_date: '1999-01-21', publisher: 'Nintendo', developer: 'HAL Laboratory', genre: 'Fighting' }
        ];

        for (const game of n64Games) {
            await this.run(
                'INSERT OR IGNORE INTO games (name, release_date, publisher, developer, genre) VALUES (?, ?, ?, ?, ?)',
                [game.name, game.release_date, game.publisher, game.developer, game.genre]
            );
        }
    }
}

module.exports = GameDatabase;