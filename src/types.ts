export interface User {
  id: string
  username: string
  avatar: string
  level: number
  xp: number
  friends: string[]
  challenges: string[]
  privacy: 'public' | 'friends' | 'private'
}

export interface Friend {
  id: string
  username: string
  avatar: string
  status: 'online' | 'inactive' | 'away'
  level: number
  friendshipDate: Date
  badges: string[]
}

export interface Challenge {
  id: string
  type: 'speedrun' | 'fanart' | 'quiz'
  title: string
  description: string
  creator: User
  participants: Friend[]
  status: 'active' | 'completed' | 'cancelled'
  deadline: Date
  rewards: {
    xp: number
    badge?: string
  }
  results?: ChallengeResult[]
}

export interface ChallengeResult {
  participant: Friend
  submission: string // URL to screenshot/video/image
  score?: number
  completedAt: Date
}

export interface FriendRequest {
  id: string
  from: User
  to: User
  status: 'pending' | 'accepted' | 'declined'
  createdAt: Date
}

export interface Group {
  id: string
  name: string
  logo: string
  members: Friend[]
  challenges: Challenge[]
  chat: ChatMessage[]
}

export interface ChatMessage {
  id: string
  sender: Friend
  content: string
  timestamp: Date
  type: 'text' | 'image'
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}