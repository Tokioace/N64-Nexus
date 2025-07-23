import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { validateImageFile } from '../utils/forumValidation'

interface ImageUploadProps {
  onImageSelect: (imageUrl: string, file: File) => void
  onImageRemove: () => void
  currentImage?: string
  disabled?: boolean
  isAuthenticated: boolean
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageRemove,
  currentImage,
  disabled = false,
  isAuthenticated,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    setError('')
    
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'Ungültige Datei')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      onImageSelect(reader.result as string, file)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    if (disabled || !isAuthenticated) return
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && isAuthenticated) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleClick = () => {
    if (disabled || !isAuthenticated) return
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    setError('')
    onImageRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!isAuthenticated) {
    return (
      <div className={`p-4 border-2 border-dashed border-slate-600 rounded-lg text-center ${className}`}>
        <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">
          Du musst angemeldet sein, um Bilder hochzuladen
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Upload preview"
            className="w-full max-w-md h-auto rounded-lg border border-slate-600"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`
            p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${dragActive && !disabled
              ? 'border-blue-400 bg-blue-900/20'
              : 'border-slate-600 hover:border-slate-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-slate-700 rounded-full">
              {dragActive ? (
                <Upload className="w-6 h-6 text-blue-400" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-slate-200 font-medium">
                {dragActive ? 'Bild hier ablegen' : 'Bild hochladen'}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Klicken oder Drag & Drop
              </p>
              <p className="text-slate-500 text-xs mt-1">
                JPEG, PNG, GIF, WebP (max. 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-600 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

export default ImageUpload