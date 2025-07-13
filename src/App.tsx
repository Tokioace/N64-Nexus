import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import FriendList from './components/FriendList'
import Challenges from './components/Challenges'
import Profile from './components/Profile'
import { User, Friend, Challenge } from './types'

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    username: 'RetroGamer64',
    avatar: '/avatars/player1.png',
    level: 42,
    xp: 1250,
    friends: [],
    challenges: [],
    privacy: 'public'
  })

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '2',
      username: 'MarioFan99',
      avatar: '/avatars/player2.png',
      status: 'online',
      level: 38,
      friendshipDate: new Date('2024-01-15'),
      badges: ['Speedrunner', '100 Days']
    },
    {
      id: '3',
      username: 'ZeldaMaster',
      avatar: '/avatars/player3.png',
      status: 'inactive',
      level: 55,
      friendshipDate: new Date('2024-02-01'),
      badges: ['Fan Artist', 'Quiz Master']
    }
  ])

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      type: 'speedrun',
      title: 'DK Jungle 3 Runden',
      description: 'Wer schafft schneller 3 Runden in Donkey Kong 64?',
      creator: currentUser,
      participants: [friends[0]],
      status: 'active',
      deadline: new Date('2024-12-25T23:59:59'),
      rewards: { xp: 100, badge: 'Speed King' }
    }
  ])

  return (
    <div className="min-h-screen bg-retro-dark">
      <Navbar currentUser={currentUser} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<FriendList currentUser={currentUser} friends={friends} setFriends={setFriends} />} />
          <Route path="/challenges" element={<Challenges currentUser={currentUser} challenges={challenges} setChallenges={setChallenges} friends={friends} />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App