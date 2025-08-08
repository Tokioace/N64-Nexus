import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate, Link } from 'react-router-dom'
import { UserRegistrationData } from '../types'
import { User, Mail, Lock, Gamepad2, Globe, Eye, EyeOff, Calendar, AlertCircle } from 'lucide-react'
import PasswordResetModal from '../components/PasswordResetModal'

const AuthPage: React.FC = () => {
  const { login, register, isAuthenticated } = useUser()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Registration form state
  const [registrationData, setRegistrationData] = useState<UserRegistrationData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: 'PAL',
    platform: 'N64',
    birthDate: '',
    termsAccepted: false,
    privacyAccepted: false,
    copyrightAcknowledged: false,
    ageConfirmed: false
  })

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const success = await login(loginData.email, loginData.password)
      if (success) {
        navigate('/')
      } else {
        setError(t('auth.invalidCredentials'))
      }
    } catch {
      setError(t('auth.errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Age verification
    if (!registrationData.birthDate) {
      setError(t('legal.birthDateRequired'))
      setLoading(false)
      return
    }

    const birthDate = new Date(registrationData.birthDate)
    const eighteenYearsAgo = new Date()
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
    
    if (birthDate > eighteenYearsAgo) {
      setError(t('legal.mustBe18'))
      setLoading(false)
      return
    }

    // Legal agreements validation
    if (!registrationData.termsAccepted || !registrationData.privacyAccepted || 
        !registrationData.copyrightAcknowledged || !registrationData.ageConfirmed) {
      setError(t('legal.allAgreementsRequired'))
      setLoading(false)
      return
    }

    // Validation
    if (registrationData.password !== registrationData.confirmPassword) {
      setError(t('auth.passwordsDontMatch'))
      setLoading(false)
      return
    }

    if (registrationData.password.length < 6) {
      setError(t('auth.passwordTooShort'))
      setLoading(false)
      return
    }

    if (registrationData.username.length < 3) {
      setError(t('auth.usernameTooShort'))
      setLoading(false)
      return
    }

    try {
      const success = await register(registrationData)
      if (success) {
        navigate('/')
      } else {
        setError(t('auth.registrationFailed'))
      }
    } catch {
      setError(t('auth.errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="simple-tile p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Battle64</h1>
            <p className="text-slate-400">
              {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('auth.login')}
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('auth.register')}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('placeholder.password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? t('auth.loggingIn') : t('auth.login')}
              </button>

              {/* Passwort vergessen Link */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Passwort vergessen?
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Age Verification Notice */}
              <div className="bg-amber-600/20 border border-amber-600/30 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <p className="text-amber-200 text-sm">
                    {t('legal.adultOnlyPlatform')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('auth.username')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={registrationData.username}
                    onChange={(e) => setRegistrationData({ ...registrationData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('auth.usernamePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
              </div>

              {/* Birth Date for Age Verification */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('legal.birthDate')} *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={registrationData.birthDate}
                    onChange={(e) => setRegistrationData({ ...registrationData, birthDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('auth.platform')}
                  </label>
                  <div className="relative">
                    <Gamepad2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={registrationData.platform}
                      onChange={(e) => setRegistrationData({ ...registrationData, platform: e.target.value as 'N64' | 'PC' })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="N64">N64</option>
                      <option value="PC">PC</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('auth.region')}
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={registrationData.region}
                      onChange={(e) => setRegistrationData({ ...registrationData, region: e.target.value as 'PAL' | 'NTSC' })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="PAL">PAL</option>
                      <option value="NTSC">NTSC</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={registrationData.password}
                    onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('placeholder.password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={registrationData.confirmPassword}
                    onChange={(e) => setRegistrationData({ ...registrationData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('placeholder.password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Legal Agreements Section */}
              <div className="space-y-3 pt-4 border-t border-slate-600">
                <h4 className="text-sm font-medium text-slate-300 mb-2">
                  {t('legal.ageVerification')}
                </h4>
                
                {/* Age Confirmation */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="ageConfirmed"
                    required
                    checked={registrationData.ageConfirmed}
                    onChange={(e) => setRegistrationData({ ...registrationData, ageConfirmed: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="ageConfirmed" className="text-sm text-slate-300">
                    {t('legal.ageConfirmation')}
                  </label>
                </div>

                {/* Terms of Service */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    required
                    checked={registrationData.termsAccepted}
                    onChange={(e) => setRegistrationData({ ...registrationData, termsAccepted: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="termsAccepted" className="text-sm text-slate-300">
                    {t('legal.termsAcceptance')} (
                    <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline">
                      {t('legal.readTerms')}
                    </Link>
                    )
                  </label>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacyAccepted"
                    required
                    checked={registrationData.privacyAccepted}
                    onChange={(e) => setRegistrationData({ ...registrationData, privacyAccepted: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="privacyAccepted" className="text-sm text-slate-300">
                    {t('legal.privacyAcceptance')} (
                    <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                      {t('legal.readPrivacy')}
                    </Link>
                    )
                  </label>
                </div>

                {/* Copyright Acknowledgment */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="copyrightAcknowledged"
                    required
                    checked={registrationData.copyrightAcknowledged}
                    onChange={(e) => setRegistrationData({ ...registrationData, copyrightAcknowledged: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="copyrightAcknowledged" className="text-sm text-slate-300">
                    {t('legal.copyrightAcknowledgment')}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? t('auth.registering') : t('auth.createAccountButton')}
              </button>
            </form>
          )}

          {/* Info Text */}
          <div className="mt-6 text-center text-sm text-slate-400">
            {isLogin ? (
              <p>
                {t('auth.noAccountYet')}{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  {t('auth.registerNow')}
                </button>
              </p>
            ) : (
              <p>
                {t('auth.alreadyHaveAccount')}{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  {t('auth.loginHere')}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Passwort Reset Modal */}
        <PasswordResetModal
          isOpen={showPasswordReset}
          onClose={() => setShowPasswordReset(false)}
        />
      </div>
    </div>
  )
}

export default AuthPage