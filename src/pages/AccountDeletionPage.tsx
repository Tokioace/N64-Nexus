import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate, Link } from 'react-router-dom'
import { AlertTriangle, Trash2, ArrowLeft, Shield, Database, Download } from 'lucide-react'

const AccountDeletionPage: React.FC = () => {
  const { user, deleteAccount } = useUser()
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  const [step, setStep] = useState<'warning' | 'confirmation' | 'processing' | 'success'>('warning')
  const [confirmationText, setConfirmationText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/auth')
    return null
  }

  const handleDataExport = async () => {
    try {
      // In a real implementation, this would trigger a data export
      alert(t('account.dataExportSuccess'))
    } catch (error) {
      console.error('Data export error:', error)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmationText !== t('account.deletion.confirmDelete')) {
      setError(t('account.deletionPage.pleaseTypeDelete'))
      return
    }

    setLoading(true)
    setError('')
    setStep('processing')

    try {
      const success = await deleteAccount()
      
      if (success) {
        setStep('success')
        // Redirect to home page after a delay
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } else {
        setError(t('account.deleteError'))
        setStep('confirmation')
      }
    } catch (err) {
      setError(t('account.deleteError'))
      setStep('confirmation')
    } finally {
      setLoading(false)
    }
  }

  const renderWarningStep = () => (
    <div className="space-y-6">
      <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <h2 className="text-xl font-bold text-red-200">
            {t('account.deletionPage.warning')}
          </h2>
        </div>
        <p className="text-red-100 leading-relaxed">
          {t('account.deleteWarning')}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">
          {t('account.deletionPage.whatWillBeDeleted')}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
            <h4 className="font-medium text-slate-200 mb-2">{t('account.deletionPage.personalData')}</h4>
            <ul className="space-y-1 text-slate-400 text-sm">
              {t('account.deletionPage.personalDataItems').split('|').map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
            <h4 className="font-medium text-slate-200 mb-2">{t('account.deletionPage.contentActivity')}</h4>
            <ul className="space-y-1 text-slate-400 text-sm">
              {t('account.deletionPage.contentActivityItems').split('|').map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Download className="w-5 h-5 text-blue-400" />
          <h4 className="font-medium text-blue-200">{t('account.deletionPage.exportDataFirst')}</h4>
        </div>
        <p className="text-blue-100 text-sm mb-4">
          {t('account.dataExportDescription')}
        </p>
        <button
          onClick={handleDataExport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          {t('account.dataExport')}
        </button>
      </div>

      <div className="flex space-x-4">
        <Link
          to="/profile"
          className="flex-1 py-3 px-4 bg-slate-600 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-center"
        >
          {t('common.cancel')}
        </Link>
        <button
          onClick={() => setStep('confirmation')}
          className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          {t('account.deletionPage.continueWithDeletion')}
        </button>
      </div>
    </div>
  )

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Trash2 className="w-6 h-6 text-red-400 flex-shrink-0" />
          <h2 className="text-xl font-bold text-red-200">
            {t('account.deletionPage.finalConfirmation')}
          </h2>
        </div>
        <p className="text-red-100 leading-relaxed mb-4">
          {t('account.deletionPage.cannotUndo')}
        </p>
        
        <div className="bg-red-700/30 border border-red-600/50 rounded-lg p-4">
          <p className="text-red-100 text-sm font-medium mb-2">
            {t('account.deletionPage.typeDeleteConfirm')}
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={t('account.deletion.confirmDelete')}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => setStep('warning')}
          className="flex-1 py-3 px-4 bg-slate-600 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleDeleteAccount}
          disabled={loading || confirmationText !== 'DELETE'}
          className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {loading ? 'Deleting...' : 'Delete Account Permanently'}
        </button>
      </div>
    </div>
  )

  const renderProcessingStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400"></div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-200 mb-2">
          Deleting Your Account
        </h2>
        <p className="text-slate-400">
          Please wait while we permanently delete your account and all associated data...
        </p>
      </div>
    </div>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-200 mb-2">
          {t('account.deleteSuccess')}
        </h2>
        <p className="text-slate-400 mb-4">
          Your account and all associated data have been scheduled for deletion. You will be redirected to the home page shortly.
        </p>
        <p className="text-slate-500 text-sm">
          Thank you for being part of the Battle64 community.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {step === 'warning' && (
            <Link 
              to="/profile" 
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
          )}
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              {t('account.delete')}
            </h1>
            <p className="text-slate-400">
              GDPR-compliant account deletion
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          <div className="simple-tile p-8">
            {step === 'warning' && renderWarningStep()}
            {step === 'confirmation' && renderConfirmationStep()}
            {step === 'processing' && renderProcessingStep()}
            {step === 'success' && renderSuccessStep()}
          </div>
        </div>

        {/* GDPR Information */}
        {(step === 'warning' || step === 'confirmation') && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="simple-tile p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-200">
                  Your Rights Under GDPR
                </h3>
              </div>
              
              <div className="space-y-3 text-sm text-slate-400">
                <p>
                  <strong className="text-slate-300">Right to Erasure:</strong> You have the right to have your personal data deleted under Article 17 of the GDPR.
                </p>
                <p>
                  <strong className="text-slate-300">Data Retention:</strong> After deletion, your data will be permanently removed from our systems within 30 days.
                </p>
                <p>
                  <strong className="text-slate-300">Backup Removal:</strong> Your data will also be removed from all backups during the next backup cycle.
                </p>
                <p>
                  <strong className="text-slate-300">Legal Obligations:</strong> Some data may be retained if required by law (e.g., financial records for tax purposes).
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-600">
                <p className="text-xs text-slate-500">
                  For questions about data deletion, contact our privacy team at{' '}
                  <a href="mailto:privacy@battle64.com" className="text-blue-400 hover:text-blue-300">
                    privacy@battle64.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountDeletionPage