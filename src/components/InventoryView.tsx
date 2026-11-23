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

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Quick Adjustment Modal State
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<'in' | 'out'>('in');
  const [adjustAmount, setAdjustAmount] = useState<number | ''>('');
  const [adjustNote, setAdjustNote] = useState('');

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<InventoryCategory>('coffee');
  const [formQuantity, setFormQuantity] = useState<number | ''>('');
  const [formUnit, setFormUnit] = useState<InventoryUnit>('kg');
  const [formMinThreshold, setFormMinThreshold] = useState<number | ''>('');
  const [formCostPerUnit, setFormCostPerUnit] = useState<number | ''>('');
  const [formNotes, setFormNotes] = useState('');

  const getCategoryMeta = (cat: InventoryCategory) => {
    switch (cat) {
      case 'coffee': return { label: t.catCoffee, icon: Coffee };
      case 'milk': return { label: t.catMilk, icon: Milk };
      case 'beverages': return { label: t.catBeverages, icon: Wine };
      case 'pastry': return { label: t.catPastry, icon: Cookie };
      case 'disposables': return { label: t.catDisposables, icon: ShoppingBag };
      case 'cleaning': return { label: t.catCleaning, icon: Sparkles };
      default: return { label: t.catOther, icon: Package };
    }
  };

  const categories: InventoryCategory[] = [
    'coffee', 'milk', 'beverages', 'pastry', 'disposables', 'cleaning', 'other'
  ];

  const units: InventoryUnit[] = ['kg', 'g', 'L', 'ml', 'piece', 'box', 'pack'];

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
    <div className="space-y-5 pb-28 max-w-md mx-auto">
      
      {/* Header Summary Card (40px radius) */}
      <div className="p-6 rounded-[40px] bg-white border border-sage/20 shadow-soft relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-6 -me-6 w-36 h-36 rounded-full bg-sage/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sage block">
              {t.navInventory} · {settings.cafeName}
            </span>
            <h2 className="text-[24px] font-black text-charcoal leading-tight">
              {inventory.length} <span className="text-sm font-bold text-sage">{settings.language === 'ar' ? 'صنف مسجل' : 'articles'}</span>
            </h2>
            <p className="text-xs text-sage font-bold mt-0.5">
              {inventory.filter((i) => i.quantity <= i.minThreshold).length} {t.stockLow}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-12 h-12 rounded-full bg-white border border-sage text-charcoal flex items-center justify-center shadow-sm active:scale-95 transition"
              title="سجل الحركات"
            >
              <History className="w-5 h-5 text-sage" />
            </button>
            <button
              onClick={openAddModal}
              className="w-12 h-12 rounded-full bg-brandRed flex items-center justify-center text-white shadow-fab active:scale-95 transition"
              title={t.addItem}
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Low Stock Toggle */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-sage absolute start-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchInventory}
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

        {/* Low Stock Toggle Pill */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`h-9 px-4 rounded-full text-xs font-black flex items-center gap-1.5 transition ${
              onlyLowStock
                ? 'bg-brandRed text-white shadow-sm'
                : 'bg-white text-charcoal border border-sage/30 hover:border-sage'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.lowStockFilter}</span>
          </button>

          <span className="text-[11px] text-sage font-bold">
            {filteredInventory.length} {settings.language === 'ar' ? 'معروض' : 'affichés'}
          </span>
        </div>
      </div>

      {/* Category Chips */}
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

      {/* Logs Drawer (if toggled) */}
      {showHistory && (
        <div className="p-5 rounded-[32px] bg-white border border-sage/30 shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-sage/20 pb-2.5">
            <h4 className="font-black text-sm text-charcoal flex items-center gap-1.5">
              <History className="w-4 h-4 text-brandRed" />
              <span>{t.recentActivity}</span>
            </h4>
            <button onClick={() => setShowHistory(false)} className="text-sage hover:text-charcoal">
              <X className="w-4 h-4" />
            </button>
          </div>
          {logs.length === 0 ? (
            <p className="text-xs text-sage py-3 text-center">لا توجد حركات مسجلة بعد</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-sage/10">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                      log.type === 'in' ? 'bg-charcoal' : 'bg-brandRed'
                    }`}>
                      {log.type === 'in' ? '+' : '-'}
                    </span>
                    <span className="font-extrabold text-charcoal truncate max-w-[140px]">{log.itemName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-charcoal">{log.amount} {log.unit}</span>
                    <span className="text-[10px] text-sage">{log.date.slice(0, 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feed Cards: 24px radius cards */}
      {filteredInventory.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-[40px] border border-sage/30 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-sage/20 text-charcoal mx-auto flex items-center justify-center mb-3">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-xs font-black text-charcoal">
            {t.noItemsFound}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInventory.map((item) => {
            const meta = getCategoryMeta(item.category);
            const Icon = meta.icon;
            const isLow = item.quantity <= item.minThreshold;

            return (
              <div
                key={item.id}
                className="p-4 rounded-[24px] bg-white border border-sage/30 shadow-card flex flex-col gap-3 hover:border-sage transition"
              >
                {/* 56px Icon Container, Heading, Quantity */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      isLow ? 'bg-brandRed/10 text-brandRed' : 'bg-charcoal/10 text-charcoal'
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sage">
                          {meta.label}
                        </span>
                        {isLow ? (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-brandRed text-white animate-pulse">
                            {t.stockLow}
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sage/20 text-charcoal">
                            {t.stockHealthy}
                          </span>
                        )}
                      </div>

                      {/* 18px bold heading */}
                      <h4 className="text-[17px] font-extrabold text-charcoal truncate mt-0.5">
                        {item.name}
                      </h4>

                      <div className="text-[11px] font-medium text-sage mt-0.5">
                        الحد الأدنى: <strong>{item.minThreshold} {item.unit}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Display */}
                  <div className="text-end shrink-0">
                    <div className={`text-xl font-black ${isLow ? 'text-brandRed' : 'text-charcoal'}`}>
                      {item.quantity}
                    </div>
                    <div className="text-[11px] font-extrabold text-sage">
                      {item.unit}
                    </div>
                  </div>
                </div>

                {/* Bottom Controls: Stepper, Quick Adjust & Actions */}
                <div className="pt-2 border-t border-sage/20 flex items-center justify-between gap-2">
                  
                  {/* Stepper */}
                  <div className="flex items-center gap-1 bg-offwhite p-1 rounded-full border border-sage/30">
                    <button
                      onClick={() => adjustStock(item.id, -1, 'استهلاك يدوي (-1)')}
                      className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-charcoal hover:bg-brandRed hover:text-white transition active:scale-90"
                      title="خصم 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-black text-charcoal min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => adjustStock(item.id, 1, 'توريد يدوي (+1)')}
                      className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-charcoal hover:bg-charcoal hover:text-white transition active:scale-90"
                      title="إضافة 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick in/out + Edit/Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openAdjustModal(item, 'in')}
                      className="px-3 py-1.5 rounded-full bg-charcoal text-white text-xs font-black flex items-center gap-1 active:scale-95 transition"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{t.quickStockIn}</span>
                    </button>

                    <button
                      onClick={() => openAdjustModal(item, 'out')}
                      className="px-3 py-1.5 rounded-full bg-brandRed text-white text-xs font-black flex items-center gap-1 active:scale-95 transition"
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{t.quickStockOut}</span>
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-sage hover:text-charcoal"
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
                      className="p-1.5 text-sage hover:text-brandRed"
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

      {/* Add / Edit Modal (40px radius) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[40px] border border-sage/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-5 border-b border-sage/20 flex items-center justify-between">
              <h3 className="text-[20px] font-black text-charcoal">
                {editingItem ? t.editItem : t.addItem}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-charcoal hover:bg-brandRed hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
                  {t.itemName} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: حبوب بن كولومبي"
                  className="w-full px-4 py-3 rounded-2xl bg-offwhite border border-sage/30 text-xs text-charcoal font-bold focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1.5">
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
                    className="w-full px-4 py-3 rounded-2xl bg-offwhite border border-sage/30 text-sm font-black text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
                    {t.itemUnit}
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as InventoryUnit)}
                    className="w-full px-3 py-3 rounded-2xl bg-offwhite border border-sage/30 text-xs font-bold text-charcoal focus:outline-none focus:border-charcoal"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
                  {t.itemMinThreshold} ({formUnit}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formMinThreshold}
                  onChange={(e) => setFormMinThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="5"
                  className="w-full px-4 py-3 rounded-2xl bg-offwhite border border-sage/30 text-xs font-bold text-brandRed focus:outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
                  {t.itemCostPerUnit} ({settings.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formCostPerUnit}
                  onChange={(e) => setFormCostPerUnit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-2xl bg-offwhite border border-sage/30 text-xs font-bold text-charcoal focus:outline-none focus:border-charcoal"
                />
              </div>

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

      {/* Adjust Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-[40px] border border-sage/30 shadow-2xl overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-sage/20 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  adjustType === 'in' ? 'bg-charcoal text-white' : 'bg-brandRed text-white'
                }`}>
                  {adjustType === 'in' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-black text-sm text-charcoal">
                    {adjustType === 'in' ? t.stockInTitle : t.stockOutTitle}
                  </h4>
                  <p className="text-[11px] text-sage font-bold truncate max-w-[160px]">
                    {adjustingItem.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setAdjustingItem(null)} className="text-sage hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
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
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-2xl bg-offwhite border border-sage/30 text-lg text-charcoal focus:outline-none focus:border-charcoal font-black text-center"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
                  ملاحظة الحركة
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="مثال: توريد شحنة جديدة"
                  className="w-full px-4 py-2.5 rounded-2xl bg-offwhite border border-sage/30 text-xs text-charcoal focus:outline-none focus:border-charcoal font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-5 py-2.5 rounded-full border border-sage text-charcoal font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-full text-white font-black shadow-md active:scale-95 transition ${
                    adjustType === 'in'
                      ? 'bg-charcoal hover:bg-black'
                      : 'bg-brandRed hover:bg-brandRed-hover'
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
