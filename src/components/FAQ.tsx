import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  icon: string
  tags: string[]
}

const faqData: FAQItem[] = [
  // Erste Schritte
  {
    id: 'getting-started-1',
    question: 'Wie nehme ich an einem Event teil?',
    answer: 'Wähle ein Event aus dem Eventkalender aus, klicke auf "Teilnehmen" und folge den Anweisungen. Du musst deinen Speedrun innerhalb des Zeitrahmens einreichen und dokumentieren.',
    category: 'Erste Schritte',
    icon: '✨',
    tags: ['event', 'teilnahme', 'speedrun', 'anleitung']
  },
  {
    id: 'getting-started-2',
    question: 'Wie erstelle ich meinen ersten Speedrun?',
    answer: 'Starte das Spiel, beginne die Zeitnahme, spiele durch und stoppe die Zeit am Ende. Mache Screenshots oder Videos als Beweis und lade sie hoch.',
    category: 'Erste Schritte',
    icon: '✨',
    tags: ['speedrun', 'erstellen', 'zeitnahme', 'beweis']
  },
  {
    id: 'getting-started-3',
    question: 'Was sind XP und wie verdiene ich sie?',
    answer: 'XP (Erfahrungspunkte) verdienst du durch Teilnahme an Events, Einreichung von Fanart und aktive Community-Beteiligung. Sie bestimmen dein Level und öffnen neue Features.',
    category: 'Erste Schritte',
    icon: '✨',
    tags: ['xp', 'level', 'erfahrung', 'belohnungen']
  },

  // Technische Fragen
  {
    id: 'technical-1',
    question: 'Wie lade ich einen Screenshot hoch?',
    answer: 'Gehe zu "Meine Einreichungen" → "Neue Einreichung" → Wähle "Screenshot" → Klicke auf "Datei auswählen" → Wähle dein Bild aus → Klicke "Hochladen".',
    category: 'Technische Fragen',
    icon: '🎮',
    tags: ['screenshot', 'upload', 'einreichung', 'bild']
  },
  {
    id: 'technical-2',
    question: 'Welche Dateiformate werden unterstützt?',
    answer: 'Bilder: PNG, JPG, GIF (max. 10MB). Videos: MP4, AVI (max. 100MB). Mindestauflösung: 800x600 Pixel.',
    category: 'Technische Fragen',
    icon: '🎮',
    tags: ['formate', 'dateien', 'größe', 'auflösung']
  },
  {
    id: 'technical-3',
    question: 'Warum wird mein Upload nicht akzeptiert?',
    answer: 'Prüfe: Dateigröße unter dem Limit? Korrektes Format? Ausreichende Auflösung? Keine verbotenen Inhalte? Bei Problemen kontaktiere den Support.',
    category: 'Technische Fragen',
    icon: '🎮',
    tags: ['upload', 'fehler', 'probleme', 'support']
  },
  {
    id: 'technical-4',
    question: 'Wie funktioniert die Zeitnahme?',
    answer: 'Die Zeitnahme erfolgt manuell: Starte die Stoppuhr beim Spielbeginn, stoppe sie beim Erreichen des Ziels. Dokumentiere Start- und Endzeit mit Screenshots.',
    category: 'Technische Fragen',
    icon: '🎮',
    tags: ['zeitnahme', 'stoppuhr', 'dokumentation', 'beweis']
  },

  // Sicherheit
  {
    id: 'security-1',
    question: 'Wie schütze ich meinen Account?',
    answer: 'Verwende ein starkes Passwort, aktiviere die Zwei-Faktor-Authentifizierung, teile keine Login-Daten und melde verdächtige Aktivitäten sofort.',
    category: 'Sicherheit',
    icon: '🔒',
    tags: ['account', 'sicherheit', 'passwort', '2fa']
  },
  {
    id: 'security-2',
    question: 'Was passiert bei verdächtigen Aktivitäten?',
    answer: 'Verdächtige Aktivitäten werden von unserem System und der Community überwacht. Bei Verstößen erfolgen Verwarnungen, temporäre Sperren oder permanente Sperren.',
    category: 'Sicherheit',
    icon: '🔒',
    tags: ['sicherheit', 'verstöße', 'sperren', 'moderation']
  },
  {
    id: 'security-3',
    question: 'Wie melde ich einen Regelverstoß?',
    answer: 'Nutze den "Melden"-Button bei verdächtigen Inhalten oder kontaktiere die Moderatoren direkt. Gib so viele Details wie möglich an.',
    category: 'Sicherheit',
    icon: '🔒',
    tags: ['melden', 'regelverstoß', 'moderatoren', 'community']
  },

  // App-Funktionen
  {
    id: 'features-1',
    question: 'Was sind Titel und Trophäen?',
    answer: 'Titel sind Auszeichnungen für besondere Leistungen (z.B. "Speedrunner", "Fanart-Künstler"). Trophäen sind spezielle Achievements für Events und Challenges.',
    category: 'App-Funktionen',
    icon: '🧩',
    tags: ['titel', 'trophäen', 'achievements', 'auszeichnungen']
  },
  {
    id: 'features-2',
    question: 'Wie funktioniert das Ranking-System?',
    answer: 'Das Ranking basiert auf deinen Speedrun-Zeiten, XP-Punkten und Community-Beteiligung. Bessere Zeiten = höhere Platzierung in der Rangliste.',
    category: 'App-Funktionen',
    icon: '🧩',
    tags: ['ranking', 'rangliste', 'platzierung', 'punkte']
  },
  {
    id: 'features-3',
    question: 'Was ist der Eventkalender?',
    answer: 'Der Eventkalender zeigt alle aktuellen und kommenden Events. Du kannst dich für Events anmelden, Deadlines einsehen und deine Teilnahme verwalten.',
    category: 'App-Funktionen',
    icon: '🧩',
    tags: ['eventkalender', 'events', 'anmeldung', 'deadlines']
  },
  {
    id: 'features-4',
    question: 'Wie funktioniert das Trading-System?',
    answer: 'Trading ermöglicht den Austausch von Items, Trophäen und anderen Sammelobjekten mit anderen Spielern. Alle Trades müssen fair und transparent sein.',
    category: 'App-Funktionen',
    icon: '🧩',
    tags: ['trading', 'austausch', 'items', 'trophäen']
  },

  // Premium
  {
    id: 'premium-1',
    question: 'Was bringt Premium?',
    answer: 'Premium bietet: Erweiterte Statistiken, exklusive Events, größere Upload-Limits, Custom-Titel, Prioritäts-Support und keine Werbung.',
    category: 'Premium',
    icon: '💰',
    tags: ['premium', 'features', 'vorteile', 'upgrade']
  },
  {
    id: 'premium-2',
    question: 'Wie kann ich Premium kündigen?',
    answer: 'Gehe zu "Einstellungen" → "Premium" → "Kündigen". Die Kündigung wird zum Ende der aktuellen Abrechnungsperiode wirksam.',
    category: 'Premium',
    icon: '💰',
    tags: ['premium', 'kündigung', 'abrechnung', 'einstellungen']
  },
  {
    id: 'premium-3',
    question: 'Gibt es eine kostenlose Testversion?',
    answer: 'Ja, du kannst Premium 7 Tage kostenlos testen. Alle Features sind verfügbar, aber du kannst jederzeit kündigen.',
    category: 'Premium',
    icon: '💰',
    tags: ['premium', 'testversion', 'kostenlos', 'trial']
  }
]

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle')
  const [feedback, setFeedback] = useState<Record<string, { helpful: boolean | null; comment: string }>>({})

  const categories = ['Alle', ...Array.from(new Set(faqData.map(item => item.category)))]

  const filteredFAQ = useMemo(() => {
    let filtered = faqData

    // Filter by category
    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    return filtered
  }, [searchTerm, selectedCategory])

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const handleFeedback = (itemId: string, helpful: boolean) => {
    setFeedback(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], helpful }
    }))
  }

  const handleFeedbackComment = (itemId: string, comment: string) => {
    setFeedback(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], comment }
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="retro-card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-color)' }}>
          ❓ HÄUFIG GESTELLTE FRAGEN
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '18px' }}>
          Finde schnell Antworten auf deine Fragen rund um Battle64
        </p>
      </div>

      {/* Search and Filter */}
      <div className="retro-card">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Suche nach Fragen, Antworten oder Tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {categories.map((category) => (
            <button
              key={category}
              className={`retro-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              style={{
                fontSize: '14px',
                padding: '8px 16px',
                backgroundColor: selectedCategory === category ? 'var(--primary-color)' : 'transparent',
                color: selectedCategory === category ? 'var(--background-color)' : 'var(--primary-color)'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '14px', color: 'var(--border-color)' }}>
          {filteredFAQ.length} von {faqData.length} Fragen gefunden
        </div>
      </div>

      {/* FAQ Items */}
      {filteredFAQ.map((item) => (
        <motion.div
          key={item.id}
          className="retro-card accordion-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="accordion-header"
            onClick={() => toggleItem(item.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: '20px', marginRight: '15px' }}>{item.icon}</span>
              <span style={{ fontSize: '16px', flex: 1 }}>{item.question}</span>
            </div>
            <span style={{ fontSize: '16px', marginLeft: '10px' }}>
              {expandedItems.has(item.id) ? '▼' : '▶'}
            </span>
          </div>

          <div className={`accordion-content ${expandedItems.has(item.id) ? 'open' : ''}`}>
            <div style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '15px' }}>
              {item.answer}
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '15px' }}>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    padding: '2px 8px',
                    margin: '2px',
                    fontSize: '12px',
                    borderRadius: '4px'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Feedback Section */}
            <div className="feedback-section">
              <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                War diese Antwort hilfreich?
              </div>
              <div className="feedback-buttons">
                <button
                  className={`feedback-button ${feedback[item.id]?.helpful === true ? 'active' : ''}`}
                  onClick={() => handleFeedback(item.id, true)}
                  style={{
                    backgroundColor: feedback[item.id]?.helpful === true ? 'var(--success-color)' : 'transparent',
                    color: feedback[item.id]?.helpful === true ? 'var(--background-color)' : 'var(--success-color)'
                  }}
                >
                  👍 Ja
                </button>
                <button
                  className={`feedback-button ${feedback[item.id]?.helpful === false ? 'active' : ''}`}
                  onClick={() => handleFeedback(item.id, false)}
                  style={{
                    backgroundColor: feedback[item.id]?.helpful === false ? 'var(--error-color)' : 'transparent',
                    color: feedback[item.id]?.helpful === false ? 'var(--background-color)' : 'var(--error-color)'
                  }}
                >
                  👎 Nein
                </button>
              </div>

              {feedback[item.id]?.helpful !== null && (
                <textarea
                  placeholder="Zusätzliches Feedback (optional)..."
                  value={feedback[item.id]?.comment || ''}
                  onChange={(e) => handleFeedbackComment(item.id, e.target.value)}
                  className="feedback-input"
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* No Results */}
      {filteredFAQ.length === 0 && (
        <motion.div
          className="retro-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '40px' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>
            Keine Ergebnisse gefunden
          </h3>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Versuche andere Suchbegriffe oder wähle eine andere Kategorie aus.
          </p>
          <button
            className="retro-button"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('Alle')
            }}
          >
            Suche zurücksetzen
          </button>
        </motion.div>
      )}

      {/* Contact Support */}
      <div className="retro-card">
        <h3 style={{ color: 'var(--accent-color)', marginBottom: '15px' }}>
          💬 Weitere Hilfe benötigt?
        </h3>
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Falls du keine Antwort auf deine Frage gefunden hast, kontaktiere unser Support-Team.
          Wir helfen dir gerne weiter!
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="retro-button">
            📧 Support kontaktieren
          </button>
          <button className="retro-button">
            💬 Community-Chat
          </button>
          <button className="retro-button">
            📚 Zum Regelwerk
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default FAQ