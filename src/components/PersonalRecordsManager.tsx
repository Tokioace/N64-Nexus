import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { PersonalRecord } from '../types'
import { Plus, Trophy, Clock, Target, Gamepad2, Calendar, CheckCircle, AlertCircle, Edit } from 'lucide-react'

interface PersonalRecordsProps {
  isOwnProfile?: boolean
}

const PersonalRecordsManager: React.FC<PersonalRecordsProps> = ({ isOwnProfile = true }) => {
  const { user, addPersonalRecord, updatePersonalRecord } = useUser()
  const { t, currentLanguage } = useLanguage()
  const [showAddModal, setShowAddModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editingRecord, setEditingRecord] = useState<PersonalRecord | null>(null)
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all')
  
  const [newRecord, setNewRecord] = useState<Omit<PersonalRecord, 'id' | 'userId'>>({
    gameId: '',
    gameName: '',
    category: '',
    time: '',
    score: undefined,
    platform: 'N64',
    region: 'PAL',
    achievedDate: new Date(),
    verified: false,
    mediaUrl: '',
    notes: ''
  })

  if (!user) return null

  const filteredRecords = user.personalRecords.filter(record => {
    if (filter === 'verified') return record.verified
    if (filter === 'pending') return !record.verified
    return true
  })

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newRecord.gameName.trim() && newRecord.category.trim() && (newRecord.time || newRecord.score)) {
      const success = await addPersonalRecord({
        ...newRecord,
        gameId: newRecord.gameName.toLowerCase().replace(/\s+/g, '_'),
        score: newRecord.score || undefined
      })
      
      if (success) {
        setShowAddModal(false)
        setNewRecord({
          gameId: '',
          gameName: '',
          category: '',
          time: '',
          score: undefined,
          platform: 'N64',
          region: 'PAL',
          achievedDate: new Date(),
          verified: false,
          mediaUrl: '',
          notes: ''
        })
      }
    }
  }

  const handleVerifyRecord = async (recordId: string, verified: boolean) => {
    await updatePersonalRecord(recordId, { verified })
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    // Handle different time formats
    if (time.includes(':')) {
      return time // Already formatted
    }
    // Convert seconds to MM:SS format if it's just a number
    const seconds = parseFloat(time)
    if (!isNaN(seconds)) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = (seconds % 60).toFixed(3)
      return `${minutes}:${remainingSeconds.padStart(6, '0')}`
    }
    return time
  }

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('speedrun') || category.toLowerCase().includes('time')) {
      return <Clock className="w-4 h-4" />
    }
    if (category.toLowerCase().includes('score') || category.toLowerCase().includes('points')) {
      return <Target className="w-4 h-4" />
    }
    return <Trophy className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            {isOwnProfile ? 'Meine Rekorde' : `${user.username}s Rekorde`}
          </h2>
          <p className="text-slate-400">
            {user.personalRecords.filter(r => r.verified).length} verifizierte Rekorde, {' '}
            {user.personalRecords.filter(r => !r.verified).length} ausstehend
          </p>
        </div>
        
        {isOwnProfile && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('records.add')}
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
          Alle ({user.personalRecords.length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            filter === 'verified'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Verifiziert ({user.personalRecords.filter(r => r.verified).length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            filter === 'pending'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ausstehend ({user.personalRecords.filter(r => !r.verified).length})
        </button>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="simple-tile text-center py-12">
          <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            Keine Rekorde
          </h3>
          <p className="text-slate-400">
            {isOwnProfile 
              ? t('records.addFirst')
              : `${user.username} hat noch keine Rekorde gesetzt.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="simple-tile p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Game and Category */}
                  <div className="flex items-center gap-3 mb-3">
                    {getCategoryIcon(record.category)}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">
                        {record.gameName}
                      </h3>
                      <p className="text-slate-400">{record.category}</p>
                    </div>
                  </div>

                  {/* Platform and Region */}
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                    <Gamepad2 className="w-4 h-4" />
                    <span>{record.platform}</span>
                    <span>•</span>
                    <span>{record.region}</span>
                  </div>

                  {/* Record Value */}
                  <div className="mb-3">
                    {record.time && (
                      <div className="flex items-center gap-2 text-2xl font-bold text-blue-400 mb-1">
                        <Clock className="w-6 h-6" />
                        <span>{formatTime(record.time)}</span>
                      </div>
                    )}
                    {record.score && (
                      <div className="flex items-center gap-2 text-2xl font-bold text-green-400 mb-1">
                        <Target className="w-6 h-6" />
                        <span>{record.score.toLocaleString()} Punkte</span>
                      </div>
                    )}
                  </div>

                  {/* Achievement Date */}
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{t('profile.achievedOn')} {record.achievedDate.toLocaleDateString(getLocaleString(currentLanguage))}</span>
                  </div>

                  {/* Notes */}
                  {record.notes && (
                    <p className="text-sm text-slate-300 italic mb-3">
                      "{record.notes}"
                    </p>
                  )}

                  {/* Media Link */}
                  {record.mediaUrl && (
                    <div className="mb-3">
                      <a
                        href={record.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                      >
                        Beweis ansehen →
                      </a>
                    </div>
                  )}
                </div>

                {/* Verification Status */}
                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    record.verified 
                      ? 'text-green-400 bg-green-400/20' 
                      : 'text-orange-400 bg-orange-400/20'
                  }`}>
                    {record.verified ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Verifiziert
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Ausstehend
                      </>
                    )}
                  </div>

                  {/* Actions for own profile */}
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingRecord(record)}
                        className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                        title={t('common.edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {!record.verified && (
                        <button
                          onClick={() => handleVerifyRecord(record.id, true)}
                          className="p-1 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded transition-colors"
                          title={t('events.verified')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="simple-tile max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              {t('records.addPersonal')}
            </h3>
            
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('label.gameName')} {t('label.required')}
                </label>
                <input
                  type="text"
                  required
                  value={newRecord.gameName}
                  onChange={(e) => setNewRecord({ ...newRecord, gameName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('placeholder.gameName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('label.category')} {t('label.required')}
                </label>
                <input
                  type="text"
                  required
                  value={newRecord.category}
                  onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('placeholder.category')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('label.platform')}
                  </label>
                  <select
                    value={newRecord.platform}
                    onChange={(e) => setNewRecord({ ...newRecord, platform: e.target.value as 'N64' | 'PC' })}
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
                    value={newRecord.region}
                    onChange={(e) => setNewRecord({ ...newRecord, region: e.target.value as 'PAL' | 'NTSC' })}
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
                    {t('records.time')}
                  </label>
                  <input
                    type="text"
                    value={newRecord.time}
                    onChange={(e) => setNewRecord({ ...newRecord, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('placeholder.time')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('records.points')}
                  </label>
                  <input
                    type="number"
                    value={newRecord.score || ''}
                    onChange={(e) => setNewRecord({ ...newRecord, score: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('placeholder.score')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('label.proofUrl')}
                </label>
                <input
                  type="url"
                  value={newRecord.mediaUrl}
                  onChange={(e) => setNewRecord({ ...newRecord, mediaUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('placeholder.proofUrl')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('label.notes')}
                </label>
                <textarea
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder={t('placeholder.recordNotes')}
                />
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
                                      {t('records.addButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonalRecordsManager