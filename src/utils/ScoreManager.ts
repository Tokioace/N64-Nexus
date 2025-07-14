export interface Score {
  xp: number
  level: number
  achievements: number
}

export class ScoreManager {
  private static readonly XP_PER_LEVEL = 1000
  private static readonly XP_PER_SPEEDRUN = 100
  private static readonly XP_PER_ACHIEVEMENT = 500
  private static readonly XP_PER_EVENT = 200

  static calculateLevel(xp: number): number {
    return Math.floor(xp / this.XP_PER_LEVEL) + 1
  }

  static calculateXPForLevel(level: number): number {
    return (level - 1) * this.XP_PER_LEVEL
  }

  static calculateProgressToNextLevel(xp: number): number {
    const currentLevel = this.calculateLevel(xp)
    const xpForCurrentLevel = this.calculateXPForLevel(currentLevel)
    const xpForNextLevel = this.calculateXPForLevel(currentLevel + 1)
    const xpInCurrentLevel = xp - xpForCurrentLevel
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel
    
    return (xpInCurrentLevel / xpNeededForNextLevel) * 100
  }

  static addSpeedrunXP(currentXP: number): number {
    return currentXP + this.XP_PER_SPEEDRUN
  }

  static addAchievementXP(currentXP: number): number {
    return currentXP + this.XP_PER_ACHIEVEMENT
  }

  static addEventXP(currentXP: number): number {
    return currentXP + this.XP_PER_EVENT
  }

  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  static parseTime(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(':').map(Number)
    return hours * 3600 + minutes * 60 + seconds
  }

  static compareTimes(time1: string, time2: string): number {
    const seconds1 = this.parseTime(time1)
    const seconds2 = this.parseTime(time2)
    return seconds1 - seconds2
  }

  static isPersonalBest(currentTime: string, personalBest: string): boolean {
    return this.compareTimes(currentTime, personalBest) < 0
  }

  static isWorldRecord(currentTime: string, worldRecord: string): boolean {
    return this.compareTimes(currentTime, worldRecord) < 0
  }
}