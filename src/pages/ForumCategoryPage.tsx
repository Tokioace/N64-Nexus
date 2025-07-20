import React from 'react'
import { useParams } from 'react-router-dom'

const ForumCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="simple-tile text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">Forum Kategorie</h1>
        <p className="text-slate-400">Kategorie {categoryId} - Threads werden hier angezeigt.</p>
      </div>
    </div>
  )
}

export default ForumCategoryPage