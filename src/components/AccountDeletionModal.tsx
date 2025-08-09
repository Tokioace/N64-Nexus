import React, { useState } from 'react'
import { authService } from '../services/authService'
import { useLanguage } from '../contexts/LanguageContext'
import { AlertTriangle, X, Trash2 } from 'lucide-react'

interface AccountDeletionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const AccountDeletionModal: React.FC<AccountDeletionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    if (confirmText !== t('account.deletion.confirmDelete')) {
      setError(t('account.deletion.errorConfirmText'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await authService.deleteAccount()
      
      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || t('account.deletion.errorGeneric'))
      }
    } catch {
      setError(t('account.deletion.errorUnexpected'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setConfirmText('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="simple-tile p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-red-600 rounded-full mr-3">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              {t('account.deletion.title')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-red-400 text-sm">
              <p className="font-medium mb-2">{t('account.deletion.warning')}</p>
              <p>{t('account.deletion.dataWillBeDeleted')}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{t('account.deletion.profileData')}</li>
                <li>{t('account.deletion.gameCollection')}</li>
                <li>{t('account.deletion.recordsAchievements')}</li>
                <li>{t('account.deletion.forumPosts')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* DSGVO Information */}
        <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4 mb-6">
          <p className="text-blue-400 text-sm">
            <strong>{t('account.deletion.gdprNotice')}:</strong> {t('account.deletion.gdprText')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {t('account.deletion.typeDelete')}
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder={t('account.deletion.confirmDelete')}
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 bg-slate-600 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== 'LÖSCHEN'}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              'Wird gelöscht...'
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Konto löschen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountDeletionModal