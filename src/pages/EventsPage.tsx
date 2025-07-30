import React, { useState } from 'react'
import { useEvent } from '../contexts/EventContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import RaceSubmissionModal, { RaceSubmissionData } from '../components/RaceSubmissionModal'
import EventLeaderboard from '../components/EventLeaderboard'
import { 
  Trophy, 
  Calendar, 
  Users, 
  Clock, 
  Target,
  Award,
  Gamepad2,
  Star,
  Bell,
  BellOff,
  Info,
  Upload,
  BarChart3,
  X
} from 'lucide-react'

const EventsPage: React.FC = () => {
  const { events, joinEvent, loading, userParticipations, submitRaceTime, getLeaderboard } = useEvent()
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
      alert(t('auth.loginRequiredForEvents'))
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
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          Battle64 Events
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
          {t('events.subtitle')}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-responsive responsive-max-width">
        <div className="bg-slate-800 rounded-lg p-1 w-full max-w-md responsive-overflow-hidden">
          <div className="flex w-full">
            {[
              { key: 'active', label: t('events.tabs.active'), icon: Trophy, color: 'text-yellow-400' },
              { key: 'upcoming', label: t('events.tabs.upcoming'), icon: Calendar, color: 'text-blue-400' },
              { key: 'completed', label: t('events.tabs.completed'), icon: Award, color: 'text-gray-400' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md transition-all duration-200 text-xs sm:text-sm ${
                  selectedTab === tab.key
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${tab.color} flex-shrink-0`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Stats */}
      <div className="grid-auto-fit mb-responsive responsive-max-width">
        <div className="simple-tile text-center">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-responsive-lg font-bold text-slate-100">
            {events.filter(e => getEventStatus(e) === 'active').length}
          </div>
          <div className="text-responsive-xs text-slate-400 responsive-word-break">{t('events.stats.activeEvents')}</div>
        </div>
        
        <div className="simple-tile text-center">
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-responsive-lg font-bold text-slate-100">
            {events.filter(e => getEventStatus(e) === 'upcoming').length}
          </div>
          <div className="text-responsive-xs text-slate-400 responsive-word-break">{t('events.stats.upcomingEvents')}</div>
        </div>
        
        <div className="simple-tile text-center">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-responsive-lg font-bold text-slate-100">
            {events.reduce((sum, event) => sum + event.participants, 0)}
          </div>
          <div className="text-responsive-xs text-slate-400 responsive-word-break">{t('events.stats.totalParticipants')}</div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6 responsive-max-width">
        {filteredEvents.length === 0 ? (
          <div className="simple-tile text-center py-8 sm:py-12 responsive-max-width">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-2 responsive-word-break">
              {t(`events.noEvents.${selectedTab}`)}
            </h3>
            <p className="text-slate-400 responsive-word-break">
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
              <div key={event.id} className="simple-tile simple-tile-large responsive-max-width">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4 lg:gap-0">
                  <div className="flex-1 responsive-max-width">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : status === 'upcoming'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {status === 'active' && (
                          <>
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="hidden sm:inline">{t('events.status.live')}</span>
                            <span className="sm:hidden">{t('events.mobile.live')}</span>
                          </>
                        )}
                        {status === 'upcoming' && (
                          <>
                            <Calendar className="w-3 h-3" />
                            <span className="hidden sm:inline">{t('events.status.upcoming')}</span>
                            <span className="sm:hidden">{t('events.mobile.soon')}</span>
                          </>
                        )}
                        {status === 'completed' && (
                          <>
                            <Award className="w-3 h-3" />
                            <span className="hidden sm:inline">{t('events.status.completed')}</span>
                            <span className="sm:hidden">{t('events.mobile.done')}</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-slate-400">{timeRemaining}</span>
                      {isParticipating && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span className="hidden sm:inline">{t('events.participating')}</span>
                          <span className="sm:hidden">{t('events.mobile.joined')}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2 responsive-word-break">
                      {event.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-slate-400 mb-3 responsive-word-break">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="responsive-word-break">{event.game}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="responsive-word-break">{event.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{event.participants} participants</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="event-button-group">
                    {status === 'active' && (
                      <button
                        onClick={() => handleJoinEvent(event.id)}
                        className="btn-primary flex items-center justify-center gap-2"
                        disabled={loading}
                      >
                        {isParticipating ? (
                          <>
                            <Upload className="event-icon" />
                            <span className="hidden sm:inline lg:inline">{t('events.submitTime')}</span>
                            <span className="sm:hidden lg:hidden">{t('events.mobile.submit')}</span>
                          </>
                        ) : (
                          <>
                            <Trophy className="event-icon" />
                            <span className="hidden sm:inline lg:inline">{t('events.join')}</span>
                            <span className="sm:hidden lg:hidden">{t('events.mobile.join')}</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => setShowLeaderboard(event.id)}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <BarChart3 className="event-icon" />
                      <span className="hidden sm:inline lg:inline">{t('events.leaderboard')}</span>
                      <span className="sm:hidden lg:hidden">{t('events.mobile.board')}</span>
                    </button>
                    
                    <button
                      onClick={() => handleShowDetails(event.id)}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <Info className="event-icon" />
                      <span className="hidden sm:inline lg:inline">{showDetails ? t('common.hide') : t('common.details')}</span>
                      <span className="sm:hidden lg:hidden">{showDetails ? 'Hide' : 'Info'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Event Details */}
                {showDetails && (
                  <div className="event-tile-separator mt-6 pt-6 responsive-max-width">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-200 text-base flex items-center">
                          <Clock className="event-icon text-green-400 mr-2" />
                          {t('events.details.startDate')}
                        </h4>
                        <p className="text-base text-slate-300 font-medium">{new Date(event.startDate).toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-slate-200 text-base flex items-center">
                          <Clock className="event-icon text-red-400 mr-2" />
                          {t('events.details.endDate')}
                        </h4>
                        <p className="text-base text-slate-300 font-medium">{new Date(event.endDate).toLocaleString()}</p>
                      </div>
                      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                        <h4 className="font-semibold text-slate-200 text-base flex items-center">
                          <Target className="event-icon text-purple-400 mr-2" />
                          {t('events.details.rules')}
                        </h4>
                        <div className="text-base text-slate-300 leading-relaxed responsive-word-break">
                          {event.rules.map((rule: string, index: number) => (
                            <p key={index} className="mb-2">{rule}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {event.prizes && event.prizes.length > 0 && (
                      <div className="mt-6">
                        <div className="event-tile-separator mb-4"></div>
                        <h4 className="font-semibold text-slate-200 text-base mb-4 flex items-center">
                          <Award className="event-icon text-yellow-400 mr-2" />
                          {t('events.details.prizes')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {event.prizes.map((prize: string, index: number) => (
                            <div key={index} className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-400/20 rounded-lg p-3 shadow-sm">
                              <div className="flex items-center mb-2">
                                {index === 0 && <span className="text-lg">🥇</span>}
                                {index === 1 && <span className="text-lg">🥈</span>}
                                {index === 2 && <span className="text-lg">🥉</span>}
                                {index > 2 && <span className="text-lg">🏆</span>}
                                <span className="ml-2 font-semibold text-slate-200">#{index + 1}</span>
                              </div>
                              <span className="text-base text-slate-300 responsive-word-break">{prize}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 responsive-max-width">
        <p className="text-slate-400 text-sm mb-4 responsive-word-break">
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

      {/* Modals */}
      {showSubmissionModal && (
        <RaceSubmissionModal
          isOpen={!!showSubmissionModal}
          eventId={showSubmissionModal}
          eventTitle={events.find(e => e.id === showSubmissionModal)?.title || 'Event'}
          onClose={() => setShowSubmissionModal(null)}
          onSubmit={handleRaceSubmission}
        />
      )}

      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-bold text-slate-100">{t('events.leaderboard')}</h3>
              <button
                onClick={() => setShowLeaderboard(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
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
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsPage