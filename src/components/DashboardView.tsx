import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ReceiptText, 
  PackageOpen, 
  Scale, 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Calendar
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAddObligation?: () => void;
  onOpenAddInventory?: () => void;
  onOpenAddDaily?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const { 
    t, 
    stats, 
    settings, 
    obligations, 
    inventory, 
    breakEvenMetrics, 
    todayRecord, 
    setActiveTab 
  } = useApp();

  const todayNet = todayRecord ? todayRecord.revenue - todayRecord.expenses : 0;
  const isBreakEvenDone = breakEvenMetrics.todayDrinksSold >= breakEvenMetrics.breakEvenDrinksDaily && breakEvenMetrics.breakEvenDrinksDaily > 0;

  // Urgent alerts
  const urgentBills = obligations.filter(
    (o) => o.status !== 'paid' && o.dueDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const lowStockItems = inventory.filter((item) => item.quantity <= item.minThreshold);

  return (
    <div className="space-y-6 pb-28 max-w-md mx-auto animate-in fade-in duration-200">
      
      {/* Welcome Banner / Today's Date */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-sage block">
            {settings.cafeName || 'JAZZAPP'} · {t.creatorBadge}
          </span>
          <h1 className="text-2xl font-black text-charcoal">
            {t.welcomeBack}
          </h1>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white border border-sage/30 shadow-sm text-[11px] font-black text-charcoal flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-brandRed" />
          <span>
            {new Date().toLocaleDateString(settings.language === 'ar' ? 'ar-TN' : 'fr-FR', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* 🌟 The 4 Primary Choice Cards (Requested by User) */}
      {/* 1. الالتزامات المادية (فواتير، صيانة، إنترنت) */}
      {/* 2. المخزون من السلع */}
      {/* 3. نقطة التعادل (كم مشروب يغطي المصاريف) */}
      {/* 4. العائد المالي لليوم والمصاريف */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Card 1: الالتزامات المادية */}
        <button
          onClick={() => setActiveTab('obligations')}
          className="group relative overflow-hidden p-5 rounded-[32px] bg-white border border-sage/30 shadow-card hover:border-brandRed hover:shadow-lg transition-all duration-200 active:scale-98 text-start flex flex-col justify-between min-h-[145px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center group-hover:bg-brandRed group-hover:text-white transition-colors duration-200 shadow-sm shrink-0">
              <ReceiptText className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-offwhite group-hover:bg-charcoal group-hover:text-white flex items-center justify-center text-charcoal transition">
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="font-black text-base text-charcoal group-hover:text-brandRed transition">
              {t.cardObligationsTitle}
            </h3>
            <p className="text-[11px] text-sage font-medium mt-0.5 line-clamp-1">
              {t.cardObligationsSubtitle}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-black text-charcoal">
                {stats.totalPending.toLocaleString()} {settings.currency}
              </span>
              {stats.overdueCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-brandRed text-white text-[9px] font-black animate-pulse">
                  {stats.overdueCount} {t.statusOverdue}
                </span>
              ) : (
                <span className="text-[10px] text-sage font-bold">
                  ({obligations.length} {settings.language === 'ar' ? 'التزام' : 'charges'})
                </span>
              )}
            </div>
          </div>
        </button>

        {/* Card 2: المخزون من السلع */}
        <button
          onClick={() => setActiveTab('inventory')}
          className="group relative overflow-hidden p-5 rounded-[32px] bg-white border border-sage/30 shadow-card hover:border-charcoal hover:shadow-lg transition-all duration-200 active:scale-98 text-start flex flex-col justify-between min-h-[145px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-charcoal/10 text-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-colors duration-200 shadow-sm shrink-0">
              <PackageOpen className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-offwhite group-hover:bg-charcoal group-hover:text-white flex items-center justify-center text-charcoal transition">
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="font-black text-base text-charcoal group-hover:text-charcoal transition">
              {t.cardInventoryTitle}
            </h3>
            <p className="text-[11px] text-sage font-medium mt-0.5 line-clamp-1">
              {t.cardInventorySubtitle}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-black text-charcoal">
                {inventory.length} {settings.language === 'ar' ? 'مواد متوفرة' : 'articles'}
              </span>
              {stats.lowStockCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-brandRed/10 text-brandRed text-[9px] font-black">
                  {stats.lowStockCount} {t.stockLow}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black">
                  {t.stockHealthy}
                </span>
              )}
            </div>
          </div>
        </button>

        {/* Card 3: نقطة التعادل (كم مشروب يغطي المصاريف) */}
        <button
          onClick={() => setActiveTab('breakeven')}
          className="group relative overflow-hidden p-5 rounded-[32px] bg-white border border-sage/30 shadow-card hover:border-brandRed hover:shadow-lg transition-all duration-200 active:scale-98 text-start flex flex-col justify-between min-h-[145px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center group-hover:bg-brandRed group-hover:text-white transition-colors duration-200 shadow-sm shrink-0">
              <Scale className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-offwhite group-hover:bg-charcoal group-hover:text-white flex items-center justify-center text-charcoal transition">
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="font-black text-base text-charcoal group-hover:text-brandRed transition">
              {t.cardBreakEvenTitle}
            </h3>
            <p className="text-[11px] text-sage font-medium mt-0.5 line-clamp-1">
              {t.cardBreakEvenSubtitle}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-black text-brandRed">
                {breakEvenMetrics.breakEvenDrinksDaily} {t.drinksPerDay}
              </span>
              <span className="text-[10px] text-sage font-bold">
                ({breakEvenMetrics.todayDrinksPercent}% {settings.language === 'ar' ? 'تم تحقيقه' : 'atteint'})
              </span>
            </div>
          </div>
        </button>

        {/* Card 4: العائد المالي لليوم والمصاريف */}
        <button
          onClick={() => setActiveTab('daily')}
          className="group relative overflow-hidden p-5 rounded-[32px] bg-white border border-sage/30 shadow-card hover:border-charcoal hover:shadow-lg transition-all duration-200 active:scale-98 text-start flex flex-col justify-between min-h-[145px]"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-14 h-14 rounded-2xl bg-charcoal/10 text-charcoal flex items-center justify-center group-hover:bg-charcoal group-hover:text-white transition-colors duration-200 shadow-sm shrink-0">
              <Wallet className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="w-8 h-8 rounded-full bg-offwhite group-hover:bg-charcoal group-hover:text-white flex items-center justify-center text-charcoal transition">
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="font-black text-base text-charcoal group-hover:text-charcoal transition">
              {t.cardDailyTitle}
            </h3>
            <p className="text-[11px] text-sage font-medium mt-0.5 line-clamp-1">
              {t.cardDailySubtitle}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs font-black ${todayNet >= 0 ? 'text-charcoal' : 'text-brandRed'}`}>
                {todayRecord ? (todayNet >= 0 ? `+${todayNet} ${settings.currency}` : `${todayNet} ${settings.currency}`) : (settings.language === 'ar' ? 'سجل مداخيل اليوم' : 'Saisir aujourd’hui')}
              </span>
              {todayRecord && (
                <span className="text-[10px] text-sage font-bold">
                  ({todayRecord.drinksSold || 0} {t.drinksUnit})
                </span>
              )}
            </div>
          </div>
        </button>

      </div>

      {/* Hero Feature Card: Pulse of the Day (Spec: 40px radius, white card, blob, 64px icon, bento metrics) */}
      <div className="relative overflow-hidden rounded-[40px] bg-white p-6 shadow-soft border border-sage/20">
        
        {/* Blob */}
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-44 h-44 rounded-full bg-sage/20 blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white border border-sage/30 shadow-card flex items-center justify-center text-3xl shrink-0">
              ☕
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sage block">
                {settings.language === 'ar' ? 'مؤشر أداء اليوم' : 'Performance du jour'}
              </span>
              <h2 className="text-xl font-black text-charcoal leading-snug">
                {todayRecord 
                  ? (settings.language === 'ar' ? `صافي اليوم: +${todayNet} ${settings.currency}` : `Net: +${todayNet} ${settings.currency}`)
                  : (settings.language === 'ar' ? 'لم تسجل صندوق اليوم بعد' : 'Journée non enregistrée')}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('daily')}
            className="px-3.5 py-1.5 rounded-full bg-brandRed text-white text-[11px] font-black hover:bg-brandRed-hover active:scale-95 transition shadow-sm"
          >
            {todayRecord ? (settings.language === 'ar' ? 'عرض الصندوق' : 'Voir') : (settings.language === 'ar' ? '+ تسجيل اليوم' : '+ Saisir')}
          </button>
        </div>

        {/* Progress towards Break-Even Target */}
        <div className="relative z-10 mt-5 pt-4 border-t border-sage/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brandRed" />
              {settings.language === 'ar' ? 'تغطية مصاريف اليوم بالقهوة:' : 'Couverture du seuil :'}
            </span>
            <span className="font-black">
              {breakEvenMetrics.todayDrinksSold} / {breakEvenMetrics.breakEvenDrinksDaily} {t.drinksUnit} ({breakEvenMetrics.todayDrinksPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-offwhite rounded-full overflow-hidden p-0.5 border border-sage/30">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isBreakEvenDone ? 'bg-emerald-500' : 'bg-brandRed'
              }`}
              style={{ width: `${Math.min(100, breakEvenMetrics.todayDrinksPercent)}%` }}
            />
          </div>
        </div>

        {/* 2-Column Bento Metrics: Pending obligations + Inventory low stock */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mt-4">
          <div 
            onClick={() => setActiveTab('obligations')}
            className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-sage/30 shadow-sm cursor-pointer hover:border-brandRed transition"
          >
            <span className="text-[10px] font-bold text-sage uppercase tracking-wider block">
              {t.totalPendingBills}
            </span>
            <span className="text-base font-black text-charcoal block mt-1">
              {stats.totalPending.toLocaleString()} {settings.currency}
            </span>
            <span className="text-[10px] text-sage font-medium block">
              {stats.overdueCount > 0 ? `${stats.overdueCount} متأخرة` : `${stats.upcomingCount} قريبة`}
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('inventory')}
            className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-sage/30 shadow-sm cursor-pointer hover:border-charcoal transition"
          >
            <span className="text-[10px] font-bold text-sage uppercase tracking-wider block">
              {t.inventoryTitle}
            </span>
            <span className="text-base font-black text-charcoal block mt-1">
              {inventory.length} {settings.language === 'ar' ? 'مادة' : 'articles'}
            </span>
            <span className={`text-[10px] font-medium block ${stats.lowStockCount > 0 ? 'text-brandRed font-bold' : 'text-sage'}`}>
              {stats.lowStockCount > 0 ? `${stats.lowStockCount} ناقصة` : t.stockHealthy}
            </span>
          </div>
        </div>

        {/* Urgent Alert Banner (if any) */}
        {(urgentBills.length > 0 || lowStockItems.length > 0) && (
          <div className="relative z-10 mt-4 p-3.5 rounded-2xl bg-sage/20 border border-sage/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-brandRed shrink-0" />
              <span className="text-xs font-bold text-charcoal">
                {urgentBills.length > 0 && `${urgentBills.length} فواتير عاجلة للاستحقاق`}
                {urgentBills.length > 0 && lowStockItems.length > 0 && ' · '}
                {lowStockItems.length > 0 && `${lowStockItems.length} مواد قاربت على النفاد`}
              </span>
            </div>
            <button
              onClick={() => setActiveTab(urgentBills.length > 0 ? 'obligations' : 'inventory')}
              className="text-xs font-black text-brandRed hover:underline shrink-0 ms-2"
            >
              {t.viewAll}
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default DashboardView;
