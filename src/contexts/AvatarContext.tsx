import React, { createContext, useContext, useState, useEffect } from 'react'
import { AvatarData, AvatarPreset, AvatarContextType } from '../types'
import { useUser } from './UserContext'

const AvatarContext = createContext<AvatarContextType | undefined>(undefined)

export const useAvatar = () => {
  const context = useContext(AvatarContext)
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider')
  }
  return context
}

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, saveUser } = useUser()
  const [currentAvatar, setCurrentAvatar] = useState<AvatarData | null>(null)

  // N64-inspired presets
  const presets: AvatarPreset[] = [
    {
      id: 'retro-mario-inspired',
      name: 'Retro Hero',
      description: 'Inspired by classic platformer heroes',
      category: 'retro',
      avatar: {
        headShape: 'round',
        headColor: '#FFDBAC',
        eyeType: 'happy',
        eyeColor: '#4A90E2',
        noseType: 'large',
        mouthType: 'smile',
        hairType: 'cap',
        hairColor: '#FF0000',
        accessory: 'mustache',
        accessoryColor: '#8B4513',
        bodyType: 'wide',
        bodyColor: '#FFDBAC',
        shirtType: 'plain',
        shirtColor: '#0000FF',
        shirtPattern: undefined,
        streetStyle: 'retro',
        attitude: 'playful',
        skillLevel: 'pro'
      }
    },
    {
      id: 'zelda-inspired',
      name: 'Forest Adventurer',
      description: 'Mystical forest explorer style',
      category: 'classic',
      avatar: {
        headShape: 'oval',
        headColor: '#F1C27D',
        eyeType: 'normal',
        eyeColor: '#4169E1',
        noseType: 'small',
        mouthType: 'neutral',
        hairType: 'medium',
        hairColor: '#FFD700',
        accessory: 'headband',
        accessoryColor: '#32CD32',
        bodyType: 'normal',
        bodyColor: '#F1C27D',
        shirtType: 'plain',
        shirtColor: '#228B22',
        shirtPattern: undefined,
        streetStyle: 'classic',
        attitude: 'focused',
        skillLevel: 'legend'
      }
    },
    {
      id: 'goldeneye-agent',
      name: 'Secret Agent',
      description: 'Professional spy aesthetic',
      category: 'cool',
      avatar: {
        headShape: 'square',
        headColor: '#E0AC69',
        eyeType: 'normal',
        eyeColor: '#8B4513',
        noseType: 'medium',
        mouthType: 'smirk',
        hairType: 'short',
        hairColor: '#000000',
        accessory: 'glasses',
        accessoryColor: '#333333',
        bodyType: 'muscular',
        bodyColor: '#E0AC69',
        shirtType: 'plain',
        shirtColor: '#000000',
        shirtPattern: undefined,
        streetStyle: 'urban',
        attitude: 'cocky',
        skillLevel: 'pro'
      },
      unlockRequirement: {
        type: 'level',
        value: 5
      }
    },
    {
      id: 'banjo-inspired',
      name: 'Wild Adventurer',
      description: 'Bear-and-bird duo inspired',
      category: 'fun',
      avatar: {
        headShape: 'round',
        headColor: '#C68642',
        eyeType: 'wide',
        eyeColor: '#000000',
        noseType: 'large',
        mouthType: 'smile',
        hairType: 'none',
        hairColor: '#8B4513',
        accessory: 'hat',
        accessoryColor: '#FFD700',
        bodyType: 'wide',
        bodyColor: '#C68642',
        shirtType: 'plain',
        shirtColor: '#FF6347',
        shirtPattern: undefined,
        streetStyle: 'freestyle',
        attitude: 'playful',
        skillLevel: 'amateur'
      }
    },
    {
      id: 'dk-inspired',
      name: 'Jungle King',
      description: 'Gorilla strength and style',
      category: 'fun',
      avatar: {
        headShape: 'square',
        headColor: '#8B4513',
        eyeType: 'angry',
        eyeColor: '#000000',
        noseType: 'large',
        mouthType: 'frown',
        hairType: 'none',
        hairColor: '#8B4513',
        accessory: 'none',
        accessoryColor: '#333333',
        bodyType: 'muscular',
        bodyColor: '#8B4513',
        shirtType: 'plain',
        shirtColor: '#FF0000',
        shirtPattern: undefined,
        streetStyle: 'gangsta',
        attitude: 'aggressive',
        skillLevel: 'legend'
      },
      unlockRequirement: {
        type: 'points',
        value: 500
      }
    },
    {
      id: 'starfox-pilot',
      name: 'Space Pilot',
      description: 'Intergalactic fighter pilot',
      category: 'cool',
      avatar: {
        headShape: 'oval',
        headColor: '#FFDBAC',
        eyeType: 'normal',
        eyeColor: '#32CD32',
        noseType: 'small',
        mouthType: 'neutral',
        hairType: 'short',
        hairColor: '#8B4513',
        accessory: 'headband',
        accessoryColor: '#4169E1',
        bodyType: 'normal',
        bodyColor: '#FFDBAC',
        shirtType: 'jacket',
        shirtColor: '#4169E1',
        shirtPattern: undefined,
        streetStyle: 'classic',
        attitude: 'focused',
        skillLevel: 'pro'
      },
      unlockRequirement: {
        type: 'level',
        value: 10
      }
    },
    {
      id: 'retro-gamer',
      name: 'Pixel Master',
      description: 'Classic gamer style',
      category: 'retro',
      avatar: {
        headShape: 'round',
        headColor: '#FFDBAC',
        eyeType: 'happy',
        eyeColor: '#4A90E2',
        noseType: 'medium',
        mouthType: 'smile',
        hairType: 'spiky',
        hairColor: '#FF6347',
        accessory: 'glasses',
        accessoryColor: '#000000',
        bodyType: 'thin',
        bodyColor: '#FFDBAC',
        shirtType: 'logo',
        shirtColor: '#9400D3',
        shirtPattern: undefined,
        streetStyle: 'retro',
        attitude: 'chill',
        skillLevel: 'pro'
      }
    },
    {
      id: 'conker-inspired',
      name: 'Cheeky Rascal',
      description: 'Mischievous and fun-loving',
      category: 'fun',
      avatar: {
        headShape: 'round',
        headColor: '#D2691E',
        eyeType: 'sleepy',
        eyeColor: '#000000',
        noseType: 'small',
        mouthType: 'smirk',
        hairType: 'none',
        hairColor: '#8B4513',
        accessory: 'none',
        accessoryColor: '#333333',
        bodyType: 'normal',
        bodyColor: '#D2691E',
        shirtType: 'hoodie',
        shirtColor: '#4ECDC4',
        shirtPattern: undefined,
        streetStyle: 'freestyle',
        attitude: 'chill',
        skillLevel: 'amateur'
      },
      unlockRequirement: {
        type: 'achievement',
        value: 'first_quiz_completed'
      }
    },
    {
      id: 'fifa-street-freestyle',
      name: 'Street Freestyler',
      description: 'FIFA Street PS2 inspired freestyle master',
      category: 'cool',
      avatar: {
        headShape: 'round',
        headColor: '#8D5524',
        eyeType: 'normal',
        eyeColor: '#8B4513',
        noseType: 'medium',
        mouthType: 'smirk',
        hairType: 'afro',
        hairColor: '#000000',
        accessory: 'bandana',
        accessoryColor: '#FF0000',
        bodyType: 'muscular',
        bodyColor: '#8D5524',
        shirtType: 'jersey',
        shirtColor: '#00FF00',
        shirtPattern: undefined,
        streetStyle: 'freestyle',
        attitude: 'cocky',
        skillLevel: 'legend'
      },
      unlockRequirement: {
        type: 'level',
        value: 15
      }
    },
    {
      id: 'fifa-street-urban',
      name: 'Urban Baller',
      description: 'Street-smart urban player',
      category: 'cool',
      avatar: {
        headShape: 'square',
        headColor: '#654321',
        eyeType: 'normal',
        eyeColor: '#000000',
        noseType: 'flat',
        mouthType: 'neutral',
        hairType: 'cornrows',
        hairColor: '#000000',
        accessory: 'chains',
        accessoryColor: '#FFD700',
        bodyType: 'wide',
        bodyColor: '#654321',
        shirtType: 'tracksuit',
        shirtColor: '#4169E1',
        shirtPattern: undefined,
        streetStyle: 'urban',
        attitude: 'aggressive',
        skillLevel: 'pro'
      },
      unlockRequirement: {
        type: 'points',
        value: 1000
      }
    },
    {
      id: 'fifa-street-gangsta',
      name: 'Street Gangsta',
      description: 'Tough street player with attitude',
      category: 'cool',
      avatar: {
        headShape: 'diamond',
        headColor: '#A0522D',
        eyeType: 'angry',
        eyeColor: '#8B4513',
        noseType: 'large',
        mouthType: 'frown',
        hairType: 'mohawk',
        hairColor: '#FF0000',
        accessory: 'sunglasses',
        accessoryColor: '#000000',
        bodyType: 'muscular',
        bodyColor: '#A0522D',
        shirtType: 'tank_top',
        shirtColor: '#000000',
        shirtPattern: undefined,
        streetStyle: 'gangsta',
        attitude: 'aggressive',
        skillLevel: 'legend'
      },
      unlockRequirement: {
        type: 'level',
        value: 20
      }
    }
  ]

  useEffect(() => {
    if (user?.avatar) {
      setCurrentAvatar(user.avatar)
    }
  }, [user])

  const saveAvatar = (avatarData: Omit<AvatarData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    const newAvatar: AvatarData = {
      ...avatarData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedUser = {
      ...user,
      avatar: newAvatar
    }

    // Use the saveUser function from UserContext if available
    if (typeof saveUser === 'function') {
      saveUser(updatedUser)
    } else {
      // Fallback to localStorage
      localStorage.setItem('battle64-user', JSON.stringify(updatedUser))
    }

    setCurrentAvatar(newAvatar)
  }

  const loadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId)
    if (!preset || !isPresetUnlocked(preset)) return

    const avatarData: Omit<AvatarData, 'id' | 'createdAt' | 'updatedAt'> = {
      ...preset.avatar
    }

    saveAvatar(avatarData)
  }

  const generateRandomAvatar = (): AvatarData => {
    const headShapes = ['round', 'square', 'oval', 'diamond'] as const
    const skinTones = ['#FFDBAC', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#A0522D', '#654321']
    const eyeTypes = ['normal', 'wide', 'sleepy', 'angry', 'happy', 'closed'] as const
    const eyeColors = ['#4A90E2', '#228B22', '#8B4513', '#FF6347', '#9400D3', '#FF1493', '#00CED1', '#000000']
    const noseTypes = ['small', 'medium', 'large', 'flat', 'pointed'] as const
    const mouthTypes = ['smile', 'neutral', 'frown', 'open', 'smirk', 'surprised'] as const
    const hairTypes = ['none', 'short', 'medium', 'long', 'spiky', 'curly', 'cap', 'afro', 'mohawk', 'braids', 'cornrows'] as const
    const hairColors = ['#000000', '#8B4513', '#D2691E', '#FFD700', '#FF6347', '#32CD32', '#4169E1', '#9400D3']
    const accessories = ['none', 'glasses', 'hat', 'headband', 'earrings', 'mustache', 'beard', 'bandana', 'cap_backwards', 'sunglasses', 'chains'] as const
    const bodyTypes = ['thin', 'normal', 'wide', 'muscular'] as const
    const shirtTypes = ['plain', 'striped', 'spotted', 'logo', 'hoodie', 'jacket', 'jersey', 'tank_top', 'tracksuit', 'urban_tee'] as const
    const shirtColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F39C12', '#E74C3C']

    const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)]

    return {
      id: 'random-' + Date.now(),
      headShape: headShapes[Math.floor(Math.random() * headShapes.length)],
      headColor: skinTone,
      eyeType: eyeTypes[Math.floor(Math.random() * eyeTypes.length)],
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      noseType: noseTypes[Math.floor(Math.random() * noseTypes.length)],
      mouthType: mouthTypes[Math.floor(Math.random() * mouthTypes.length)],
      hairType: hairTypes[Math.floor(Math.random() * hairTypes.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      accessory: accessories[Math.floor(Math.random() * accessories.length)],
      accessoryColor: '#333333',
      bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
      bodyColor: skinTone,
      shirtType: shirtTypes[Math.floor(Math.random() * shirtTypes.length)],
      shirtColor: shirtColors[Math.floor(Math.random() * shirtColors.length)],
      shirtPattern: undefined,
      streetStyle: ['classic', 'urban', 'freestyle', 'retro', 'gangsta'][Math.floor(Math.random() * 5)] as any,
      attitude: ['chill', 'aggressive', 'cocky', 'focused', 'playful'][Math.floor(Math.random() * 5)] as any,
      skillLevel: ['beginner', 'amateur', 'pro', 'legend'][Math.floor(Math.random() * 4)] as any,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const isPresetUnlocked = (preset: AvatarPreset): boolean => {
    if (!preset.unlockRequirement || !user) return true

    const { type, value } = preset.unlockRequirement

    switch (type) {
      case 'level':
        return user.level >= (value as number)
      case 'points':
        return user.points >= (value as number)
      case 'achievement':
        return user.achievements.some(achievement => achievement.id === value)
      default:
        return true
    }
  }

  return (
    <AvatarContext.Provider
      value={{
        currentAvatar,
        presets,
        saveAvatar,
        loadPreset,
        generateRandomAvatar,
        isPresetUnlocked
      }}
    >
      {children}
    </AvatarContext.Provider>
  )
}

export default AvatarProvider