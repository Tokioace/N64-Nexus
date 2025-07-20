import React, { useEffect } from 'react'
import { useEvents } from '../contexts/EventContext'
import { useUser } from '../contexts/UserContext'
import LiveLeaderboard from '../components/Event/LiveLeaderboard'
import EventMedal, { EventMedalCollection, EventMedalStats } from '../components/Event/EventMedal'
import TeamEventManager from '../components/Event/TeamEventManager'
import SimpleCard from '../components/SimpleCard'
import SimpleButton from '../components/SimpleButton'
import { Trophy, Users, Award, Star, Sparkles } from 'lucide-react'

const EventFeaturesDemo: React.FC = () => {
  const { user } = useUser()
  const { events, getUserMedals, awardMedal, getEventById } = useEvents()

  // Find team events for demo
  const teamEvents = events.filter(event => event.isTeamEvent)
  const regularEvents = events.filter(event => !event.isTeamEvent && event.isActive)

  useEffect(() => {
    // Award some demo medals to the current user for demonstration
    if (user && getUserMedals(user.id).length === 0) {
      // Award medals from different events
      setTimeout(() => {
        awardMedal('event001', user.id, 'gold', 1)
        awardMedal('event002', user.id, 'silver', 5)
        awardMedal('event003', user.id, 'bronze', 12)
        awardMedal('event004', user.id, 'gold', 1)
        awardMedal('event005', user.id, 'silver', 3)
      }, 1000)
    }
  }, [user, getUserMedals, awardMedal])

  const userMedals = user ? getUserMedals(user.id) : []

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Event Features Demo
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </h1>
        <p className="text-gray-400 text-lg">
          Entdecke die neuen Event-Features: Live Leaderboards, Medaillen und Team-Events!
        </p>
      </div>

      {/* Feature Overview */}
      <SimpleCard className="p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">🚀 Neue Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Live Leaderboard</h3>
            <p className="text-gray-300 text-sm">
              Echtzeit-Ranglisten mit Animationen und automatischen Updates alle 30 Sekunden.
            </p>
          </div>
          <div className="text-center">
            <Award className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Event Medaillen</h3>
            <p className="text-gray-300 text-sm">
              Sammle Gold-, Silber- und Bronzemedaillen für deine Leistungen in Events.
            </p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Team Events</h3>
            <p className="text-gray-300 text-sm">
              Erstelle Teams oder tritt bestehenden bei für gemeinsame Herausforderungen.
            </p>
          </div>
        </div>
      </SimpleCard>

      {/* Medal Collection Demo */}
      <SimpleCard className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-400" />
          Deine Medaillen-Sammlung
        </h2>
        
        {userMedals.length > 0 && (
          <div className="mb-6">
            <EventMedalStats medals={userMedals} />
          </div>
        )}
        
        <EventMedalCollection 
          medals={userMedals} 
          maxDisplay={10} 
          size="large"
          animated={true}
          className="justify-center mb-6"
        />

        {userMedals.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Noch keine Medaillen gesammelt</p>
            <p className="text-sm">Nimm an Events teil, um Medaillen zu verdienen!</p>
          </div>
        )}
      </SimpleCard>

      {/* Individual Medal Examples */}
      {userMedals.length > 0 && (
        <SimpleCard className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Medaillen-Beispiele</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userMedals.slice(0, 3).map((medal) => (
              <div key={medal.id} className="text-center">
                <EventMedal 
                  medal={medal} 
                  size="large" 
                  showTooltip={true}
                  animated={true}
                  className="mx-auto mb-3"
                />
                <div className="text-white font-medium">{medal.eventTitle}</div>
                <div className="text-gray-400 text-sm">{medal.condition}</div>
              </div>
            ))}
          </div>
        </SimpleCard>
      )}

      {/* Team Events Demo */}
      {teamEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-400" />
            Team Event Demo
          </h2>
          <TeamEventManager 
            event={teamEvents[0]}
            onTeamCreated={(team) => console.log('Demo: Team created:', team)}
            onTeamJoined={(team) => console.log('Demo: Joined team:', team)}
          />
        </div>
      )}

      {/* Live Leaderboard Demo */}
      {regularEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Live Leaderboard Demo
          </h2>
          <LiveLeaderboard 
            eventId={regularEvents[0].id}
            maxEntries={10}
            autoRefresh={true}
            refreshInterval={30000}
            showAnimations={true}
            showTeamInfo={false}
          />
        </div>
      )}

      {/* Feature Details */}
      <SimpleCard className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">🛠️ Technische Details</h2>
        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Live Leaderboard</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Automatische Updates alle 30 Sekunden</li>
              <li>Animierte Platzierungsänderungen</li>
              <li>Top 3 Podium mit besonderen Hervorhebungen</li>
              <li>Unterstützung für Team-Informationen</li>
              <li>Echtzeit-Status-Anzeigen (Live, Verifiziert, etc.)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Medaillen-System</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Gold (1. Platz), Silber (Top 10%), Bronze (Teilnahme)</li>
              <li>Tooltips mit Event-Details und Datum</li>
              <li>Animierte Einblendungen</li>
              <li>Statistik-Übersicht nach Medaillen-Typ</li>
              <li>Integration in Benutzerprofile</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Team-Events</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Flexible Teamgrößen (2-4 Spieler)</li>
              <li>Team-Erstellung und -Beitritt</li>
              <li>Durchschnittszeit-Berechnung für Teamrankings</li>
              <li>Team-Leader-System</li>
              <li>Suchfunktion und Filter für Teams</li>
            </ul>
          </div>
        </div>
      </SimpleCard>

      {/* Call to Action */}
      <SimpleCard className="p-6 text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <h2 className="text-2xl font-bold text-white mb-4">🎮 Bereit für das nächste Level?</h2>
        <p className="text-gray-300 mb-6">
          Diese Features bringen mehr Gamification, soziale Interaktion und langfristige Motivation 
          in das Battle64 Event-System. Perfekt für die retro N64-Community!
        </p>
        <div className="flex justify-center gap-4">
          <SimpleButton variant="primary" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Event beitreten
          </SimpleButton>
          <SimpleButton variant="secondary" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team erstellen
          </SimpleButton>
        </div>
      </SimpleCard>
    </div>
  )
}

export default EventFeaturesDemo