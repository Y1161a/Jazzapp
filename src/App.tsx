import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { ObligationsView } from './components/ObligationsView';
import { InventoryView } from './components/InventoryView';
import { SettingsView } from './components/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isAddObligationOpen, setIsAddObligationOpen] = useState(false);
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration skipped/failed:', err);
        });
      });
    }
  }, []);

  const handleOpenAddObligation = () => {
    setActiveTab('obligations');
    setIsAddObligationOpen(true);
  };

  const handleOpenAddInventory = () => {
    setActiveTab('inventory');
    setIsAddInventoryOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cafe-50 text-stone-900 dark:bg-jazz-night dark:text-stone-100 transition-colors duration-200">
      
      {/* Top Header */}
      <Header />

      {/* Main Scrollable View */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-4 pb-24">
        {activeTab === 'dashboard' && (
          <DashboardView 
            onOpenAddObligation={handleOpenAddObligation}
            onOpenAddInventory={handleOpenAddInventory}
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

        {activeTab === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Fixed Ergonomic Bottom Navigation */}
      <BottomNav />

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
