import { User, Conversation, Message, ChatSettings, Notification } from '../types/messaging';

export const mockData = {
  currentUser: {
    id: 'current-user',
    username: 'BattleMaster64',
    avatar: '🎮',
    status: 'online' as const,
    isFriend: false,
    isBlocked: false
  },

  users: [
    {
      id: 'user-1',
      username: 'MarioFan99',
      avatar: '🍄',
      status: 'online' as const,
      isFriend: true,
      isBlocked: false
    },
    {
      id: 'user-2',
      username: 'ZeldaLegend',
      avatar: '🗡️',
      status: 'away' as const,
      isFriend: true,
      isBlocked: false
    },
    {
      id: 'user-3',
      username: 'PokemonTrainer',
      avatar: '⚡',
      status: 'busy' as const,
      isFriend: false,
      isBlocked: false
    },
    {
      id: 'user-4',
      username: 'DonkeyKong',
      avatar: '🍌',
      status: 'offline' as const,
      isFriend: true,
      isBlocked: false
    },
    {
      id: 'user-5',
      username: 'SamusAran',
      avatar: '🚀',
      status: 'online' as const,
      isFriend: false,
      isBlocked: false
    }
  ] as User[],

  conversations: [
    {
      id: 'conv-1',
      type: 'direct' as const,
      participants: [
        {
          id: 'user-1',
          username: 'MarioFan99',
          avatar: '🍄',
          status: 'online' as const,
          isFriend: true,
          isBlocked: false
        }
      ],
      lastMessage: {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Hey! Hast du schon das neue Level geschafft? 🎮',
        type: 'text' as const,
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        isLiked: false,
        isImportant: false
      },
      unreadCount: 1,
      isPinned: true,
      isMuted: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 'conv-2',
      type: 'direct' as const,
      participants: [
        {
          id: 'user-2',
          username: 'ZeldaLegend',
          avatar: '🗡️',
          status: 'away' as const,
          isFriend: true,
          isBlocked: false
        }
      ],
      lastMessage: {
        id: 'msg-2',
        conversationId: 'conv-2',
        senderId: 'current-user',
        content: 'Danke für den Tipp mit dem Boss! 👍',
        type: 'text' as const,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: true,
        isLiked: true,
        isImportant: true
      },
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 'conv-3',
      type: 'group' as const,
      participants: [
        {
          id: 'user-1',
          username: 'MarioFan99',
          avatar: '🍄',
          status: 'online' as const,
          isFriend: true,
          isBlocked: false
        },
        {
          id: 'user-4',
          username: 'DonkeyKong',
          avatar: '🍌',
          status: 'offline' as const,
          isFriend: true,
          isBlocked: false
        }
      ],
      lastMessage: {
        id: 'msg-3',
        conversationId: 'conv-3',
        senderId: 'user-4',
        content: 'Wer ist heute Abend für ein Turnier dabei? 🏆',
        type: 'text' as const,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        isLiked: false,
        isImportant: false
      },
      unreadCount: 1,
      isPinned: false,
      isMuted: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      groupName: 'Battle64 Turnier Team',
      groupAvatar: '🏆'
    },
    {
      id: 'conv-4',
      type: 'direct' as const,
      participants: [
        {
          id: 'user-3',
          username: 'PokemonTrainer',
          avatar: '⚡',
          status: 'busy' as const,
          isFriend: false,
          isBlocked: false
        }
      ],
      lastMessage: {
        id: 'msg-4',
        conversationId: 'conv-4',
        senderId: 'user-3',
        content: 'Kannst du mir bei diesem Level helfen?',
        type: 'text' as const,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: false,
        isLiked: false,
        isImportant: false
      },
      unreadCount: 1,
      isPinned: false,
      isMuted: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  ] as Conversation[],

  messages: [
    // Conversation 1 messages
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'user-1',
      content: 'Hey BattleMaster64! 👋',
      type: 'text' as const,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      isLiked: false,
      isImportant: false
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'current-user',
      content: 'Hi MarioFan99! Wie geht\'s?',
      type: 'text' as const,
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
      isRead: true,
      isLiked: false,
      isImportant: false
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'user-1',
      content: 'Hast du schon das neue Level geschafft? 🎮',
      type: 'text' as const,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      isLiked: false,
      isImportant: false
    },
    
    // Conversation 2 messages
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'user-2',
      content: 'Hey! Der Boss in Level 5 ist echt tricky...',
      type: 'text' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      isLiked: false,
      isImportant: false
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'current-user',
      content: 'Ja, ich hänge da auch fest! 😅',
      type: 'text' as const,
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      isRead: true,
      isLiked: false,
      isImportant: false
    },
    {
      id: 'msg-2-3',
      conversationId: 'conv-2',
      senderId: 'user-2',
      content: 'Probiere mal den Power-Up in der oberen rechten Ecke!',
      type: 'text' as const,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: true,
      isLiked: false,
      isImportant: true
    },
    {
      id: 'msg-2-4',
      conversationId: 'conv-2',
      senderId: 'current-user',
      content: 'Danke für den Tipp mit dem Boss! 👍',
      type: 'text' as const,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      isLiked: true,
      isImportant: true
    }
  ] as Message[],

  settings: {
    allowMessagesFrom: 'friends' as const,
    autoDeleteAfterDays: 30,
    soundEnabled: true,
    notificationEnabled: true,
    theme: 'retro-blue' as const
  } as ChatSettings,

  notifications: [
    {
      id: 'notif-1',
      type: 'message' as const,
      title: 'Neue Nachricht',
      message: 'MarioFan99 hat dir eine Nachricht geschickt',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      actionUrl: '/conv-1'
    },
    {
      id: 'notif-2',
      type: 'friend_request' as const,
      title: 'Freundschaftsanfrage',
      message: 'SamusAran möchte dein Freund werden',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: false
    }
  ] as Notification[],

  quickReplies: [
    { id: 'qr-1', text: 'Danke!', emoji: '👍' },
    { id: 'qr-2', text: 'Top!', emoji: '🔥' },
    { id: 'qr-3', text: 'Was meinst du?', emoji: '🤔' },
    { id: 'qr-4', text: 'Bin dabei!', emoji: '🎮' },
    { id: 'qr-5', text: 'Später!', emoji: '⏰' }
  ],

  stickers: [
    { id: 'sticker-1', name: 'Mario Jump', url: '🎯', category: 'actions' },
    { id: 'sticker-2', name: 'Zelda Heart', url: '❤️', category: 'emotions' },
    { id: 'sticker-3', name: 'Pokemon Ball', url: '⚡', category: 'items' },
    { id: 'sticker-4', name: 'Donkey Kong', url: '🍌', category: 'characters' }
  ]
};