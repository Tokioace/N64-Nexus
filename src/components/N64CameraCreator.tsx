import React, { useState, useRef, useCallback } from 'react'
import { Camera, RotateCcw, Save, Sparkles, Upload } from 'lucide-react'

interface N64CameraCreatorProps {
  onSave: (imageData: string) => void
  onCancel?: () => void
}

const N64CameraCreator: React.FC<N64CameraCreatorProps> = ({ onSave, onCancel }) => {
  const [isCamera, setIsCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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
      // Simulate AI processing for now - replace with actual OpenAI API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // For demo purposes, we'll use the original image with a filter effect
      // In production, this would be replaced with actual AI processing
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = 256
        canvas.height = 256
        
        if (ctx) {
          // Apply N64-style pixelated effect
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(img, 0, 0, 256, 256)
          
          // Apply retro color palette effect
          const imageData = ctx.getImageData(0, 0, 256, 256)
          const data = imageData.data
          
          for (let i = 0; i < data.length; i += 4) {
            // Reduce color depth for N64 effect
            data[i] = Math.floor(data[i] / 32) * 32     // Red
            data[i + 1] = Math.floor(data[i + 1] / 32) * 32 // Green
            data[i + 2] = Math.floor(data[i + 2] / 32) * 32 // Blue
          }
          
          ctx.putImageData(imageData, 0, 0)
          setProcessedImage(canvas.toDataURL('image/jpeg', 0.8))
        }
      }
      
      img.src = capturedImage
    } catch (err) {
      setError('Fehler bei der KI-Verarbeitung. Bitte versuche es erneut.')
      console.error('AI processing error:', err)
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
              Mache ein Foto von deinem Gesicht und verwandle es in einen Nintendo 64 Charakter!
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
                  <>
                    <button
                      onClick={processWithAI}
                      disabled={isProcessing}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Sparkles size={20} />
                      {isProcessing ? 'Verarbeitung...' : 'KI Umwandlung'}
                    </button>
                    <button
                      onClick={resetAll}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <RotateCcw size={20} />
                      Neu starten
                    </button>
                  </>
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
                    <p>KI erstellt deinen N64 Charakter...</p>
                    <p className="text-sm text-gray-400 mt-2">Das kann einen Moment dauern</p>
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
                    <p className="text-green-400 font-semibold">N64 Charakter erstellt! 🎮</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Sparkles size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Dein N64 Charakter erscheint hier</p>
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