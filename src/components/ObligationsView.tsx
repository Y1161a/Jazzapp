import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Obligation, ObligationCategory } from '../types';
import { 
  Plus, 
  Search, 
  Receipt, 
  Zap, 
  Droplet, 
  Wifi, 
  Home, 
  Landmark, 
  Wrench, 
  ShoppingBag, 
  HelpCircle,
  Bell,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  X
} from 'lucide-react';

interface ObligationsViewProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const ObligationsView: React.FC<ObligationsViewProps> = ({
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const { 
    t, 
    obligations, 
    addObligation, 
    updateObligation, 
    deleteObligation, 
    toggleObligationStatus, 
    settings 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'overdue' | 'paid'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // State for Editing
  const [editingObligation, setEditingObligation] = useState<Obligation | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ObligationCategory>('electricity');
  const [formAmount, setFormAmount] = useState<number | ''>('');
  const [formDueDate, setFormDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [formReminderDateTime, setFormReminderDateTime] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper for category details
  const getCategoryMeta = (cat: ObligationCategory) => {
    switch (cat) {
      case 'electricity':
        return { label: t.catElectricity, icon: Zap, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
      case 'water':
        return { label: t.catWater, icon: Droplet, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' };
      case 'internet':
        return { label: t.catInternet, icon: Wifi, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' };
      case 'rent':
        return { label: t.catRent, icon: Home, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
      case 'taxes':
        return { label: t.catTaxes, icon: Landmark, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
      case 'maintenance':
        return { label: t.catMaintenance, icon: Wrench, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
      case 'supplies':
        return { label: t.catSupplies, icon: ShoppingBag, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
      default:
        return { label: t.catOther, icon: HelpCircle, color: 'text-stone-500 bg-stone-500/10 border-stone-500/20' };
    }
  };

  // Filtered List
  const filteredObligations = useMemo(() => {
    return obligations.filter((item) => {
      // Search
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      // Status Filter
      if (statusFilter === 'pending') {
        if (item.status === 'paid' || item.dueDate < todayStr) return false;
      } else if (statusFilter === 'overdue') {
        if (item.status === 'paid' || item.dueDate >= todayStr) return false;
      } else if (statusFilter === 'paid') {
        if (item.status !== 'paid') return false;
      }

      // Category Filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [obligations, searchQuery, statusFilter, categoryFilter, todayStr]);

  // Total filtered amount
  const filteredTotal = useMemo(() => {
    return filteredObligations.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredObligations]);

  const openAddModal = () => {
    setEditingObligation(null);
    setFormTitle('');
    setFormCategory('electricity');
    setFormAmount('');
    setFormDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    // Default reminder 2 days before due date at 09:00
    const defaultRem = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    defaultRem.setHours(9, 0, 0, 0);
    setFormReminderDateTime(defaultRem.toISOString().slice(0, 16));
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: Obligation) => {
    setEditingObligation(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormAmount(item.amount);
    setFormDueDate(item.dueDate);
    setFormReminderDateTime(item.reminderDateTime || '');
    setFormNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || formAmount === '' || Number(formAmount) <= 0) return;

    if (editingObligation) {
      updateObligation({
        ...editingObligation,
        title: formTitle.trim(),
        category: formCategory,
        amount: Number(formAmount),
        dueDate: formDueDate,
        reminderDateTime: formReminderDateTime ? formReminderDateTime : null,
        reminderTriggered: false,
        notes: formNotes.trim(),
      });
    } else {
      addObligation({
        title: formTitle.trim(),
        category: formCategory,
        amount: Number(formAmount),
        currency: settings.currency,
        dueDate: formDueDate,
        reminderDateTime: formReminderDateTime ? formReminderDateTime : null,
        status: formDueDate < todayStr ? 'overdue' : 'pending',
        notes: formNotes.trim(),
      });
    }

    setIsAddModalOpen(false);
  };

  const categories: ObligationCategory[] = [
    'electricity', 'water', 'internet', 'rent', 'taxes', 'maintenance', 'supplies', 'other'
  ];

  return (
    <div className="space-y-4 pb-6">
      
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-cafe-900 dark:text-jazz-crema">
            {t.obligationsTitle}
          </h1>
          <p className="text-xs text-cafe-500 dark:text-stone-400 mt-0.5">
            {filteredObligations.length} {settings.language === 'ar' ? 'التزام' : 'charges'} · {t.billAmount}: <span className="font-bold text-cafe-800 dark:text-jazz-amber">{filteredTotal.toLocaleString()} {settings.currency}</span>
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cafe-700 to-jazz-gold text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cafe-900/10 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addObligation}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-cafe-400 absolute start-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchBills}
          className="w-full ps-9 pe-4 py-2.5 rounded-2xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 placeholder-cafe-400 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50 shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-cafe-400 hover:text-cafe-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-cafe-200/60 dark:bg-jazz-surface border border-cafe-300/60 dark:border-jazz-border text-xs overflow-x-auto scrollbar-none">
        {(['all', 'pending', 'overdue', 'paid'] as const).map((tab) => {
          const isActive = statusFilter === tab;
          let label = t.filterAll;
          if (tab === 'pending') label = t.filterPending;
          if (tab === 'overdue') label = t.filterOverdue;
          if (tab === 'paid') label = t.filterPaid;

          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white dark:bg-jazz-card text-cafe-900 dark:text-jazz-gold shadow-sm'
                  : 'text-cafe-600 dark:text-stone-400 hover:text-cafe-900 dark:hover:text-stone-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            categoryFilter === 'all'
              ? 'bg-cafe-900 text-white dark:bg-jazz-gold dark:text-cafe-950'
              : 'bg-white dark:bg-jazz-surface text-cafe-700 dark:text-stone-400 border border-cafe-200 dark:border-jazz-border'
          }`}
        >
          {t.filterAll}
        </button>
        {categories.map((cat) => {
          const meta = getCategoryMeta(cat);
          const isSelected = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition ${
                isSelected
                  ? 'bg-cafe-900 text-white dark:bg-jazz-gold dark:text-cafe-950'
                  : 'bg-white dark:bg-jazz-surface text-cafe-700 dark:text-stone-400 border border-cafe-200 dark:border-jazz-border'
              }`}
            >
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Obligations Cards List */}
      {filteredObligations.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-jazz-surface rounded-3xl border border-cafe-200 dark:border-jazz-border">
          <div className="w-12 h-12 rounded-full bg-cafe-100 dark:bg-jazz-card text-cafe-400 mx-auto flex items-center justify-center mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-cafe-600 dark:text-stone-400">
            {t.noObligationsFound}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredObligations.map((item) => {
            const meta = getCategoryMeta(item.category);
            const Icon = meta.icon;
            const isPaid = item.status === 'paid';
            const isOverdue = !isPaid && item.dueDate < todayStr;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl bg-white dark:bg-jazz-surface border transition-all duration-200 shadow-sm ${
                  isPaid
                    ? 'border-cafe-200 dark:border-jazz-border/60 opacity-80'
                    : isOverdue
                    ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-500/20'
                    : 'border-cafe-200 dark:border-jazz-border hover:border-jazz-gold/40'
                }`}
              >
                {/* Top Row: Category Icon, Title, Amount */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${meta.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-cafe-500 dark:text-stone-400">
                          {meta.label}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : isOverdue
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 animate-pulse'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        }`}>
                          {isPaid ? t.statusPaid : (isOverdue ? t.statusOverdue : t.statusPending)}
                        </span>
                      </div>
                      <h3 className={`font-bold text-sm text-cafe-900 dark:text-stone-100 mt-0.5 truncate ${isPaid ? 'line-through text-cafe-400 dark:text-stone-500' : ''}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <div className="text-base font-black text-cafe-900 dark:text-jazz-crema">
                      {item.amount.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-bold text-cafe-500 dark:text-jazz-amber">
                      {item.currency}
                    </div>
                  </div>
                </div>

                {/* Notes if available */}
                {item.notes && (
                  <p className="text-xs text-cafe-600 dark:text-stone-400 mt-2.5 ps-13 bg-cafe-50/50 dark:bg-jazz-card/50 p-2 rounded-xl">
                    {item.notes}
                  </p>
                )}

                {/* Info Bar: Due Date & Reminder */}
                <div className="mt-3 pt-3 border-t border-cafe-100 dark:border-jazz-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-[11px] text-cafe-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t.billDueDate}: <strong className="text-cafe-800 dark:text-stone-200">{item.dueDate}</strong></span>
                    </span>

                    {item.reminderDateTime && (
                      <span className="flex items-center gap-1 text-jazz-amber font-medium" title={t.reminderSetFor}>
                        <Bell className="w-3.5 h-3.5" />
                        <span>{item.reminderDateTime.replace('T', ' ')}</span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ms-auto">
                    <button
                      onClick={() => toggleObligationStatus(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                        isPaid
                          ? 'bg-cafe-100 dark:bg-jazz-card text-cafe-700 dark:text-stone-300'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isPaid ? t.markAsPending : t.markAsPaid}</span>
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-xl hover:bg-cafe-100 dark:hover:bg-jazz-card text-cafe-500 dark:text-stone-400 transition"
                      title={t.editObligation}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(t.confirmDeleteBill)) {
                          deleteObligation(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-500 transition"
                      title={t.deleteBill}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-jazz-surface rounded-3xl border border-cafe-200 dark:border-jazz-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-cafe-200 dark:border-jazz-border flex items-center justify-between">
              <h2 className="text-base font-extrabold text-cafe-900 dark:text-jazz-crema">
                {editingObligation ? t.editObligation : t.addObligation}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-cafe-400 hover:text-cafe-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Title */}
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                  {t.billTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: فاتورة الكهرباء لشهر نوفمبر"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1.5">
                  {t.billCategory}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => {
                    const meta = getCategoryMeta(cat);
                    const isSelected = formCategory === cat;
                    const Icon = meta.icon;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormCategory(cat)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition ${
                          isSelected
                            ? 'bg-cafe-900 text-white dark:bg-jazz-gold dark:text-cafe-950 border-transparent shadow-sm'
                            : 'bg-cafe-50 dark:bg-jazz-card text-cafe-700 dark:text-stone-300 border-cafe-200 dark:border-jazz-border'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate w-full text-center">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount & Due Date Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                    {t.billAmount} ({settings.currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                    {t.billDueDate} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50 font-bold"
                  />
                </div>
              </div>

              {/* Manual Reminder Date-Time Picker */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold mb-1">
                  <Bell className="w-4 h-4 text-jazz-gold" />
                  <span>{t.billReminderTime}</span>
                </div>
                <p className="text-[11px] text-amber-700/80 dark:text-stone-400 mb-2">
                  {t.billReminderHelp}
                </p>
                <input
                  type="datetime-local"
                  value={formReminderDateTime}
                  onChange={(e) => setFormReminderDateTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-jazz-card border border-amber-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50 font-semibold"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                  {t.billNotes}
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="ملاحظات حول طريقة السداد، رقم العداد، أو الوصل..."
                  className="w-full px-3.5 py-2 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-cafe-200 dark:border-jazz-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-cafe-300 dark:border-jazz-border text-cafe-700 dark:text-stone-300 font-bold hover:bg-cafe-100 dark:hover:bg-jazz-card transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cafe-700 to-jazz-gold text-white font-bold shadow-md active:scale-95 transition"
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
