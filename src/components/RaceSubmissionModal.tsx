import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { isValidTimeFormat } from '../utils/timeUtils'
import { 
  X, 
  Camera, 
  Video, 
  Radio, 
  Upload, 
  Clock, 
  Trophy,
  AlertCircle,
  Check
} from 'lucide-react'

interface RaceSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventTitle: string
  onSubmit: (data: RaceSubmissionData) => Promise<boolean>
}

export interface RaceSubmissionData {
  eventId: string
  time: string
  documentationType: 'photo' | 'video' | 'livestream'
  mediaFile?: File
  livestreamUrl?: string
  notes?: string
}

type DocumentationType = 'photo' | 'video' | 'livestream'

const RaceSubmissionModal: React.FC<RaceSubmissionModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onSubmit
}) => {
  const { t } = useLanguage()
  const [documentationType, setDocumentationType] = useState<DocumentationType>('photo')
  const [raceTime, setRaceTime] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [livestreamUrl, setLivestreamUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError(t('events.fileTooBig'))
        return
      }
      
      // Validate file type
      const allowedTypes = documentationType === 'photo' 
        ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        : ['video/mp4', 'video/webm', 'video/avi', 'video/mov']
      
      if (!allowedTypes.includes(file.type)) {
        setError(t('events.invalidFileType'))
        return
      }
      
      setMediaFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!raceTime.trim()) {
      setError(t('events.timeRequired'))
      return
    }
    
    // For livestream, URL is required
    if (documentationType === 'livestream' && !livestreamUrl.trim()) {
      setError(t('events.livestreamUrlRequired'))
      return
    }
    
    // Validate time format (MM:SS.mmm)
    if (!isValidTimeFormat(raceTime)) {
      setError(t('events.invalidTimeFormat'))
      return
    }

    setIsSubmitting(true)
    
    try {
      const submissionData: RaceSubmissionData = {
        eventId,
        time: raceTime,
        documentationType,
        mediaFile: mediaFile || undefined,
        livestreamUrl: livestreamUrl || undefined,
        notes: notes || undefined
      }
      
      console.log('Submitting race time:', submissionData)
      const success = await onSubmit(submissionData)
      console.log('Submission result:', success)
      
      if (success) {
        // Reset form
        setRaceTime('')
        setMediaFile(null)
        setLivestreamUrl('')
        setNotes('')
        setDocumentationType('photo')
        onClose()
      } else {
        setError(t('events.uploadError'))
      }
    } catch (err) {
      console.error('Submission error:', err)
              setError(t('error.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const documentationOptions = [
    {
      type: 'photo' as DocumentationType,
      icon: Camera,
      title: 'Screenshot',
      description: 'Lade einen Screenshot deiner Endzeit hoch',
      acceptedFiles: 'image/jpeg,image/png,image/gif,image/webp'
    },
    {
      type: 'video' as DocumentationType,
      icon: Video,
      title: 'Video',
      description: 'Lade ein Video deines Rennens hoch',
      acceptedFiles: 'video/mp4,video/webm,video/avi,video/mov'
    },
    {
      type: 'livestream' as DocumentationType,
      icon: Radio,
      title: 'Livestream',
      description: t('events.livestreamSubmissionDesc'),
      acceptedFiles: ''
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center">
              <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
              {t('events.raceSubmission')}
            </h2>
            <p className="text-slate-400 mt-1">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Race Time Input */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              {t('events.raceTime')}
            </label>
            <input
              type="text"
              value={raceTime}
              onChange={(e) => setRaceTime(e.target.value)}
              placeholder="1:32.456"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg 
                       text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400
                       focus:ring-1 focus:ring-blue-400"
            />
            <p className="text-xs text-slate-400 mt-1">
              {t('events.timeFormat')}
            </p>
          </div>

          {/* Documentation Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-3">
              {t('events.selectDocumentation')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {documentationOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => {
                    setDocumentationType(option.type)
                    setMediaFile(null)
                    setLivestreamUrl('')
                    setError('')
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    documentationType === option.type
                      ? 'border-blue-400 bg-blue-400/10'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <option.icon className={`w-6 h-6 mb-2 ${
                    documentationType === option.type ? 'text-blue-400' : 'text-slate-400'
                  }`} />
                  <h3 className="font-medium text-slate-100 mb-1">{option.title}</h3>
                  <p className="text-xs text-slate-400">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload for Photo/Video */}
          {documentationType !== 'livestream' && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                                      {documentationType === 'photo' ? t('events.photo') : t('events.video')}
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={documentationOptions.find(opt => opt.type === documentationType)?.acceptedFiles}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg 
                           text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-full 
                           file:border-0 file:text-sm file:font-medium file:bg-blue-600 
                           file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                />
              </div>
              {mediaFile && (
                <div className="mt-2 flex items-center text-sm text-green-400">
                  <Check className="w-4 h-4 mr-1" />
                  {mediaFile.name} ({(mediaFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {!mediaFile && (
                <p className="text-xs text-slate-400 mt-1">
                  Du kannst deine Zeit auch ohne Datei einreichen. Ein Screenshot oder Video hilft aber bei der Verifizierung.
                </p>
              )}
            </div>
          )}

          {/* Livestream URL for Livestream option */}
          {documentationType === 'livestream' && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                <Radio className="w-4 h-4 inline mr-2" />
                {t('events.livestreamUrlLabel')}
              </label>
              <input
                type="url"
                value={livestreamUrl}
                onChange={(e) => setLivestreamUrl(e.target.value)}
                placeholder="https://twitch.tv/dein-kanal oder https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg 
                         text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400
                         focus:ring-1 focus:ring-blue-400"
              />
              <p className="text-xs text-slate-400 mt-1">
                {t('events.streamingPlatforms')}
              </p>
            </div>
          )}

          {/* Optional Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Zusätzliche Notizen (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
                              placeholder={t('placeholder.setupController')}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg 
                       text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400
                       focus:ring-1 focus:ring-blue-400 resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 
                       font-medium rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white 
                       font-medium rounded-lg transition-colors disabled:opacity-50 
                       disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  {t('common.loading')}
                </>
              ) : (
                t('events.submitTime')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RaceSubmissionModal