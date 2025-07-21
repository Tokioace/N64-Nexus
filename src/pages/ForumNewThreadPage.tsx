import React from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const ForumNewThreadPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="simple-tile text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">{t('forum.newThread.title')}</h1>
        <p className="text-slate-400">{t('forum.newThread.createFor', { categoryId: categoryId || '' })}</p>
      </div>
    </div>
  )
}

export default ForumNewThreadPage