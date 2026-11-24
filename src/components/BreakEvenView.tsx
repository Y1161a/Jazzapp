import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Sparkles, 
  Calculator, 
  HelpCircle, 
  CheckCircle2, 
  Coins, 
  Calendar, 
  Layers, 
  ArrowRight 
} from 'lucide-react';

export const BreakEvenView: React.FC = () => {
  const { t, settings, breakEvenConfig, updateBreakEvenConfig, breakEvenMetrics, obligations, setActiveTab } = useApp();

  const [useAuto, setUseAuto] = useState<boolean>(breakEvenConfig.useAutoObligations);
  const [customExpenses, setCustomExpenses] = useState<number>(breakEvenConfig.customMonthlyExpenses);
  const [drinkPrice, setDrinkPrice] = useState<number>(breakEvenConfig.avgDrinkPrice);
  const [drinkCost, setDrinkCost] = useState<number>(breakEvenConfig.avgDrinkCost);
  const [workingDays, setWorkingDays] = useState<number>(breakEvenConfig.workingDaysPerMonth);

  const handleSaveConfig = () => {
    updateBreakEvenConfig({
      useAutoObligations: useAuto,
      customMonthlyExpenses: Number(customExpenses) || 0,
      avgDrinkPrice: Number(drinkPrice) || 2.5,
      avgDrinkCost: Number(drinkCost) || 0.65,
      workingDaysPerMonth: Number(workingDays) || 30,
    });
  };

  const isAchieved = breakEvenMetrics.todayDrinksSold >= breakEvenMetrics.breakEvenDrinksDaily && breakEvenMetrics.breakEvenDrinksDaily > 0;
  const remainingDrinks = Math.max(0, breakEvenMetrics.breakEvenDrinksDaily - breakEvenMetrics.todayDrinksSold);
  const marginPercentage = breakEvenConfig.avgDrinkPrice > 0 
    ? Math.round((breakEvenMetrics.contributionMargin / breakEvenConfig.avgDrinkPrice) * 100) 
    : 0;

  return (
    <div className="space-y-6 pb-28 max-w-md mx-auto animate-in fade-in duration-200">
      
      {/* Title & Subtitle */}
      <div className="px-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-brandRed animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-sage">
            {t.breakEvenTitle}
          </span>
        </div>
        <h1 className="text-2xl font-black text-charcoal">
          {settings.language === 'ar' ? 'كم من مشروب يغطي مصاريفك؟' : 'Seuil de Rentabilité'}
        </h1>
        <p className="text-xs text-sage font-medium mt-0.5">
          {t.breakEvenSubtitle}
        </p>
      </div>

      {/* Hero Feature Card (Spec: 40px radius, white card, blob, 64px icon, bento metrics) */}
      <div className="relative overflow-hidden rounded-[40px] bg-white p-6 shadow-soft border border-sage/20">
        
        {/* Decorative Blob */}
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-44 h-44 rounded-full bg-sage/20 blur-2xl pointer-events-none" />

        {/* Top Row: Icon holder + Daily Target */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white border border-sage/30 shadow-card flex items-center justify-center text-3xl shrink-0">
              ☕
            </div>
            <div>
              <span className="text-[10px] font-bold text-sage uppercase tracking-wider block">
                {t.breakEvenDailyTarget}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black text-charcoal tracking-tight">
                  {breakEvenMetrics.breakEvenDrinksDaily}
                </span>
                <span className="text-xs font-bold text-sage">
                  {t.drinksPerDay}
                </span>
              </div>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-offwhite border border-sage/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brandRed" />
            <span className="text-[10px] font-extrabold text-charcoal">
              {marginPercentage}% {settings.language === 'ar' ? 'هامش ربح' : 'marge'}
            </span>
          </div>
        </div>

        {/* Progress Towards Today's Break-even */}
        <div className="relative z-10 mt-5 pt-4 border-t border-sage/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-charcoal flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brandRed" />
              {t.todayCoverProgress}
            </span>
            <span className="text-charcoal font-black">
              {breakEvenMetrics.todayDrinksSold} / {breakEvenMetrics.breakEvenDrinksDaily} {t.drinksUnit} ({breakEvenMetrics.todayDrinksPercent}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-offwhite rounded-full overflow-hidden p-0.5 border border-sage/30">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isAchieved ? 'bg-emerald-500' : 'bg-brandRed'
              }`}
              style={{ width: `${Math.min(100, breakEvenMetrics.todayDrinksPercent)}%` }}
            />
          </div>

          {isAchieved ? (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.breakEvenAchieved}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[11px] font-bold text-sage px-1">
              <span>{t.breakEvenRemaining}</span>
              <span className="text-brandRed font-black">
                {remainingDrinks} {t.drinksUnit}
              </span>
            </div>
          )}
        </div>

        {/* Nested 2-column Bento Metric Cards (16px radius, 80% opacity) */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mt-5">
          <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-sage/30 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brandRed/10 text-brandRed flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-sage uppercase tracking-wider truncate">
                {t.breakEvenMonthlyTarget}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-charcoal">
                {breakEvenMetrics.breakEvenDrinksMonthly.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-sage ms-1">
                {t.drinksUnit}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-sage/30 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brandRed/10 text-brandRed flex items-center justify-center shrink-0">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-sage uppercase tracking-wider truncate">
                {t.contributionMarginLabel}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-brandRed">
                +{breakEvenMetrics.contributionMargin}
              </span>
              <span className="text-[10px] font-bold text-sage ms-1">
                {settings.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Alert / Info Box (Spec: #b7c6c2/20 background) */}
        <div className="relative z-10 mt-4 p-3.5 rounded-2xl bg-sage/20 border border-sage/30 text-charcoal text-[11px] font-medium leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-brandRed shrink-0 mt-0.5" />
          <p>
            {settings.language === 'ar' ? (
              <>
                <strong>معادلة النجاح:</strong> كل فنجان تبيعه يترك هامشاً قدره <strong className="text-brandRed">{breakEvenMetrics.contributionMargin} {settings.currency}</strong> بعد دفع تكلفة القهوة والحليب. بمجرد تغطية المصاريف اليومية (<strong className="text-charcoal">{breakEvenMetrics.breakEvenDrinksDaily} مشروب</strong>)، تصبح كل قهوة أرباحاً صافية للمقهى!
              </>
            ) : (
              <>
                <strong>Principe clé :</strong> Chaque boisson dégage une marge de <strong className="text-brandRed">+{breakEvenMetrics.contributionMargin} {settings.currency}</strong>. Dès que l’objectif de <strong className="text-charcoal">{breakEvenMetrics.breakEvenDrinksDaily} boissons/jour</strong> est dépassé, chaque vente génère du bénéfice pur !
              </>
            )}
          </p>
        </div>

      </div>

      {/* Calculator Settings Card (24px radius) */}
      <div className="rounded-[32px] bg-white p-5 shadow-sm border border-sage/20 space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-sage/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-charcoal">
                {settings.language === 'ar' ? 'تعديل أسعار وتكاليف المقهى' : 'Paramètres de calcul'}
              </h2>
              <span className="text-[10px] text-sage font-bold">
                {settings.language === 'ar' ? 'خصص الأرقام حسب مقهاك' : 'Personnalisez selon vos données'}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Monthly Expenses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal">
            <span>{t.monthlyExpensesTotal}</span>
            <span className="text-brandRed font-black">
              {breakEvenMetrics.effectiveMonthlyExpenses.toLocaleString()} {settings.currency}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setUseAuto(true);
                updateBreakEvenConfig({ useAutoObligations: true });
              }}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                useAuto 
                  ? 'bg-charcoal text-white border-charcoal shadow-sm' 
                  : 'bg-offwhite text-charcoal border-sage/30 hover:border-sage'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.autoFromObligations}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUseAuto(false);
                updateBreakEvenConfig({ useAutoObligations: false });
              }}
              className={`p-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                !useAuto 
                  ? 'bg-charcoal text-white border-charcoal shadow-sm' 
                  : 'bg-offwhite text-charcoal border-sage/30 hover:border-sage'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{t.customExpensesInput}</span>
            </button>
          </div>

          {!useAuto && (
            <div className="pt-1">
              <div className="relative">
                <input
                  type="number"
                  value={customExpenses}
                  onChange={(e) => setCustomExpenses(Number(e.target.value))}
                  onBlur={handleSaveConfig}
                  className="w-full h-11 px-3.5 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-black text-sm focus:outline-none focus:border-brandRed"
                  placeholder="3000"
                />
                <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-sage">
                  {settings.currency}
                </span>
              </div>
            </div>
          )}

          {useAuto && obligations.length > 0 && (
            <p className="text-[10px] text-sage font-medium px-1">
              {settings.language === 'ar' 
                ? `محسوبة من مجموع ${obligations.length} التزامات وفواتير مسجلة في التطبيق.`
                : `Calculée depuis ${obligations.length} charges enregistrées.`}
            </p>
          )}
        </div>

        {/* 2. Drink Selling Price & Cost in 2 Columns */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Selling Price */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-sage uppercase tracking-wider block">
              {t.drinkPriceLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={drinkPrice}
                onChange={(e) => setDrinkPrice(Number(e.target.value))}
                onBlur={handleSaveConfig}
                className="w-full h-11 px-3 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-black text-sm focus:outline-none focus:border-brandRed"
              />
              <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sage">
                {settings.currency}
              </span>
            </div>
          </div>

          {/* Variable Cost */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-sage uppercase tracking-wider block">
              {t.drinkCostLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                value={drinkCost}
                onChange={(e) => setDrinkCost(Number(e.target.value))}
                onBlur={handleSaveConfig}
                className="w-full h-11 px-3 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-black text-sm focus:outline-none focus:border-brandRed"
              />
              <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sage">
                {settings.currency}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Working Days per Month */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal">
            <span>{t.workingDaysLabel}</span>
            <span className="text-charcoal font-black">{workingDays} {t.days}</span>
          </div>
          <div className="flex gap-2">
            {[26, 28, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => {
                  setWorkingDays(days);
                  updateBreakEvenConfig({ workingDaysPerMonth: days });
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  workingDays === days
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-offwhite text-charcoal border-sage/30 hover:border-sage'
                }`}
              >
                {days} {t.days}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSaveConfig}
          className="w-full py-3 rounded-2xl bg-brandRed text-white font-extrabold text-xs shadow-md hover:bg-brandRed-hover active:scale-95 transition"
        >
          {settings.language === 'ar' ? 'تحديث وحفظ الحسابات' : 'Mettre à jour les calculs'}
        </button>

      </div>

      {/* Secondary Feed Items: Quick Jump Cards */}
      <div className="space-y-3">
        <button
          onClick={() => setActiveTab('daily')}
          className="w-full p-4 rounded-3xl bg-white border border-sage/30 shadow-sm flex items-center justify-between hover:border-sage transition active:scale-98 text-start"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-charcoal">
                {t.cardDailyTitle}
              </h3>
              <p className="text-[11px] text-sage font-medium">
                {settings.language === 'ar' ? 'سجل مبيعات اليوم لتحديث مؤشر التعادل فوراً' : 'Enregistrez les ventes du jour'}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-offwhite flex items-center justify-center text-charcoal">
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('obligations')}
          className="w-full p-4 rounded-3xl bg-white border border-sage/30 shadow-sm flex items-center justify-between hover:border-sage transition active:scale-98 text-start"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-charcoal/10 text-charcoal flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-charcoal">
                {t.cardObligationsTitle}
              </h3>
              <p className="text-[11px] text-sage font-medium">
                {settings.language === 'ar' ? 'تعديل فواتير الكهرباء، الماء، الإيجار والصيانة' : 'Gérer les factures et charges'}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-offwhite flex items-center justify-center text-charcoal">
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </div>
        </button>
      </div>

    </div>
  );
};

export default BreakEvenView;
