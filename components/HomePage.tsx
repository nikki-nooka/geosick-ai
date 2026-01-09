import React from 'react';
import { GlobeIcon, LockClosedIcon, UserIcon } from './icons';
import { WaveBackground } from './WaveBackground';
import { LanguageSelector } from './LanguageSelector';
import { useI18n } from './I18n';
import { LiveHealthAlerts } from './LiveHealthAlerts';

interface HomePageProps {
  onLoginClick: () => void;
  onAboutClick: () => void;
  onContactClick: () => void;
  onExploreClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onAboutClick, onContactClick, onExploreClick }) => {
  const { t } = useI18n();
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center p-4 animate-fade-in overflow-hidden">
      <WaveBackground />

      <div className="relative z-10 w-full flex flex-col items-center flex-grow">
          {/* Header */}
          <header className="w-full max-w-7xl mx-auto py-4 px-0 sm:px-6 lg:px-8 flex justify-end items-center space-x-2 sm:space-x-4">
              <div className="w-36">
                <LanguageSelector />
              </div>
              <button onClick={onAboutClick} className="text-sm sm:text-base text-slate-600 font-medium hover:text-blue-500 transition-colors">{t('about')}</button>
              <button onClick={onContactClick} className="text-sm sm:text-base text-slate-600 font-medium hover:text-blue-500 transition-colors">{t('contact')}</button>
              <button onClick={onLoginClick} className="bg-white hover:bg-slate-100 text-blue-500 font-semibold py-2 px-3 sm:px-4 rounded-md transition-all duration-300 text-sm sm:text-base border border-blue-200 shadow-sm hover:shadow-md">{t('login')}</button>
          </header>

          {/* Main Content */}
          <main className="w-full flex-grow flex flex-col items-center text-center">
            {/* Hero Section */}
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col justify-center py-10 sm:py-20 animate-fade-in-up">
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                      <GlobeIcon className="w-10 h-10 sm:w-16 sm:h-16 text-blue-500" />
                      <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 tracking-tight">
                          GeoSick
                      </h1>
                  </div>
                  <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600">
                      {t('homepage_subtitle')}
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none sm:w-auto mx-auto">
                      <button
                          onClick={onExploreClick}
                          className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-300"
                          aria-label="Start exploring the globe"
                      >
                          <GlobeIcon className="w-5 h-5 mr-3" />
                          {t('explore_globe')}
                      </button>
                      <button
                          onClick={onLoginClick}
                          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                          aria-label="Log in to use the app"
                      >
                         <LockClosedIcon className="w-5 h-5 mr-3" />
                          {t('get_started')}
                      </button>
                  </div>
            </div>

            {/* Live Alerts Section */}
            <LiveHealthAlerts />

          </main>
      </div>
    </div>
  );
};