import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Obligation, ObligationCategory } from '../types';
import { 
  Plus, 
  Search, 
  Zap, 
  Droplet, 
  Wifi, 
  Home, 
  Landmark, 
  Wrench, 
  ShoppingBag, 
  HelpCircle,
  Bell,
  Check,
  Calendar,
  Trash2,
  Edit2,
  X,
  Receipt
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

  const getCategoryMeta = (cat: ObligationCategory) => {
    switch (cat) {
      case 'electricity': return { label: t.catElectricity, icon: Zap };
      case 'water': return { label: t.catWater, icon: Droplet };
      case 'internet': return { label: t.catInternet, icon: Wifi };
      case 'rent': return { label: t.catRent, icon: Home };
      case 'taxes': return { label: t.catTaxes, icon: Landmark };
      case 'maintenance': return { label: t.catMaintenance, icon: Wrench };
      case 'supplies': return { label: t.catSupplies, icon: ShoppingBag };
      default: return { label: t.catOther, icon: HelpCircle };
    }
  };

  const categories: ObligationCategory[] = [
    'electricity', 'water', 'internet', 'rent', 'taxes', 'maintenance', 'supplies', 'other'
  ];

  // Filtered List
  const filteredObligations = useMemo(() => {
    return obligations.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      if (statusFilter === 'pending') {
        if (item.status === 'paid' || item.dueDate < todayStr) return false;
      } else if (statusFilter === 'overdue') {
        if (item.status === 'paid' || item.dueDate >= todayStr) return false;
      } else if (statusFilter === 'paid') {
        if (item.status !== 'paid') return false;
      }

      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [obligations, searchQuery, statusFilter, categoryFilter, todayStr]);

  const filteredTotal = useMemo(() => {
    return filteredObligations.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredObligations]);

  const openAddModal = () => {
    setEditingObligation(null);
    setFormTitle('');
    setFormCategory('electricity');
    setFormAmount('');
    setFormDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
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

  return (
    <div className="space-y-5 pb-28 max-w-md mx-auto">
      
      {/* Header Summary Card (40px radius) */}
      <div className="p-6 rounded-[40px] bg-white border border-sage/20 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-6 -me-6 w-36 h-36 rounded-full bg-sage/20 blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sage block">
              {t.navObligations} · {settings.cafeName}
            </span>
            <h2 className="text-[24px] font-black text-charcoal leading-tight">
              {filteredTotal.toLocaleString()} <span className="text-sm font-bold text-sage">{settings.currency}</span>
            </h2>
            <p className="text-xs text-sage font-bold mt-0.5">
              {filteredObligations.length} {settings.language === 'ar' ? 'التزامات مطابقة للفلتر' : 'charges filtrées'}
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="w-12 h-12 rounded-full bg-brandRed flex items-center justify-center text-white shadow-fab active:scale-95 transition"
            title={t.addObligation}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Status Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-1">
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
              className={`h-11 px-4 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-charcoal text-white shadow-md'
                  : 'bg-white text-charcoal border border-sage/30 hover:border-sage'
              }`}
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-sage absolute start-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchBills}
          className="w-full ps-10 pe-4 py-3 rounded-[24px] bg-white border border-sage/30 text-xs text-charcoal placeholder-sage font-semibold focus:outline-none focus:border-charcoal shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute end-4 top-1/2 -translate-y-1/2 text-sage hover:text-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`h-9 px-3.5 rounded-full text-[11px] font-bold whitespace-nowrap transition ${
            categoryFilter === 'all'
              ? 'bg-brandRed text-white shadow-sm'
              : 'bg-white text-charcoal border border-sage/30'
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
              className={`h-9 px-3 rounded-full text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-brandRed text-white shadow-sm'
                  : 'bg-white text-charcoal border border-sage/30'
              }`}
            >
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Feed Items: 24px radius cards */}
      {filteredObligations.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-[40px] border border-sage/30 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-sage/20 text-charcoal mx-auto flex items-center justify-center mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-charcoal">
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
                className="p-4 rounded-[24px] bg-white border border-sage/30 shadow-card flex flex-col gap-3 hover:border-sage transition"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* 56px Icon Container */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      isOverdue 
                        ? 'bg-brandRed/10 text-brandRed' 
                        : isPaid 
                        ? 'bg-sage/20 text-sage' 
                        : 'bg-charcoal/10 text-charcoal'
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sage">
                          {meta.label}
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-sage/20 text-charcoal'
                            : isOverdue
                            ? 'bg-brandRed text-white'
                            : 'bg-charcoal text-white'
                        }`}>
                          {isPaid ? t.statusPaid : (isOverdue ? t.statusOverdue : t.statusPending)}
                        </span>
                      </div>
                      
                      {/* 18px bold heading */}
                      <h4 className={`text-[17px] font-extrabold mt-0.5 truncate ${
                        isPaid ? 'line-through text-sage' : 'text-charcoal'
                      }`}>
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-black text-brandRed">
                          {item.amount.toLocaleString()} <span className="text-[10px] font-bold text-sage">{item.currency}</span>
                        </span>
                        <span className="text-[10px] text-sage font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.dueDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 40px Circular Trailing Action Button */}
                  <button
                    onClick={() => toggleObligationStatus(item.id)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition active:scale-90 ${
                      isPaid 
                        ? 'bg-charcoal border-charcoal text-white' 
                        : 'border-sage/40 text-sage hover:border-brandRed hover:bg-brandRed hover:text-white'
                    }`}
                    title={isPaid ? t.markAsPending : t.markAsPaid}
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>

                {/* Notes and Reminder Footer */}
                {(item.notes || item.reminderDateTime) && (
                  <div className="pt-2 border-t border-sage/20 flex items-center justify-between gap-2 text-[11px] text-sage">
                    {item.reminderDateTime && (
                      <span className="flex items-center gap-1 font-bold text-charcoal">
                        <Bell className="w-3.5 h-3.5 text-brandRed" />
                        <span>{item.reminderDateTime.replace('T', ' ')}</span>
                      </span>
                    )}
                    {item.notes && (
                      <span className="truncate max-w-[180px] font-medium italic">
                        {item.notes}
                      </span>
                    )}

                    <div className="flex items-center gap-1 ms-auto">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1 text-sage hover:text-charcoal"
                        title={t.editObligation}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(t.confirmDeleteBill)) {
                            deleteObligation(item.id);
                          }
                        }}
                        className="p-1 text-sage hover:text-brandRed"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal (40px radius) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[40px] border border-sage/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-5 border-b border-sage/20 flex items-center justify-between">
              <h3 className="text-[20px] font-black text-charcoal">
                {editingObligation ? t.editObligation : t.addObligation}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-charcoal hover:bg-brandRed hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
                  {t.billTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: فاتورة الكهرباء والغاز"
                  className="w-full px-4 py-3 rounded-2xl bg-offwhite border border-sage/30 text-xs text-charcoal font-bold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1.5">
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
                        className={`p-2 rounded-2xl border flex flex-col items-center gap-1 text-[10px] font-black transition ${
                          isSelected
                            ? 'bg-charcoal text-white border-charcoal shadow-sm'
                            : 'bg-offwhite text-charcoal border-sage/30'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate w-full text-center">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
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
                    className="w-full px-4 py-3 rounded-2xl bg-offwhite border border-sage/30 text-sm font-black text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
                    {t.billDueDate} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-3 rounded-2xl bg-offwhite border border-sage/30 text-xs font-bold text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              {/* Manual Reminder Time Picker */}
              <div className="p-3.5 rounded-2xl bg-sage/20 border border-sage/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-charcoal font-black text-xs">
                  <Bell className="w-4 h-4 text-brandRed" />
                  <span>{t.billReminderTime}</span>
                </div>
                <p className="text-[10px] text-sage font-bold">
                  {t.billReminderHelp}
                </p>
                <input
                  type="datetime-local"
                  value={formReminderDateTime}
                  onChange={(e) => setFormReminderDateTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-sage/40 text-xs text-charcoal font-bold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
                  {t.billNotes}
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="ملاحظات حول طريقة السداد..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-offwhite border border-sage/30 text-xs text-charcoal font-medium focus:outline-none focus:border-charcoal"
                />
              </div>

              {/* Action Buttons: Red Primary CTA, White Secondary with Gray-Green border */}
              <div className="pt-3 border-t border-sage/20 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-white border border-sage text-charcoal font-extrabold hover:bg-offwhite transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brandRed hover:bg-brandRed-hover text-white font-extrabold shadow-fab active:scale-95 transition"
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
