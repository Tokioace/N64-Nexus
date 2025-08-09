import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'
import { generateSmartRedirectURL, detectBrowser } from '../utils/browserDetection'
import type { User as SupabaseUser, AuthError } from '@supabase/supabase-js'
import type { User, UserRegistrationData } from '../types'

export interface AuthResult {
  success: boolean
  error?: string
  user?: User | null
  message?: string
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
      // Age verification (18+ only)
      const birthDate = new Date(data.birthDate)
      const eighteenYearsAgo = new Date()
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
      
      if (birthDate > eighteenYearsAgo) {
        return {
          success: false,
          error: 'Du musst mindestens 18 Jahre alt sein, um Battle64 zu nutzen'
        }
      }

      // Legal agreements validation
      if (!data.termsAccepted || !data.privacyAccepted || !data.copyrightAcknowledged || !data.ageConfirmed) {
        return {
          success: false,
          error: 'All legal agreements must be accepted'
        }
      }

      // Prüfe ob Username bereits existiert (über Profile-Tabelle)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', data.username)
        .single()

      if (existingProfile) {
        return {
          success: false,
          error: 'Username already taken'
        }
      }

      // Generate browser-aware redirect URL
      const baseRedirectURL = `${window.location.origin}/?registration=success`
      const smartRedirectURL = generateSmartRedirectURL(baseRedirectURL)

      // Detect browser info once to avoid double calls
      const browserInfo = detectBrowser()

      // Registriere Benutzer in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: smartRedirectURL,
          data: {
            username: data.username,
            region: data.region,
            platform: data.platform,
            birth_date: data.birthDate,
            terms_accepted: data.termsAccepted,
            privacy_accepted: data.privacyAccepted,
            copyright_acknowledged: data.copyrightAcknowledged,
            // Store browser info for later use
            preferred_browser: browserInfo.name,
            browser_version: browserInfo.version
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
          error: 'Registration failed'
        }
      }

      // Check if email confirmation is required
      if (!authData.user.email_confirmed_at) {
        // Email confirmation required - don't create profile yet
        if (import.meta.env.DEV) {
          logger.info('Registration successful, email confirmation required:', { 
            userId: authData.user.id, 
            username: data.username,
            email: data.email
          })
        }

        return {
          success: true,
          user: null, // No user object until email is confirmed
          error: 'Registration successful! Please confirm your email address to activate your account.'
        }
      }

      // If email is already confirmed, create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: data.username,
          level: 1,
          xp: 0,
          region: data.region,
          platform: data.platform,
          birth_date: data.birthDate,
          terms_accepted: data.termsAccepted,
          privacy_accepted: data.privacyAccepted,
          copyright_acknowledged: data.copyrightAcknowledged,
          avatar: '🎮',
          bio: '',
          location: '',
          is_public: true
        })

      if (profileError) {
        if (import.meta.env.DEV) {
          logger.error('Profile creation error:', profileError)
        }
        return {
          success: false,
          error: 'Error creating profile'
        }
      }

      // Konvertiere zu unserem User-Format
      const user = await this.convertSupabaseUserToUser(authData.user)

      if (import.meta.env.DEV) {
        logger.info('User registered and confirmed successfully:', { userId: authData.user.id, username: data.username })
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
        error: 'Unexpected error during registration'
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
          error: 'Login failed'
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
        error: 'Unexpected error during login'
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
        error: 'Unexpected error during password reset'
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
        error: 'Unexpected error during password update'
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
          error: 'No logged in user found'
        }
      }

      // Rufe die DSGVO-konforme Löschfunktion auf
      const { data, error } = await supabase.rpc('delete_user_account', {
        user_uuid: user.id
      })

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Account deletion error:', error)
        }
        return {
          success: false,
          error: 'Account deletion error: ' + error.message
        }
      }

      // Melde den Benutzer ab
      await this.logout()

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
        error: 'Unexpected error during account deletion'
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
      // Legal compliance fields
      birthDate: profile?.birth_date ? new Date(profile.birth_date) : undefined,
      termsAccepted: profile?.terms_accepted || false,
      privacyAccepted: profile?.privacy_accepted || false,
      copyrightAcknowledged: profile?.copyright_acknowledged || false,
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
        return 'Invalid login credentials'
      case 'User already registered':
        return 'E-Mail bereits registriert'
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long'
      case 'Email not confirmed':
        return 'E-Mail noch nicht bestätigt'
      case 'Invalid email':
        return 'Invalid email address'
      default:
        return error.message
    }
  }
}

export const authService = new AuthService()