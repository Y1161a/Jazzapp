import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  Check, 
  Receipt, 
  Package, 
  ArrowRight,
  TrendingDown,
  Clock,
  Sparkles,
  Zap,
  Droplet,
  Wifi,
  Home,
  Landmark,
  ShoppingBag,
  HelpCircle
} from 'lucide-react';
import { ObligationCategory } from '../types';

interface DashboardViewProps {
  onOpenAddObligation?: () => void;
  onOpenAddInventory?: () => void;
}

type FilterCategory = 'all' | 'bills' | 'inventory' | 'urgent';

export const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const { t, stats, settings, obligations, inventory, setActiveTab, toggleObligationStatus } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Urgent items
  const urgentBills = obligations
    .filter((o) => o.status !== 'paid' && o.dueDate <= threeDaysFromNow)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const lowStockItems = inventory.filter((item) => item.quantity <= item.minThreshold);

  // Category Icon helper
  const getCategoryIcon = (cat: ObligationCategory) => {
    switch (cat) {
      case 'electricity': return Zap;
      case 'water': return Droplet;
      case 'internet': return Wifi;
      case 'rent': return Home;
      case 'taxes': return Landmark;
      case 'supplies': return ShoppingBag;
      default: return HelpCircle;
    }
  };

  // Horizontal Scroll Selector items
  const selectorItems: { id: FilterCategory; label: string; count: number; icon: string }[] = [
    { id: 'all', label: t.filterAll, count: obligations.length + inventory.length, icon: '☕' },
    { id: 'bills', label: t.navObligations, count: stats.upcomingCount + stats.overdueCount, icon: '📄' },
    { id: 'inventory', label: t.navInventory, count: inventory.length, icon: '📦' },
    { id: 'urgent', label: t.urgentReminders, count: urgentBills.length + lowStockItems.length, icon: '⚡' },
  ];

  return (
    <div className="space-y-6 pb-28 max-w-md mx-auto">

      {/* Horizontal Scroll Selector */}
      {/* Spec: Inactive: 56x56px white square, 16px radius, #b7c6c2/30 border. Active: 160px wide pill in #171e19 with 40px red circle for value */}
      <div className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory pb-1 scrollbar-none px-1">
        {selectorItems.map((item) => {
          const isActive = selectedFilter === item.id;

          if (isActive) {
            return (
              <button
                key={item.id}
                onClick={() => setSelectedFilter(item.id)}
                className="w-[160px] h-14 rounded-full bg-charcoal text-white px-2 flex items-center justify-between shrink-0 shadow-md snap-start transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-brandRed flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm">
                  {item.count}
                </div>
                <span className="text-xs font-black tracking-tight pe-3 truncate">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setSelectedFilter(item.id)}
              className="w-14 h-14 rounded-2xl bg-white border border-sage/30 flex items-center justify-center text-lg shrink-0 shadow-sm hover:border-sage active:scale-95 transition-all snap-start"
              title={item.label}
            >
              <span>{item.icon}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Feature Card */}
      {/* Spec: Large white card with 40px (2.5rem) radius and subtle shadow.
          Contains:
          1. A semi-transparent decorative blob (#b7c6c2/20) in top-right.
          2. A 64x64px white square icon holder with an emoji.
          3. Nested 2-column grid for metrics using white-glass cards (80% opacity) with 16px radius.
          4. An alert/info box at the bottom using #b7c6c2/20 background. */}
      <div className="relative overflow-hidden rounded-[40px] bg-white p-6 shadow-soft border border-sage/20">
        
        {/* 1. Semi-transparent decorative blob in the top-right */}
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-44 h-44 rounded-full bg-sage/20 blur-2xl pointer-events-none" />

        {/* Top Header Row: Icon holder + Title & Status */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* 2. 64x64px white square icon holder with an emoji */}
            <div className="w-16 h-16 rounded-2xl bg-white border border-sage/30 shadow-card flex items-center justify-center text-2xl shrink-0">
              ☕
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sage block">
                {settings.cafeName || 'JAZZAPP'} · {t.appTagline}
              </span>
              <h2 className="text-[20px] font-black text-charcoal leading-snug">
                {settings.language === 'ar' ? 'الملخص المالي والتشغيلي' : 'Résumé des Opérations'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {props.onOpenAddObligation && (
              <button
                onClick={props.onOpenAddObligation}
                className="w-7 h-7 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-black hover:bg-brandRed transition active:scale-90"
                title={t.quickAddBill}
              >
                +
              </button>
            )}
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-charcoal text-white">
              {new Date().toLocaleDateString(settings.language === 'ar' ? 'ar-TN' : 'fr-FR', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* 3. Nested 2-Column Grid for Metrics (Bento cards, 16px radius, 80% opacity white-glass) */}
        <div className="grid grid-cols-2 gap-3 mt-5 relative z-10">
          
          {/* Metric 1: Total Pending Bills */}
          <div 
            onClick={() => setActiveTab('obligations')}
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-sage/30 shadow-sm cursor-pointer hover:border-brandRed/40 transition active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-full bg-brandRed/10 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4 text-brandRed" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage truncate">
                {t.totalPendingBills}
              </span>
            </div>
            <div className="ps-1">
              <div className="text-lg font-black text-charcoal leading-none">
                {stats.totalPending.toLocaleString()}
              </div>
              <span className="text-[10px] font-bold text-sage">
                {settings.currency} · {stats.overdueCount > 0 ? `${stats.overdueCount} ${t.statusOverdue}` : `${stats.upcomingCount} قريبة`}
              </span>
            </div>
          </div>

          {/* Metric 2: Stock Health */}
          <div 
            onClick={() => setActiveTab('inventory')}
            className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-sage/30 shadow-sm cursor-pointer hover:border-brandRed/40 transition active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-full bg-brandRed/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-brandRed" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage truncate">
                {t.inventoryTitle}
              </span>
            </div>
            <div className="ps-1">
              <div className="text-lg font-black text-charcoal leading-none">
                {inventory.length}
              </div>
              <span className="text-[10px] font-bold text-sage">
                {stats.lowStockCount > 0 ? (
                  <strong className="text-brandRed font-black">{stats.lowStockCount} {t.stockLow}</strong>
                ) : (
                  <span className="text-charcoal font-semibold">{t.stockHealthy}</span>
                )}
              </span>
            </div>
          </div>

        </div>

        {/* 4. Alert / Info box at bottom using #b7c6c2/20 background */}
        <div className="mt-4 p-3.5 rounded-2xl bg-sage/20 border border-sage/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              urgentBills.length > 0 || lowStockItems.length > 0
                ? 'bg-brandRed text-white shadow-sm'
                : 'bg-white text-charcoal'
            }`}>
              {urgentBills.length > 0 || lowStockItems.length > 0 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4 text-sage" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-charcoal text-xs truncate">
                {urgentBills.length > 0 || lowStockItems.length > 0
                  ? (settings.language === 'ar' ? 'لديك التزامات أو مواد تتطلب المتابعة الفورية' : 'Des alertes nécessitent votre attention')
                  : t.noUrgentAlerts}
              </p>
              <p className="text-[10px] text-sage font-bold truncate">
                {urgentBills.length} {settings.language === 'ar' ? 'فواتير مستعجلة' : 'charges urgentes'} · {lowStockItems.length} {settings.language === 'ar' ? 'مواد منخفضة' : 'stocks bas'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab(urgentBills.length > 0 ? 'obligations' : 'inventory')}
            className="w-8 h-8 rounded-full bg-white text-charcoal flex items-center justify-center shrink-0 hover:bg-brandRed hover:text-white transition active:scale-90 shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Secondary Feed Items */}
      {/* Spec: Vertical list of cards with 24px radius, white background, #b7c6c2/30 border.
          Features:
          - 56px icon container with 10% opacity color background
          - 18px bold headings
          - Circular trailing checkbox button (40px) that changes to red on hover/click */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[18px] font-black text-charcoal tracking-tight flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sage" />
            <span>{settings.language === 'ar' ? 'الالتزامات والمواد الأقرب' : 'Charges & Stocks Prioritaires'}</span>
          </h3>
          <button 
            onClick={() => setActiveTab('obligations')}
            className="text-xs font-bold text-sage hover:text-charcoal"
          >
            {t.viewAll}
          </button>
        </div>

        {/* Feed Cards List */}
        <div className="space-y-2.5">
          {/* Urgent Bills in Feed */}
          {urgentBills.map((bill) => {
            const Icon = getCategoryIcon(bill.category);
            const isOverdue = bill.dueDate < todayStr;

            return (
              <div
                key={bill.id}
                className="p-4 rounded-[24px] bg-white border border-sage/30 shadow-card flex items-center justify-between gap-3 hover:border-sage transition"
              >
                {/* 56px Icon Container with 10% opacity color background */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    isOverdue ? 'bg-brandRed/10 text-brandRed' : 'bg-charcoal/10 text-charcoal'
                  }`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sage">
                        {bill.dueDate}
                      </span>
                      {isOverdue && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-brandRed text-white">
                          {t.statusOverdue}
                        </span>
                      )}
                    </div>
                    {/* 18px bold heading */}
                    <h4 className="text-[17px] font-extrabold text-charcoal truncate mt-0.5">
                      {bill.title}
                    </h4>
                    <p className="text-xs font-black text-brandRed mt-0.5">
                      {bill.amount.toLocaleString()} <span className="text-[10px] font-bold text-sage">{bill.currency}</span>
                    </p>
                  </div>
                </div>

                {/* Circular trailing checkbox button (40px) that changes to red on hover/click */}
                <button
                  onClick={() => toggleObligationStatus(bill.id)}
                  className="w-10 h-10 rounded-full border-2 border-sage/40 flex items-center justify-center text-sage hover:border-brandRed hover:bg-brandRed hover:text-white transition active:scale-90 shrink-0"
                  title={t.markAsPaid}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            );
          })}

          {/* Low Stock Items in Feed */}
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-[24px] bg-white border border-sage/30 shadow-card flex items-center justify-between gap-3 hover:border-sage transition"
            >
              {/* 56px Icon Container */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center shrink-0">
                  <TrendingDown className="w-6 h-6 stroke-[2]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sage">
                      {t.navInventory}
                    </span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-brandRed text-white">
                      {t.stockLow}
                    </span>
                  </div>
                  <h4 className="text-[17px] font-extrabold text-charcoal truncate mt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-xs font-extrabold text-charcoal mt-0.5">
                    {item.quantity} {item.unit} <span className="text-[10px] text-sage font-medium">({t.itemMinThreshold}: {item.minThreshold})</span>
                  </p>
                </div>
              </div>

              {/* 40px Action Button */}
              <button
                onClick={() => setActiveTab('inventory')}
                className="w-10 h-10 rounded-full border-2 border-sage/40 flex items-center justify-center text-sage hover:border-brandRed hover:bg-brandRed hover:text-white transition active:scale-90 shrink-0 font-black text-lg"
                title={t.quickStockIn}
              >
                +
              </button>
            </div>
          ))}

          {/* If no urgent items: show clean placeholder card */}
          {urgentBills.length === 0 && lowStockItems.length === 0 && (
            <div className="p-8 rounded-[24px] bg-white border border-sage/30 text-center shadow-card space-y-2">
              <div className="w-12 h-12 rounded-full bg-sage/20 text-charcoal mx-auto flex items-center justify-center text-xl">
                ✨
              </div>
              <h4 className="text-[16px] font-black text-charcoal">
                {t.noUrgentAlerts}
              </h4>
              <p className="text-xs text-sage font-bold">
                {settings.language === 'ar' ? 'جميع الفواتير مدفوعة أو بعيدة الأجل، والمخزون في مستوى ممتاز.' : 'Toutes les charges sont à jour et le stock est optimal.'}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
