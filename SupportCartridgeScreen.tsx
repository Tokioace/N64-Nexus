import React, { useState, useRef, useEffect } from 'react';
import './SupportCartridgeScreen.css';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const SupportCartridgeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCartbit, setShowCartbit] = useState(true);
  const [cartbitMessage, setCartbitMessage] = useState('Hallo! Ich bin Cartbit, dein digitaler Helfer! 👋');
  const [activeMenuHover, setActiveMenuHover] = useState<string | null>(null);
  const cartbitRef = useRef<HTMLDivElement>(null);

  const faqData: FAQItem[] = [
    {
      id: 'privacy-1',
      category: 'datenschutz',
      question: 'Wie werden meine Daten geschützt?',
      answer: 'Deine Daten werden nach höchsten Standards verschlüsselt und nur für die App-Funktionalität verwendet. Wir geben niemals persönliche Daten an Dritte weiter.',
      tags: ['datenschutz', 'sicherheit', 'verschlüsselung']
    },
    {
      id: 'privacy-2',
      category: 'datenschutz',
      question: 'Kann ich mein Konto löschen?',
      answer: 'Ja! Du kannst dein Konto jederzeit in den Einstellungen unter "Konto verwalten" löschen. Alle deine Daten werden dann permanent entfernt.',
      tags: ['konto', 'löschen', 'einstellungen']
    },
    {
      id: 'points-1',
      category: 'punkte',
      question: 'Wie verdiene ich Punkte?',
      answer: 'Punkte verdienst du durch das Spielen von Spielen, Teilnahme an Events und tägliche Anmeldungen. Je aktiver du bist, desto mehr Punkte sammelst du!',
      tags: ['punkte', 'spiele', 'events', 'belohnungen']
    },
    {
      id: 'points-2',
      category: 'punkte',
      question: 'Was kann ich mit meinen Punkten machen?',
      answer: 'Punkte kannst du gegen exklusive Items, Rabatte und Special-Events eintauschen. Sammle genug Punkte für legendäre Belohnungen!',
      tags: ['punkte', 'shop', 'belohnungen', 'items']
    },
    {
      id: 'games-1',
      category: 'spiele',
      question: 'Wie funktionieren die Spiele?',
      answer: 'Unsere Spiele sind einfach zu verstehen! Folge den Anweisungen auf dem Bildschirm und sammle Punkte. Jedes Spiel hat verschiedene Schwierigkeitsgrade.',
      tags: ['spiele', 'anleitung', 'schwierigkeit']
    },
    {
      id: 'games-2',
      category: 'spiele',
      question: 'Gibt es Multiplayer-Spiele?',
      answer: 'Ja! Du kannst mit Freunden spielen und dich in Ranglisten messen. Neue Multiplayer-Modi kommen regelmäßig hinzu!',
      tags: ['multiplayer', 'freunde', 'ranglisten']
    },
    {
      id: 'events-1',
      category: 'events',
      question: 'Wann finden Events statt?',
      answer: 'Events finden regelmäßig statt! Schau in den Event-Kalender für aktuelle Termine. Spezielle Events gibt es zu Feiertagen und besonderen Anlässen.',
      tags: ['events', 'kalender', 'termine']
    },
    {
      id: 'events-2',
      category: 'events',
      question: 'Wie melde ich mich für Events an?',
      answer: 'Einfach auf das gewünschte Event klicken und "Anmelden" wählen. Du erhältst eine Bestätigung und Erinnerungen vor dem Event.',
      tags: ['anmeldung', 'bestätigung', 'erinnerungen']
    }
  ];

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      name: 'Startseite',
      description: 'Hier findest du eine Übersicht aller Features und deine aktuellen Aktivitäten!',
      icon: '🏠'
    },
    {
      id: 'games',
      name: 'Spiele',
      description: 'Entdecke unsere coolen Spiele und sammle Punkte! Von Puzzles bis Action ist alles dabei.',
      icon: '🎮'
    },
    {
      id: 'events',
      name: 'Events',
      description: 'Nimm an spannenden Events teil und gewinne tolle Preise!',
      icon: '🎉'
    },
    {
      id: 'profile',
      name: 'Profil',
      description: 'Verwalte dein Profil, sieh deine Statistiken und Einstellungen an!',
      icon: '👤'
    },
    {
      id: 'shop',
      name: 'Shop',
      description: 'Tausche deine Punkte gegen coole Items und Belohnungen ein!',
      icon: '🛍️'
    }
  ];

  const categories = [
    { id: 'all', name: 'Alle', icon: '📚' },
    { id: 'datenschutz', name: 'Datenschutz', icon: '🔒' },
    { id: 'punkte', name: 'Punkte', icon: '⭐' },
    { id: 'spiele', name: 'Spiele', icon: '🎮' },
    { id: 'events', name: 'Events', icon: '🎉' }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMenuHover = (menuId: string) => {
    setActiveMenuHover(menuId);
    const menuItem = menuItems.find(item => item.id === menuId);
    if (menuItem) {
      setCartbitMessage(menuItem.description);
    }
  };

  const handleMenuLeave = () => {
    setActiveMenuHover(null);
    setCartbitMessage('Hallo! Ich bin Cartbit, dein digitaler Helfer! 👋');
  };

  const handleCartbitClick = () => {
    const messages = [
      'Brauchst du Hilfe? Ich bin hier für dich! 💪',
      'Schau dir die FAQs an - da findest du viele Antworten! 📖',
      'Vergiss nicht, regelmäßig zu spielen für mehr Punkte! 🎯',
      'Events sind super für neue Freunde und Preise! 🎁',
      'Falls du etwas nicht findest, nutze die Suchfunktion! 🔍'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCartbitMessage(randomMessage);
  };

  useEffect(() => {
    if (cartbitRef.current) {
      cartbitRef.current.style.animation = 'bounce 0.6s ease-in-out';
      setTimeout(() => {
        if (cartbitRef.current) {
          cartbitRef.current.style.animation = '';
        }
      }, 600);
    }
  }, [cartbitMessage]);

  return (
    <div className="support-cartridge-screen">
      {/* Header */}
      <div className="support-header">
        <h1 className="support-title">🎮 Support Center 🎮</h1>
        <p className="support-subtitle">Finde Hilfe und Antworten auf alle Fragen!</p>
      </div>

      {/* Cartbit Mascot */}
      <div className="cartbit-container">
        <div 
          ref={cartbitRef}
          className="cartbit-mascot"
          onClick={handleCartbitClick}
        >
          <div className="cartbit-body">
            <div className="cartbit-eyes">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
            </div>
            <div className="cartbit-mouth"></div>
            <div className="cartbit-antenna"></div>
          </div>
        </div>
        <div className="cartbit-speech-bubble">
          <p>{cartbitMessage}</p>
          <div className="speech-bubble-arrow"></div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Suche nach Hilfeartikeln..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-button">Suchen</button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Menu Guide Section */}
      <div className="menu-guide-section">
        <h2 className="section-title">🗺️ Menü-Führer</h2>
        <div className="menu-items-grid">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`menu-item ${activeMenuHover === item.id ? 'active' : ''}`}
              onMouseEnter={() => handleMenuHover(item.id)}
              onMouseLeave={handleMenuLeave}
            >
              <div className="menu-item-icon">{item.icon}</div>
              <div className="menu-item-name">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="section-title">❓ Häufige Fragen</h2>
        <div className="faq-list">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(faq => (
              <div key={faq.id} className="faq-item">
                <div className="faq-question">
                  <span className="faq-icon">❓</span>
                  <h3>{faq.question}</h3>
                </div>
                <div className="faq-answer">
                  <span className="faq-icon">💡</span>
                  <p>{faq.answer}</p>
                </div>
                <div className="faq-tags">
                  {faq.tags.map(tag => (
                    <span key={tag} className="faq-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>🔍 Keine Ergebnisse gefunden. Versuche andere Suchbegriffe!</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <h2 className="section-title">📞 Kontakt</h2>
        <div className="contact-options">
          <div className="contact-option">
            <span className="contact-icon">📧</span>
            <h3>E-Mail Support</h3>
            <p>support@cartridgeapp.com</p>
          </div>
          <div className="contact-option">
            <span className="contact-icon">💬</span>
            <h3>Live Chat</h3>
            <p>Verfügbar 24/7</p>
          </div>
          <div className="contact-option">
            <span className="contact-icon">📱</span>
            <h3>In-App Support</h3>
            <p>Direkt in der App</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCartridgeScreen;