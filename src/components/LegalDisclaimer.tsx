import React from 'react';
import { LEGAL_CONSTANTS } from '../constants/legal';

interface LegalDisclaimerProps {
  type: 'startup' | 'footer' | 'full';
  className?: string;
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ type, className = '' }) => {
  const renderContent = () => {
    switch (type) {
      case 'startup':
        return (
          <div className={`legal-disclaimer startup ${className}`}>
            <h3>⚠️ Wichtiger Hinweis</h3>
            <p>{LEGAL_CONSTANTS.LEGAL_DISCLAIMER}</p>
          </div>
        );
      
      case 'footer':
        return (
          <div className={`legal-disclaimer footer ${className}`}>
            <small>{LEGAL_CONSTANTS.FOOTER_DISCLAIMER}</small>
          </div>
        );
      
      case 'full':
        return (
          <div className={`legal-disclaimer full ${className}`}>
            <h2>Rechtlicher Hinweis</h2>
            <div className="disclaimer-content">
              <p>{LEGAL_CONSTANTS.LEGAL_DISCLAIMER}</p>
            </div>
            
            <h3>Nutzungsrichtlinien</h3>
            <ul>
              <li>• {LEGAL_CONSTANTS.USAGE_GUIDELINES.noProtectedLogos}</li>
              <li>• {LEGAL_CONSTANTS.USAGE_GUIDELINES.userGeneratedContent}</li>
              <li>• {LEGAL_CONSTANTS.USAGE_GUIDELINES.userWarnings}</li>
              <li>• {LEGAL_CONSTANTS.USAGE_GUIDELINES.noEmulators}</li>
            </ul>
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderContent();
};

export default LegalDisclaimer;