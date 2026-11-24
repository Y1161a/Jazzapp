import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ObligationsView } from './components/ObligationsView';
import { InventoryView } from './components/InventoryView';
import { BreakEvenView } from './components/BreakEvenView';
import { DailyCashView } from './components/DailyCashView';
import { SettingsView } from './components/SettingsView';
import { ReceiptText, PackageOpen, Wallet, Scale, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, t, settings } = useApp();
  const [isAddObligationOpen, setIsAddObligationOpen] = useState(false);
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [isAddDailyOpen, setIsAddDailyOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        const swPath = `${import.meta.env.BASE_URL}sw.js`;
        navigator.serviceWorker.register(swPath).catch((err) => {
          console.warn('SW registration skipped/failed:', err);
        });
      });
    }
  }, []);

  const handleOpenAddObligation = () => {
    setActiveTab('obligations');
    setIsAddObligationOpen(true);
    setIsQuickActionOpen(false);
  };

  const handleOpenAddInventory = () => {
    setActiveTab('inventory');
    setIsAddInventoryOpen(true);
    setIsQuickActionOpen(false);
  };

  const handleOpenAddDaily = () => {
    setActiveTab('daily');
    setIsAddDailyOpen(true);
    setIsQuickActionOpen(false);
  };

  const handleOpenBreakEven = () => {
    setActiveTab('breakeven');
    setIsQuickActionOpen(false);
  };

  const handleCenterAction = () => {
    if (activeTab === 'obligations') {
      setIsAddObligationOpen(true);
    } else if (activeTab === 'inventory') {
      setIsAddInventoryOpen(true);
    } else if (activeTab === 'daily') {
      setIsAddDailyOpen(true);
    } else {
      setIsQuickActionOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-offwhite text-charcoal font-sans antialiased selection:bg-brandRed selection:text-white pb-10">
      
      {/* Top Header */}
      <Header onProfileClick={() => setActiveTab('settings')} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-1">
        {activeTab === 'dashboard' && (
          <DashboardView 
            onOpenAddObligation={handleOpenAddObligation}
            onOpenAddInventory={handleOpenAddInventory}
            onOpenAddDaily={handleOpenAddDaily}
          />
        )}

        {activeTab === 'obligations' && (
          <ObligationsView 
            isAddModalOpen={isAddObligationOpen}
            setIsAddModalOpen={setIsAddObligationOpen}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView 
            isAddModalOpen={isAddInventoryOpen}
            setIsAddModalOpen={setIsAddInventoryOpen}
          />
        )}

        {activeTab === 'breakeven' && (
          <BreakEvenView />
        )}

        {activeTab === 'daily' && (
          <DailyCashView 
            isAddModalOpen={isAddDailyOpen}
            setIsAddModalOpen={setIsAddDailyOpen}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Fixed Floating Navigation Bar with Red Center FAB */}
      <BottomNav onCenterAction={handleCenterAction} />

      {/* Quick Action Dialog (from Center FAB) */}
      {isQuickActionOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-[40px] border border-sage/30 shadow-2xl overflow-hidden p-6 space-y-4 mb-20 sm:mb-0">
            
            <div className="flex items-center justify-between border-b border-sage/20 pb-3">
              <div>
                <h3 className="font-black text-base text-charcoal">
                  {settings.language === 'ar' ? 'إجراء سريع' : 'Action Rapide'}
                </h3>
                <p className="text-[11px] text-sage font-bold">
                  {settings.language === 'ar' ? 'اختر العملية التي تريد تسجيلها' : 'Choisissez une action'}
                </p>
              </div>
              <button 
                onClick={() => setIsQuickActionOpen(false)}
                className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-charcoal hover:bg-brandRed hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {/* Daily Cash Entry */}
              <button
                onClick={handleOpenAddDaily}
                className="p-3.5 rounded-3xl bg-offwhite hover:bg-brandRed hover:text-white text-charcoal border border-sage/30 flex items-center gap-3.5 transition group active:scale-95 text-start"
              >
                <div className="w-11 h-11 rounded-2xl bg-white group-hover:bg-white/20 text-brandRed group-hover:text-white flex items-center justify-center shadow-sm shrink-0">
                  <Wallet className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block">
                    {t.addDailyEntry}
                  </span>
                  <span className="text-[11px] text-sage group-hover:text-white/80 font-medium">
                    {settings.language === 'ar' ? 'مداخيل اليوم، المصاريف وصافي الصندوق' : 'Recettes et sorties de caisse'}
                  </span>
                </div>
              </button>

              {/* Obligation */}
              <button
                onClick={handleOpenAddObligation}
                className="p-3.5 rounded-3xl bg-offwhite hover:bg-charcoal hover:text-white text-charcoal border border-sage/30 flex items-center gap-3.5 transition group active:scale-95 text-start"
              >
                <div className="w-11 h-11 rounded-2xl bg-white group-hover:bg-white/20 text-charcoal group-hover:text-white flex items-center justify-center shadow-sm shrink-0">
                  <ReceiptText className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block">
                    {t.addObligation}
                  </span>
                  <span className="text-[11px] text-sage group-hover:text-white/80 font-medium">
                    {settings.language === 'ar' ? 'كهرباء، ماء، إنترنت، ضرائب، إيجار، صيانة...' : 'Électricité, eau, loyer, impôts...'}
                  </span>
                </div>
              </button>

              {/* Inventory Item */}
              <button
                onClick={handleOpenAddInventory}
                className="p-3.5 rounded-3xl bg-offwhite hover:bg-charcoal hover:text-white text-charcoal border border-sage/30 flex items-center gap-3.5 transition group active:scale-95 text-start"
              >
                <div className="w-11 h-11 rounded-2xl bg-white group-hover:bg-white/20 text-charcoal group-hover:text-white flex items-center justify-center shadow-sm shrink-0">
                  <PackageOpen className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block">
                    {t.addItem}
                  </span>
                  <span className="text-[11px] text-sage group-hover:text-white/80 font-medium">
                    {settings.language === 'ar' ? 'بن، حليب، أكواب، سكر، سيروب...' : 'Café, lait, gobelets, sucre...'}
                  </span>
                </div>
              </button>

              {/* Break-Even Calculator Shortcut */}
              <button
                onClick={handleOpenBreakEven}
                className="p-3.5 rounded-3xl bg-offwhite hover:bg-brandRed hover:text-white text-charcoal border border-sage/30 flex items-center gap-3.5 transition group active:scale-95 text-start"
              >
                <div className="w-11 h-11 rounded-2xl bg-white group-hover:bg-white/20 text-brandRed group-hover:text-white flex items-center justify-center shadow-sm shrink-0">
                  <Scale className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block">
                    {t.breakEvenTitle}
                  </span>
                  <span className="text-[11px] text-sage group-hover:text-white/80 font-medium">
                    {settings.language === 'ar' ? 'كم مشروب يباع لتغطية المصاريف والأرباح' : 'Calculateur de rentabilité'}
                  </span>
                </div>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
