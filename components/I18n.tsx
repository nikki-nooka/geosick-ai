import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../data/translations';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en-US',
  setLanguage: () => {},
  t: (key) => key,
});

// Fixed: Made children optional to resolve issues where TypeScript fails to recognize nested content as children in the App.tsx I18nProvider wrapper
export const I18nProvider = ({ children }: { children?: React.ReactNode }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('geosick_language') || 'en-US';
  });

  const setLanguage = (lang: string) => {
    localStorage.setItem('geosick_language', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    let translation = translations[key]?.[language] || translations[key]?.['en-US'] || key;
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{${rKey}}`, replacements[rKey]);
        });
    }
    return translation;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);