import { supabase } from '../lib/supabase'
import { OWNER_UID } from '../config'

export const adminService = {
  async requireOwner(userId: string) {
    if (userId !== OWNER_UID) throw new Error('Not authorized')
  },

  async getFlags() {
    const { data, error } = await supabase.from('content_flags').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async warnUser(targetUserId: string, reason: string) {
    const { error } = await supabase.from('user_violations').insert({
      user_id: targetUserId,
      violation_type: 'text',
      details: reason,
      severity: 1,
      action: 'warned'
    })
    if (error) throw error
  },

  async banUser(targetUserId: string, reason: string) {
    const { error } = await supabase.from('user_violations').insert({
      user_id: targetUserId,
      violation_type: 'text',
      details: reason,
      severity: 2,
      action: 'banned'
    })
    if (error) throw error
  }
}