const moment = require('moment');

class BirthdayService {
    constructor(gameDB) {
        this.gameDB = gameDB;
    }

    async getUpcomingBirthdays() {
        try {
            const games = await this.gameDB.getAllGames();
            const upcomingBirthdays = [];
            const now = moment();
            
            for (const game of games) {
                if (game.release_date) {
                    const releaseDate = moment(game.release_date);
                    const nextBirthday = moment(releaseDate).year(now.year());
                    
                    // If this year's birthday has passed, check next year
                    if (nextBirthday.isBefore(now)) {
                        nextBirthday.add(1, 'year');
                    }
                    
                    // Check if birthday is within the next 30 days
                    const daysUntilBirthday = nextBirthday.diff(now, 'days');
                    if (daysUntilBirthday <= 30 && daysUntilBirthday >= 0) {
                        upcomingBirthdays.push({
                            gameId: game.id,
                            gameName: game.name,
                            releaseDate: game.release_date,
                            nextBirthday: nextBirthday.format('YYYY-MM-DD'),
                            daysUntil: daysUntilBirthday,
                            age: nextBirthday.year() - releaseDate.year()
                        });
                    }
                }
            }
            
            return upcomingBirthdays.sort((a, b) => a.daysUntil - b.daysUntil);
        } catch (error) {
            console.error('Error getting upcoming birthdays:', error);
            return [];
        }
    }

    async createBirthdayFromGame(game) {
        const releaseDate = moment(game.release_date);
        const now = moment();
        const nextBirthday = moment(releaseDate).year(now.year());
        
        if (nextBirthday.isBefore(now)) {
            nextBirthday.add(1, 'year');
        }
        
        return {
            gameId: game.id,
            gameName: game.name,
            releaseDate: game.release_date,
            nextBirthday: nextBirthday.format('YYYY-MM-DD'),
            daysUntil: nextBirthday.diff(now, 'days'),
            age: nextBirthday.year() - releaseDate.year()
        };
    }
}

module.exports = BirthdayService;