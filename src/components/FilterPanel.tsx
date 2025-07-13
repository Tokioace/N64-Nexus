import React from 'react';
import { useNews } from '../context/NewsContext';

const FilterPanel: React.FC = () => {
  const { state, dispatch } = useNews();

  const handleFilterChange = (filter: keyof typeof state.filters, value: boolean) => {
    dispatch({ type: 'SET_FILTERS', payload: { [filter]: value } });
  };

  const resetFilters = () => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        showOfficial: true,
        showHighlights: true,
        showFanart: true,
        showEvents: true,
        showTips: true,
        showOwnGroups: false,
        showAdminOnly: false,
      },
    });
  };

  return (
    <div className="n64-card mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-pixel text-n64-blue">🔧 Filter & Einstellungen</h3>
        <button onClick={resetFilters} className="n64-button text-sm">
          🔄 Zurücksetzen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          <h4 className="font-pixel text-n64-silver text-sm">📰 News-Typen</h4>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.filters.showOfficial}
              onChange={(e) => handleFilterChange('showOfficial', e.target.checked)}
              className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded focus:ring-n64-blue"
            />
            <span className="font-n64 text-sm">📢 Offizielle Ankündigungen</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.filters.showHighlights}
              onChange={(e) => handleFilterChange('showHighlights', e.target.checked)}
              className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded focus:ring-n64-blue"
            />
            <span className="font-n64 text-sm">🏆 Spieler-Highlights</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.filters.showFanart}
              onChange={(e) => handleFilterChange('showFanart', e.target.checked)}
              className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded focus:ring-n64-blue"
            />
            <span className="font-n64 text-sm">🖼️ Fanart & Speedruns</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.filters.showEvents}
              onChange={(e) => handleFilterChange('showEvents', e.target.checked)}
              className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded focus:ring-n64-blue"
            />
            <span className="font-n64 text-sm">🕹️ Events</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.filters.showTips}
              onChange={(e) => handleFilterChange('showTips', e.target.checked)}
              className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded focus:ring-n64-blue"
            />
            <span className="font-n64 text-sm">💡 Retro-Tipps</span>
          </label>
        </div>

        <div className="space-y-3">
          <h4 className="font-pixel text-n64-silver text-sm">👥 Sichtbarkeit</h4>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.filters.showOwnGroups}
              onChange={(e) => handleFilterChange('showOwnGroups', e.target.checked)}
              className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded focus:ring-n64-blue"
            />
            <span className="font-n64 text-sm">👤 Nur eigene Gruppen</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.filters.showAdminOnly}
              onChange={(e) => handleFilterChange('showAdminOnly', e.target.checked)}
              className="w-4 h-4 text-n64-blue bg-n64-dark border-n64-blue rounded focus:ring-n64-blue"
            />
            <span className="font-n64 text-sm">👑 Nur Admin-Posts</span>
          </label>

          <div className="pt-4">
            <h4 className="font-pixel text-n64-silver text-sm mb-2">📊 Statistiken</h4>
            <div className="space-y-1 text-xs font-n64 text-n64-gray">
              <div>📰 Gesamt: {state.posts.length} Posts</div>
              <div>📢 Offiziell: {state.posts.filter(p => p.type === 'official').length}</div>
              <div>🏆 Highlights: {state.posts.filter(p => p.type === 'highlight').length}</div>
              <div>🖼️ Fanart: {state.posts.filter(p => p.type === 'fanart').length}</div>
              <div>🕹️ Events: {state.posts.filter(p => p.type === 'event').length}</div>
              <div>💡 Tipps: {state.posts.filter(p => p.type === 'tip').length}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-pixel text-n64-silver text-sm">🎮 Deine Gruppen</h4>
          <div className="space-y-2">
            {state.currentUser.groups.map(group => (
              <div key={group} className="bg-n64-blue/20 px-3 py-2 rounded border border-n64-blue/30">
                <span className="font-n64 text-sm text-n64-blue">{group}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4">
            <h4 className="font-pixel text-n64-silver text-sm mb-2">⚡ Schnellfilter</h4>
            <div className="space-y-2">
              <button
                onClick={() => dispatch({
                  type: 'SET_FILTERS',
                  payload: {
                    showOfficial: true,
                    showHighlights: false,
                    showFanart: false,
                    showEvents: false,
                    showTips: false,
                    showOwnGroups: false,
                    showAdminOnly: false,
                  }
                })}
                className="w-full n64-button text-sm"
              >
                📢 Nur Offiziell
              </button>
              
              <button
                onClick={() => dispatch({
                  type: 'SET_FILTERS',
                  payload: {
                    showOfficial: false,
                    showHighlights: true,
                    showFanart: true,
                    showEvents: false,
                    showTips: false,
                    showOwnGroups: false,
                    showAdminOnly: false,
                  }
                })}
                className="w-full n64-button text-sm"
              >
                🎨 Community
              </button>
              
              <button
                onClick={() => dispatch({
                  type: 'SET_FILTERS',
                  payload: {
                    showOfficial: false,
                    showHighlights: false,
                    showFanart: false,
                    showEvents: true,
                    showTips: false,
                    showOwnGroups: false,
                    showAdminOnly: false,
                  }
                })}
                className="w-full n64-button text-sm"
              >
                🕹️ Nur Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;