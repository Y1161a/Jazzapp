import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PackageOpen, 
  Scale, 
  Wallet, 
  Plus,
  Settings
} from 'lucide-react';

interface BottomNavProps {
  onCenterAction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onCenterAction }) => {
  const { activeTab, setActiveTab, t } = useApp();

  return (
    <div className="fixed bottom-2 inset-x-2 max-w-md mx-auto z-40">
      <nav className="relative h-16 rounded-full bg-charcoal px-2 flex items-center justify-between shadow-[0_20px_50px_-10px_rgba(23,30,25,0.4)] border border-sage/20">
        
        {/* Left Side: Dashboard, Obligations, Inventory */}
        <div className="flex items-center justify-around flex-1 pe-1">
          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-10 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'dashboard' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navDashboard}
            aria-label={t.navDashboard}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'stroke-[2.5] text-brandRed' : 'stroke-[1.8]'}`} />
            <span className="text-[8px] font-black mt-0.5 tracking-tight truncate max-w-[42px]">
              {t.navDashboard}
            </span>
          </button>

          {/* Obligations Tab */}
          <button
            onClick={() => setActiveTab('obligations')}
            className={`w-10 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'obligations' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navObligations}
            aria-label={t.navObligations}
          >
            <ReceiptText className={`w-4 h-4 ${activeTab === 'obligations' ? 'stroke-[2.5] text-brandRed' : 'stroke-[1.8]'}`} />
            <span className="text-[8px] font-black mt-0.5 tracking-tight truncate max-w-[42px]">
              {t.navObligations}
            </span>
          </button>

          {/* Inventory Tab */}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-10 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'inventory' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navInventory}
            aria-label={t.navInventory}
          >
            <PackageOpen className={`w-4 h-4 ${activeTab === 'inventory' ? 'stroke-[2.5] text-brandRed' : 'stroke-[1.8]'}`} />
            <span className="text-[8px] font-black mt-0.5 tracking-tight truncate max-w-[42px]">
              {t.navInventory}
            </span>
          </button>
        </div>

        {/* Center Floating Action Button (FAB) */}
        {/* Spec: 56px red circular button using #ca0013, offset vertically by -32px, 4px #eeebe3 border */}
        <div className="relative -top-6 flex items-center justify-center px-0.5 shrink-0">
          <button
            onClick={onCenterAction}
            className="w-14 h-14 rounded-full bg-brandRed flex items-center justify-center text-white border-4 border-offwhite shadow-[0_12px_28px_-4px_rgba(202,0,19,0.5)] active:scale-90 hover:bg-brandRed-hover transition duration-200"
            title={t.quickAddBill}
            aria-label="Add"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Side: Break-Even, Daily Cash, Settings */}
        <div className="flex items-center justify-around flex-1 ps-1">
          {/* Break-Even Tab */}
          <button
            onClick={() => setActiveTab('breakeven')}
            className={`w-10 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'breakeven' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navBreakEven}
            aria-label={t.navBreakEven}
          >
            <Scale className={`w-4 h-4 ${activeTab === 'breakeven' ? 'stroke-[2.5] text-brandRed' : 'stroke-[1.8]'}`} />
            <span className="text-[8px] font-black mt-0.5 tracking-tight truncate max-w-[42px]">
              {t.navBreakEven}
            </span>
          </button>

          {/* Daily Cash Tab */}
          <button
            onClick={() => setActiveTab('daily')}
            className={`w-10 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'daily' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navDaily}
            aria-label={t.navDaily}
          >
            <Wallet className={`w-4 h-4 ${activeTab === 'daily' ? 'stroke-[2.5] text-brandRed' : 'stroke-[1.8]'}`} />
            <span className="text-[8px] font-black mt-0.5 tracking-tight truncate max-w-[42px]">
              {t.navDaily}
            </span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-10 h-12 rounded-full flex flex-col items-center justify-center transition active:scale-95 ${
              activeTab === 'settings' ? 'text-white' : 'text-sage hover:text-white'
            }`}
            title={t.navSettings}
            aria-label={t.navSettings}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'stroke-[2.5] text-brandRed' : 'stroke-[1.8]'}`} />
            <span className="text-[8px] font-black mt-0.5 tracking-tight truncate max-w-[42px]">
              {t.navSettings}
            </span>
          </button>
        </div>

      </nav>
    </div>
  );
};

export default BottomNav;
