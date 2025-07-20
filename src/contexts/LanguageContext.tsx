import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'de' | 'en' | 'fr' | 'it' | 'es' | 'el' | 'tr' | 'zh' | 'ja'

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
    'nav.media': 'Media',
    
    // Home Screen
    'home.subtitle': 'Die N64-Community für Millennials',
    'home.welcome': 'Willkommen zurück',
    'home.quiz.subtitle': 'N64 Wissen',
    'home.events.subtitle': 'Turniere',
    'home.media.subtitle': 'Speedruns',
    'home.collector.subtitle': 'Kollektion',
    'home.forum.subtitle': 'Community',
    'home.profile.subtitle': 'Mein Account',
    'home.leaderboard.subtitle': 'Top Spieler',
    'home.minigames.subtitle': 'Spaß',
    'home.footer.retro': 'Retro neu entfacht',
    'home.footer.n64': 'Für die N64-Generation',
    'home.footer.classic': 'Zur klassischen Ansicht mit News Feed',
    'home.footer.tagline': 'Battle64 - Wo Nostalgie auf Community trifft',
    
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
    'events.noActive': 'Keine aktiven Events',
    'events.viewAll': 'Alle Events anzeigen',
    
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
    'language.french': 'Französisch',
    'language.italian': 'Italienisch',
    'language.spanish': 'Spanisch',
    'language.greek': 'Griechisch',
    'language.turkish': 'Türkisch',
    'language.chinese': 'Chinesisch',
    'language.japanese': 'Japanisch'
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
    'nav.media': 'Media',
    
    // Home Screen
    'home.subtitle': 'The N64 Community for Millennials',
    'home.welcome': 'Welcome back',
    'home.quiz.subtitle': 'N64 Knowledge',
    'home.events.subtitle': 'Tournaments',
    'home.media.subtitle': 'Speedruns',
    'home.collector.subtitle': 'Collection',
    'home.forum.subtitle': 'Community',
    'home.profile.subtitle': 'My Account',
    'home.leaderboard.subtitle': 'Top Players',
    'home.minigames.subtitle': 'Fun',
    'home.footer.retro': 'Retro Reimagined',
    'home.footer.n64': 'For the N64 Generation',
    'home.footer.classic': 'Go to Classic View with News Feed',
    'home.footer.tagline': 'Battle64 - Where Nostalgia Meets Community',
    
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
    'events.noActive': 'No active events',
    'events.viewAll': 'View all events',
    
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
    'language.french': 'French',
    'language.italian': 'Italian',
    'language.spanish': 'Spanish',
    'language.greek': 'Greek',
    'language.turkish': 'Turkish',
    'language.chinese': 'Chinese',
    'language.japanese': 'Japanese'
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
    'nav.media': 'Médias',
    
    // Home Screen
    'home.subtitle': 'La Communauté N64 pour les Millennials',
    'home.welcome': 'Bon retour',
    'home.quiz.subtitle': 'Connaissances N64',
    'home.events.subtitle': 'Tournois',
    'home.media.subtitle': 'Speedruns',
    'home.collector.subtitle': 'Collection',
    'home.forum.subtitle': 'Communauté',
    'home.profile.subtitle': 'Mon Compte',
    'home.leaderboard.subtitle': 'Meilleurs Joueurs',
    'home.minigames.subtitle': 'Amusement',
    'home.footer.retro': 'Rétro Réinventé',
    'home.footer.n64': 'Pour la Génération N64',
    'home.footer.classic': 'Aller à la Vue Classique avec Flux d\'Actualités',
    'home.footer.tagline': 'Battle64 - Où la Nostalgie Rencontre la Communauté',
    
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
    'events.noActive': 'Aucun événement actif',
    'events.viewAll': 'Voir tous les événements',
    
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
    'language.french': 'Français',
    'language.italian': 'Italien',
    'language.spanish': 'Espagnol',
    'language.greek': 'Grec',
    'language.turkish': 'Turc',
    'language.chinese': 'Chinois',
    'language.japanese': 'Japonais'
  },

  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.quiz': 'Quiz',
    'nav.leaderboard': 'Classifica',
    'nav.profile': 'Profilo',
    'nav.minigames': 'Minigiochi',
    'nav.events': 'Eventi',
    'nav.speedrun': 'Speedrun Media',
    'nav.collector': 'Modalità Collezionista',
    'nav.forum': 'Forum',
    'nav.classic': 'Classico',
    'nav.marketplace': 'Mercato',
    'nav.friends': 'Amici',
    'nav.fanart': 'Fanart',
    'nav.news': 'Notizie',
    'nav.media': 'Media',
    
    // Home Screen
    'home.subtitle': 'La Comunità N64 per i Millennials',
    'home.welcome': 'Bentornato',
    'home.quiz.subtitle': 'Conoscenza N64',
    'home.events.subtitle': 'Tornei',
    'home.media.subtitle': 'Speedrun',
    'home.collector.subtitle': 'Collezione',
    'home.forum.subtitle': 'Comunità',
    'home.profile.subtitle': 'Il Mio Account',
    'home.leaderboard.subtitle': 'Migliori Giocatori',
    'home.minigames.subtitle': 'Divertimento',
    'home.footer.retro': 'Retro Reinventato',
    'home.footer.n64': 'Per la Generazione N64',
    'home.footer.classic': 'Alla vista classica con feed notizie',
    'home.footer.tagline': 'Battle64 - Dove la Nostalgia incontra la Comunità',
    
    // Common
    'common.welcome': 'Benvenuto',
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.submit': 'Invia',
    'common.back': 'Indietro',
    'common.next': 'Avanti',
    'common.previous': 'Precedente',
    'common.search': 'Cerca',
    'common.filter': 'Filtro',
    'common.sort': 'Ordina',
    'common.close': 'Chiudi',
    
    // Quiz
    'quiz.title': 'Quiz N64',
    'quiz.start': 'Inizia Quiz',
    'quiz.question': 'Domanda',
    'quiz.score': 'Punteggio',
    'quiz.timeLeft': 'Tempo rimasto',
    'quiz.correct': 'Corretto!',
    'quiz.incorrect': 'Sbagliato!',
    'quiz.finished': 'Quiz completato',
    'quiz.results': 'Risultati',
    
    // Profile
    'profile.title': 'Profilo',
    'profile.username': 'Nome utente',
    'profile.email': 'Email',
    'profile.level': 'Livello',
    'profile.experience': 'Esperienza',
    'profile.achievements': 'Risultati',
    'profile.statistics': 'Statistiche',
    
    // Events
    'events.title': 'Eventi',
    'events.upcoming': 'Eventi in Arrivo',
    'events.active': 'Eventi Attivi',
    'events.completed': 'Eventi Completati',
    'events.participate': 'Partecipa',
    'events.details': 'Dettagli',
    'events.noActive': 'Nessun evento attivo',
    'events.viewAll': 'Vedi tutti gli eventi',
    
    // Forum
    'forum.title': 'Forum della Comunità',
    'forum.categories': 'Categorie',
    'forum.threads': 'Thread',
    'forum.posts': 'Post',
    'forum.newThread': 'Nuovo Thread',
    'forum.reply': 'Rispondi',
    'forum.author': 'Autore',
    'forum.lastPost': 'Ultimo Post',
    
    // Language selector
    'language.german': 'Tedesco',
    'language.english': 'Inglese',
    'language.french': 'Francese',
    'language.italian': 'Italiano',
    'language.spanish': 'Spagnolo',
    'language.greek': 'Greco',
    'language.turkish': 'Turco',
    'language.chinese': 'Cinese',
    'language.japanese': 'Giapponese'
  },

  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.quiz': 'Quiz',
    'nav.leaderboard': 'Clasificación',
    'nav.profile': 'Perfil',
    'nav.minigames': 'Minijuegos',
    'nav.events': 'Eventos',
    'nav.speedrun': 'Speedrun Media',
    'nav.collector': 'Modo Coleccionista',
    'nav.forum': 'Foro',
    'nav.classic': 'Clásico',
    'nav.marketplace': 'Mercado',
    'nav.friends': 'Amigos',
    'nav.fanart': 'Fanart',
    'nav.news': 'Noticias',
    'nav.media': 'Media',
    
    // Home Screen
    'home.subtitle': 'La Comunidad N64 para Millennials',
    'home.welcome': 'Bienvenido de vuelta',
    'home.quiz.subtitle': 'Conocimiento N64',
    'home.events.subtitle': 'Torneos',
    'home.media.subtitle': 'Speedruns',
    'home.collector.subtitle': 'Colección',
    'home.forum.subtitle': 'Comunidad',
    'home.profile.subtitle': 'Mi Cuenta',
    'home.leaderboard.subtitle': 'Mejores Jugadores',
    'home.minigames.subtitle': 'Diversión',
    'home.footer.retro': 'Retro Reinventado',
    'home.footer.n64': 'Para la Generación N64',
    'home.footer.classic': 'A la vista clásica con feed de noticias',
    'home.footer.tagline': 'Battle64 - Donde la Nostalgia se encuentra con la Comunidad',
    
    // Common
    'common.welcome': 'Bienvenido',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.submit': 'Enviar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
    'common.filter': 'Filtro',
    'common.sort': 'Ordenar',
    'common.close': 'Cerrar',
    
    // Quiz
    'quiz.title': 'Quiz N64',
    'quiz.start': 'Iniciar Quiz',
    'quiz.question': 'Pregunta',
    'quiz.score': 'Puntuación',
    'quiz.timeLeft': 'Tiempo restante',
    'quiz.correct': '¡Correcto!',
    'quiz.incorrect': '¡Incorrecto!',
    'quiz.finished': 'Quiz completado',
    'quiz.results': 'Resultados',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.username': 'Nombre de usuario',
    'profile.email': 'Email',
    'profile.level': 'Nivel',
    'profile.experience': 'Experiencia',
    'profile.achievements': 'Logros',
    'profile.statistics': 'Estadísticas',
    
    // Events
    'events.title': 'Eventos',
    'events.upcoming': 'Próximos Eventos',
    'events.active': 'Eventos Activos',
    'events.completed': 'Eventos Completados',
    'events.participate': 'Participar',
    'events.details': 'Detalles',
    'events.noActive': 'No hay eventos activos',
    'events.viewAll': 'Ver todos los eventos',
    
    // Forum
    'forum.title': 'Foro de la Comunidad',
    'forum.categories': 'Categorías',
    'forum.threads': 'Hilos',
    'forum.posts': 'Publicaciones',
    'forum.newThread': 'Nuevo Hilo',
    'forum.reply': 'Responder',
    'forum.author': 'Autor',
    'forum.lastPost': 'Última Publicación',
    
    // Language selector
    'language.german': 'Alemán',
    'language.english': 'Inglés',
    'language.french': 'Francés',
    'language.italian': 'Italiano',
    'language.spanish': 'Español',
    'language.greek': 'Griego',
    'language.turkish': 'Turco',
    'language.chinese': 'Chino',
    'language.japanese': 'Japonés'
  },

  el: {
    // Navigation
    'nav.home': 'Αρχική',
    'nav.quiz': 'Κουίζ',
    'nav.leaderboard': 'Κατάταξη',
    'nav.profile': 'Προφίλ',
    'nav.minigames': 'Μίνι Παιχνίδια',
    'nav.events': 'Εκδηλώσεις',
    'nav.speedrun': 'Speedrun Media',
    'nav.collector': 'Λειτουργία Συλλέκτη',
    'nav.forum': 'Φόρουμ',
    'nav.classic': 'Κλασικό',
    'nav.marketplace': 'Αγορά',
    'nav.friends': 'Φίλοι',
    'nav.fanart': 'Fanart',
    'nav.news': 'Νέα',
    'nav.media': 'Μέσα',
    
    // Home Screen
    'home.subtitle': 'Η Κοινότητα N64 για τους Millennials',
    'home.welcome': 'Καλώς ήρθες πίσω',
    'home.quiz.subtitle': 'Γνώση N64',
    'home.events.subtitle': 'Τουρνουά',
    'home.media.subtitle': 'Speedruns',
    'home.collector.subtitle': 'Συλλογή',
    'home.forum.subtitle': 'Κοινότητα',
    'home.profile.subtitle': 'Ο Λογαριασμός μου',
    'home.leaderboard.subtitle': 'Κορυφαίοι Παίκτες',
    'home.minigames.subtitle': 'Διασκέδαση',
    'home.footer.retro': 'Ρετρό Ανανεωμένο',
    'home.footer.n64': 'Για τη Γενιά N64',
    'home.footer.classic': 'Στην κλασική προβολή με ροή ειδήσεων',
    'home.footer.tagline': 'Battle64 - Όπου η Νοσταλγία συναντά την Κοινότητα',
    
    // Common
    'common.welcome': 'Καλώς ήρθες',
    'common.loading': 'Φόρτωση...',
    'common.error': 'Σφάλμα',
    'common.save': 'Αποθήκευση',
    'common.cancel': 'Ακύρωση',
    'common.delete': 'Διαγραφή',
    'common.edit': 'Επεξεργασία',
    'common.submit': 'Υποβολή',
    'common.back': 'Πίσω',
    'common.next': 'Επόμενο',
    'common.previous': 'Προηγούμενο',
    'common.search': 'Αναζήτηση',
    'common.filter': 'Φίλτρο',
    'common.sort': 'Ταξινόμηση',
    'common.close': 'Κλείσιμο',
    
    // Quiz
    'quiz.title': 'Κουίζ N64',
    'quiz.start': 'Έναρξη Κουίζ',
    'quiz.question': 'Ερώτηση',
    'quiz.score': 'Σκορ',
    'quiz.timeLeft': 'Χρόνος που απομένει',
    'quiz.correct': 'Σωστό!',
    'quiz.incorrect': 'Λάθος!',
    'quiz.finished': 'Το κουίζ ολοκληρώθηκε',
    'quiz.results': 'Αποτελέσματα',
    
    // Profile
    'profile.title': 'Προφίλ',
    'profile.username': 'Όνομα χρήστη',
    'profile.email': 'Email',
    'profile.level': 'Επίπεδο',
    'profile.experience': 'Εμπειρία',
    'profile.achievements': 'Επιτεύγματα',
    'profile.statistics': 'Στατιστικά',
    
    // Events
    'events.title': 'Εκδηλώσεις',
    'events.upcoming': 'Επερχόμενες Εκδηλώσεις',
    'events.active': 'Ενεργές Εκδηλώσεις',
    'events.completed': 'Ολοκληρωμένες Εκδηλώσεις',
    'events.participate': 'Συμμετοχή',
    'events.details': 'Λεπτομέρειες',
    'events.noActive': 'Δεν υπάρχουν ενεργές εκδηλώσεις',
    'events.viewAll': 'Δες όλες τις εκδηλώσεις',
    
    // Forum
    'forum.title': 'Φόρουμ Κοινότητας',
    'forum.categories': 'Κατηγορίες',
    'forum.threads': 'Νήματα',
    'forum.posts': 'Αναρτήσεις',
    'forum.newThread': 'Νέο Νήμα',
    'forum.reply': 'Απάντηση',
    'forum.author': 'Συγγραφέας',
    'forum.lastPost': 'Τελευταία Ανάρτηση',
    
    // Language selector
    'language.german': 'Γερμανικά',
    'language.english': 'Αγγλικά',
    'language.french': 'Γαλλικά',
    'language.italian': 'Ιταλικά',
    'language.spanish': 'Ισπανικά',
    'language.greek': 'Ελληνικά',
    'language.turkish': 'Τουρκικά',
    'language.chinese': 'Κινεζικά',
    'language.japanese': 'Ιαπωνικά'
  },

  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.quiz': 'Quiz',
    'nav.leaderboard': 'Lider Tablosu',
    'nav.profile': 'Profil',
    'nav.minigames': 'Mini Oyunlar',
    'nav.events': 'Etkinlikler',
    'nav.speedrun': 'Speedrun Media',
    'nav.collector': 'Koleksiyoncu Modu',
    'nav.forum': 'Forum',
    'nav.classic': 'Klasik',
    'nav.marketplace': 'Pazar',
    'nav.friends': 'Arkadaşlar',
    'nav.fanart': 'Fanart',
    'nav.news': 'Haberler',
    'nav.media': 'Medya',
    
    // Home Screen
    'home.subtitle': 'Millennials için N64 Topluluğu',
    'home.welcome': 'Tekrar hoş geldin',
    'home.quiz.subtitle': 'N64 Bilgisi',
    'home.events.subtitle': 'Turnuvalar',
    'home.media.subtitle': 'Speedrunlar',
    'home.collector.subtitle': 'Koleksiyon',
    'home.forum.subtitle': 'Topluluk',
    'home.profile.subtitle': 'Hesabım',
    'home.leaderboard.subtitle': 'En İyi Oyuncular',
    'home.minigames.subtitle': 'Eğlence',
    'home.footer.retro': 'Retro Yeniden Keşfedildi',
    'home.footer.n64': 'N64 Nesli İçin',
    'home.footer.classic': 'Haber akışıyla klasik görünüme',
    'home.footer.tagline': 'Battle64 - Nostalji ile Topluluğun Buluştuğu Yer',
    
    // Common
    'common.welcome': 'Hoş geldin',
    'common.loading': 'Yükleniyor...',
    'common.error': 'Hata',
    'common.save': 'Kaydet',
    'common.cancel': 'İptal',
    'common.delete': 'Sil',
    'common.edit': 'Düzenle',
    'common.submit': 'Gönder',
    'common.back': 'Geri',
    'common.next': 'İleri',
    'common.previous': 'Önceki',
    'common.search': 'Ara',
    'common.filter': 'Filtre',
    'common.sort': 'Sırala',
    'common.close': 'Kapat',
    
    // Quiz
    'quiz.title': 'N64 Quiz',
    'quiz.start': 'Quiz Başlat',
    'quiz.question': 'Soru',
    'quiz.score': 'Puan',
    'quiz.timeLeft': 'Kalan süre',
    'quiz.correct': 'Doğru!',
    'quiz.incorrect': 'Yanlış!',
    'quiz.finished': 'Quiz tamamlandı',
    'quiz.results': 'Sonuçlar',
    
    // Profile
    'profile.title': 'Profil',
    'profile.username': 'Kullanıcı adı',
    'profile.email': 'Email',
    'profile.level': 'Seviye',
    'profile.experience': 'Deneyim',
    'profile.achievements': 'Başarılar',
    'profile.statistics': 'İstatistikler',
    
    // Events
    'events.title': 'Etkinlikler',
    'events.upcoming': 'Yaklaşan Etkinlikler',
    'events.active': 'Aktif Etkinlikler',
    'events.completed': 'Tamamlanan Etkinlikler',
    'events.participate': 'Katıl',
    'events.details': 'Detaylar',
    'events.noActive': 'Aktif etkinlik yok',
    'events.viewAll': 'Tüm etkinlikleri görüntüle',
    
    // Forum
    'forum.title': 'Topluluk Forumu',
    'forum.categories': 'Kategoriler',
    'forum.threads': 'Konular',
    'forum.posts': 'Gönderiler',
    'forum.newThread': 'Yeni Konu',
    'forum.reply': 'Yanıtla',
    'forum.author': 'Yazar',
    'forum.lastPost': 'Son Gönderi',
    
    // Language selector
    'language.german': 'Almanca',
    'language.english': 'İngilizce',
    'language.french': 'Fransızca',
    'language.italian': 'İtalyanca',
    'language.spanish': 'İspanyolca',
    'language.greek': 'Yunanca',
    'language.turkish': 'Türkçe',
    'language.chinese': 'Çince',
    'language.japanese': 'Japonca'
  },

  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.quiz': '测验',
    'nav.leaderboard': '排行榜',
    'nav.profile': '个人资料',
    'nav.minigames': '小游戏',
    'nav.events': '活动',
    'nav.speedrun': '速通媒体',
    'nav.collector': '收藏家模式',
    'nav.forum': '论坛',
    'nav.classic': '经典',
    'nav.marketplace': '市场',
    'nav.friends': '朋友',
    'nav.fanart': '粉丝艺术',
    'nav.news': '新闻',
    'nav.media': '媒体',
    
    // Home Screen
    'home.subtitle': '千禧一代的N64社区',
    'home.welcome': '欢迎回来',
    'home.quiz.subtitle': 'N64知识',
    'home.events.subtitle': '锦标赛',
    'home.media.subtitle': '速通',
    'home.collector.subtitle': '收藏',
    'home.forum.subtitle': '社区',
    'home.profile.subtitle': '我的账户',
    'home.leaderboard.subtitle': '顶级玩家',
    'home.minigames.subtitle': '娱乐',
    'home.footer.retro': '复古重塑',
    'home.footer.n64': '为N64一代',
    'home.footer.classic': '经典视图与新闻流',
    'home.footer.tagline': 'Battle64 - 怀旧与社区的交汇点',
    
    // Common
    'common.welcome': '欢迎',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.submit': '提交',
    'common.back': '返回',
    'common.next': '下一个',
    'common.previous': '上一个',
    'common.search': '搜索',
    'common.filter': '过滤',
    'common.sort': '排序',
    'common.close': '关闭',
    
    // Quiz
    'quiz.title': 'N64测验',
    'quiz.start': '开始测验',
    'quiz.question': '问题',
    'quiz.score': '分数',
    'quiz.timeLeft': '剩余时间',
    'quiz.correct': '正确！',
    'quiz.incorrect': '错误！',
    'quiz.finished': '测验完成',
    'quiz.results': '结果',
    
    // Profile
    'profile.title': '个人资料',
    'profile.username': '用户名',
    'profile.email': '邮箱',
    'profile.level': '等级',
    'profile.experience': '经验',
    'profile.achievements': '成就',
    'profile.statistics': '统计',
    
    // Events
    'events.title': '活动',
    'events.upcoming': '即将到来的活动',
    'events.active': '活跃活动',
    'events.completed': '已完成活动',
    'events.participate': '参与',
    'events.details': '详情',
    'events.noActive': '没有活跃的活动',
    'events.viewAll': '查看所有活动',
    
    // Forum
    'forum.title': '社区论坛',
    'forum.categories': '分类',
    'forum.threads': '主题',
    'forum.posts': '帖子',
    'forum.newThread': '新主题',
    'forum.reply': '回复',
    'forum.author': '作者',
    'forum.lastPost': '最后发帖',
    
    // Language selector
    'language.german': '德语',
    'language.english': '英语',
    'language.french': '法语',
    'language.italian': '意大利语',
    'language.spanish': '西班牙语',
    'language.greek': '希腊语',
    'language.turkish': '土耳其语',
    'language.chinese': '中文',
    'language.japanese': '日语'
  },

  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.quiz': 'クイズ',
    'nav.leaderboard': 'リーダーボード',
    'nav.profile': 'プロフィール',
    'nav.minigames': 'ミニゲーム',
    'nav.events': 'イベント',
    'nav.speedrun': 'スピードランメディア',
    'nav.collector': 'コレクターモード',
    'nav.forum': 'フォーラム',
    'nav.classic': 'クラシック',
    'nav.marketplace': 'マーケット',
    'nav.friends': '友達',
    'nav.fanart': 'ファンアート',
    'nav.news': 'ニュース',
    'nav.media': 'メディア',
    
    // Home Screen
    'home.subtitle': 'ミレニアル世代のN64コミュニティ',
    'home.welcome': 'お帰りなさい',
    'home.quiz.subtitle': 'N64知識',
    'home.events.subtitle': 'トーナメント',
    'home.media.subtitle': 'スピードラン',
    'home.collector.subtitle': 'コレクション',
    'home.forum.subtitle': 'コミュニティ',
    'home.profile.subtitle': 'マイアカウント',
    'home.leaderboard.subtitle': 'トッププレイヤー',
    'home.minigames.subtitle': '楽しみ',
    'home.footer.retro': 'レトロ再発明',
    'home.footer.n64': 'N64世代のために',
    'home.footer.classic': 'ニュースフィード付きクラシック表示へ',
    'home.footer.tagline': 'Battle64 - ノスタルジアとコミュニティの出会い',
    
    // Common
    'common.welcome': 'ようこそ',
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.submit': '送信',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.previous': '前へ',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.sort': 'ソート',
    'common.close': '閉じる',
    
    // Quiz
    'quiz.title': 'N64クイズ',
    'quiz.start': 'クイズ開始',
    'quiz.question': '質問',
    'quiz.score': 'スコア',
    'quiz.timeLeft': '残り時間',
    'quiz.correct': '正解！',
    'quiz.incorrect': '不正解！',
    'quiz.finished': 'クイズ完了',
    'quiz.results': '結果',
    
    // Profile
    'profile.title': 'プロフィール',
    'profile.username': 'ユーザー名',
    'profile.email': 'メール',
    'profile.level': 'レベル',
    'profile.experience': '経験値',
    'profile.achievements': '実績',
    'profile.statistics': '統計',
    
    // Events
    'events.title': 'イベント',
    'events.upcoming': '予定イベント',
    'events.active': 'アクティブイベント',
    'events.completed': '完了イベント',
    'events.participate': '参加',
    'events.details': '詳細',
    'events.noActive': 'アクティブなイベントはありません',
    'events.viewAll': 'すべてのイベントを表示',
    
    // Forum
    'forum.title': 'コミュニティフォーラム',
    'forum.categories': 'カテゴリ',
    'forum.threads': 'スレッド',
    'forum.posts': '投稿',
    'forum.newThread': '新しいスレッド',
    'forum.reply': '返信',
    'forum.author': '作者',
    'forum.lastPost': '最後の投稿',
    
    // Language selector
    'language.german': 'ドイツ語',
    'language.english': '英語',
    'language.french': 'フランス語',
    'language.italian': 'イタリア語',
    'language.spanish': 'スペイン語',
    'language.greek': 'ギリシャ語',
    'language.turkish': 'トルコ語',
    'language.chinese': '中国語',
    'language.japanese': '日本語'
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
    if (savedLanguage && ['de', 'en', 'fr', 'it', 'es', 'el', 'tr', 'zh', 'ja'].includes(savedLanguage)) {
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