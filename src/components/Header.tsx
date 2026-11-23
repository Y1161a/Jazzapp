import React from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, Globe } from 'lucide-react';
import { notifications } from '../services/notifications';

interface HeaderProps {
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const { language, setLanguage, t, settings, stats } = useApp();

  const handleTestChime = () => {
    notifications.playJazzChime();
  };

  const hasUrgent = stats.overdueCount > 0 || stats.lowStockCount > 0;

  return (
    <header className="pt-10 pb-4 px-5 max-w-md mx-auto flex items-center justify-between">
      {/* Greeting / Brand Section */}
      <div className="flex flex-col">
        <span className="text-[12px] uppercase font-bold tracking-wider text-sage">
          {language === 'ar' ? 'مرحباً بك مجدداً' : 'WELCOME BACK'}
        </span>
        <h1 className="text-[28px] font-black text-charcoal leading-tight tracking-tight">
          {settings.ownerName || 'ياسين وشتاتي'}
        </h1>
      </div>

      {/* Right: Quick actions + 48px Avatar Profile with 16px Red Notification Badge */}
      <div className="flex items-center gap-2.5">
        
        {/* Language Pill */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
          className="px-2.5 py-1.5 rounded-full bg-white text-[11px] font-extrabold text-charcoal border border-sage/30 shadow-sm active:scale-95 transition flex items-center gap-1"
          title={language === 'ar' ? 'Passer en Français' : 'التحويل للعربية'}
        >
          <Globe className="w-3.5 h-3.5 text-sage" />
          <span>{language === 'ar' ? 'FR' : 'عربي'}</span>
        </button>

        {/* 48px Circular Profile Container with 2px white border and 16px Red Badge */}
        <div 
          onClick={onProfileClick || handleTestChime}
          className="relative w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center border-2 border-white shadow-soft cursor-pointer active:scale-95 transition"
          title={`${t.creatorBadge} · ${settings.cafeName}`}
        >
          <Coffee className="w-5 h-5 text-offwhite" />
          
          {/* 16px Red Notification Badge at bottom-right */}
          <span 
            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white ${
              hasUrgent ? 'bg-brandRed animate-pulse' : 'bg-brandRed'
            }`}
          >
            {hasUrgent ? (stats.overdueCount + stats.lowStockCount) : '•'}
          </span>
        </div>

      </div>
    </header>
  );
};
