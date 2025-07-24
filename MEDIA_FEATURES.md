# 📹 Media & Speedrun Features

## Overview
The restored Media/Speedrun Media functionality allows users to upload, share, and stream their gaming content while earning points through the integrated points system.

## Features

### 🎮 Media Upload
- **Speedrun Videos** (+50 points)
- **Screenshots** (+25 points) 
- **Achievement Screenshots** (+30 points)
- File upload support (MP4, WebM, JPG, PNG up to 100MB)
- External URL support (YouTube, Twitch, etc.)
- **Event Association**: Link uploads to specific events
- **Persistent Storage**: All uploads stored with timestamps

### 📡 Live Streaming
- **Stream Integration** (+50 points for starting a stream)
- Real-time stream status indicator
- Stream metadata (title, game, description)
- Support for major streaming platforms

### 🏆 Points System Integration
Points are automatically awarded when users:
- Upload speedrun videos: **50 points**
- Upload screenshots: **25 points**
- Upload achievement screenshots: **30 points**
- Start a live stream: **50 points**

### 🔍 Media Discovery
- **Filter by Type**: Speedruns, Screenshots, Achievements
- **Filter by Game**: All supported N64 games
- **Search**: Title, description, and tag search
- **Verification System**: Verified content marked with checkmarks

### 📊 Statistics Dashboard
- Total speedruns count
- Total screenshots count
- Total achievements count
- Total community views

### 📅 User Media History
- **Personal Upload History**: View all your uploads chronologically
- **Event Tracking**: See which uploads were for specific events
- **Upload Dates**: Precise timestamps for every upload
- **Performance Metrics**: Views, likes, and verification status
- **Filtering & Sorting**: Filter by type, sort by date/popularity

## Technical Implementation

### Points System
```typescript
const POINTS_CONFIG = {
  'media.speedrun': 50,
  'media.screenshot': 25, 
  'media.achievement': 30,
  'media.stream': 50
}
```

### Media Types
```typescript
interface MediaMeta {
  id: string
  userId: string
  username: string
  gameId: string
  gameName: string
  type: 'speedrun' | 'screenshot' | 'achievement'
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  uploadDate: Date
  verified: boolean
  likes: number
  views: number
  tags: string[]
}
```

### Context Integration
- **MediaContext**: Handles media upload, storage, and retrieval with localStorage persistence
- **PointsContext**: Awards points for media activities
- **UserContext**: Links media to user accounts
- **EventContext**: Provides event data for upload association

### Storage System
- **LocalStorage Persistence**: All media data persists across sessions
- **User-specific Storage**: Individual media histories per user
- **Date Tracking**: Automatic upload timestamp recording
- **Event Association**: Links media to specific events when uploaded

## User Experience

### Upload Flow
1. User clicks "Media hochladen" button
2. Fills out upload form (title, type, game, description, tags)
3. Chooses upload method (file upload or URL)
4. Submits and receives points notification
5. Media appears in community feed

### Streaming Flow
1. User clicks "Live Stream starten" button
2. Stream interface appears with live indicator
3. User enters stream details (title, game, URL, description)
4. Clicks "Stream Daten speichern" to earn points
5. Stream remains active until manually stopped

### Discovery Flow
1. Users browse media grid with filters
2. Click on media cards to view details
3. Can like media (with login requirement)
4. View full media information in modal

## Authentication
- Login required for all upload/streaming activities
- Anonymous users can browse but cannot interact
- Clear login prompts and redirects

## Responsive Design
- Mobile-optimized upload modals
- Touch-friendly media cards
- Responsive grid layout
- Swipe-friendly interfaces

## Future Enhancements
- Video playback integration
- Live stream embedding
- Advanced search filters
- Media collections/playlists
- Community voting system
- Leaderboards for most viewed content

## German Localization
All UI elements are properly localized with German translations:
- Upload forms and buttons
- Point notifications
- Success/error messages
- Media type labels
- Filter options

This implementation restores the full Media functionality that was previously available, enhanced with modern UX patterns and deep integration with the points system.