export type Language = 'de' | 'en' | 'fr' | 'it' | 'es' | 'el' | 'tr' | 'zh' | 'ja' | 'ru' | 'pt' | 'hi' | 'ar' | 'ko'

// Import all language files
import de from './de'
import en from './en'
import fr from './fr'
import it from './it'
import es from './es'
import el from './el'
import tr from './tr'
import zh from './zh'
import ja from './ja'
import ru from './ru'
import pt from './pt'
import hi from './hi'
import ar from './ar'
import ko from './ko'

// Export translations object
export const translations = {
  de,
  en,
  fr,
  it,
  es,
  el,
  tr,
  zh,
  ja,
  ru,
  pt,
  hi,
  ar,
  ko
}

export type TranslationKeys = keyof typeof de