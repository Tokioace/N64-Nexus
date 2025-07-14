import React, { useState } from 'react'
import { User, Edit, Save, X, Trophy, Clock, Star } from 'lucide-react'
import './ProfilePage.css'

interface UserProfile {
  username: string
  email: string
  level: number
  xp: number
  totalTime: string
  bestTime: string
  achievements: number
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    username: 'SpeedRunner42',
    email: 'runner@example.com',
    level: 42,
    xp: 15420,
    totalTime: '45:32:10',
    bestTime: '1:23:45',
    achievements: 15,
  })

  const [editForm, setEditForm] = useState({
    username: profile.username,
    email: profile.email,
  })

  const handleSave = () => {
    setProfile(prev => ({ ...prev, ...editForm }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({ username: profile.username, email: profile.email })
    setIsEditing(false)
  }

  const stats = [
    { icon: Trophy, label: 'Level', value: profile.level },
    { icon: Star, label: 'XP', value: profile.xp.toLocaleString() },
    { icon: Clock, label: 'Gesamtzeit', value: profile.totalTime },
    { icon: Trophy, label: 'Bestenzeit', value: profile.bestTime },
  ]

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar">
          <User size={64} />
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p>{profile.email}</p>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary">
                  <Save size={16} />
                  Speichern
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">
                  <X size={16} />
                  Abbrechen
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                <Edit size={16} />
                Bearbeiten
              </button>
            )}
          </div>
        </div>
      </header>

      {isEditing && (
        <section className="edit-form">
          <h2>Profil bearbeiten</h2>
          <div className="form-group">
            <label htmlFor="username">Benutzername</label>
            <input
              type="text"
              id="username"
              value={editForm.username}
              onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </section>
      )}

      <section className="profile-stats">
        <h2>Statistiken</h2>
        <div className="stats-grid">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="stat-card">
              <Icon size={24} />
              <div className="stat-content">
                <h3>{value}</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProfilePage