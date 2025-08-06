-- Battle64 Database Setup Script
-- This script creates all necessary tables, RLS policies, and storage buckets
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (Updated from existing structure)
-- =====================================================
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    avatar_url text,
    language text DEFAULT 'en',
    points integer DEFAULT 0,
    is_verified boolean DEFAULT false,
    level integer DEFAULT 1,
    xp integer DEFAULT 0,
    region text CHECK (region IN ('PAL', 'NTSC')) DEFAULT 'PAL',
    platform text CHECK (platform IN ('N64', 'PC')) DEFAULT 'N64',
    bio text,
    location text,
    is_public boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    game text NOT NULL,
    track text NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    status text CHECK (status IN ('upcoming', 'live', 'finished')) DEFAULT 'upcoming',
    cover_image text,
    created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- SPEEDRUNS TABLE
-- =====================================================
CREATE TABLE speedruns (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    time_ms integer NOT NULL,
    video_url text,
    screenshot_url text,
    verified boolean DEFAULT false,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- FANARTS TABLE
-- =====================================================
CREATE TABLE fanarts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    image_url text NOT NULL,
    title text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- COLLECTIONS TABLE (Updated from existing structure)
-- =====================================================
DROP TABLE IF EXISTS collections CASCADE;
CREATE TABLE collections (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    game_title text NOT NULL,
    is_completed boolean DEFAULT false,
    note text,
    game_id text,
    platform text CHECK (platform IN ('N64', 'PC')) DEFAULT 'N64',
    region text CHECK (region IN ('PAL', 'NTSC')) DEFAULT 'PAL',
    condition text CHECK (condition IN ('mint', 'very-good', 'good', 'fair', 'poor')),
    completeness text CHECK (completeness IN ('complete', 'cart-only', 'box-only', 'manual-only')),
    acquisition_date date,
    is_wishlist boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- LEADERBOARD_SNAPSHOTS TABLE
-- =====================================================
CREATE TABLE leaderboard_snapshots (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    top_1_user_id uuid REFERENCES profiles(id),
    top_2_user_id uuid REFERENCES profiles(id),
    top_3_user_id uuid REFERENCES profiles(id),
    top_1_time_ms integer,
    top_2_time_ms integer,
    top_3_time_ms integer,
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- CHAT_MESSAGES TABLE
-- =====================================================
CREATE TABLE chat_messages (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    message text NOT NULL,
    channel text DEFAULT 'general',
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- FORUM_POSTS TABLE
-- =====================================================
CREATE TABLE forum_posts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    is_pinned boolean DEFAULT false,
    is_locked boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- FORUM_COMMENTS TABLE
-- =====================================================
CREATE TABLE forum_comments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    comment text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- LIKES TABLE
-- =====================================================
CREATE TABLE likes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    target_type text CHECK (target_type IN ('speedrun', 'fanart', 'post', 'comment')) NOT NULL,
    target_id uuid NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, target_type, target_id)
);

-- =====================================================
-- REPORTS TABLE (Moderation)
-- =====================================================
CREATE TABLE reports (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reported_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    target_type text NOT NULL,
    target_id uuid NOT NULL,
    reason text NOT NULL,
    status text CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')) DEFAULT 'pending',
    reviewed_by uuid REFERENCES profiles(id),
    reviewed_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- PERSONAL_RECORDS TABLE (Keep existing for backward compatibility)
-- =====================================================
DROP TABLE IF EXISTS personal_records CASCADE;
CREATE TABLE personal_records (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    game_id text NOT NULL,
    game_name text NOT NULL,
    category text NOT NULL,
    time text NOT NULL,
    time_ms integer,
    platform text CHECK (platform IN ('N64', 'PC')) DEFAULT 'N64',
    region text CHECK (region IN ('PAL', 'NTSC')) DEFAULT 'PAL',
    achieved_date date NOT NULL,
    verified boolean DEFAULT false,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_speedruns_event_id ON speedruns(event_id);
CREATE INDEX idx_speedruns_user_id ON speedruns(user_id);
CREATE INDEX idx_speedruns_time_ms ON speedruns(time_ms);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);

-- =====================================================
-- TRIGGERS FOR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_speedruns_updated_at BEFORE UPDATE ON speedruns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fanarts_updated_at BEFORE UPDATE ON fanarts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_comments_updated_at BEFORE UPDATE ON forum_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_records_updated_at BEFORE UPDATE ON personal_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE speedruns ENABLE ROW LEVEL SECURITY;
ALTER TABLE fanarts ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================
CREATE POLICY "Users can view public profiles" ON profiles
    FOR SELECT USING (is_public = true OR id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE USING (id = auth.uid());

-- =====================================================
-- EVENTS POLICIES
-- =====================================================
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON events
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Event creators can update their events" ON events
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Event creators can delete their events" ON events
    FOR DELETE USING (created_by = auth.uid());

-- =====================================================
-- SPEEDRUNS POLICIES
-- =====================================================
CREATE POLICY "Anyone can view speedruns for live or finished events" ON speedruns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = speedruns.event_id 
            AND events.status IN ('live', 'finished')
        ) OR user_id = auth.uid()
    );

CREATE POLICY "Users can insert their own speedruns" ON speedruns
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own speedruns" ON speedruns
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own speedruns" ON speedruns
    FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- FANARTS POLICIES
-- =====================================================
CREATE POLICY "Anyone can view fanarts" ON fanarts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own fanarts" ON fanarts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own fanarts" ON fanarts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own fanarts" ON fanarts
    FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- COLLECTIONS POLICIES
-- =====================================================
CREATE POLICY "Users can view their own collections" ON collections
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own collections" ON collections
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own collections" ON collections
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own collections" ON collections
    FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- LEADERBOARD_SNAPSHOTS POLICIES
-- =====================================================
CREATE POLICY "Anyone can view leaderboard snapshots" ON leaderboard_snapshots
    FOR SELECT USING (true);

CREATE POLICY "System can insert leaderboard snapshots" ON leaderboard_snapshots
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- CHAT_MESSAGES POLICIES
-- =====================================================
CREATE POLICY "Anyone can view chat messages" ON chat_messages
    FOR SELECT USING (true);

CREATE POLICY "Users can send chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND sender_id = auth.uid());

CREATE POLICY "Users can delete their own chat messages" ON chat_messages
    FOR DELETE USING (sender_id = auth.uid());

-- =====================================================
-- FORUM_POSTS POLICIES
-- =====================================================
CREATE POLICY "Anyone can view forum posts" ON forum_posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create forum posts" ON forum_posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own forum posts" ON forum_posts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own forum posts" ON forum_posts
    FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- FORUM_COMMENTS POLICIES
-- =====================================================
CREATE POLICY "Anyone can view forum comments" ON forum_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can create forum comments" ON forum_comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own forum comments" ON forum_comments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own forum comments" ON forum_comments
    FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- LIKES POLICIES
-- =====================================================
CREATE POLICY "Anyone can view likes" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON likes
    FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- REPORTS POLICIES
-- =====================================================
CREATE POLICY "Users can view their own reports" ON reports
    FOR SELECT USING (reported_by = auth.uid());

CREATE POLICY "Users can create reports" ON reports
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND reported_by = auth.uid());

-- =====================================================
-- PERSONAL_RECORDS POLICIES
-- =====================================================
CREATE POLICY "Users can view their own personal records" ON personal_records
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own personal records" ON personal_records
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update their own personal records" ON personal_records
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own personal records" ON personal_records
    FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- STORAGE BUCKET SETUP
-- =====================================================

-- Create uploads bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', false);

-- Storage policies for uploads bucket
CREATE POLICY "Users can view their own uploads" ON storage.objects
    FOR SELECT USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload to their own folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'uploads' 
        AND auth.uid()::text = (storage.foldername(name))[1]
        AND (storage.foldername(name))[2] IN ('screenshots', 'videos', 'fanarts', 'avatars')
    );

