import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { ChatMessage, ChatConversation, ChatContextType, ChatParticipant, OfferData } from '../types'
import { useUser } from './UserContext'

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

// Mock conversations and messages
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    participants: [
      {
        userId: '1',
        username: 'RetroGamer64',
        avatar: '🎮',
        joinedAt: new Date('2025-01-15T10:00:00'),
        isActive: true,
        lastSeen: new Date('2025-01-15T14:30:00')
      },
      {
        userId: '2',
        username: 'N64Collector',
        avatar: '🕹️',
        joinedAt: new Date('2025-01-15T10:00:00'),
        isActive: false,
        lastSeen: new Date('2025-01-15T12:00:00')
      }
    ],
    listingId: '1', // Mario 64 listing
    lastActivity: new Date('2025-01-15T14:30:00'),
    unreadCount: { '1': 0, '2': 1 },
    isActive: true,
    createdAt: new Date('2025-01-15T10:00:00')
  },
  {
    id: '2',
    participants: [
      {
        userId: '1',
        username: 'RetroGamer64',
        avatar: '🎮',
        joinedAt: new Date('2025-01-14T15:00:00'),
        isActive: true,
        lastSeen: new Date('2025-01-15T09:00:00')
      },
      {
        userId: '3',
        username: 'RetroGaming_Fan',
        avatar: '🎯',
        joinedAt: new Date('2025-01-14T15:00:00'),
        isActive: true,
        lastSeen: new Date('2025-01-15T08:45:00')
      }
    ],
    listingId: '2', // Zelda OOT listing
    lastActivity: new Date('2025-01-15T09:00:00'),
    unreadCount: { '1': 2, '3': 0 },
    isActive: true,
    createdAt: new Date('2025-01-14T15:00:00')
  }
]

