import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StorageService } from './services/storage';
import { ProgressService } from './services/progressService';
import ConsentBanner from './components/ConsentBanner';
import Header from './components/Header';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import WelcomePage from './pages/WelcomePage';

function App() {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for consent on app load
    const consent = StorageService.hasConsent();
    setHasConsent(consent);
    
    if (consent) {
      // Add daily login progress if user has consent
      ProgressService.addProgress(
        'daily_login' as any,
        'Täglicher Login'
      );
    }
    
    setIsLoading(false);
  }, []);

  const handleConsent = (consent: boolean) => {
    StorageService.setConsent(consent);
    setHasConsent(consent);
    
    if (consent) {
      // Add daily login progress when consent is given
      ProgressService.addProgress(
        'daily_login' as any,
        'Täglicher Login'
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-n64-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Battle64 wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!hasConsent && (
        <ConsentBanner onConsent={handleConsent} />
      )}
      
      {hasConsent && (
        <>
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
            </Routes>
          </main>
        </>
      )}
    </div>
  );
}

export default App;