CREATE POLICY "Users can update their own uploads" ON storage.objects
    FOR UPDATE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads" ON storage.objects
    FOR DELETE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get leaderboard for an event
CREATE OR REPLACE FUNCTION get_event_leaderboard(event_uuid uuid)
RETURNS TABLE(
    rank integer,
    user_id uuid,
    username text,
    time_ms integer,
    avatar_url text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY s.time_ms ASC)::integer as rank,
        s.user_id,
        p.username,
        s.time_ms,
        p.avatar_url
    FROM speedruns s
    JOIN profiles p ON p.id = s.user_id
    WHERE s.event_id = event_uuid
    ORDER BY s.time_ms ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid uuid)
RETURNS TABLE(
    total_speedruns integer,
    best_rank integer,
    total_likes_received integer,
    total_fanarts integer,
    total_collections integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::integer FROM speedruns WHERE user_id = user_uuid),
        (SELECT MIN(rank)::integer FROM (
            SELECT ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY time_ms ASC) as rank
            FROM speedruns 
            WHERE user_id = user_uuid
        ) ranked_runs),
        (SELECT COUNT(*)::integer FROM likes l 
         WHERE (l.target_type = 'speedrun' AND l.target_id IN (SELECT id FROM speedruns WHERE user_id = user_uuid))
            OR (l.target_type = 'fanart' AND l.target_id IN (SELECT id FROM fanarts WHERE user_id = user_uuid))
            OR (l.target_type = 'post' AND l.target_id IN (SELECT id FROM forum_posts WHERE user_id = user_uuid))
            OR (l.target_type = 'comment' AND l.target_id IN (SELECT id FROM forum_comments WHERE user_id = user_uuid))
        ),
        (SELECT COUNT(*)::integer FROM fanarts WHERE user_id = user_uuid),
        (SELECT COUNT(*)::integer FROM collections WHERE user_id = user_uuid AND is_wishlist = false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- This section can be uncommented to insert sample data for testing
/*
-- Insert sample profiles (these would normally be created via auth signup)
INSERT INTO profiles (id, username, language, points, level) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'SpeedRunner64', 'en', 1250, 5),
    ('550e8400-e29b-41d4-a716-446655440001', 'RetroGamer', 'de', 890, 3),
    ('550e8400-e29b-41d4-a716-446655440002', 'N64Master', 'en', 2100, 8);

-- Insert sample event
INSERT INTO events (id, title, game, track, start_time, end_time, status, created_by) VALUES
    ('650e8400-e29b-41d4-a716-446655440000', 'Weekly Mario Kart 64 Championship', 'Mario Kart 64', 'Luigi Raceway', 
     now() + interval '1 day', now() + interval '2 days', 'upcoming', '550e8400-e29b-41d4-a716-446655440000');
*/

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
SELECT 'Battle64 database setup completed successfully!' as message;