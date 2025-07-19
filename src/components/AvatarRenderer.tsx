import React from 'react'
import { AvatarData } from '../types'

interface AvatarRendererProps {
  avatar: AvatarData
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animate?: boolean
}

const AvatarRenderer: React.FC<AvatarRendererProps> = ({ 
  avatar, 
  size = 'md', 
  className = '',
  animate = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  }

  const renderHead = () => {
    const headStyles = {
      round: 'rounded-full',
      square: 'rounded-lg',
      oval: 'rounded-full scale-y-110',
      diamond: 'rounded-lg rotate-45 scale-75'
    }

    return (
      <div 
        className={`relative ${headStyles[avatar.headShape]} transition-all duration-300`}
        style={{ 
          backgroundColor: avatar.headColor,
          background: `linear-gradient(145deg, ${avatar.headColor}, ${adjustBrightness(avatar.headColor, -20)})`,
          boxShadow: `inset -2px -2px 4px ${adjustBrightness(avatar.headColor, -30)}, inset 2px 2px 4px ${adjustBrightness(avatar.headColor, 10)}`
        }}
      >
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-2">
          {renderEyes()}
        </div>

        {/* Nose */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {renderNose()}
        </div>

        {/* Mouth */}
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          {renderMouth()}
        </div>

        {/* Hair */}
        {avatar.hairType !== 'none' && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            {renderHair()}
          </div>
        )}

        {/* Accessory */}
        {avatar.accessory && avatar.accessory !== 'none' && (
          <div className="absolute inset-0">
            {renderAccessory()}
          </div>
        )}
      </div>
    )
  }

  const renderEyes = () => {
    const eyeShapes = {
      normal: 'rounded-full',
      wide: 'rounded-full scale-x-125',
      sleepy: 'rounded-full scale-y-50',
      angry: 'rounded-sm rotate-12',
      happy: 'rounded-full scale-y-75',
      closed: 'rounded-full scale-y-25'
    }

    return (
      <>
        <div 
          className={`w-2 h-2 ${eyeShapes[avatar.eyeType]} border border-black/30`}
          style={{ 
            backgroundColor: avatar.eyeColor,
            boxShadow: `inset 1px 1px 2px rgba(0,0,0,0.3), 0 0 2px ${avatar.eyeColor}`
          }}
        />
        <div 
          className={`w-2 h-2 ${eyeShapes[avatar.eyeType]} border border-black/30`}
          style={{ 
            backgroundColor: avatar.eyeColor,
            boxShadow: `inset 1px 1px 2px rgba(0,0,0,0.3), 0 0 2px ${avatar.eyeColor}`
          }}
        />
      </>
    )
  }

  const renderNose = () => {
    const noseStyles = {
      small: 'w-1 h-1',
      medium: 'w-1.5 h-1.5',
      large: 'w-2 h-2',
      flat: 'w-2 h-0.5',
      pointed: 'w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent'
    }

    if (avatar.noseType === 'pointed') {
      return (
        <div 
          className={noseStyles[avatar.noseType]}
          style={{ 
            borderBottomColor: adjustBrightness(avatar.headColor, -40)
          }}
        />
      )
    }

    return (
      <div 
        className={`${noseStyles[avatar.noseType]} rounded-sm`}
        style={{ 
          backgroundColor: adjustBrightness(avatar.headColor, -20),
          boxShadow: `inset -1px -1px 2px ${adjustBrightness(avatar.headColor, -40)}`
        }}
      />
    )
  }

  const renderMouth = () => {
    const mouthStyles = {
      smile: 'border-b-2 border-black/60 rounded-b-full w-4 h-2',
      neutral: 'border-b border-black/60 w-3 h-0.5',
      frown: 'border-t-2 border-black/60 rounded-t-full w-4 h-2',
      open: 'rounded-full w-2 h-3 bg-black/60',
      smirk: 'border-b-2 border-black/60 rounded-br-full w-3 h-1.5 transform rotate-12',
      surprised: 'rounded-full w-2 h-2 bg-black/60'
    }

    return <div className={mouthStyles[avatar.mouthType]} />
  }

  const renderHair = () => {
    const hairStyles = {
      short: 'w-20 h-6 rounded-t-full',
      medium: 'w-24 h-8 rounded-t-full',
      long: 'w-28 h-12 rounded-t-full',
      spiky: 'w-20 h-8 rounded-t-full',
      curly: 'w-22 h-7 rounded-full',
      cap: 'w-24 h-6 rounded-t-lg',
      afro: 'w-32 h-16 rounded-full',
      mohawk: 'w-8 h-12 rounded-t-full transform rotate-0',
      braids: 'w-24 h-10 rounded-t-full',
      cornrows: 'w-22 h-8 rounded-t-full'
    }

    if (avatar.hairType === 'none') return null
    
    const hairClass = hairStyles[avatar.hairType] || hairStyles['short']
    
    return (
      <div 
        className={`${hairClass} transform -translate-y-1`}
        style={{ 
          backgroundColor: avatar.hairColor,
          background: `linear-gradient(145deg, ${avatar.hairColor}, ${adjustBrightness(avatar.hairColor, -20)})`,
          boxShadow: `inset -2px -2px 4px ${adjustBrightness(avatar.hairColor, -30)}, inset 2px 2px 4px ${adjustBrightness(avatar.hairColor, 10)}`
        }}
      />
    )
  }

  const renderAccessory = () => {
    if (!avatar.accessory || avatar.accessory === 'none') return null
    
    switch (avatar.accessory) {
      case 'glasses':
        return (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex space-x-1 items-center">
              <div className="w-3 h-3 rounded-full border-2 border-black/80 bg-white/20" />
              <div className="w-1 h-0.5 bg-black/80" />
              <div className="w-3 h-3 rounded-full border-2 border-black/80 bg-white/20" />
            </div>
          </div>
        )
      case 'hat':
        return (
          <div 
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-8 rounded-t-lg"
            style={{ 
              backgroundColor: avatar.accessoryColor,
              boxShadow: `inset -2px -2px 4px ${adjustBrightness(avatar.accessoryColor, -30)}`
            }}
          />
        )
      case 'headband':
        return (
          <div 
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-20 h-2 rounded-full"
            style={{ backgroundColor: avatar.accessoryColor }}
          />
        )
      case 'mustache':
        return (
          <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-2">
            <div 
              className="w-4 h-1 rounded-full"
              style={{ backgroundColor: adjustBrightness(avatar.hairColor, -20) }}
            />
          </div>
        )
      case 'beard':
        return (
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-4">
            <div 
              className="w-6 h-4 rounded-b-full"
              style={{ 
                backgroundColor: adjustBrightness(avatar.hairColor, -20),
                boxShadow: `inset -1px -1px 2px ${adjustBrightness(avatar.hairColor, -40)}`
              }}
            />
          </div>
        )
      case 'bandana':
        return (
          <div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-22 h-4 rounded-t-lg"
            style={{ 
              backgroundColor: avatar.accessoryColor,
              boxShadow: `inset -2px -2px 4px ${adjustBrightness(avatar.accessoryColor, -30)}`
            }}
          />
        )
      case 'cap_backwards':
        return (
          <div 
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-6 rounded-lg"
            style={{ 
              backgroundColor: avatar.accessoryColor,
              boxShadow: `inset -2px -2px 4px ${adjustBrightness(avatar.accessoryColor, -30)}`
            }}
          />
        )
      case 'sunglasses':
        return (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex space-x-1 items-center">
              <div className="w-4 h-3 rounded-lg border-2 border-black bg-black/80" />
              <div className="w-1 h-0.5 bg-black" />
              <div className="w-4 h-3 rounded-lg border-2 border-black bg-black/80" />
            </div>
          </div>
        )
      case 'chains':
        return (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: avatar.accessoryColor }}
                />
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderBody = () => {
    const bodyWidths = {
      thin: 'w-16',
      normal: 'w-20',
      wide: 'w-24',
      muscular: 'w-22'
    }

    return (
      <div className="mt-2">
        {/* Neck */}
        <div 
          className="w-4 h-3 mx-auto rounded-sm"
          style={{ 
            backgroundColor: avatar.bodyColor,
            background: `linear-gradient(145deg, ${avatar.bodyColor}, ${adjustBrightness(avatar.bodyColor, -15)})`
          }}
        />
        
        {/* Torso */}
        <div 
          className={`${bodyWidths[avatar.bodyType]} h-20 mx-auto rounded-lg mt-1`}
          style={{ 
            backgroundColor: avatar.shirtColor,
            background: `linear-gradient(145deg, ${avatar.shirtColor}, ${adjustBrightness(avatar.shirtColor, -20)})`,
            boxShadow: `inset -3px -3px 6px ${adjustBrightness(avatar.shirtColor, -30)}, inset 3px 3px 6px ${adjustBrightness(avatar.shirtColor, 10)}`
          }}
        >
          {renderShirtPattern()}
        </div>
      </div>
    )
  }

  const renderShirtPattern = () => {
    switch (avatar.shirtType) {
      case 'striped':
        return (
          <div className="w-full h-full flex flex-col justify-evenly">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="h-1 w-full"
                style={{ backgroundColor: adjustBrightness(avatar.shirtColor, -40) }}
              />
            ))}
          </div>
        )
      case 'spotted':
        return (
          <div className="w-full h-full relative">
            <div 
              className="absolute top-2 left-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: adjustBrightness(avatar.shirtColor, -40) }}
            />
            <div 
              className="absolute top-6 right-3 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: adjustBrightness(avatar.shirtColor, -40) }}
            />
            <div 
              className="absolute bottom-4 left-3 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: adjustBrightness(avatar.shirtColor, -40) }}
            />
          </div>
        )
      case 'logo':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs font-bold text-black/60">N64</div>
          </div>
        )
      case 'jersey':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-lg font-bold text-white/90">23</div>
          </div>
        )
      case 'tank_top':
        return (
          <div className="w-full h-full relative">
            <div 
              className="absolute top-0 left-2 right-2 h-2 rounded-t-lg"
              style={{ backgroundColor: adjustBrightness(avatar.shirtColor, -30) }}
            />
          </div>
        )
      case 'tracksuit':
        return (
          <div className="w-full h-full relative">
            <div 
              className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg"
              style={{ backgroundColor: adjustBrightness(avatar.shirtColor, -40) }}
            />
            <div 
              className="absolute right-0 top-0 bottom-0 w-2 rounded-r-lg"
              style={{ backgroundColor: adjustBrightness(avatar.shirtColor, -40) }}
            />
          </div>
        )
      case 'urban_tee':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs font-bold text-black/60">STREET</div>
          </div>
        )
      default:
        return null
    }
  }

  // Helper function to adjust color brightness
  function adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${className} 
        relative flex flex-col items-center justify-center
        ${animate ? 'hover:scale-110 hover:rotate-2 transition-all duration-300' : ''}
      `}
      style={{
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        imageRendering: 'pixelated', // Gives that retro N64 look
      }}
    >
      {renderHead()}
      {renderBody()}
      
      {/* N64-style glow effect */}
      <div 
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full opacity-20 blur-sm -z-10`}
        style={{ 
          background: `radial-gradient(circle, ${avatar.headColor}, transparent 70%)`
        }}
      />
    </div>
  )
}

export default AvatarRenderer