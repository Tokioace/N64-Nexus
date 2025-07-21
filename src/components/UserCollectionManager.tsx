import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { UserCollection } from '../types'
import { Plus, Edit, Trash2, Package, Star, Calendar, MapPin, Gamepad2 } from 'lucide-react'

interface CollectionManagerProps {
  isOwnProfile?: boolean
}

const UserCollectionManager: React.FC<CollectionManagerProps> = ({ isOwnProfile = true }) => {
  const { user, addToCollection, removeFromCollection } = useUser()
  const { t, currentLanguage } = useLanguage()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<UserCollection | null>(null)
  const [filter, setFilter] = useState<'all' | 'collection' | 'wishlist'>('all')
  
  const [newItem, setNewItem] = useState<Omit<UserCollection, 'id' | 'userId'>>({
    gameId: '',
    gameName: '',
    platform: 'N64',
    region: 'PAL',
    condition: 'very-good',
    completeness: 'complete',
    acquisitionDate: new Date(),
    notes: '',
    imageUrl: '',
    isWishlist: false
  })

  if (!user) return null

  const filteredCollections = user.collections.filter(item => {
    if (filter === 'collection') return !item.isWishlist
    if (filter === 'wishlist') return item.isWishlist
    return true
  })

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newItem.gameName.trim()) {
      const success = await addToCollection({
        ...newItem,
        gameId: newItem.gameName.toLowerCase().replace(/\s+/g, '_')
      })
      
      if (success) {
        setShowAddModal(false)
        setNewItem({
          gameId: '',
          gameName: '',
          platform: 'N64',
          region: 'PAL',
          condition: 'very-good',
          completeness: 'complete',
          acquisitionDate: new Date(),
          notes: '',
          imageUrl: '',
          isWishlist: false
        })
      }
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (confirm(t('collection.confirmRemove'))) {
      await removeFromCollection(itemId)
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'mint': return 'text-green-400 bg-green-400/20'
      case 'very-good': return 'text-blue-400 bg-blue-400/20'
      case 'good': return 'text-yellow-400 bg-yellow-400/20'
      case 'fair': return 'text-orange-400 bg-orange-400/20'
      case 'poor': return 'text-red-400 bg-red-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'mint': return t('collection.mint')
      case 'very-good': return t('collection.veryGood')
      case 'good': return t('collection.good')
      case 'fair': return t('collection.fair')
      case 'poor': return t('collection.poor')
      default: return condition
    }
  }

  const getCompletenessText = (completeness: string) => {
    switch (completeness) {
      case 'complete': return t('collection.complete')
      case 'cart-only': return t('collection.cartOnly')
      case 'box-only': return t('collection.boxOnly')
      default: return completeness
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            {isOwnProfile ? t('collection.myCollection') : t('collection.userCollection').replace('{username}', user.username)}
          </h2>
          <p className="text-slate-400">
            {user.collections.filter(c => !c.isWishlist).length} {t('collection.inCollection')}, {' '}
            {user.collections.filter(c => c.isWishlist).length} {t('collection.onWishlist')}
          </p>
        </div>
        
        {isOwnProfile && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('collection.addGame')}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('collection.all')} ({user.collections.length})
        </button>
        <button
          onClick={() => setFilter('collection')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            filter === 'collection'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('collection.collection')} ({user.collections.filter(c => !c.isWishlist).length})
        </button>
        <button
          onClick={() => setFilter('wishlist')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            filter === 'wishlist'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t('collection.wishlist')} ({user.collections.filter(c => c.isWishlist).length})
        </button>
      </div>

      {/* Collection Grid */}
      {filteredCollections.length === 0 ? (
        <div className="simple-tile text-center py-12">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {filter === 'wishlist' ? t('collection.noWishes') : t('collection.noGames')}
          </h3>
          <p className="text-slate-400">
            {isOwnProfile 
              ? filter === 'wishlist' 
                ? t('collection.addFirstGame')
                : t('collection.addFirstGame')
              : t('collection.noGamesYet')
                  .replace('{username}', user.username)
                  .replace('{type}', filter === 'wishlist' ? t('collection.onWishlist') : t('collection.inCollection'))
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((item) => (
            <div key={item.id} className="simple-tile p-6 hover:border-blue-500/50 transition-colors">
              {/* Game Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">
                    {item.gameName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Gamepad2 className="w-4 h-4" />
                    <span>{item.platform}</span>
                    <span>•</span>
                    <span>{item.region}</span>
                  </div>
                </div>
                
                {item.isWishlist && (
                  <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                )}
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                  {getConditionText(item.condition)}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium text-slate-300 bg-slate-700">
                  {getCompletenessText(item.completeness)}
                </span>
              </div>

              {/* Acquisition Date */}
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                <Calendar className="w-4 h-4" />
                <span>
                  {item.isWishlist ? t('collection.added') : t('collection.acquired')}: {' '}
                                      {item.acquisitionDate.toLocaleDateString(getLocaleString(currentLanguage))}
                </span>
              </div>

              {/* Notes */}
              {item.notes && (
                <p className="text-sm text-slate-300 mb-4 italic">
                  "{item.notes}"
                </p>
              )}

              {/* Actions */}
              {isOwnProfile && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
{t('collection.editGame')}
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
{t('collection.removeGame')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="simple-tile max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              {t('collection.addGame')}
            </h3>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('label.gameName')} {t('label.required')}
                </label>
                <input
                  type="text"
                  required
                  value={newItem.gameName}
                  onChange={(e) => setNewItem({ ...newItem, gameName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('placeholder.gameName')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('label.platform')}
                  </label>
                  <select
                    value={newItem.platform}
                    onChange={(e) => setNewItem({ ...newItem, platform: e.target.value as 'N64' | 'PC' })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="N64">N64</option>
                    <option value="PC">PC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('label.region')}
                  </label>
                  <select
                    value={newItem.region}
                    onChange={(e) => setNewItem({ ...newItem, region: e.target.value as 'PAL' | 'NTSC' })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PAL">PAL</option>
                    <option value="NTSC">NTSC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('collection.condition')}
                  </label>
                  <select
                    value={newItem.condition}
                    onChange={(e) => setNewItem({ ...newItem, condition: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mint">{t('collection.mint')}</option>
                    <option value="very-good">{t('collection.veryGood')}</option>
                    <option value="good">{t('collection.good')}</option>
                    <option value="fair">{t('collection.fair')}</option>
                    <option value="poor">{t('collection.poor')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('collection.completeness')}
                  </label>
                  <select
                    value={newItem.completeness}
                    onChange={(e) => setNewItem({ ...newItem, completeness: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="complete">{t('collection.complete')}</option>
                    <option value="cart-only">{t('collection.cartOnly')}</option>
                    <option value="box-only">{t('collection.boxOnly')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('label.notes')}
                </label>
                <textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder={t('placeholder.notes')}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isWishlist"
                  checked={newItem.isWishlist}
                  onChange={(e) => setNewItem({ ...newItem, isWishlist: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isWishlist" className="ml-2 text-sm text-slate-300">
{t('collection.addToWishlist')}
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {t('collection.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
{t('collection.addGame')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserCollectionManager