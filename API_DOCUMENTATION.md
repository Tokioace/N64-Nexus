# Battle64 Achievement System API Documentation

## Overview

The Battle64 Achievement System provides a comprehensive gamification platform for retro gaming enthusiasts. This API allows you to manage user achievements, rankings, collections, and more.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Achievements

#### Get All Achievements
```http
GET /achievements
```

**Query Parameters:**
- `category` (optional): Filter by category (`collection`, `quiz`, `event`, `social`, `special`)
- `rarity` (optional): Filter by rarity (`common`, `uncommon`, `rare`, `epic`, `legendary`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "first_game",
      "name": "First Steps",
      "description": "Add your first game to your collection",
      "icon": "🎮",
      "category": "collection",
      "rarity": "common",
      "points": 50,
      "requirements": { "gamesCollected": 1 }
    }
  ]
}
```

#### Get Rare Achievements
```http
GET /achievements/rare
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "level_50",
      "name": "Level 50 Reached",
      "description": "Reach level 50",
      "icon": "🌟🌟🌟",
      "category": "special",
      "rarity": "legendary",
      "points": 1000
    }
  ]
}
```

#### Get User Achievement Progress
```http
GET /achievements/progress/:userId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unlocked": 15,
    "total": 25,
    "percentage": 60,
    "byCategory": {
      "collection": { "unlocked": 5, "total": 8 },
      "quiz": { "unlocked": 4, "total": 6 },
      "special": { "unlocked": 6, "total": 11 }
    },
    "byRarity": {
      "common": { "unlocked": 8, "total": 10 },
      "uncommon": { "unlocked": 4, "total": 8 },
      "rare": { "unlocked": 3, "total": 5 },
      "epic": { "unlocked": 0, "total": 2 }
    }
  }
}
```

#### Get User Achievements
```http
GET /achievements/user/:userId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "retro_gamer",
    "badges": [
      {
        "id": "first_game",
        "name": "First Steps",
        "description": "Add your first game to your collection",
        "icon": "🎮",
        "unlockedAt": "2024-01-15T10:30:00.000Z",
        "category": "collection"
      }
    ]
  }
}
```

### Daily Login

#### Claim Daily Login Reward
```http
POST /achievements/daily-login
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "levelUp": {
      "oldLevel": 5,
      "newLevel": 6,
      "leveledUp": true
    },
    "unlockedAchievements": [],
    "currentLevel": 6,
    "currentPoints": 3000,
    "experienceToNext": 200,
    "levelProgress": 60,
    "consecutiveLogins": 7,
    "totalLogins": 25
  }
}
```

### Collections

#### Add Game to Collection
```http
POST /achievements/add-game
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "gameId": "507f1f77bcf86cd799439011",
  "condition": "excellent"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "levelUp": {
      "oldLevel": 3,
      "newLevel": 3,
      "leveledUp": false
    },
    "unlockedAchievements": [
      {
        "achievement": {
          "id": "first_game",
          "name": "First Steps",
          "points": 50
        },
        "levelUp": {
          "oldLevel": 3,
          "newLevel": 3,
          "leveledUp": false
        },
        "pointsEarned": 50
      }
    ],
    "currentLevel": 3,
    "currentPoints": 150,
    "experienceToNext": 350,
    "levelProgress": 30,
    "game": {
      "title": "Super Mario 64",
      "genre": "Platformer",
      "points": 100
    },
    "collectionSize": 1
  }
}
```

### Quizzes

#### Complete Quiz
```http
POST /achievements/quiz-complete
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "score": 85,
  "timeSeconds": 45
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "levelUp": {
      "oldLevel": 4,
      "newLevel": 4,
      "leveledUp": false
    },
    "unlockedAchievements": [],
    "currentLevel": 4,
    "currentPoints": 2000,
    "experienceToNext": 0,
    "levelProgress": 100,
    "score": 85,
    "timeSeconds": 45,
    "basePoints": 80,
    "timeBonus": 0,
    "perfectBonus": 0,
    "totalPoints": 80
  }
}
```

### Leaderboards

#### Get Leaderboard
```http
GET /achievements/leaderboard
```

**Query Parameters:**
- `type` (optional): Leaderboard type (`level`, `achievements`, `collection`, `points`) - default: `level`
- `limit` (optional): Number of results - default: 10

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "level",
    "leaderboard": [
      {
        "rank": 1,
        "username": "n64_collector",
        "displayName": "N64 Collector",
        "avatar": "/avatars/collector.png",
        "level": 25,
        "totalPoints": 12500,
        "currentTitle": "Nintendo Master",
        "achievementsCount": 18,
        "gamesCollected": 120
      }
    ]
  }
}
```

