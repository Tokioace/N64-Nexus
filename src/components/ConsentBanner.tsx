import React from 'react';

interface ConsentBannerProps {
  onConsent: (consent: boolean) => void;
}

const ConsentBanner: React.FC<ConsentBannerProps> = ({ onConsent }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Datenschutz-Einstellungen
            </h3>
            <p className="text-sm text-gray-600">
              Battle64 verwendet lokale Speicherung, um deine Spielfortschritte und Profildaten zu speichern. 
              Diese Daten werden nur auf deinem Gerät gespeichert und nicht an externe Server übertragen. 
              Du kannst deine Einwilligung jederzeit widerrufen.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onConsent(false)}
              className="btn-secondary text-sm"
            >
              Ablehnen
            </button>
            <button
              onClick={() => onConsent(true)}
              className="btn-primary text-sm"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;