const mockMessages: { [conversationId: string]: ChatMessage[] } = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: '1',
      senderName: 'RetroGamer64',
      content: 'Hallo! Ich interessiere mich für dein Super Mario 64. Ist es wirklich in mint condition?',
      type: 'text',
      createdAt: new Date('2025-01-15T10:05:00'),
      isRead: true,
      isEdited: false
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: '2',
      senderName: 'N64Collector',
      content: 'Hi! Ja, absolut! Das Spiel wurde kaum gespielt und die Verpackung ist wie neu. Ich kann gerne weitere Fotos schicken.',
      type: 'text',
      createdAt: new Date('2025-01-15T10:30:00'),
      isRead: true,
      isEdited: false
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: '1',
      senderName: 'RetroGamer64',
      content: 'Das wäre super! Würdest du auch 80€ akzeptieren?',
      type: 'offer',
      createdAt: new Date('2025-01-15T11:00:00'),
      isRead: true,
      isEdited: false,
      offerData: {
        listingId: '1',
        amount: 80,
        currency: 'EUR',
        message: 'Würdest du auch 80€ akzeptieren?',
        status: 'pending',
        expiresAt: new Date('2025-01-22T11:00:00')
      }
    },
    {
      id: 'm4',
      conversationId: '1',
      senderId: '2',
      senderName: 'N64Collector',
      content: 'Hmm, das ist etwas niedrig. Wie wäre es mit 85€? Das ist mein letzter Preis.',
      type: 'offer',
      createdAt: new Date('2025-01-15T14:30:00'),
      isRead: false,
      isEdited: false,
      offerData: {
        listingId: '1',
        amount: 85,
        currency: 'EUR',
        message: 'Wie wäre es mit 85€? Das ist mein letzter Preis.',
        status: 'countered',
        expiresAt: new Date('2025-01-22T14:30:00')
      }
    }
  ],
  '2': [
    {
      id: 'm5',
      conversationId: '2',
      senderId: '1',
      senderName: 'RetroGamer64',
      content: 'Hey! Dein Zelda OOT sieht interessant aus. Könntest du mir mehr über den Zustand erzählen?',
      type: 'text',
      createdAt: new Date('2025-01-14T15:15:00'),
      isRead: true,
      isEdited: false
    },
    {
      id: 'm6',
      conversationId: '2',
      senderId: '3',
      senderName: 'RetroGaming_Fan',
      content: 'Klar! Das Spiel läuft einwandfrei, nur die Hülle hat ein paar kleine Kratzer. Nichts dramatisches.',
      type: 'text',
      createdAt: new Date('2025-01-14T16:00:00'),
      isRead: true,
      isEdited: false
    },
    {
      id: 'm7',
      conversationId: '2',
      senderId: '3',
      senderName: 'RetroGaming_Fan',
      content: 'Ich kann dir gerne ein Foto von der Rückseite schicken, falls du möchtest.',
      type: 'text',
      createdAt: new Date('2025-01-15T08:45:00'),
      isRead: false,
      isEdited: false
    },
    {
      id: 'm8',
      conversationId: '2',
      senderId: '1',
      senderName: 'RetroGamer64',
      content: 'Das wäre toll! Danke.',
      type: 'text',
      createdAt: new Date('2025-01-15T09:00:00'),
      isRead: false,
      isEdited: false
    }
  ]
}

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useUser()
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations)
  const [activeConversation, setActiveConversationState] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<{ [conversationId: string]: ChatMessage[] }>(mockMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper function to generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Update last activity and unread counts
  const updateConversationActivity = (conversationId: string, senderId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedUnreadCount = { ...conv.unreadCount }
        // Reset unread count for sender, increment for others
        conv.participants.forEach(participant => {
          if (participant.userId === senderId) {
            updatedUnreadCount[participant.userId] = 0
          } else {
            updatedUnreadCount[participant.userId] = (updatedUnreadCount[participant.userId] || 0) + 1
          }
        })

        return {
          ...conv,
          lastActivity: new Date(),
          unreadCount: updatedUnreadCount
        }
      }
      return conv
    }))
  }

  const createConversation = async (participantIds: string[], listingId?: string): Promise<string | null> => {
    if (!user) return null

    setIsLoading(true)
    setError(null)

    try {
      // Check if conversation already exists
      const existingConv = conversations.find(conv => 
        conv.participants.length === participantIds.length + 1 &&
        conv.participants.some(p => p.userId === user.id) &&
        participantIds.every(id => conv.participants.some(p => p.userId === id)) &&
        conv.listingId === listingId
      )

      if (existingConv) {
        return existingConv.id
      }

      const conversationId = generateId()
      const now = new Date()

      // Create participants (including current user)
      const allParticipantIds = [user.id, ...participantIds]
      const participants: ChatParticipant[] = allParticipantIds.map(id => ({
        userId: id,
        username: id === user.id ? user.username : `User${id}`, // In real app, fetch from user service
        avatar: id === user.id ? user.avatar : undefined,
        joinedAt: now,
        isActive: true,
        lastSeen: now
      }))

      const newConversation: ChatConversation = {
        id: conversationId,
        participants,
        listingId,
        lastActivity: now,
        unreadCount: Object.fromEntries(allParticipantIds.map(id => [id, 0])),
        isActive: true,
        createdAt: now
      }

      setConversations(prev => [newConversation, ...prev])
      setMessages(prev => ({ ...prev, [conversationId]: [] }))

      return conversationId
    } catch (err) {
      setError('Failed to create conversation')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getConversations = async (): Promise<ChatConversation[]> => {
    if (!user) return []
    
    // Filter conversations where user is a participant
    return conversations.filter(conv => 
      conv.participants.some(p => p.userId === user.id)
    ).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  }

  const getConversation = async (conversationId: string): Promise<ChatConversation | null> => {
    return conversations.find(conv => conv.id === conversationId) || null
  }

  const setActiveConversation = (conversationId: string | null) => {
    if (conversationId) {
      const conversation = conversations.find(conv => conv.id === conversationId)
      setActiveConversationState(conversation || null)
      
      // Mark messages as read when opening conversation
      if (conversation && user) {
        markMessagesAsRead(conversationId)
      }
    } else {
      setActiveConversationState(null)
    }
  }

  const sendMessage = async (
    conversationId: string, 
    content: string, 
    type: 'text' | 'image' | 'offer' = 'text'
  ): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    setError(null)

    try {
      const messageId = generateId()
      const now = new Date()

      const newMessage: ChatMessage = {
        id: messageId,
        conversationId,
        senderId: user.id,
        senderName: user.username,
        content,
        type,
        createdAt: now,
        isRead: false,
        isEdited: false
      }

      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage]
      }))

      // Update conversation activity
      updateConversationActivity(conversationId, user.id)

      // Update last message in conversation
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: newMessage
          }
        }
        return conv
      }))

      return true
    } catch (err) {
      setError('Failed to send message')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    return messages[conversationId] || []
  }

  const markMessagesAsRead = async (conversationId: string): Promise<boolean> => {
    if (!user) return false

    try {
      // Mark messages as read
      setMessages(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map(msg => ({
          ...msg,
          isRead: msg.senderId !== user.id ? true : msg.isRead
        }))
      }))

      // Reset unread count for current user
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: {
              ...conv.unreadCount,
              [user.id]: 0
            }
          }
        }
        return conv
      }))

      return true
    } catch (err) {
      setError('Failed to mark messages as read')
      return false
    }
  }

  const editMessage = async (messageId: string, content: string): Promise<boolean> => {
    if (!user) return false

    try {
      setMessages(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(conversationId => {
          updated[conversationId] = updated[conversationId].map(msg => {
            if (msg.id === messageId && msg.senderId === user.id) {
              return {
                ...msg,
                content,
                isEdited: true,
                editedAt: new Date()
              }
            }
            return msg
          })
        })
        return updated
      })
      return true
    } catch (err) {
      setError('Failed to edit message')
      return false
    }
  }

  const sendOffer = async (
    conversationId: string, 
    offerData: Omit<OfferData, 'status' | 'expiresAt'>
  ): Promise<boolean> => {
    if (!user) return false

    const messageContent = `Angebot: ${offerData.amount} ${offerData.currency}${offerData.message ? ` - ${offerData.message}` : ''}`
    
    const messageId = generateId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const newMessage: ChatMessage = {
      id: messageId,
      conversationId,
      senderId: user.id,
      senderName: user.username,
      content: messageContent,
      type: 'offer',
      createdAt: now,
      isRead: false,
      isEdited: false,
      offerData: {
        ...offerData,
        status: 'pending',
        expiresAt
      }
    }

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }))

    updateConversationActivity(conversationId, user.id)
    return true
  }

  const respondToOffer = async (messageId: string, response: 'accepted' | 'rejected'): Promise<boolean> => {
    if (!user) return false

    try {
      setMessages(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(conversationId => {
          updated[conversationId] = updated[conversationId].map(msg => {
            if (msg.id === messageId && msg.offerData) {
              return {
                ...msg,
                offerData: {
                  ...msg.offerData,
                  status: response
                }
              }
            }
            return msg
          })
        })
        return updated
      })

      // Send system message about the response
      const conversation = Object.keys(messages).find(convId => 
        messages[convId].some(msg => msg.id === messageId)
      )
      
      if (conversation) {
        const systemMessage: ChatMessage = {
          id: generateId(),
          conversationId: conversation,
          senderId: user.id,
          senderName: user.username,
          content: response === 'accepted' ? 'Angebot angenommen!' : 'Angebot abgelehnt.',
          type: 'system',
          createdAt: new Date(),
          isRead: false,
          isEdited: false
        }

        setMessages(prev => ({
          ...prev,
          [conversation]: [...(prev[conversation] || []), systemMessage]
        }))
      }

      return true
    } catch (err) {
      setError('Failed to respond to offer')
      return false
    }
  }

  const counterOffer = async (
    messageId: string, 
    newAmount: number, 
    message?: string
  ): Promise<boolean> => {
    if (!user) return false

    try {
      // Find the original offer
      let originalOffer: ChatMessage | null = null
      let conversationId = ''

      Object.keys(messages).forEach(convId => {
        const msg = messages[convId].find(m => m.id === messageId)
        if (msg && msg.offerData) {
          originalOffer = msg
          conversationId = convId
        }
      })

      if (!originalOffer || !originalOffer.offerData) return false

      // Mark original offer as countered
      setMessages(prev => {
        const updated = { ...prev }
        updated[conversationId] = updated[conversationId].map(msg => {
          if (msg.id === messageId && msg.offerData) {
            return {
              ...msg,
              offerData: {
                ...msg.offerData,
                status: 'countered'
              }
            }
          }
          return msg
        })
        return updated
      })

      // Send counter offer
      const counterOfferData: Omit<OfferData, 'status' | 'expiresAt'> = {
        listingId: originalOffer.offerData.listingId,
        amount: newAmount,
        currency: originalOffer.offerData.currency,
        message
      }

      return await sendOffer(conversationId, counterOfferData)
    } catch (err) {
      setError('Failed to send counter offer')
      return false
    }
  }

  const contextValue: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    createConversation,
    getConversations,
    getConversation,
    setActiveConversation,
    sendMessage,
    getMessages,
    markMessagesAsRead,
    editMessage,
    sendOffer,
    respondToOffer,
    counterOffer
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}