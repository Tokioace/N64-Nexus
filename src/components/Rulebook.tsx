import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Rule {
  id: string
  title: string
  content: string
  icon: string
}

interface RuleCategory {
  id: string
  title: string
  icon: string
  rules: Rule[]
}

const ruleCategories: RuleCategory[] = [
  {
    id: 'speedruns',
    title: 'Speedruns',
    icon: '🕹️',
    rules: [
      {
        id: 'sr-1',
        title: 'Gültige Speedrun-Bedingungen',
        content: 'Speedruns müssen mit Foto oder Video dokumentiert werden. Die Zeitnahme erfolgt vom Start bis zum finalen Ziel. Nur unmodifizierte Spiele sind erlaubt, außer in speziellen Glitch-Kategorien.',
        icon: '📸'
      },
      {
        id: 'sr-2',
        title: 'Zeitrahmen & Deadlines',
        content: 'Events haben feste Start- und Endzeiten. Verspätete Einreichungen werden nicht akzeptiert. Die Zeitnahme erfolgt in der lokalen Zeitzone des Spielers.',
        icon: '⏰'
      },
      {
        id: 'sr-3',
        title: 'Glitch-Kategorien',
        content: 'In Glitch-Kategorien sind bestimmte Exploits erlaubt. Diese müssen vor dem Event klar kommuniziert werden. Neue Glitches müssen vorab genehmigt werden.',
        icon: '🐛'
      },
      {
        id: 'sr-4',
        title: 'Hardware & Emulation',
        content: 'Original-Hardware ist bevorzugt, aber Emulatoren sind erlaubt, wenn sie das Spielverhalten nicht verändern. Speedhacks oder Cheats sind verboten.',
        icon: '🖥️'
      }
    ]
  },
  {
    id: 'fairplay',
    title: 'Fairplay & Anti-Cheating',
    icon: '⚖️',
    rules: [
      {
        id: 'fp-1',
        title: 'Keine Bot-Unterstützung',
        content: 'Automatisierte Tools, Bots oder Makros sind verboten. Alle Aktionen müssen manuell vom Spieler ausgeführt werden.',
        icon: '🤖'
      },
      {
        id: 'fp-2',
        title: 'Keine Modifikationen',
        content: 'Spielmodifikationen, die das Gameplay beeinflussen, sind nicht erlaubt. Ausnahme: Offiziell genehmigte Glitch-Kategorien.',
        icon: '🔧'
      },
      {
        id: 'fp-3',
        title: 'Transparente Dokumentation',
        content: 'Alle Speedruns müssen vollständig dokumentiert werden. Versteckte Schnitte oder unerklärliche Zeitlücken führen zur Disqualifikation.',
        icon: '📋'
      },
      {
        id: 'fp-4',
        title: 'Community-Reporting',
        content: 'Verdächtige Aktivitäten können der Community gemeldet werden. Falsche Anschuldigungen werden ebenfalls geahndet.',
        icon: '🚨'
      }
    ]
  },
  {
    id: 'fanart',
    title: 'Fanart & Kreative Inhalte',
    icon: '🖼️',
    rules: [
      {
        id: 'fa-1',
        title: 'Originalität & Eigentum',
        content: 'Alle eingereichten Inhalte müssen original und vom Einreicher erstellt sein. Plagiate oder gestohlene Inhalte sind verboten.',
        icon: '🎨'
      },
      {
        id: 'fa-2',
        title: 'Erlaubte Formate',
        content: 'Akzeptierte Formate: PNG, JPG, GIF (max. 10MB), MP4 (max. 100MB). Mindestauflösung: 800x600 Pixel.',
        icon: '📁'
      },
      {
        id: 'fa-3',
        title: 'Inhaltsrichtlinien',
        content: 'Keine expliziten, gewalttätigen oder anstößigen Inhalte. Respektvolle Darstellung von Charakteren und Franchises.',
        icon: '✅'
      },
      {
        id: 'fa-4',
        title: 'Lizenzierung & Nutzung',
        content: 'Mit der Einreichung erteilst du Battle64 das Recht, deine Inhalte für Community-Zwecke zu nutzen. Du behältst die Urheberrechte.',
        icon: '📜'
      }
    ]
  },
  {
    id: 'community',
    title: 'Community-Verhalten',
    icon: '💬',
    rules: [
      {
        id: 'cv-1',
        title: 'Respektvoller Umgang',
        content: 'Behandle alle Community-Mitglieder mit Respekt. Keine Beleidigungen, Drohungen oder Mobbing. Konstruktive Kritik ist erwünscht.',
        icon: '🤝'
      },
      {
        id: 'cv-2',
        title: 'Chat-Etikette',
        content: 'Kein Spam, Werbung oder Off-Topic-Diskussionen in Event-Chats. Moderatoren können bei Verstößen eingreifen.',
        icon: '💭'
      },
      {
        id: 'cv-3',
        title: 'Trading & Transaktionen',
        content: 'Faire Trades ohne Betrug. Alle Vereinbarungen müssen transparent sein. Bei Problemen wende dich an die Moderatoren.',
        icon: '🔄'
      },
      {
        id: 'cv-4',
        title: 'Datenschutz & Privatsphäre',
        content: 'Respektiere die Privatsphäre anderer. Teile keine persönlichen Informationen ohne Zustimmung. Beachte die DSGVO-Richtlinien.',
        icon: '🔒'
      }
    ]
  },
  {
    id: 'datenschutz',
    title: 'Datenschutz & Uploads',
    icon: '📷',
    rules: [
      {
        id: 'ds-1',
        title: 'Bildrechte & Sichtbarkeit',
        content: 'Du behältst die Rechte an deinen Uploads. Inhalte können als öffentlich oder privat markiert werden. Private Inhalte sind nur für dich sichtbar.',
        icon: '👁️'
      },
      {
        id: 'ds-2',
        title: 'Personenbezogene Daten',
        content: 'Vermeide das Hochladen von personenbezogenen Daten. Keine Fotos von Personen ohne deren Zustimmung.',
        icon: '👤'
      },
      {
        id: 'ds-3',
        title: 'Löschung von Inhalten',
        content: 'Du kannst deine Inhalte jederzeit löschen. Bei Verstößen gegen die Regeln können Moderatoren Inhalte entfernen.',
        icon: '🗑️'
      },
      {
        id: 'ds-4',
        title: 'Datenverarbeitung',
        content: 'Battle64 verarbeitet deine Daten gemäß der Datenschutzerklärung. Du kannst der Verarbeitung jederzeit widersprechen.',
        icon: '⚙️'
      }
    ]
  }
]

