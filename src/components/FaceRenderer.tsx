import React from 'react'
import { FaceData } from '../types'

interface FaceRendererProps {
  face: FaceData
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animate?: boolean
}

const FaceRenderer: React.FC<FaceRendererProps> = ({ 
  face, 
  size = 'md', 
  className = '',
  animate = false 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-24 h-28',
    lg: 'w-32 h-40',
    xl: 'w-48 h-56'
  }

  const sizePx = {
    sm: { width: 64, height: 80 },
    md: { width: 96, height: 112 },
    lg: { width: 128, height: 160 },
    xl: { width: 192, height: 224 }
  }

  const currentSize = sizePx[size]

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

  // Calculate face dimensions based on shape and size modifiers
  const getFaceDimensions = () => {
    const baseWidth = currentSize.width * 0.85
    const baseHeight = currentSize.height * 0.85
    
    let width = baseWidth * face.faceWidth
    let height = baseHeight * face.faceHeight
    
    // Adjust based on face shape
    switch (face.faceShape) {
      case 'round':
        width *= 1.1
        height *= 0.95
        break
      case 'square':
        width *= 1.05
        height *= 0.98
        break
      case 'long':
        width *= 0.9
        height *= 1.15
        break
      case 'heart':
        width *= 0.95
        height *= 1.05
        break
      case 'diamond':
        width *= 0.9
        height *= 1.1
        break
      default: // oval
        break
    }
    
    return { width, height }
  }

  const getFaceShape = () => {
    const { width, height } = getFaceDimensions()
    
    switch (face.faceShape) {
      case 'round':
        return `${width}px ${height}px`
      case 'square':
        return '15%'
      case 'long':
        return `${width}px ${height}px`
      case 'heart':
        return `${width}px ${height}px ${width * 0.7}px ${height}px`
      case 'diamond':
        return `${width * 0.8}px ${height}px`
      default: // oval
        return `${width}px ${height}px`
    }
  }

  const renderFace = () => {
    const { width, height } = getFaceDimensions()
    
    return (
      <div 
        className="relative mx-auto"
        style={{ 
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: face.skinTone,
          borderRadius: getFaceShape(),
          background: `linear-gradient(145deg, ${face.skinTone}, ${adjustBrightness(face.skinTone, -15)})`,
          boxShadow: `inset -2px -2px 8px ${adjustBrightness(face.skinTone, -25)}, inset 2px 2px 8px ${adjustBrightness(face.skinTone, 15)}`,
        }}
      >
        {/* Hair (behind face) */}
        {face.hairStyle !== 'none' && renderHair(width, height)}
        
        {/* Eyes */}
        <div 
          className="absolute flex justify-center items-center"
          style={{
            top: `${height * 0.35}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${width * 0.7 * face.eyeDistance}px`,
          }}
        >
          {renderEyes(width)}
        </div>

        {/* Eyebrows */}
        <div 
          className="absolute flex justify-center items-center"
          style={{
            top: `${height * 0.28}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${width * 0.7 * face.eyeDistance}px`,
          }}
        >
          {renderEyebrows(width)}
        </div>

        {/* Nose */}
        <div 
          className="absolute"
          style={{
            top: `${height * 0.48}px`,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {renderNose(width, height)}
        </div>

        {/* Mouth */}
        <div 
          className="absolute"
          style={{
            top: `${height * 0.68}px`,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {renderMouth(width)}
        </div>

        {/* Cheekbones */}
        {renderCheekbones(width, height)}

        {/* Facial Hair */}
        {face.facialHair !== 'none' && renderFacialHair(width, height)}

        {/* Glasses */}
        {face.glasses !== 'none' && renderGlasses(width, height)}

        {/* Earrings */}
        {face.earrings !== 'none' && renderEarrings(width, height)}

        {/* Blush */}
        {face.blush && renderBlush(width, height)}
      </div>
    )
  }

  const renderHair = (faceWidth: number, faceHeight: number) => {
    const hairWidth = faceWidth * (1.2 + (face.hairVolume - 1) * 0.3)
    const hairHeight = faceHeight * 0.6 * face.hairLength
    
    const getHairStyle = () => {
      switch (face.hairStyle) {
        case 'short':
          return {
            borderRadius: '50% 50% 20% 20%',
            top: `-${hairHeight * 0.3}px`,
          }
        case 'medium':
          return {
            borderRadius: '50% 50% 30% 30%',
            top: `-${hairHeight * 0.4}px`,
          }
        case 'long':
          return {
            borderRadius: '50% 50% 10% 10%',
            top: `-${hairHeight * 0.3}px`,
            height: `${hairHeight * 1.5}px`,
          }
        case 'curly':
          return {
            borderRadius: '50%',
            top: `-${hairHeight * 0.4}px`,
            width: `${hairWidth * 1.1}px`,
          }
        case 'afro':
          return {
            borderRadius: '50%',
            top: `-${hairHeight * 0.5}px`,
            width: `${hairWidth * 1.3}px`,
            height: `${hairHeight * 1.2}px`,
          }
        case 'ponytail':
          return {
            borderRadius: '50% 50% 20% 20%',
            top: `-${hairHeight * 0.3}px`,
          }
        case 'bun':
          return {
            borderRadius: '50%',
            top: `-${hairHeight * 0.4}px`,
            width: `${hairWidth * 0.8}px`,
            height: `${hairHeight * 0.8}px`,
          }
        case 'mohawk':
          return {
            borderRadius: '20% 20% 50% 50%',
            top: `-${hairHeight * 0.5}px`,
            width: `${hairWidth * 0.4}px`,
            height: `${hairHeight * 1.2}px`,
          }
        default:
          return {
            borderRadius: '50% 50% 30% 30%',
            top: `-${hairHeight * 0.3}px`,
          }
      }
    }

    const hairStyle = getHairStyle()

    return (
      <div
        className="absolute z-0"
        style={{
          width: `${hairWidth}px`,
          height: `${hairHeight}px`,
          backgroundColor: face.hairColor,
          background: `linear-gradient(145deg, ${face.hairColor}, ${adjustBrightness(face.hairColor, -20)})`,
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: `inset -2px -2px 6px ${adjustBrightness(face.hairColor, -30)}, inset 2px 2px 6px ${adjustBrightness(face.hairColor, 10)}`,
          ...hairStyle,
        }}
      />
    )
  }

  const renderEyes = (faceWidth: number) => {
    const eyeWidth = faceWidth * 0.12 * face.eyeSize
    const eyeHeight = eyeWidth * 0.7
    
    const getEyeShape = () => {
      switch (face.eyeShape) {
        case 'round':
          return { borderRadius: '50%' }
        case 'almond':
          return { borderRadius: '50% 50% 50% 50%', transform: 'rotate(-5deg)' }
        case 'hooded':
          return { borderRadius: '40% 40% 60% 60%' }
        case 'upturned':
          return { borderRadius: '40% 60% 40% 60%', transform: 'rotate(5deg)' }
        case 'downturned':
          return { borderRadius: '60% 40% 60% 40%', transform: 'rotate(-5deg)' }
        case 'monolid':
          return { borderRadius: '30% 30% 50% 50%' }
        default:
          return { borderRadius: '50%' }
      }
    }

    const eyeStyle = getEyeShape()

    return (
      <>
        {/* Left Eye */}
        <div 
          className="bg-white border border-gray-300 relative"
          style={{
            width: `${eyeWidth}px`,
            height: `${eyeHeight}px`,
            marginRight: `${faceWidth * 0.1}px`,
            ...eyeStyle,
          }}
        >
          {/* Iris */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${eyeWidth * 0.6}px`,
              height: `${eyeWidth * 0.6}px`,
              backgroundColor: face.eyeColor,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${adjustBrightness(face.eyeColor, 20)}, ${face.eyeColor})`,
            }}
          >
            {/* Pupil */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full"
              style={{
                width: `${eyeWidth * 0.25}px`,
                height: `${eyeWidth * 0.25}px`,
              }}
            />
            {/* Light reflection */}
            <div
              className="absolute bg-white rounded-full"
              style={{
                width: `${eyeWidth * 0.1}px`,
                height: `${eyeWidth * 0.1}px`,
                top: `${eyeWidth * 0.1}px`,
                left: `${eyeWidth * 0.15}px`,
              }}
            />
          </div>
          
          {/* Eyelashes */}
          {face.eyelashes && (
            <div
              className="absolute -top-1 left-0 right-0"
              style={{
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${adjustBrightness(face.eyebrowColor, -20)}, transparent)`,
                borderRadius: '50%',
              }}
            />
          )}
        </div>

        {/* Right Eye */}
        <div 
          className="bg-white border border-gray-300 relative"
          style={{
            width: `${eyeWidth}px`,
            height: `${eyeHeight}px`,
            ...eyeStyle,
          }}
        >
          {/* Iris */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${eyeWidth * 0.6}px`,
              height: `${eyeWidth * 0.6}px`,
              backgroundColor: face.eyeColor,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${adjustBrightness(face.eyeColor, 20)}, ${face.eyeColor})`,
            }}
          >
            {/* Pupil */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full"
              style={{
                width: `${eyeWidth * 0.25}px`,
                height: `${eyeWidth * 0.25}px`,
              }}
            />
            {/* Light reflection */}
            <div
              className="absolute bg-white rounded-full"
              style={{
                width: `${eyeWidth * 0.1}px`,
                height: `${eyeWidth * 0.1}px`,
                top: `${eyeWidth * 0.1}px`,
                left: `${eyeWidth * 0.15}px`,
              }}
            />
          </div>
          
          {/* Eyelashes */}
          {face.eyelashes && (
            <div
              className="absolute -top-1 left-0 right-0"
              style={{
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${adjustBrightness(face.eyebrowColor, -20)}, transparent)`,
                borderRadius: '50%',
              }}
            />
          )}
        </div>
      </>
    )
  }

  const renderEyebrows = (faceWidth: number) => {
    const browWidth = faceWidth * 0.15
    const browHeight = faceWidth * 0.03 * face.eyebrowThickness
    
    const getBrowShape = () => {
      switch (face.eyebrowShape) {
        case 'straight':
          return { borderRadius: '2px' }
        case 'arched':
          return { borderRadius: '50% 50% 20% 20%' }
        case 'rounded':
          return { borderRadius: '50%' }
        case 'angled':
          return { borderRadius: '20% 80% 20% 80%' }
        case 'thick':
          return { borderRadius: '30%' }
        case 'thin':
          return { borderRadius: '50%' }
        default:
          return { borderRadius: '30%' }
      }
    }

    const browStyle = getBrowShape()

    return (
      <>
        {/* Left Eyebrow */}
        <div 
          style={{
            width: `${browWidth}px`,
            height: `${browHeight}px`,
            backgroundColor: face.eyebrowColor,
            marginRight: `${faceWidth * 0.1}px`,
            ...browStyle,
          }}
        />
        
        {/* Right Eyebrow */}
        <div 
          style={{
            width: `${browWidth}px`,
            height: `${browHeight}px`,
            backgroundColor: face.eyebrowColor,
            ...browStyle,
          }}
        />
      </>
    )
  }

  const renderNose = (faceWidth: number, faceHeight: number) => {
    const noseWidth = faceWidth * 0.08 * face.noseWidth * face.noseSize
    const noseHeight = faceHeight * 0.12 * face.noseSize
    
    const getNoseStyle = () => {
      switch (face.noseShape) {
        case 'button':
          return {
            borderRadius: '50%',
            width: `${noseWidth * 0.8}px`,
            height: `${noseHeight * 0.6}px`,
          }
        case 'roman':
          return {
            borderRadius: '20% 20% 50% 50%',
            width: `${noseWidth}px`,
            height: `${noseHeight * 1.2}px`,
          }
        case 'hawk':
          return {
            borderRadius: '30% 30% 60% 60%',
            width: `${noseWidth * 1.1}px`,
            height: `${noseHeight * 1.1}px`,
          }
        case 'snub':
          return {
            borderRadius: '60% 60% 40% 40%',
            width: `${noseWidth * 0.9}px`,
            height: `${noseHeight * 0.8}px`,
          }
        case 'crooked':
          return {
            borderRadius: '40% 60% 40% 60%',
            width: `${noseWidth}px`,
            height: `${noseHeight}px`,
            transform: 'rotate(2deg)',
          }
        default: // straight
          return {
            borderRadius: '40% 40% 50% 50%',
            width: `${noseWidth}px`,
            height: `${noseHeight}px`,
          }
      }
    }

    const noseStyle = getNoseStyle()

    return (
      <div
        style={{
          backgroundColor: adjustBrightness(face.skinTone, -10),
          boxShadow: `inset -1px -1px 3px ${adjustBrightness(face.skinTone, -25)}, inset 1px 1px 3px ${adjustBrightness(face.skinTone, 5)}`,
          ...noseStyle,
        }}
      />
    )
  }

  const renderMouth = (faceWidth: number) => {
    const mouthWidth = faceWidth * 0.25 * face.lipSize
    const mouthHeight = faceWidth * 0.04 * face.lipSize
    
    const getLipStyle = () => {
      switch (face.lipShape) {
        case 'full':
          return { borderRadius: '50%' }
        case 'thin':
          return { borderRadius: '30%', height: `${mouthHeight * 0.7}px` }
        case 'bow':
          return { borderRadius: '50% 50% 30% 30%' }
        case 'wide':
          return { borderRadius: '30%', width: `${mouthWidth * 1.2}px` }
        case 'small':
          return { borderRadius: '50%', width: `${mouthWidth * 0.8}px` }
        case 'heart':
          return { borderRadius: '50% 50% 20% 20%' }
        default:
          return { borderRadius: '50%' }
      }
    }

    const getMouthExpression = () => {
      switch (face.mouthExpression) {
        case 'smile':
          return { 
            borderRadius: '0 0 50px 50px',
            borderTop: `3px solid ${face.lipColor}`,
            backgroundColor: 'transparent',
            height: `${mouthHeight * 0.8}px`,
          }
        case 'frown':
          return { 
            borderRadius: '50px 50px 0 0',
            borderBottom: `3px solid ${face.lipColor}`,
            backgroundColor: 'transparent',
            height: `${mouthHeight * 0.8}px`,
          }
        case 'smirk':
          return { 
            borderRadius: '0 0 30px 10px',
            borderTop: `3px solid ${face.lipColor}`,
            backgroundColor: 'transparent',
            transform: 'rotate(-5deg)',
          }
        case 'open':
          return {
            borderRadius: '50%',
            backgroundColor: '#2d1b14',
            border: `2px solid ${face.lipColor}`,
          }
        case 'surprised':
          return {
            borderRadius: '50%',
            backgroundColor: '#2d1b14',
            border: `2px solid ${face.lipColor}`,
            width: `${mouthWidth * 0.7}px`,
            height: `${mouthHeight * 1.2}px`,
          }
        default: // neutral
          return {
            backgroundColor: face.lipColor,
            ...getLipStyle(),
          }
      }
    }

    const mouthStyle = getMouthExpression()

    return (
      <div
        style={{
          width: `${mouthWidth}px`,
          height: `${mouthHeight}px`,
          ...mouthStyle,
        }}
      />
    )
  }

  const renderCheekbones = (faceWidth: number, faceHeight: number) => {
    if (face.cheekbones === 'low') return null
    
    const intensity = face.cheekbones === 'prominent' ? 0.3 : 0.15
    const cheekColor = adjustBrightness(face.skinTone, -10)
    
    return (
      <>
        {/* Left Cheekbone */}
        <div
          className="absolute"
          style={{
            width: `${faceWidth * 0.2}px`,
            height: `${faceHeight * 0.1}px`,
            backgroundColor: cheekColor,
            borderRadius: '50%',
            opacity: intensity,
            top: `${faceHeight * 0.5}px`,
            left: `${faceWidth * 0.1}px`,
          }}
        />
        
        {/* Right Cheekbone */}
        <div
          className="absolute"
          style={{
            width: `${faceWidth * 0.2}px`,
            height: `${faceHeight * 0.1}px`,
            backgroundColor: cheekColor,
            borderRadius: '50%',
            opacity: intensity,
            top: `${faceHeight * 0.5}px`,
            right: `${faceWidth * 0.1}px`,
          }}
        />
      </>
    )
  }

  const renderBlush = (faceWidth: number, faceHeight: number) => {
    return (
      <>
        {/* Left Blush */}
        <div
          className="absolute"
          style={{
            width: `${faceWidth * 0.15}px`,
            height: `${faceHeight * 0.08}px`,
            backgroundColor: face.blushColor,
            borderRadius: '50%',
            opacity: 0.3,
            top: `${faceHeight * 0.45}px`,
            left: `${faceWidth * 0.15}px`,
          }}
        />
        
        {/* Right Blush */}
        <div
          className="absolute"
          style={{
            width: `${faceWidth * 0.15}px`,
            height: `${faceHeight * 0.08}px`,
            backgroundColor: face.blushColor,
            borderRadius: '50%',
            opacity: 0.3,
            top: `${faceHeight * 0.45}px`,
            right: `${faceWidth * 0.15}px`,
          }}
        />
      </>
    )
  }

  const renderFacialHair = (faceWidth: number, faceHeight: number) => {
    const hairColor = face.facialHairColor
    const length = face.facialHairLength
    
    switch (face.facialHair) {
      case 'mustache':
        return (
          <div
            className="absolute"
            style={{
              width: `${faceWidth * 0.3}px`,
              height: `${faceWidth * 0.03 * length}px`,
              backgroundColor: hairColor,
              borderRadius: '50%',
              top: `${faceHeight * 0.6}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )
      case 'beard':
        return (
          <div
            className="absolute"
            style={{
              width: `${faceWidth * 0.6}px`,
              height: `${faceHeight * 0.25 * length}px`,
              backgroundColor: hairColor,
              borderRadius: '50% 50% 40% 40%',
              top: `${faceHeight * 0.75}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )
      case 'goatee':
        return (
          <div
            className="absolute"
            style={{
              width: `${faceWidth * 0.25}px`,
              height: `${faceHeight * 0.15 * length}px`,
              backgroundColor: hairColor,
              borderRadius: '50%',
              top: `${faceHeight * 0.8}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )
      case 'stubble':
        return (
          <div
            className="absolute"
            style={{
              width: `${faceWidth * 0.7}px`,
              height: `${faceHeight * 0.3}px`,
              background: `radial-gradient(ellipse, ${hairColor}40, transparent)`,
              borderRadius: '50%',
              top: `${faceHeight * 0.55}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )
      case 'full_beard':
        return (
          <div
            className="absolute"
            style={{
              width: `${faceWidth * 0.8}px`,
              height: `${faceHeight * 0.4 * length}px`,
              backgroundColor: hairColor,
              borderRadius: '50% 50% 30% 30%',
              top: `${faceHeight * 0.6}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )
      case 'soul_patch':
        return (
          <div
            className="absolute"
            style={{
              width: `${faceWidth * 0.08}px`,
              height: `${faceHeight * 0.08 * length}px`,
              backgroundColor: hairColor,
              borderRadius: '50%',
              top: `${faceHeight * 0.85}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        )
      default:
        return null
    }
  }

  const renderGlasses = (faceWidth: number, faceHeight: number) => {
    const glassWidth = faceWidth * 0.15
    const glassHeight = glassWidth * 0.8
    const bridgeWidth = faceWidth * 0.05
    
    const getGlassStyle = () => {
      switch (face.glasses) {
        case 'round':
          return { borderRadius: '50%' }
        case 'square':
          return { borderRadius: '10%' }
        case 'aviator':
          return { borderRadius: '50% 50% 70% 70%' }
        case 'cat_eye':
          return { borderRadius: '50% 70% 50% 30%' }
        case 'reading':
          return { borderRadius: '20%' }
        case 'sunglasses':
          return { borderRadius: '30%', backgroundColor: '#00000080' }
        default:
          return { borderRadius: '20%' }
      }
    }

    const glassStyle = getGlassStyle()

    return (
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: `${faceHeight * 0.32}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Left Lens */}
        <div
          className="border-2"
          style={{
            width: `${glassWidth}px`,
            height: `${glassHeight}px`,
            borderColor: face.glassesColor,
            backgroundColor: face.glasses === 'sunglasses' ? '#00000060' : 'rgba(255,255,255,0.1)',
            ...glassStyle,
          }}
        />
        
        {/* Bridge */}
        <div
          style={{
            width: `${bridgeWidth}px`,
            height: '3px',
            backgroundColor: face.glassesColor,
            borderRadius: '2px',
          }}
        />
        
        {/* Right Lens */}
        <div
          className="border-2"
          style={{
            width: `${glassWidth}px`,
            height: `${glassHeight}px`,
            borderColor: face.glassesColor,
            backgroundColor: face.glasses === 'sunglasses' ? '#00000060' : 'rgba(255,255,255,0.1)',
            ...glassStyle,
          }}
        />
      </div>
    )
  }

  const renderEarrings = (faceWidth: number, faceHeight: number) => {
    const earringSize = faceWidth * 0.04
    
    const getEarringStyle = () => {
      switch (face.earrings) {
        case 'studs':
          return { borderRadius: '50%', width: `${earringSize * 0.6}px`, height: `${earringSize * 0.6}px` }
        case 'hoops':
          return { borderRadius: '50%', border: `2px solid ${face.earringColor}`, backgroundColor: 'transparent' }
        case 'dangly':
          return { borderRadius: '20%', width: `${earringSize * 0.5}px`, height: `${earringSize * 1.5}px` }
        case 'gauges':
          return { borderRadius: '50%', width: `${earringSize * 1.2}px`, height: `${earringSize * 1.2}px` }
        default:
          return { borderRadius: '50%' }
      }
    }

    const earringStyle = getEarringStyle()

    return (
      <>
        {/* Left Earring */}
        <div
          className="absolute"
          style={{
            backgroundColor: face.earrings !== 'hoops' ? face.earringColor : 'transparent',
            top: `${faceHeight * 0.4}px`,
            left: `-${earringSize * 0.5}px`,
            width: `${earringSize}px`,
            height: `${earringSize}px`,
            ...earringStyle,
          }}
        />
        
        {/* Right Earring */}
        <div
          className="absolute"
          style={{
            backgroundColor: face.earrings !== 'hoops' ? face.earringColor : 'transparent',
            top: `${faceHeight * 0.4}px`,
            right: `-${earringSize * 0.5}px`,
            width: `${earringSize}px`,
            height: `${earringSize}px`,
            ...earringStyle,
          }}
        />
      </>
    )
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${className} 
        relative flex items-center justify-center
        ${animate ? 'hover:scale-110 transition-all duration-300' : ''}
      `}
      style={{
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
      }}
    >
      {renderFace()}
      
      {/* Subtle glow effect */}
      <div 
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full opacity-10 blur-lg -z-10`}
        style={{ 
          background: `radial-gradient(circle, ${face.skinTone}, transparent 70%)`
        }}
      />
    </div>
  )
}

export default FaceRenderer