/**
 * Translation loader utility for Battle64
 * Efficiently loads translations on demand to reduce bundle size
 */

import type { Language } from '../contexts/LanguageContext'

// Translation cache to avoid re-loading
const translationCache = new Map<Language, Record<string, any>>()

// Track which languages are currently being loaded to avoid duplicate requests
const loadingPromises = new Map<Language, Promise<Record<string, any>>>()

/**
 * Dynamically load translation for a specific language
 * Uses caching to avoid re-loading the same language multiple times
 */
export const loadTranslation = async (language: Language): Promise<Record<string, any>> => {
  // Check cache first
  if (translationCache.has(language)) {
    return translationCache.get(language)!
  }

  // Check if already loading
  if (loadingPromises.has(language)) {
    return loadingPromises.get(language)!
  }

  // Create loading promise
  const loadingPromise = loadTranslationInternal(language)
  loadingPromises.set(language, loadingPromise)

  try {
    const translations = await loadingPromise
    // Cache the result
    translationCache.set(language, translations)
    return translations
  } finally {
    // Clean up loading promise
    loadingPromises.delete(language)
  }
}

/**
 * Internal function to actually load the translation
 */
const loadTranslationInternal = async (language: Language): Promise<Record<string, any>> => {
  try {
    let translations: Record<string, any>
    
    switch (language) {
      case 'de':
        translations = (await import('../translations/de')).default
        break
      case 'en':
        translations = (await import('../translations/en')).default
        break
      case 'fr':
        translations = (await import('../translations/fr')).default
        break
      case 'it':
        translations = (await import('../translations/it')).default
        break
      case 'es':
        translations = (await import('../translations/es')).default
        break
      case 'el':
        translations = (await import('../translations/el')).default
        break
      case 'tr':
        translations = (await import('../translations/tr')).default
        break
      case 'zh':
        translations = (await import('../translations/zh')).default
        break
      case 'ja':
        translations = (await import('../translations/ja')).default
        break
      case 'ru':
        translations = (await import('../translations/ru')).default
        break
      case 'pt':
        translations = (await import('../translations/pt')).default
        break
      case 'hi':
        translations = (await import('../translations/hi')).default
        break
      case 'ar':
        translations = (await import('../translations/ar')).default
        break
      case 'ko':
        translations = (await import('../translations/ko')).default
        break
      default:
        console.warn(`Unsupported language: ${language}, falling back to English`)
        translations = (await import('../translations/en')).default
    }
    
    return translations
  } catch (error) {
    console.error(`Failed to load translation for ${language}:`, error)
    
    // Fallback to English
    if (language !== 'en') {
      console.warn(`Falling back to English translations`)
      return loadTranslationInternal('en')
    }
    
    // If even English fails, return empty object
    console.error('Failed to load English translations, using empty fallback')
    return {}
  }
}

/**
 * Preload translations for commonly used languages
 * This can be called to warm up the cache
 */
export const preloadTranslations = async (languages: Language[]): Promise<void> => {
  const preloadPromises = languages.map(lang => {
    if (!translationCache.has(lang) && !loadingPromises.has(lang)) {
      return loadTranslation(lang).catch(error => {
        console.warn(`Failed to preload translation for ${lang}:`, error)
      })
    }
    return Promise.resolve()
  })
  
  await Promise.all(preloadPromises)
}

/**
 * Get cached translation without loading
 * Returns null if not cached
 */
export const getCachedTranslation = (language: Language): Record<string, any> | null => {
  return translationCache.get(language) || null
}

/**
 * Clear translation cache (useful for testing or memory management)
 */
export const clearTranslationCache = (): void => {
  translationCache.clear()
  loadingPromises.clear()
}

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    cachedLanguages: Array.from(translationCache.keys()),
    loadingLanguages: Array.from(loadingPromises.keys()),
    cacheSize: translationCache.size
  }
}