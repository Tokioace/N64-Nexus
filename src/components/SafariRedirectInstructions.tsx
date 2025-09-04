import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Globe, Copy, CheckCircle } from 'lucide-react'

interface SafariRedirectInstructionsProps {
  targetURL: string
  onClose: () => void
}

const SafariRedirectInstructions: React.FC<SafariRedirectInstructionsProps> = ({ 
  targetURL, 
  onClose 
}) => {
  const { t } = useLanguage()
  const [copied, setCopied] = React.useState(false)

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(targetURL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback: select the text
      const textArea = document.createElement('textarea')
      textArea.value = targetURL
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenInSafari = () => {
    // Try to open in Safari using window.open
    const safariWindow = window.open(targetURL, '_blank')
    
    // If that doesn't work, show instructions
    if (!safariWindow) {
      alert(t('safari.manualInstructions'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-slate-700">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-100 mb-2">
            {t('safari.redirectTitle')}
          </h2>
          
          <p className="text-slate-300 text-sm">
            {t('safari.redirectMessage')}
          </p>
        </div>

        <div className="space-y-4">
          {/* Option 1: Direct Safari Link */}
          <button
            onClick={handleOpenInSafari}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Globe className="w-5 h-5" />
            {t('safari.openInSafari')}
          </button>

          {/* Option 2: Copy URL */}
          <button
            onClick={handleCopyURL}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                {t('safari.copied')}
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                {t('safari.copyURL')}
              </>
            )}
          </button>

          {/* Manual Instructions */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-slate-200 font-medium mb-2">
              {t('safari.manualStepsTitle')}
            </h3>
            <ol className="text-slate-300 text-sm space-y-1">
              <li>1. {t('safari.step1')}</li>
              <li>2. {t('safari.step2')}</li>
              <li>3. {t('safari.step3')}</li>
            </ol>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-slate-600 hover:bg-slate-500 text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SafariRedirectInstructions