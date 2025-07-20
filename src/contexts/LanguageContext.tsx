import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'de' | 'en' | 'fr'

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

// Translation keys and values
const translations = {
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.quiz': 'Quiz',
    'nav.leaderboard': 'Bestenliste',
    'nav.profile': 'Profil',
    'nav.minigames': 'Minispiele',
    'nav.events': 'Events',
    'nav.speedrun': 'Speedrun Media',
    'nav.collector': 'Sammler Modus',
    'nav.forum': 'Forum',
    'nav.classic': 'Klassisch',
    'nav.marketplace': 'Marktplatz',
    'nav.friends': 'Freunde',
    'nav.fanart': 'Fanart',
    'nav.news': 'News',
    
    // Common
    'common.welcome': 'Willkommen',
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.submit': 'Absenden',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Vorherige',
    'common.search': 'Suchen',
    'common.filter': 'Filter',
    'common.sort': 'Sortieren',
    'common.close': 'Schließen',
    
    // Quiz
    'quiz.title': 'N64 Quiz',
    'quiz.start': 'Quiz starten',
    'quiz.question': 'Frage',
    'quiz.score': 'Punkte',
    'quiz.timeLeft': 'Zeit übrig',
    'quiz.correct': 'Richtig!',
    'quiz.incorrect': 'Falsch!',
    'quiz.finished': 'Quiz beendet',
    'quiz.results': 'Ergebnisse',
    
    // Profile
    'profile.title': 'Profil',
    'profile.username': 'Benutzername',
    'profile.email': 'E-Mail',
    'profile.level': 'Level',
    'profile.experience': 'Erfahrung',
    'profile.achievements': 'Erfolge',
    'profile.statistics': 'Statistiken',
    
    // Events
    'events.title': 'Events',
    'events.upcoming': 'Kommende Events',
    'events.active': 'Aktive Events',
    'events.completed': 'Abgeschlossene Events',
    'events.participate': 'Teilnehmen',
    'events.details': 'Details',
    
    // Forum
    'forum.title': 'Community Forum',
    'forum.categories': 'Kategorien',
    'forum.threads': 'Threads',
    'forum.posts': 'Beiträge',
    'forum.newThread': 'Neuer Thread',
    'forum.reply': 'Antworten',
    'forum.author': 'Autor',
    'forum.lastPost': 'Letzter Beitrag',
    
    // Language selector
    'language.german': 'Deutsch',
    'language.english': 'Englisch',
    'language.french': 'Französisch'
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.quiz': 'Quiz',
    'nav.leaderboard': 'Leaderboard',
    'nav.profile': 'Profile',
    'nav.minigames': 'Minigames',
    'nav.events': 'Events',
    'nav.speedrun': 'Speedrun Media',
    'nav.collector': 'Collector Mode',
    'nav.forum': 'Forum',
    'nav.classic': 'Classic',
    'nav.marketplace': 'Marketplace',
    'nav.friends': 'Friends',
    'nav.fanart': 'Fan Art',
    'nav.news': 'News',
    
    // Common
    'common.welcome': 'Welcome',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.close': 'Close',
    
    // Quiz
    'quiz.title': 'N64 Quiz',
    'quiz.start': 'Start Quiz',
    'quiz.question': 'Question',
    'quiz.score': 'Score',
    'quiz.timeLeft': 'Time Left',
    'quiz.correct': 'Correct!',
    'quiz.incorrect': 'Incorrect!',
    'quiz.finished': 'Quiz Finished',
    'quiz.results': 'Results',
    
    // Profile
    'profile.title': 'Profile',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.level': 'Level',
    'profile.experience': 'Experience',
    'profile.achievements': 'Achievements',
    'profile.statistics': 'Statistics',
    
    // Events
    'events.title': 'Events',
    'events.upcoming': 'Upcoming Events',
    'events.active': 'Active Events',
    'events.completed': 'Completed Events',
    'events.participate': 'Participate',
    'events.details': 'Details',
    
    // Forum
    'forum.title': 'Community Forum',
    'forum.categories': 'Categories',
    'forum.threads': 'Threads',
    'forum.posts': 'Posts',
    'forum.newThread': 'New Thread',
    'forum.reply': 'Reply',
    'forum.author': 'Author',
    'forum.lastPost': 'Last Post',
    
    // Language selector
    'language.german': 'German',
    'language.english': 'English',
    'language.french': 'French'
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.quiz': 'Quiz',
    'nav.leaderboard': 'Classement',
    'nav.profile': 'Profil',
    'nav.minigames': 'Mini-jeux',
    'nav.events': 'Événements',
    'nav.speedrun': 'Speedrun Media',
    'nav.collector': 'Mode Collectionneur',
    'nav.forum': 'Forum',
    'nav.classic': 'Classique',
    'nav.marketplace': 'Place de Marché',
    'nav.friends': 'Amis',
    'nav.fanart': 'Art de Fan',
    'nav.news': 'Actualités',
    
    // Common
    'common.welcome': 'Bienvenue',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.submit': 'Soumettre',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.close': 'Fermer',
    
    // Quiz
    'quiz.title': 'Quiz N64',
    'quiz.start': 'Commencer le Quiz',
    'quiz.question': 'Question',
    'quiz.score': 'Score',
    'quiz.timeLeft': 'Temps Restant',
    'quiz.correct': 'Correct !',
    'quiz.incorrect': 'Incorrect !',
    'quiz.finished': 'Quiz Terminé',
    'quiz.results': 'Résultats',
    
    // Profile
    'profile.title': 'Profil',
    'profile.username': "Nom d'utilisateur",
    'profile.email': 'Email',
    'profile.level': 'Niveau',
    'profile.experience': 'Expérience',
    'profile.achievements': 'Succès',
    'profile.statistics': 'Statistiques',
    
    // Events
    'events.title': 'Événements',
    'events.upcoming': 'Événements à Venir',
    'events.active': 'Événements Actifs',
    'events.completed': 'Événements Terminés',
    'events.participate': 'Participer',
    'events.details': 'Détails',
    
    // Forum
    'forum.title': 'Forum Communautaire',
    'forum.categories': 'Catégories',
    'forum.threads': 'Fils',
    'forum.posts': 'Messages',
    'forum.newThread': 'Nouveau Fil',
    'forum.reply': 'Répondre',
    'forum.author': 'Auteur',
    'forum.lastPost': 'Dernier Message',
    
    // Language selector
    'language.german': 'Allemand',
    'language.english': 'Anglais',
    'language.french': 'Français'
  }
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('de')

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    // Store language preference in localStorage
    localStorage.setItem('n64-nexus-language', language)
  }

  // Translation function
  const t = (key: string): string => {
    const translation = translations[currentLanguage][key as keyof typeof translations['de']]
    return translation || key
  }

  // Initialize language from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('n64-nexus-language') as Language
    if (savedLanguage && ['de', 'en', 'fr'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}