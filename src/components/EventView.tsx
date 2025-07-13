import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Clock, 
  Edit,
  Copy,
  Archive,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export const EventView: React.FC = () => {
  const { id } = useParams();
  const { events, publishEvent, archiveEvent, verifySubmission } = useEventStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'results'>('overview');
  
  const event = events.find(e => e.id === id);
  
  if (!event) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-pixel text-n64-red mb-4">Event nicht gefunden</h1>
        <Link to="/events" className="retro-button">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const isActive = event.status === 'active';
  const isCompleted = event.status === 'completed';
  const isDraft = event.status === 'draft';
  
  const timeUntilStart = new Date(event.startTime).getTime() - Date.now();
  const timeUntilEnd = new Date(event.endTime).getTime() - Date.now();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-n64-green';
      case 'draft': return 'bg-n64-yellow';
      case 'completed': return 'bg-n64-blue';
      case 'published': return 'bg-n64-purple';
      case 'archived': return 'bg-retro-gray';
      default: return 'bg-retro-gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Speedrun': return 'bg-n64-red';
      case 'Fanart': return 'bg-n64-blue';
      case 'Sammlung': return 'bg-n64-green';
      case 'Glitch-Only': return 'bg-n64-orange';
      case 'Tournament': return 'bg-n64-purple';
      default: return 'bg-retro-gray';
    }
  };

  const sortedParticipants = event.participants?.sort((a, b) => {
    if (a.position && b.position) return a.position - b.position;
    if (a.score && b.score) return b.score - a.score;
    return 0;
  }) || [];

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: Eye },
    { id: 'participants', label: 'Teilnehmer', icon: Users },
    { id: 'results', label: 'Ergebnisse', icon: Trophy }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-pixel text-n64-red text-shadow">
              {event.title}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-retro ${getStatusColor(event.status)} text-white`}>
              {event.status}
            </span>
          </div>
          <p className="text-retro-gray text-lg">{event.game.title}</p>
        </div>
        
        <div className="flex space-x-2">
          {isDraft && (
            <button
              onClick={() => publishEvent(event.id)}
              className="retro-button flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Veröffentlichen</span>
            </button>
          )}
          
          {isActive && (
            <button
              onClick={() => {/* TODO: End event */}}
              className="bg-n64-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded border-2 border-orange-400 transition-all duration-200"
            >
              <Pause className="h-4 w-4 inline mr-2" />
              Beenden
            </button>
          )}
          
          <Link
            to={`/events/${event.id}/edit`}
            className="bg-n64-yellow hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded border-2 border-yellow-400 transition-all duration-200"
          >
            <Edit className="h-4 w-4 inline mr-2" />
            Bearbeiten
          </Link>
          
          <button
            onClick={() => archiveEvent(event.id)}
            className="bg-retro-gray hover:bg-gray-600 text-white font-bold py-2 px-4 rounded border-2 border-gray-400 transition-all duration-200"
          >
            <Archive className="h-4 w-4 inline mr-2" />
            Archivieren
          </button>
        </div>
      </div>

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="retro-card">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-n64-blue" />
            <div>
              <p className="text-retro-gray text-sm">Start</p>
              <p className="font-retro text-retro-white">
                {new Date(event.startTime).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        </div>

        <div className="retro-card">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-n64-green" />
            <div>
              <p className="text-retro-gray text-sm">Ende</p>
              <p className="font-retro text-retro-white">
                {new Date(event.endTime).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        </div>

        <div className="retro-card">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-n64-yellow" />
            <div>
              <p className="text-retro-gray text-sm">Teilnehmer</p>
              <p className="font-retro text-retro-white">
                {event.participants?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="retro-card">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-n64-purple" />
            <div>
              <p className="text-retro-gray text-sm">Kategorie</p>
              <p className="font-retro text-retro-white">{event.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown */}
      {isActive && (
        <div className="retro-card border-n64-green">
          <div className="text-center">
            <h3 className="text-lg font-pixel text-n64-green mb-2">⏰ Event läuft</h3>
            <p className="text-retro-gray">
              {timeUntilEnd > 0 
                ? `Endet in ${formatDistanceToNow(new Date(event.endTime), { locale: de })}`
                : 'Event ist beendet'
              }
            </p>
          </div>
        </div>
      )}

      {isDraft && timeUntilStart > 0 && (
        <div className="retro-card border-n64-yellow">
          <div className="text-center">
            <h3 className="text-lg font-pixel text-n64-yellow mb-2">⏳ Event startet</h3>
            <p className="text-retro-gray">
              Startet in {formatDistanceToNow(new Date(event.startTime), { locale: de })}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="retro-card">
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded transition-colors ${
                  activeTab === tab.id
                    ? 'bg-n64-red text-white border-2 border-red-400'
                    : 'text-retro-gray hover:bg-n64-gray hover:text-retro-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-retro text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-pixel text-n64-red mb-3">📝 Beschreibung</h3>
              <div className="bg-n64-dark p-4 rounded border border-n64-gray">
                <p className="text-retro-white whitespace-pre-wrap">
                  {event.description || 'Keine Beschreibung verfügbar.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-pixel text-n64-blue mb-3">🎮 Event-Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-retro-gray">Spiel:</span>
                    <span className="text-retro-white">{event.game.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-retro-gray">Plattform:</span>
                    <span className="text-retro-white">{event.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-retro-gray">Bewertung:</span>
                    <span className="text-retro-white">{event.scoringType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-retro-gray">Mindestlevel:</span>
                    <span className="text-retro-white">{event.settings.minimumLevel}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-pixel text-n64-yellow mb-3">🏆 Belohnungen</h3>
                <div className="space-y-2">
                  {event.rewards.map((reward, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-retro-gray">{reward.position}. Platz:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-n64-green">{reward.xp} XP</span>
                        {reward.medals && (
                          <span className="text-n64-yellow">🏅 {reward.medals}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'participants' && (
          <div>
            <h3 className="text-lg font-pixel text-n64-green mb-4">
              👥 Teilnehmer ({event.participants?.length || 0})
            </h3>
            
            {event.participants && event.participants.length > 0 ? (
              <div className="space-y-3">
                {sortedParticipants.map((participant) => (
                  <div key={participant.id} className="bg-n64-dark p-4 rounded border border-n64-gray">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          participant.verified ? 'bg-n64-green' : 'bg-n64-yellow'
                        }`} />
                        <div>
                          <h4 className="font-retro text-retro-white">{participant.username}</h4>
                          <p className="text-sm text-retro-gray">
                            {participant.submittedAt 
                              ? `Eingereicht: ${new Date(participant.submittedAt).toLocaleString('de-DE')}`
                              : 'Noch nicht eingereicht'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {participant.screenshotUrl && (
                          <a
                            href={participant.screenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-n64-blue hover:text-n64-green"
                            title="Screenshot ansehen"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        
                        {!participant.verified && (
                          <button
                            onClick={() => verifySubmission(event.id, participant.id)}
                            className="text-n64-green hover:text-green-400"
                            title="Einreichung verifizieren"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        {participant.verified && (
                          <span className="text-n64-green" title="Verifiziert">
                            <CheckCircle className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {participant.score && (
                      <div className="mt-2 text-sm text-retro-gray">
                        <span>Punkte: {participant.score}</span>
                        {participant.time && <span className="ml-4">Zeit: {participant.time}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-retro-gray">
                <Users className="h-12 w-12 mx-auto mb-4 text-n64-gray" />
                <p>Noch keine Teilnehmer</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            <h3 className="text-lg font-pixel text-n64-purple mb-4">🏆 Ergebnisse</h3>
            
            {sortedParticipants.length > 0 ? (
              <div className="space-y-3">
                {sortedParticipants.map((participant, index) => (
                  <div key={participant.id} className="bg-n64-dark p-4 rounded border border-n64-gray">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-n64-yellow text-black' :
                          index === 1 ? 'bg-retro-gray text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-n64-dark text-retro-gray'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-retro text-retro-white">{participant.username}</h4>
                          {participant.position && (
                            <p className="text-sm text-retro-gray">Position: {participant.position}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {participant.score && (
                          <div className="text-lg font-bold text-n64-green">{participant.score} Punkte</div>
                        )}
                        {participant.time && (
                          <div className="text-sm text-retro-gray">{participant.time}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-retro-gray">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-n64-gray" />
                <p>Noch keine Ergebnisse</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};