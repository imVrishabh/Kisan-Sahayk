import { createContext, useContext, useState } from 'react';
import TRANSLATIONS from '../data/translations';

// Create context
const LangContext = createContext(null);

/**
 * LangProvider – wraps the app and provides language state.
 * Language preference is persisted to localStorage.
 */
export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('kisan_lang') || 'en'
  );

  // Switch language and persist to localStorage
  const setLang = (code) => {
    setLangState(code);
    localStorage.setItem('kisan_lang', code);
    // Update html lang attribute for accessibility
    document.documentElement.lang = code === 'en' ? 'en' : 'hi';
  };

  // Translation helper: returns string for a key in the current language
  const t = (key) =>
    TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

/** Hook to access language context anywhere in the tree */
export function useLang() {
  return useContext(LangContext);
}
