import { useState, useEffect } from 'react';
import { LangProvider } from './context/LangContext';
import { AuthProvider } from './context/AuthContext';
import { CropsProvider } from './context/CropsContext';
import { PricesProvider } from './context/PricesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportSection from './components/SupportSection';
import MobileBottomNav from './components/MobileBottomNav';
import Home from './pages/Home';
import MarketPrices from './pages/MarketPrices';
import Sell from './pages/Sell';
import Buy from './pages/Buy';

/**
 * AppContent – Main application content
 * Manages the current view state and renders the right page.
 */
function AppContent() {
  // 'home' | 'prices' | 'sell' | 'buy'
  const [currentView, setCurrentView] = useState('home');

  // Scroll to top on every view change
  const navigate = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Map view id → component
  const views = {
    home: <Home onNavigate={navigate} />,
    prices: <MarketPrices />,
    sell: <Sell onNavigate={navigate} />,
    buy: <Buy />,
  };

  return (
    <>
      <Navbar currentView={currentView} onNavigate={navigate} />

      {/* Main content — padded to clear the navbar */}
      <main id="main-content">
        <div className="view active">
          {views[currentView]}
        </div>
        <SupportSection />
      </main>

      <Footer onNavigate={navigate} />
      {/* Fixed bottom nav — only visible on mobile via CSS */}
      <MobileBottomNav currentView={currentView} onNavigate={navigate} />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <CropsProvider>
          <PricesProvider>
            <AppContent />
          </PricesProvider>
        </CropsProvider>
      </AuthProvider>
    </LangProvider>
  );
}
