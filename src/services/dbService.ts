import { supabase } from '../lib/supabase'
import { Database } from '../lib/supabase'
import { logger } from '../lib/logger'

type Tables = Database['public']['Tables']

// =====================================================
// PROFILES SERVICE
// =====================================================
export const profileService = {
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching profile:', error)
      throw error
    }
  },

  async updateProfile(userId: string, updates: Tables['profiles']['Update']) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating profile:', error)
      throw error
    }
  },

  async createProfile(profile: Tables['profiles']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating profile:', error)
      throw error
    }
  },

  async getPublicProfiles(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)
        .order('points', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching public profiles:', error)
      throw error
    }
  }
}

// =====================================================
// EVENTS SERVICE
// =====================================================
export const eventService = {
  async getEvents(status?: 'upcoming' | 'live' | 'finished') {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          profiles:created_by (
            username,
            avatar_url
          )
        `)
        .order('start_time', { ascending: true })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching events:', error)
      throw error
    }
  },

  async getEvent(eventId: string) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles:created_by (
            username,
            avatar_url
          )
        `)
        .eq('id', eventId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching event:', error)
      throw error
    }
  },

  async createEvent(event: Tables['events']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating event:', error)
      throw error
    }
  },

  async updateEvent(eventId: string, updates: Tables['events']['Update']) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating event:', error)
      throw error
    }
  },

  async deleteEvent(eventId: string) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting event:', error)
      throw error
    }
  }
}

