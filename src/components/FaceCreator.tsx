import React, { useState, useEffect } from 'react'
import { FaceData } from '../types'
import FaceRenderer from './FaceRenderer'
import { 
  Shuffle, 
  Save, 
  RotateCcw,
  Palette,
  Eye,
  Smile,
  User,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface FaceCreatorProps {
  initialFace?: FaceData
  onSave: (face: Omit<FaceData, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel?: () => void
}

const FaceCreator: React.FC<FaceCreatorProps> = ({
  initialFace,
  onSave,
  onCancel
}) => {
  const [currentFace, setCurrentFace] = useState<Omit<FaceData, 'id' | 'createdAt' | 'updatedAt'>>({
    faceShape: 'oval',
    faceWidth: 1.0,
    faceHeight: 1.0,
    skinTone: '#FFDBAC',
    
    eyeShape: 'almond',
    eyeSize: 1.0,
    eyeDistance: 1.0,
    eyeColor: '#4A90E2',
    eyebrowShape: 'arched',
    eyebrowThickness: 1.0,
    eyebrowColor: '#8B4513',
    eyelashes: true,
    
    noseShape: 'straight',
    noseSize: 1.0,
    noseWidth: 1.0,
    
    lipShape: 'full',
    lipSize: 1.0,
    lipColor: '#FF6B9D',
    mouthExpression: 'neutral',
    
    cheekbones: 'medium',
    jawShape: 'soft',
    chinShape: 'medium',
    
    hairStyle: 'medium',
    hairColor: '#8B4513',
    hairLength: 1.0,
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
    
    ageGroup: 'young_adult',
    gender: 'neutral'
  })

  const [activeSection, setActiveSection] = useState<string>('face')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['face']))

  // Color palettes
  const skinTones = [
    '#FFDBAC', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#A0522D', '#654321',
    '#FDBCB4', '#EAA58D', '#D08B5B', '#B87333', '#8B4513', '#654321', '#3C2415'
  ]
  
  const hairColors = [
    '#000000', '#2C1B18', '#8B4513', '#D2691E', '#CD853F', '#DEB887',
    '#F4A460', '#FFD700', '#FFA500', '#FF6347', '#DC143C', '#9370DB',
    '#4169E1', '#32CD32', '#FF1493', '#00CED1'
  ]

  const eyeColors = [
    '#4A90E2', '#228B22', '#8B4513', '#FF6347', '#9400D3', '#FF1493',
    '#00CED1', '#000000', '#2F4F4F', '#8FBC8F', '#DDA0DD', '#F0E68C'
  ]

  useEffect(() => {
    if (initialFace) {
      const faceData = { ...initialFace }
      delete (faceData as any).id
      delete (faceData as any).createdAt
      delete (faceData as any).updatedAt
      setCurrentFace(faceData)
    }
  }, [initialFace])

  const randomizeFace = () => {
    const faceShapes = ['round', 'oval', 'square', 'heart', 'diamond', 'long'] as const
    const eyeShapes = ['round', 'almond', 'hooded', 'upturned', 'downturned', 'monolid'] as const
    const noseShapes = ['straight', 'roman', 'button', 'hawk', 'snub', 'crooked'] as const
    const lipShapes = ['full', 'thin', 'bow', 'wide', 'small', 'heart'] as const
    const hairStyles = ['none', 'short', 'medium', 'long', 'curly', 'wavy', 'straight', 'afro', 'braids', 'ponytail', 'bun', 'pixie', 'bob', 'shag'] as const
    
    const randomFace = {
      ...currentFace,
      faceShape: faceShapes[Math.floor(Math.random() * faceShapes.length)],
      faceWidth: 0.8 + Math.random() * 0.4,
      faceHeight: 0.8 + Math.random() * 0.4,
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
      
      eyeShape: eyeShapes[Math.floor(Math.random() * eyeShapes.length)],
      eyeSize: 0.7 + Math.random() * 0.6,
      eyeDistance: 0.8 + Math.random() * 0.4,
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      
      noseShape: noseShapes[Math.floor(Math.random() * noseShapes.length)],
      noseSize: 0.7 + Math.random() * 0.6,
      noseWidth: 0.8 + Math.random() * 0.4,
      
      lipShape: lipShapes[Math.floor(Math.random() * lipShapes.length)],
      lipSize: 0.7 + Math.random() * 0.6,
      
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      hairLength: 0.5 + Math.random() * 1.5,
      hairVolume: 0.5 + Math.random() * 1.0,
    }
    
    setCurrentFace(randomFace)
  }

  const resetToDefault = () => {
    setCurrentFace({
      faceShape: 'oval',
      faceWidth: 1.0,
      faceHeight: 1.0,
      skinTone: '#FFDBAC',
      
      eyeShape: 'almond',
      eyeSize: 1.0,
      eyeDistance: 1.0,
      eyeColor: '#4A90E2',
      eyebrowShape: 'arched',
      eyebrowThickness: 1.0,
      eyebrowColor: '#8B4513',
      eyelashes: true,
      
      noseShape: 'straight',
      noseSize: 1.0,
      noseWidth: 1.0,
      
      lipShape: 'full',
      lipSize: 1.0,
      lipColor: '#FF6B9D',
      mouthExpression: 'neutral',
      
      cheekbones: 'medium',
      jawShape: 'soft',
      chinShape: 'medium',
      
      hairStyle: 'medium',
      hairColor: '#8B4513',
      hairLength: 1.0,
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
      
      ageGroup: 'young_adult',
      gender: 'neutral'
    })
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateFaceProperty = (property: keyof typeof currentFace, value: any) => {
    setCurrentFace(prev => ({
      ...prev,
      [property]: value
    }))
  }

  const mockFace: FaceData = {
    id: 'preview',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...currentFace
  }

  const ColorPicker = ({ colors, selected, onSelect }: { colors: string[], selected: string, onSelect: (color: string) => void }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {colors.map(color => (
        <button
          key={color}
          className={`w-8 h-8 rounded-full border-2 transition-all ${
            selected === color ? 'border-white scale-110' : 'border-gray-400 hover:border-white'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  )

  const Slider = ({ label, value, min, max, step, onChange }: {
    label: string, value: number, min: number, max: number, step: number, onChange: (value: number) => void
  }) => (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">
        {label}: {value.toFixed(2)}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  )

  const Select = ({ label, value, options, onChange }: {
    label: string, value: string, options: string[], onChange: (value: string) => void
  }) => (
    <div className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
          </option>
        ))}
      </select>
    </div>
  )

  const SectionHeader = ({ title, icon: Icon, sectionKey }: { title: string, icon: any, sectionKey: string }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors mb-2"
    >
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3 text-blue-400" />
        <span className="text-white font-medium">{title}</span>
      </div>
      {expandedSections.has(sectionKey) ? 
        <ChevronUp className="w-5 h-5 text-gray-400" /> : 
        <ChevronDown className="w-5 h-5 text-gray-400" />
      }
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <User className="mr-3 text-blue-400" />
            Face Creator
          </h1>
          <p className="text-white/70">Create your unique face</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Face Preview */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-6 text-center">Preview</h2>
              
              <div className="flex justify-center mb-6">
                <FaceRenderer 
                  face={mockFace} 
                  size="xl" 
                  animate={true}
                  className="transform hover:scale-105 transition-all duration-300"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={randomizeFace}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Randomize
                </button>
                
                <button
                  onClick={resetToDefault}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>

                <button
                  onClick={() => onSave(currentFace)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Face
                </button>
                
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Customize Face</h2>
              
              <div className="space-y-4">
                {/* Face Structure */}
                <div>
                  <SectionHeader title="Face Structure" icon={User} sectionKey="face" />
                  {expandedSections.has('face') && (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                      <Select 
                        label="Face Shape" 
                        value={currentFace.faceShape} 
                        options={['round', 'oval', 'square', 'heart', 'diamond', 'long']}
                        onChange={(value) => updateFaceProperty('faceShape', value)}
                      />
                      
                      <Slider 
                        label="Face Width" 
                        value={currentFace.faceWidth} 
                        min={0.8} 
                        max={1.2} 
                        step={0.05}
                        onChange={(value) => updateFaceProperty('faceWidth', value)}
                      />
                      
                      <Slider 
                        label="Face Height" 
                        value={currentFace.faceHeight} 
                        min={0.8} 
                        max={1.2} 
                        step={0.05}
                        onChange={(value) => updateFaceProperty('faceHeight', value)}
                      />
                      
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Skin Tone</label>
                        <ColorPicker 
                          colors={skinTones}
                          selected={currentFace.skinTone}
                          onSelect={(color) => updateFaceProperty('skinTone', color)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Eyes */}
                <div>
                  <SectionHeader title="Eyes & Eyebrows" icon={Eye} sectionKey="eyes" />
                  {expandedSections.has('eyes') && (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                      <Select 
                        label="Eye Shape" 
                        value={currentFace.eyeShape} 
                        options={['round', 'almond', 'hooded', 'upturned', 'downturned', 'monolid']}
                        onChange={(value) => updateFaceProperty('eyeShape', value)}
                      />
                      
                      <Slider 
                        label="Eye Size" 
                        value={currentFace.eyeSize} 
                        min={0.7} 
                        max={1.3} 
                        step={0.05}
                        onChange={(value) => updateFaceProperty('eyeSize', value)}
                      />
                      
                      <Slider 
                        label="Eye Distance" 
                        value={currentFace.eyeDistance} 
                        min={0.8} 
                        max={1.2} 
                        step={0.05}
                        onChange={(value) => updateFaceProperty('eyeDistance', value)}
                      />
                      
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Eye Color</label>
                        <ColorPicker 
                          colors={eyeColors}
                          selected={currentFace.eyeColor}
                          onSelect={(color) => updateFaceProperty('eyeColor', color)}
                        />
                      </div>

                      <Select 
                        label="Eyebrow Shape" 
                        value={currentFace.eyebrowShape} 
                        options={['straight', 'arched', 'rounded', 'angled', 'thick', 'thin']}
                        onChange={(value) => updateFaceProperty('eyebrowShape', value)}
                      />
                      
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">Eyebrow Color</label>
                        <ColorPicker 
                          colors={hairColors}
                          selected={currentFace.eyebrowColor}
                          onSelect={(color) => updateFaceProperty('eyebrowColor', color)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Nose & Mouth */}
                <div>
                  <SectionHeader title="Nose & Mouth" icon={Smile} sectionKey="nose_mouth" />
                  {expandedSections.has('nose_mouth') && (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                      <Select 
                        label="Nose Shape" 
                        value={currentFace.noseShape} 
                        options={['straight', 'roman', 'button', 'hawk', 'snub', 'crooked']}
                        onChange={(value) => updateFaceProperty('noseShape', value)}
                      />
                      
                      <Slider 
                        label="Nose Size" 
                        value={currentFace.noseSize} 
                        min={0.7} 
                        max={1.3} 
                        step={0.05}
                        onChange={(value) => updateFaceProperty('noseSize', value)}
                      />

                      <Select 
                        label="Lip Shape" 
                        value={currentFace.lipShape} 
                        options={['full', 'thin', 'bow', 'wide', 'small', 'heart']}
                        onChange={(value) => updateFaceProperty('lipShape', value)}
                      />
                      
                      <Select 
                        label="Expression" 
                        value={currentFace.mouthExpression} 
                        options={['neutral', 'smile', 'frown', 'smirk', 'open', 'surprised']}
                        onChange={(value) => updateFaceProperty('mouthExpression', value)}
                      />
                    </div>
                  )}
                </div>

                {/* Hair */}
                <div>
                  <SectionHeader title="Hair" icon={Palette} sectionKey="hair" />
                  {expandedSections.has('hair') && (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                      <Select 
                        label="Hair Style" 
                        value={currentFace.hairStyle} 
                        options={['none', 'short', 'medium', 'long', 'curly', 'wavy', 'straight', 'afro', 'braids', 'ponytail', 'bun', 'pixie', 'bob', 'shag', 'mohawk']}
                        onChange={(value) => updateFaceProperty('hairStyle', value)}
                      />
                      
                      {currentFace.hairStyle !== 'none' && (
                        <>
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">Hair Color</label>
                            <ColorPicker 
                              colors={hairColors}
                              selected={currentFace.hairColor}
                              onSelect={(color) => updateFaceProperty('hairColor', color)}
                            />
                          </div>
                          
                          <Slider 
                            label="Hair Length" 
                            value={currentFace.hairLength} 
                            min={0.5} 
                            max={2.0} 
                            step={0.1}
                            onChange={(value) => updateFaceProperty('hairLength', value)}
                          />
                          
                          <Slider 
                            label="Hair Volume" 
                            value={currentFace.hairVolume} 
                            min={0.5} 
                            max={1.5} 
                            step={0.1}
                            onChange={(value) => updateFaceProperty('hairVolume', value)}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Accessories */}
                <div>
                  <SectionHeader title="Accessories" icon={Settings} sectionKey="accessories" />
                  {expandedSections.has('accessories') && (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                      <Select 
                        label="Glasses" 
                        value={currentFace.glasses} 
                        options={['none', 'round', 'square', 'aviator', 'cat_eye', 'reading', 'sunglasses']}
                        onChange={(value) => updateFaceProperty('glasses', value)}
                      />
                      
                      <Select 
                        label="Facial Hair" 
                        value={currentFace.facialHair} 
                        options={['none', 'mustache', 'beard', 'goatee', 'stubble', 'full_beard', 'soul_patch']}
                        onChange={(value) => updateFaceProperty('facialHair', value)}
                      />
                      
                      <Select 
                        label="Earrings" 
                        value={currentFace.earrings} 
                        options={['none', 'studs', 'hoops', 'dangly', 'gauges']}
                        onChange={(value) => updateFaceProperty('earrings', value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaceCreator