# N64-Nexus - Battle64 Friends & Groups Module

## 👥 Overview
A comprehensive social networking module for Battle64 that enables users to connect through friendships, private messaging, and thematic groups. Built with a retro 90s aesthetic and modern functionality.

## 🔗 Core Features

### 1. Friend System
- Add/remove friends with request system
- Online status and last activity tracking
- Direct profile access shortcuts
- Friend activity feed

### 2. Direct Messaging
- 1:1 encrypted chat with friends
- Image file sharing support
- Quote functionality and emoji support
- 90s-style sound effects
- Report system for abuse

### 3. Groups (Public & Private)
- Create themed groups (Speedrun, Trading, Regional, etc.)
- Role-based permissions (Founder, Admin, Member)
- Group descriptions, game associations, and tags
- Posts, images, polls, and discussions
- Like/comment system for posts

### 4. Group Features
- Internal group events
- Member-only leaderboards
- Quiz and screenshot challenges
- Group competitions and badges

### 5. Security & Privacy
- Public, private (invite-only), and hidden groups
- Group moderation tools
- End-to-end encrypted messaging (optional)
- Privacy controls for profile information

### 6. Rewards System
- Activity-based badges for groups
- XP bonuses for collaborative activities
- Group championships and competitions

## 🛠️ Technical Stack
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Real-time: Socket.io
- Authentication: JWT
- Encryption: End-to-end for messages

## 📱 UI/UX Design
- Retro 90s aesthetic with pixel art
- Tabbed interface: Friends, Groups, Requests, Chat
- 64-bit style group logos and badges
- Responsive design for all devices

## 🚀 Getting Started
```bash
# Install dependencies
npm install

# Set up database
npm run db:setup

# Start development server
npm run dev
```

## 📋 Project Structure
```
src/
├── components/     # React components
├── pages/         # Page components
├── services/      # API services
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript definitions
├── styles/        # CSS/SCSS files
└── assets/        # Images, icons, sounds
```

## 🔐 Security Features
- JWT-based authentication
- End-to-end message encryption
- Rate limiting and abuse prevention
- Privacy controls and data protection
- Report and moderation systems

## 🎮 Gaming Integration
- Game-specific groups and leaderboards
- Collaborative achievements
- Tournament organization
- Community challenges

---

*Built with ❤️ for the retro gaming community*