// =====================================================
// SPEEDRUNS SERVICE
// =====================================================
export const speedrunService = {
  async getSpeedruns(eventId?: string, userId?: string) {
    try {
      let query = supabase
        .from('speedruns')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          ),
          events:event_id (
            title,
            game,
            track
          )
        `)
        .order('time_ms', { ascending: true })

      if (eventId) {
        query = query.eq('event_id', eventId)
      }

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching speedruns:', error)
      throw error
    }
  },

  async createSpeedrun(speedrun: Tables['speedruns']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('speedruns')
        .insert(speedrun)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating speedrun:', error)
      throw error
    }
  },

  async updateSpeedrun(speedrunId: string, updates: Tables['speedruns']['Update']) {
    try {
      const { data, error } = await supabase
        .from('speedruns')
        .update(updates)
        .eq('id', speedrunId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating speedrun:', error)
      throw error
    }
  },

  async deleteSpeedrun(speedrunId: string) {
    try {
      const { error } = await supabase
        .from('speedruns')
        .delete()
        .eq('id', speedrunId)

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting speedrun:', error)
      throw error
    }
  },

  async getEventLeaderboard(eventId: string) {
    try {
      const { data, error } = await supabase
        .rpc('get_event_leaderboard', { event_uuid: eventId })

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching event leaderboard:', error)
      throw error
    }
  }
}

// =====================================================
// FANARTS SERVICE
// =====================================================
export const fanartService = {
  async getFanarts(userId?: string, limit = 50) {
    try {
      let query = supabase
        .from('fanarts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching fanarts:', error)
      throw error
    }
  },

  async createFanart(fanart: Tables['fanarts']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('fanarts')
        .insert(fanart)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating fanart:', error)
      throw error
    }
  },

  async updateFanart(fanartId: string, updates: Tables['fanarts']['Update']) {
    try {
      const { data, error } = await supabase
        .from('fanarts')
        .update(updates)
        .eq('id', fanartId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating fanart:', error)
      throw error
    }
  },

  async deleteFanart(fanartId: string) {
    try {
      const { error } = await supabase
        .from('fanarts')
        .delete()
        .eq('id', fanartId)

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting fanart:', error)
      throw error
    }
  }
}

// =====================================================
// COLLECTIONS SERVICE
// =====================================================
export const collectionService = {
  async getCollections(userId: string, isWishlist = false) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId)
        .eq('is_wishlist', isWishlist)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching collections:', error)
      throw error
    }
  },

  async createCollection(collection: Tables['collections']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert(collection)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating collection:', error)
      throw error
    }
  },

  async updateCollection(collectionId: string, updates: Tables['collections']['Update']) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', collectionId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating collection:', error)
      throw error
    }
  },

  async deleteCollection(collectionId: string) {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId)

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting collection:', error)
      throw error
    }
  }
}

// =====================================================
// CHAT SERVICE
// =====================================================
export const chatService = {
  async getMessages(channel = 'general', limit = 100) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles:sender_id (
            username,
            avatar_url
          )
        `)
        .eq('channel', channel)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data?.reverse() || []
    } catch (error) {
      logger.error('Error fetching chat messages:', error)
      throw error
    }
  },

  async sendMessage(message: Tables['chat_messages']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(message)
        .select(`
          *,
          profiles:sender_id (
            username,
            avatar_url
          )
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error sending chat message:', error)
      throw error
    }
  },

  async deleteMessage(messageId: string) {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting chat message:', error)
      throw error
    }
  },

  // Real-time subscription for chat messages
  subscribeToMessages(channel: string, callback: (payload: any) => void) {
    return supabase
      .channel(`chat:${channel}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel=eq.${channel}`
        },
        callback
      )
      .subscribe()
  }
}

// =====================================================
// FORUM SERVICE
// =====================================================
export const forumService = {
  async getPosts(category?: string, limit = 50) {
    try {
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          ),
          forum_comments (count)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching forum posts:', error)
      throw error
    }
  },

  async getPost(postId: string) {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('id', postId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching forum post:', error)
      throw error
    }
  },

  async createPost(post: Tables['forum_posts']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert(post)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating forum post:', error)
      throw error
    }
  },

  async updatePost(postId: string, updates: Tables['forum_posts']['Update']) {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating forum post:', error)
      throw error
    }
  },

  async deletePost(postId: string) {
    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting forum post:', error)
      throw error
    }
  },

  async getComments(postId: string) {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching forum comments:', error)
      throw error
    }
  },

  async createComment(comment: Tables['forum_comments']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .insert(comment)
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating forum comment:', error)
      throw error
    }
  },

  async updateComment(commentId: string, updates: Tables['forum_comments']['Update']) {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .update(updates)
        .eq('id', commentId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating forum comment:', error)
      throw error
    }
  },

  async deleteComment(commentId: string) {
    try {
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting forum comment:', error)
      throw error
    }
  }
}

// =====================================================
// LIKES SERVICE
// =====================================================
export const likeService = {
  async getLikes(targetType: string, targetId: string) {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching likes:', error)
      throw error
    }
  },

  async toggleLike(like: Tables['likes']['Insert']) {
    try {
      // Check if like already exists
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', like.user_id)
        .eq('target_type', like.target_type)
        .eq('target_id', like.target_id)
        .single()

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)

        if (error) throw error
        return { action: 'removed', data: null }
      } else {
        // Add like
        const { data, error } = await supabase
          .from('likes')
          .insert(like)
          .select()
          .single()

        if (error) throw error
        return { action: 'added', data }
      }
    } catch (error) {
      logger.error('Error toggling like:', error)
      throw error
    }
  },

  async getLikeCount(targetType: string, targetId: string) {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('target_type', targetType)
        .eq('target_id', targetId)

      if (error) throw error
      return count || 0
    } catch (error) {
      logger.error('Error getting like count:', error)
      throw error
    }
  },

  async isLikedByUser(userId: string, targetType: string, targetId: string) {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      logger.error('Error checking if liked by user:', error)
      throw error
    }
  }
}

// =====================================================
// REPORTS SERVICE
// =====================================================
export const reportService = {
  async createReport(report: Tables['reports']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert(report)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating report:', error)
      throw error
    }
  },

  async getReports(userId?: string, status?: string) {
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          profiles:reported_by (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('reported_by', userId)
      }

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching reports:', error)
      throw error
    }
  },

  async updateReport(reportId: string, updates: Tables['reports']['Update']) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', reportId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating report:', error)
      throw error
    }
  }
}

// =====================================================
// STORAGE SERVICE
// =====================================================
export const storageService = {
  async uploadFile(bucket: string, path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error uploading file:', error)
      throw error
    }
  },

  async deleteFile(bucket: string, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting file:', error)
      throw error
    }
  },

  async getPublicUrl(bucket: string, path: string) {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      return data.publicUrl
    } catch (error) {
      logger.error('Error getting public URL:', error)
      throw error
    }
  },

  async createSignedUrl(bucket: string, path: string, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) throw error
      return data.signedUrl
    } catch (error) {
      logger.error('Error creating signed URL:', error)
      throw error
    }
  }
}

// =====================================================
// STATISTICS SERVICE
// =====================================================
export const statsService = {
  async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_stats', { user_uuid: userId })

      if (error) throw error
      return data?.[0] || {
        total_speedruns: 0,
        best_rank: null,
        total_likes_received: 0,
        total_fanarts: 0,
        total_collections: 0
      }
    } catch (error) {
      logger.error('Error fetching user stats:', error)
      throw error
    }
  },

  async getGlobalStats() {
    try {
      const [
        { count: totalUsers },
        { count: totalEvents },
        { count: totalSpeedruns },
        { count: totalFanarts }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('speedruns').select('*', { count: 'exact', head: true }),
        supabase.from('fanarts').select('*', { count: 'exact', head: true })
      ])

      return {
        totalUsers: totalUsers || 0,
        totalEvents: totalEvents || 0,
        totalSpeedruns: totalSpeedruns || 0,
        totalFanarts: totalFanarts || 0
      }
    } catch (error) {
      logger.error('Error fetching global stats:', error)
      throw error
    }
  }
}

// =====================================================
// PERSONAL RECORDS SERVICE (Backward compatibility)
// =====================================================
export const personalRecordService = {
  async getPersonalRecords(userId: string) {
    try {
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', userId)
        .order('achieved_date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error fetching personal records:', error)
      throw error
    }
  },

  async createPersonalRecord(record: Tables['personal_records']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('personal_records')
        .insert(record)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error creating personal record:', error)
      throw error
    }
  },

  async updatePersonalRecord(recordId: string, updates: Tables['personal_records']['Update']) {
    try {
      const { data, error } = await supabase
        .from('personal_records')
        .update(updates)
        .eq('id', recordId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      logger.error('Error updating personal record:', error)
      throw error
    }
  },

  async deletePersonalRecord(recordId: string) {
    try {
      const { error } = await supabase
        .from('personal_records')
        .delete()
        .eq('id', recordId)

      if (error) throw error
    } catch (error) {
      logger.error('Error deleting personal record:', error)
      throw error
    }
  }
}