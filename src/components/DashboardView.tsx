import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Package, 
  ArrowUpRight, 
  PlusCircle, 
  Sparkles,
  Zap,
  TrendingDown,
  CalendarCheck
} from 'lucide-react';
import { ObligationCategory } from '../types';

interface DashboardViewProps {
  onOpenAddObligation: () => void;
  onOpenAddInventory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onOpenAddObligation, 
  onOpenAddInventory 
}) => {
  const { t, stats, settings, obligations, inventory, setActiveTab, toggleObligationStatus } = useApp();

  const formattedDate = new Intl.DateTimeFormat(
    settings.language === 'ar' ? 'ar-TN' : 'fr-FR',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  ).format(new Date());

  // Filter urgent bills: overdue or due within 3 days
  const todayStr = new Date().toISOString().split('T')[0];
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const urgentBills = obligations
    .filter((o) => o.status !== 'paid' && o.dueDate <= threeDaysFromNow)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  // Critical stock items (<= minThreshold)
  const lowStockItems = inventory.filter((item) => item.quantity <= item.minThreshold);

  // Category translations helper
  const getCategoryLabel = (cat: ObligationCategory) => {
    switch (cat) {
      case 'electricity': return t.catElectricity;
      case 'water': return t.catWater;
      case 'internet': return t.catInternet;
      case 'rent': return t.catRent;
      case 'taxes': return t.catTaxes;
      case 'maintenance': return t.catMaintenance;
      case 'supplies': return t.catSupplies;
      default: return t.catOther;
    }
  };

  return (
    <div className="space-y-6 pb-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-cafe-900 via-jazz-surface to-cafe-950 text-white shadow-xl shadow-black/20 border border-jazz-border">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-44 h-44 rounded-full bg-jazz-gold/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-jazz-gold font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-stone-200 border border-white/10">
              {settings.cafeName}
            </span>
          </div>

          <div className="mt-3">
            <h1 className="text-2xl font-black tracking-tight text-jazz-crema">
              {t.welcomeBack}
            </h1>
            <p className="text-xs text-cafe-300 mt-0.5 font-medium">
              {t.quickSummary}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
            <button
              onClick={onOpenAddObligation}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-jazz-gold to-cafe-500 text-cafe-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.quickAddBill}</span>
            </button>
            <button
              onClick={onOpenAddInventory}
              className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-jazz-crema font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition"
            >
              <Package className="w-3.5 h-3.5 text-jazz-gold" />
              <span>{t.quickAddStock}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Pending Bills */}
        <div 
          onClick={() => setActiveTab('obligations')} 
          className="p-4 rounded-2xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border shadow-sm cursor-pointer hover:border-cafe-400 dark:hover:border-jazz-gold/40 transition active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cafe-600 dark:text-stone-400">
              {t.totalPendingBills}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-cafe-900 dark:text-jazz-crema">
              {stats.totalPending.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-cafe-600 dark:text-jazz-amber">
              {settings.currency}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <Clock className="w-3 h-3" />
            <span>{stats.overdueCount > 0 ? `${stats.overdueCount} ${t.statusOverdue}` : `${stats.upcomingCount} ${t.upcomingBillsCount}`}</span>
          </div>
        </div>

        {/* Total Paid This Month */}
        <div 
          onClick={() => setActiveTab('obligations')}
          className="p-4 rounded-2xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border shadow-sm cursor-pointer hover:border-cafe-400 dark:hover:border-jazz-gold/40 transition active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cafe-600 dark:text-stone-400">
              {t.totalPaidBills}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-cafe-900 dark:text-jazz-crema">
              {stats.totalPaidThisMonth.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-cafe-600 dark:text-jazz-amber">
              {settings.currency}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <CalendarCheck className="w-3 h-3" />
            <span>{t.statusPaid}</span>
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className={`p-4 rounded-2xl border shadow-sm cursor-pointer transition active:scale-[0.98] ${
            stats.lowStockCount > 0 
              ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50' 
              : 'bg-white dark:bg-jazz-surface border-cafe-200 dark:border-jazz-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cafe-600 dark:text-stone-400">
              {t.lowStockAlertsCount}
            </span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              stats.lowStockCount > 0 ? 'bg-rose-500/15 text-rose-500 animate-pulse' : 'bg-cafe-100 dark:bg-jazz-card text-cafe-500'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-xl font-extrabold ${stats.lowStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-cafe-900 dark:text-jazz-crema'}`}>
              {stats.lowStockCount}
            </span>
            <span className="text-xs font-medium text-cafe-500">
              {settings.language === 'ar' ? 'مواد' : 'articles'}
            </span>
          </div>
          <div className="mt-1 text-[11px] font-semibold text-cafe-500 dark:text-stone-400">
            {stats.lowStockCount > 0 ? (
              <span className="text-rose-600 dark:text-rose-400">{t.stockLow}</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">{t.stockHealthy}</span>
            )}
          </div>
        </div>

        {/* Total Inventory Items */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className="p-4 rounded-2xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border shadow-sm cursor-pointer hover:border-cafe-400 dark:hover:border-jazz-gold/40 transition active:scale-[0.98]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cafe-600 dark:text-stone-400">
              {t.inventoryTitle}
            </span>
            <div className="w-7 h-7 rounded-lg bg-cafe-500/10 text-cafe-600 dark:text-jazz-gold flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-cafe-900 dark:text-jazz-crema">
              {inventory.length}
            </span>
            <span className="text-xs font-medium text-cafe-500">
              {settings.language === 'ar' ? 'صنف مسجل' : 'références'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-cafe-600 dark:text-jazz-amber font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>{t.viewAll}</span>
          </div>
        </div>
      </div>

      {/* Urgent Reminders Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-cafe-900 dark:text-jazz-crema flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-jazz-gold" />
            <span>{t.urgentReminders}</span>
          </h2>
          <span className="text-xs font-bold text-cafe-500 dark:text-stone-400">
            {urgentBills.length + lowStockItems.length} {settings.language === 'ar' ? 'تنبيه' : 'alertes'}
          </span>
        </div>

        {urgentBills.length === 0 && lowStockItems.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-cafe-800 dark:text-stone-200">
              {t.noUrgentAlerts}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Urgent Bills list */}
            {urgentBills.map((bill) => {
              const isOverdue = bill.dueDate < todayStr;
              return (
                <div 
                  key={bill.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-jazz-surface border border-amber-200 dark:border-amber-900/40 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isOverdue ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-cafe-900 dark:text-stone-100 truncate">
                          {bill.title}
                        </span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                          isOverdue 
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' 
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        }`}>
                          {isOverdue ? t.statusOverdue : (bill.dueDate === todayStr ? t.today : `${t.dueIn} ${bill.dueDate}`)}
                        </span>
                      </div>
                      <div className="text-[11px] text-cafe-500 dark:text-stone-400 mt-0.5">
                        {getCategoryLabel(bill.category)} · <span className="font-bold text-cafe-800 dark:text-jazz-amber">{bill.amount} {bill.currency}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleObligationStatus(bill.id)}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-cafe-100 dark:bg-jazz-card hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 text-xs font-bold text-cafe-800 dark:text-stone-200 border border-cafe-300 dark:border-jazz-border transition active:scale-95"
                  >
                    {t.markAsPaid}
                  </button>
                </div>
              );
            })}

            {/* Low Stock Items list */}
            {lowStockItems.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-jazz-surface border border-rose-200 dark:border-rose-900/40 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-cafe-900 dark:text-stone-100 truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                        {t.stockLow}
                      </span>
                    </div>
                    <div className="text-[11px] text-cafe-500 dark:text-stone-400 mt-0.5">
                      {t.currentStock}: <span className="font-bold text-rose-600 dark:text-rose-400">{item.quantity} {item.unit}</span> (الحد: {item.minThreshold} {item.unit})
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cafe-700 to-jazz-gold text-white text-xs font-bold shadow-sm active:scale-95 transition"
                >
                  {t.quickStockIn}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
