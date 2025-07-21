import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const SpeedrunMediaPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="simple-tile text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">{t('nav.speedrun')}</h1>
        <p className="text-slate-400">{t('speedrun.description')}</p>
      </div>
    </div>
  )
}

export default SpeedrunMediaPage