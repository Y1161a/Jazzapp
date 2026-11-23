import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Bell, Sparkles } from 'lucide-react';
import { notifications } from '../services/notifications';

export const Header: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, t, settings } = useApp();

  const handleTestChime = () => {
    notifications.playJazzChime();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cafe-50/90 dark:bg-jazz-night/90 border-b border-cafe-200 dark:border-jazz-border transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand & Creator Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cafe-700 via-cafe-500 to-jazz-gold flex items-center justify-center shadow-md shadow-cafe-900/10 dark:shadow-black/40 ring-2 ring-jazz-gold/30">
            <svg className="w-6 h-6 text-jazz-crema" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cafe-900 via-cafe-700 to-cafe-900 dark:from-jazz-crema dark:via-jazz-gold dark:to-cafe-200 bg-clip-text text-transparent">
                {settings.cafeName || t.appName}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-jazz-gold/15 text-jazz-gold font-bold border border-jazz-gold/30">
                PWA
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cafe-600 dark:text-jazz-amber font-medium">
              <Sparkles className="w-3 h-3 text-jazz-gold" />
              <span>{t.creatorBadge}</span>
            </div>
          </div>
        </div>

        {/* Quick controls: Chime, Language, Theme */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTestChime}
            title={t.testChime}
            className="p-2 rounded-xl text-cafe-700 dark:text-cafe-300 hover:bg-cafe-200/50 dark:hover:bg-jazz-card active:scale-95 transition"
            aria-label="Play Chime"
          >
            <Bell className="w-4 h-4 text-jazz-gold" />
          </button>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
            className="px-2.5 py-1 text-xs font-bold rounded-xl border border-cafe-300 dark:border-jazz-border bg-cafe-100/70 dark:bg-jazz-card text-cafe-800 dark:text-cafe-200 active:scale-95 transition"
            title={language === 'ar' ? 'Passer en Français' : 'التحويل للعربية'}
          >
            {language === 'ar' ? 'FR' : 'عربي'}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-cafe-700 dark:text-cafe-300 hover:bg-cafe-200/50 dark:hover:bg-jazz-card active:scale-95 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-jazz-gold" />
            ) : (
              <Moon className="w-4 h-4 text-cafe-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
