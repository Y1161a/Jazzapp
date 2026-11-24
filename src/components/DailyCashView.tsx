import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DailyRecord } from '../types';
import { 
  Plus, 
  Calendar, 
  Trash2, 
  Edit3, 
  Coffee, 
  X, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

interface DailyCashViewProps {
  isAddModalOpen?: boolean;
  setIsAddModalOpen?: (open: boolean) => void;
}

export const DailyCashView: React.FC<DailyCashViewProps> = ({ 
  isAddModalOpen: externalModalOpen, 
  setIsAddModalOpen: setExternalModalOpen 
}) => {
  const { 
    t, 
    settings, 
    dailyRecords, 
    addDailyRecord, 
    updateDailyRecord, 
    deleteDailyRecord, 
    todayRecord, 
    monthSummary,
    breakEvenConfig
  } = useApp();

  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;
  const setIsModalOpen = setExternalModalOpen || setInternalModalOpen;

  const [editingRecord, setEditingRecord] = useState<DailyRecord | null>(null);

  const todayIso = new Date().toISOString().split('T')[0];
  const [formDate, setFormDate] = useState<string>(todayIso);
  const [formRevenue, setFormRevenue] = useState<string>('');
  const [formExpenses, setFormExpenses] = useState<string>('');
  const [formDrinksSold, setFormDrinksSold] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  const handleOpenAdd = (recordToEdit?: DailyRecord) => {
    if (recordToEdit) {
      setEditingRecord(recordToEdit);
      setFormDate(recordToEdit.date);
      setFormRevenue(recordToEdit.revenue.toString());
      setFormExpenses(recordToEdit.expenses.toString());
      setFormDrinksSold(recordToEdit.drinksSold ? recordToEdit.drinksSold.toString() : '');
      setFormNotes(recordToEdit.notes || '');
    } else {
      setEditingRecord(null);
      setFormDate(todayIso);
      // Pre-fill with today's record if exists
      if (todayRecord) {
        setFormRevenue(todayRecord.revenue.toString());
        setFormExpenses(todayRecord.expenses.toString());
        setFormDrinksSold(todayRecord.drinksSold ? todayRecord.drinksSold.toString() : '');
        setFormNotes(todayRecord.notes || '');
      } else {
        setFormRevenue('');
        setFormExpenses('');
        setFormDrinksSold('');
        setFormNotes('');
      }
    }
    setIsModalOpen(true);
  };

  const handleRevenueChange = (val: string) => {
    setFormRevenue(val);
    // Auto-estimate drinks sold if not explicitly touched
    const rev = parseFloat(val);
    if (!isNaN(rev) && rev > 0 && breakEvenConfig.avgDrinkPrice > 0 && !formDrinksSold) {
      const estimatedDrinks = Math.round(rev / breakEvenConfig.avgDrinkPrice);
      setFormDrinksSold(estimatedDrinks.toString());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const revNum = parseFloat(formRevenue) || 0;
    const expNum = parseFloat(formExpenses) || 0;
    const drinksNum = parseInt(formDrinksSold, 10) || (revNum > 0 ? Math.round(revNum / breakEvenConfig.avgDrinkPrice) : 0);

    if (editingRecord) {
      updateDailyRecord({
        ...editingRecord,
        date: formDate,
        revenue: revNum,
        expenses: expNum,
        drinksSold: drinksNum,
        notes: formNotes.trim() || undefined,
      });
    } else {
      addDailyRecord({
        date: formDate,
        revenue: revNum,
        expenses: expNum,
        drinksSold: drinksNum,
        notes: formNotes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const todayNet = todayRecord ? todayRecord.revenue - todayRecord.expenses : 0;

  return (
    <div className="space-y-6 pb-28 max-w-md mx-auto animate-in fade-in duration-200">
      
      {/* Title & Subtitle */}
      <div className="px-1 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brandRed animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-sage">
              {t.dailyTitle}
            </span>
          </div>
          <h1 className="text-2xl font-black text-charcoal">
            {settings.language === 'ar' ? 'العائد المالي ومصاريف اليوم' : 'Caisse du Jour'}
          </h1>
          <p className="text-xs text-sage font-medium mt-0.5">
            {t.dailySubtitle}
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="w-12 h-12 rounded-2xl bg-brandRed text-white flex items-center justify-center shadow-md hover:bg-brandRed-hover active:scale-95 transition shrink-0"
          title={t.addDailyEntry}
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Hero Feature Card: Today's Financial Pulse */}
      <div className="relative overflow-hidden rounded-[40px] bg-white p-6 shadow-soft border border-sage/20">
        
        {/* Decorative Blob */}
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-44 h-44 rounded-full bg-sage/20 blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white border border-sage/30 shadow-card flex items-center justify-center text-3xl shrink-0">
              💰
            </div>
            <div>
              <span className="text-[10px] font-bold text-sage uppercase tracking-wider block">
                {settings.language === 'ar' ? 'صافي أرباح اليوم' : 'Bénéfice net du jour'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-3xl font-black tracking-tight ${todayNet >= 0 ? 'text-charcoal' : 'text-brandRed'}`}>
                  {todayNet >= 0 ? `+${todayNet.toLocaleString()}` : todayNet.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-sage">
                  {settings.currency}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenAdd(todayRecord)}
            className="px-3.5 py-1.5 rounded-full bg-charcoal text-white text-[11px] font-black hover:bg-black transition active:scale-95 shadow-sm"
          >
            {todayRecord ? (settings.language === 'ar' ? 'تعديل اليوم' : 'Modifier') : (settings.language === 'ar' ? 'تسجيل اليوم' : 'Saisir')}
          </button>
        </div>

        {/* Metrics Grid for Today: Revenue vs Expenses */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mt-6">
          {/* Revenue */}
          <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-sage/30 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sage uppercase tracking-wider">
                {t.dailyRevenueLabel}
              </span>
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-emerald-600">
                +{todayRecord ? todayRecord.revenue.toLocaleString() : '0'}
              </span>
              <span className="text-[10px] font-bold text-sage ms-1">
                {settings.currency}
              </span>
            </div>
          </div>

          {/* Expenses */}
          <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-sage/30 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sage uppercase tracking-wider">
                {t.dailyExpensesLabel}
              </span>
              <div className="w-6 h-6 rounded-full bg-brandRed/10 text-brandRed flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-lg font-black text-brandRed">
                -{todayRecord ? todayRecord.expenses.toLocaleString() : '0'}
              </span>
              <span className="text-[10px] font-bold text-sage ms-1">
                {settings.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Today's Drinks & Notes Bar */}
        <div className="relative z-10 mt-4 p-3 rounded-2xl bg-sage/20 border border-sage/30 flex items-center justify-between text-xs font-bold text-charcoal">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-brandRed" />
            <span>
              {settings.language === 'ar' ? 'مبيعات المشروبات لليوم:' : 'Boissons vendues :'}
            </span>
          </div>
          <span className="text-brandRed font-black text-sm">
            {todayRecord?.drinksSold || 0} {t.drinksUnit}
          </span>
        </div>

      </div>

      {/* Month Summary Card (24px radius) */}
      <div className="rounded-[32px] bg-white p-5 shadow-sm border border-sage/20 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sage/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-black text-charcoal">
              {t.thisMonthRevenue} & {t.thisMonthExpenses}
            </h2>
          </div>
          <span className="text-xs font-black text-brandRed">
            {settings.language === 'ar' ? 'صافي الشهر:' : 'Net mois:'} +{monthSummary.net.toLocaleString()} {settings.currency}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-offwhite border border-sage/20">
            <span className="text-[10px] font-bold text-sage uppercase block">
              {t.thisMonthRevenue}
            </span>
            <span className="text-base font-black text-charcoal block mt-0.5">
              +{monthSummary.revenue.toLocaleString()} {settings.currency}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-offwhite border border-sage/20">
            <span className="text-[10px] font-bold text-sage uppercase block">
              {t.thisMonthExpenses}
            </span>
            <span className="text-base font-black text-charcoal block mt-0.5">
              -{monthSummary.expenses.toLocaleString()} {settings.currency}
            </span>
          </div>
        </div>
      </div>

      {/* History List of Previous Days */}
      <div className="space-y-3">
        <div className="px-1 flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-sage">
            {t.dailyHistoryTitle}
          </h2>
          <span className="text-[11px] font-bold text-sage">
            {dailyRecords.length} {settings.language === 'ar' ? 'أيام مسجلة' : 'jours'}
          </span>
        </div>

        {dailyRecords.length === 0 ? (
          <div className="p-8 rounded-[32px] bg-white border border-sage/20 text-center space-y-2">
            <p className="text-xs text-sage font-bold">
              {t.noDailyRecords}
            </p>
            <button
              onClick={() => handleOpenAdd()}
              className="px-4 py-2 rounded-full bg-brandRed text-white text-xs font-black shadow-sm"
            >
              {t.addDailyEntry}
            </button>
          </div>
        ) : (
          dailyRecords.map((record) => {
            const net = record.revenue - record.expenses;
            const isToday = record.date === todayIso;

            return (
              <div
                key={record.id}
                className="p-4 rounded-3xl bg-white border border-sage/30 shadow-sm flex items-center justify-between transition hover:border-sage"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isToday ? 'bg-brandRed text-white' : 'bg-offwhite text-charcoal'
                  }`}>
                    <Calendar className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-charcoal">
                        {record.date}
                      </span>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full bg-brandRed/10 text-brandRed text-[9px] font-black">
                          {t.today}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-sage font-bold mt-0.5">
                      <span className="text-emerald-600">+{record.revenue}</span>
                      <span className="text-brandRed">-{record.expenses}</span>
                      {record.drinksSold && record.drinksSold > 0 && (
                        <span>• {record.drinksSold} {t.drinksUnit}</span>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-[10px] text-sage italic mt-0.5 truncate max-w-[180px]">
                        {record.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-end me-1">
                    <span className={`text-sm font-black block ${net >= 0 ? 'text-charcoal' : 'text-brandRed'}`}>
                      {net >= 0 ? `+${net}` : net}
                    </span>
                    <span className="text-[9px] font-bold text-sage">
                      {settings.currency}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenAdd(record)}
                    className="w-8 h-8 rounded-full bg-offwhite hover:bg-charcoal hover:text-white flex items-center justify-center text-charcoal transition"
                    title={t.editDailyEntry}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(t.confirmDeleteRecord)) {
                        deleteDailyRecord(record.id);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-offwhite hover:bg-brandRed hover:text-white flex items-center justify-center text-sage transition"
                    title={t.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-[40px] border border-sage/30 shadow-2xl overflow-hidden p-6 space-y-4 mb-20 sm:mb-0">
            
            <div className="flex items-center justify-between border-b border-sage/20 pb-3">
              <div>
                <h3 className="font-black text-base text-charcoal">
                  {editingRecord ? t.editDailyEntry : t.addDailyEntry}
                </h3>
                <p className="text-[11px] text-sage font-bold">
                  {settings.language === 'ar' ? 'سجل مداخيل ومصاريف الصندوق' : 'Recettes et sorties de caisse'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-charcoal hover:bg-brandRed hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              
              {/* Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sage uppercase tracking-wider block">
                  {settings.language === 'ar' ? 'تاريخ اليومية' : 'Date'}
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-bold text-sm focus:outline-none focus:border-brandRed"
                />
              </div>

              {/* Revenue & Expenses in 2 cols */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sage uppercase tracking-wider block">
                    {t.dailyRevenueLabel} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      required
                      value={formRevenue}
                      onChange={(e) => handleRevenueChange(e.target.value)}
                      placeholder="0"
                      className="w-full h-11 px-3.5 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-black text-sm focus:outline-none focus:border-brandRed"
                    />
                    <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sage">
                      {settings.currency}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sage uppercase tracking-wider block">
                    {t.dailyExpensesLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={formExpenses}
                      onChange={(e) => setFormExpenses(e.target.value)}
                      placeholder="0"
                      className="w-full h-11 px-3.5 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-black text-sm focus:outline-none focus:border-brandRed"
                    />
                    <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sage">
                      {settings.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Drinks Sold */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-sage uppercase tracking-wider block">
                    {t.drinksSoldLabel} ({t.drinksUnit})
                  </label>
                  <span className="text-[10px] text-sage font-medium">
                    {t.drinksSoldHelp}
                  </span>
                </div>
                <input
                  type="number"
                  value={formDrinksSold}
                  onChange={(e) => setFormDrinksSold(e.target.value)}
                  placeholder="120"
                  className="w-full h-11 px-3.5 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-black text-sm focus:outline-none focus:border-brandRed"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sage uppercase tracking-wider block">
                  {t.dailyNotesLabel}
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={settings.language === 'ar' ? 'مشتريات نعناع، حليب طارئ، غسيل...' : 'Notes (achats ponctuels, etc.)'}
                  className="w-full h-11 px-3.5 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-medium text-xs focus:outline-none focus:border-brandRed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-offwhite border border-sage/30 text-charcoal font-bold text-xs hover:border-sage transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-brandRed text-white font-extrabold text-xs shadow-md hover:bg-brandRed-hover active:scale-95 transition"
                >
                  {t.save}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default DailyCashView;
