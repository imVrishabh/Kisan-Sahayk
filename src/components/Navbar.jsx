import { useState, useEffect, useRef } from 'react';
import { useLang } from '../context/LangContext';
import logo from '../assets/kisan_sahayk_logo.png';

/**
 * Navbar – fixed top navigation bar.
 * On mobile (≤768px): shows only logo + language globe icon + hamburger.
 * The slide-down panel includes nav links AND the full lang switcher.
 * Props:
 *   currentView  – active view id ('home' | 'prices' | 'buy' | 'sell')
 *   onNavigate   – callback(viewId) to switch views
 */
export default function Navbar({ currentView, onNavigate }) {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu after navigation
  const handleNav = (view) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [menuOpen]);

  const langOptions = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी'   },
    { code: 'cg', label: 'छत्तीसगढ़ी' },
  ];

  const navItems = [
    { id: 'home',   icon: 'fa-house',         extraClass: ''             },
    { id: 'prices', icon: 'fa-chart-line',     extraClass: ''             },
    { id: 'buy',    icon: 'fa-cart-shopping',  extraClass: ' buy-nav-btn' },
    { id: 'sell',   icon: 'fa-tractor',        extraClass: ' sell-nav-btn'},
  ];

  return (
    <nav className="navbar" ref={menuRef}>
      <div className="nav-container">

        {/* Logo */}
        <div className="logo" onClick={() => handleNav('home')}>
          <img src={logo} alt="Kisan Sahayk Logo" className="logo-img" />
          <span>KISAN SAHAYK</span>
        </div>

        {/* Desktop nav links */}
        <div className="nav-links-desktop">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-btn${item.extraClass}${currentView === item.id ? ' nav-active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <i className={`fa-solid ${item.icon}`} />
              <span>{t(`nav_${item.id}`)}</span>
            </button>
          ))}
        </div>

        {/* Desktop language switcher */}
        <div className="lang-switcher lang-switcher-desktop">
          <span className="lang-label">
            <i className="fa-solid fa-language" /> Language:
          </span>
          {langOptions.map(({ code, label }) => (
            <button
              key={code}
              className={`lang-btn${lang === code ? ' lang-active' : ''}`}
              onClick={() => setLang(code)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile right controls */}
        <div className="nav-mobile-controls">
          {/* Quick language cycle on mobile */}
          <button
            className="mobile-lang-btn"
            onClick={() => {
              const order = ['en', 'hi', 'cg'];
              setLang(order[(order.indexOf(lang) + 1) % order.length]);
            }}
            title="Switch language"
          >
            <i className="fa-solid fa-language" />
            <span className="mobile-lang-code">{lang.toUpperCase()}</span>
          </button>

          {/* Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fa-solid fa-${menuOpen ? 'times' : 'bars'}`} />
          </button>
        </div>
      </div>

      {/* Mobile slide-down panel */}
      <div className={`mobile-menu-panel${menuOpen ? ' open' : ''}`}>
        {/* Nav links */}
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`mobile-nav-item${currentView === item.id ? ' mni-active' : ''}`}
            onClick={() => handleNav(item.id)}
          >
            <i className={`fa-solid ${item.icon}`} />
            <span>{t(`nav_${item.id}`)}</span>
          </button>
        ))}

        {/* Language switcher inside mobile menu */}
        <div className="mobile-lang-full">
          <span className="mobile-lang-title">
            <i className="fa-solid fa-language" /> भाषा / Language
          </span>
          <div className="mobile-lang-options">
            {langOptions.map(({ code, label }) => (
              <button
                key={code}
                className={`mobile-lang-opt${lang === code ? ' active' : ''}`}
                onClick={() => { setLang(code); setMenuOpen(false); }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
