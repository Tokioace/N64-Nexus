import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import aller Screen-Komponenten
import HomeScreen from './pages/HomeScreen';
import ProfilScreen from './pages/ProfilScreen';
import SpeedrunEventScreen from './pages/SpeedrunEventScreen';
import ModulScannerScreen from './pages/ModulScannerScreen';
import MarktplatzScreen from './pages/MarktplatzScreen';
import FanArtGalleryScreen from './pages/FanArtGalleryScreen';
import TauschboerseScreen from './pages/TauschboerseScreen';
import NewsfeedScreen from './pages/NewsfeedScreen';
import QuizScreen from './pages/QuizScreen';
import FreundeslisteScreen from './pages/FreundeslisteScreen';
import SammlungScreen from './pages/SammlungScreen';
import AdminPanelScreen from './pages/AdminPanelScreen';
import SeasonEventsScreen from './pages/SeasonEventsScreen';
import AchievementsScreen from './pages/AchievementsScreen';
import ArchivScreen from './pages/ArchivScreen';
import DatenschutzScreen from './pages/DatenschutzScreen';
import TauschMarktplatzScreen from './pages/TauschMarktplatzScreen';
import SupportCartridgeScreen from './pages/SupportCartridgeScreen';
import ProfiModusScreen from './pages/ProfiModusScreen';
import XPLevelScreen from './pages/XPLevelScreen';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profil" element={<ProfilScreen />} />
        <Route path="/events" element={<SpeedrunEventScreen />} />
        <Route path="/scanner" element={<ModulScannerScreen />} />
        <Route path="/marktplatz" element={<MarktplatzScreen />} />
        <Route path="/fanart" element={<FanArtGalleryScreen />} />
        <Route path="/tauschboerse" element={<TauschboerseScreen />} />
        <Route path="/newsfeed" element={<NewsfeedScreen />} />
        <Route path="/quiz" element={<QuizScreen />} />
        <Route path="/freunde" element={<FreundeslisteScreen />} />
        <Route path="/sammlung" element={<SammlungScreen />} />
        <Route path="/admin" element={<AdminPanelScreen />} />
        <Route path="/saison" element={<SeasonEventsScreen />} />
        <Route path="/achievements" element={<AchievementsScreen />} />
        <Route path="/archiv" element={<ArchivScreen />} />
        <Route path="/datenschutz" element={<DatenschutzScreen />} />
        <Route path="/markt" element={<TauschMarktplatzScreen />} />
        <Route path="/hilfe" element={<SupportCartridgeScreen />} />
        <Route path="/profimodus" element={<ProfiModusScreen />} />
        <Route path="/xp" element={<XPLevelScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;