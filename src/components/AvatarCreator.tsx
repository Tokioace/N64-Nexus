import React, { useState, useEffect } from 'react'
import { AvatarData, AvatarPreset } from '../types'
import AvatarRenderer from './AvatarRenderer'
import { useAvatar } from '../contexts/AvatarContext'
import { 
  Shuffle, 
  Save, 
  Gamepad2,
  Sparkles
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
    shirtPattern: undefined,
    streetStyle: 'classic',
    attitude: 'chill',
    skillLevel: 'beginner'
  })

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
        shirtPattern: initialAvatar.shirtPattern,
        streetStyle: initialAvatar.streetStyle || 'classic',
        attitude: initialAvatar.attitude || 'chill',
        skillLevel: initialAvatar.skillLevel || 'beginner'
      }
      setCurrentAvatar(avatarData)
    }
  }, [initialAvatar])

  const randomizeAvatar = () => {
    const randomAvatar = {
      headShape: ['round', 'square', 'oval', 'diamond'][Math.floor(Math.random() * 4)] as any,
      headColor: skinTones[Math.floor(Math.random() * skinTones.length)],
      eyeType: ['normal', 'wide', 'sleepy', 'angry', 'happy'][Math.floor(Math.random() * 5)] as any,
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      noseType: ['small', 'medium', 'large', 'flat', 'pointed'][Math.floor(Math.random() * 5)] as any,
      mouthType: ['smile', 'neutral', 'frown', 'open', 'smirk', 'surprised'][Math.floor(Math.random() * 6)] as any,
      hairType: ['none', 'short', 'medium', 'long', 'spiky', 'curly', 'cap', 'afro', 'mohawk', 'braids', 'cornrows'][Math.floor(Math.random() * 11)] as any,
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      accessory: ['none', 'glasses', 'hat', 'headband', 'mustache', 'beard', 'bandana', 'cap_backwards', 'sunglasses', 'chains'][Math.floor(Math.random() * 10)] as any,
      accessoryColor: '#333333',
      bodyType: ['thin', 'normal', 'wide', 'muscular'][Math.floor(Math.random() * 4)] as any,
      bodyColor: skinTones[Math.floor(Math.random() * skinTones.length)],
      shirtType: ['plain', 'striped', 'spotted', 'logo', 'hoodie', 'jacket', 'jersey', 'tank_top', 'tracksuit', 'urban_tee'][Math.floor(Math.random() * 10)] as any,
      shirtColor: shirtColors[Math.floor(Math.random() * shirtColors.length)],
      shirtPattern: undefined,
      streetStyle: ['classic', 'urban', 'freestyle', 'retro', 'gangsta'][Math.floor(Math.random() * 5)] as any,
      attitude: ['chill', 'aggressive', 'cocky', 'focused', 'playful'][Math.floor(Math.random() * 5)] as any,
      skillLevel: ['beginner', 'amateur', 'pro', 'legend'][Math.floor(Math.random() * 4)] as any
    }
    setCurrentAvatar(randomAvatar)
  }

  const mockAvatar: AvatarData = {
    id: 'preview',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...currentAvatar
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
            <Gamepad2 className="mr-3 text-blue-400" />
            Avatar Creator
          </h1>
          <p className="text-white/70">N64 Retro Style</p>
        </div>

        {/* Avatar Preview */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <AvatarRenderer 
              avatar={mockAvatar} 
              size="xl" 
              animate={true}
              className="transform hover:rotate-12 transition-all duration-500"
            />
          </div>
        </div>

        {/* Random Button */}
        <div className="text-center mb-8">
          <button
            onClick={randomizeAvatar}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center mx-auto text-lg shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Shuffle className="w-5 h-5 mr-3" />
            <Sparkles className="w-4 h-4 mr-2" />
            Random Avatar
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onSave(currentAvatar)}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Avatar
          </button>
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AvatarCreator