### User Rankings

#### Get User Ranking Information
```http
GET /achievements/user/:userId/ranking
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "level": 15,
    "experience": 7500,
    "totalPoints": 7500,
    "currentTitle": "Retro Warrior",
    "unlockedTitles": ["Newcomer", "Cartridge Kid", "Pixel Hero", "64-Bit General", "Retro Warrior"],
    "rank": "Bronze",
    "experienceToNext": 0,
    "levelProgress": 100,
    "globalRank": 3,
    "achievementsCount": 12,
    "stats": {
      "gamesCollected": 45,
      "quizzesCompleted": 25,
      "eventsParticipated": 3,
      "daysLoggedIn": 30,
      "perfectScores": 5,
      "collectionSets": 2
    }
  }
}
```

#### Change User Title
```http
PUT /achievements/user/title
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Retro Warrior"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentTitle": "Retro Warrior",
    "unlockedTitles": ["Newcomer", "Cartridge Kid", "Pixel Hero", "64-Bit General", "Retro Warrior"]
  }
}
```

### Statistics

#### Get Global Statistics
```http
GET /achievements/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalAchievements": 25,
    "averageLevel": 8,
    "mostUnlockedAchievement": {
      "_id": "first_game",
      "count": 142
    }
  }
}
```

## Achievement Categories

### Collection Achievements
- **First Steps**: Add your first game (50 points)
- **Growing Collection**: Collect 10 games (100 points)
- **Serious Collector**: Collect 50 games (250 points)
- **Century Club**: Collect 100 games (500 points)
- **Full Set Freak**: Complete a genre collection (300 points)
- **Mint Condition**: Add a mint condition game (150 points)

### Quiz Achievements
- **Quiz Newbie**: Complete first quiz (25 points)
- **Quiz Enthusiast**: Complete 10 quizzes (100 points)
- **Quiz Master**: Complete 50 quizzes (250 points)
- **Trivia Champ**: Complete 100 quizzes (500 points)
- **Perfect Score**: Get 100% on any quiz (200 points)
- **Speed Demon**: Complete quiz under 30 seconds (300 points)

### Event Achievements
- **Event Participant**: Join first event (50 points)
- **Event Champion**: Win first place (400 points)
- **Top 3 Finisher**: Finish in top 3 (300 points)
- **Event Regular**: Participate in 10 events (200 points)

### Social Achievements
- **Social Butterfly**: Add first friend (50 points)
- **Friend Network**: Add 10 friends (150 points)
- **Profile Complete**: Complete profile with bio and avatar (75 points)

### Special Achievements
- **Week Warrior**: 7 consecutive logins (150 points)
- **Monthly Master**: 30 consecutive logins (400 points)
- **Century Streak**: 100 consecutive logins (1000 points)
- **Early Adopter**: Join during beta (200 points)
- **Level 10/25/50 Reached**: Level milestones (200-1000 points)

## Title System

Titles are automatically unlocked at specific levels:

| Level | Title |
|-------|-------|
| 1 | Cartridge Kid |
| 5 | Pixel Hero |
| 10 | 64-Bit General |
| 15 | Retro Warrior |
| 20 | Legend of Retro |
| 25 | Nintendo Master |
| 30 | Collector Supreme |
| 35 | Retro Champion |
| 40 | Ultra64 Mastermind |
| 50 | Retro God |

## Points System

### Point Sources
- **Daily Login**: 25 points (base) + consecutive bonus
- **Game Collection**: 50-150 points per game (based on rarity)
- **Quiz Completion**: 10-100 points (based on score) + bonuses
- **Achievement Unlock**: Varies by achievement (25-1000 points)
- **Event Participation**: 50-400 points (based on performance)

### Level Progression
- **Points per Level**: 500
- **Formula**: Level = Math.floor(Experience / 500) + 1
- **Progress**: Percentage within current level

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Username is required", "Email must be valid"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information included in response headers

## Development

### Setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Start MongoDB
4. Seed database: `node src/utils/seeder.js`
5. Start server: `npm run server`

### Testing
```bash
npm test
```

### Database Seeding
```bash
node src/utils/seeder.js
```

This will create:
- 25+ predefined achievements
- 5 classic N64 games
- 3 sample users with different achievement levels
- Sample collections and achievements for each user