import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

const supabaseUrl = 'https://ikignlqhkoqlndyziqsz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlraWdubHFoa29xbG5keXppcXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTExOTgsImV4cCI6MjA3MDA4NzE5OH0.JKvED57xoW5FiJbVYk0p6A_urVc5wBVUGzfjFjILKiQ'

// Erstelle Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Logging nur im Development-Modus
if (import.meta.env.DEV) {
  logger.info('Supabase client initialized', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  })
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          language: string | null
          points: number
          is_verified: boolean
          level: number
          xp: number
          region: 'PAL' | 'NTSC'
          platform: 'N64' | 'PC'
          bio: string | null
          location: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          language?: string | null
          points?: number
          is_verified?: boolean
          level?: number
          xp?: number
          region?: 'PAL' | 'NTSC'
          platform?: 'N64' | 'PC'
          bio?: string | null
          location?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          language?: string | null
          points?: number
          is_verified?: boolean
          level?: number
          xp?: number
          region?: 'PAL' | 'NTSC'
          platform?: 'N64' | 'PC'
          bio?: string | null
          location?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          game: string
          track: string
          start_time: string
          end_time: string
          status: 'upcoming' | 'live' | 'finished'
          cover_image: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          game: string
          track: string
          start_time: string
          end_time: string
          status?: 'upcoming' | 'live' | 'finished'
          cover_image?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          game?: string
          track?: string
          start_time?: string
          end_time?: string
          status?: 'upcoming' | 'live' | 'finished'
          cover_image?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      speedruns: {
        Row: {
          id: string
          event_id: string
          user_id: string
          time_ms: number
          video_url: string | null
          screenshot_url: string | null
          verified: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          time_ms: number
          video_url?: string | null
          screenshot_url?: string | null
          verified?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          time_ms?: number
          video_url?: string | null
          screenshot_url?: string | null
          verified?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fanarts: {
        Row: {
          id: string
          user_id: string
          image_url: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          game_title: string
          is_completed: boolean
          note: string | null
          game_id: string | null
          platform: 'N64' | 'PC'
          region: 'PAL' | 'NTSC'
          condition: 'mint' | 'very-good' | 'good' | 'fair' | 'poor' | null
          completeness: 'complete' | 'cart-only' | 'box-only' | 'manual-only' | null
          acquisition_date: string | null
          is_wishlist: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_title: string
          is_completed?: boolean
          note?: string | null
          game_id?: string | null
          platform?: 'N64' | 'PC'
          region?: 'PAL' | 'NTSC'
          condition?: 'mint' | 'very-good' | 'good' | 'fair' | 'poor' | null
          completeness?: 'complete' | 'cart-only' | 'box-only' | 'manual-only' | null
          acquisition_date?: string | null
          is_wishlist?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_title?: string
          is_completed?: boolean
          note?: string | null
          game_id?: string | null
          platform?: 'N64' | 'PC'
          region?: 'PAL' | 'NTSC'
          condition?: 'mint' | 'very-good' | 'good' | 'fair' | 'poor' | null
          completeness?: 'complete' | 'cart-only' | 'box-only' | 'manual-only' | null
          acquisition_date?: string | null
          is_wishlist?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leaderboard_snapshots: {
        Row: {
          id: string
          event_id: string
          top_1_user_id: string | null
          top_2_user_id: string | null
          top_3_user_id: string | null
          top_1_time_ms: number | null
          top_2_time_ms: number | null
          top_3_time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          top_1_user_id?: string | null
          top_2_user_id?: string | null
          top_3_user_id?: string | null
          top_1_time_ms?: number | null
          top_2_time_ms?: number | null
          top_3_time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          top_1_user_id?: string | null
          top_2_user_id?: string | null
          top_3_user_id?: string | null
          top_1_time_ms?: number | null
          top_2_time_ms?: number | null
          top_3_time_ms?: number | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          sender_id: string
          message: string
          channel: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          message: string
          channel?: string
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          message?: string
          channel?: string
          created_at?: string
        }
      }
      forum_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string
          is_pinned: boolean
          is_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category: string
          is_pinned?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          is_pinned?: boolean
          is_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      forum_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          comment: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          comment: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          comment?: string
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          target_type: 'speedrun' | 'fanart' | 'post' | 'comment'
          target_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: 'speedrun' | 'fanart' | 'post' | 'comment'
          target_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_type?: 'speedrun' | 'fanart' | 'post' | 'comment'
          target_id?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reported_by: string
          target_type: string
          target_id: string
          reason: string
          status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reported_by: string
          target_type: string
          target_id: string
          reason: string
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reported_by?: string
          target_type?: string
          target_id?: string
          reason?: string
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      personal_records: {
        Row: {
          id: string
          user_id: string
          game_id: string
          game_name: string
          category: string
          time: string
          time_ms: number | null
          platform: 'N64' | 'PC'
          region: 'PAL' | 'NTSC'
          achieved_date: string
          verified: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          game_name: string
          category: string
          time: string
          time_ms?: number | null
          platform?: 'N64' | 'PC'
          region?: 'PAL' | 'NTSC'
          achieved_date: string
          verified?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          game_name?: string
          category?: string
          time?: string
          time_ms?: number | null
          platform?: 'N64' | 'PC'
          region?: 'PAL' | 'NTSC'
          achieved_date?: string
          verified?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events_live_locations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          latitude: number
          longitude: number
          location_name: string | null
          is_active: boolean
          radius_km: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          latitude: number
          longitude: number
          location_name?: string | null
          is_active?: boolean
          radius_km?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          latitude?: number
          longitude?: number
          location_name?: string | null
          is_active?: boolean
          radius_km?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_event_leaderboard: {
        Args: {
          event_uuid: string
        }
        Returns: {
          rank: number
          user_id: string
          username: string
          time_ms: number
          avatar_url: string | null
        }[]
      }
      get_user_stats: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_speedruns: number
          best_rank: number | null
          total_likes_received: number
          total_fanarts: number
          total_collections: number
        }[]
      }
    }
  }
}