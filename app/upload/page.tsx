'use client'

import React, { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  X, 
  Palette, 
  Camera, 
  Gamepad2, 
  Tag, 
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const games = [
  { id: 'mario-kart-64', name: 'Mario Kart 64', slug: 'mario-kart-64' },
  { id: 'super-mario-64', name: 'Super Mario 64', slug: 'super-mario-64' },
  { id: 'zelda-oot', name: 'The Legend of Zelda: Ocarina of Time', slug: 'zelda-oot' },
  { id: 'zelda-mm', name: 'The Legend of Zelda: Majora\'s Mask', slug: 'zelda-mm' },
  { id: 'goldeneye', name: 'GoldenEye 007', slug: 'goldeneye' },
  { id: 'perfect-dark', name: 'Perfect Dark', slug: 'perfect-dark' },
  { id: 'banjo-kazooie', name: 'Banjo-Kazooie', slug: 'banjo-kazooie' },
  { id: 'donkey-kong-64', name: 'Donkey Kong 64', slug: 'donkey-kong-64' },
  { id: 'star-fox-64', name: 'Star Fox 64', slug: 'star-fox-64' },
  { id: 'f-zero-x', name: 'F-Zero X', slug: 'f-zero-x' },
]

export default function UploadPage() {
  const searchParams = useSearchParams()
  const uploadType = searchParams.get('type') || 'fanart'
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameId: '',
    tags: '',
    tools: '',
    platform: 'N64',
    region: 'NTSC',
    isNSFW: false
  })
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG)')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      toast.success('File uploaded successfully!')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!uploadedFile) {
      toast.error('Please upload an image first')
      return
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    
    if (!formData.gameId) {
      toast.error('Please select a game')
      return
    }
    
    setIsUploading(true)
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`${uploadType === 'fanart' ? 'Fanart' : 'Screenshot'} uploaded successfully!`)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        gameId: '',
        tags: '',
        tools: '',
        platform: 'N64',
        region: 'NTSC',
        isNSFW: false
      })
      setUploadedFile(null)
      setPreviewUrl(null)
      
    } catch (error) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold glow-text mb-4"
          >
            Upload {uploadType === 'fanart' ? 'Fanart' : 'Screenshot'}
          </motion.h1>
          <p className="text-gray-400">
            Share your {uploadType === 'fanart' ? 'creative artwork' : 'gaming moments'} with the Battle64 community
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="retro-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload Type Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-700 rounded-lg p-1 flex">
                <button
                  type="button"
                  onClick={() => window.location.href = '/upload?type=fanart'}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    uploadType === 'fanart' 
                      ? 'bg-retro-purple text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  <span>Fanart</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = '/upload?type=screenshot'}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    uploadType === 'screenshot' 
                      ? 'bg-retro-purple text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>Screenshot</span>
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Image
              </label>
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-retro-purple bg-retro-purple/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-300 mb-2">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to select (JPG, PNG, max 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={previewUrl!} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="retro-input w-full"
                placeholder={`Enter a title for your ${uploadType}`}
                required
              />
            </div>

            {/* Game Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Game *
              </label>
              <select
                name="gameId"
                value={formData.gameId}
                onChange={handleInputChange}
                className="retro-input w-full"
                required
              >
                <option value="">Select a game</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="retro-input w-full"
                placeholder={`Tell us about your ${uploadType}...`}
              />
            </div>

            {/* Conditional Fields */}
            {uploadType === 'fanart' ? (
              <>
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="retro-input w-full"
                    placeholder="Enter tags separated by commas (e.g., mario, kart, rainbow road)"
                  />
                </div>

                {/* Tools Used */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tools Used
                  </label>
                  <input
                    type="text"
                    name="tools"
                    value={formData.tools}
                    onChange={handleInputChange}
                    className="retro-input w-full"
                    placeholder="e.g., Photoshop, Procreate, Traditional"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Platform
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="retro-input w-full"
                  >
                    <option value="N64">Nintendo 64</option>
                    <option value="SNES">Super Nintendo</option>
                    <option value="NES">Nintendo Entertainment System</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="retro-input w-full"
                  >
                    <option value="NTSC">NTSC</option>
                    <option value="PAL">PAL</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* NSFW Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isNSFW"
                checked={formData.isNSFW}
                onChange={handleInputChange}
                className="rounded border-gray-600 bg-gray-800 text-retro-purple focus:ring-retro-purple"
              />
              <label className="text-sm text-gray-300">
                Mark as NSFW content
              </label>
            </div>

            {/* Guidelines */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-gray-300 mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                Upload Guidelines
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• No ROM content or direct game assets</li>
                <li>• No offensive, violent, or inappropriate content</li>
                <li>• Respect copyright and intellectual property</li>
                <li>• {uploadType === 'fanart' ? 'Original artwork only' : 'Your own screenshots only'}</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || !uploadedFile}
              className="retro-button w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload {uploadType === 'fanart' ? 'Fanart' : 'Screenshot'}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}