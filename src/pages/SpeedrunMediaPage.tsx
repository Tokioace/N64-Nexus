import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const SpeedrunMediaPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="container-sm py-responsive">
      <div className="simple-tile text-center">
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-4">{t('nav.speedrun')}</h1>
        <p className="text-responsive-base text-slate-400 max-w-md mx-auto">{t('speedrun.description')}</p>
      </div>
    </div>
  )
}

export default SpeedrunMediaPage