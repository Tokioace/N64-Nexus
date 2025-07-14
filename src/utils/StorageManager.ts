export interface UserData {
  username: string
  email: string
  xp: number
  level: number
  achievements: number
  totalTime: string
  bestTime: string
  speedruns: SpeedrunData[]
  events: EventData[]
}

export interface SpeedrunData {
  id: string
  game: string
  category: string
  personalBest: string
  worldRecord: string
  attempts: number
  lastAttempt: string
}

export interface EventData {
  id: string
  title: string
  date: string
  isRegistered: boolean
}

export class StorageManager {
  private static readonly USER_DATA_KEY = 'speedrun_user_data'
  private static readonly THEME_KEY = 'speedrun_theme'
  private static readonly SETTINGS_KEY = 'speedrun_settings'

  // User Data Management
  static saveUserData(data: UserData): void {
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save user data:', error)
    }
  }

  static getUserData(): UserData | null {
    try {
      const data = localStorage.getItem(this.USER_DATA_KEY)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load user data:', error)
      return null
    }
  }

  static updateUserData(updates: Partial<UserData>): void {
    const currentData = this.getUserData()
    if (currentData) {
      const updatedData = { ...currentData, ...updates }
      this.saveUserData(updatedData)
    }
  }

  // Speedrun Data Management
  static saveSpeedrun(speedrun: SpeedrunData): void {
    const userData = this.getUserData()
    if (userData) {
      const existingIndex = userData.speedruns.findIndex(s => s.id === speedrun.id)
      if (existingIndex >= 0) {
        userData.speedruns[existingIndex] = speedrun
      } else {
        userData.speedruns.push(speedrun)
      }
      this.saveUserData(userData)
    }
  }

  static getSpeedruns(): SpeedrunData[] {
    const userData = this.getUserData()
    return userData?.speedruns || []
  }

  static deleteSpeedrun(id: string): void {
    const userData = this.getUserData()
    if (userData) {
      userData.speedruns = userData.speedruns.filter(s => s.id !== id)
      this.saveUserData(userData)
    }
  }

  // Event Data Management
  static saveEvent(event: EventData): void {
    const userData = this.getUserData()
    if (userData) {
      const existingIndex = userData.events.findIndex(e => e.id === event.id)
      if (existingIndex >= 0) {
        userData.events[existingIndex] = event
      } else {
        userData.events.push(event)
      }
      this.saveUserData(userData)
    }
  }

  static getEvents(): EventData[] {
    const userData = this.getUserData()
    return userData?.events || []
  }

  // Theme Management
  static saveTheme(isDarkMode: boolean): void {
    try {
      localStorage.setItem(this.THEME_KEY, JSON.stringify(isDarkMode))
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }

  static getTheme(): boolean {
    try {
      const theme = localStorage.getItem(this.THEME_KEY)
      return theme ? JSON.parse(theme) : false
    } catch (error) {
      console.error('Failed to load theme:', error)
      return false
    }
  }

  // Settings Management
  static saveSettings(settings: Record<string, any>): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  static getSettings(): Record<string, any> {
    try {
      const settings = localStorage.getItem(this.SETTINGS_KEY)
      return settings ? JSON.parse(settings) : {}
    } catch (error) {
      console.error('Failed to load settings:', error)
      return {}
    }
  }

  // Data Export/Import
  static exportData(): string {
    const userData = this.getUserData()
    const theme = this.getTheme()
    const settings = this.getSettings()
    
    return JSON.stringify({
      userData,
      theme,
      settings,
      exportDate: new Date().toISOString()
    })
  }

  static importData(dataString: string): boolean {
    try {
      const data = JSON.parse(dataString)
      
      if (data.userData) {
        this.saveUserData(data.userData)
      }
      if (typeof data.theme === 'boolean') {
        this.saveTheme(data.theme)
      }
      if (data.settings) {
        this.saveSettings(data.settings)
      }
      
      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }

  // Data Cleanup
  static clearAllData(): void {
    try {
      localStorage.removeItem(this.USER_DATA_KEY)
      localStorage.removeItem(this.THEME_KEY)
      localStorage.removeItem(this.SETTINGS_KEY)
    } catch (error) {
      console.error('Failed to clear data:', error)
    }
  }
}