import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'

import { 
  Zap, 
  Trophy, 
  Clock, 
  Star,
  Flame,
  Target,
  Timer,
  Play,
  Gamepad2,
  Crown,
  ChevronRight,
  Sparkles,
  Rocket
} from 'lucide-react'

const HomeScreenRetro: React.FC = () => {
  const { user } = useUser()
  const { activeEvents, upcomingEvents } = useEvents()
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [motivationalText, setMotivationalText] = useState('')
  
  const currentEvent = activeEvents[0] || upcomingEvents[0]

  // Fun motivational messages for speedrunners
  const motivationalMessages = [
    "Ready to break some records? 🚀",
    "Time to show your speed! ⚡",
    "Every millisecond counts! ⏱️",
    "Chase that perfect run! 🎯",
    "Speed is your superpower! 💨",
    "Run fast, run proud! 🏃‍♂️",
    "The leaderboard awaits! 👑",
    "Gotta go fast! 💨",
    "Your next PB is waiting! 🏆",
    "Speedrun like a champion! 🥇",
    "Break the limits! 🔥",
    "Race against time itself! ⏰"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Random motivational text
    setMotivationalText(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])

    return () => clearInterval(timer)
  }, [])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden">
      {/* Epic Speedrun Header */}
      <div className="text-center mb-8">
        <div className="relative">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2 animate-pulse">
            ⚡ SPEEDRUN ARENA ⚡
          </h1>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
          </div>
        </div>
        <div className="flex items-center justify-center space-x-6 text-slate-300 text-lg">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-yellow-400">{user.username}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-orange-400" />
            <span>Level {user.level}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-green-400" />
            <span className="font-mono">{currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
        <p className="text-xl text-slate-300 mt-3 font-medium">{motivationalText}</p>
      </div>

      {/* Main Speedrun Dashboard */}
      <div className="max-w-7xl mx-auto">
        {/* Quick Actions - Prominent Speedrun Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Start Speedrun - Main CTA */}
          <Link to="/speedrun-media" className="group">
            <div className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-200 shadow-2xl border border-red-500">
              <Rocket className="w-12 h-12 text-white mx-auto mb-3 group-hover:animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-2">START RUN</h3>
              <p className="text-red-100">Begin your speedrun session!</p>
              <div className="mt-3 bg-red-800 bg-opacity-50 rounded-lg py-2 px-4">
                <span className="text-sm text-red-100">🔥 Hot & Ready!</span>
              </div>
            </div>
          </Link>

          {/* Leaderboards */}
          <Link to="/leaderboard" className="group">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-200 shadow-2xl border border-yellow-500">
              <Trophy className="w-12 h-12 text-white mx-auto mb-3 group-hover:animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">RANKINGS</h3>
              <p className="text-yellow-100">Check your position!</p>
              <div className="mt-3 bg-yellow-800 bg-opacity-50 rounded-lg py-2 px-4">
                <span className="text-sm text-yellow-100">👑 Top Runners</span>
              </div>
            </div>
          </Link>

          {/* Speed Challenges */}
          <Link to="/minigames" className="group">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-200 shadow-2xl border border-purple-500">
              <Target className="w-12 h-12 text-white mx-auto mb-3 group-hover:animate-spin" />
              <h3 className="text-2xl font-bold text-white mb-2">CHALLENGES</h3>
              <p className="text-purple-100">Mini speed games!</p>
              <div className="mt-3 bg-purple-800 bg-opacity-50 rounded-lg py-2 px-4">
                <span className="text-sm text-purple-100">⚡ Quick Fun</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Live Event & Personal Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Live Speedrun Event */}
          <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Flame className="w-6 h-6 text-red-400 animate-pulse" />
                <span className="font-bold text-red-400 text-lg">🔥 LIVE EVENT</span>
              </div>
              <Link to="/events" className="text-red-400 hover:text-red-300 transition-colors group">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="text-2xl font-bold text-white mb-3">
              {currentEvent?.title || 'Mario Kart 64: Rainbow Road Rush'}
            </div>
            <div className="text-slate-300 mb-4">
              {currentEvent?.type || 'Time Trial'} • <span className="text-red-400 font-mono">2d 14h 23m</span> remaining
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Runners</span>
                <span className="font-bold text-white text-lg">{currentEvent?.participants || 127}</span>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="text-sm text-slate-400 mb-2">Current Leaders:</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">SpeedDemon64</span>
                    </div>
                    <span className="font-mono text-green-400">1:02.55</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gray-400" />
                      <span className="text-slate-300">RainbowRunner</span>
                    </div>
                    <span className="font-mono text-blue-400">1:06.97</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-orange-400" />
                      <span className="text-slate-300">KartMaster</span>
                    </div>
                    <span className="font-mono text-orange-400">1:09.23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Speedrun Stats */}
          <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-blue-400 text-lg">YOUR STATS</span>
              </div>
              <Link to="/profile" className="text-blue-400 hover:text-blue-300 transition-colors group">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{user.totalRuns || 47}</div>
                <div className="text-sm text-slate-400">Total Runs</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{user.personalBests || 12}</div>
                <div className="text-sm text-slate-400">Personal Bests</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-slate-400 mb-2">Recent Achievement:</div>
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-200" />
                  <span className="text-yellow-100 font-medium">Speed Demon</span>
                </div>
                <div className="text-xs text-yellow-200 mt-1">
                  Completed 10 sub-2-minute runs!
                </div>
              </div>
              
              <div className="text-sm text-slate-400 mb-2">Next Goal:</div>
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Master Runner</span>
                  <span className="text-slate-400 text-sm">23/50</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '46%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Game Selection */}
        <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="w-6 h-6 text-green-400" />
              <span className="font-bold text-green-400 text-lg">QUICK START</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Mario Kart 64', icon: '🏎️', color: 'red' },
              { name: 'Super Mario 64', icon: '🍄', color: 'yellow' },
              { name: 'GoldenEye 007', icon: '🔫', color: 'blue' },
              { name: 'Zelda OoT', icon: '⚔️', color: 'green' },
              { name: 'Smash Bros', icon: '👊', color: 'purple' },
              { name: 'Mario Party', icon: '🎲', color: 'pink' }
            ].map((game, index) => (
              <Link key={index} to="/speedrun-media" className="group">
                <div className={`bg-${game.color}-600 bg-opacity-20 hover:bg-opacity-40 border border-${game.color}-500 rounded-lg p-3 text-center transition-all duration-200 transform hover:scale-105`}>
                  <div className="text-2xl mb-1">{game.icon}</div>
                  <div className="text-xs text-slate-300 font-medium">{game.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreenRetro