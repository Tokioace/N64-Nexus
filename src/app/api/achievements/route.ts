import { NextRequest, NextResponse } from 'next/server';
import achievementsData from '@/data/achievements.json';
import { AchievementLogic } from '@/utils/achievementLogic';
import { Achievement, UserAchievement } from '@/types/achievement';

// In-memory storage for demo purposes (in production, use a database)
let userAchievements: UserAchievement[] = [];
let userData: any = {
  events: {},
  times: {},
  counts: {},
  community: {},
  collections: {}
};

export async function GET() {
  try {
    return NextResponse.json({
      achievements: achievementsData.achievements,
      userAchievements,
      userData
    });
  } catch (error) {
    console.error('Error loading achievements:', error);
    return NextResponse.json(
      { error: 'Failed to load achievements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'check_achievements':
        return await checkAchievements(data);
      
      case 'update_progress':
        return await updateProgress(data);
      
      case 'unlock_achievement':
        return await unlockAchievement(data);
      
      case 'get_user_stats':
        return await getUserStats();
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing achievement request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function checkAchievements(data: any) {
  const { userId, eventType, eventData } = data;
  
  // Update user data based on the event
  if (eventType === 'event_completion') {
    if (!userData.events[eventData.eventType]) {
      userData.events[eventData.eventType] = { completed: 0 };
    }
    userData.events[eventData.eventType].completed += 1;
  } else if (eventType === 'time_based') {
    userData.times[eventData.condition] = eventData.time;
  } else if (eventType === 'count_based') {
    if (!userData.counts[eventData.condition]) {
      userData.counts[eventData.condition] = 0;
    }
    userData.counts[eventData.condition] += eventData.count || 1;
  } else if (eventType === 'community_interaction') {
    if (!userData.community[eventData.condition]) {
      userData.community[eventData.condition] = 0;
    }
    userData.community[eventData.condition] += 1;
  }

  // Check all achievements
  const newlyUnlocked: Achievement[] = [];
  
  for (const achievement of achievementsData.achievements as Achievement[]) {
    // Skip if already unlocked
    const existing = userAchievements.find(ua => ua.achievementId === achievement.id);
    if (existing && existing.status === 'unlocked') {
      continue;
    }

    // Check if achievement is available (not limited by time)
    if (!AchievementLogic.isAchievementAvailable(achievement)) {
      continue;
    }

    // Check if achievement should be unlocked
    if (AchievementLogic.checkAchievementUnlock(achievement, userData)) {
      // Unlock the achievement
      const userAchievement: UserAchievement = {
        achievementId: achievement.id,
        status: 'unlocked',
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      };

      // Update or add to user achievements
      const existingIndex = userAchievements.findIndex(ua => ua.achievementId === achievement.id);
      if (existingIndex >= 0) {
        userAchievements[existingIndex] = userAchievement;
      } else {
        userAchievements.push(userAchievement);
      }

      newlyUnlocked.push(achievement);
    } else {
      // Update progress for in-progress achievements
      const progress = AchievementLogic.calculateProgress(achievement, userData);
      const status = AchievementLogic.getAchievementStatus(achievement, userData);
      
      const userAchievement: UserAchievement = {
        achievementId: achievement.id,
        status,
        progress: Math.floor(progress * 100),
        maxProgress: 100
      };

      const existingIndex = userAchievements.findIndex(ua => ua.achievementId === achievement.id);
      if (existingIndex >= 0) {
        userAchievements[existingIndex] = userAchievement;
      } else {
        userAchievements.push(userAchievement);
      }
    }
  }

  return NextResponse.json({
    success: true,
    newlyUnlocked,
    userAchievements,
    userData
  });
}

async function updateProgress(data: any) {
  const { achievementId, progress, maxProgress } = data;
  
  const existingIndex = userAchievements.findIndex(ua => ua.achievementId === achievementId);
  const userAchievement: UserAchievement = {
    achievementId,
    status: progress >= maxProgress ? 'unlocked' : 'in-progress',
    progress,
    maxProgress,
    unlockedAt: progress >= maxProgress ? new Date().toISOString() : undefined
  };

  if (existingIndex >= 0) {
    userAchievements[existingIndex] = userAchievement;
  } else {
    userAchievements.push(userAchievement);
  }

  return NextResponse.json({
    success: true,
    userAchievement,
    userAchievements
  });
}

async function unlockAchievement(data: any) {
  const { achievementId } = data;
  
  const achievement = (achievementsData.achievements as Achievement[]).find(a => a.id === achievementId);
  if (!achievement) {
    return NextResponse.json(
      { error: 'Achievement not found' },
      { status: 404 }
    );
  }

  const userAchievement: UserAchievement = {
    achievementId,
    status: 'unlocked',
    unlockedAt: new Date().toISOString(),
    progress: 1,
    maxProgress: 1
  };

  const existingIndex = userAchievements.findIndex(ua => ua.achievementId === achievementId);
  if (existingIndex >= 0) {
    userAchievements[existingIndex] = userAchievement;
  } else {
    userAchievements.push(userAchievement);
  }

  return NextResponse.json({
    success: true,
    achievement,
    userAchievement,
    userAchievements
  });
}

async function getUserStats() {
  const unlockedCount = userAchievements.filter(ua => ua.status === 'unlocked').length;
  const totalCount = achievementsData.achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const stats = {
    totalUnlocked: unlockedCount,
    totalAvailable: totalCount,
    completionPercentage,
    byCategory: {
      'game-specific': 0,
      'platform': 0,
      'community': 0,
      'collector': 0,
      'recurring': 0,
      'limited': 0
    },
    byTrophyType: {
      'bronze': 0,
      'silver': 0,
      'gold': 0,
      'platinum': 0
    },
    byRarity: {
      'common': 0,
      'uncommon': 0,
      'rare': 0,
      'epic': 0,
      'legendary': 0
    },
    totalXP: 0,
    recentUnlocks: [] as Achievement[]
  };

  // Calculate detailed stats
  for (const userAchievement of userAchievements) {
    if (userAchievement.status === 'unlocked') {
      const achievement = (achievementsData.achievements as Achievement[]).find(a => a.id === userAchievement.achievementId);
      if (achievement) {
        stats.byCategory[achievement.category as keyof typeof stats.byCategory]++;
        stats.byTrophyType[achievement.trophyType as keyof typeof stats.byTrophyType]++;
        stats.byRarity[achievement.rarity as keyof typeof stats.byRarity]++;
        stats.totalXP += achievement.xpReward;
        
        if (userAchievement.unlockedAt) {
          stats.recentUnlocks.push(achievement);
        }
      }
    }
  }

  // Sort recent unlocks by date
  stats.recentUnlocks.sort((a, b) => {
    const aDate = userAchievements.find(ua => ua.achievementId === a.id)?.unlockedAt || '';
    const bDate = userAchievements.find(ua => ua.achievementId === b.id)?.unlockedAt || '';
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  stats.recentUnlocks = stats.recentUnlocks.slice(0, 5); // Top 5 recent

  return NextResponse.json({
    success: true,
    stats,
    userAchievements,
    userData
  });
}