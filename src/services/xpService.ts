import { UserLevel, XPHistory, XPSource, XP_REWARDS, LEVEL_CURVE, LEVEL_REWARDS, LevelReward } from '../types/xp';

export class XPService {
  private static instance: XPService;
  private userLevel: UserLevel;
  private eventParticipation: Set<string> = new Set();

  private constructor() {
    this.userLevel = {
      currentLevel: 1,
      currentXP: 0,
      xpToNextLevel: 100,
      totalXP: 0,
      xpHistory: [],
      rewards: [...LEVEL_REWARDS]
    };
    this.calculateLevel();
  }

  public static getInstance(): XPService {
    if (!XPService.instance) {
      XPService.instance = new XPService();
    }
    return XPService.instance;
  }

  public getUserLevel(): UserLevel {
    return { ...this.userLevel };
  }

  public addXP(source: XPSource, eventId?: string): { success: boolean; message: string; levelUp?: boolean; newRewards?: LevelReward[] } {
    const reward = XP_REWARDS[source];
    
    // Anti-spam check for event participation
    if (reward.maxPerEvent && eventId) {
      const eventKey = `${source}_${eventId}`;
      if (this.eventParticipation.has(eventKey)) {
        return { success: false, message: 'XP bereits für dieses Event erhalten' };
      }
      this.eventParticipation.add(eventKey);
    }

    // Check for duplicate fanart uploads (simplified check)
    if (source === 'fanart_upload') {
      const recentUploads = this.userLevel.xpHistory
        .filter(h => h.source === 'fanart_upload')
        .filter(h => Date.now() - h.timestamp.getTime() < 24 * 60 * 60 * 1000); // Last 24 hours
      
      if (recentUploads.length > 5) {
        return { success: false, message: 'Zu viele Fanart-Uploads in kurzer Zeit' };
      }
    }

    // Check for duplicate trade completions (prevent spam)
    if (source === 'trade_completed') {
      const recentTrades = this.userLevel.xpHistory
        .filter(h => h.source === 'trade_completed')
        .filter(h => Date.now() - h.timestamp.getTime() < 60 * 60 * 1000); // Last hour
      
      if (recentTrades.length > 3) {
        return { success: false, message: 'Zu viele Tausch-Aktionen in kurzer Zeit' };
      }
    }

    const oldLevel = this.userLevel.currentLevel;
    
    // Add XP
    this.userLevel.currentXP += reward.amount;
    this.userLevel.totalXP += reward.amount;

    // Add to history
    const historyEntry: XPHistory = {
      id: Date.now().toString(),
      amount: reward.amount,
      source: source,
      timestamp: new Date(),
      description: reward.description
    };

    this.userLevel.xpHistory.unshift(historyEntry);
    
    // Keep only last 5 entries
    if (this.userLevel.xpHistory.length > 5) {
      this.userLevel.xpHistory = this.userLevel.xpHistory.slice(0, 5);
    }

    // Calculate new level
    this.calculateLevel();
    
    const levelUp = this.userLevel.currentLevel > oldLevel;
    let newRewards: LevelReward[] = [];
    
    if (levelUp) {
      newRewards = this.updateRewards();
    }

    return { 
      success: true, 
      message: `+${reward.amount} XP erhalten!`,
      levelUp,
      newRewards: newRewards.length > 0 ? newRewards : undefined
    };
  }

  private calculateLevel(): void {
    let newLevel = 1;
    
    for (let i = 0; i < LEVEL_CURVE.length; i++) {
      if (this.userLevel.totalXP >= LEVEL_CURVE[i]) {
        newLevel = i + 1;
      } else {
        break;
      }
    }

    this.userLevel.currentLevel = newLevel;
    
    // Calculate XP to next level
    if (newLevel < LEVEL_CURVE.length) {
      this.userLevel.xpToNextLevel = LEVEL_CURVE[newLevel] - this.userLevel.totalXP;
    } else {
      this.userLevel.xpToNextLevel = 0; // Max level reached
    }
  }

  private updateRewards(): LevelReward[] {
    const oldRewards = [...this.userLevel.rewards];
    this.userLevel.rewards = this.userLevel.rewards.map(reward => ({
      ...reward,
      unlocked: this.userLevel.currentLevel >= reward.level
    }));
    
    // Return newly unlocked rewards
    return this.userLevel.rewards.filter((reward, index) => 
      reward.unlocked && !oldRewards[index].unlocked
    );
  }

  public getLevelProgress(): { current: number; next: number; percentage: number } {
    const currentLevelXP = LEVEL_CURVE[this.userLevel.currentLevel - 1] || 0;
    const nextLevelXP = LEVEL_CURVE[this.userLevel.currentLevel] || this.userLevel.totalXP;
    const currentLevelProgress = this.userLevel.totalXP - currentLevelXP;
    const levelRange = nextLevelXP - currentLevelXP;
    
    return {
      current: currentLevelProgress,
      next: levelRange,
      percentage: levelRange > 0 ? (currentLevelProgress / levelRange) * 100 : 100
    };
  }

  public getUnlockedRewards(): LevelReward[] {
    return this.userLevel.rewards.filter(reward => reward.unlocked);
  }

  public getNextReward(): LevelReward | null {
    return this.userLevel.rewards.find(reward => !reward.unlocked) || null;
  }

  public resetForTesting(): void {
    this.userLevel = {
      currentLevel: 1,
      currentXP: 0,
      xpToNextLevel: 100,
      totalXP: 0,
      xpHistory: [],
      rewards: [...LEVEL_REWARDS]
    };
    this.eventParticipation.clear();
    this.calculateLevel();
  }

  public getCommunityComparison(): Array<{
    name: string;
    level: number;
    xp: number;
    xpToNext: number;
    distance: number;
  }> {
    // Mock community data - in a real app, this would come from a database
    const communityMembers = [
      { name: 'Sergio', level: 12, xp: 7800, xpToNext: 1300 },
      { name: 'Alex', level: 15, xp: 10500, xpToNext: 1500 },
      { name: 'Maya', level: 8, xp: 3600, xpToNext: 900 },
      { name: 'Tom', level: 20, xp: 19000, xpToNext: 0 },
      { name: 'Lisa', level: 5, xp: 1000, xpToNext: 500 },
      { name: 'Max', level: 18, xp: 15300, xpToNext: 1800 }
    ];

    return communityMembers.map(member => ({
      ...member,
      distance: Math.abs(member.xp - this.userLevel.totalXP)
    })).sort((a, b) => a.distance - b.distance);
  }

  public getLevelTitle(level: number): string {
    const titles = [
      'Retro Rookie',
      'Pixel Pioneer', 
      'N64 Navigator',
      'Game Master',
      'Retro Commander',
      'Level Legend',
      'Pixel Master',
      'Gaming Guru',
      'Nostalgia Knight',
      'Elite Gamer',
      'Retro Royalty',
      'Pixel Prince',
      'Gaming Grandmaster',
      'N64 Noble',
      'Beta Tester',
      'Retro Regent',
      'Pixel Emperor',
      'Gaming God',
      'N64 Legend',
      'Community Creator'
    ];
    
    return titles[level - 1] || 'Level Up!';
  }
}