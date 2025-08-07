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
    birth_date date NOT NULL, -- Required for age verification (18+)
    terms_accepted boolean DEFAULT false NOT NULL, -- Terms of Service acceptance
    privacy_accepted boolean DEFAULT false NOT NULL, -- Privacy Policy acceptance
    copyright_acknowledged boolean DEFAULT false NOT NULL, -- Copyright acknowledgment
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT age_verification CHECK (birth_date <= (CURRENT_DATE - INTERVAL '18 years'))
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
-- REPORTS TABLE (Content Moderation System)
-- =====================================================
CREATE TABLE reports (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type text CHECK (content_type IN ('speedrun', 'fanart', 'chat', 'forum', 'profile', 'event')) NOT NULL,
    content_id uuid NOT NULL,
    reason text NOT NULL,
    description text,
    reported_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status text CHECK (status IN ('pending', 'reviewed', 'dismissed', 'action_taken')) DEFAULT 'pending',
    reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    action_taken text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(content_type, content_id, reported_by) -- Prevent duplicate reports from same user
);

-- =====================================================
-- CONTENT_FLAGS TABLE (Auto-moderation tracking)
-- =====================================================
CREATE TABLE content_flags (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type text CHECK (content_type IN ('speedrun', 'fanart', 'chat', 'forum', 'profile', 'event')) NOT NULL,
    content_id uuid NOT NULL,
    flag_type text CHECK (flag_type IN ('nsfw', 'spam', 'hate_speech', 'copyright', 'inappropriate')) NOT NULL,
    confidence_score decimal(3,2), -- AI confidence score (0.00-1.00)
    auto_hidden boolean DEFAULT false, -- Automatically hidden due to flags
    manual_review_required boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    UNIQUE(content_type, content_id, flag_type)
);

-- =====================================================
-- ADMIN_ACTIONS TABLE (Audit log for admin actions)
-- =====================================================
CREATE TABLE admin_actions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    action_type text CHECK (action_type IN ('content_hidden', 'content_removed', 'user_warned', 'user_suspended', 'user_banned', 'report_reviewed')) NOT NULL,
    target_type text CHECK (target_type IN ('user', 'content', 'report')) NOT NULL,
    target_id uuid NOT NULL,
    reason text NOT NULL,
    notes text,
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
-- EVENTS_LIVE_LOCATIONS TABLE (für Battle64 Map)
-- =====================================================
CREATE TABLE events_live_locations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    latitude decimal(10, 8) NOT NULL,
    longitude decimal(11, 8) NOT NULL,
    location_name text,
    is_active boolean DEFAULT true,
    radius_km integer DEFAULT 30,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index für geografische Suchen
CREATE INDEX idx_events_live_locations_coords ON events_live_locations (latitude, longitude);
CREATE INDEX idx_events_live_locations_event_active ON events_live_locations (event_id, is_active);
CREATE INDEX idx_events_live_locations_user ON events_live_locations (user_id);

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
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
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

-- Admins can view all reports (requires admin role check)
CREATE POLICY "Admins can manage all reports" ON reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (username = 'admin' OR username LIKE 'mod_%')
        )
    );

-- =====================================================
-- CONTENT_FLAGS POLICIES
-- =====================================================
CREATE POLICY "System can manage content flags" ON content_flags
    FOR ALL USING (true); -- Only system/admin functions should access this

-- =====================================================
-- ADMIN_ACTIONS POLICIES
-- =====================================================
CREATE POLICY "Admins can view admin actions" ON admin_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (username = 'admin' OR username LIKE 'mod_%')
        )
    );

