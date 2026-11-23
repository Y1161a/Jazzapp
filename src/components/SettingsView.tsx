import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  Moon, 
  Sun, 
  Coins, 
  Store, 
  Bell, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Coffee
} from 'lucide-react';
import { notifications } from '../services/notifications';

export const SettingsView: React.FC = () => {
  const { 
    t, 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    settings, 
    updateSettings, 
    exportData, 
    importData, 
    resetAll 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(() => {
    return notifications.isPermissionGranted();
  });

  const currencies = [
    { code: 'د.ت', label: 'دينار تونسي (د.ت)' },
    { code: 'SAR', label: 'ريال سعودي (SAR)' },
    { code: 'AED', label: 'درهم إماراتي (AED)' },
    { code: 'DZD', label: 'دينار جزائري (DZD)' },
    { code: 'MAD', label: 'درهم مغربي (MAD)' },
    { code: 'USD', label: 'دولار أمريكي ($)' },
    { code: 'EUR', label: 'يورو (€)' },
  ];

  const handleRequestNotifications = async () => {
    const granted = await notifications.requestPermission();
    setHasNotificationPermission(granted);
    if (granted) {
      notifications.sendNotification(
        'مرحباً بك في Jazzapp!',
        'تم تفعيل إشعارات الهاتف بنجاح. ستصلك تذكيرات الالتزامات في الوقت المحدد.',
        'welcome-notif'
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus('تم استيراد النسخة الاحتياطية بنجاح!');
        notifications.playJazzChime();
      } else {
        setImportStatus('فشل الاستيراد: ملف غير صالح');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-5 pb-8">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-cafe-900 dark:text-jazz-crema">
          {t.settingsTitle}
        </h1>
        <p className="text-xs text-cafe-500 dark:text-stone-400 mt-0.5">
          {t.generalSettings}
        </p>
      </div>

      {/* App Appearance & Language Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border shadow-sm space-y-4">
        
        {/* Language Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cafe-500/10 text-cafe-700 dark:text-jazz-gold flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-cafe-900 dark:text-stone-100 block">
                {t.language}
              </span>
              <span className="text-[11px] text-cafe-500 dark:text-stone-400">
                {language === 'ar' ? 'العربية مع اتجاه RTL' : 'Français avec LTR'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-cafe-100 dark:bg-jazz-card p-1 rounded-2xl border border-cafe-200 dark:border-jazz-border">
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                language === 'ar'
                  ? 'bg-cafe-900 text-white dark:bg-jazz-gold dark:text-cafe-950 shadow-sm'
                  : 'text-cafe-600 dark:text-stone-400 hover:text-cafe-900'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                language === 'fr'
                  ? 'bg-cafe-900 text-white dark:bg-jazz-gold dark:text-cafe-950 shadow-sm'
                  : 'text-cafe-600 dark:text-stone-400 hover:text-cafe-900'
              }`}
            >
              FR
            </button>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center justify-between pt-3 border-t border-cafe-100 dark:border-jazz-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cafe-500/10 text-cafe-700 dark:text-jazz-gold flex items-center justify-center">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-xs font-bold text-cafe-900 dark:text-stone-100 block">
                {t.theme}
              </span>
              <span className="text-[11px] text-cafe-500 dark:text-stone-400">
                {theme === 'dark' ? t.themeDark : t.themeLight}
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-xl border border-cafe-300 dark:border-jazz-border text-xs font-bold bg-cafe-50 dark:bg-jazz-card text-cafe-800 dark:text-stone-200 active:scale-95 transition"
          >
            {theme === 'dark' ? 'تبديل للنهاري' : 'تبديل للداكن'}
          </button>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center justify-between pt-3 border-t border-cafe-100 dark:border-jazz-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cafe-500/10 text-cafe-700 dark:text-jazz-gold flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-cafe-900 dark:text-stone-100 block">
                {t.currency}
              </span>
              <span className="text-[11px] text-cafe-500 dark:text-stone-400">
                {settings.currency}
              </span>
            </div>
          </div>

          <select
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value })}
            className="px-3 py-1.5 rounded-xl border border-cafe-300 dark:border-jazz-border text-xs font-bold bg-cafe-50 dark:bg-jazz-card text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Cafe Profile Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border shadow-sm space-y-3.5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-cafe-500 dark:text-jazz-amber flex items-center gap-1.5">
          <Store className="w-4 h-4" />
          <span>{t.cafeInfo}</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
              {t.cafeNameInput}
            </label>
            <input
              type="text"
              value={settings.cafeName}
              onChange={(e) => updateSettings({ cafeName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-cafe-800 dark:text-stone-200 mb-1">
              {t.ownerNameInput}
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.ownerName}
                onChange={(e) => updateSettings({ ownerName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-xs text-cafe-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-jazz-gold font-bold"
              />
              <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-jazz-gold font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المنشئ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile PWA & Notifications Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-cafe-900 dark:text-stone-100 block">
                {t.notificationsStatus}
              </span>
              <span className="text-[11px] text-cafe-500 dark:text-stone-400">
                {hasNotificationPermission ? t.notificationsAllowed : t.notificationsBlocked}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => notifications.playJazzChime()}
              className="px-2.5 py-1.5 rounded-xl bg-cafe-100 dark:bg-jazz-card text-cafe-700 dark:text-stone-300 text-xs font-bold border border-cafe-200 dark:border-jazz-border active:scale-95 transition"
              title={t.testChime}
            >
              تجربة الصوت
            </button>

            {!hasNotificationPermission && (
              <button
                onClick={handleRequestNotifications}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cafe-700 to-jazz-gold text-white text-xs font-bold shadow-sm active:scale-95 transition"
              >
                {t.enableNotifications}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Sovereignty, Backup & Restore Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-jazz-surface border border-cafe-200 dark:border-jazz-border shadow-sm space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-cafe-900 dark:text-jazz-crema">
              {t.dataManagement}
            </h2>
            <p className="text-[11px] text-cafe-500 dark:text-stone-400">
              {t.dataDesc}
            </p>
          </div>
        </div>

        {importStatus && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={exportData}
            className="py-2.5 px-3 rounded-2xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-cafe-900 dark:text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-cafe-100 dark:hover:bg-jazz-border/40 transition active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4 text-jazz-gold" />
            <span>{t.exportBackup}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 rounded-2xl bg-cafe-50 dark:bg-jazz-card border border-cafe-300 dark:border-jazz-border text-cafe-900 dark:text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-cafe-100 dark:hover:bg-jazz-border/40 transition active:scale-95 shadow-sm"
          >
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>{t.importBackup}</span>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
        </div>

        <div className="pt-2 border-t border-cafe-100 dark:border-jazz-border/60">
          <button
            onClick={() => {
              if (window.confirm(t.confirmReset)) {
                resetAll();
              }
            }}
            className="w-full py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetData}</span>
          </button>
        </div>
      </div>

      {/* About & Creator Attribution Box */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-cafe-900 via-cafe-950 to-black text-white border border-jazz-border shadow-lg space-y-2 text-center">
        <div className="w-12 h-12 rounded-2xl bg-jazz-gold/15 border border-jazz-gold/30 text-jazz-gold mx-auto flex items-center justify-center mb-1">
          <Coffee className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black tracking-tight text-jazz-crema">
          Jazzapp — جاز آب
        </h3>
        <p className="text-xs text-cafe-300 font-medium max-w-xs mx-auto">
          تطبيق الويب التقدمي (PWA) الذكي لإدارة التزامات ومخزون المقاهي
        </p>

        <div className="pt-3 border-t border-white/10 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-xs text-jazz-gold font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.designedBy}</span>
          </div>
          <span className="text-sm font-black text-white">
            {t.ownerFullName}
          </span>
          <span className="text-[10px] text-cafe-400 mt-0.5">
            {t.version} · حماية تامة وبيانات محلية 100%
          </span>
        </div>
      </div>

    </div>
  );
};
