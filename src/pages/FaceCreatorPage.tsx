import React from 'react'
import { useNavigate } from 'react-router-dom'
import FaceCreator from '../components/FaceCreator'
import { useFace } from '../contexts/FaceContext'
import { FaceData } from '../types'

const FaceCreatorPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentFace, saveFace } = useFace()

  const handleSave = (faceData: Omit<FaceData, 'id' | 'createdAt' | 'updatedAt'>) => {
    saveFace(faceData)
    navigate('/profile') // Navigate back to profile after saving
  }

  const handleCancel = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <FaceCreator
      initialFace={currentFace || undefined}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}

export default FaceCreatorPage