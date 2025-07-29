// Forum validation utilities

export const validateThreadTitle = (title: string, t: (key: string) => string): { isValid: boolean; error?: string } => {
  if (!title.trim()) {
    return { isValid: false, error: t('validation.titleRequired') }
  }
  
  if (title.length > 100) {
    return { isValid: false, error: t('validation.titleTooLong') }
  }
  
  if (title.length < 5) {
    return { isValid: false, error: t('validation.titleTooShort') }
  }
  
  return { isValid: true }
}

export const validatePostContent = (content: string, t: (key: string) => string): { isValid: boolean; error?: string } => {
  if (!content.trim()) {
    return { isValid: false, error: t('validation.contentRequired') }
  }
  
  if (content.length > 2000) {
    return { isValid: false, error: t('validation.contentTooLong') }
  }
  
  if (content.length < 10) {
    return { isValid: false, error: t('validation.contentTooShort') }
  }
  
  return { isValid: true }
}

export const validateImageFile = (file: File, t: (key: any) => string): { isValid: boolean; error?: string } => {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: t('validation.imageTooLarge') }
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: t('validation.imageFilesOnly') }
  }
  
  // Check for supported formats
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!supportedTypes.includes(file.type)) {
    return { isValid: false, error: t('validation.supportedFormats') }
  }
  
  return { isValid: true }
}

export const sanitizeContent = (content: string): string => {
  // Basic content sanitization
  return content
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines to 2
}

export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'vor wenigen Sekunden'
  if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `vor ${Math.floor(diffInSeconds / 86400)}d`
  
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}