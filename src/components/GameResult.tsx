import React from 'react'
import { Plus, Info, X, Star, CheckCircle, AlertTriangle } from 'lucide-react'

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

interface GameResultProps {
  game: GameData
  onAddToCollection: () => void
  onShowInfo: () => void
  onCancel: () => void
}

const GameResult: React.FC<GameResultProps> = ({
  game,
  onAddToCollection,
  onShowInfo,
  onCancel
}) => {
  const getRarityColor = (rarity: number) => {
    if (rarity >= 90) return 'text-yellow-400'
    if (rarity >= 80) return 'text-purple-400'
    if (rarity >= 70) return 'text-blue-400'
    return 'text-green-400'
  }

  const getRarityLabel = (rarity: number) => {
    if (rarity >= 90) return 'Ultra Selten'
    if (rarity >= 80) return 'Sehr Selten'
    if (rarity >= 70) return 'Selten'
    return 'Häufig'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="retro-card pixel-effect">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-pixel text-retro-purple">Scan-Ergebnis</h2>
          <button
            onClick={onCancel}
            className="text-retro-light hover:text-retro-red transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Game Cover */}
          <div className="text-center">
            <div className="w-48 h-64 bg-retro-gray border-2 border-retro-purple rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-retro-light font-retro">Cover Bild</span>
            </div>
            <h3 className="text-xl font-pixel text-retro-yellow mb-2">{game.name}</h3>
            <p className="text-retro-light">{game.year} • {game.developer}</p>
          </div>

          {/* Game Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-retro-light">Region:</span>
              <span className="font-retro text-retro-yellow">{game.region}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-retro-light">Seltenheit:</span>
              <div className="flex items-center space-x-2">
                <Star size={16} className={getRarityColor(game.rarity)} />
                <span className={`font-retro ${getRarityColor(game.rarity)}`}>
                  {getRarityLabel(game.rarity)} ({game.rarity}/100)
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-retro-light">Marktwert:</span>
              <span className="font-retro text-retro-green">~€{game.marketPrice}</span>
            </div>

            {game.isInCollection && (
              <div className="bg-retro-yellow bg-opacity-20 border border-retro-yellow rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={16} className="text-retro-yellow" />
                  <span className="text-retro-yellow font-retro text-sm">
                    Du hast dieses Spiel bereits in deiner Sammlung!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trivia */}
        <div className="bg-retro-dark border border-retro-purple rounded-lg p-4 mb-6">
          <h4 className="text-lg font-pixel text-retro-yellow mb-2">💡 Wusstest du?</h4>
          <p className="text-retro-light font-retro">{game.trivia}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!game.isInCollection && (
            <button
              onClick={onAddToCollection}
              className="retro-button bg-retro-green hover:bg-retro-blue flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Zur Sammlung hinzufügen</span>
            </button>
          )}
          
          <button
            onClick={onShowInfo}
            className="retro-button bg-retro-purple hover:bg-retro-blue flex items-center justify-center space-x-2"
          >
            <Info size={20} />
            <span>Nur Infos anzeigen</span>
          </button>
        </div>

        {/* Verification Status */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-retro-green">
            <CheckCircle size={16} />
            <span className="font-retro text-sm">Verifiziert durch Scan</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameResult