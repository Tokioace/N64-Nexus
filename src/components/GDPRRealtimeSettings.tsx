import React, { useState, useEffect } from 'react'
import { Settings, Shield, MapPin, Wifi, WifiOff } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'

interface GDPRSettings {
  realtimeEnabled: boolean
  locationEnabled: boolean
  notificationsEnabled: boolean
}

interface GDPRRealtimeSettingsProps {
  onSettingsChange?: (settings: GDPRSettings) => void
  className?: string
}

const GDPRRealtimeSettings: React.FC<GDPRRealtimeSettingsProps> = ({
  onSettingsChange,
  className = ''
}) => {
  const { t } = useLanguage()
  const { user } = useUser()
  const [settings, setSettings] = useState<GDPRSettings>({
    realtimeEnabled: false,
    locationEnabled: false,
    notificationsEnabled: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load user's GDPR settings
  useEffect(() => {
    loadSettings()
  }, [user])

  const loadSettings = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Check localStorage for settings (fallback)
      const storedSettings = localStorage.getItem('gdpr-settings')
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings)
        setSettings(parsed)
      }

      // Load from user profile if available
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        logger.error('Failed to load user profile:', error)
      } else if (profile) {
        // Assume GDPR settings are stored in user profile or metadata
        const gdprSettings = {
          realtimeEnabled: profile.realtime_enabled ?? false,
          locationEnabled: profile.location_enabled ?? false,
          notificationsEnabled: profile.notifications_enabled ?? false
        }
        setSettings(gdprSettings)
      }
    } catch (error) {
      logger.error('Failed to load GDPR settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: keyof GDPRSettings, value: boolean) => {
    setSaving(true)

    try {
      const newSettings = { ...settings, [key]: value }
      setSettings(newSettings)

      // Save to localStorage immediately
      localStorage.setItem('gdpr-settings', JSON.stringify(newSettings))

      // Save to user profile if authenticated
      if (user) {
        const profileUpdate: any = {}
        profileUpdate[`${key.replace('Enabled', '')}_enabled`] = value

        const { error } = await supabase
          .from('profiles')
          .update(profileUpdate)
          .eq('id', user.id)

        if (error) {
          logger.error('Failed to update profile settings:', error)
        }
      }

      // Handle location permission
      if (key === 'locationEnabled' && value) {
        try {
          await requestLocationPermission()
        } catch (error) {
          logger.warn('Location permission denied:', error)
          // Revert setting if permission denied
          const revertedSettings = { ...newSettings, locationEnabled: false }
          setSettings(revertedSettings)
          localStorage.setItem('gdpr-settings', JSON.stringify(revertedSettings))
        }
      }

      // Handle notification permission
      if (key === 'notificationsEnabled' && value) {
        try {
          await requestNotificationPermission()
        } catch (error) {
          logger.warn('Notification permission denied:', error)
          // Revert setting if permission denied
          const revertedSettings = { ...newSettings, notificationsEnabled: false }
          setSettings(revertedSettings)
          localStorage.setItem('gdpr-settings', JSON.stringify(revertedSettings))
        }
      }

      // Notify parent component
      if (onSettingsChange) {
        onSettingsChange(newSettings)
      }

      logger.info('GDPR setting updated:', { key, value })
    } catch (error) {
      logger.error('Failed to update GDPR setting:', error)
    } finally {
      setSaving(false)
    }
  }

  const requestLocationPermission = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          logger.info('Location permission granted:', position.coords)
          resolve()
        },
        (error) => {
          logger.error('Location permission denied:', error)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        }
      )
    })
  }

  const requestNotificationPermission = async (): Promise<void> => {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported')
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      throw new Error('Notification permission denied')
    }
  }

  const SettingToggle: React.FC<{
    title: string
    description: string
    icon: React.ReactNode
    enabled: boolean
    onChange: (enabled: boolean) => void
    disabled?: boolean
  }> = ({ title, description, icon, enabled, onChange, disabled = false }) => (
    <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
      <div className="flex-shrink-0 text-blue-400 mt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-gray-300 mb-3">{description}</p>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled || saving}
            className="sr-only"
          />
          <div className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${enabled ? 'bg-blue-600' : 'bg-gray-600'}
            ${disabled || saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}>
            <span className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${enabled ? 'translate-x-6' : 'translate-x-1'}
            `} />
          </div>
          <span className="ml-3 text-sm text-gray-300">
            {enabled ? t('gdpr.realtime.enable') : t('gdpr.realtime.disable')}
          </span>
        </label>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-20 bg-slate-800/50 rounded-lg"></div>
          <div className="h-20 bg-slate-800/50 rounded-lg"></div>
          <div className="h-20 bg-slate-800/50 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="text-blue-400" size={24} />
        <h3 className="text-lg font-semibold text-white">
          {t('settings.privacy.title')}
        </h3>
      </div>

      <div className="space-y-4">
        <SettingToggle
          title={t('gdpr.realtime.title')}
          description={t('gdpr.realtime.description')}
          icon={settings.realtimeEnabled ? <Wifi size={20} /> : <WifiOff size={20} />}
          enabled={settings.realtimeEnabled}
          onChange={(enabled) => updateSetting('realtimeEnabled', enabled)}
        />

        <SettingToggle
          title={t('gdpr.location.title')}
          description={t('gdpr.location.description')}
          icon={<MapPin size={20} />}
          enabled={settings.locationEnabled}
          onChange={(enabled) => updateSetting('locationEnabled', enabled)}
        />

        <SettingToggle
          title={t('settings.notifications.title')}
          description={t('settings.notifications.description')}
          icon={<Settings size={20} />}
          enabled={settings.notificationsEnabled}
          onChange={(enabled) => updateSetting('notificationsEnabled', enabled)}
        />
      </div>

      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <h4 className="text-sm font-semibold text-yellow-400 mb-1">
              {t('gdpr.notice.title')}
            </h4>
            <p className="text-xs text-yellow-300">
              {t('gdpr.notice.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GDPRRealtimeSettings