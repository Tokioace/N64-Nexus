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
          level: number
          xp: number
          region: 'PAL' | 'NTSC'
          platform: 'N64' | 'PC'
          avatar: string
          bio: string
          location: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          level?: number
          xp?: number
          region: 'PAL' | 'NTSC'
          platform: 'N64' | 'PC'
          avatar?: string
          bio?: string
          location?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          level?: number
          xp?: number
          region?: 'PAL' | 'NTSC'
          platform?: 'N64' | 'PC'
          avatar?: string
          bio?: string
          location?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          game_id: string
          game_name: string
          platform: 'N64' | 'PC'
          region: 'PAL' | 'NTSC'
          condition: 'mint' | 'very-good' | 'good' | 'fair' | 'poor'
          completeness: 'complete' | 'cart-only' | 'box-only' | 'manual-only'
          acquisition_date: string
          notes: string
          is_wishlist: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_id: string
          game_name: string
          platform: 'N64' | 'PC'
          region: 'PAL' | 'NTSC'
          condition: 'mint' | 'very-good' | 'good' | 'fair' | 'poor'
          completeness: 'complete' | 'cart-only' | 'box-only' | 'manual-only'
          acquisition_date: string
          notes?: string
          is_wishlist?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_id?: string
          game_name?: string
          platform?: 'N64' | 'PC'
          region?: 'PAL' | 'NTSC'
          condition?: 'mint' | 'very-good' | 'good' | 'fair' | 'poor'
          completeness?: 'complete' | 'cart-only' | 'box-only' | 'manual-only'
          acquisition_date?: string
          notes?: string
          is_wishlist?: boolean
          created_at?: string
          updated_at?: string
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
          platform: 'N64' | 'PC'
          region: 'PAL' | 'NTSC'
          achieved_date: string
          verified: boolean
          notes: string
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
          platform: 'N64' | 'PC'
          region: 'PAL' | 'NTSC'
          achieved_date: string
          verified?: boolean
          notes?: string
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
          platform?: 'N64' | 'PC'
          region?: 'PAL' | 'NTSC'
          achieved_date?: string
          verified?: boolean
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}