import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
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
    <div className="space-y-5 pb-28 max-w-md mx-auto">
      
      {/* Creator Profile Hero Card (40px radius) */}
      <div className="p-6 rounded-[40px] bg-charcoal text-white shadow-soft relative overflow-hidden border border-sage/20">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-44 h-44 rounded-full bg-brandRed/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white text-charcoal flex items-center justify-center shrink-0 border-2 border-sage/40 shadow-card">
            <Coffee className="w-8 h-8 text-charcoal" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-brandRed font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.creatorBadge}</span>
            </div>
            <h2 className="text-[22px] font-black text-white leading-tight">
              {settings.ownerName || 'ياسين وشتاتي'}
            </h2>
            <p className="text-[11px] text-sage font-medium mt-0.5">
              {settings.cafeName} · {t.version}
            </p>
          </div>
        </div>
      </div>

      {/* App Configuration Card (24px radius) */}
      <div className="p-5 rounded-[24px] bg-white border border-sage/30 shadow-card space-y-4">
        
        {/* Language Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-charcoal/10 text-charcoal flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-charcoal block">
                {t.language}
              </span>
              <span className="text-[10px] text-sage font-bold">
                {language === 'ar' ? 'العربية (RTL)' : 'Français (LTR)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-offwhite p-1 rounded-full border border-sage/30">
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 rounded-full text-xs font-black transition ${
                language === 'ar'
                  ? 'bg-charcoal text-white shadow-sm'
                  : 'text-sage hover:text-charcoal'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1 rounded-full text-xs font-black transition ${
                language === 'fr'
                  ? 'bg-charcoal text-white shadow-sm'
                  : 'text-sage hover:text-charcoal'
              }`}
            >
              FR
            </button>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center justify-between pt-3 border-t border-sage/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-charcoal/10 text-charcoal flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-charcoal block">
                {t.currency}
              </span>
              <span className="text-[10px] text-sage font-bold">
                {settings.currency}
              </span>
            </div>
          </div>

          <select
            value={settings.currency}
            onChange={(e) => updateSettings({ currency: e.target.value })}
            className="px-3 py-2 rounded-2xl border border-sage/40 text-xs font-black bg-offwhite text-charcoal focus:outline-none focus:border-charcoal"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Cafe Profile Card (24px radius) */}
      <div className="p-5 rounded-[24px] bg-white border border-sage/30 shadow-card space-y-3.5">
        <h3 className="text-[11px] font-black uppercase tracking-wider text-sage flex items-center gap-1.5">
          <Store className="w-4 h-4 text-charcoal" />
          <span>{t.cafeInfo}</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
              {t.cafeNameInput}
            </label>
            <input
              type="text"
              value={settings.cafeName}
              onChange={(e) => updateSettings({ cafeName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-offwhite border border-sage/30 text-xs text-charcoal font-black focus:outline-none focus:border-charcoal"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-sage mb-1">
              {t.ownerNameInput}
            </label>
            <input
              type="text"
              value={settings.ownerName}
              onChange={(e) => updateSettings({ ownerName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-offwhite border border-sage/30 text-xs text-charcoal font-black focus:outline-none focus:border-charcoal"
            />
          </div>
        </div>
      </div>

      {/* Notifications Card (24px radius) */}
      <div className="p-5 rounded-[24px] bg-white border border-sage/30 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-charcoal block">
                {t.notificationsStatus}
              </span>
              <span className="text-[10px] text-sage font-bold">
                {hasNotificationPermission ? t.notificationsAllowed : t.notificationsBlocked}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => notifications.playJazzChime()}
              className="px-3 py-1.5 rounded-full bg-offwhite text-charcoal text-xs font-bold border border-sage/40 hover:border-charcoal active:scale-95 transition"
            >
              {settings.language === 'ar' ? 'تجربة النغمة' : 'Tester'}
            </button>

            {!hasNotificationPermission && (
              <button
                onClick={handleRequestNotifications}
                className="px-4 py-1.5 rounded-full bg-brandRed text-white text-xs font-black shadow-fab active:scale-95 transition"
              >
                {t.enableNotifications}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Data Sovereignty Card (24px radius) */}
      <div className="p-5 rounded-[24px] bg-white border border-sage/30 shadow-card space-y-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-charcoal/10 text-charcoal flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-charcoal">
              {t.dataManagement}
            </h3>
            <p className="text-[10px] text-sage font-bold">
              {t.dataDesc}
            </p>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-2xl bg-sage/20 border border-sage/40 text-xs text-charcoal font-black flex items-center gap-2">
            <Check className="w-4 h-4 text-charcoal" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={exportData}
            className="py-3 px-3 rounded-2xl bg-offwhite border border-sage/40 text-charcoal text-xs font-black flex items-center justify-center gap-1.5 hover:border-charcoal active:scale-95 transition"
          >
            <Download className="w-4 h-4 text-charcoal" />
            <span>{t.exportBackup}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-3 px-3 rounded-2xl bg-offwhite border border-sage/40 text-charcoal text-xs font-black flex items-center justify-center gap-1.5 hover:border-charcoal active:scale-95 transition"
          >
            <Upload className="w-4 h-4 text-charcoal" />
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

        <div className="pt-2 border-t border-sage/20">
          <button
            onClick={() => {
              if (window.confirm(t.confirmReset)) {
                resetAll();
              }
            }}
            className="w-full py-2.5 rounded-2xl text-brandRed hover:bg-brandRed/10 text-xs font-black flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetData}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
