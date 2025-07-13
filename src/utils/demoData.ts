import { NotificationType, NotificationPriority, TrophyRarity, TrophyCategory } from '../types';

// Demo notification data
export const demoNotifications = [
  {
    type: NotificationType.EVENT,
    priority: NotificationPriority.HIGH,
    title: '🎮 Neues Event: GlitchCup 2024',
    message: 'Das neue Speedrun-Event ist jetzt verfügbar! Schließe alle Level unter 2 Minuten ab.',
    icon: '🎮',
    userId: 'demo-user',
    actionUrl: '/events/glitchcup-2024'
  },
  {
    type: NotificationType.TROPHY,
    priority: NotificationPriority.HIGH,
    title: '🏆 Neue Trophäe freigeschaltet!',
    message: 'Du hast die Gold-Trophäe "Speed Demon" gewonnen! +200 XP',
    icon: '🏆',
    userId: 'demo-user',
    actionUrl: '/trophies'
  },
  {
    type: NotificationType.RANKING,
    priority: NotificationPriority.MEDIUM,
    title: '🏅 Neue Platzierung in der Rangliste',
    message: 'Du bist auf Platz 3 in der Speedrun-Rangliste aufgestiegen!',
    icon: '🏅',
    userId: 'demo-user',
    actionUrl: '/rankings'
  },
  {
    type: NotificationType.FANART,
    priority: NotificationPriority.LOW,
    title: '🎨 Neues Fanart bewertet',
    message: 'Dein Fanart "Mario in Space" hat 5 Sterne erhalten!',
    icon: '🎨',
    userId: 'demo-user',
    actionUrl: '/fanart/mario-in-space'
  },
  {
    type: NotificationType.LEVEL_UP,
    priority: NotificationPriority.HIGH,
    title: '⭐ Level-Up!',
    message: 'Du bist auf Level 15 aufgestiegen! Neue Features freigeschaltet.',
    icon: '⭐',
    userId: 'demo-user',
    actionUrl: '/profile'
  },
  {
    type: NotificationType.COMMENT,
    priority: NotificationPriority.LOW,
    title: '💬 Neuer Kommentar',
    message: 'User "RetroGamer" hat dein Speedrun kommentiert: "Unglaubliche Zeit!"',
    icon: '💬',
    userId: 'demo-user',
    actionUrl: '/speedruns/123'
  },
  {
    type: NotificationType.FRIEND_REQUEST,
    priority: NotificationPriority.MEDIUM,
    title: '👥 Neue Freundschaftsanfrage',
    message: 'User "SpeedRunner99" möchte dich als Freund hinzufügen.',
    icon: '👥',
    userId: 'demo-user',
    actionUrl: '/friends/requests'
  },
  {
    type: NotificationType.TRADE,
    priority: NotificationPriority.MEDIUM,
    title: '🔄 Trade-Anfrage',
    message: 'User "Collector" möchte deine "Rare Item" gegen "Epic Item" tauschen.',
    icon: '🔄',
    userId: 'demo-user',
    actionUrl: '/trades/456'
  }
];

// Demo trophy data
export const demoTrophies = [
  {
    id: '1',
    name: 'Erste Schritte',
    description: 'Schließe dein erstes Event erfolgreich ab',
    rarity: TrophyRarity.BRONZE,
    category: TrophyCategory.SPEEDRUN,
    icon: '🏃',
    xpValue: 50,
    userId: 'demo-user',
    unlockedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Speed Demon',
    description: 'Schließe 5 Speedrun-Events unter der Ziellinie ab',
    rarity: TrophyRarity.SILVER,
    category: TrophyCategory.SPEEDRUN,
    icon: '⚡',
    xpValue: 100,
    userId: 'demo-user',
    unlockedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Kunstmeister',
    description: 'Erstelle 10 Fanart-Werke mit 5-Sterne-Bewertung',
    rarity: TrophyRarity.GOLD,
    category: TrophyCategory.FANART,
    icon: '🎨',
    xpValue: 200,
    userId: 'demo-user',
    unlockedAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: 'Quiz-Meister',
    description: 'Beantworte 50 Quiz-Fragen korrekt',
    rarity: TrophyRarity.BRONZE,
    category: TrophyCategory.QUIZ,
    icon: '🧠',
    xpValue: 75,
    userId: 'demo-user',
    unlockedAt: new Date('2024-01-25')
  },
  {
    id: '5',
    name: 'Sammler',
    description: 'Sammle 100 verschiedene Items',
    rarity: TrophyRarity.SILVER,
    category: TrophyCategory.COLLECTION,
    icon: '📦',
    xpValue: 150,
    userId: 'demo-user',
    unlockedAt: new Date('2024-02-05')
  },
  {
    id: '6',
    name: 'Team Player',
    description: 'Gewinne 10 Team-Events',
    rarity: TrophyRarity.GOLD,
    category: TrophyCategory.TEAM,
    icon: '👥',
    xpValue: 250,
    userId: 'demo-user',
    unlockedAt: new Date('2024-02-10')
  },
  {
    id: '7',
    name: 'Halloween Hero',
    description: 'Gewinne das Halloween-Special Event',
    rarity: TrophyRarity.SILVER,
    category: TrophyCategory.SPECIAL,
    icon: '🎃',
    xpValue: 125,
    userId: 'demo-user',
    unlockedAt: new Date('2024-10-31')
  },
  {
    id: '8',
    name: 'Battle64 Meister',
    description: 'Sammle alle Trophäen in allen Kategorien',
    rarity: TrophyRarity.PLATINUM,
    category: TrophyCategory.SPECIAL,
    icon: '👑',
    xpValue: 500,
    userId: 'demo-user'
  }
];

