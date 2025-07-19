import React, { useState, useRef, useCallback } from 'react'
import { Camera, RotateCcw, Save, Sparkles, Upload } from 'lucide-react'

interface N64CameraCreatorProps {
  onSave: (imageData: string) => void
  onCancel?: () => void
}

const getStylePrompt = (style: 'mario' | 'zelda' | 'goldeneye' | 'general') => {
  const basePrompt = `Transform this person's face into a Nintendo 64 era cartoon character while preserving their facial features. The character should maintain the person's distinctive facial features (eye shape, nose, mouth, face structure) but be styled as:`

  switch (style) {
    case 'mario':
      return `${basePrompt}
      - Mario 64 character style with round, friendly features
      - Bright primary colors (reds, blues, yellows)
      - Cartoon-like with exaggerated expressions
      - Clean, simple shading typical of Mario characters
      - Cheerful and approachable appearance`
    
    case 'zelda':
      return `${basePrompt}
      - Zelda: Ocarina of Time character style
      - More detailed and heroic appearance
      - Fantasy adventure aesthetic with earthy tones
      - Slightly more realistic proportions but still stylized
      - Noble and adventurous character design`
    
    case 'goldeneye':
      return `${basePrompt}
      - GoldenEye 007 character style
      - More realistic proportions with stylized features
      - Slightly more serious and mature appearance
      - Muted colors with realistic skin tones
      - Action hero aesthetic typical of 90s games`
    
    default:
      return `${basePrompt}
      - General N64 era cartoon character style
      - Anime/cartoon-like with simplified but recognizable features
      - Low-poly 3D aesthetic similar to classic N64 games
      - Bright, saturated colors typical of N64 games
      - Simplified shading and clean lighting
      - Square/angular features typical of early 3D character models
      - Retro gaming aesthetic from the late 1990s`
  }
}

