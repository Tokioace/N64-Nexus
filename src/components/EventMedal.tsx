'use client';

import { Trophy, Medal, Award, Star, Crown, Target } from 'lucide-react';

export type MedalType = 'gold' | 'silver' | 'bronze' | 'participation';

interface EventMedal {
  id: string;
  type: MedalType;
  eventTitle: string;
  eventDate: string;
  rank?: number;
  totalParticipants?: number;
  description?: string;
}

interface EventMedalProps {
  medal: EventMedal;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

export default function EventMedal({ 
  medal, 
  size = 'medium', 
  showTooltip = true
}: EventMedalProps) {
  const getMedalIcon = (type: MedalType, sizeClass: string) => {
    switch (type) {
      case 'gold':
        return <Crown className={`${sizeClass} text-yellow-400`} />;
      case 'silver':
        return <Medal className={`${sizeClass} text-gray-300`} />;
      case 'bronze':
        return <Award className={`${sizeClass} text-orange-400`} />;
      case 'participation':
        return <Star className={`${sizeClass} text-purple-400`} />;
      default:
        return <Trophy className={`${sizeClass} text-cyan-400`} />;
    }
  };

  const getMedalStyle = (type: MedalType) => {
    switch (type) {
      case 'gold':
        return {
          gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
          border: 'border-yellow-400/70'
        };
      case 'silver':
        return {
          gradient: 'from-gray-300 via-gray-400 to-gray-500',
          border: 'border-gray-400/70'
        };
      case 'bronze':
        return {
          gradient: 'from-orange-400 via-orange-500 to-orange-600',
          border: 'border-orange-400/70'
        };
      case 'participation':
        return {
          gradient: 'from-purple-400 via-purple-500 to-purple-600',
          border: 'border-purple-400/70'
        };
      default:
        return {
          gradient: 'from-cyan-400 via-cyan-500 to-cyan-600',
          border: 'border-cyan-400/70'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return {
          container: 'w-12 h-12',
          icon: 'w-6 h-6'
        };
      case 'large':
        return {
          container: 'w-20 h-20',
          icon: 'w-10 h-10'
        };
      default: // medium
        return {
          container: 'w-16 h-16',
          icon: 'w-8 h-8'
        };
    }
  };

  const getMedalTitle = (type: MedalType, rank?: number) => {
    switch (type) {
      case 'gold':
        return `🥇 1. Platz`;
      case 'silver':
        return `🥈 Top 10% (${rank ? `Platz ${rank}` : 'Silber'})`;
      case 'bronze':
        return `🥉 Top 50% (${rank ? `Platz ${rank}` : 'Bronze'})`;
      case 'participation':
        return `⭐ Teilnahme`;
      default:
        return `🏆 Event Abzeichen`;
    }
  };

  const style = getMedalStyle(medal.type);
  const sizeClasses = getSizeClasses(size);

  const medalComponent = (
    <div
      className={`
        relative ${sizeClasses.container} rounded-full 
        bg-gradient-to-br ${style.gradient} 
        border-2 ${style.border}
        flex items-center justify-center
        cursor-pointer
        group
        hover:scale-110 transition-transform
      `}
    >
      {/* Medal Icon */}
      <div className="relative z-10">
        {getMedalIcon(medal.type, sizeClasses.icon)}
      </div>

      {/* Rank Badge */}
      {medal.rank && medal.rank <= 3 && size !== 'small' && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full border border-gray-600 flex items-center justify-center text-xs font-bold text-white">
          {medal.rank}
        </div>
      )}
    </div>
  );

  // Wrap with tooltip if enabled
  if (showTooltip) {
    return (
      <div className="relative group">
        {medalComponent}
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 border border-gray-600 rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 pointer-events-none z-50 min-w-max transition-opacity">
          <div className="text-center">
            <div className="font-bold text-cyan-300 mb-1">
              {getMedalTitle(medal.type, medal.rank)}
            </div>
            <div className="text-gray-300 mb-1">{medal.eventTitle}</div>
            <div className="text-xs text-gray-400">{medal.eventDate}</div>
            {medal.totalParticipants && (
              <div className="text-xs text-gray-500 mt-1">
                {medal.totalParticipants} Teilnehmer
              </div>
            )}
            {medal.description && (
              <div className="text-xs text-gray-400 mt-1 max-w-xs">
                {medal.description}
              </div>
            )}
          </div>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
        </div>
      </div>
    );
  }

  return medalComponent;
}

// Medal Collection Component
interface MedalCollectionProps {
  medals: EventMedal[];
  title?: string;
  maxDisplay?: number;
  showAll?: boolean;
}

export function MedalCollection({ 
  medals, 
  title = "Event Medaillen", 
  maxDisplay = 8,
  showAll = false 
}: MedalCollectionProps) {
  const displayedMedals = showAll ? medals : medals.slice(0, maxDisplay);
  const remainingCount = medals.length - maxDisplay;

  const getMedalIcon = (type: MedalType, sizeClass: string) => {
    switch (type) {
      case 'gold':
        return <Crown className={`${sizeClass} text-yellow-400`} />;
      case 'silver':
        return <Medal className={`${sizeClass} text-gray-300`} />;
      case 'bronze':
        return <Award className={`${sizeClass} text-orange-400`} />;
      case 'participation':
        return <Star className={`${sizeClass} text-purple-400`} />;
      default:
        return <Trophy className={`${sizeClass} text-cyan-400`} />;
    }
  };

  const getMedalStyle = (type: MedalType) => {
    switch (type) {
      case 'gold':
        return {
          gradient: 'from-yellow-400 via-yellow-500 to-yellow-600'
        };
      case 'silver':
        return {
          gradient: 'from-gray-300 via-gray-400 to-gray-500'
        };
      case 'bronze':
        return {
          gradient: 'from-orange-400 via-orange-500 to-orange-600'
        };
      case 'participation':
        return {
          gradient: 'from-purple-400 via-purple-500 to-purple-600'
        };
      default:
        return {
          gradient: 'from-cyan-400 via-cyan-500 to-cyan-600'
        };
    }
  };

  return (
    <div className="retro-card">
      <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2" />
        {title}
        <span className="ml-2 text-sm text-gray-400">({medals.length})</span>
      </h3>
      
      {medals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Noch keine Medaillen erhalten</p>
          <p className="text-sm">Nimm an Events teil, um Medaillen zu sammeln!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {displayedMedals.map((medal, index) => (
              <div
                key={medal.id}
                className="hover:scale-105 transition-transform"
              >
                <EventMedal medal={medal} size="medium" />
              </div>
            ))}
            
            {!showAll && remainingCount > 0 && (
              <div className="w-16 h-16 rounded-full bg-gray-800/50 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-sm">
                +{remainingCount}
              </div>
            )}
          </div>
          
          {/* Medal Statistics */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-700">
            {(['gold', 'silver', 'bronze', 'participation'] as MedalType[]).map(type => {
              const count = medals.filter(m => m.type === type).length;
              const style = getMedalStyle(type);
              
              return (
                <div key={type} className="text-center">
                  <div className={`w-8 h-8 mx-auto mb-1 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                    {getMedalIcon(type, 'w-4 h-4')}
                  </div>
                  <div className="text-sm font-bold text-gray-300">{count}</div>
                  <div className="text-xs text-gray-500 capitalize">{type}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}