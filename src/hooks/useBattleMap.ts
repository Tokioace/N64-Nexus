import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import { useLanguage } from '../contexts/LanguageContext'

interface LiveEvent {
  id: string
  title: string
  game: string
  track: string
  start_time: string
  end_time: string
  status: 'upcoming' | 'live' | 'finished'
  cover_image: string | null
  location: {
    latitude: number
    longitude: number
    location_name: string | null
    radius_km: number
  } | null
  participant_count: number
}

interface LiveParticipant {
  id: string
  user_id: string
  username: string
  avatar_url: string | null
  latitude: number
  longitude: number
  location_name: string | null
  distance_km: number | null
  is_active: boolean
  updated_at: string
}

interface BattleMapState {
  events: LiveEvent[]
  participants: LiveParticipant[]
  userLocation: { latitude: number; longitude: number } | null
  loading: boolean
  error: string | null
  lastUpdate: Date | null
}

export const useBattleMap = (userLocation?: { latitude: number; longitude: number }) => {
  const [state, setState] = useState<BattleMapState>({
    events: [],
    participants: [],
    userLocation: userLocation || null,
    loading: true,
    error: null,
    lastUpdate: null
  })

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }, [])

  // Fetch live events with locations
  const fetchLiveEvents = useCallback(async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          title,
          game,
          track,
          start_time,
          end_time,
          status,
          cover_image
        `)
        .in('status', ['upcoming', 'live'])
        .order('start_time', { ascending: true })

      if (eventsError) throw eventsError

      // Get location data for events
      const { data: locationsData, error: locationsError } = await supabase
        .from('events_live_locations')
        .select(`
          event_id,
          latitude,
          longitude,
          location_name,
          radius_km,
          user_id
        `)
        .eq('is_active', true)

      if (locationsError) throw locationsError

      // Combine events with location data
      const eventsWithLocations: LiveEvent[] = (eventsData || []).map(event => {
        const location = locationsData?.find(loc => loc.event_id === event.id)
        const participantCount = locationsData?.filter(loc => loc.event_id === event.id).length || 0

        return {
          ...event,
          location: location ? {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            location_name: location.location_name,
            radius_km: location.radius_km
          } : null,
          participant_count: participantCount
        }
      })

      return eventsWithLocations
    } catch (error: any) {
      logger.error('Failed to fetch live events:', error)
      throw error
    }
  }, [])

  // Fetch participants within radius
  const fetchParticipants = useCallback(async (events: LiveEvent[]) => {
    if (!userLocation) return []

    try {
      const { data: participantsData, error } = await supabase
        .from('events_live_locations')
        .select(`
          id,
          user_id,
          latitude,
          longitude,
          location_name,
          is_active,
          updated_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('is_active', true)

      if (error) throw error

      // Filter participants within 30km radius and calculate distances
      const nearbyParticipants: LiveParticipant[] = (participantsData || [])
        .map(participant => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(participant.latitude),
            parseFloat(participant.longitude)
          )

          return {
            id: participant.id,
            user_id: participant.user_id,
            username: (participant.profiles as any)?.username || 'Unknown',
            avatar_url: (participant.profiles as any)?.avatar_url,
            latitude: parseFloat(participant.latitude),
            longitude: parseFloat(participant.longitude),
            location_name: participant.location_name,
            distance_km: Math.round(distance * 10) / 10, // Round to 1 decimal
            is_active: participant.is_active,
            updated_at: participant.updated_at
          }
        })
        .filter(participant => participant.distance_km! <= 30) // 30km radius
        .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0))

      return nearbyParticipants
    } catch (error: any) {
      logger.error('Failed to fetch participants:', error)
      throw error
    }
  }, [userLocation, calculateDistance])

  // Main fetch function
  const fetchMapData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const events = await fetchLiveEvents()
      const participants = await fetchParticipants(events)

      setState(prev => ({
        ...prev,
        events,
        participants,
        loading: false,
        lastUpdate: new Date()
      }))

      logger.info('Battle map data loaded:', { 
        eventsCount: events.length, 
        participantsCount: participants.length 
      })
    } catch (error: any) {
      logger.error('Failed to fetch map data:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load map data'
      }))
    }
  }, [fetchLiveEvents, fetchParticipants])

  // Set up realtime subscriptions
  useEffect(() => {
    // Subscribe to events changes
    const eventsChannel = supabase
      .channel('battle-map-events')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload: any) => {
          logger.info('Events realtime update:', payload)
          fetchMapData()
        }
      )
      .subscribe()

    // Subscribe to live locations changes
    const locationsChannel = supabase
      .channel('battle-map-locations')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'events_live_locations'
        },
        (payload: any) => {
          logger.info('Live locations realtime update:', payload)
          fetchMapData()
        }
      )
      .subscribe()

    return () => {
      eventsChannel.unsubscribe()
      locationsChannel.unsubscribe()
    }
  }, [fetchMapData])

  // Initial load
  useEffect(() => {
    fetchMapData()
  }, [fetchMapData])

  // Update user location
  const updateUserLocation = useCallback((location: { latitude: number; longitude: number }) => {
    setState(prev => ({ ...prev, userLocation: location }))
  }, [])

  // Join event at location
  const joinEventAtLocation = useCallback(async (
    eventId: string,
    latitude: number,
    longitude: number,
    locationName?: string
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('events_live_locations')
        .insert({
          event_id: eventId,
          user_id: user.user.id,
          latitude,
          longitude,
          location_name: locationName,
          is_active: true
        })

      if (error) throw error

      logger.info('Joined event at location:', { eventId, latitude, longitude })
      // Data will be updated via realtime subscription
    } catch (error: any) {
      logger.error('Failed to join event:', error)
      throw error
    }
  }, [])

  // Leave event
  const leaveEvent = useCallback(async (eventId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('events_live_locations')
        .update({ is_active: false })
        .eq('event_id', eventId)
        .eq('user_id', user.user.id)

      if (error) throw error

      logger.info('Left event:', { eventId })
      // Data will be updated via realtime subscription
    } catch (error: any) {
      logger.error('Failed to leave event:', error)
      throw error
    }
  }, [])

  const refresh = useCallback(() => {
    fetchMapData()
  }, [fetchMapData])

  return {
    events: state.events,
    participants: state.participants,
    userLocation: state.userLocation,
    loading: state.loading,
    error: state.error,
    lastUpdate: state.lastUpdate,
    updateUserLocation,
    joinEventAtLocation,
    leaveEvent,
    refresh
  }
}