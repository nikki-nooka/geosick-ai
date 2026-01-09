import React from 'react';
import { useI18n } from './I18n';
import { supportedLanguages } from '../data/translations';
import { ChevronDownIcon } from './icons';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'light' | 'dark' | 'chatbot';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className, variant = 'light' }) => {
  const { language, setLanguage } = useI18n();

  const baseClasses = "w-full appearance-none text-sm font-medium rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer transition-colors";
  
  let variantClasses = '';
  switch (variant) {
      case 'dark':
          variantClasses = "bg-slate-700/80 border border-slate-600 text-slate-200 hover:bg-slate-600 focus:ring-offset-slate-800";
          break;
      case 'chatbot':
          variantClasses = "bg-slate-100 border border-transparent text-slate-700 hover:bg-slate-200 focus:ring-offset-white";
          break;
      case 'light':
      default:
          variantClasses = "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-offset-white";
          break;
  }

  return (
    <div className={`relative ${className || ''}`}>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className={`${baseClasses} ${variantClasses}`}
        aria-label="Select language"
      >
        {supportedLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
    </div>
  );
};