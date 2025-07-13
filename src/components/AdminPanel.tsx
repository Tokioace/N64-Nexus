import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { AdminPostData } from '../types';

const AdminPanel: React.FC = () => {
  const { state, createPost } = useNews();
  const [formData, setFormData] = useState<AdminPostData>({
    type: 'official',
    title: '',
    content: '',
    image: '',
    video: '',
    visibility: 'global',
    targetGroups: [],
    scheduledFor: undefined,
    pushNotification: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost(formData);
    setFormData({
      type: 'official',
      title: '',
      content: '',
      image: '',
      video: '',
      visibility: 'global',
      targetGroups: [],
      scheduledFor: undefined,
      pushNotification: false,
    });
  };

  const handleInputChange = (field: keyof AdminPostData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (state.currentUser.role !== 'admin' && state.currentUser.role !== 'editor') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="n64-card text-center py-12">
          <div className="text-6xl mb-4">🚫</div>
          <h3 className="text-xl font-pixel text-n64-red mb-2">
            Zugriff verweigert
          </h3>
          <p className="text-n64-gray font-n64">
            Du hast keine Berechtigung, das Admin-Panel zu nutzen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-pixel text-n64-blue glow-text mb-2">
          ⚙️ Admin Panel
        </h2>
        <p className="text-n64-gray font-n64">
          Erstelle und verwalte News-Posts für die Battle64 Community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Post Form */}
        <div className="n64-card">
          <h3 className="text-xl font-pixel text-n64-blue mb-4">📝 Neuen Post erstellen</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-n64 text-n64-silver mb-2">📰 Post-Typ</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="n64-input w-full"
              >
                <option value="official">📢 Offizielle Ankündigung</option>
                <option value="highlight">🏆 Spieler-Highlight</option>
                <option value="fanart">🖼️ Fanart & Speedrun</option>
                <option value="event">🕹️ Event</option>
                <option value="tip">💡 Retro-Tipp</option>
              </select>
            </div>

            <div>
              <label className="block font-n64 text-n64-silver mb-2">📋 Titel</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Post-Titel eingeben..."
                className="n64-input w-full"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block font-n64 text-n64-silver mb-2">📄 Inhalt</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Post-Inhalt eingeben... (Markdown unterstützt)"
                className="n64-input w-full h-32 resize-none"
                required
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-n64 text-n64-silver mb-2">🖼️ Bild-URL (optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="n64-input w-full"
                />
              </div>

              <div>
                <label className="block font-n64 text-n64-silver mb-2">🎥 Video-URL (optional)</label>
                <input
                  type="url"
                  value={formData.video}
                  onChange={(e) => handleInputChange('video', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="n64-input w-full"
                />
              </div>
            </div>

            <div>
              <label className="block font-n64 text-n64-silver mb-2">👥 Sichtbarkeit</label>
              <select
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="n64-input w-full"
              >
                <option value="global">🌍 Global (Alle)</option>
                <option value="region">🌍 Region (EU/NA/AS)</option>
                <option value="event">🎮 Event-spezifisch</option>
                <option value="group">👥 Gruppen-spezifisch</option>
              </select>
            </div>

            {formData.visibility === 'group' && (
              <div>
                <label className="block font-n64 text-n64-silver mb-2">🎮 Zielgruppen</label>
                <div className="space-y-2">
                  {['Speedrunners', 'Fanart', 'Competitive', 'Casual', 'Modding'].map(group => (
                    <label key={group} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.targetGroups?.includes(group)}
                        onChange={(e) => {
                          const current = formData.targetGroups || [];
                          const updated = e.target.checked
                            ? [...current, group]
                            : current.filter(g => g !== group);
                          handleInputChange('targetGroups', updated);
                        }}
                        className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded"
                      />
                      <span className="font-n64 text-sm">{group}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block font-n64 text-n64-silver mb-2">📅 Geplante Veröffentlichung (optional)</label>
              <input
                type="datetime-local"
                value={formData.scheduledFor ? new Date(formData.scheduledFor).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleInputChange('scheduledFor', e.target.value ? new Date(e.target.value) : undefined)}
                className="n64-input w-full"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pushNotification}
                  onChange={(e) => handleInputChange('pushNotification', e.target.checked)}
                  className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded"
                />
                <span className="font-n64 text-sm">🔔 Push-Benachrichtigung bei Veröffentlichung</span>
              </label>
            </div>

            <button type="submit" className="n64-button w-full">
              📤 Post veröffentlichen
            </button>
          </form>
        </div>

        {/* Recent Posts & Stats */}
        <div className="space-y-6">
          <div className="n64-card">
            <h3 className="text-xl font-pixel text-n64-blue mb-4">📊 Statistiken</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-n64 text-n64-gray">Gesamt Posts:</span>
                <span className="font-n64 text-white">{state.posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-n64 text-n64-gray">Deine Posts:</span>
                <span className="font-n64 text-white">
                  {state.posts.filter(p => p.author === state.currentUser.username).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-n64 text-n64-gray">Neue Posts (24h):</span>
                <span className="font-n64 text-white">
                  {state.posts.filter(p => 
                    new Date().getTime() - p.timestamp.getTime() < 24 * 60 * 60 * 1000
                  ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-n64 text-n64-gray">Geplante Posts:</span>
                <span className="font-n64 text-white">
                  {state.posts.filter(p => p.scheduledFor && p.scheduledFor > new Date()).length}
                </span>
              </div>
            </div>
          </div>

          <div className="n64-card">
            <h3 className="text-xl font-pixel text-n64-blue mb-4">📰 Letzte Posts</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {state.posts.slice(0, 5).map(post => (
                <div key={post.id} className="bg-n64-dark/50 rounded p-3 border border-n64-gray/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-n64 text-sm text-white truncate">{post.title}</span>
                    <span className="text-xs text-n64-gray">
                      {post.timestamp.toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-n64-gray">
                    <span>👤 {post.author}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments.length}</span>
                    <span className={`px-1 rounded text-xs ${
                      post.type === 'official' ? 'bg-n64-silver/20 text-n64-silver' :
                      post.type === 'highlight' ? 'bg-n64-gold/20 text-n64-gold' :
                      post.type === 'fanart' ? 'bg-n64-blue/20 text-n64-blue' :
                      post.type === 'event' ? 'bg-n64-red/20 text-n64-red' :
                      'bg-n64-green/20 text-n64-green'
                    }`}>
                      {post.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;