import React, { useState } from 'react'
import { authService } from '../services/authService'
import { useLanguage } from '../contexts/LanguageContext'
import { Mail, X, CheckCircle, AlertCircle } from 'lucide-react'

interface PasswordResetModalProps {
  isOpen: boolean
  onClose: () => void
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  // const { t } = useLanguage() // Keep for future use
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await authService.resetPassword(email)
      
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || t('password.reset.errorUnknown'))
      }
    } catch {
      setError(t('password.reset.errorUnexpected'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setSuccess(false)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="simple-tile p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100">
            {success ? t('password.reset.emailSent') : t('password.reset.title')}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          /* Success State */
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-300 mb-6">
              {t('password.reset.successMessage')}
            </p>
            <p className="text-sm text-slate-400 mb-6">
              {t('password.reset.checkSpam')}
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {t('password.reset.understood')}
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit}>
            <p className="text-slate-300 mb-6 text-sm">
              {t('password.reset.instructions')}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('password.reset.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('password.reset.emailPlaceholder')}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2 bg-slate-600 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? t('password.reset.sending') : t('password.reset.sendButton')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default PasswordResetModal