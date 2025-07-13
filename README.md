# Battle64 - N64 Speedrun Event System

🎮 **Battle64** is a comprehensive event system for N64 speedruns and time trials, enabling users to participate in weekly or daily challenges with real-time leaderboards, community features, and competitive scoring.

## 🚀 Features

### Core Functionality
- **Event Management**: Create and manage speedrun events with customizable rules
- **Time Submissions**: Submit times with screenshot verification and OCR processing
- **Live Leaderboards**: Real-time rankings with regional filtering (PAL/NTSC)
- **User Profiles**: Comprehensive stats, achievements, and participation history
- **Point System**: Competitive scoring with bonuses and participation rewards
- **Badge System**: Achievement badges for milestones and consistent participation

### Community Features
- **Live Chat**: Real-time chat during events
- **Live Ticker**: Real-time updates for new submissions and position changes
- **Anonymous Participation**: Option to participate anonymously
- **Regional Support**: PAL/NTSC region filtering and support

### Admin Features
- **Event Creation**: Full event management with custom scoring rules
- **Submission Review**: Approve/reject submissions with admin notes
- **User Management**: Promote admins, manage user accounts
- **Analytics Dashboard**: Comprehensive statistics and overview

### Technical Features
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Real-Time Updates**: Socket.IO integration for live features
- **OCR Processing**: Automatic time detection from screenshots
- **Image Optimization**: Automatic screenshot processing and optimization
- **JWT Authentication**: Secure user authentication and session management

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time features
- **JWT** for authentication
- **Multer** for file uploads
- **Sharp** for image processing
- **Tesseract.js** for OCR

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **React Query** for data fetching and caching
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Framer Motion** for animations

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd battle64-eventsystem
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/battle64
   JWT_SECRET=your-super-secret-jwt-key
   
   # Client Configuration (optional)
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development servers**
   ```bash
   # Start both server and client
   npm run dev
   
   # Or start them separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

## 🏗️ Project Structure

```
battle64-eventsystem/
├── server/                 # Backend server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # File uploads
│   └── index.js           # Server entry point
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── index.js       # App entry point
│   ├── public/            # Static assets
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - Get all events with filtering
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/join` - Join event
- `POST /api/events/:id/leave` - Leave event
- `GET /api/events/:id/leaderboard` - Get event leaderboard

### Submissions
- `POST /api/submissions` - Submit time with screenshot
- `GET /api/submissions/event/:eventId` - Get user submissions
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

### Admin
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `GET /api/admin/submissions/pending` - Get pending submissions
- `POST /api/admin/submissions/:id/approve` - Approve submission
- `POST /api/admin/submissions/:id/reject` - Reject submission

## 🎮 Usage Examples

### Creating an Event (Admin)
```javascript
const eventData = {
  title: "Rainbow Road Race",
  description: "Speed through the iconic Rainbow Road track",
  game: {
    name: "Mario Kart 64",
    stage: "Rainbow Road",
    category: "Any%"
  },
  startTime: "2024-01-15T10:00:00Z",
  endTime: "2024-01-22T10:00:00Z",
  region: "Both",
  screenshotRequired: true,
  maxSubmissions: 3,
  scoring: {
    points: {
      first: 100,
      second: 75,
      third: 50,
      participation: 10
    }
  }
};
```

### Submitting a Time
```javascript
const formData = new FormData();
formData.append('eventId', eventId);
formData.append('timeString', '1:23.456');
formData.append('region', 'PAL');
formData.append('screenshot', screenshotFile);
formData.append('notes', 'Great run!');

await submissionsAPI.create(formData);
```

## 🔧 Configuration

### Event Scoring
Events can be configured with custom scoring rules:
- **Position-based points**: Different points for 1st, 2nd, 3rd place
- **Participation points**: Points for completing the event
- **Time bonuses**: Bonus points for beating time thresholds

### OCR Processing
The system automatically processes screenshots to extract times:
- Supports common time formats (MM:SS.mmm)
- Confidence scoring for accuracy
- Manual review for low-confidence results

### Regional Support
- **PAL**: European/Australian region (50Hz)
- **NTSC**: North American/Japanese region (60Hz)
- **Both**: Universal events

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client
npm run build

# Start production server
npm start
```

### Environment Variables
Set these environment variables for production:
- `MONGODB_URI`: Production MongoDB connection string
- `JWT_SECRET`: Strong secret key for JWT tokens
- `NODE_ENV`: Set to "production"
- `CLIENT_URL`: Frontend URL for CORS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Advanced OCR with machine learning
- [ ] Video submission support
- [ ] Tournament brackets
- [ ] Mobile app (React Native)
- [ ] Discord integration
- [ ] Twitch integration
- [ ] Advanced analytics
- [ ] Multi-language support

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email: support@battle64.com

---

**Battle64** - Where N64 speedrunning meets modern competition! 🏆