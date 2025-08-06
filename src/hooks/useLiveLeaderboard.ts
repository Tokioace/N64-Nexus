import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useRealtimeSpeedruns } from './useRealtimeSub'
import { logger } from '../lib/logger'

interface LeaderboardEntry {
  rank: number
  user_id: string
  username: string
  time_ms: number
  avatar_url: string | null
  verified: boolean
  created_at: string
}

interface LiveLeaderboardState {
  entries: LeaderboardEntry[]
  loading: boolean
  error: string | null
  lastUpdate: Date | null
}

export const useLiveLeaderboard = (eventId?: string) => {
  const [state, setState] = useState<LiveLeaderboardState>({
    entries: [],
    loading: true,
    error: null,
    lastUpdate: null
  })

  // Fetch initial leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    if (!eventId) {
      setState(prev => ({ ...prev, loading: false, entries: [] }))
      return
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .rpc('get_event_leaderboard', { event_uuid: eventId })

      if (error) {
        throw error
      }

      const entries: LeaderboardEntry[] = (data || []).map((entry: any, index: number) => ({
        rank: index + 1,
        user_id: entry.user_id,
        username: entry.username,
        time_ms: entry.time_ms,
        avatar_url: entry.avatar_url,
        verified: true,
        created_at: entry.created_at || new Date().toISOString()
      }))

      setState(prev => ({
        ...prev,
        entries,
        loading: false,
        lastUpdate: new Date()
      }))

      logger.info('Live leaderboard loaded:', { eventId, entriesCount: entries.length })
    } catch (error: any) {
      logger.error('Failed to fetch leaderboard:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load leaderboard'
      }))
    }
  }, [eventId])

  // Handle realtime speedrun updates
  useRealtimeSpeedruns((payload) => {
    logger.info('Realtime speedrun update received:', payload)

    // Only process updates for the current event
    if (payload.new?.event_id === eventId || payload.old?.event_id === eventId) {
      // Refetch leaderboard when speedruns change
      fetchLeaderboard()
    }
  })

  // Initial load
  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  // Refresh function for manual updates
  const refresh = useCallback(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return {
    entries: state.entries,
    loading: state.loading,
    error: state.error,
    lastUpdate: state.lastUpdate,
    refresh
  }
}

// Hook for global points leaderboard with realtime updates
export const useLivePointsLeaderboard = () => {
  const [state, setState] = useState<{
    entries: Array<{
      rank: number
      user_id: string
      username: string
      points: number
      avatar_url: string | null
      level: number
      xp: number
    }>
    loading: boolean
    error: string | null
    lastUpdate: Date | null
  }>({
    entries: [],
    loading: true,
    error: null,
    lastUpdate: null
  })

  const fetchPointsLeaderboard = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, points, avatar_url, level, xp')
        .eq('is_public', true)
        .order('points', { ascending: false })
        .limit(100)

      if (error) {
        throw error
      }

      const entries = (data || []).map((profile, index) => ({
        rank: index + 1,
        user_id: profile.id,
        username: profile.username,
        points: profile.points,
        avatar_url: profile.avatar_url,
        level: profile.level,
        xp: profile.xp
      }))

      setState(prev => ({
        ...prev,
        entries,
        loading: false,
        lastUpdate: new Date()
      }))

      logger.info('Points leaderboard loaded:', { entriesCount: entries.length })
    } catch (error: any) {
      logger.error('Failed to fetch points leaderboard:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load points leaderboard'
      }))
    }
  }, [])

  // Listen for profile updates (points changes)
  useEffect(() => {
    const channel = supabase
      .channel('points-leaderboard')
      .on(
        'postgres_changes' as any,
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: 'is_public=eq.true'
        },
        (payload: any) => {
          logger.info('Profile points updated:', payload)
          // Refetch leaderboard when points change
          fetchPointsLeaderboard()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [fetchPointsLeaderboard])

  // Initial load
  useEffect(() => {
    fetchPointsLeaderboard()
  }, [fetchPointsLeaderboard])

  const refresh = useCallback(() => {
    fetchPointsLeaderboard()
  }, [fetchPointsLeaderboard])

  return {
    entries: state.entries,
    loading: state.loading,
    error: state.error,
    lastUpdate: state.lastUpdate,
    refresh
  }
}