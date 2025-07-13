import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init';
import { authenticateToken } from './auth';
import { Game, GameFilter, GameWithStats } from '../types';

const router = express.Router();

// Get all games with optional filtering
router.get('/', (req, res) => {
  try {
    const {
      genre,
      region,
      year,
      minRating,
      maxRating,
      sortBy = 'title',
      sortOrder = 'asc',
      search,
      page = 1,
      limit = 20
    } = req.query;

    const db = getDatabase();
    let query = `
      SELECT 
        g.*,
        COALESCE(AVG(r.overall), 0) as averageRating,
        COUNT(DISTINCT r.id) as totalRatings,
        COUNT(DISTINCT c.id) as totalCollections
      FROM games g
      LEFT JOIN ratings r ON g.id = r.gameId
      LEFT JOIN collections c ON g.id = c.gameId
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    if (genre) {
      conditions.push('g.genre = ?');
      params.push(genre);
    }

    if (region) {
      conditions.push('g.region = ?');
      params.push(region);
    }

    if (year) {
      conditions.push('g.releaseYear = ?');
      params.push(year);
    }

    if (search) {
      conditions.push('(g.title LIKE ? OR g.developer LIKE ? OR g.publisher LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY g.id';

    if (minRating) {
      query += ' HAVING averageRating >= ?';
      params.push(minRating);
    }

    if (maxRating) {
      query += ' HAVING averageRating <= ?';
      params.push(maxRating);
    }

    // Sorting
    const sortColumn = sortBy === 'rating' ? 'averageRating' : 
                      sortBy === 'year' ? 'g.releaseYear' : 
                      sortBy === 'mostCollected' ? 'totalCollections' : 'g.title';
    
    query += ` ORDER BY ${sortColumn} ${sortOrder.toUpperCase()}`;

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    db.all(query, params, (err, games: GameWithStats[]) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM games g';
      if (conditions.length > 0) {
        countQuery += ' WHERE ' + conditions.join(' AND ');
      }

      db.get(countQuery, params.slice(0, -2), (err, result: any) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({
          games,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: result.total,
            pages: Math.ceil(result.total / Number(limit))
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single game by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const query = `
      SELECT 
        g.*,
        COALESCE(AVG(r.overall), 0) as averageRating,
        COUNT(DISTINCT r.id) as totalRatings,
        COUNT(DISTINCT c.id) as totalCollections
      FROM games g
      LEFT JOIN ratings r ON g.id = r.gameId
      LEFT JOIN collections c ON g.id = c.gameId
      WHERE g.id = ?
      GROUP BY g.id
    `;

    db.get(query, [id], (err, game: GameWithStats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json({ game });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new game (admin only)
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      title,
      region,
      developer,
      publisher,
      releaseYear,
      genre,
      coverImage,
      description,
      isCustom = false
    } = req.body;

    if (!title || !region || !developer || !publisher || !releaseYear || !genre) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getDatabase();
    const gameId = uuidv4();

    db.run(
      `INSERT INTO games (id, title, region, developer, publisher, releaseYear, genre, coverImage, description, isCustom)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [gameId, title, region, developer, publisher, releaseYear, genre, coverImage, description, isCustom],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create game' });
        }

        res.status(201).json({
          message: 'Game created successfully',
          gameId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update game (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      region,
      developer,
      publisher,
      releaseYear,
      genre,
      coverImage,
      description
    } = req.body;

    const db = getDatabase();

    db.run(
      `UPDATE games 
       SET title = ?, region = ?, developer = ?, publisher = ?, releaseYear = ?, 
           genre = ?, coverImage = ?, description = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, region, developer, publisher, releaseYear, genre, coverImage, description, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update game' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Game not found' });
        }

        res.json({ message: 'Game updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete game (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    db.run('DELETE FROM games WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete game' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json({ message: 'Game deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get game statistics
router.get('/:id/stats', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const query = `
      SELECT 
        COUNT(DISTINCT r.id) as totalRatings,
        COALESCE(AVG(r.gameplay), 0) as avgGameplay,
        COALESCE(AVG(r.graphics), 0) as avgGraphics,
        COALESCE(AVG(r.music), 0) as avgMusic,
        COALESCE(AVG(r.nostalgia), 0) as avgNostalgia,
        COALESCE(AVG(r.overall), 0) as avgOverall,
        COUNT(DISTINCT c.id) as totalCollections,
        SUM(CASE WHEN c.status = 'owned' THEN 1 ELSE 0 END) as ownedCount,
        SUM(CASE WHEN c.status = 'wanted' THEN 1 ELSE 0 END) as wantedCount
      FROM games g
      LEFT JOIN ratings r ON g.id = r.gameId
      LEFT JOIN collections c ON g.id = c.gameId
      WHERE g.id = ?
    `;

    db.get(query, [id], (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ stats });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get genres list
router.get('/genres/list', (req, res) => {
  try {
    const db = getDatabase();

    db.all('SELECT DISTINCT genre FROM games ORDER BY genre', (err, genres) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ genres: genres.map(g => g.genre) });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;