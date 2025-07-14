class NewsfeedService {
    constructor() {
        this.posts = [];
    }

    async createBirthdayPost(birthday) {
        const post = {
            id: Date.now(),
            type: 'birthday',
            title: `🎂 ${birthday.gameName} wird ${birthday.age} Jahre alt!`,
            content: `${birthday.gameName} feiert am ${birthday.nextBirthday} seinen ${birthday.age}. Geburtstag!`,
            gameId: birthday.gameId,
            gameName: birthday.gameName,
            age: birthday.age,
            nextBirthday: birthday.nextBirthday,
            created_at: new Date().toISOString()
        };
        
        this.posts.push(post);
        return post;
    }

    async getAllPosts() {
        return this.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
}

module.exports = NewsfeedService;