import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Obligation, InventoryItem, InventoryLog, UserSettings, TabType, BreakEvenConfig, DailyRecord } from '../types';
import { 
  getStoredObligations, 
  saveStoredObligations, 
  getStoredInventory, 
  saveStoredInventory, 
  getStoredLogs, 
  saveStoredLogs, 
  getStoredSettings, 
  saveStoredSettings,
  getStoredBreakEvenConfig,
  saveStoredBreakEvenConfig,
  getStoredDailyRecords,
  saveStoredDailyRecords,
  exportAllData,
  importAllData,
  resetToDefaults
} from '../services/storage';
import { translations } from '../i18n/translations';
import { notifications } from '../services/notifications';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: 'ar' | 'fr';
  setLanguage: (lang: 'ar' | 'fr') => void;
  t: typeof translations['ar'];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  
  // Obligations
  obligations: Obligation[];
  addObligation: (item: Omit<Obligation, 'id' | 'createdAt' | 'reminderTriggered'>) => void;
  updateObligation: (item: Obligation) => void;
  deleteObligation: (id: string) => void;
  toggleObligationStatus: (id: string) => void;

  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  adjustStock: (id: string, delta: number, note?: string) => void;

  // Logs
  logs: InventoryLog[];

  // Break-Even Calculator
  breakEvenConfig: BreakEvenConfig;
  updateBreakEvenConfig: (config: Partial<BreakEvenConfig>) => void;
  breakEvenMetrics: {
    effectiveMonthlyExpenses: number;
    contributionMargin: number;
    breakEvenDrinksMonthly: number;
    breakEvenDrinksDaily: number;
    breakEvenRevenueMonthly: number;
    breakEvenRevenueDaily: number;
    todayDrinksSold: number;
    todayDrinksPercent: number;
  };

  // Daily Records
  dailyRecords: DailyRecord[];
  addDailyRecord: (record: Omit<DailyRecord, 'id' | 'createdAt'>) => void;
  updateDailyRecord: (record: DailyRecord) => void;
  deleteDailyRecord: (id: string) => void;
  todayRecord?: DailyRecord;
  monthSummary: {
    revenue: number;
    expenses: number;
    net: number;
  };

  // Stats
  stats: {
    totalPending: number;
    totalPaidThisMonth: number;
    upcomingCount: number;
    lowStockCount: number;
    overdueCount: number;
  };

  // Backup
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings);
  const [obligations, setObligations] = useState<Obligation[]>(getStoredObligations);
  const [inventory, setInventory] = useState<InventoryItem[]>(getStoredInventory);
  const [logs, setLogs] = useState<InventoryLog[]>(getStoredLogs);
  const [breakEvenConfig, setBreakEvenConfig] = useState<BreakEvenConfig>(getStoredBreakEvenConfig);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>(getStoredDailyRecords);

  // Sync settings
  const language = settings.language;
  const theme = settings.theme;
  const t = translations[language];

  // Set RTL / LTR document direction and Dark mode class
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Periodic check for due reminders every 30 seconds
  useEffect(() => {
    const checkReminders = () => {
      notifications.checkDueReminders(obligations, (triggeredId) => {
        setObligations((prev) => {
          const updated = prev.map((item) =>
            item.id === triggeredId ? { ...item, reminderTriggered: true } : item
          );
          saveStoredObligations(updated);
          return updated;
        });
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [obligations]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveStoredSettings(updated);
      return updated;
    });
  }, []);

  const setLanguage = useCallback((lang: 'ar' | 'fr') => {
    updateSettings({ language: lang });
  }, [updateSettings]);

  const toggleTheme = useCallback(() => {
    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' });
  }, [theme, updateSettings]);

  // Break-even config operations
  const updateBreakEvenConfig = useCallback((newConfig: Partial<BreakEvenConfig>) => {
    setBreakEvenConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      saveStoredBreakEvenConfig(updated);
      return updated;
    });
  }, []);

  // Daily records operations
  const addDailyRecord = useCallback((record: Omit<DailyRecord, 'id' | 'createdAt'>) => {
    const newRecord: DailyRecord = {
      ...record,
      id: `daily-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDailyRecords((prev) => {
      const filtered = prev.filter((r) => r.date !== newRecord.date);
      const updated = [newRecord, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
      saveStoredDailyRecords(updated);
      return updated;
    });
  }, []);

  const updateDailyRecord = useCallback((record: DailyRecord) => {
    setDailyRecords((prev) => {
      const updated = prev.map((r) => (r.id === record.id ? record : r));
      saveStoredDailyRecords(updated);
      return updated;
    });
  }, []);

  const deleteDailyRecord = useCallback((id: string) => {
    setDailyRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveStoredDailyRecords(updated);
      return updated;
    });
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayRecord = useMemo(() => dailyRecords.find((r) => r.date === todayStr), [dailyRecords, todayStr]);

  const monthSummary = useMemo(() => {
    const currentYearMonth = new Date().toISOString().slice(0, 7);
    const currentMonthRecords = dailyRecords.filter((r) => r.date.startsWith(currentYearMonth));
    const revenue = currentMonthRecords.reduce((acc, r) => acc + r.revenue, 0);
    const expenses = currentMonthRecords.reduce((acc, r) => acc + r.expenses, 0);
    return {
      revenue,
      expenses,
      net: revenue - expenses,
    };
  }, [dailyRecords]);

  const breakEvenMetrics = useMemo(() => {
    let effectiveMonthlyExpenses = 0;
    if (breakEvenConfig.useAutoObligations) {
      effectiveMonthlyExpenses = obligations.reduce((acc, o) => acc + o.amount, 0);
      if (effectiveMonthlyExpenses === 0) {
        effectiveMonthlyExpenses = breakEvenConfig.customMonthlyExpenses;
      }
    } else {
      effectiveMonthlyExpenses = breakEvenConfig.customMonthlyExpenses;
    }

    const price = breakEvenConfig.avgDrinkPrice > 0 ? breakEvenConfig.avgDrinkPrice : 2.5;
    const cost = breakEvenConfig.avgDrinkCost >= 0 ? breakEvenConfig.avgDrinkCost : 0.65;
    const margin = Math.max(0.1, price - cost);
    const days = breakEvenConfig.workingDaysPerMonth > 0 ? breakEvenConfig.workingDaysPerMonth : 30;

    const breakEvenDrinksMonthly = Math.ceil(effectiveMonthlyExpenses / margin);
    const breakEvenDrinksDaily = Math.ceil(breakEvenDrinksMonthly / days);
    const breakEvenRevenueMonthly = breakEvenDrinksMonthly * price;
    const breakEvenRevenueDaily = breakEvenDrinksDaily * price;

    const todayDrinksSold = todayRecord
      ? (todayRecord.drinksSold || Math.round(todayRecord.revenue / price))
      : 0;

    const todayDrinksPercent = breakEvenDrinksDaily > 0 
      ? Math.min(100, Math.round((todayDrinksSold / breakEvenDrinksDaily) * 100))
      : 0;

    return {
      effectiveMonthlyExpenses,
      contributionMargin: Number(margin.toFixed(3)),
      breakEvenDrinksMonthly,
      breakEvenDrinksDaily,
      breakEvenRevenueMonthly,
      breakEvenRevenueDaily,
      todayDrinksSold,
      todayDrinksPercent,
    };
  }, [obligations, breakEvenConfig, todayRecord]);

  // Obligations operations
  const addObligation = useCallback((item: Omit<Obligation, 'id' | 'createdAt' | 'reminderTriggered'>) => {
    const newObligation: Obligation = {
      ...item,
      id: `obl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      reminderTriggered: false,
    };
    setObligations((prev) => {
      const updated = [newObligation, ...prev];
      saveStoredObligations(updated);
      return updated;
    });
  }, []);

  const updateObligation = useCallback((item: Obligation) => {
    setObligations((prev) => {
      const updated = prev.map((o) => (o.id === item.id ? item : o));
      saveStoredObligations(updated);
      return updated;
    });
  }, []);

  const deleteObligation = useCallback((id: string) => {
    setObligations((prev) => {
      const updated = prev.filter((o) => o.id !== id);
      saveStoredObligations(updated);
      return updated;
    });
  }, []);

  const toggleObligationStatus = useCallback((id: string) => {
    setObligations((prev) => {
      const updated = prev.map((o) => {
        if (o.id === id) {
          const isNowPaid = o.status !== 'paid';
          return {
            ...o,
            status: isNowPaid ? ('paid' as const) : ('pending' as const),
            paidAt: isNowPaid ? new Date().toISOString() : null,
          };
        }
        return o;
      });
      saveStoredObligations(updated);
      return updated;
    });
  }, []);

  // Inventory operations
  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id' | 'lastRestocked'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    setInventory((prev) => {
      const updated = [newItem, ...prev];
      saveStoredInventory(updated);
      return updated;
    });
  }, []);

  const updateInventoryItem = useCallback((item: InventoryItem) => {
    setInventory((prev) => {
      const updated = prev.map((i) => (i.id === item.id ? item : i));
      saveStoredInventory(updated);
      return updated;
    });
  }, []);

  const deleteInventoryItem = useCallback((id: string) => {
    setInventory((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      saveStoredInventory(updated);
      return updated;
    });
  }, []);

  const adjustStock = useCallback((id: string, delta: number, note?: string) => {
    setInventory((prev) => {
      let targetItem: InventoryItem | undefined;
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, Number((item.quantity + delta).toFixed(2)));
          targetItem = item;
          return {
            ...item,
            quantity: newQty,
            lastRestocked: delta > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked,
          };
        }
        return item;
      });
      saveStoredInventory(updated);

      if (targetItem) {
        const newLog: InventoryLog = {
          id: `log-${Date.now()}`,
          itemId: targetItem.id,
          itemName: targetItem.name,
          type: delta > 0 ? 'in' : 'out',
          amount: Math.abs(delta),
          unit: targetItem.unit,
          date: new Date().toISOString(),
          note: note || (delta > 0 ? 'توريد يدوي' : 'استهلاك يدوي'),
        };
        setLogs((prevLogs) => {
          const updatedLogs = [newLog, ...prevLogs];
          saveStoredLogs(updatedLogs);
          return updatedLogs;
        });

        // Trigger warning chime if stock fell below threshold
        if (targetItem.quantity + delta <= targetItem.minThreshold) {
          notifications.playJazzChime();
        }
      }

      return updated;
    });
  }, []);

  // Calculated Stats
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let totalPending = 0;
    let totalPaidThisMonth = 0;
    let upcomingCount = 0;
    let overdueCount = 0;

    obligations.forEach((item) => {
      if (item.status === 'paid') {
        totalPaidThisMonth += item.amount;
      } else {
        totalPending += item.amount;
        if (item.dueDate < todayStr) {
          overdueCount++;
        } else if (item.dueDate <= sevenDaysFromNow) {
          upcomingCount++;
        }
      }
    });

    const lowStockCount = inventory.filter((i) => i.quantity <= i.minThreshold).length;

    return {
      totalPending,
      totalPaidThisMonth,
      upcomingCount,
      lowStockCount,
      overdueCount,
    };
  }, [obligations, inventory]);

  // Export & Import
  const exportData = useCallback(() => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jazzapp-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback((jsonStr: string) => {
    const success = importAllData(jsonStr);
    if (success) {
      setObligations(getStoredObligations());
      setInventory(getStoredInventory());
      setLogs(getStoredLogs());
      setSettings(getStoredSettings());
      setBreakEvenConfig(getStoredBreakEvenConfig());
      setDailyRecords(getStoredDailyRecords());
    }
    return success;
  }, []);

  const resetAll = useCallback(() => {
    resetToDefaults();
    setObligations(getStoredObligations());
    setInventory(getStoredInventory());
    setLogs(getStoredLogs());
    setSettings(getStoredSettings());
    setBreakEvenConfig(getStoredBreakEvenConfig());
    setDailyRecords(getStoredDailyRecords());
  }, []);

  const contextValue = useMemo(() => ({
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    settings,
    updateSettings,
    obligations,
    addObligation,
    updateObligation,
    deleteObligation,
    toggleObligationStatus,
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
    logs,
    breakEvenConfig,
    updateBreakEvenConfig,
    breakEvenMetrics,
    dailyRecords,
    addDailyRecord,
    updateDailyRecord,
    deleteDailyRecord,
    todayRecord,
    monthSummary,
    stats,
    exportData,
    importData,
    resetAll,
  }), [
    activeTab,
    language,
    t,
    theme,
    settings,
    obligations,
    inventory,
    logs,
    breakEvenConfig,
    breakEvenMetrics,
    dailyRecords,
    todayRecord,
    monthSummary,
    stats,
    setLanguage,
    toggleTheme,
    updateSettings,
    addObligation,
    updateObligation,
    deleteObligation,
    toggleObligationStatus,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
    updateBreakEvenConfig,
    addDailyRecord,
    updateDailyRecord,
    deleteDailyRecord,
    exportData,
    importData,
    resetAll,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
