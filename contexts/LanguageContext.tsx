
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 20+ Languages
export type LanguageCode = 
  | 'ar' | 'ckb' | 'ku' // Arabic, Kurdish Sorani, Kurdish Badini
  | 'en' | 'tr' | 'fa' // English, Turkish, Farsi
  | 'fr' | 'de' | 'es' | 'it' | 'nl' | 'sv' | 'no' // European
  | 'zh' | 'ko' | 'ja' | 'ru' // Asian/Cyrillic
  | 'hi' | 'ur' | 'fil' | 'pt' | 'el'; // Others

type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: LanguageCode;
  direction: Direction;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  availableLanguages: { code: LanguageCode; name: string; nativeName: string; dir: Direction; flag?: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languages: { code: LanguageCode; name: string; nativeName: string; dir: Direction; flag?: string }[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇮🇶' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'کوردی (سۆرانی)', dir: 'rtl', flag: '🇹🇯' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
  { code: 'fa', name: 'Farsi', nativeName: 'فارسی', dir: 'rtl', flag: '🇮🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', flag: '🇷🇺' },
];

const translations: Record<string, Record<string, string>> = {
  // --- Navigation ---
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard', ckb: 'داشبۆرد', tr: 'Kontrol Paneli', fa: 'داشبورد' },
  'nav.pos': { ar: 'نظام الكاشير (POS)', en: 'POS System', ckb: 'سیستەمی فرۆشتن', tr: 'POS Sistemi', fa: 'سیستم فروش' },
  'nav.recruitment': { ar: 'التعيينات والملاك', en: 'Recruitment & Staff', ckb: 'دامەزراندن و میلاک', tr: 'İşe Alım', fa: 'استخدام' },
  'nav.accounting': { ar: 'الدليل المحاسبي', en: 'Accounting', ckb: 'ژمێریاری', tr: 'Muhasebe', fa: 'حسابداری' },
  'nav.employees': { ar: 'إدارة الموظفين', en: 'Employee Mgmt', ckb: 'کارمەندان', tr: 'Çalışanlar', fa: 'کارمندان' },
  'nav.finance': { ar: 'الرواتب والمالية', en: 'Payroll & Finance', ckb: 'موچە و دارایی', tr: 'Maaş ve Finans', fa: 'حقوق و مالی' },
  'nav.leaves': { ar: 'الإجازات والزمن', en: 'Leaves & Time', ckb: 'مۆڵەت', tr: 'İzinler', fa: 'مرخصی' },
  'nav.documents': { ar: 'الأرشيف والوثائق', en: 'Documents', ckb: 'ئەرشیف', tr: 'Belgeler', fa: 'اسناد' },
  'nav.training': { ar: 'التدريب', en: 'Training', ckb: 'راهێنان', tr: 'Eğitim', fa: 'آموزش' },
  'nav.settings': { ar: 'الإعدادات', en: 'Settings', ckb: 'ڕێکخستنەکان', tr: 'Ayarlar', fa: 'تنظیمات' },

  // --- Header ---
  'header.platform': { ar: 'المنصة الحكومية', en: 'Government Platform', ckb: 'پلاتفۆرمی حکومی', tr: 'Devlet Platformu', fa: 'پلتفرم دولتی' },
  'header.subtitle': { ar: 'البنية التحتية الرقمية الموحدة', en: 'Unified Digital Infrastructure', ckb: 'ژێرخانی دیجیتاڵی یەکگرتوو', tr: 'Birleşik Dijital Altyapı', fa: 'زیرساخت دیجیتال' },
  'header.country': { ar: 'الجمهورية العراقية', en: 'Republic of Iraq', ckb: 'کۆماری عێراق', tr: 'Irak Cumhuriyeti', fa: 'جمهوری عراق' },
  'header.country_en': { ar: 'Republic of Iraq', en: 'Republic of Iraq', ckb: 'Republic of Iraq', tr: 'Republic of Iraq', fa: 'Republic of Iraq' },

  // --- General Settings ---
  'settings.title': { ar: 'الإعدادات العامة', en: 'General Settings', tr: 'Genel Ayarlar', fa: 'تنظیمات عمومی' },
  'settings.subtitle': { ar: 'إدارة وتخصيص النظام، التحكم بالصلاحيات، وخيارات الربط.', en: 'Manage system customization, roles, and integrations.', tr: 'Sistem özelleştirmesini yönet.', fa: 'مدیریت تنظیمات سیستم' },
  'settings.search_placeholder': { ar: 'بحث داخل الإعدادات...', en: 'Search settings...', tr: 'Ayarlarda ara...', fa: 'جستجو در تنظیمات...' },
  'settings.save': { ar: 'حفظ التعديلات', en: 'Save Changes', tr: 'Değişiklikleri Kaydet', fa: 'ذخیره تغییرات' },

  // --- Settings Tabs ---
  'settings.personalization': { ar: 'التخصيص والواجهة', en: 'Customization & Interface', tr: 'Özelleştirme', fa: 'شخصی‌سازی' },
  'settings.system': { ar: 'إعدادات النظام', en: 'Core Configuration', tr: 'Sistem Yapılandırması', fa: 'پیکربندی سیستم' },
  'settings.hr': { ar: 'إعدادات الموارد البشرية', en: 'HR Configuration', tr: 'İK Yapılandırması', fa: 'تنظیمات منابع انسانی' },
  'settings.security': { ar: 'الأمان والخصوصية', en: 'Security & Privacy', tr: 'Güvenlik ve Gizlilik', fa: 'امنیت و حریم خصوصی' },
  'settings.integrations': { ar: 'الربط والتكامل', en: 'Integrations & API', tr: 'Entegrasyonlar', fa: 'یکپارچه‌سازی' },

  // --- Personalization ---
  'settings.pers.theme_mode': { ar: 'وضع المظهر', en: 'Theme Mode', tr: 'Tema Modu', fa: 'حالت تم' },
  'settings.pers.light': { ar: 'فاتح', en: 'Light', tr: 'Açık', fa: 'روشن' },
  'settings.pers.dark': { ar: 'داكن', en: 'Dark', tr: 'Koyu', fa: 'تاریک' },
  'settings.pers.accent': { ar: 'لون النظام (System Accent)', en: 'System Accent', tr: 'Sistem Rengi', fa: 'رنگ سیستم' },
  'settings.pers.lang_region': { ar: 'اللغة والمنطقة', en: 'Language & Region', tr: 'Dil ve Bölge', fa: 'زبان و منطقه' },

  // --- System Config ---
  'settings.sys.org_info': { ar: 'معلومات المؤسسة', en: 'Organization Info', tr: 'Kurum Bilgisi', fa: 'اطلاعات سازمان' },
  'settings.sys.org_name': { ar: 'اسم المؤسسة', en: 'Organization Name', tr: 'Kurum Adı', fa: 'نام سازمان' },
  'settings.sys.license': { ar: 'رقم الترخيص', en: 'License ID', tr: 'Lisans No', fa: 'شناسه مجوز' },
  'settings.sys.backup': { ar: 'النسخ الاحتياطي', en: 'Backup & Recovery', tr: 'Yedekleme', fa: 'پشتیبان‌گیری' },
  'settings.sys.last_backup': { ar: 'آخر نسخة احتياطية', en: 'Last Backup', tr: 'Son Yedek', fa: 'آخرین پشتیبان' },
  'settings.sys.restore': { ar: 'استعادة نسخة', en: 'Restore', tr: 'Geri Yükle', fa: 'بازیابی' },
  'settings.sys.backup_now': { ar: 'نسخ فوري', en: 'Backup Now', tr: 'Şimdi Yedekle', fa: 'پشتیبان‌گیری اکنون' },

  // --- Security ---
  'settings.sec.auth': { ar: 'سياسات الدخول والتوثيق', en: 'Authentication Policies', tr: 'Kimlik Doğrulama', fa: 'سیاست‌های احراز هویت' },
  'settings.sec.2fa': { ar: 'التحقق الثنائي (2FA)', en: 'Two-Factor Auth (2FA)', tr: 'İki Faktörlü Doğrulama', fa: 'احراز هویت دو مرحله‌ای' },
  'settings.sec.audit': { ar: 'سجل التدقيق (Audit Log)', en: 'Audit Log', tr: 'Denetim Günlüğü', fa: 'گزارش حسابرسی' },
  'settings.sec.view_log': { ar: 'عرض السجل الكامل', en: 'View Full Log', tr: 'Tam Günlüğü Görüntüle', fa: 'مشاهده کامل گزارش' },

  // --- Developer & Integrations ---
  'settings.dev.mode': { ar: 'وضع المطور', en: 'Developer Mode', tr: 'Geliştirici Modu', fa: 'حالت توسعه‌دهنده' },
  'settings.dev.desc': { ar: 'مخصص للمطورين ومسؤولي النظام (API, Webhooks)', en: 'For developers and system admins', tr: 'Geliştiriciler için', fa: 'برای توسعه‌دهندگان' },
  'settings.dev.api_config': { ar: 'إعدادات API', en: 'API Configuration', tr: 'API Yapılandırması', fa: 'پیکربندی API' },
  'settings.gov.title': { ar: 'الربط الحكومي', en: 'Government Integrations', tr: 'Devlet Entegrasyonları', fa: 'یکپارچه‌سازی دولتی' },
  'settings.gov.finance': { ar: 'بوابة وزارة المالية', en: 'Ministry of Finance Gateway', tr: 'Maliye Bakanlığı Ağ Geçidi', fa: 'درگاه وزارت دارایی' },
  'settings.gov.finance_desc': { ar: 'نظام الرواتب المركزي (Payroll)', en: 'Central Payroll System', tr: 'Merkezi Maaş Sistemi', fa: 'سیستم حقوق مرکزی' },
  'settings.gov.fpsc': { ar: 'مجلس الخدمة الاتحادي', en: 'Federal Public Service Council', tr: 'Federal Kamu Hizmeti Konseyi', fa: 'شورای خدمات عمومی فدرال' },
  'settings.gov.status_connected': { ar: 'متصل', en: 'Connected', tr: 'Bağlı', fa: 'متصل' },
  'settings.gov.config': { ar: 'إعداد الربط', en: 'Configure', tr: 'Yapılandır', fa: 'پیکربندی' },

  // --- Common ---
  'app.name': { ar: 'Smart HR', en: 'Smart HR', ckb: 'Smart HR', tr: 'Smart HR', fa: 'Smart HR' },
};

export const LanguageProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('locale') as LanguageCode) || 'ar';
  });

  const currentLangObj = languages.find(l => l.code === language) || languages[0];
  const direction = currentLangObj.dir;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('locale', language);
  }, [language, direction]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t, availableLanguages: languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
