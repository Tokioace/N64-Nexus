import React, { useState, useEffect } from 'react'
import { AvatarData, AvatarPreset } from '../types'
import AvatarRenderer from './AvatarRenderer'
import { useAvatar } from '../contexts/AvatarContext'
import { 
  Shuffle, 
  Save, 
  Palette, 
  Eye, 
  Smile, 
  Crown,
  Shirt,
  User,
  Undo2,
  Redo2,
  Sparkles,
  Gamepad2,
  Star,
  Lock
} from 'lucide-react'

interface AvatarCreatorProps {
  initialAvatar?: AvatarData
  onSave: (avatar: Omit<AvatarData, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel?: () => void
}

const AvatarCreator: React.FC<AvatarCreatorProps> = ({
  initialAvatar,
  onSave,
  onCancel
}) => {
  const { presets, isPresetUnlocked } = useAvatar()
  const [currentAvatar, setCurrentAvatar] = useState<Omit<AvatarData, 'id' | 'createdAt' | 'updatedAt'>>({
    headShape: 'round',
    headColor: '#FFDBAC',
    eyeType: 'normal',
    eyeColor: '#4A90E2',
    noseType: 'medium',
    mouthType: 'smile',
    hairType: 'short',
    hairColor: '#8B4513',
    accessory: 'none',
    accessoryColor: '#333333',
    bodyType: 'normal',
    bodyColor: '#FFDBAC',
    shirtType: 'plain',
    shirtColor: '#FF6B6B',
    shirtPattern: undefined
  })

  const [activeTab, setActiveTab] = useState<'presets' | 'head' | 'face' | 'hair' | 'accessories' | 'body'>('presets')
  const [history, setHistory] = useState<typeof currentAvatar[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // N64-style color palettes
  const skinTones = ['#FFDBAC', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#A0522D', '#654321']
  const hairColors = ['#000000', '#8B4513', '#D2691E', '#FFD700', '#FF6347', '#32CD32', '#4169E1', '#9400D3']
  const eyeColors = ['#4A90E2', '#228B22', '#8B4513', '#FF6347', '#9400D3', '#FF1493', '#00CED1', '#000000']
  const shirtColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F39C12', '#E74C3C']

  useEffect(() => {
    if (initialAvatar) {
      const avatarData = {
        headShape: initialAvatar.headShape,
        headColor: initialAvatar.headColor,
        eyeType: initialAvatar.eyeType,
        eyeColor: initialAvatar.eyeColor,
        noseType: initialAvatar.noseType,
        mouthType: initialAvatar.mouthType,
        hairType: initialAvatar.hairType,
        hairColor: initialAvatar.hairColor,
        accessory: initialAvatar.accessory,
        accessoryColor: initialAvatar.accessoryColor,
        bodyType: initialAvatar.bodyType,
        bodyColor: initialAvatar.bodyColor,
        shirtType: initialAvatar.shirtType,
        shirtColor: initialAvatar.shirtColor,
        shirtPattern: initialAvatar.shirtPattern
      }
      setCurrentAvatar(avatarData)
      setHistory([avatarData])
      setHistoryIndex(0)
    } else {
      setHistory([currentAvatar])
      setHistoryIndex(0)
    }
  }, [initialAvatar])

  const updateAvatar = (updates: Partial<typeof currentAvatar>) => {
    const newAvatar = { ...currentAvatar, ...updates }
    setCurrentAvatar(newAvatar)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newAvatar)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentAvatar(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentAvatar(history[historyIndex + 1])
    }
  }

  const randomizeAvatar = () => {
    const randomAvatar = {
      headShape: ['round', 'square', 'oval', 'diamond'][Math.floor(Math.random() * 4)] as any,
      headColor: skinTones[Math.floor(Math.random() * skinTones.length)],
      eyeType: ['normal', 'wide', 'sleepy', 'angry', 'happy'][Math.floor(Math.random() * 5)] as any,
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      noseType: ['small', 'medium', 'large', 'flat', 'pointed'][Math.floor(Math.random() * 5)] as any,
      mouthType: ['smile', 'neutral', 'frown', 'open', 'smirk', 'surprised'][Math.floor(Math.random() * 6)] as any,
      hairType: ['none', 'short', 'medium', 'long', 'spiky', 'curly', 'cap'][Math.floor(Math.random() * 7)] as any,
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      accessory: ['none', 'glasses', 'hat', 'headband', 'mustache', 'beard'][Math.floor(Math.random() * 6)] as any,
      accessoryColor: '#333333',
      bodyType: ['thin', 'normal', 'wide', 'muscular'][Math.floor(Math.random() * 4)] as any,
      bodyColor: skinTones[Math.floor(Math.random() * skinTones.length)],
      shirtType: ['plain', 'striped', 'spotted', 'logo', 'hoodie', 'jacket'][Math.floor(Math.random() * 6)] as any,
      shirtColor: shirtColors[Math.floor(Math.random() * shirtColors.length)],
      shirtPattern: undefined
    }
    updateAvatar(randomAvatar)
  }

  const renderColorPicker = (colors: string[], currentColor: string, onChange: (color: string) => void) => (
    <div className="grid grid-cols-4 gap-2 p-2">
      {colors.map((color) => (
        <button
          key={color}
          className={`
            w-8 h-8 rounded-lg border-2 transition-all duration-200
            ${currentColor === color 
              ? 'border-blue-400 scale-110 shadow-lg' 
              : 'border-white/20 hover:border-white/40 hover:scale-105'
            }
          `}
          style={{ 
            backgroundColor: color,
            boxShadow: currentColor === color 
              ? `0 0 12px ${color}50, inset -2px -2px 4px rgba(0,0,0,0.3)` 
              : 'inset -2px -2px 4px rgba(0,0,0,0.3)'
          }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  )

  const renderOptionButtons = (options: string[], currentValue: string, onChange: (value: string) => void) => (
    <div className="grid grid-cols-2 gap-2 p-2">
      {options.map((option) => (
        <button
          key={option}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
            ${currentValue === option
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }
          `}
          style={{
            boxShadow: currentValue === option 
              ? 'inset -2px -2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
              : 'inset -2px -2px 4px rgba(0,0,0,0.2)'
          }}
          onClick={() => onChange(option)}
        >
          {option.replace(/([A-Z])/g, ' $1').trim()}
        </button>
      ))}
    </div>
  )

  const tabIcons = {
    presets: Star,
    head: User,
    face: Eye,
    hair: Crown,
    accessories: Sparkles,
    body: Shirt
  }

  const loadPreset = (preset: AvatarPreset) => {
    if (!isPresetUnlocked(preset)) return
    
    updateAvatar({
      headShape: preset.avatar.headShape,
      headColor: preset.avatar.headColor,
      eyeType: preset.avatar.eyeType,
      eyeColor: preset.avatar.eyeColor,
      noseType: preset.avatar.noseType,
      mouthType: preset.avatar.mouthType,
      hairType: preset.avatar.hairType,
      hairColor: preset.avatar.hairColor,
      accessory: preset.avatar.accessory,
      accessoryColor: preset.avatar.accessoryColor,
      bodyType: preset.avatar.bodyType,
      bodyColor: preset.avatar.bodyColor,
      shirtType: preset.avatar.shirtType,
      shirtColor: preset.avatar.shirtColor,
      shirtPattern: preset.avatar.shirtPattern
    })
  }

  const mockAvatar: AvatarData = {
    id: 'preview',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...currentAvatar
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Gamepad2 className="mr-3 text-blue-400" />
            N64 AVATAR CREATOR
          </h1>
          <p className="text-white/70 text-lg">Silicon Graphics Style • Retro 3D Polygons</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Panel */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
              <div className="flex justify-center mb-6">
                <AvatarRenderer 
                  avatar={mockAvatar} 
                  size="xl" 
                  animate={true}
                  className="transform hover:rotate-12 transition-all duration-500"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="retro-button bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="retro-button bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={randomizeAvatar}
                  className="retro-button bg-purple-600 hover:bg-purple-500"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Random
                </button>
              </div>

              {/* Save/Cancel */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => onSave(currentAvatar)}
                  className="retro-button bg-green-600 hover:bg-green-500 text-lg px-8"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Avatar
                </button>
                
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="retro-button bg-gray-600 hover:bg-gray-500 text-lg px-6"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {/* Tab Navigation */}
            <div className="flex mb-6 bg-black/20 rounded-xl p-1">
              {Object.entries(tabIcons).map(([tab, Icon]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`
                    flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 capitalize
                    ${activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'presets' && (
                <div>
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    N64-Style Presets
                  </h3>
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {presets.map((preset) => {
                      const isUnlocked = isPresetUnlocked(preset)
                      const mockPresetAvatar: AvatarData = {
                        id: `preset-${preset.id}`,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...preset.avatar
                      }
                      
                      return (
                        <button
                          key={preset.id}
                          onClick={() => loadPreset(preset)}
                          disabled={!isUnlocked}
                          className={`
                            p-4 rounded-xl border-2 transition-all duration-200 text-left
                            ${isUnlocked
                              ? 'border-white/20 hover:border-blue-400 hover:bg-white/10 cursor-pointer'
                              : 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="relative">
                              <AvatarRenderer 
                                avatar={mockPresetAvatar} 
                                size="sm" 
                                animate={false}
                                className={isUnlocked ? '' : 'grayscale opacity-50'}
                              />
                              {!isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                                {preset.name}
                              </h4>
                              <p className={`text-xs ${isUnlocked ? 'text-white/70' : 'text-gray-500'}`}>
                                {preset.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              preset.category === 'retro' ? 'bg-purple-600/30 text-purple-300' :
                              preset.category === 'cool' ? 'bg-blue-600/30 text-blue-300' :
                              preset.category === 'fun' ? 'bg-green-600/30 text-green-300' :
                              'bg-gray-600/30 text-gray-300'
                            }`}>
                              {preset.category}
                            </span>
                            
                            {!isUnlocked && preset.unlockRequirement && (
                              <span className="text-xs text-gray-500">
                                {preset.unlockRequirement.type === 'level' ? `Level ${preset.unlockRequirement.value}` :
                                 preset.unlockRequirement.type === 'points' ? `${preset.unlockRequirement.value} Points` :
                                 'Achievement Required'}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'head' && (
                <>
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Head Shape
                    </h3>
                    {renderOptionButtons(
                      ['round', 'square', 'oval', 'diamond'],
                      currentAvatar.headShape,
                      (value) => updateAvatar({ headShape: value as any })
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <Palette className="w-4 h-4 mr-2" />
                      Skin Color
                    </h3>
                    {renderColorPicker(
                      skinTones,
                      currentAvatar.headColor,
                      (color) => updateAvatar({ headColor: color, bodyColor: color })
                    )}
                  </div>
                </>
              )}

              {activeTab === 'face' && (
                <>
                  <div>
                    <h3 className="text-white font-semibold mb-3">Eye Type</h3>
                    {renderOptionButtons(
                      ['normal', 'wide', 'sleepy', 'angry', 'happy', 'closed'],
                      currentAvatar.eyeType,
                      (value) => updateAvatar({ eyeType: value as any })
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">Eye Color</h3>
                    {renderColorPicker(
                      eyeColors,
                      currentAvatar.eyeColor,
                      (color) => updateAvatar({ eyeColor: color })
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">Nose Type</h3>
                    {renderOptionButtons(
                      ['small', 'medium', 'large', 'flat', 'pointed'],
                      currentAvatar.noseType,
                      (value) => updateAvatar({ noseType: value as any })
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">Mouth Type</h3>
                    {renderOptionButtons(
                      ['smile', 'neutral', 'frown', 'open', 'smirk', 'surprised'],
                      currentAvatar.mouthType,
                      (value) => updateAvatar({ mouthType: value as any })
                    )}
                  </div>
                </>
              )}

              {activeTab === 'hair' && (
                <>
                  <div>
                    <h3 className="text-white font-semibold mb-3">Hair Style</h3>
                    {renderOptionButtons(
                      ['none', 'short', 'medium', 'long', 'spiky', 'curly', 'cap'],
                      currentAvatar.hairType,
                      (value) => updateAvatar({ hairType: value as any })
                    )}
                  </div>

                  {currentAvatar.hairType !== 'none' && (
                    <div>
                      <h3 className="text-white font-semibold mb-3">Hair Color</h3>
                      {renderColorPicker(
                        hairColors,
                        currentAvatar.hairColor,
                        (color) => updateAvatar({ hairColor: color })
                      )}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'accessories' && (
                <>
                  <div>
                    <h3 className="text-white font-semibold mb-3">Accessory</h3>
                    {renderOptionButtons(
                      ['none', 'glasses', 'hat', 'headband', 'earrings', 'mustache', 'beard'],
                      currentAvatar.accessory || 'none',
                      (value) => updateAvatar({ accessory: value as any })
                    )}
                  </div>

                  {currentAvatar.accessory && currentAvatar.accessory !== 'none' && (
                    <div>
                      <h3 className="text-white font-semibold mb-3">Accessory Color</h3>
                      {renderColorPicker(
                        ['#333333', '#8B4513', '#FFD700', '#FF6347', '#4169E1', '#9400D3', '#FFFFFF'],
                        currentAvatar.accessoryColor,
                        (color) => updateAvatar({ accessoryColor: color })
                      )}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'body' && (
                <>
                  <div>
                    <h3 className="text-white font-semibold mb-3">Body Type</h3>
                    {renderOptionButtons(
                      ['thin', 'normal', 'wide', 'muscular'],
                      currentAvatar.bodyType,
                      (value) => updateAvatar({ bodyType: value as any })
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">Shirt Style</h3>
                    {renderOptionButtons(
                      ['plain', 'striped', 'spotted', 'logo', 'hoodie', 'jacket'],
                      currentAvatar.shirtType,
                      (value) => updateAvatar({ shirtType: value as any })
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">Shirt Color</h3>
                    {renderColorPicker(
                      shirtColors,
                      currentAvatar.shirtColor,
                      (color) => updateAvatar({ shirtColor: color })
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .retro-button {
          @apply px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center;
          box-shadow: inset -3px -3px 6px rgba(0,0,0,0.3), inset 3px 3px 6px rgba(255,255,255,0.1);
        }
        .retro-button:hover {
          transform: translateY(-1px);
          box-shadow: inset -3px -3px 6px rgba(0,0,0,0.4), inset 3px 3px 6px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.3);
        }
        .retro-button:active {
          transform: translateY(0);
          box-shadow: inset -2px -2px 4px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  )
}

export default AvatarCreator