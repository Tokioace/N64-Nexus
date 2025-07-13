import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/battle64.db');

export function initializeDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log('Connected to SQLite database');
      
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');
      
      // Create tables
      db.serialize(() => {
        // Users table
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL,
            points INTEGER DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Games table
        db.run(`
          CREATE TABLE IF NOT EXISTS games (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            region TEXT CHECK(region IN ('PAL', 'NTSC', 'NTSC-J')) NOT NULL,
            developer TEXT NOT NULL,
            publisher TEXT NOT NULL,
            releaseYear INTEGER NOT NULL,
            genre TEXT NOT NULL,
            coverImage TEXT,
            description TEXT,
            isCustom BOOLEAN DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Ratings table
        db.run(`
          CREATE TABLE IF NOT EXISTS ratings (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            gameId TEXT NOT NULL,
            gameplay INTEGER CHECK(gameplay >= 1 AND gameplay <= 5) NOT NULL,
            graphics INTEGER CHECK(graphics >= 1 AND graphics <= 5) NOT NULL,
            music INTEGER CHECK(music >= 1 AND music <= 5) NOT NULL,
            nostalgia INTEGER CHECK(nostalgia >= 1 AND nostalgia <= 5) NOT NULL,
            overall REAL NOT NULL,
            comment TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE CASCADE,
            UNIQUE(userId, gameId)
          )
        `);

        // Collections table
        db.run(`
          CREATE TABLE IF NOT EXISTS collections (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            gameId TEXT NOT NULL,
            status TEXT CHECK(status IN ('owned', 'wanted', 'traded')) NOT NULL,
            condition TEXT CHECK(condition IN ('loose', 'complete', 'sealed')),
            hasManual BOOLEAN DEFAULT 0,
            hasBox BOOLEAN DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE CASCADE,
            UNIQUE(userId, gameId)
          )
        `);

        // Reviews table
        db.run(`
          CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            gameId TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE CASCADE
          )
        `);

        // Review likes table
        db.run(`
          CREATE TABLE IF NOT EXISTS review_likes (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            reviewId TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (reviewId) REFERENCES reviews (id) ON DELETE CASCADE,
            UNIQUE(userId, reviewId)
          )
        `);

        // Create indexes for better performance
        db.run('CREATE INDEX IF NOT EXISTS idx_games_title ON games (title)');
        db.run('CREATE INDEX IF NOT EXISTS idx_games_genre ON games (genre)');
        db.run('CREATE INDEX IF NOT EXISTS idx_games_region ON games (region)');
        db.run('CREATE INDEX IF NOT EXISTS idx_games_year ON games (releaseYear)');
        db.run('CREATE INDEX IF NOT EXISTS idx_ratings_gameId ON ratings (gameId)');
        db.run('CREATE INDEX IF NOT EXISTS idx_ratings_userId ON ratings (userId)');
        db.run('CREATE INDEX IF NOT EXISTS idx_collections_userId ON collections (userId)');
        db.run('CREATE INDEX IF NOT EXISTS idx_collections_gameId ON collections (gameId)');
        db.run('CREATE INDEX IF NOT EXISTS idx_reviews_gameId ON reviews (gameId)');

        console.log('Database tables created successfully');
        resolve(db);
      });
    });
  });
}

export function getDatabase(): sqlite3.Database {
  return new sqlite3.Database(dbPath);
}