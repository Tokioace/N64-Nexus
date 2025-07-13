import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { 
  Save, 
  Eye, 
  Calendar, 
  Gamepad2, 
  Trophy, 
  Settings,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { 
  EventFormData, 
  EventCategory, 
  PlatformType, 
  ScoringType, 
  RewardTier, 
  EventSettings 
} from '../types/event';
import "react-datepicker/dist/react-datepicker.css";

export const EventBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { events, games, createEvent, updateEvent, isLoading, error } = useEventStore();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'logic' | 'rewards' | 'settings'>('basic');

  const existingEvent = id ? events.find(e => e.id === id) : null;

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<EventFormData>({
    defaultValues: existingEvent ? {
      title: existingEvent.title,
      description: existingEvent.description,
      gameId: existingEvent.game.id,
      category: existingEvent.category,
      platform: existingEvent.platform,
      startTime: new Date(existingEvent.startTime),
      endTime: new Date(existingEvent.endTime),
      scoringType: existingEvent.scoringType,
      rewards: existingEvent.rewards,
      settings: existingEvent.settings
    } : {
      title: '',
      description: '',
      gameId: '',
      category: 'Speedrun',
      platform: 'NTSC',
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      scoringType: 'Schnellste Zeit',
      rewards: [
        { position: 1, xp: 500, medals: 3 },
        { position: 2, xp: 300, medals: 2 },
        { position: 3, xp: 100, medals: 1 }
      ],
      settings: {
        screenshotRequired: true,
        livestreamAllowed: true,
        minimumLevel: 1,
        aiGlitchDetection: false,
        teamScoring: false
      }
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: EventFormData) => {
    try {
      if (existingEvent) {
        await updateEvent(existingEvent.id, data);
      } else {
        await createEvent(data);
      }
      navigate('/events');
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const addRewardTier = () => {
    const currentRewards = watch('rewards') || [];
    const newPosition = currentRewards.length + 1;
    setValue('rewards', [
      ...currentRewards,
      { position: newPosition, xp: 50, medals: 1 }
    ]);
  };

  const removeRewardTier = (index: number) => {
    const currentRewards = watch('rewards') || [];
    const newRewards = currentRewards.filter((_, i) => i !== index);
    setValue('rewards', newRewards);
  };

  const updateRewardTier = (index: number, field: keyof RewardTier, value: any) => {
    const currentRewards = watch('rewards') || [];
    const newRewards = [...currentRewards];
    newRewards[index] = { ...newRewards[index], [field]: value };
    setValue('rewards', newRewards);
  };

  const tabs = [
    { id: 'basic', label: 'Eventbasis', icon: Calendar },
    { id: 'logic', label: 'Eventlogik', icon: Gamepad2 },
    { id: 'rewards', label: 'Belohnungen', icon: Trophy },
    { id: 'settings', label: 'Einstellungen', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-pixel text-n64-red text-shadow">
          {existingEvent ? '✏️ Event bearbeiten' : '🧰 Neues Event erstellen'}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-4 py-2 rounded border-2 transition-colors ${
              isPreviewMode 
                ? 'bg-n64-blue border-blue-400 text-white' 
                : 'bg-n64-dark border-n64-gray text-retro-gray hover:border-n64-blue'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Vorschau
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="retro-button flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Speichern...' : 'Speichern'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="retro-card border-n64-red bg-red-900/20">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-n64-red" />
            <span className="text-n64-red">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="retro-card">
            <div className="flex space-x-1">
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
          </div>

          {/* Tab Content */}
          <div className="retro-card">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-pixel text-n64-red">📝 Eventbasis</h2>
                
                {/* Title */}
                <div>
                  <label className="block text-retro-white font-retro mb-2">
                    Event-Titel *
                  </label>
                  <input
                    {...register('title', { required: 'Titel ist erforderlich' })}
                    placeholder="z.B. Samstags-Glitchrun #3"
                    className="retro-input w-full"
                  />
                  {errors.title && (
                    <p className="text-n64-red text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-retro-white font-retro mb-2">
                    Beschreibung (Markdown möglich)
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Beschreibe dein Event..."
                    className="retro-input w-full"
                  />
                </div>

                {/* Game Selection */}
                <div>
                  <label className="block text-retro-white font-retro mb-2">
                    Spielauswahl *
                  </label>
                  <select
                    {...register('gameId', { required: 'Spiel ist erforderlich' })}
                    className="retro-input w-full"
                  >
                    <option value="">Spiel auswählen...</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>
                        {game.title} ({game.platform})
                      </option>
                    ))}
                  </select>
                  {errors.gameId && (
                    <p className="text-n64-red text-sm mt-1">{errors.gameId.message}</p>
                  )}
                </div>

                {/* Category and Platform */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-retro-white font-retro mb-2">
                      Kategorie
                    </label>
                    <select {...register('category')} className="retro-input w-full">
                      <option value="Speedrun">Speedrun</option>
                      <option value="Sammlung">Sammlung</option>
                      <option value="Fanart">Fanart</option>
                      <option value="Gruppenzeit">Gruppenzeit</option>
                      <option value="Glitch-Only">Glitch-Only</option>
                      <option value="Challenge">Challenge</option>
                      <option value="Tournament">Tournament</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-retro-white font-retro mb-2">
                      Plattform
                    </label>
                    <select {...register('platform')} className="retro-input w-full">
                      <option value="PAL">PAL</option>
                      <option value="NTSC">NTSC</option>
                      <option value="Konsole">Konsole</option>
                      <option value="Emulator">Emulator</option>
                      <option value="Glitch">Glitch</option>
                      <option value="No Glitch">No Glitch</option>
                    </select>
                  </div>
                </div>

                {/* Start & End Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-retro-white font-retro mb-2">
                      Startzeit *
                    </label>
                    <Controller
                      control={control}
                      name="startTime"
                      rules={{ required: 'Startzeit ist erforderlich' }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          showTimeSelect
                          dateFormat="dd.MM.yyyy HH:mm"
                          className="retro-input w-full"
                          placeholderText="Startzeit wählen..."
                        />
                      )}
                    />
                    {errors.startTime && (
                      <p className="text-n64-red text-sm mt-1">{errors.startTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-retro-white font-retro mb-2">
                      Endzeit *
                    </label>
                    <Controller
                      control={control}
                      name="endTime"
                      rules={{ required: 'Endzeit ist erforderlich' }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          showTimeSelect
                          dateFormat="dd.MM.yyyy HH:mm"
                          className="retro-input w-full"
                          placeholderText="Endzeit wählen..."
                        />
                      )}
                    />
                    {errors.endTime && (
                      <p className="text-n64-red text-sm mt-1">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-pixel text-n64-red">🏁 Eventlogik & Automatik</h2>
                
                {/* Scoring Type */}
                <div>
                  <label className="block text-retro-white font-retro mb-2">
                    Bewertungstyp
                  </label>
                  <select {...register('scoringType')} className="retro-input w-full">
                    <option value="Schnellste Zeit">Schnellste Zeit</option>
                    <option value="Meiste Punkte">Meiste Punkte</option>
                    <option value="Top-Bewertung">Top-Bewertung</option>
                    <option value="Sammel-Challenge">Sammel-Challenge</option>
                    <option value="Kreativ-Wettbewerb">Kreativ-Wettbewerb</option>
                  </select>
                </div>

                {/* Result Filters */}
                <div className="space-y-4">
                  <h3 className="text-lg font-pixel text-n64-blue">Ergebnisfilter</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register('settings.screenshotRequired')}
                        className="w-4 h-4 text-n64-red bg-n64-dark border-n64-gray rounded focus:ring-n64-red"
                      />
                      <span className="text-retro-white font-retro">Screenshotpflicht</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register('settings.livestreamAllowed')}
                        className="w-4 h-4 text-n64-red bg-n64-dark border-n64-gray rounded focus:ring-n64-red"
                      />
                      <span className="text-retro-white font-retro">Livestream erlaubt</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register('settings.aiGlitchDetection')}
                        className="w-4 h-4 text-n64-red bg-n64-dark border-n64-gray rounded focus:ring-n64-red"
                      />
                      <span className="text-retro-white font-retro">KI-Glitch-Erkennung</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register('settings.teamScoring')}
                        className="w-4 h-4 text-n64-red bg-n64-dark border-n64-gray rounded focus:ring-n64-red"
                      />
                      <span className="text-retro-white font-retro">Nur Teamwertung</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-retro-white font-retro mb-2">
                      Mindestlevel zur Teilnahme
                    </label>
                    <input
                      type="number"
                      {...register('settings.minimumLevel', { min: 1, max: 100 })}
                      min="1"
                      max="100"
                      className="retro-input w-32"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="space-y-6">
                <h2 className="text-xl font-pixel text-n64-red">🏆 Belohnungen</h2>
                
                <div className="space-y-4">
                  {(watch('rewards') || []).map((reward, index) => (
                    <div key={index} className="retro-card bg-n64-dark">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-pixel text-n64-yellow">
                          {reward.position}. Platz
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeRewardTier(index)}
                          className="text-n64-red hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-retro-gray text-sm mb-1">XP</label>
                          <input
                            type="number"
                            value={reward.xp}
                            onChange={(e) => updateRewardTier(index, 'xp', parseInt(e.target.value) || 0)}
                            className="retro-input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-retro-gray text-sm mb-1">Medaillen</label>
                          <input
                            type="number"
                            value={reward.medals || 0}
                            onChange={(e) => updateRewardTier(index, 'medals', parseInt(e.target.value) || 0)}
                            className="retro-input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-retro-gray text-sm mb-1">Titel (optional)</label>
                          <input
                            type="text"
                            value={reward.title || ''}
                            onChange={(e) => updateRewardTier(index, 'title', e.target.value)}
                            placeholder="z.B. Speedrun-Meister"
                            className="retro-input w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addRewardTier}
                    className="retro-button flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Belohnung hinzufügen</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-pixel text-n64-red">⚙️ Einstellungen</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register('settings.screenshotRequired')}
                        className="w-4 h-4 text-n64-red bg-n64-dark border-n64-gray rounded focus:ring-n64-red"
                      />
                      <span className="text-retro-white font-retro">Screenshotpflicht</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register('settings.livestreamAllowed')}
                        className="w-4 h-4 text-n64-red bg-n64-dark border-n64-gray rounded focus:ring-n64-red"
                      />
                      <span className="text-retro-white font-retro">Livestream erlaubt</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register('settings.aiGlitchDetection')}
                        className="w-4 h-4 text-n64-red bg-n64-dark border-n64-gray rounded focus:ring-n64-red"
                      />
                      <span className="text-retro-white font-retro">KI-Glitch-Erkennung</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        {...register('settings.teamScoring')}
                        className="w-4 h-4 text-n64-red bg-n64-dark border-n64-gray rounded focus:ring-n64-red"
                      />
                      <span className="text-retro-white font-retro">Nur Teamwertung</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-retro-white font-retro mb-2">
                      Mindestlevel zur Teilnahme
                    </label>
                    <input
                      type="number"
                      {...register('settings.minimumLevel', { min: 1, max: 100 })}
                      min="1"
                      max="100"
                      className="retro-input w-32"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="retro-card">
            <h2 className="text-xl font-pixel text-n64-red mb-4">👁️ Live-Vorschau</h2>
            
            {isPreviewMode ? (
              <div className="space-y-4">
                <div className="bg-n64-dark p-4 rounded border border-n64-gray">
                  <h3 className="font-pixel text-lg text-retro-white mb-2">
                    {watchedValues.title || 'Event-Titel'}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-retro ${
                      watchedValues.category === 'Speedrun' ? 'bg-n64-red' :
                      watchedValues.category === 'Fanart' ? 'bg-n64-blue' :
                      watchedValues.category === 'Sammlung' ? 'bg-n64-green' :
                      'bg-retro-gray'
                    } text-white`}>
                      {watchedValues.category}
                    </span>
                    <span className="text-xs text-retro-gray">{watchedValues.platform}</span>
                  </div>
                  
                  <p className="text-sm text-retro-gray mb-3">
                    {watchedValues.description || 'Event-Beschreibung...'}
                  </p>
                  
                  <div className="text-xs text-retro-gray">
                    <div>Start: {watchedValues.startTime?.toLocaleString('de-DE')}</div>
                    <div>Ende: {watchedValues.endTime?.toLocaleString('de-DE')}</div>
                  </div>
                </div>
                
                <div className="bg-n64-dark p-4 rounded border border-n64-gray">
                  <h4 className="font-retro text-n64-yellow mb-2">🏆 Belohnungen</h4>
                  <div className="space-y-2">
                    {(watchedValues.rewards || []).map((reward, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-retro-gray">{reward.position}. Platz</span>
                        <span className="text-n64-green">{reward.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-retro-gray">
                <Eye className="h-12 w-12 mx-auto mb-4 text-n64-gray" />
                <p>Klicke auf "Vorschau" um eine Live-Vorschau zu sehen</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="retro-card">
            <h3 className="text-lg font-pixel text-n64-red mb-3">⚡ Schnellaktionen</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setValue('category', 'Speedrun');
                  setValue('scoringType', 'Schnellste Zeit');
                  setValue('platform', 'NTSC');
                }}
                className="w-full text-left p-3 bg-n64-dark rounded border border-n64-gray hover:border-n64-red transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-n64-red" />
                  <span className="font-retro text-sm">Speedrun Template</span>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setValue('category', 'Fanart');
                  setValue('scoringType', 'Top-Bewertung');
                  setValue('platform', 'Konsole');
                }}
                className="w-full text-left p-3 bg-n64-dark rounded border border-n64-gray hover:border-n64-blue transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Gamepad2 className="h-5 w-5 text-n64-blue" />
                  <span className="font-retro text-sm">Fanart Template</span>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setValue('category', 'Sammlung');
                  setValue('scoringType', 'Sammel-Challenge');
                  setValue('platform', 'Emulator');
                }}
                className="w-full text-left p-3 bg-n64-dark rounded border border-n64-gray hover:border-n64-green transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Copy className="h-5 w-5 text-n64-green" />
                  <span className="font-retro text-sm">Sammel Template</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};