const N64CameraCreator: React.FC<N64CameraCreatorProps> = ({ onSave, onCancel }) => {
  const [isCamera, setIsCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<'mario' | 'zelda' | 'goldeneye' | 'general'>('general')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCamera(true)
      }
    } catch (err) {
      setError('Kamera konnte nicht gestartet werden. Bitte überprüfe die Berechtigungen.')
      console.error('Camera error:', err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCamera(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Flip horizontal for selfie effect
    context.scale(-1, 1)
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    context.scale(-1, 1)

    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    stopCamera()
  }, [stopCamera])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Bitte wähle eine gültige Bilddatei aus.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setCapturedImage(result)
      setError(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const processWithAI = useCallback(async () => {
    if (!capturedImage) return

    setIsProcessing(true)
    setError(null)

    try {
      // Convert image to base64 without data URL prefix
      const base64Image = capturedImage.split(',')[1]
      
      // Call OpenAI API for image transformation
      const response = await fetch('/api/transform-to-n64-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
                 body: JSON.stringify({
           image: base64Image,
           style: selectedStyle,
           prompt: getStylePrompt(selectedStyle)
         })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.imageUrl) {
        setProcessedImage(result.imageUrl)
      } else if (result.fallback) {
        // API indicates to use fallback, don't show as error
        throw new Error('fallback')
      } else {
        throw new Error(result.error || 'Unbekannter Fehler bei der KI-Verarbeitung')
      }
    } catch (err) {
      console.error('AI processing error:', err)
      
      // Only show error if it's not a fallback case
      if (err.message !== 'fallback') {
        setError('KI-Service nicht verfügbar. Verwende erweiterten lokalen Filter.')
      }
      
      // Fallback: Apply enhanced N64-style filter if API fails
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
                 img.onload = () => {
           canvas.width = 512
           canvas.height = 512
           
           if (ctx) {
             // Apply enhanced N64-style cartoon effect as fallback
             ctx.imageSmoothingEnabled = false
             ctx.drawImage(img, 0, 0, 512, 512)
             
             // Apply multiple passes for better cartoon effect
             const imageData = ctx.getImageData(0, 0, 512, 512)
             const data = imageData.data
             
             // Pass 1: Color quantization and saturation boost
             for (let i = 0; i < data.length; i += 4) {
               // Stronger color quantization for cartoon effect
               data[i] = Math.floor(data[i] / 20) * 20         // Red
               data[i + 1] = Math.floor(data[i + 1] / 20) * 20 // Green
               data[i + 2] = Math.floor(data[i + 2] / 20) * 20 // Blue
               
               // Boost saturation significantly for cartoon look
               const max = Math.max(data[i], data[i + 1], data[i + 2])
               const min = Math.min(data[i], data[i + 1], data[i + 2])
               const saturation = max === 0 ? 0 : (max - min) / max
               
               if (saturation > 0.05) {
                 const factor = 1.5 // Strong saturation increase
                 data[i] = Math.min(255, data[i] * factor)
                 data[i + 1] = Math.min(255, data[i + 1] * factor)
                 data[i + 2] = Math.min(255, data[i + 2] * factor)
               }
               
               // Apply N64-style color palette bias
               if (data[i] > 200) data[i] = 255      // Boost bright reds
               if (data[i + 1] > 200) data[i + 1] = 255  // Boost bright greens
               if (data[i + 2] > 200) data[i + 2] = 255  // Boost bright blues
               
               // Darken shadows for more contrast
               if (data[i] < 50) data[i] = Math.max(0, data[i] - 20)
               if (data[i + 1] < 50) data[i + 1] = Math.max(0, data[i + 1] - 20)
               if (data[i + 2] < 50) data[i + 2] = Math.max(0, data[i + 2] - 20)
             }
             
             ctx.putImageData(imageData, 0, 0)
             
             // Pass 2: Apply subtle edge enhancement for cartoon effect
             const finalImageData = ctx.getImageData(0, 0, 512, 512)
             const finalData = finalImageData.data
             
             // Simple edge detection and enhancement
             for (let y = 1; y < 511; y++) {
               for (let x = 1; x < 511; x++) {
                 const idx = (y * 512 + x) * 4
                 const rightIdx = (y * 512 + x + 1) * 4
                 const bottomIdx = ((y + 1) * 512 + x) * 4
                 
                 // Calculate edge strength
                 const edgeX = Math.abs(finalData[idx] - finalData[rightIdx])
                 const edgeY = Math.abs(finalData[idx] - finalData[bottomIdx])
                 const edge = edgeX + edgeY
                 
                 // Enhance edges slightly for cartoon effect
                 if (edge > 30) {
                   finalData[idx] = Math.min(255, finalData[idx] + 10)
                   finalData[idx + 1] = Math.min(255, finalData[idx + 1] + 10)
                   finalData[idx + 2] = Math.min(255, finalData[idx + 2] + 10)
                 }
               }
             }
             
             ctx.putImageData(finalImageData, 0, 0)
             setProcessedImage(canvas.toDataURL('image/jpeg', 0.9))
           }
        }
        
        img.src = capturedImage
      } catch (fallbackErr) {
        console.error('Fallback processing error:', fallbackErr)
        setError('Sowohl KI-Verarbeitung als auch Fallback-Filter sind fehlgeschlagen.')
      }
    } finally {
      setIsProcessing(false)
    }
  }, [capturedImage])

  const handleSave = useCallback(() => {
    if (processedImage) {
      onSave(processedImage)
    }
  }, [processedImage, onSave])

  const resetAll = useCallback(() => {
    setCapturedImage(null)
    setProcessedImage(null)
    setError(null)
    stopCamera()
  }, [stopCamera])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-400" />
              N64 Charakter Creator
              <Sparkles className="text-yellow-400" />
            </h1>
            <p className="text-gray-300">
              Mache ein Foto und verwandle dein Gesicht in einen N64-Cartoon-Charakter! Die KI behält deine Gesichtsmerkmale bei und macht daraus einen Anime/Cartoon-Style wie in klassischen N64-Spielen.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-red-200">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Camera/Upload Section */}
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-xl p-4 min-h-[300px] flex items-center justify-center">
                {isCamera ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="rounded-lg max-w-full"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-lg pointer-events-none"></div>
                  </div>
                ) : capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="rounded-lg max-w-full max-h-[300px] object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Foto aufnehmen oder hochladen</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-center">
                {!isCamera && !capturedImage && (
                  <>
                    <button
                      onClick={startCamera}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Camera size={20} />
                      Kamera starten
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Upload size={20} />
                      Foto hochladen
                    </button>
                  </>
                )}

                {isCamera && (
                  <>
                    <button
                      onClick={capturePhoto}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Camera size={20} />
                      Foto aufnehmen
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Abbrechen
                    </button>
                  </>
                )}

                {capturedImage && !processedImage && (
                  <div className="space-y-3">
                    {/* Style Selection */}
                    <div className="text-center">
                      <p className="text-white text-sm mb-2">Wähle einen N64-Stil:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => setSelectedStyle('general')}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            selectedStyle === 'general' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Allgemein
                        </button>
                        <button
                          onClick={() => setSelectedStyle('mario')}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            selectedStyle === 'mario' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Mario 64
                        </button>
                        <button
                          onClick={() => setSelectedStyle('zelda')}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            selectedStyle === 'zelda' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Zelda OoT
                        </button>
                        <button
                          onClick={() => setSelectedStyle('goldeneye')}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            selectedStyle === 'goldeneye' 
                              ? 'bg-yellow-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          GoldenEye
                        </button>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={processWithAI}
                        disabled={isProcessing}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Sparkles size={20} />
                        {isProcessing ? 'KI erstellt Charakter...' : 'In N64-Charakter umwandeln'}
                      </button>
                      <button
                        onClick={resetAll}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <RotateCcw size={20} />
                        Neu starten
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Result Section */}
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-xl p-4 min-h-[300px] flex items-center justify-center">
                {isProcessing ? (
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p>KI verwandelt dein Gesicht in einen N64-Cartoon-Charakter...</p>
                    <p className="text-sm text-gray-400 mt-2">Gesichtsmerkmale werden beibehalten, Style wird zu N64-Anime umgewandelt</p>
                  </div>
                ) : processedImage ? (
                  <div className="text-center">
                    <img
                      src={processedImage}
                      alt="N64 Character"
                      className="rounded-lg max-w-full max-h-[250px] object-contain mx-auto mb-4"
                      style={{
                        imageRendering: 'pixelated'
                      }}
                    />
                    <p className="text-green-400 font-semibold">N64-Cartoon-Charakter erstellt! 🎮✨</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Sparkles size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Dein N64-Cartoon-Charakter erscheint hier</p>
                  </div>
                )}
              </div>

              {processedImage && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                  >
                    <Save size={20} />
                    Als Profilbild speichern
                  </button>
                  <button
                    onClick={resetAll}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <RotateCcw size={20} />
                    Neues Foto
                  </button>
                </div>
              )}

              {onCancel && (
                <div className="text-center">
                  <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Zurück zum Profil
                  </button>
                </div>
              )}
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>


    </div>
  )
}

export default N64CameraCreator