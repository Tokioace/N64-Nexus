import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { LEGAL_CONSTANTS } from '../constants/legal';
import LegalDisclaimer from '../components/LegalDisclaimer';
import ImpressumScreen from '../components/ImpressumScreen';

const HomePage: React.FC = () => {
  const [showStartupDisclaimer, setShowStartupDisclaimer] = useState(true);
  const [showImpressum, setShowImpressum] = useState(false);

  const handleAcceptDisclaimer = () => {
    setShowStartupDisclaimer(false);
    // Hier könnte man die Zustimmung in localStorage speichern
    localStorage.setItem('disclaimerAccepted', 'true');
  };

  useEffect(() => {
    // Prüfen ob Disclaimer bereits akzeptiert wurde
    const disclaimerAccepted = localStorage.getItem('disclaimerAccepted');
    if (disclaimerAccepted === 'true') {
      setShowStartupDisclaimer(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{LEGAL_CONSTANTS.APP_NAME} - Retro Gaming Community</title>
        <meta name="description" content={LEGAL_CONSTANTS.APP_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="app-container">
        {/* Startup Disclaimer Modal */}
        {showStartupDisclaimer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <LegalDisclaimer type="startup" />
              <div className="modal-actions">
                <button 
                  className="btn-primary" 
                  onClick={handleAcceptDisclaimer}
                >
                  Verstanden & Fortfahren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Impressum Modal */}
        {showImpressum && (
          <div className="modal-overlay">
            <div className="modal-content large">
              <ImpressumScreen onClose={() => setShowImpressum(false)} />
            </div>
          </div>
        )}

        {/* Main App Content */}
        <header className="app-header">
          <div className="header-content">
            <h1>🎮 {LEGAL_CONSTANTS.APP_NAME}</h1>
            <p className="app-tagline">
              Community-Plattform für Retro-Gaming Fans
            </p>
          </div>
        </header>

        <main className="app-main">
          <div className="hero-section">
            <h2>Willkommen bei {LEGAL_CONSTANTS.APP_NAME}</h2>
            <p>{LEGAL_CONSTANTS.APP_DESCRIPTION}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h3>📚 Sammlung verwalten</h3>
              <p>Verwalte deine Spielesammlung und teile sie mit der Community</p>
            </div>
            
            <div className="feature-card">
              <h3>⭐ Bewertungen</h3>
              <p>Gib Bewertungen ab und entdecke neue Lieblingsspiele</p>
            </div>
            
            <div className="feature-card">
              <h3>🏆 Wettbewerbe</h3>
              <p>Nimm an Community-Wettbewerben teil und gewinne Preise</p>
            </div>
            
            <div className="feature-card">
              <h3>👥 Community</h3>
              <p>Tausche dich mit anderen Retro-Gaming Fans aus</p>
            </div>
          </div>

          <div className="legal-section">
            <LegalDisclaimer type="full" />
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <LegalDisclaimer type="footer" />
            <div className="footer-links">
              <button 
                className="link-button"
                onClick={() => setShowImpressum(true)}
              >
                Impressum
              </button>
              <span className="separator">|</span>
              <button 
                className="link-button"
                onClick={() => setShowStartupDisclaimer(true)}
              >
                Rechtliche Hinweise
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;