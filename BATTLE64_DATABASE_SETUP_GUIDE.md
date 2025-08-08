# Battle64 Database Setup Guide 🎮

Complete Supabase database setup for Battle64 - production-ready and GDPR-compliant.

## 📋 Overview

This guide sets up a complete database structure for Battle64 including:

- ✅ **11 Database Tables** with proper relationships and constraints
- ✅ **Row Level Security (RLS)** policies for GDPR compliance
- ✅ **File Storage** with secure upload policies
- ✅ **Real-time Subscriptions** for live features
- ✅ **TypeScript Types** for full type safety
- ✅ **Service Layer** with comprehensive CRUD operations
- ✅ **React Hooks** for data fetching and real-time updates
- ✅ **Test Suite** to verify everything works

## 🚀 Quick Start

### Step 1: Run Database Setup

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the entire contents of `database-setup.sql`
4. Click **Run** to execute the script

### Step 2: Verify Setup

Run the test suite to verify everything is working:

```typescript
import { runDatabaseTests } from './test-database-operations'

// Make sure you're authenticated first
await runDatabaseTests()
```

### Step 3: Start Using the Services

```typescript
import { eventService, speedrunService } from './src/services/dbService'
import { useEvents, useSpeedruns } from './src/hooks/useSupabaseData'

// In your React components
function EventsList() {
  const { data: events, loading, createEvent } = useEvents()
  
  // Your component logic here
}
```

## 📊 Database Schema

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User profiles | Auth integration, points system, verification |
| `events` | Speed running events | Status tracking, creator ownership |
| `speedruns` | Time submissions | Video/screenshot uploads, verification |
| `fanarts` | User artwork | Image storage, community sharing |
| `collections` | Game collections | Wishlist support, condition tracking |

### Community Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `chat_messages` | Real-time chat | Channel support, real-time updates |
| `forum_posts` | Discussion posts | Categories, pinning, locking |
| `forum_comments` | Post replies | Threaded discussions |
| `likes` | Content reactions | Universal like system |
| `reports` | Content moderation | Status tracking, admin review |

### System Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `leaderboard_snapshots` | Historical rankings | Top 3 tracking, event history |
| `personal_records` | Individual PBs | Backward compatibility |

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies for:

- **Public Access**: Events, fanarts, forum content
- **User-Only Access**: Collections, personal records, own profile
- **Creator Access**: Edit/delete own content
- **Privacy Protection**: Private profiles, GDPR compliance

### File Storage Security

The `uploads` bucket has secure policies:

- Users can only access their own folders
- Organized structure: `/{user_id}/{screenshots|videos|fanarts|avatars}/`
- Private by default with signed URLs for access

### GDPR Compliance

- Users control profile visibility (`is_public` flag)
- Cascade deletes protect user data integrity
- Report system for content moderation
- User consent tracking capabilities

## 🛠️ Service Layer

### Available Services

```typescript
import {
  profileService,     // User profiles and settings
  eventService,       // Speed running events
  speedrunService,    // Time submissions and leaderboards
  fanartService,      // Community artwork
  collectionService,  // Game collections and wishlists
  chatService,        // Real-time messaging
  forumService,       // Community discussions
  likeService,        // Content reactions
  reportService,      // Content moderation
  storageService,     // File uploads and management
  statsService        // User and global statistics
} from './src/services/dbService'
```

### Example Usage

```typescript
// Create a new event
const event = await eventService.createEvent({
  title: 'Weekly Mario Kart Championship',
  game: 'Mario Kart 64',
  track: 'Luigi Raceway',
  start_time: '2024-02-01T18:00:00Z',
  end_time: '2024-02-01T20:00:00Z',
  created_by: userId
})

// Submit a speedrun
const speedrun = await speedrunService.createSpeedrun({
  event_id: event.id,
  user_id: userId,
  time_ms: 125000, // 2:05.000
  video_url: 'https://youtube.com/watch?v=...',
  screenshot_url: 'https://...'
})

// Get leaderboard
const leaderboard = await speedrunService.getEventLeaderboard(event.id)
```

## ⚛️ React Hooks

### Available Hooks

```typescript
import {
  useProfile,           // User profile data
  useEvents,           // Events with CRUD operations
  useSpeedruns,        // Speedruns with filtering
  useEventLeaderboard, // Real-time leaderboards
  useFanarts,          // Community artwork
  useCollections,      // User collections
  useChat,             // Real-time chat with subscriptions
  useForumPosts,       // Forum discussions
  useForumComments,    // Post replies
  useLikes,            // Content reactions
  useReports,          // Moderation reports
  useFileUpload,       // File upload utilities
  useUserStats,        // User statistics
  useGlobalStats       // Global platform stats
} from './src/hooks/useSupabaseData'
```

### Example Usage

```typescript
function EventsPage() {
  const { data: events, loading, createEvent } = useEvents('upcoming')
  const { data: leaderboard } = useEventLeaderboard(selectedEventId)
  
  if (loading) return <Loading />
  
  return (
    <div>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

function ChatComponent() {
  const { data: messages, sendMessage } = useChat('general')
  // Real-time updates are handled automatically!
  
  const handleSend = async (text: string) => {
    await sendMessage({
      sender_id: userId,
      message: text,
      channel: 'general'
    })
  }
  
  return <ChatInterface messages={messages} onSend={handleSend} />
}
```

## 📁 File Upload System

### Upload Structure

```
uploads/
├── {user_id}/
│   ├── screenshots/
│   │   ├── speedrun_123.jpg
│   │   └── achievement_456.png
│   ├── videos/
│   │   ├── run_789.mp4
│   │   └── highlight_012.webm
│   ├── fanarts/
│   │   ├── mario_art.jpg
│   │   └── n64_tribute.png
│   └── avatars/
│       └── profile_pic.jpg
```

### Upload Example

```typescript
const { uploadFile, getPublicUrl } = useFileUpload()

// Upload screenshot
const file = event.target.files[0]
const path = `${userId}/screenshots/${Date.now()}_${file.name}`

try {
  const result = await uploadFile('uploads', path, file)
  const publicUrl = getPublicUrl('uploads', result.path)
  
  // Save URL to speedrun record
  await speedrunService.updateSpeedrun(speedrunId, {
    screenshot_url: publicUrl
  })
} catch (error) {
  console.error('Upload failed:', error)
}
```

## 🔄 Real-time Features

### Chat Subscriptions

```typescript
const { data: messages } = useChat('general')
// Automatically subscribes to new messages in the 'general' channel
```

### Custom Subscriptions

```typescript
import { supabase } from './src/lib/supabase'

// Subscribe to speedrun updates for an event
const subscription = supabase
  .channel('speedrun-updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'speedruns',
    filter: `event_id=eq.${eventId}`
  }, (payload) => {
    console.log('New speedrun submitted!', payload.new)
  })
  .subscribe()
```

## 📊 Statistics and Analytics

### User Statistics

```typescript
const { data: stats } = useUserStats(userId)

// Returns:
// {
//   total_speedruns: 15,
//   best_rank: 2,
//   total_likes_received: 47,
//   total_fanarts: 8,
//   total_collections: 23
// }
```

### Global Statistics

```typescript
const { data: globalStats } = useGlobalStats()

// Returns:
// {
//   totalUsers: 1250,
//   totalEvents: 89,
//   totalSpeedruns: 3456,
//   totalFanarts: 892
// }
```

## 🧪 Testing

### Running Tests

```typescript
import { runDatabaseTests } from './test-database-operations'

// Run comprehensive test suite
await runDatabaseTests()
```

### Test Coverage

The test suite covers:

- ✅ Profile CRUD operations
- ✅ Event management
- ✅ Speedrun submissions and leaderboards
- ✅ Fanart uploads and sharing
- ✅ Collection management
- ✅ Real-time chat functionality
- ✅ Forum posts and comments
- ✅ Like system
- ✅ Report system
- ✅ File upload and storage
- ✅ Statistics generation
- ✅ Real-time subscriptions

## 🚨 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Make sure user is authenticated (`auth.uid()` not null)
   - Check policy conditions match your use case
   - Verify user owns the resource they're trying to access

2. **Upload Failures**
   - Check file size limits (default 50MB in Supabase)
   - Verify bucket exists and is properly configured
   - Ensure user has permission to upload to their folder

3. **Real-time Not Working**
   - Verify RLS policies allow the user to see the data
   - Check that the subscription filter is correct
   - Make sure the table has real-time enabled

### Debug Mode

Enable debug logging in development:

```typescript
// In your main app file
if (import.meta.env.DEV) {
  window.supabaseDebug = true
}
```

## 🔧 Customization

### Adding New Tables

1. Add table schema to `database-setup.sql`
2. Update TypeScript types in `src/lib/supabase.ts`
3. Create service methods in `src/services/dbService.ts`
4. Add React hooks in `src/hooks/useSupabaseData.ts`
5. Add tests to `test-database-operations.ts`

### Modifying RLS Policies

```sql
-- Example: Allow admins to see all reports
CREATE POLICY "Admins can view all reports" ON reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [File Storage Guide](https://supabase.com/docs/guides/storage)

## 🎯 Production Checklist

Before going live:

- [ ] Run full test suite and verify all tests pass
- [ ] Review and test all RLS policies
- [ ] Set up proper backup strategy
- [ ] Configure monitoring and alerting
- [ ] Test file upload limits and security
- [ ] Verify GDPR compliance features
- [ ] Set up proper error handling and logging
- [ ] Test real-time features under load
- [ ] Review and optimize database indexes
- [ ] Set up proper environment variables

---

**🎮 Your Battle64 database is now ready for production!**

All features are persistent, GDPR-compliant, and production-ready. The platform is ready for Phase 3 (Live features & PWA).