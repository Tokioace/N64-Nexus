class EventService {
    constructor() {
        this.events = [];
    }

    async createBirthdayEvent(birthday) {
        const event = {
            id: Date.now(),
            type: 'birthday',
            title: `${birthday.gameName} Geburtstagsfeier`,
            description: `Feiere mit uns den ${birthday.age}. Geburtstag von ${birthday.gameName}!`,
            gameId: birthday.gameId,
            gameName: birthday.gameName,
            age: birthday.age,
            startDate: birthday.nextBirthday,
            endDate: birthday.nextBirthday,
            created_at: new Date().toISOString()
        };
        
        this.events.push(event);
        return event;
    }

    async getAllEvents() {
        return this.events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
}

module.exports = EventService;