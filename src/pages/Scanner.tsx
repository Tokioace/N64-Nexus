import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, Scan, CheckCircle, X, Info, Plus, Star } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import GameResult from '../components/GameResult'
import ScanFrame from '../components/ScanFrame'

interface GameData {
  id: string
  name: string
  year: number
  developer: string
  region: string
  coverUrl: string
  rarity: number
  marketPrice: number
  trivia: string
  isInCollection: boolean
}

const Scanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanMode, setScanMode] = useState<'cover' | 'barcode' | 'text'>('cover')
  const [gameResult, setGameResult] = useState<GameData | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const webcamRef = useRef<Webcam>(null)

  // Mock game database - in real app this would be an API call
  const gameDatabase: GameData[] = [
    {
      id: '1',
      name: 'Super Mario 64',
      year: 1996,
      developer: 'Nintendo',
      region: 'NTSC',
      coverUrl: '/covers/super-mario-64.jpg',
      rarity: 85,
      marketPrice: 45,
      trivia: 'Das erste 3D-Platformer-Spiel der Geschichte!',
      isInCollection: false
    },
    {
      id: '2',
      name: 'The Legend of Zelda: Ocarina of Time',
      year: 1998,
      developer: 'Nintendo',
      region: 'NTSC',
      coverUrl: '/covers/zelda-ocarina.jpg',
      rarity: 90,
      marketPrice: 60,
      trivia: 'Oft als bestes Spiel aller Zeiten bezeichnet!',
      isInCollection: true
    },
    {
      id: '3',
      name: 'GoldenEye 007',
      year: 1997,
      developer: 'Rare',
      region: 'PAL',
      coverUrl: '/covers/goldeneye.jpg',
      rarity: 80,
      marketPrice: 35,
      trivia: 'Revolutionierte Multiplayer-Shooter auf Konsolen!',
      isInCollection: false
    }
  ]

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        processImage(imageSrc)
      }
    }
  }, [])

  const processImage = async (imageSrc: string) => {
    setIsProcessing(true)
    setIsScanning(false)

    try {
      // Simulate OCR processing
      const worker = await createWorker('eng')
      const { data: { text } } = await worker.recognize(imageSrc)
      await worker.terminate()

      // Simulate game recognition based on text
      const recognizedGame = recognizeGame(text)
      
      if (recognizedGame) {
        setGameResult(recognizedGame)
        setShowResult(true)
        playSuccessSound()
      } else {
        // Show no game found message
        setGameResult(null)
        setShowResult(true)
      }
    } catch (error) {
      console.error('Error processing image:', error)
      // Fallback to mock recognition
      const mockGame = gameDatabase[Math.floor(Math.random() * gameDatabase.length)]
      setGameResult(mockGame)
      setShowResult(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const recognizeGame = (text: string): GameData | null => {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('mario') && lowerText.includes('64')) {
      return gameDatabase[0]
    } else if (lowerText.includes('zelda') || lowerText.includes('ocarina')) {
      return gameDatabase[1]
    } else if (lowerText.includes('goldeneye') || lowerText.includes('007')) {
      return gameDatabase[2]
    }
    
    return null
  }

  const playSuccessSound = () => {
    // In a real app, play a chiptune success sound
    console.log('🎵 Success sound played!')
  }

  const addToCollection = () => {
    if (gameResult) {
      // In a real app, this would update the user's collection
      console.log('Added to collection:', gameResult.name)
      setShowResult(false)
      setGameResult(null)
    }
  }

  const showInfoOnly = () => {
    // Just close the result modal
    setShowResult(false)
    setGameResult(null)
  }

  const startScan = () => {
    setIsScanning(true)
    setShowResult(false)
    setGameResult(null)
  }

  const cancelScan = () => {
    setIsScanning(false)
    setIsProcessing(false)
  }

  if (showResult && gameResult) {
    return (
      <GameResult
        game={gameResult}
        onAddToCollection={addToCollection}
        onShowInfo={showInfoOnly}
        onCancel={() => setShowResult(false)}
      />
    )
  }

  if (showResult && !gameResult) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="retro-card">
          <X size={64} className="text-retro-red mx-auto mb-4" />
          <h2 className="text-2xl font-pixel text-retro-red mb-4">Spiel nicht erkannt</h2>
          <p className="text-retro-light mb-6">
            Das Spiel konnte nicht in der Datenbank gefunden werden. 
            Versuche es mit einem anderen Winkel oder einem anderen Spiel.
          </p>
          <button
            onClick={() => setShowResult(false)}
            className="retro-button"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-pixel text-retro-purple mb-4">
          Battle64 Modulscanner
        </h1>
        <p className="text-retro-light mb-6">
          Scanne deine N64-Module und füge sie deiner Sammlung hinzu
        </p>
      </div>

      {!isScanning && !isProcessing && (
        <div className="max-w-2xl mx-auto">
          <div className="retro-card mb-6">
            <h2 className="text-xl font-pixel text-retro-yellow mb-4">Scan-Modus wählen:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setScanMode('cover')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  scanMode === 'cover'
                    ? 'border-retro-green bg-retro-green bg-opacity-20'
                    : 'border-retro-gray hover:border-retro-purple'
                }`}
              >
                <div className="text-center">
                  <Camera size={32} className="mx-auto mb-2 text-retro-purple" />
                  <span className="font-retro">Cover-Scan</span>
                </div>
              </button>
              
              <button
                onClick={() => setScanMode('barcode')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  scanMode === 'barcode'
                    ? 'border-retro-green bg-retro-green bg-opacity-20'
                    : 'border-retro-gray hover:border-retro-purple'
                }`}
              >
                <div className="text-center">
                  <Scan size={32} className="mx-auto mb-2 text-retro-purple" />
                  <span className="font-retro">Barcode</span>
                </div>
              </button>
              
              <button
                onClick={() => setScanMode('text')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  scanMode === 'text'
                    ? 'border-retro-green bg-retro-green bg-opacity-20'
                    : 'border-retro-gray hover:border-retro-purple'
                }`}
              >
                <div className="text-center">
                  <Info size={32} className="mx-auto mb-2 text-retro-purple" />
                  <span className="font-retro">Text-OCR</span>
                </div>
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startScan}
              className="retro-button text-xl px-8 py-4"
            >
              <Camera size={24} className="mr-2" />
              Scan starten
            </button>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="max-w-2xl mx-auto">
          <div className="scan-frame">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-96 object-cover"
            />
            <div className="scan-line"></div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-retro-light mb-4">
              Halte das Modul oder die Verpackung in den grünen Rahmen
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={captureImage}
                className="retro-button bg-retro-green hover:bg-retro-blue"
              >
                <CheckCircle size={20} className="mr-2" />
                Foto aufnehmen
              </button>
              <button
                onClick={cancelScan}
                className="retro-button bg-retro-red hover:bg-red-700"
              >
                <X size={20} className="mr-2" />
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="max-w-md mx-auto text-center">
          <div className="retro-card">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-retro-green mx-auto mb-4"></div>
            <h2 className="text-xl font-pixel text-retro-yellow mb-2">Verarbeite Scan...</h2>
            <p className="text-retro-light">
              KI erkennt Spiel und extrahiert Informationen...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Scanner