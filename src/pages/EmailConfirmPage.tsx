import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { CheckCircle, XCircle, Loader2, Gamepad2 } from 'lucide-react'

/**
 * DEPRECATED: This page is now primarily handled by HomePage.tsx
 * Email confirmation now redirects to "/?registration=success" for better UX
 * This page remains as fallback for any legacy email links
 */

const EmailConfirmPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (!token_hash || type !== 'email') {
          setStatus('error')
          setMessage(t('auth.invalidConfirmationLink'))
          return
        }

        // Verify the email confirmation token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email'
        })

        if (error) {
          console.error('Email confirmation error:', error)
          setStatus('error')
          setMessage(t('auth.confirmationLinkExpired'))
          return
        }

        if (data.user) {
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('id', data.user.id)
            .single()

          let userUsername = 'User'

          if (!existingProfile) {
            // Create profile for confirmed user
            const userData = data.user.user_metadata
            userUsername = userData.username || 'User'
            
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                username: userUsername,
                level: 1,
                xp: 0,
                region: userData.region || 'PAL',
                platform: userData.platform || 'N64',
                birth_date: userData.birth_date,
                terms_accepted: userData.terms_accepted || false,
                privacy_accepted: userData.privacy_accepted || false,
                copyright_acknowledged: userData.copyright_acknowledged || false,
                avatar: '🎮',
                bio: '',
                location: '',
                is_public: true
              })

            if (profileError) {
              console.error('Profile creation error:', profileError)
              setStatus('error')
              setMessage(t('auth.unexpectedError'))
              return
            }
          } else {
            userUsername = existingProfile.username
          }

          setUsername(userUsername)
          setStatus('success')
          setMessage(t('auth.emailConfirmedSuccessfully'))
          
          // Redirect to home page after 4 seconds
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 4000)
        } else {
          setStatus('error')
          setMessage(t('auth.emailConfirmationFailed'))
        }
      } catch (error) {
        console.error('Confirmation error:', error)
        setStatus('error')
        setMessage(t('auth.unexpectedError'))
      }
    }

    handleEmailConfirmation()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-700">
        <div className="mb-6">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                {t('auth.emailBeingConfirmed')}
              </h1>
              <p className="text-slate-400">
                {t('auth.pleaseWaitMoment')}
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                {t('auth.registrationSucceeded')}
              </h1>
              <h2 className="text-xl text-blue-400 mb-4">
                {t('auth.welcomeToCommunity')}, <span className="font-bold">{username}</span>!
              </h2>
              <p className="text-slate-300 mb-6">
                {message}
              </p>
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-600/30 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-center mb-3">
                  <Gamepad2 className="w-6 h-6 text-green-400 mr-2" />
                  <p className="text-green-200 font-medium">
                    {t('auth.accountActivatedSuccessfully')}
                  </p>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  {t('auth.checkOutEvents')} {t('auth.joinCommunityMessage')}
                </p>
                <button
                  onClick={() => navigate('/events')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {t('auth.exploreEvents')}
                </button>
              </div>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                {t('auth.confirmationFailed')}
              </h1>
              <p className="text-slate-400 mb-4">
                {message}
              </p>
              <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 mb-6">
                <p className="text-red-200 text-sm">
                  {t('auth.tryRegisterAgain')}
                </p>
              </div>
              <button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {t('auth.goToLogin')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmPage