import React from 'react';
import { LEGAL_CONSTANTS } from '../constants/legal';

interface ImpressumScreenProps {
  onClose?: () => void;
}

const ImpressumScreen: React.FC<ImpressumScreenProps> = ({ onClose }) => {
  return (
    <div className="impressum-screen">
      <div className="impressum-header">
        <h1>📄 Impressum</h1>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
      
      <div className="impressum-content">
        <div className="app-info">
          <h2>{LEGAL_CONSTANTS.APP_NAME}</h2>
          <p>{LEGAL_CONSTANTS.APP_DESCRIPTION}</p>
        </div>
        
        <div className="legal-notice">
          <h3>Rechtliche Hinweise</h3>
          <p style={{ whiteSpace: 'pre-line' }}>
            {LEGAL_CONSTANTS.IMPRESSUM_TEXT}
          </p>
        </div>
        
        <div className="contact-info">
          <h3>Kontakt</h3>
          <p>
            Bei Fragen oder Anmerkungen zu dieser App wenden Sie sich bitte an:<br/>
            <strong>[Ihre Kontaktdaten hier einfügen]</strong>
          </p>
        </div>
        
        <div className="timestamp">
          <small>Stand: {new Date().toLocaleDateString('de-DE')}</small>
        </div>
      </div>
    </div>
  );
};

export default ImpressumScreen;