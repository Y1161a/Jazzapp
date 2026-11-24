import { Obligation, InventoryItem, InventoryLog, UserSettings, BreakEvenConfig, DailyRecord } from '../types';

const STORAGE_KEYS = {
  OBLIGATIONS: 'jazzapp_obligations_v1',
  INVENTORY: 'jazzapp_inventory_v1',
  LOGS: 'jazzapp_inventory_logs_v1',
  SETTINGS: 'jazzapp_settings_v1',
  BREAK_EVEN: 'jazzapp_breakeven_v1',
  DAILY_RECORDS: 'jazzapp_daily_records_v1',
};

export const defaultSettings: UserSettings = {
  language: 'ar',
  theme: 'dark',
  currency: 'د.ت',
  cafeName: 'Jazz Cafe',
  ownerName: 'ياسين وشتاتي',
  notificationsEnabled: true,
};

// Seed sample obligations for first launch
export const initialObligations: Obligation[] = [
  {
    id: 'obl-1',
    title: 'فاتورة الكهرباء (الشركة التونسية للكهرباء والغاز)',
    category: 'electricity',
    amount: 480,
    currency: 'د.ت',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    reminderDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    reminderTriggered: false,
    status: 'pending',
    notes: 'استهلاك عداد المحل والمكيفات ومطحنة القهوة',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'obl-2',
    title: 'اشتراك الإنترنت والألياف البصرية (Fibre Pro)',
    category: 'internet',
    amount: 110,
    currency: 'د.ت',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reminderDateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    reminderTriggered: false,
    status: 'pending',
    notes: 'شبكة الـ Wi-Fi المخصصة لحرفاء المقهى والموسيقى',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'obl-3',
    title: 'أداءات المعلوم على المؤسسات البلدية (TCL)',
    category: 'taxes',
    amount: 250,
    currency: 'د.ت',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reminderDateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    reminderTriggered: false,
    status: 'pending',
    notes: 'دفعة القسط الثلاثي للبلدية',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'obl-4',
    title: 'فاتورة الماء (الصوناد)',
    category: 'water',
    amount: 145,
    currency: 'د.ت',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // overdue
    reminderDateTime: null,
    reminderTriggered: false,
    status: 'overdue',
    notes: 'استهلاك آلة القهوة ونظام التصفية',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'obl-5',
    title: 'معلوم كراء المحل (إيجار المقهى)',
    category: 'rent',
    amount: 1200,
    currency: 'د.ت',
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reminderDateTime: null,
    reminderTriggered: true,
    status: 'paid',
    paidAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'تم الدفع لصاحب العقار مع وصل استلام',
    createdAt: new Date().toISOString(),
  }
];

// Seed sample inventory items
export const initialInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'حبوب بن إسبريسو مختص (Specialty Blend)',
    category: 'coffee',
    quantity: 12,
    unit: 'kg',
    minThreshold: 5,
    costPerUnit: 45,
    lastRestocked: new Date().toISOString().split('T')[0],
    notes: 'خلطة برازيلية إثيوبية تحميص متوسط',
  },
  {
    id: 'inv-2',
    name: 'حليب كامل الدسم مبستر',
    category: 'milk',
    quantity: 18,
    unit: 'L',
    minThreshold: 10,
    costPerUnit: 1.4,
    lastRestocked: new Date().toISOString().split('T')[0],
    notes: 'خاص بتبخير الكابتشينو والفلات وايت',
  },
  {
    id: 'inv-3',
    name: 'أكواب كرتونية صديقة للبيئة (Takeaway Cups 8oz)',
    category: 'disposables',
    quantity: 80,
    unit: 'piece',
    minThreshold: 150, // Below threshold -> trigger warning!
    costPerUnit: 0.25,
    lastRestocked: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'أكواب المشروبات الساخنة الخارجية',
  },
  {
    id: 'inv-4',
    name: 'سكر أبيض في أكياس صغيرة (Sticks)',
    category: 'other',
    quantity: 4,
    unit: 'box',
    minThreshold: 2,
    costPerUnit: 12,
    lastRestocked: new Date().toISOString().split('T')[0],
    notes: 'علب 500 مغلف',
  },
  {
    id: 'inv-5',
    name: 'سيروب الفانيليا الإيطالي (Monin Vanilla)',
    category: 'beverages',
    quantity: 1,
    unit: 'piece',
    minThreshold: 2, // Below threshold -> trigger warning!
    costPerUnit: 35,
    lastRestocked: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'قارورة زجاجية 700 مل',
  }
];

