import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useChat } from '../contexts/ChatContext'
import { useUser } from '../contexts/UserContext'
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  X,
  Check,
  Clock,
  Euro,
  DollarSign,
  AlertCircle
} from 'lucide-react'
import { ChatMessage, ChatConversation, OfferData } from '../types'

interface ChatWindowProps {
  conversationId: string
  onClose?: () => void
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onClose }) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const { 
    activeConversation, 
    messages, 
    sendMessage, 
    sendOffer, 
    respondToOffer, 
    counterOffer,
    markMessagesAsRead,
    setActiveConversation
  } = useChat()

  const [messageText, setMessageText] = useState('')
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveConversation(conversationId)
    markMessagesAsRead(conversationId)
  }, [conversationId, setActiveConversation, markMessagesAsRead])

  useEffect(() => {
    scrollToBottom()
  }, [messages[conversationId]])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return

    const success = await sendMessage(conversationId, messageText.trim())
    if (success) {
      setMessageText('')
    }
  }

  const handleSendOffer = async () => {
    if (!offerAmount || !activeConversation?.listingId) return

    const success = await sendOffer(conversationId, {
      listingId: activeConversation.listingId,
      amount: parseFloat(offerAmount),
      currency: 'EUR', // Default to EUR, in real app would be dynamic
      message: offerMessage.trim() || undefined
    })

    if (success) {
      setShowOfferModal(false)
      setOfferAmount('')
      setOfferMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatOfferTime = (date: Date) => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return t('offer.expired')
    if (diffDays === 1) return t('offer.expiresIn', { time: '1 day' })
    return t('offer.expiresIn', { time: `${diffDays} days` })
  }

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'accepted': return 'text-green-400'
      case 'rejected': return 'text-red-400'
      case 'countered': return 'text-blue-400'
      case 'expired': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isOwn = message.senderId === user?.id
    const isOffer = message.type === 'offer'
    const isSystem = message.type === 'system'

    if (isSystem) {
      return (
        <div className="flex justify-center my-2">
          <div className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
            {message.content}
          </div>
        </div>
      )
    }

    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
          {!isOwn && (
            <div className="text-xs text-gray-400 mb-1">{message.senderName}</div>
          )}
          
          <div className={`rounded-lg px-4 py-2 ${
            isOwn 
              ? 'bg-cyan-500 text-white' 
              : 'bg-gray-700 text-gray-100'
          }`}>
            {isOffer && message.offerData ? (
              <OfferMessage message={message} />
            ) : (
              <div>
                <p className="text-sm">{message.content}</p>
                {message.isEdited && (
                  <div className="text-xs opacity-70 mt-1">
                    {t('chat.edited')}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-400 mt-1 text-right">
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    )
  }

  const OfferMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const { offerData } = message
    if (!offerData) return null

    const isOwn = message.senderId === user?.id
    const canRespond = !isOwn && offerData.status === 'pending'
    const isExpired = new Date() > offerData.expiresAt

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Euro className="w-4 h-4" />
          <span className="font-semibold">
            {offerData.amount} {offerData.currency}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${getOfferStatusColor(offerData.status)}`}>
            {t(`offer.${offerData.status}`)}
          </span>
        </div>

        {offerData.message && (
          <p className="text-sm opacity-90">{offerData.message}</p>
        )}

        <div className="flex items-center text-xs opacity-70">
          <Clock className="w-3 h-3 mr-1" />
          {isExpired ? t('offer.expired') : formatOfferTime(offerData.expiresAt)}
        </div>

        {canRespond && !isExpired && (
          <div className="flex space-x-2 pt-2 border-t border-gray-600">
            <button
              onClick={() => respondToOffer(message.id, 'accepted')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              {t('offer.accept')}
            </button>
            <button
              onClick={() => respondToOffer(message.id, 'rejected')}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              {t('offer.reject')}
            </button>
            <button
              onClick={() => {
                // Open counter offer modal
                setOfferAmount(offerData.amount.toString())
                setShowOfferModal(true)
              }}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              {t('offer.counter')}
            </button>
          </div>
        )}
      </div>
    )
  }

  const OfferModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{t('offer.make')}</h3>
          <button
            onClick={() => setShowOfferModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('offer.amount')}
            </label>
            <div className="flex items-center">
              <span className="bg-gray-700 border border-gray-600 px-3 py-2 rounded-l-lg text-gray-300">
                €
              </span>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 border-l-0 rounded-r-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('offer.message')}
            </label>
            <textarea
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows={3}
              placeholder={t('offer.message')}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-6">
          <button
            onClick={() => setShowOfferModal(false)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSendOffer}
            disabled={!offerAmount}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            {t('offer.send')}
          </button>
        </div>
      </div>
    </div>
  )

  if (!activeConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">{t('common.loading')}</div>
      </div>
    )
  }

  const conversationMessages = messages[conversationId] || []
  const otherParticipant = activeConversation.participants.find(p => p.userId !== user?.id)

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              {otherParticipant?.avatar || otherParticipant?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {t('chat.conversationWith', { username: otherParticipant?.username || 'Unknown' })}
              </h3>
              {activeConversation.listingId && (
                <p className="text-sm text-gray-400">
                  {t('chat.aboutListing', { gameName: 'N64 Game' })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {activeConversation.listingId && (
              <button
                onClick={() => setShowOfferModal(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {t('offer.make')}
              </button>
            )}
            <button className="text-gray-400 hover:text-white p-2">
              <Phone className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white p-2">
              <Video className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white p-2">
              <MoreVertical className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-lg mb-2">{t('chat.startConversation')}</div>
            <div className="text-sm">{t('chat.typeMessage')}</div>
          </div>
        ) : (
          conversationMessages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-white p-2">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.typeMessage')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button className="text-gray-400 hover:text-white p-2">
            <Smile className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showOfferModal && <OfferModal />}
    </div>
  )
}

export default ChatWindow