// Demo utility functions
export const getRandomNotification = () => {
  const randomIndex = Math.floor(Math.random() * demoNotifications.length);
  return demoNotifications[randomIndex];
};

export const getRandomTrophy = () => {
  const unlockedTrophies = demoTrophies.filter(t => !t.unlockedAt);
  const randomIndex = Math.floor(Math.random() * unlockedTrophies.length);
  return unlockedTrophies[randomIndex];
};

export const getTrophyByRarity = (rarity: TrophyRarity) => {
  return demoTrophies.find(t => t.rarity === rarity && !t.unlockedAt);
};

export const getTrophyByCategory = (category: TrophyCategory) => {
  return demoTrophies.find(t => t.category === category && !t.unlockedAt);
};

// Demo event data
export const demoEvents = [
  {
    id: '1',
    title: 'GlitchCup 2024',
    description: 'Das ultimative Speedrun-Event mit 10 verschiedenen Levels',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    gameId: 'super-mario-64',
    status: 'active' as const,
    participants: ['user1', 'user2', 'user3'],
    trophies: demoTrophies.filter(t => t.category === TrophyCategory.SPEEDRUN)
  },
  {
    id: '2',
    title: 'Fanart Festival',
    description: 'Zeige deine kreative Seite mit Mario-Fanart',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    gameId: 'fanart-competition',
    status: 'upcoming' as const,
    participants: [],
    trophies: demoTrophies.filter(t => t.category === TrophyCategory.FANART)
  }
];

// Demo user data
export const demoUser = {
  id: 'demo-user',
  username: 'RetroGamer64',
  email: 'demo@battle64.com',
  avatar: '/avatars/retro-gamer.png',
  level: 15,
  xp: 2750,
  notificationSettings: {
    pushEnabled: true,
    emailEnabled: false,
    inAppEnabled: true,
    filters: [NotificationType.EVENT, NotificationType.TROPHY],
    soundEnabled: true
  },
  trophies: demoTrophies.filter(t => t.unlockedAt)
};

// Demo statistics
export const getDemoStats = () => {
  const unlockedTrophies = demoTrophies.filter(t => t.unlockedAt);
  const totalXP = unlockedTrophies.reduce((sum, t) => sum + t.xpValue, 0);
  
  return {
    totalTrophies: unlockedTrophies.length,
    totalXP,
    platinumTrophies: unlockedTrophies.filter(t => t.rarity === TrophyRarity.PLATINUM).length,
    goldTrophies: unlockedTrophies.filter(t => t.rarity === TrophyRarity.GOLD).length,
    silverTrophies: unlockedTrophies.filter(t => t.rarity === TrophyRarity.SILVER).length,
    bronzeTrophies: unlockedTrophies.filter(t => t.rarity === TrophyRarity.BRONZE).length,
    completionRate: Math.round((unlockedTrophies.length / demoTrophies.length) * 100)
  };
};

// Demo collection progress
export const getDemoCollectionProgress = () => {
  const unlockedTrophies = demoTrophies.filter(t => t.unlockedAt);
  
  return {
    [TrophyCategory.SPEEDRUN]: {
      unlocked: unlockedTrophies.filter(t => t.category === TrophyCategory.SPEEDRUN).length,
      total: demoTrophies.filter(t => t.category === TrophyCategory.SPEEDRUN).length,
      percentage: Math.round((unlockedTrophies.filter(t => t.category === TrophyCategory.SPEEDRUN).length / demoTrophies.filter(t => t.category === TrophyCategory.SPEEDRUN).length) * 100)
    },
    [TrophyCategory.FANART]: {
      unlocked: unlockedTrophies.filter(t => t.category === TrophyCategory.FANART).length,
      total: demoTrophies.filter(t => t.category === TrophyCategory.FANART).length,
      percentage: Math.round((unlockedTrophies.filter(t => t.category === TrophyCategory.FANART).length / demoTrophies.filter(t => t.category === TrophyCategory.FANART).length) * 100)
    },
    [TrophyCategory.QUIZ]: {
      unlocked: unlockedTrophies.filter(t => t.category === TrophyCategory.QUIZ).length,
      total: demoTrophies.filter(t => t.category === TrophyCategory.QUIZ).length,
      percentage: Math.round((unlockedTrophies.filter(t => t.category === TrophyCategory.QUIZ).length / demoTrophies.filter(t => t.category === TrophyCategory.QUIZ).length) * 100)
    },
    [TrophyCategory.COLLECTION]: {
      unlocked: unlockedTrophies.filter(t => t.category === TrophyCategory.COLLECTION).length,
      total: demoTrophies.filter(t => t.category === TrophyCategory.COLLECTION).length,
      percentage: Math.round((unlockedTrophies.filter(t => t.category === TrophyCategory.COLLECTION).length / demoTrophies.filter(t => t.category === TrophyCategory.COLLECTION).length) * 100)
    },
    [TrophyCategory.TEAM]: {
      unlocked: unlockedTrophies.filter(t => t.category === TrophyCategory.TEAM).length,
      total: demoTrophies.filter(t => t.category === TrophyCategory.TEAM).length,
      percentage: Math.round((unlockedTrophies.filter(t => t.category === TrophyCategory.TEAM).length / demoTrophies.filter(t => t.category === TrophyCategory.TEAM).length) * 100)
    },
    [TrophyCategory.SPECIAL]: {
      unlocked: unlockedTrophies.filter(t => t.category === TrophyCategory.SPECIAL).length,
      total: demoTrophies.filter(t => t.category === TrophyCategory.SPECIAL).length,
      percentage: Math.round((unlockedTrophies.filter(t => t.category === TrophyCategory.SPECIAL).length / demoTrophies.filter(t => t.category === TrophyCategory.SPECIAL).length) * 100)
    }
  };
};