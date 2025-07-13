import { ProgressEntry, ProgressType, Points, UserProfile, Medal, MedalType, MedalRarity } from '../types';
import { StorageService } from './storage';
import { v4 as uuidv4 } from 'uuid';

export class ProgressService {
  // Points calculation based on activity type
  private static readonly POINTS_MAP = {
    [ProgressType.COLLECTION_ADDED]: 10,
    [ProgressType.TIME_TRIAL_COMPLETED]: 25,
    [ProgressType.EVENT_PARTICIPATED]: 50,
    [ProgressType.QUIZ_COMPLETED]: 15,
    [ProgressType.MINIGAME_COMPLETED]: 20,
    [ProgressType.DAILY_LOGIN]: 5,
    [ProgressType.WEEKLY_CHALLENGE]: 100
  };

  // Collector level thresholds
  private static readonly LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000,
    15000, 20000, 30000, 40000, 50000, 75000, 100000
  ];

  // Medal definitions
  private static readonly MEDAL_DEFINITIONS = [
    {
      id: 'first_collection',
      name: 'Erste Schritte',
      description: 'Fügte dein erstes Spiel zur Sammlung hinzu',
      type: MedalType.COLLECTION,
      rarity: MedalRarity.BRONZE,
      condition: (profile: UserProfile) => profile.points.collection >= 10
    },
    {
      id: 'collection_master',
      name: 'Sammler-Meister',
      description: 'Sammle 50 Spiele',
      type: MedalType.COLLECTION,
      rarity: MedalRarity.SILVER,
      condition: (profile: UserProfile) => profile.points.collection >= 500
    },
    {
      id: 'speedrunner',
      name: 'Speedrunner',
      description: 'Schließe 10 Zeitrennen ab',
      type: MedalType.SPEEDRUN,
      rarity: MedalRarity.GOLD,
      condition: (profile: UserProfile) => profile.points.timeTrials >= 250
    },
    {
      id: 'quiz_king',
      name: 'Quiz-König',
      description: 'Beantworte 100 Quiz-Fragen korrekt',
      type: MedalType.QUIZ,
      rarity: MedalRarity.GOLD,
      condition: (profile: UserProfile) => profile.points.quiz >= 1500
    },
    {
      id: 'event_champion',
      name: 'Event-Champion',
      description: 'Nimm an 5 Events teil',
      type: MedalType.EVENT,
      rarity: MedalRarity.SILVER,
      condition: (profile: UserProfile) => profile.points.events >= 250
    },
    {
      id: 'oldschool_collector',
      name: 'Oldschool-Sammler',
      description: 'Sammle 20 Spiele aus den Jahren 1996-2001',
      type: MedalType.SPECIAL,
      rarity: MedalRarity.PLATINUM,
      condition: (profile: UserProfile) => profile.points.collection >= 200
    },
    {
      id: 'daily_streak',
      name: 'Täglicher Besucher',
      description: 'Logge dich 7 Tage in Folge ein',
      type: MedalType.SPECIAL,
      rarity: MedalRarity.BRONZE,
      condition: (profile: UserProfile) => this.getDailyStreak() >= 7
    },
    {
      id: 'level_10',
      name: 'Level 10',
      description: 'Erreiche Sammler-Level 10',
      type: MedalType.SPECIAL,
      rarity: MedalRarity.GOLD,
      condition: (profile: UserProfile) => profile.collectorLevel >= 10
    }
  ];

  // Add progress entry and update points
  static addProgress(type: ProgressType, description: string, metadata?: Record<string, any>): void {
    const points = this.POINTS_MAP[type] || 0;
    
    const entry: ProgressEntry = {
      id: uuidv4(),
      userId: this.getCurrentUserId(),
      type,
      points,
      description,
      timestamp: new Date(),
      metadata
    };

    StorageService.addProgressEntry(entry);
    this.updateUserPoints();
    this.checkForNewMedals();
  }

  // Calculate and update user points
  static updateUserPoints(): void {
    const profile = StorageService.getUserProfile();
    if (!profile) return;

    const progress = StorageService.getProgress();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));

    const points: Points = {
      total: 0,
      daily: 0,
      weekly: 0,
      collection: 0,
      timeTrials: 0,
      events: 0,
      quiz: 0,
      minigames: 0
    };

    progress.forEach(entry => {
      points.total += entry.points;

      // Daily points
      if (entry.timestamp >= today) {
        points.daily += entry.points;
      }

      // Weekly points
      if (entry.timestamp >= weekStart) {
        points.weekly += entry.points;
      }

      // Category points
      switch (entry.type) {
        case ProgressType.COLLECTION_ADDED:
          points.collection += entry.points;
          break;
        case ProgressType.TIME_TRIAL_COMPLETED:
          points.timeTrials += entry.points;
          break;
        case ProgressType.EVENT_PARTICIPATED:
          points.events += entry.points;
          break;
        case ProgressType.QUIZ_COMPLETED:
          points.quiz += entry.points;
          break;
        case ProgressType.MINIGAME_COMPLETED:
          points.minigames += entry.points;
          break;
      }
    });

    profile.points = points;
    profile.collectorLevel = this.calculateCollectorLevel(points.total);
    
    StorageService.saveUserProfile(profile);
  }

  // Calculate collector level based on total points
  static calculateCollectorLevel(totalPoints: number): number {
    for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalPoints >= this.LEVEL_THRESHOLDS[i]) {
        return i;
      }
    }
    return 0;
  }

  // Check for new medals and award them
  static checkForNewMedals(): void {
    const profile = StorageService.getUserProfile();
    if (!profile) return;

    const newMedals: Medal[] = [];

    this.MEDAL_DEFINITIONS.forEach(medalDef => {
      // Check if user already has this medal
      const hasMedal = profile.medals.some(medal => medal.id === medalDef.id);
      
      if (!hasMedal && medalDef.condition(profile)) {
        const medal: Medal = {
          id: medalDef.id,
          name: medalDef.name,
          description: medalDef.description,
          type: medalDef.type,
          rarity: medalDef.rarity,
          earnedAt: new Date(),
          icon: this.getMedalIcon(medalDef.rarity)
        };
        
        newMedals.push(medal);
      }
    });

    if (newMedals.length > 0) {
      profile.medals.push(...newMedals);
      StorageService.saveUserProfile(profile);
      
      // Trigger notification for new medals
      this.notifyNewMedals(newMedals);
    }
  }

  // Get medal icon based on rarity
  private static getMedalIcon(rarity: MedalRarity): string {
    const icons = {
      [MedalRarity.BRONZE]: '🥉',
      [MedalRarity.SILVER]: '🥈',
      [MedalRarity.GOLD]: '🥇',
      [MedalRarity.PLATINUM]: '💎',
      [MedalRarity.LEGENDARY]: '👑'
    };
    return icons[rarity] || '🏅';
  }

  // Get daily streak
  private static getDailyStreak(): number {
    const progress = StorageService.getProgress();
    const dailyLogins = progress.filter(entry => 
      entry.type === ProgressType.DAILY_LOGIN
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (dailyLogins.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i < dailyLogins.length; i++) {
      const currentDate = new Date(dailyLogins[i].timestamp);
      currentDate.setHours(0, 0, 0, 0);
      
      const previousDate = new Date(dailyLogins[i - 1].timestamp);
      previousDate.setHours(0, 0, 0, 0);
      
      const diffDays = (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Get current user ID (placeholder - would come from auth system)
  private static getCurrentUserId(): string {
    const profile = StorageService.getUserProfile();
    return profile?.id || 'anonymous';
  }

  // Notify about new medals (placeholder for future notification system)
  private static notifyNewMedals(medals: Medal[]): void {
    medals.forEach(medal => {
      console.log(`🏆 Neue Medaille erhalten: ${medal.name} - ${medal.description}`);
      // Here you would integrate with a notification system
    });
  }

  // Get progress statistics
  static getProgressStats(): {
    totalPoints: number;
    dailyPoints: number;
    weeklyPoints: number;
    collectorLevel: number;
    medalsCount: number;
    dailyStreak: number;
  } {
    const profile = StorageService.getUserProfile();
    if (!profile) {
      return {
        totalPoints: 0,
        dailyPoints: 0,
        weeklyPoints: 0,
        collectorLevel: 0,
        medalsCount: 0,
        dailyStreak: 0
      };
    }

    return {
      totalPoints: profile.points.total,
      dailyPoints: profile.points.daily,
      weeklyPoints: profile.points.weekly,
      collectorLevel: profile.collectorLevel,
      medalsCount: profile.medals.length,
      dailyStreak: this.getDailyStreak()
    };
  }

  // Reset daily points (should be called daily)
  static resetDailyPoints(): void {
    const profile = StorageService.getUserProfile();
    if (!profile) return;

    profile.points.daily = 0;
    StorageService.saveUserProfile(profile);
  }

  // Reset weekly points (should be called weekly)
  static resetWeeklyPoints(): void {
    const profile = StorageService.getUserProfile();
    if (!profile) return;

    profile.points.weekly = 0;
    StorageService.saveUserProfile(profile);
  }
}