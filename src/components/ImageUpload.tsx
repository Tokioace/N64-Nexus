import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { validateImageFile } from '../utils/forumValidation'
import { useLanguage } from '../contexts/LanguageContext'
import { moderationService } from '../services/moderationService'

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
  const { t } = useLanguage()
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError('')

    try {
      if (!file) {
        setError(t('error.invalidFile'))
        return
      }

      console.log('Uploading file:', file.name, file.size + ' bytes', file.type)

      const validation = validateImageFile(file, t)
      if (!validation.isValid) {
        setError(validation.error || t('error.invalidFile'))
        return
      }

      const metaCheck = await moderationService.analyzeImageMetadata(file.name)
      if (metaCheck?.shouldHide) {
        console.warn('Moderation flagged image. Violations:', metaCheck.violations)
        if (import.meta.env?.DEV) {
          console.warn('DEV mode: bypassing moderation block for image upload preview')
        } else {
          setError(t('error.moderationBlocked'))
          return
        }
      }

      const reader = new FileReader()
      reader.onload = () => {
        try {
          const result = reader.result as string
          console.log('Image preview URL generated')
          onImageSelect(result, file)
        } catch (e) {
          console.error('Failed to process image preview', e)
          setError(t('error.imagePreviewFailed'))
        }
      }
      reader.onerror = () => {
        console.error('FileReader encountered an error')
        setError(t('error.uploadFailed'))
      }
      reader.readAsDataURL(file)
    } catch (e) {
      console.error('Unexpected image upload error', e)
      setError(t('error.uploadFailed'))
    }
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
          {t('auth.loginRequiredForImageUpload')}
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
            alt={t('alt.uploadPreview')}
            className="w-full max-w-md h-auto rounded-lg border border-slate-600"
            onError={() => {
              console.warn('Image preview failed to load. Image URL:', currentImage)
              setError(t('imageUpload.noPreview'))
            }}
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
                {dragActive ? t('imageUpload.dropHere') : t('imageUpload.uploadImage')}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {t('imageUpload.clickOrDrag')}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {t('imageUpload.supportedFormats')}
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
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

export default ImageUpload