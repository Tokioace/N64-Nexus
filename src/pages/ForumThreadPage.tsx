import React from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const ForumThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>()
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="simple-tile text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">{t('forum.thread.title')}</h1>
        <p className="text-slate-400">{t('forum.thread.postsWillBeDisplayed', { threadId: threadId || '' })}</p>
      </div>
    </div>
  )
}

export default ForumThreadPage