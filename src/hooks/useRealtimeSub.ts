import { useEffect, useRef, useCallback } from 'react'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface UseRealtimeSubOptions {
  table: string
  event?: RealtimeEvent
  filter?: string
  schema?: string
}

interface RealtimePayload<T = Record<string, any>> {
  eventType: RealtimeEvent
  new: T
  old: T
  commit_timestamp?: string
  schema?: string
  table?: string
  type?: string
}

export const useRealtimeSub = <T = Record<string, any>>(
  options: UseRealtimeSubOptions,
  callback: (payload: RealtimePayload<T>) => void,
  deps: any[] = []
) => {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const subscribe = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
    }

    const channelName = `realtime:${options.table}:${options.event || '*'}:${Date.now()}`
    
    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes' as any,
          {
            event: options.event || '*',
            schema: options.schema || 'public',
            table: options.table,
            ...(options.filter && { filter: options.filter })
          },
          (payload: any) => {
            logger.info(`Realtime event received for ${options.table}:`, payload)
            
            const enhancedPayload: RealtimePayload<T> = {
              eventType: payload.eventType as RealtimeEvent,
              new: payload.new as T,
              old: payload.old as T,
              commit_timestamp: payload.commit_timestamp,
              schema: payload.schema,
              table: payload.table,
              type: payload.type
            }
            
            callbackRef.current(enhancedPayload)
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            logger.info(`Successfully subscribed to ${options.table} realtime updates`)
          } else if (status === 'CHANNEL_ERROR') {
            logger.error(`Error subscribing to ${options.table} realtime updates`)
          }
        })

      channelRef.current = channel
    } catch (error) {
      logger.error(`Failed to create realtime subscription for ${options.table}:`, error)
    }
  }, [options.table, options.event, options.filter, options.schema, ...deps])

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
      channelRef.current = null
      logger.info(`Unsubscribed from ${options.table} realtime updates`)
    }
  }, [options.table])

  useEffect(() => {
    subscribe()
    return unsubscribe
  }, [subscribe, unsubscribe])

  return {
    subscribe,
    unsubscribe,
    isSubscribed: !!channelRef.current
  }
}

// Specialized hooks for common use cases
export const useRealtimeEvents = (callback: (payload: RealtimePayload) => void) => {
  return useRealtimeSub(
    { table: 'events', event: '*' },
    callback
  )
}

export const useRealtimeSpeedruns = (callback: (payload: RealtimePayload) => void) => {
  return useRealtimeSub(
    { table: 'speedruns', event: '*' },
    callback
  )
}

export const useRealtimeChat = (channel: string, callback: (payload: RealtimePayload) => void) => {
  return useRealtimeSub(
    { 
      table: 'chat_messages', 
      event: 'INSERT',
      filter: `channel=eq.${channel}`
    },
    callback,
    [channel]
  )
}

export const useRealtimeForum = (threadId?: string, callback?: (payload: RealtimePayload) => void) => {
  return useRealtimeSub(
    { 
      table: 'forum_posts', 
      event: '*',
      ...(threadId && { filter: `thread_id=eq.${threadId}` })
    },
    callback || (() => {}),
    [threadId]
  )
}

export const useRealtimeForumComments = (postId?: string, callback?: (payload: RealtimePayload) => void) => {
  return useRealtimeSub(
    { 
      table: 'forum_comments', 
      event: '*',
      ...(postId && { filter: `post_id=eq.${postId}` })
    },
    callback || (() => {}),
    [postId]
  )
}