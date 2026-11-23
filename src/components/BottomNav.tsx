import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ReceiptText, PackageOpen, Settings } from 'lucide-react';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, stats } = useApp();

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'obligations',
      label: t.navObligations,
      icon: ReceiptText,
      badge: stats.overdueCount > 0 ? stats.overdueCount : (stats.upcomingCount > 0 ? stats.upcomingCount : undefined),
    },
    {
      id: 'inventory',
      label: t.navInventory,
      icon: PackageOpen,
      badge: stats.lowStockCount > 0 ? stats.lowStockCount : undefined,
    },
    {
      id: 'settings',
      label: t.navSettings,
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-cafe-50/95 dark:bg-jazz-night/95 backdrop-blur-md border-t border-cafe-200 dark:border-jazz-border pb-safe transition-colors duration-200 shadow-lg shadow-black/10">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'text-cafe-900 dark:text-jazz-gold scale-105'
                  : 'text-cafe-500 dark:text-stone-400 hover:text-cafe-700 dark:hover:text-stone-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -end-2.5 min-w-[18px] h-[18px] px-1 text-[10px] font-black leading-none flex items-center justify-center rounded-full bg-rose-600 text-white shadow-sm ring-2 ring-cafe-50 dark:ring-jazz-night">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[11px] truncate max-w-[70px]">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-1 rounded-full bg-gradient-to-r from-cafe-700 to-jazz-gold" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
