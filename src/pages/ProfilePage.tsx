import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progressService';
import { UserProfile, PrivacySettings } from '../types';
import { Edit, Share, Download, Trash2, Eye, EyeOff, MapPin, Gamepad2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    avatar: '',
    favoriteGames: [''],
    location: '',
    privacySettings: {
      showLocation: false,
      showPoints: true,
      showMedals: true,
      showFavoriteGames: true,
      profilePublic: true
    }
  });

  useEffect(() => {
    const currentProfile = StorageService.getUserProfile();
    
    if (username && username !== currentProfile?.username) {
      // Viewing someone else's profile (would be implemented with backend)
      // For now, redirect to own profile
      window.location.href = '/profile';
      return;
    }
    
    if (currentProfile) {
      setProfile(currentProfile);
      setIsOwnProfile(true);
      setEditForm({
        username: currentProfile.username,
        avatar: currentProfile.avatar,
        favoriteGames: currentProfile.favoriteGames.length > 0 ? currentProfile.favoriteGames : [''],
        location: currentProfile.location || '',
        privacySettings: currentProfile.privacySettings
      });
    } else {
      window.location.href = '/';
    }
  }, [username]);

  const handleSave = () => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      username: editForm.username,
      avatar: editForm.avatar,
      favoriteGames: editForm.favoriteGames.filter(game => game.trim() !== ''),
      location: editForm.location,
      privacySettings: editForm.privacySettings
    };

    StorageService.saveUserProfile(updatedProfile);
    StorageService.saveSettings(editForm.privacySettings);
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        username: profile.username,
        avatar: profile.avatar,
        favoriteGames: profile.favoriteGames.length > 0 ? profile.favoriteGames : [''],
        location: profile.location || '',
        privacySettings: profile.privacySettings
      });
    }
    setIsEditing(false);
  };

  const addFavoriteGame = () => {
    setEditForm(prev => ({
      ...prev,
      favoriteGames: [...prev.favoriteGames, '']
    }));
  };

  const removeFavoriteGame = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      favoriteGames: prev.favoriteGames.filter((_, i) => i !== index)
    }));
  };

  const updateFavoriteGame = (index: number, value: string) => {
    setEditForm(prev => ({
      ...prev,
      favoriteGames: prev.favoriteGames.map((game, i) => i === index ? value : game)
    }));
  };

  const exportData = () => {
    const data = StorageService.exportUserData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `battle64-data-${profile?.username}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteData = () => {
    if (confirm('Möchtest du wirklich alle deine Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      StorageService.deleteAllData();
      window.location.href = '/';
    }
  };

  const shareProfile = () => {
    const url = `${window.location.origin}/profile/${profile?.username}`;
    if (navigator.share) {
      navigator.share({
        title: `${profile?.username} auf Battle64`,
        text: `Schau dir das Profil von ${profile?.username} auf Battle64 an!`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Profil-URL in die Zwischenablage kopiert!');
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-n64-purple"></div>
      </div>
    );
  }

  const stats = ProgressService.getProgressStats();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="text-6xl">{profile.avatar}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="border border-gray-300 rounded px-2 py-1"
                    maxLength={20}
                  />
                ) : (
                  profile.username
                )}
              </h1>
              <p className="text-gray-600">
                Sammler-Level {stats.collectorLevel} • Mitglied seit {profile.createdAt.toLocaleDateString('de-DE')}
              </p>
              {profile.location && editForm.privacySettings.showLocation && (
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="border border-gray-300 rounded px-2 py-1 ml-1"
                      placeholder="Standort (optional)"
                    />
                  ) : (
                    profile.location
                  )}
                </p>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="btn-primary">
                    Speichern
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    Abbrechen
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} className="btn-secondary">
                    <Edit className="w-4 h-4 mr-2" />
                    Bearbeiten
                  </button>
                  <button onClick={shareProfile} className="btn-secondary">
                    <Share className="w-4 h-4 mr-2" />
                    Teilen
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Level {stats.collectorLevel}</span>
            <span>{stats.totalPoints} Gesamtpunkte</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(stats.totalPoints / 1000) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {editForm.privacySettings.showPoints && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-2xl font-bold text-n64-purple">{stats.totalPoints}</p>
            <p className="text-sm text-gray-600">Gesamtpunkte</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-n64-blue">{stats.dailyPoints}</p>
            <p className="text-sm text-gray-600">Heute</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-n64-green">{stats.weeklyPoints}</p>
            <p className="text-sm text-gray-600">Diese Woche</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-n64-yellow">{stats.medalsCount}</p>
            <p className="text-sm text-gray-600">Medaillen</p>
          </div>
        </div>
      )}

      {/* Favorite Games */}
      {editForm.privacySettings.showFavoriteGames && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Gamepad2 className="w-5 h-5 mr-2" />
            Lieblingsspiele
          </h2>
          {isEditing ? (
            <div className="space-y-3">
              {editForm.favoriteGames.map((game, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={game}
                    onChange={(e) => updateFavoriteGame(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                    placeholder="Spielname eingeben"
                    maxLength={50}
                  />
                  {editForm.favoriteGames.length > 1 && (
                    <button
                      onClick={() => removeFavoriteGame(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {editForm.favoriteGames.length < 5 && (
                <button
                  onClick={addFavoriteGame}
                  className="btn-secondary text-sm"
                >
                  + Spiel hinzufügen
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {profile.favoriteGames.length > 0 ? (
                profile.favoriteGames.map((game, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-lg mr-3">🎮</span>
                    <span className="font-medium">{game}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Noch keine Lieblingsspiele hinzugefügt
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Medals */}
      {editForm.privacySettings.showMedals && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Medaillen & Auszeichnungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.medals.map((medal) => (
              <div key={medal.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{medal.icon}</span>
                  <span className={`font-semibold medal-${medal.rarity}`}>
                    {medal.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{medal.description}</p>
                <p className="text-xs text-gray-500">
                  {medal.earnedAt.toLocaleDateString('de-DE')}
                </p>
              </div>
            ))}
            {profile.medals.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Noch keine Medaillen erhalten</p>
                <Link to="/dashboard" className="btn-primary mt-4 inline-block">
                  Aktiv werden
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {isOwnProfile && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Datenschutz-Einstellungen</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Standort anzeigen</p>
                <p className="text-sm text-gray-600">Zeige deinen Standort auf deinem Profil</p>
              </div>
              <button
                onClick={() => setEditForm(prev => ({
                  ...prev,
                  privacySettings: {
                    ...prev.privacySettings,
                    showLocation: !prev.privacySettings.showLocation
                  }
                }))}
                className={`p-2 rounded-lg ${editForm.privacySettings.showLocation ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              >
                {editForm.privacySettings.showLocation ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Punkte anzeigen</p>
                <p className="text-sm text-gray-600">Zeige deine Punkte auf deinem Profil</p>
              </div>
              <button
                onClick={() => setEditForm(prev => ({
                  ...prev,
                  privacySettings: {
                    ...prev.privacySettings,
                    showPoints: !prev.privacySettings.showPoints
                  }
                }))}
                className={`p-2 rounded-lg ${editForm.privacySettings.showPoints ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              >
                {editForm.privacySettings.showPoints ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Medaillen anzeigen</p>
                <p className="text-sm text-gray-600">Zeige deine Medaillen auf deinem Profil</p>
              </div>
              <button
                onClick={() => setEditForm(prev => ({
                  ...prev,
                  privacySettings: {
                    ...prev.privacySettings,
                    showMedals: !prev.privacySettings.showMedals
                  }
                }))}
                className={`p-2 rounded-lg ${editForm.privacySettings.showMedals ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              >
                {editForm.privacySettings.showMedals ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lieblingsspiele anzeigen</p>
                <p className="text-sm text-gray-600">Zeige deine Lieblingsspiele auf deinem Profil</p>
              </div>
              <button
                onClick={() => setEditForm(prev => ({
                  ...prev,
                  privacySettings: {
                    ...prev.privacySettings,
                    showFavoriteGames: !prev.privacySettings.showFavoriteGames
                  }
                }))}
                className={`p-2 rounded-lg ${editForm.privacySettings.showFavoriteGames ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              >
                {editForm.privacySettings.showFavoriteGames ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Management */}
      {isOwnProfile && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Datenverwaltung</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={exportData} className="btn-secondary flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Daten exportieren
            </button>
            <button onClick={deleteData} className="btn-secondary text-red-600 hover:text-red-700 flex items-center justify-center">
              <Trash2 className="w-4 h-4 mr-2" />
              Alle Daten löschen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;