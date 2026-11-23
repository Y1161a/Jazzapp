import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ReceiptText, PackageOpen, Settings, Plus } from 'lucide-react';

interface BottomNavProps {
  onCenterAction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onCenterAction }) => {
  const { activeTab, setActiveTab, t } = useApp();

  return (
    <div className="fixed bottom-2 inset-x-3 max-w-md mx-auto z-40">
      <nav className="relative h-16 rounded-full bg-charcoal px-3 flex items-center justify-between shadow-[0_20px_50px_-10px_rgba(23,30,25,0.4)] border border-sage/20">
        
        {/* Left Side: Dashboard & Obligations */}
        <div className="flex items-center gap-1 flex-1 justify-around">
          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'dashboard' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navDashboard}
            aria-label={t.navDashboard}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight truncate max-w-[50px]">
              {t.navDashboard}
            </span>
          </button>

          {/* Obligations Tab */}
          <button
            onClick={() => setActiveTab('obligations')}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'obligations' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navObligations}
            aria-label={t.navObligations}
          >
            <ReceiptText className={`w-5 h-5 ${activeTab === 'obligations' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight truncate max-w-[50px]">
              {t.navObligations}
            </span>
          </button>
        </div>

        {/* Center Floating Action Button (FAB) */}
        {/* Spec: 56px red circular button using #ca0013, offset vertically by -32px, 4px #eeebe3 border */}
        <div className="relative -top-7 flex items-center justify-center px-1">
          <button
            onClick={onCenterAction}
            className="w-14 h-14 rounded-full bg-brandRed flex items-center justify-center text-white border-4 border-offwhite shadow-[0_12px_28px_-4px_rgba(202,0,19,0.5)] active:scale-90 hover:bg-brandRed-hover transition duration-200"
            title={t.quickAddBill}
            aria-label="Add"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Side: Inventory & Settings */}
        <div className="flex items-center gap-1 flex-1 justify-around">
          {/* Inventory Tab */}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'inventory' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navInventory}
            aria-label={t.navInventory}
          >
            <PackageOpen className={`w-5 h-5 ${activeTab === 'inventory' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight truncate max-w-[50px]">
              {t.navInventory}
            </span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'settings' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navSettings}
            aria-label={t.navSettings}
          >
            <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight truncate max-w-[50px]">
              {t.navSettings}
            </span>
          </button>
        </div>

      </nav>
    </div>
  );
};