const Rulebook: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="retro-card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary-color)' }}>
          📚 BATTLE64 REGELWERK
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '18px' }}>
          Willkommen in der Battle64-Community! Diese Regeln sorgen für Fairness, Respekt und Spaß für alle.
        </p>
      </div>

      {ruleCategories.map((category) => (
        <motion.div
          key={category.id}
          className="retro-card rule-category"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: ruleCategories.indexOf(category) * 0.1 }}
        >
          <div 
            className="accordion-header"
            onClick={() => toggleCategory(category.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', marginRight: '15px' }}>{category.icon}</span>
              <h3 style={{ margin: 0, fontSize: '20px' }}>{category.title}</h3>
            </div>
            <span style={{ fontSize: '20px' }}>
              {expandedCategory === category.id ? '▼' : '▶'}
            </span>
          </div>

          <div className={`accordion-content ${expandedCategory === category.id ? 'open' : ''}`}>
            <ul className="rule-list">
              {category.rules.map((rule) => (
                <motion.li
                  key={rule.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{ marginBottom: '15px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '20px', marginRight: '10px', marginTop: '2px' }}>
                      {rule.icon}
                    </span>
                    <div>
                      <strong style={{ color: 'var(--primary-color)', display: 'block', marginBottom: '5px' }}>
                        {rule.title}
                      </strong>
                      <span style={{ fontSize: '16px', lineHeight: '1.5' }}>
                        {rule.content}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}

      <div className="retro-card">
        <h3 style={{ color: 'var(--warning-color)', marginBottom: '15px' }}>
          ⚠️ WICHTIGE HINWEISE
        </h3>
        <ul className="rule-list">
          <li>Verstöße gegen diese Regeln können zu Verwarnungen, temporären Sperren oder permanentem Ausschluss führen.</li>
          <li>Bei Fragen zu den Regeln wende dich an die Community-Moderatoren.</li>
          <li>Diese Regeln können sich ändern. Änderungen werden vorab angekündigt.</li>
          <li>Mit der Nutzung von Battle64 akzeptierst du diese Regeln vollständig.</li>
        </ul>
      </div>

      <div className="retro-card">
        <h3 style={{ color: 'var(--success-color)', marginBottom: '15px' }}>
          🎯 SPIELERISCHE ZIELE
        </h3>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          Battle64 ist eine Community für Retro-Gaming-Enthusiasten. Unser Ziel ist es, 
          eine faire, respektvolle und unterhaltsame Umgebung zu schaffen, in der jeder 
          seine Leidenschaft für klassische Spiele ausleben kann. Gemeinsam schaffen wir 
          eine Community, die von gegenseitigem Respekt und der Liebe zum Gaming geprägt ist.
        </p>
      </div>
    </motion.div>
  )
}

export default Rulebook