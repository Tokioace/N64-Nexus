import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../contexts/LanguageContext'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const EmailConfirmPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')

        if (!token_hash || type !== 'email') {
          setStatus('error')
          setMessage('Ungültiger Bestätigungslink')
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
          setMessage('E-Mail-Bestätigung fehlgeschlagen. Der Link ist möglicherweise abgelaufen.')
          return
        }

        if (data.user) {
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single()

          if (!existingProfile) {
            // Create profile for confirmed user
            const userData = data.user.user_metadata
            
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                username: userData.username || 'User',
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
              setMessage('Fehler beim Erstellen des Profils')
              return
            }
          }

          setStatus('success')
          setMessage('E-Mail erfolgreich bestätigt! Sie werden weitergeleitet...')
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/auth', { 
              state: { 
                message: 'E-Mail bestätigt! Sie können sich jetzt anmelden.',
                showLogin: true 
              }
            })
          }, 3000)
        } else {
          setStatus('error')
          setMessage('E-Mail-Bestätigung fehlgeschlagen')
        }
      } catch (error) {
        console.error('Confirmation error:', error)
        setStatus('error')
        setMessage('Ein unerwarteter Fehler ist aufgetreten')
      }
    }

    handleEmailConfirmation()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                E-Mail wird bestätigt...
              </h1>
              <p className="text-slate-400">
                Bitte warten Sie einen Moment.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                Bestätigung erfolgreich!
              </h1>
              <p className="text-slate-400 mb-4">
                {message}
              </p>
              <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-4">
                <p className="text-green-200 text-sm">
                  Ihr Konto wurde erfolgreich aktiviert. Sie können sich jetzt anmelden.
                </p>
              </div>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-100 mb-2">
                Bestätigung fehlgeschlagen
              </h1>
              <p className="text-slate-400 mb-4">
                {message}
              </p>
              <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4 mb-6">
                <p className="text-red-200 text-sm">
                  Versuchen Sie sich erneut zu registrieren oder kontaktieren Sie den Support.
                </p>
              </div>
              <button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Zur Anmeldung
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmPage