import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem, InventoryCategory, InventoryUnit } from '../types';
import { 
  Plus, 
  Search, 
  Package, 
  Coffee, 
  Milk, 
  Wine, 
  Cookie, 
  ShoppingBag, 
  Sparkles,
  AlertTriangle,
  Minus,
  Edit2,
  Trash2,
  X,
  History,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface InventoryViewProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { 
    t, 
    inventory, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem, 
    adjustStock, 
    logs,
    settings 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Editing state
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Quick Adjustment Modal State
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<'in' | 'out'>('in');
  const [adjustAmount, setAdjustAmount] = useState<number | ''>('');
  const [adjustNote, setAdjustNote] = useState('');

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<InventoryCategory>('coffee');
  const [formQuantity, setFormQuantity] = useState<number | ''>('');
  const [formUnit, setFormUnit] = useState<InventoryUnit>('kg');
  const [formMinThreshold, setFormMinThreshold] = useState<number | ''>('');
  const [formCostPerUnit, setFormCostPerUnit] = useState<number | ''>('');
  const [formNotes, setFormNotes] = useState('');

  // Category metadata helper
  const getCategoryMeta = (cat: InventoryCategory) => {
    switch (cat) {
      case 'coffee':
        return { label: t.catCoffee, icon: Coffee, color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' };
      case 'milk':
        return { label: t.catMilk, icon: Milk, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' };
      case 'beverages':
        return { label: t.catBeverages, icon: Wine, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' };
      case 'pastry':
        return { label: t.catPastry, icon: Cookie, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
      case 'disposables':
        return { label: t.catDisposables, icon: ShoppingBag, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
      case 'cleaning':
        return { label: t.catCleaning, icon: Sparkles, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' };
      default:
        return { label: t.catOther, icon: Package, color: 'text-stone-500 bg-stone-500/10 border-stone-500/20' };
    }
  };

  const categories: InventoryCategory[] = [
    'coffee', 'milk', 'beverages', 'pastry', 'disposables', 'cleaning', 'other'
  ];

  const units: InventoryUnit[] = ['kg', 'g', 'L', 'ml', 'piece', 'box', 'pack'];

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      if (onlyLowStock && item.quantity > item.minThreshold) {
        return false;
      }

      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [inventory, searchQuery, onlyLowStock, categoryFilter]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('coffee');
    setFormQuantity('');
    setFormUnit('kg');
    setFormMinThreshold(5);
    setFormCostPerUnit('');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity);
    setFormUnit(item.unit);
    setFormMinThreshold(item.minThreshold);
    setFormCostPerUnit(item.costPerUnit || '');
    setFormNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formQuantity === '' || Number(formQuantity) < 0) return;

    if (editingItem) {
      updateInventoryItem({
        ...editingItem,
        name: formName.trim(),
        category: formCategory,
        quantity: Number(formQuantity),
        unit: formUnit,
        minThreshold: formMinThreshold === '' ? 0 : Number(formMinThreshold),
        costPerUnit: formCostPerUnit === '' ? undefined : Number(formCostPerUnit),
        notes: formNotes.trim(),
      });
    } else {
      addInventoryItem({
        name: formName.trim(),
        category: formCategory,
        quantity: Number(formQuantity),
        unit: formUnit,
        minThreshold: formMinThreshold === '' ? 0 : Number(formMinThreshold),
        costPerUnit: formCostPerUnit === '' ? undefined : Number(formCostPerUnit),
        notes: formNotes.trim(),
      });
    }

    setIsAddModalOpen(false);
  };

  const openAdjustModal = (item: InventoryItem, type: 'in' | 'out') => {
    setAdjustingItem(item);
    setAdjustType(type);
    setAdjustAmount('');
    setAdjustNote('');
  };

  const handleConfirmAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem || adjustAmount === '' || Number(adjustAmount) <= 0) return;

    const delta = adjustType === 'in' ? Number(adjustAmount) : -Number(adjustAmount);
    adjustStock(adjustingItem.id, delta, adjustNote.trim() || undefined);
    setAdjustingItem(null);
  };

  return (
    <div className="space-y-4 pb-6">
      
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-cafe-900 dark:text-jazz-crema">
            {t.inventoryTitle}
          </h1>
          <p className="text-xs text-cafe-500 dark:text-stone-400 mt-0.5">
            {inventory.length} {settings.language === 'ar' ? 'مادة مسجلة' : 'articles'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
              showHistory
                ? 'bg-cafe-900 text-white dark:bg-jazz-gold dark:text-cafe-950 border-transparent shadow-sm'
                : 'bg-white dark:bg-jazz-surface text-cafe-700 dark:text-stone-300 border-cafe-200 dark:border-jazz-border'
            }`}
            title="سجل الحركات"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={openAddModal}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cafe-700 to-jazz-gold text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cafe-900/10 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addItem}</span>
          </button>
        </div>
      </div>

      {/* Search & Low Stock Toggle */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-cafe-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchInventory}
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

        {/* Low Stock Toggle Pill */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              onlyLowStock
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20'
                : 'bg-white dark:bg-jazz-surface text-cafe-700 dark:text-stone-300 border border-cafe-200 dark:border-jazz-border'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.lowStockFilter}</span>
          </button>

          <span className="text-[11px] text-cafe-500 dark:text-stone-400 font-medium">
            {filteredInventory.length} {settings.language === 'ar' ? 'عنصر معروض' : 'affichés'}
          </span>
        </div>
      </div>

      {/* Category Chips */}
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

      {/* Inventory Logs Drawer (if toggled) */}
      {showHistory && (
        <div className="p-4 rounded-3xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-cafe-100 dark:border-jazz-border pb-2">
            <h3 className="font-extrabold text-xs text-cafe-900 dark:text-jazz-crema flex items-center gap-1.5">
              <History className="w-4 h-4 text-jazz-gold" />
              <span>{t.recentActivity}</span>
            </h3>
            <button onClick={() => setShowHistory(false)} className="text-cafe-400 hover:text-cafe-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          {logs.length === 0 ? (
            <p className="text-xs text-cafe-500 py-3 text-center">لا توجد حركات مسجلة بعد</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-1 border-b border-cafe-50 dark:border-jazz-border/40">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                      log.type === 'in' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {log.type === 'in' ? '+' : '-'}
                    </span>
                    <span className="font-bold text-cafe-800 dark:text-stone-200 truncate max-w-[140px]">{log.itemName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-cafe-900 dark:text-jazz-amber">{log.amount} {log.unit}</span>
                    <span className="text-[10px] text-cafe-400">{log.date.slice(0, 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Item Cards List */}
      {filteredInventory.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-jazz-surface rounded-3xl border border-cafe-200 dark:border-jazz-border">
          <div className="w-12 h-12 rounded-full bg-cafe-100 dark:bg-jazz-card text-cafe-400 mx-auto flex items-center justify-center mb-3">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-cafe-600 dark:text-stone-400">
            {t.noItemsFound}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInventory.map((item) => {
            const meta = getCategoryMeta(item.category);
            const Icon = meta.icon;
            const isLow = item.quantity <= item.minThreshold;
            const percentage = Math.min(100, Math.round((item.quantity / Math.max(item.minThreshold * 2, 1)) * 100));

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl bg-white dark:bg-jazz-surface border transition-all duration-200 shadow-sm ${
                  isLow
                    ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-500/20'
                    : 'border-cafe-200 dark:border-jazz-border hover:border-jazz-gold/40'
                }`}
              >
                {/* Top Row: Category icon, Name, Quantity */}
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
                        {isLow ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{t.stockLow}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                            {t.stockHealthy}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-cafe-900 dark:text-stone-100 mt-0.5 truncate">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  {/* Quantity Display */}
                  <div className="text-end shrink-0">
                    <div className={`text-xl font-black ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-cafe-900 dark:text-jazz-crema'}`}>
                      {item.quantity}
                    </div>
                    <div className="text-[11px] font-extrabold text-cafe-500 dark:text-jazz-amber">
                      {item.unit}
                    </div>
                  </div>
                </div>

                {/* Threshold Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] font-medium text-cafe-500 dark:text-stone-400 mb-1">
                    <span>الحد الأدنى: <strong>{item.minThreshold} {item.unit}</strong></span>
                    <span>{t.lastRestockedDate} {item.lastRestocked}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-cafe-100 dark:bg-jazz-card overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isLow ? 'bg-rose-500' : 'bg-gradient-to-r from-cafe-500 to-emerald-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Actions: Stepper and Custom Adjust */}
                <div className="mt-3.5 pt-3 border-t border-cafe-100 dark:border-jazz-border/70 flex items-center justify-between gap-2">
                  
                  {/* Stepper buttons */}
                  <div className="flex items-center gap-1 bg-cafe-100/70 dark:bg-jazz-card p-1 rounded-2xl border border-cafe-200 dark:border-jazz-border">
                    <button
                      onClick={() => adjustStock(item.id, -1, 'استهلاك يدوي (-1)')}
                      className="w-7 h-7 rounded-xl bg-white dark:bg-jazz-surface flex items-center justify-center text-cafe-700 dark:text-stone-200 hover:bg-rose-500 hover:text-white transition active:scale-90"
                      title="خصم 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-black text-cafe-800 dark:text-stone-200 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => adjustStock(item.id, 1, 'توريد يدوي (+1)')}
                      className="w-7 h-7 rounded-xl bg-white dark:bg-jazz-surface flex items-center justify-center text-cafe-700 dark:text-stone-200 hover:bg-emerald-500 hover:text-white transition active:scale-90"
                      title="إضافة 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Stock In / Out custom modals buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openAdjustModal(item, 'in')}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold flex items-center gap-1 active:scale-95 transition"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{t.quickStockIn}</span>
                    </button>

                    <button
                      onClick={() => openAdjustModal(item, 'out')}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 text-xs font-bold flex items-center gap-1 active:scale-95 transition"
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{t.quickStockOut}</span>
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-xl hover:bg-cafe-100 dark:hover:bg-jazz-card text-cafe-500 dark:text-stone-400 transition"
                      title={t.editItem}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من حذف هذه المادة نهائياً من المخزون؟')) {
                          deleteInventoryItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-500 transition"
                      title={t.delete}
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

      {/* Add / Edit Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-jazz-surface rounded-3xl border border-cafe-200 dark:border-jazz-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-5 py-4 border-b border-cafe-200 dark:border-jazz-border flex items-center justify-between">
              <h2 className="text-base font-extrabold text-cafe-900 dark:text-jazz-crema">
                {editingItem ? t.editItem : t.addItem}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-cafe-400 hover:text-cafe-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Name */}
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                  {t.itemName} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: حبوب قهوة كولومبية"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1.5">
                  {t.itemCategory}
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

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                    {t.itemQuantity} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                    {t.itemUnit}
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as InventoryUnit)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50 font-bold"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Minimum Alert Threshold */}
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                  {t.itemMinThreshold} ({formUnit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formMinThreshold}
                  onChange={(e) => setFormMinThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="الحد الذي يبدأ عنده التنبيه"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50 font-bold text-rose-600 dark:text-rose-400"
                />
                <p className="text-[11px] text-cafe-500 dark:text-stone-400 mt-1">
                  {t.itemMinThresholdHelp}
                </p>
              </div>

              {/* Cost per unit */}
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                  {t.itemCostPerUnit} ({settings.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formCostPerUnit}
                  onChange={(e) => setFormCostPerUnit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                  ملاحظات
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="ملاحظات حول المورد أو رقم الدفعة..."
                  className="w-full px-3.5 py-2 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50"
                />
              </div>

              {/* Buttons */}
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

      {/* Quick Adjust Modal (Stock IN / OUT) */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-jazz-surface rounded-3xl border border-cafe-200 dark:border-jazz-border shadow-2xl overflow-hidden p-5 space-y-4">
            
            <div className="flex items-center justify-between border-b border-cafe-100 dark:border-jazz-border pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  adjustType === 'in' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                }`}>
                  {adjustType === 'in' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-cafe-900 dark:text-jazz-crema">
                    {adjustType === 'in' ? t.stockInTitle : t.stockOutTitle}
                  </h3>
                  <p className="text-[11px] text-cafe-500 dark:text-stone-400 truncate max-w-[180px]">
                    {adjustingItem.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setAdjustingItem(null)} className="text-cafe-400 hover:text-cafe-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                  {t.adjustQuantity} ({adjustingItem.unit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  autoFocus
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="أدخل الكمية..."
                  className="w-full px-3.5 py-3 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-base text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold font-black text-center"
                />
              </div>

              <div>
                <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
                  ملاحظة الحركة (اختياري)
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder={adjustType === 'in' ? 'مثال: شراء كيس بن جديد' : 'مثال: استهلاك نوبة الصباح'}
                  className="w-full px-3 py-2 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold/50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2 rounded-xl border border-cafe-300 dark:border-jazz-border text-cafe-700 dark:text-stone-300 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-md active:scale-95 transition ${
                    adjustType === 'in'
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500'
                      : 'bg-gradient-to-r from-rose-600 to-rose-500'
                  }`}
                >
                  {t.confirm}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
