import React, { useState } from 'react'
import { Trophy, Medal, TrendingUp, Filter, Search } from 'lucide-react'
import './LeaderboardPage.css'

interface LeaderboardEntry {
  id: string
  rank: number
  username: string
  game: string
  category: string
  time: string
  date: string
  verified: boolean
}

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      rank: 1,
      username: 'SpeedKing',
      game: 'Super Mario Bros',
      category: 'Any%',
      time: '1:20:10',
      date: '2024-01-15',
      verified: true,
    },
    {
      id: '2',
      rank: 2,
      username: 'RetroRunner',
      game: 'Super Mario Bros',
      category: 'Any%',
      time: '1:21:45',
      date: '2024-01-20',
      verified: true,
    },
    {
      id: '3',
      rank: 3,
      username: 'PixelPerfect',
      game: 'Super Mario Bros',
      category: 'Any%',
      time: '1:22:30',
      date: '2024-01-25',
      verified: false,
    },
    {
      id: '4',
      rank: 1,
      username: 'ZeldaMaster',
      game: 'Zelda: Ocarina of Time',
      category: 'Any%',
      time: '2:10:45',
      date: '2024-01-10',
      verified: true,
    },
    {
      id: '5',
      rank: 2,
      username: 'TimeLord',
      game: 'Zelda: Ocarina of Time',
      category: 'Any%',
      time: '2:12:20',
      date: '2024-01-18',
      verified: true,
    },
  ])

  const [selectedGame, setSelectedGame] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  const games = Array.from(new Set(leaderboard.map(entry => entry.game)))
  const categories = Array.from(new Set(leaderboard.map(entry => entry.category)))

  const filteredLeaderboard = leaderboard.filter(entry => {
    const matchesGame = selectedGame === 'all' || entry.game === selectedGame
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory
    const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.game.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesGame && matchesCategory && matchesSearch
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="rank-icon gold" size={20} />
      case 2:
        return <Medal className="rank-icon silver" size={20} />
      case 3:
        return <Medal className="rank-icon bronze" size={20} />
      default:
        return <span className="rank-number">{rank}</span>
    }
  }

  return (
    <div className="leaderboard-page">
      <header className="page-header">
        <h1>Leaderboard</h1>
        <p>Die besten Speedrunner und ihre Zeiten</p>
      </header>

      <div className="leaderboard-filters">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Suche nach Spieler oder Spiel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="game-filter">Spiel:</label>
            <select
              id="game-filter"
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <option value="all">Alle Spiele</option>
              {games.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category-filter">Kategorie:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Alle Kategorien</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Spieler</th>
              <th>Spiel</th>
              <th>Kategorie</th>
              <th>Zeit</th>
              <th>Datum</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaderboard.map((entry) => (
              <tr key={entry.id} className={entry.verified ? 'verified' : 'unverified'}>
                <td className="rank-cell">
                  {getRankIcon(entry.rank)}
                </td>
                <td className="username-cell">
                  <span className="username">{entry.username}</span>
                </td>
                <td>{entry.game}</td>
                <td>{entry.category}</td>
                <td className="time-cell">
                  <span className="time">{entry.time}</span>
                </td>
                <td>{new Date(entry.date).toLocaleDateString('de-DE')}</td>
                <td>
                  <span className={`status ${entry.verified ? 'verified' : 'pending'}`}>
                    {entry.verified ? 'Verifiziert' : 'Ausstehend'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLeaderboard.length === 0 && (
        <div className="no-results">
          <p>Keine Einträge gefunden.</p>
        </div>
      )}
    </div>
  )
}

export default LeaderboardPage