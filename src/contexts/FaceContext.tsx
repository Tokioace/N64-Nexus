import React, { createContext, useContext, useState, useEffect } from 'react'
import { FaceData, FacePreset, FaceContextType } from '../types'
import { useUser } from './UserContext'

const FaceContext = createContext<FaceContextType | undefined>(undefined)

export const useFace = () => {
  const context = useContext(FaceContext)
  if (!context) {
    throw new Error('useFace must be used within a FaceProvider')
  }
  return context
}

export const FaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, saveUser } = useUser()
  const [currentFace, setCurrentFace] = useState<FaceData | null>(null)

  // Face presets with different styles
  const presets: FacePreset[] = [
    {
      id: 'classic-male',
      name: 'Classic Male',
      description: 'Traditional masculine features',
      category: 'realistic',
      face: {
        faceShape: 'square',
        faceWidth: 1.1,
        faceHeight: 1.0,
        skinTone: '#FFDBAC',
        
        eyeShape: 'almond',
        eyeSize: 1.0,
        eyeDistance: 1.0,
        eyeColor: '#4A90E2',
        eyebrowShape: 'straight',
        eyebrowThickness: 1.2,
        eyebrowColor: '#8B4513',
        eyelashes: false,
        
        noseShape: 'straight',
        noseSize: 1.1,
        noseWidth: 1.0,
        
        lipShape: 'thin',
        lipSize: 0.9,
        lipColor: '#CD919E',
        mouthExpression: 'neutral',
        
        cheekbones: 'medium',
        jawShape: 'defined',
        chinShape: 'medium',
        
        hairStyle: 'short',
        hairColor: '#8B4513',
        hairLength: 0.8,
        hairVolume: 1.0,
        
        facialHair: 'none',
        facialHairColor: '#8B4513',
        facialHairLength: 1.0,
        
        glasses: 'none',
        glassesColor: '#000000',
        earrings: 'none',
        earringColor: '#FFD700',
        
        lipstick: false,
        lipstickColor: '#FF1493',
        eyeshadow: false,
        eyeshadowColor: '#9370DB',
        blush: false,
        blushColor: '#FF69B4',
        
        ageGroup: 'adult',
        gender: 'masculine'
      }
    },
    {
      id: 'classic-female',
      name: 'Classic Female',
      description: 'Traditional feminine features',
      category: 'realistic',
      face: {
        faceShape: 'oval',
        faceWidth: 0.95,
        faceHeight: 1.0,
        skinTone: '#FFDBAC',
        
        eyeShape: 'almond',
        eyeSize: 1.2,
        eyeDistance: 1.0,
        eyeColor: '#228B22',
        eyebrowShape: 'arched',
        eyebrowThickness: 0.8,
        eyebrowColor: '#8B4513',
        eyelashes: true,
        
        noseShape: 'button',
        noseSize: 0.9,
        noseWidth: 0.9,
        
        lipShape: 'full',
        lipSize: 1.1,
        lipColor: '#FF6B9D',
        mouthExpression: 'smile',
        
        cheekbones: 'high',
        jawShape: 'soft',
        chinShape: 'small',
        
        hairStyle: 'long',
        hairColor: '#D2691E',
        hairLength: 1.5,
        hairVolume: 1.2,
        
        facialHair: 'none',
        facialHairColor: '#8B4513',
        facialHairLength: 1.0,
        
        glasses: 'none',
        glassesColor: '#000000',
        earrings: 'studs',
        earringColor: '#FFD700',
        
        lipstick: true,
        lipstickColor: '#FF1493',
        eyeshadow: false,
        eyeshadowColor: '#9370DB',
        blush: true,
        blushColor: '#FF69B4',
        
        ageGroup: 'adult',
        gender: 'feminine'
      }
    },
    {
      id: 'anime-style',
      name: 'Anime Character',
      description: 'Large eyes and stylized features',
      category: 'anime',
      face: {
        faceShape: 'round',
        faceWidth: 0.9,
        faceHeight: 1.0,
        skinTone: '#FFDBAC',
        
        eyeShape: 'round',
        eyeSize: 1.4,
        eyeDistance: 1.1,
        eyeColor: '#9400D3',
        eyebrowShape: 'thin',
        eyebrowThickness: 0.6,
        eyebrowColor: '#000000',
        eyelashes: true,
        
        noseShape: 'button',
        noseSize: 0.7,
        noseWidth: 0.8,
        
        lipShape: 'small',
        lipSize: 0.8,
        lipColor: '#FF6B9D',
        mouthExpression: 'smile',
        
        cheekbones: 'low',
        jawShape: 'soft',
        chinShape: 'small',
        
        hairStyle: 'long',
        hairColor: '#FF6347',
        hairLength: 1.8,
        hairVolume: 1.4,
        
        facialHair: 'none',
        facialHairColor: '#8B4513',
        facialHairLength: 1.0,
        
        glasses: 'none',
        glassesColor: '#000000',
        earrings: 'none',
        earringColor: '#FFD700',
        
        lipstick: false,
        lipstickColor: '#FF1493',
        eyeshadow: true,
        eyeshadowColor: '#9370DB',
        blush: true,
        blushColor: '#FF69B4',
        
        ageGroup: 'teen',
        gender: 'feminine'
      }
    },
    {
      id: 'cartoon-hero',
      name: 'Cartoon Hero',
      description: 'Bold and expressive cartoon style',
      category: 'cartoon',
      face: {
        faceShape: 'square',
        faceWidth: 1.2,
        faceHeight: 1.1,
        skinTone: '#F1C27D',
        
        eyeShape: 'round',
        eyeSize: 1.3,
        eyeDistance: 1.0,
        eyeColor: '#4A90E2',
        eyebrowShape: 'thick',
        eyebrowThickness: 1.5,
        eyebrowColor: '#000000',
        eyelashes: false,
        
        noseShape: 'straight',
        noseSize: 1.0,
        noseWidth: 1.0,
        
        lipShape: 'wide',
        lipSize: 1.2,
        lipColor: '#CD919E',
        mouthExpression: 'smile',
        
        cheekbones: 'prominent',
        jawShape: 'defined',
        chinShape: 'large',
        
        hairStyle: 'short',
        hairColor: '#FFD700',
        hairLength: 0.9,
        hairVolume: 1.3,
        
        facialHair: 'none',
        facialHairColor: '#8B4513',
        facialHairLength: 1.0,
        
        glasses: 'none',
        glassesColor: '#000000',
        earrings: 'none',
        earringColor: '#FFD700',
        
        lipstick: false,
        lipstickColor: '#FF1493',
        eyeshadow: false,
        eyeshadowColor: '#9370DB',
        blush: false,
        blushColor: '#FF69B4',
        
        ageGroup: 'adult',
        gender: 'masculine'
      }
    },
    {
      id: 'retro-gamer',
      name: 'Retro Gamer',
      description: 'Classic 80s/90s style',
      category: 'retro',
      face: {
        faceShape: 'oval',
        faceWidth: 1.0,
        faceHeight: 1.0,
        skinTone: '#FFDBAC',
        
        eyeShape: 'almond',
        eyeSize: 1.0,
        eyeDistance: 1.0,
        eyeColor: '#8B4513',
        eyebrowShape: 'straight',
        eyebrowThickness: 1.0,
        eyebrowColor: '#8B4513',
        eyelashes: false,
        
        noseShape: 'straight',
        noseSize: 1.0,
        noseWidth: 1.0,
        
        lipShape: 'thin',
        lipSize: 1.0,
        lipColor: '#CD919E',
        mouthExpression: 'smirk',
        
        cheekbones: 'medium',
        jawShape: 'soft',
        chinShape: 'medium',
        
        hairStyle: 'medium',
        hairColor: '#8B4513',
        hairLength: 1.2,
        hairVolume: 1.1,
        
        facialHair: 'mustache',
        facialHairColor: '#8B4513',
        facialHairLength: 1.0,
        
        glasses: 'square',
        glassesColor: '#000000',
        earrings: 'none',
        earringColor: '#FFD700',
        
        lipstick: false,
        lipstickColor: '#FF1493',
        eyeshadow: false,
        eyeshadowColor: '#9370DB',
        blush: false,
        blushColor: '#FF69B4',
        
        ageGroup: 'adult',
        gender: 'masculine'
      }
    },
    {
      id: 'punk-rebel',
      name: 'Punk Rebel',
      description: 'Edgy punk rock style',
      category: 'stylized',
      face: {
        faceShape: 'diamond',
        faceWidth: 0.95,
        faceHeight: 1.1,
        skinTone: '#F1C27D',
        
        eyeShape: 'upturned',
        eyeSize: 1.1,
        eyeDistance: 1.0,
        eyeColor: '#32CD32',
        eyebrowShape: 'angled',
        eyebrowThickness: 0.8,
        eyebrowColor: '#000000',
        eyelashes: true,
        
        noseShape: 'straight',
        noseSize: 1.0,
        noseWidth: 1.0,
        
        lipShape: 'thin',
        lipSize: 1.0,
        lipColor: '#000000',
        mouthExpression: 'frown',
        
        cheekbones: 'high',
        jawShape: 'defined',
        chinShape: 'pointed',
        
        hairStyle: 'mohawk',
        hairColor: '#FF1493',
        hairLength: 1.0,
        hairVolume: 1.5,
        
        facialHair: 'none',
        facialHairColor: '#8B4513',
        facialHairLength: 1.0,
        
        glasses: 'none',
        glassesColor: '#000000',
        earrings: 'gauges',
        earringColor: '#000000',
        
        lipstick: true,
        lipstickColor: '#000000',
        eyeshadow: true,
        eyeshadowColor: '#000000',
        blush: false,
        blushColor: '#FF69B4',
        
        ageGroup: 'young_adult',
        gender: 'neutral'
      }
    },
    {
      id: 'wise-elder',
      name: 'Wise Elder',
      description: 'Distinguished elderly character',
      category: 'realistic',
      face: {
        faceShape: 'long',
        faceWidth: 1.0,
        faceHeight: 1.2,
        skinTone: '#E0AC69',
        
        eyeShape: 'hooded',
        eyeSize: 0.9,
        eyeDistance: 1.0,
        eyeColor: '#8B4513',
        eyebrowShape: 'thick',
        eyebrowThickness: 1.3,
        eyebrowColor: '#D3D3D3',
        eyelashes: false,
        
        noseShape: 'roman',
        noseSize: 1.2,
        noseWidth: 1.1,
        
        lipShape: 'thin',
        lipSize: 0.9,
        lipColor: '#CD919E',
        mouthExpression: 'neutral',
        
        cheekbones: 'prominent',
        jawShape: 'defined',
        chinShape: 'medium',
        
        hairStyle: 'short',
        hairColor: '#D3D3D3',
        hairLength: 0.7,
        hairVolume: 0.8,
        
        facialHair: 'full_beard',
        facialHairColor: '#D3D3D3',
        facialHairLength: 1.2,
        
        glasses: 'reading',
        glassesColor: '#8B4513',
        earrings: 'none',
        earringColor: '#FFD700',
        
        lipstick: false,
        lipstickColor: '#FF1493',
        eyeshadow: false,
        eyeshadowColor: '#9370DB',
        blush: false,
        blushColor: '#FF69B4',
        
        ageGroup: 'elderly',
        gender: 'masculine'
      }
    },
    {
      id: 'cyberpunk-android',
      name: 'Cyberpunk Android',
      description: 'Futuristic android features',
      category: 'stylized',
      face: {
        faceShape: 'diamond',
        faceWidth: 0.9,
        faceHeight: 1.1,
        skinTone: '#E6E6FA',
        
        eyeShape: 'almond',
        eyeSize: 1.3,
        eyeDistance: 1.2,
        eyeColor: '#00CED1',
        eyebrowShape: 'straight',
        eyebrowThickness: 0.5,
        eyebrowColor: '#C0C0C0',
        eyelashes: false,
        
        noseShape: 'straight',
        noseSize: 0.8,
        noseWidth: 0.8,
        
        lipShape: 'thin',
        lipSize: 0.9,
        lipColor: '#4169E1',
        mouthExpression: 'neutral',
        
        cheekbones: 'high',
        jawShape: 'defined',
        chinShape: 'pointed',
        
        hairStyle: 'none',
        hairColor: '#C0C0C0',
        hairLength: 1.0,
        hairVolume: 1.0,
        
        facialHair: 'none',
        facialHairColor: '#8B4513',
        facialHairLength: 1.0,
        
        glasses: 'none',
        glassesColor: '#000000',
        earrings: 'none',
        earringColor: '#FFD700',
        
        lipstick: true,
        lipstickColor: '#4169E1',
        eyeshadow: true,
        eyeshadowColor: '#00CED1',
        blush: false,
        blushColor: '#FF69B4',
        
        ageGroup: 'adult',
        gender: 'neutral'
      }
    }
  ]

  useEffect(() => {
    if (user?.avatar) {
      // Try to convert old avatar to face if possible, or create a default face
      const defaultFace: FaceData = {
        id: 'converted-' + Date.now(),
        faceShape: 'oval',
        faceWidth: 1.0,
        faceHeight: 1.0,
        skinTone: user.avatar.headColor || '#FFDBAC',
        
        eyeShape: 'almond',
        eyeSize: 1.0,
        eyeDistance: 1.0,
        eyeColor: user.avatar.eyeColor || '#4A90E2',
        eyebrowShape: 'arched',
        eyebrowThickness: 1.0,
        eyebrowColor: user.avatar.hairColor || '#8B4513',
        eyelashes: true,
        
        noseShape: 'straight',
        noseSize: 1.0,
        noseWidth: 1.0,
        
        lipShape: 'full',
        lipSize: 1.0,
        lipColor: '#FF6B9D',
        mouthExpression: user.avatar.mouthType === 'smile' ? 'smile' : 'neutral',
        
        cheekbones: 'medium',
        jawShape: 'soft',
        chinShape: 'medium',
        
        hairStyle: user.avatar.hairType === 'none' ? 'none' : 'medium',
        hairColor: user.avatar.hairColor || '#8B4513',
        hairLength: 1.0,
        hairVolume: 1.0,
        
        facialHair: user.avatar.accessory === 'mustache' ? 'mustache' : 
                   user.avatar.accessory === 'beard' ? 'beard' : 'none',
        facialHairColor: user.avatar.hairColor || '#8B4513',
        facialHairLength: 1.0,
        
        glasses: user.avatar.accessory === 'glasses' ? 'round' : 
                user.avatar.accessory === 'sunglasses' ? 'sunglasses' : 'none',
        glassesColor: '#000000',
        earrings: 'none',
        earringColor: '#FFD700',
        
        lipstick: false,
        lipstickColor: '#FF1493',
        eyeshadow: false,
        eyeshadowColor: '#9370DB',
        blush: false,
        blushColor: '#FF69B4',
        
        ageGroup: 'adult',
        gender: 'neutral',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setCurrentFace(defaultFace)
    }
  }, [user])

  const saveFace = (faceData: Omit<FaceData, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    const newFace: FaceData = {
      ...faceData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedUser = {
      ...user,
      face: newFace
    }

    if (typeof saveUser === 'function') {
      saveUser(updatedUser)
    } else {
      localStorage.setItem('battle64-user', JSON.stringify(updatedUser))
    }

    setCurrentFace(newFace)
  }

  const loadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId)
    if (!preset || !isPresetUnlocked(preset)) return

    const faceData: Omit<FaceData, 'id' | 'createdAt' | 'updatedAt'> = {
      ...preset.face
    }

    saveFace(faceData)
  }

  const generateRandomFace = (): FaceData => {
    const faceShapes = ['round', 'oval', 'square', 'heart', 'diamond', 'long'] as const
    const skinTones = [
      '#FFDBAC', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#A0522D', '#654321',
      '#FDBCB4', '#EAA58D', '#D08B5B', '#B87333', '#8B4513', '#654321', '#3C2415'
    ]
    const eyeShapes = ['round', 'almond', 'hooded', 'upturned', 'downturned', 'monolid'] as const
    const eyeColors = [
      '#4A90E2', '#228B22', '#8B4513', '#FF6347', '#9400D3', '#FF1493',
      '#00CED1', '#000000', '#2F4F4F', '#8FBC8F', '#DDA0DD', '#F0E68C'
    ]
    const noseShapes = ['straight', 'roman', 'button', 'hawk', 'snub', 'crooked'] as const
    const lipShapes = ['full', 'thin', 'bow', 'wide', 'small', 'heart'] as const
    const hairStyles = ['none', 'short', 'medium', 'long', 'curly', 'wavy', 'straight', 'afro', 'braids', 'ponytail', 'bun', 'pixie', 'bob', 'shag', 'mohawk'] as const
    const hairColors = [
      '#000000', '#2C1B18', '#8B4513', '#D2691E', '#CD853F', '#DEB887',
      '#F4A460', '#FFD700', '#FFA500', '#FF6347', '#DC143C', '#9370DB',
      '#4169E1', '#32CD32', '#FF1493', '#00CED1'
    ]

    const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)]

    return {
      id: 'random-' + Date.now(),
      faceShape: faceShapes[Math.floor(Math.random() * faceShapes.length)],
      faceWidth: 0.8 + Math.random() * 0.4,
      faceHeight: 0.8 + Math.random() * 0.4,
      skinTone,
      
      eyeShape: eyeShapes[Math.floor(Math.random() * eyeShapes.length)],
      eyeSize: 0.7 + Math.random() * 0.6,
      eyeDistance: 0.8 + Math.random() * 0.4,
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      eyebrowShape: ['straight', 'arched', 'rounded', 'angled', 'thick', 'thin'][Math.floor(Math.random() * 6)] as any,
      eyebrowThickness: 0.5 + Math.random() * 1.0,
      eyebrowColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      eyelashes: Math.random() > 0.5,
      
      noseShape: noseShapes[Math.floor(Math.random() * noseShapes.length)],
      noseSize: 0.7 + Math.random() * 0.6,
      noseWidth: 0.8 + Math.random() * 0.4,
      
      lipShape: lipShapes[Math.floor(Math.random() * lipShapes.length)],
      lipSize: 0.7 + Math.random() * 0.6,
      lipColor: ['#FF6B9D', '#CD919E', '#FF1493', '#DC143C'][Math.floor(Math.random() * 4)],
      mouthExpression: ['neutral', 'smile', 'frown', 'smirk', 'open', 'surprised'][Math.floor(Math.random() * 6)] as any,
      
      cheekbones: ['low', 'medium', 'high', 'prominent'][Math.floor(Math.random() * 4)] as any,
      jawShape: ['soft', 'defined', 'square', 'pointed', 'round'][Math.floor(Math.random() * 5)] as any,
      chinShape: ['small', 'medium', 'large', 'cleft', 'double'][Math.floor(Math.random() * 5)] as any,
      
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      hairLength: 0.5 + Math.random() * 1.5,
      hairVolume: 0.5 + Math.random() * 1.0,
      
      facialHair: ['none', 'mustache', 'beard', 'goatee', 'stubble', 'full_beard', 'soul_patch'][Math.floor(Math.random() * 7)] as any,
      facialHairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      facialHairLength: 0.5 + Math.random() * 1.0,
      
      glasses: ['none', 'round', 'square', 'aviator', 'cat_eye', 'reading', 'sunglasses'][Math.floor(Math.random() * 7)] as any,
      glassesColor: ['#000000', '#8B4513', '#4169E1'][Math.floor(Math.random() * 3)],
      earrings: ['none', 'studs', 'hoops', 'dangly', 'gauges'][Math.floor(Math.random() * 5)] as any,
      earringColor: '#FFD700',
      
      lipstick: Math.random() > 0.7,
      lipstickColor: '#FF1493',
      eyeshadow: Math.random() > 0.8,
      eyeshadowColor: '#9370DB',
      blush: Math.random() > 0.6,
      blushColor: '#FF69B4',
      
      ageGroup: ['child', 'teen', 'young_adult', 'adult', 'middle_aged', 'elderly'][Math.floor(Math.random() * 6)] as any,
      gender: ['masculine', 'feminine', 'neutral'][Math.floor(Math.random() * 3)] as any,
      
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const isPresetUnlocked = (preset: FacePreset): boolean => {
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
    <FaceContext.Provider
      value={{
        currentFace,
        presets,
        saveFace,
        loadPreset,
        generateRandomFace,
        isPresetUnlocked
      }}
    >
      {children}
    </FaceContext.Provider>
  )
}

export default FaceProvider