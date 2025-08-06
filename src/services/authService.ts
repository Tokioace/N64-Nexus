import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import type { User as SupabaseUser, AuthError } from '@supabase/supabase-js'
import type { User, UserRegistrationData } from '../types'

export interface AuthResult {
  success: boolean
  error?: string
  user?: User | null
}

export interface PasswordResetResult {
  success: boolean
  error?: string
}

class AuthService {
  /**
   * Registriert einen neuen Benutzer mit E-Mail und Passwort
   */
  async register(data: UserRegistrationData): Promise<AuthResult> {
    try {
      // Prüfe ob Username bereits existiert (über Profile-Tabelle)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', data.username)
        .single()

      if (existingProfile) {
        return {
          success: false,
          error: 'Username bereits vergeben'
        }
      }

      // Registriere Benutzer in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            region: data.region,
            platform: data.platform
          }
        }
      })

      if (authError) {
        if (import.meta.env.DEV) {
          logger.error('Registration auth error:', authError)
        }
        return {
          success: false,
          error: this.getErrorMessage(authError)
        }
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Registrierung fehlgeschlagen'
        }
      }

      // Erstelle Profil in der profiles-Tabelle
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: data.username,
          level: 1,
          xp: 0,
          region: data.region,
          platform: data.platform,
          avatar: '🎮',
          bio: '',
          location: '',
          is_public: true
        })

      if (profileError) {
        if (import.meta.env.DEV) {
          logger.error('Profile creation error:', profileError)
        }
        // Versuche den Auth-User zu löschen, da Profil-Erstellung fehlgeschlagen ist
        await supabase.auth.admin.deleteUser(authData.user.id)
        return {
          success: false,
          error: 'Fehler beim Erstellen des Profils'
        }
      }

      // Konvertiere zu unserem User-Format
      const user = await this.convertSupabaseUserToUser(authData.user)

      if (import.meta.env.DEV) {
        logger.info('User registered successfully:', { userId: authData.user.id, username: data.username })
      }

      return {
        success: true,
        user
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Registration error:', error)
      }
      return {
        success: false,
        error: 'Unerwarteter Fehler bei der Registrierung'
      }
    }
  }

  /**
   * Meldet einen Benutzer mit E-Mail und Passwort an
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Login error:', error)
        }
        return {
          success: false,
          error: this.getErrorMessage(error)
        }
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Login fehlgeschlagen'
        }
      }

      const user = await this.convertSupabaseUserToUser(data.user)

      if (import.meta.env.DEV) {
        logger.info('User logged in successfully:', { userId: data.user.id })
      }

      return {
        success: true,
        user
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Login error:', error)
      }
      return {
        success: false,
        error: 'Unerwarteter Fehler beim Login'
      }
    }
  }

  /**
   * Meldet den aktuellen Benutzer ab
   */
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Logout error:', error)
        }
        throw error
      }

      if (import.meta.env.DEV) {
        logger.info('User logged out successfully')
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Logout error:', error)
      }
      throw error
    }
  }

  /**
   * Sendet eine Passwort-Reset E-Mail
   */
  async resetPassword(email: string): Promise<PasswordResetResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Password reset error:', error)
        }
        return {
          success: false,
          error: this.getErrorMessage(error)
        }
      }

      if (import.meta.env.DEV) {
        logger.info('Password reset email sent:', { email })
      }

      return {
        success: true
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Password reset error:', error)
      }
      return {
        success: false,
        error: 'Unerwarteter Fehler beim Passwort-Reset'
      }
    }
  }

  /**
   * Aktualisiert das Passwort des aktuellen Benutzers
   */
  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Password update error:', error)
        }
        return {
          success: false,
          error: this.getErrorMessage(error)
        }
      }

      if (import.meta.env.DEV) {
        logger.info('Password updated successfully:', { userId: data.user?.id })
      }

      return {
        success: true
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Password update error:', error)
      }
      return {
        success: false,
        error: 'Unerwarteter Fehler beim Passwort-Update'
      }
    }
  }

  /**
   * Löscht das Konto des aktuellen Benutzers (DSGVO-konform)
   */
  async deleteAccount(): Promise<AuthResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return {
          success: false,
          error: 'Kein angemeldeter Benutzer gefunden'
        }
      }

      // Lösche zuerst alle verknüpften Daten
      await Promise.all([
        supabase.from('collections').delete().eq('user_id', user.id),
        supabase.from('personal_records').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id)
      ])

      // Lösche den Auth-User (funktioniert nur mit Admin-Rechten)
      // In der Praxis würde das über eine Edge Function laufen
      const { error } = await supabase.rpc('delete_user_account', {
        user_id: user.id
      })

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Account deletion error:', error)
        }
        return {
          success: false,
          error: 'Fehler beim Löschen des Kontos'
        }
      }

      if (import.meta.env.DEV) {
        logger.info('Account deleted successfully:', { userId: user.id })
      }

      return {
        success: true
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Account deletion error:', error)
      }
      return {
        success: false,
        error: 'Unerwarteter Fehler beim Löschen des Kontos'
      }
    }
  }

  /**
   * Holt die aktuelle Session
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Get session error:', error)
        }
        return null
      }

      return session
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Get session error:', error)
      }
      return null
    }
  }

  /**
   * Holt den aktuellen Benutzer
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      return await this.convertSupabaseUserToUser(user)
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Get current user error:', error)
      }
      return null
    }
  }

  /**
   * Überwacht Auth-Zustandsänderungen
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (import.meta.env.DEV) {
        logger.info('Auth state changed:', { event, userId: session?.user?.id })
      }

      if (session?.user) {
        const user = await this.convertSupabaseUserToUser(session.user)
        callback(user)
      } else {
        callback(null)
      }
    })
  }

  /**
   * Konvertiert Supabase User zu unserem User-Format
   */
  private async convertSupabaseUserToUser(supabaseUser: SupabaseUser): Promise<User> {
    // Hole Profil-Daten aus der profiles-Tabelle
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    // Hole Collections
    const { data: collections = [] } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', supabaseUser.id)

    // Hole Personal Records
    const { data: personalRecords = [] } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', supabaseUser.id)

    return {
      id: supabaseUser.id,
      username: profile?.username || supabaseUser.user_metadata?.username || 'Unknown',
      email: supabaseUser.email || '',
      level: profile?.level || 1,
      xp: profile?.xp || 0,
      region: profile?.region || 'PAL',
      platform: profile?.platform || 'N64',
      joinDate: new Date(supabaseUser.created_at),
      avatar: profile?.avatar || '🎮',
      bio: profile?.bio || '',
      location: profile?.location || '',
      isPublic: profile?.is_public ?? true,
      collections: (collections || []).map(c => ({
        id: c.id,
        userId: c.user_id,
        gameId: c.game_id,
        gameName: c.game_name,
        platform: c.platform,
        region: c.region,
        condition: c.condition,
        completeness: c.completeness,
        acquisitionDate: new Date(c.acquisition_date),
        notes: c.notes,
        isWishlist: c.is_wishlist
      })),
      personalRecords: (personalRecords || []).map(pr => ({
        id: pr.id,
        userId: pr.user_id,
        gameId: pr.game_id,
        gameName: pr.game_name,
        category: pr.category,
        time: pr.time,
        platform: pr.platform,
        region: pr.region,
        achievedDate: new Date(pr.achieved_date),
        verified: pr.verified,
        notes: pr.notes
      }))
    }
  }

  /**
   * Konvertiert Supabase-Fehler zu benutzerfreundlichen Nachrichten
   */
  private getErrorMessage(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Ungültige Anmeldedaten'
      case 'User already registered':
        return 'E-Mail bereits registriert'
      case 'Password should be at least 6 characters':
        return 'Passwort muss mindestens 6 Zeichen lang sein'
      case 'Email not confirmed':
        return 'E-Mail noch nicht bestätigt'
      case 'Invalid email':
        return 'Ungültige E-Mail-Adresse'
      default:
        return error.message
    }
  }
}

export const authService = new AuthService()