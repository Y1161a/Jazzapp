export type ObligationCategory = 
  | 'electricity'
  | 'water'
  | 'internet'
  | 'rent'
  | 'taxes'
  | 'maintenance'
  | 'supplies'
  | 'other';

export type ObligationStatus = 'pending' | 'paid' | 'overdue';

export interface Obligation {
  id: string;
  title: string;
  category: ObligationCategory;
  amount: number;
  currency: string;
  dueDate: string; // YYYY-MM-DD
  reminderDateTime: string | null; // YYYY-MM-DDTHH:mm
  reminderTriggered: boolean;
  status: ObligationStatus;
  paidAt?: string | null;
  notes?: string;
  createdAt: string;
}

export type InventoryCategory = 
  | 'coffee'
  | 'milk'
  | 'beverages'
  | 'pastry'
  | 'disposables'
  | 'cleaning'
  | 'other';

export type InventoryUnit = 'kg' | 'g' | 'L' | 'ml' | 'piece' | 'box' | 'pack';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: InventoryUnit;
  minThreshold: number;
  costPerUnit?: number;
  lastRestocked: string;
  notes?: string;
}

export interface InventoryLog {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out';
  amount: number;
  unit: InventoryUnit;
  date: string;
  note?: string;
}

export interface UserSettings {
  language: 'ar' | 'fr';
  theme: 'dark' | 'light';
  currency: string;
  cafeName: string;
  ownerName: string;
  notificationsEnabled: boolean;
}

export interface BreakEvenConfig {
  useAutoObligations: boolean;
  customMonthlyExpenses: number;
  avgDrinkPrice: number;
  avgDrinkCost: number;
  workingDaysPerMonth: number;
}

export interface DailyRecord {
  id: string;
  date: string; // YYYY-MM-DD
  revenue: number; // العائد المالي لليوم
  expenses: number; // المصاريف اليومية
  drinksSold?: number; // عدد المشروبات المباعة (اختياري)
  notes?: string;
  createdAt: string;
}

export type TabType = 'dashboard' | 'obligations' | 'inventory' | 'breakeven' | 'daily' | 'settings';
