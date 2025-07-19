import React from 'react'
import { useNavigate } from 'react-router-dom'
import N64CameraCreator from '../components/N64CameraCreator'
import { useUser } from '../contexts/UserContext'

const N64CameraCreatorPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useUser()

  const handleSave = (imageData: string) => {
    // Save the processed image as the user's profile picture
    if (user) {
      updateUser({
        ...user,
        profileImage: imageData
      })
    }
    navigate('/profile') // Navigate back to profile after saving
  }

  const handleCancel = () => {
    navigate(-1) // Go back to previous page
  }

  return (
    <N64CameraCreator
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}

export default N64CameraCreatorPage