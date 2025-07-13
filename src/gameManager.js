class GameManager {
    constructor(databaseUtil) {
        this.db = databaseUtil;
        this.gameCache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }
    
    async getAllGames() {
        try {
            const games = await this.db.getAllGames();
            return this.sortGamesByPopularity(games);
        } catch (error) {
            throw new Error('Failed to fetch games: ' + error.message);
        }
    }
    
    async searchGames(query) {
        try {
            const games = await this.db.searchGames(query);
            return this.sortGamesByPopularity(games);
        } catch (error) {
            throw new Error('Failed to search games: ' + error.message);
        }
    }
    
    async addGame(gameData) {
        try {
            // Basic validation
            if (!gameData.title || gameData.title.trim() === '') {
                throw new Error('Game title is required');
            }
            
            if (gameData.year && (gameData.year < 1990 || gameData.year > 2030)) {
                throw new Error('Invalid year');
            }
            
            const gameId = await this.db.addGame(gameData);
            
            // Clear cache when new game is added
            this.gameCache.clear();
            
            return gameId;
        } catch (error) {
            throw new Error('Failed to add game: ' + error.message);
        }
    }
    
    // Fixed: Efficient sorting algorithm using JavaScript's built-in sort (O(n log n))
    sortGamesByPopularity(games) {
        if (!games || games.length === 0) {
            return games;
        }
        
        // Simulate popularity scores (in real app, this would come from user ratings/downloads)
        const gamesWithPopularity = games.map(game => ({
            ...game,
            popularity: this.calculatePopularity(game)
        }));
        
        // Fixed: Use efficient built-in sort method instead of bubble sort
        return gamesWithPopularity.sort((a, b) => b.popularity - a.popularity);
    }
    
    calculatePopularity(game) {
        // Simple popularity calculation based on game attributes
        let score = 0;
        
        // Older games are considered more "classic"
        if (game.year && game.year >= 1996 && game.year <= 2001) {
            score += 50;
        }
        
        // Bonus for certain developers
        const popularDevelopers = ['Nintendo', 'Rare', 'HAL Laboratory', 'Intelligent Systems'];
        if (game.developer && popularDevelopers.includes(game.developer)) {
            score += 30;
        }
        
        // Bonus for certain genres
        const popularGenres = ['Platform', 'Adventure', 'Racing', 'Fighting'];
        if (game.genre && popularGenres.includes(game.genre)) {
            score += 20;
        }
        
        // Add some randomness to simulate user ratings
        score += Math.random() * 100;
        
        return score;
    }
    
    async getGameById(gameId) {
        try {
            // Check cache first
            const cacheKey = `game_${gameId}`;
            const cachedGame = this.gameCache.get(cacheKey);
            
            if (cachedGame && Date.now() - cachedGame.timestamp < this.cacheExpiry) {
                return cachedGame.data;
            }
            
            // If not in cache, fetch from database
            const games = await this.db.getAllGames();
            const game = games.find(g => g.id === gameId);
            
            if (game) {
                // Cache the result
                this.gameCache.set(cacheKey, {
                    data: game,
                    timestamp: Date.now()
                });
            }
            
            return game;
        } catch (error) {
            throw new Error('Failed to fetch game: ' + error.message);
        }
    }
    
    clearCache() {
        this.gameCache.clear();
    }
}

module.exports = GameManager;