export const initialLogs: InventoryLog[] = [
  {
    id: 'log-1',
    itemId: 'inv-1',
    itemName: 'حبوب بن إسبريسو مختص',
    type: 'in',
    amount: 10,
    unit: 'kg',
    date: new Date().toISOString(),
    note: 'شحنة توريد جديدة',
  }
];

// Helper functions for LocalStorage
export function getStoredObligations(): Obligation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OBLIGATIONS);
    if (!data) {
      saveStoredObligations(initialObligations);
      return initialObligations;
    }
    return JSON.parse(data);
  } catch {
    return initialObligations;
  }
}

export function saveStoredObligations(obligations: Obligation[]): void {
  localStorage.setItem(STORAGE_KEYS.OBLIGATIONS, JSON.stringify(obligations));
}

export function getStoredInventory(): InventoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (!data) {
      saveStoredInventory(initialInventory);
      return initialInventory;
    }
    return JSON.parse(data);
  } catch {
    return initialInventory;
  }
}

export function saveStoredInventory(items: InventoryItem[]): void {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
}

export function getStoredLogs(): InventoryLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!data) {
      saveStoredLogs(initialLogs);
      return initialLogs;
    }
    return JSON.parse(data);
  } catch {
    return initialLogs;
  }
}

export function saveStoredLogs(logs: InventoryLog[]): void {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

export function getStoredSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      saveStoredSettings(defaultSettings);
      return defaultSettings;
    }
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export const defaultBreakEvenConfig: BreakEvenConfig = {
  useAutoObligations: true,
  customMonthlyExpenses: 3000,
  avgDrinkPrice: 2.5,
  avgDrinkCost: 0.65,
  workingDaysPerMonth: 30,
};

const todayIso = new Date().toISOString().split('T')[0];
const yesterdayIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const initialDailyRecords: DailyRecord[] = [
  {
    id: 'daily-1',
    date: yesterdayIso,
    revenue: 380,
    expenses: 65,
    drinksSold: 140,
    notes: 'مبيعات جيدة ومشتريات نعناع وسكر طارئة',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'daily-2',
    date: todayIso,
    revenue: 260,
    expenses: 40,
    drinksSold: 95,
    notes: 'صندوق اليوم حتى الآن',
    createdAt: new Date().toISOString(),
  }
];

export function getStoredBreakEvenConfig(): BreakEvenConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BREAK_EVEN);
    if (!data) {
      saveStoredBreakEvenConfig(defaultBreakEvenConfig);
      return defaultBreakEvenConfig;
    }
    return { ...defaultBreakEvenConfig, ...JSON.parse(data) };
  } catch {
    return defaultBreakEvenConfig;
  }
}

export function saveStoredBreakEvenConfig(config: BreakEvenConfig): void {
  localStorage.setItem(STORAGE_KEYS.BREAK_EVEN, JSON.stringify(config));
}

export function getStoredDailyRecords(): DailyRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
    if (!data) {
      saveStoredDailyRecords(initialDailyRecords);
      return initialDailyRecords;
    }
    return JSON.parse(data);
  } catch {
    return initialDailyRecords;
  }
}

export function saveStoredDailyRecords(records: DailyRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
}

// Backup & Restore
export function exportAllData(): string {
  const backup = {
    version: '1.1',
    exportDate: new Date().toISOString(),
    author: 'ياسين وشتاتي',
    appName: 'Jazzapp',
    obligations: getStoredObligations(),
    inventory: getStoredInventory(),
    logs: getStoredLogs(),
    settings: getStoredSettings(),
    breakEvenConfig: getStoredBreakEvenConfig(),
    dailyRecords: getStoredDailyRecords(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && (parsed.obligations || parsed.inventory)) {
      if (parsed.obligations) saveStoredObligations(parsed.obligations);
      if (parsed.inventory) saveStoredInventory(parsed.inventory);
      if (parsed.logs) saveStoredLogs(parsed.logs);
      if (parsed.settings) saveStoredSettings(parsed.settings);
      if (parsed.breakEvenConfig) saveStoredBreakEvenConfig(parsed.breakEvenConfig);
      if (parsed.dailyRecords) saveStoredDailyRecords(parsed.dailyRecords);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}

export function resetToDefaults(): void {
  saveStoredObligations(initialObligations);
  saveStoredInventory(initialInventory);
  saveStoredLogs(initialLogs);
  saveStoredSettings(defaultSettings);
  saveStoredBreakEvenConfig(defaultBreakEvenConfig);
  saveStoredDailyRecords(initialDailyRecords);
}