CREATE POLICY "Admins can create admin actions" ON admin_actions
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL 
        AND admin_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (username = 'admin' OR username LIKE 'mod_%')
        )
    );

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
            SELECT ROW_NUMBER() OVER (ORDER BY time_ms ASC) as rank
            FROM speedruns s
            WHERE s.user_id = user_uuid
        ) ranked),
        (SELECT COUNT(*)::integer FROM likes WHERE target_id = user_uuid AND target_type = 'user'),
        (SELECT COUNT(*)::integer FROM fanarts WHERE user_id = user_uuid),
        (SELECT COUNT(*)::integer FROM collections WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GDPR COMPLIANCE FUNCTIONS
-- =====================================================

-- Function to delete user account and all related data (GDPR Article 17)
CREATE OR REPLACE FUNCTION delete_user_account(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
    deletion_successful boolean := true;
BEGIN
    -- Only allow users to delete their own account or admins to delete any account
    IF auth.uid() != user_uuid AND NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND (username = 'admin' OR username LIKE 'mod_%')
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Cannot delete this account';
    END IF;

    -- Delete user data in correct order (respecting foreign key constraints)
    BEGIN
        -- Delete reports made by user
        DELETE FROM reports WHERE reported_by = user_uuid;
        
        -- Delete admin actions by user (if admin)
        DELETE FROM admin_actions WHERE admin_id = user_uuid;
        
        -- Delete likes by user
        DELETE FROM likes WHERE user_id = user_uuid;
        
        -- Delete forum comments
        DELETE FROM forum_comments WHERE user_id = user_uuid;
        
        -- Delete forum posts
        DELETE FROM forum_posts WHERE user_id = user_uuid;
        
        -- Delete chat messages
        DELETE FROM chat_messages WHERE user_id = user_uuid;
        
        -- Delete speedruns
        DELETE FROM speedruns WHERE user_id = user_uuid;
        
        -- Delete fanarts
        DELETE FROM fanarts WHERE user_id = user_uuid;
        
        -- Delete collections
        DELETE FROM collections WHERE user_id = user_uuid;
        
        -- Delete personal records
        DELETE FROM personal_records WHERE user_id = user_uuid;
        
        -- Delete events live locations
        DELETE FROM events_live_locations WHERE user_id = user_uuid;
        
        -- Delete events created by user
        DELETE FROM events WHERE created_by = user_uuid;
        
        -- Finally delete profile (this will cascade to auth.users due to ON DELETE CASCADE)
        DELETE FROM profiles WHERE id = user_uuid;
        
    EXCEPTION WHEN OTHERS THEN
        deletion_successful := false;
        RAISE EXCEPTION 'Error deleting user data: %', SQLERRM;
    END;

    RETURN deletion_successful;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if content should be auto-hidden based on report count
CREATE OR REPLACE FUNCTION check_auto_hide_content()
RETURNS TRIGGER AS $$
DECLARE
    report_count integer;
    auto_hide_threshold integer := 3; -- Hide after 3 reports
BEGIN
    -- Count reports for this content
    SELECT COUNT(*) INTO report_count
    FROM reports 
    WHERE content_type = NEW.content_type 
    AND content_id = NEW.content_id 
    AND status = 'pending';
    
    -- Auto-hide if threshold reached
    IF report_count >= auto_hide_threshold THEN
        -- Add auto-hide flag
        INSERT INTO content_flags (content_type, content_id, flag_type, auto_hidden, manual_review_required)
        VALUES (NEW.content_type, NEW.content_id, 'spam', true, true)
        ON CONFLICT (content_type, content_id, flag_type) 
        DO UPDATE SET auto_hidden = true, manual_review_required = true;
        
        -- Log admin action
        INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, reason, notes)
        VALUES (
            '00000000-0000-0000-0000-000000000000'::uuid, -- System user
            'content_hidden',
            'content',
            NEW.content_id,
            'Auto-hidden due to multiple reports',
            format('Content type: %s, Report count: %s', NEW.content_type, report_count)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-hide content after multiple reports
CREATE TRIGGER auto_hide_reported_content
    AFTER INSERT ON reports
    FOR EACH ROW
    EXECUTE FUNCTION check_auto_hide_content();

-- Function to validate age (18+) on profile creation/update
CREATE OR REPLACE FUNCTION validate_age_requirement()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.birth_date > (CURRENT_DATE - INTERVAL '18 years') THEN
        RAISE EXCEPTION 'User must be at least 18 years old to register';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce age verification
CREATE TRIGGER enforce_age_verification
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_age_requirement();

-- Function to ensure legal agreements are accepted
CREATE OR REPLACE FUNCTION validate_legal_agreements()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT NEW.terms_accepted OR NOT NEW.privacy_accepted OR NOT NEW.copyright_acknowledged THEN
        RAISE EXCEPTION 'All legal agreements must be accepted before account creation';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce legal agreement acceptance
CREATE TRIGGER enforce_legal_agreements
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION validate_legal_agreements();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION delete_user_account(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_event_leaderboard(uuid) TO authenticated;

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