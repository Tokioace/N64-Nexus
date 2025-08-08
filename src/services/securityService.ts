import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'

export type SecurityEventType = 'login_failed' | 'suspicious_activity' | 'rate_limit' | 'token_revoked' | 'ddos_pattern'

export const securityService = {
  async log(eventType: SecurityEventType, description: string) {
    try {
      const { error } = await supabase.from('security_events').insert({
        event_type: eventType,
        description
      })
      if (error) throw error
    } catch (e) {
      if (import.meta.env.DEV) logger.warn('Failed to log security event', e)
    }
  },

  async revokeCurrentSession() {
    try {
      await supabase.auth.signOut()
      await this.log('token_revoked', 'Session revoked due to suspicious activity')
    } catch (e) {
      if (import.meta.env.DEV) logger.error('Failed to revoke session', e)
    }
  }
}