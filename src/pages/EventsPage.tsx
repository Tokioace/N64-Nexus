import React, { useState } from 'react'
import { useEvent } from '../contexts/EventContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import RaceSubmissionModal, { RaceSubmissionData } from '../components/RaceSubmissionModal'
import EventLeaderboard from '../components/EventLeaderboard'
import AuthGuard from '../components/AuthGuard'
import { 
  Trophy, 
  Calendar, 
  Users, 
  Clock, 
  Target,
  Award,
  Gamepad2,
  MapPin,
  Star,
  Bell,
  BellOff,
  Info,
  Upload,
  BarChart3,
  X
} from 'lucide-react'

const EventsPage: React.FC = () => {
  const { events, activeEvents, joinEvent, leaveEvent, loading, userParticipations, submitRaceTime, getLeaderboard } = useEvent()
  const { user } = useUser()
  const { t } = useLanguage()
  const [selectedTab, setSelectedTab] = useState<'active' | 'upcoming' | 'completed'>('active')
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [showSubmissionModal, setShowSubmissionModal] = useState<string | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState<string | null>(null)

  const getEventStatus = (event: any) => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    if (now >= startDate && now <= endDate) {
      return 'active'
    } else if (now < startDate) {
      return 'upcoming'
    } else {
      return 'completed'
    }
  }

  const getTimeRemaining = (event: any) => {
    const now = new Date()
    const endDate = new Date(event.endDate)
    const timeLeft = endDate.getTime() - now.getTime()
    
    if (timeLeft <= 0) return t('events.ended')
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h ${t('time.remaining')}`
    if (hours > 0) return `${hours}h ${minutes}m ${t('time.remaining')}`
    return `${minutes}m ${t('time.remaining')}`
  }

  const isUserParticipating = (eventId: string) => {
    return userParticipations.some(p => p.eventId === eventId)
  }

  const filteredEvents = events.filter(event => {
    const status = getEventStatus(event)
    return status === selectedTab
  })

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      // Redirect to auth page instead of just showing alert
      window.location.href = '/auth'
      return
    }

    if (isUserParticipating(eventId)) {
      // If already participating, show submission modal
      setShowSubmissionModal(eventId)
      return
    }
    
    // Pass current user information to joinEvent
    const currentUser = { id: user.id, username: user.username }
    const success = await joinEvent(eventId, currentUser)
    if (success) {
      alert(t('events.joinSuccess'))
      // Automatically show submission modal after joining
      setShowSubmissionModal(eventId)
    }
  }

  const handleRaceSubmission = async (data: RaceSubmissionData): Promise<boolean> => {
    console.log('EventsPage: handleRaceSubmission called with:', data)
    
    // Pass current user information to submitRaceTime
    const currentUser = user ? { id: user.id, username: user.username } : undefined
    const success = await submitRaceTime(data, currentUser)
    console.log('EventsPage: submitRaceTime returned:', success)
    
    if (success) {
      setShowSubmissionModal(null)
      // Show leaderboard after successful submission
      setShowLeaderboard(data.eventId)
      console.log('EventsPage: Showing success alert')
      alert(t('events.submissionSuccess'))
    } else {
      console.log('EventsPage: Submission failed')
    }
    return success
  }

  const handleShowDetails = (eventId: string) => {
    setSelectedEvent(selectedEvent === eventId ? null : eventId)
  }

  const handleToggleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        // Request notification permission
        if ('Notification' in window) {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            setNotificationsEnabled(true)
            alert(t('notifications.enabled'))
          } else {
            alert(t('notifications.denied'))
          }
        } else {
          alert(t('notifications.notSupported'))
        }
      } else {
        setNotificationsEnabled(false)
        alert(t('notifications.disabled'))
      }
    } catch (error) {
      alert(t('notifications.error'))
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          Battle64 Events
        </h1>
        <p className="text-slate-400 text-lg">
          {t('events.subtitle')}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 rounded-lg p-1 inline-flex">
          {[
            { key: 'active', label: t('events.tabs.active'), icon: Trophy, color: 'text-green-400' },
            { key: 'upcoming', label: t('events.tabs.upcoming'), icon: Calendar, color: 'text-blue-400' },
            { key: 'completed', label: t('events.tabs.completed'), icon: Award, color: 'text-gray-400' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                selectedTab === tab.key
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="simple-tile text-center">
          <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {events.filter(e => getEventStatus(e) === 'active').length}
          </div>
          <div className="text-sm text-slate-400">{t('events.stats.activeEvents')}</div>
        </div>
        
        <div className="simple-tile text-center">
          <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {events.filter(e => getEventStatus(e) === 'upcoming').length}
          </div>
          <div className="text-sm text-slate-400">{t('events.stats.upcomingEvents')}</div>
        </div>
        
        <div className="simple-tile text-center">
          <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {events.reduce((sum, event) => sum + event.participants, 0)}
          </div>
          <div className="text-sm text-slate-400">{t('events.stats.totalParticipants')}</div>
        </div>
      </div>

      {/* Events List - Protected by AuthGuard */}
      <AuthGuard 
        customMessage={t('events.loginToViewEvents')}
        className="min-h-[400px]"
      >
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
          <div className="simple-tile text-center py-12">
            <Trophy className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">
              {t(`events.noEvents.${selectedTab}`)}
            </h3>
            <p className="text-slate-400">
              {t(`events.noEventsDesc.${selectedTab}`)}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const status = getEventStatus(event)
            const timeRemaining = getTimeRemaining(event)
            const isParticipating = isUserParticipating(event.id)
            const showDetails = selectedEvent === event.id
            
            return (
              <div key={event.id} className="simple-tile simple-tile-large">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : status === 'upcoming'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {status === 'active' && `🔴 ${t('events.status.live')}`}
                        {status === 'upcoming' && `📅 ${t('events.status.upcoming')}`}
                        {status === 'completed' && `✅ ${t('events.status.completed')}`}
                      </div>
                      <span className="text-sm text-slate-400">{timeRemaining}</span>
                      {isParticipating && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                          ✓ {t('events.participating')}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">{event.title}</h3>
                    <p className="text-slate-400 mb-4">{event.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Gamepad2 className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300">{event.game}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-orange-400" />
                        <span className="text-slate-300">{event.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300">
                          {event.participants} / {event.maxParticipants || '∞'} {t('events.participants')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">{event.region}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                    {status === 'active' && !isParticipating && (
                      <button 
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white 
                                 font-medium rounded-lg transition-colors duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? t('common.loading') : t('events.join')}
                      </button>
                    )}
                    {status === 'active' && isParticipating && (
                      <>
                        <button 
                          onClick={() => setShowSubmissionModal(event.id)}
                          disabled={loading}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                                   font-medium rounded-lg transition-colors duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{t('events.submitTime')}</span>
                        </button>
                        <button 
                          onClick={() => setShowLeaderboard(event.id)}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                                   font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>{t('events.leaderboard')}</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (user) {
                              const currentUser = { id: user.id, username: user.username }
                              leaveEvent(event.id, currentUser)
                            }
                          }}
                          disabled={loading}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white 
                                   font-medium rounded-lg transition-colors duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? t('common.loading') : t('events.leave')}
                        </button>
                      </>
                    )}
                    {status === 'upcoming' && !isParticipating && (
                      <button 
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                                 font-medium rounded-lg transition-colors duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? t('common.loading') : t('events.preRegister')}
                      </button>
                    )}
                    {/* Show leaderboard button for all active events */}
                    {status === 'active' && (
                      <button 
                        onClick={() => setShowLeaderboard(event.id)}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 
                                 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>{t('events.leaderboard')}</span>
                      </button>
                    )}
                    <button 
                      onClick={() => handleShowDetails(event.id)}
                      className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 
                               font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                      <Info className="w-4 h-4" />
                      <span>{showDetails ? t('events.showLess') : t('common.details')}</span>
                    </button>
                  </div>
                </div>
                
                {/* Event Details - Always visible or expandable */}
                <div className={`transition-all duration-300 ${showDetails ? 'block' : 'hidden'}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-600">
                    <div>
                      <h4 className="font-medium text-slate-200 mb-3 flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                        {t('events.rules')}
                      </h4>
                      <ul className="space-y-1">
                        {event.rules.map((rule, index) => (
                          <li key={index} className="text-sm text-slate-400 flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-200 mb-3 flex items-center">
                        <Award className="w-4 h-4 text-purple-400 mr-2" />
                        {t('events.prizes')}
                      </h4>
                      <ul className="space-y-1">
                        {event.prizes.map((prize, index) => (
                          <li key={index} className="text-sm text-slate-400 flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            {prize}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Always visible rules and prizes for better UX */}
                <div className={`${showDetails ? 'hidden' : 'block'}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-600">
                    <div>
                      <h4 className="font-medium text-slate-200 mb-3 flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                        {t('events.rules')}
                      </h4>
                      <ul className="space-y-1">
                        {event.rules.map((rule, index) => (
                          <li key={index} className="text-sm text-slate-400 flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-200 mb-3 flex items-center">
                        <Award className="w-4 h-4 text-purple-400 mr-2" />
                        {t('events.prizes')}
                      </h4>
                      <ul className="space-y-1">
                        {event.prizes.map((prize, index) => (
                          <li key={index} className="text-sm text-slate-400 flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            {prize}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
            })
          )}
        </div>
      </AuthGuard>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-slate-400 text-sm mb-4">
          {t('events.notificationPrompt')}
        </p>
        <button 
          onClick={handleToggleNotifications}
          className={`px-6 py-2 border rounded-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2 mx-auto ${
            notificationsEnabled
              ? 'bg-green-600/20 hover:bg-green-600/30 border-green-500/30 text-green-400 hover:text-green-300'
              : 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-400 hover:text-blue-300'
          }`}
        >
          {notificationsEnabled ? (
            <>
              <Bell className="w-4 h-4" />
              <span>{t('events.notificationsActive')}</span>
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4" />
              <span>{t('events.enableNotifications')}</span>
            </>
          )}
        </button>
      </div>

      {/* Race Submission Modal */}
      {showSubmissionModal && (
        <RaceSubmissionModal
          isOpen={!!showSubmissionModal}
          onClose={() => setShowSubmissionModal(null)}
          eventId={showSubmissionModal}
          eventTitle={events.find(e => e.id === showSubmissionModal)?.title || 'Event'}
          onSubmit={handleRaceSubmission}
        />
      )}

      {/* Event Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-600">
              <h2 className="text-2xl font-bold text-slate-100">{t('events.eventLeaderboard')}</h2>
              <button
                onClick={() => setShowLeaderboard(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <EventLeaderboard
                eventId={showLeaderboard}
                eventTitle={events.find(e => e.id === showLeaderboard)?.title || 'Event'}
                entries={getLeaderboard(showLeaderboard).map(participation => ({
                  id: participation.id,
                  userId: participation.userId,
                  username: participation.username,
                  time: participation.time || '0:00.000',
                  position: 1, // Will be calculated in the component
                  submissionDate: participation.submissionDate,
                  documentationType: participation.documentationType || 'photo',
                  mediaUrl: participation.mediaUrl,
                  livestreamUrl: participation.livestreamUrl,
                  verified: participation.verified,
                  notes: participation.notes
                }))}
                currentUserId={user?.id}
                onRefresh={() => {
                  // Refresh leaderboard data
                  // In a real app, this would fetch fresh data from the server
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsPage