
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Monitor, Shield, Database, Globe, 
  Palette, UserCog, Save, Search, Moon, Sun, Key, Code, 
  FileText, CheckCircle, AlertTriangle, Download, Upload, Server, TrendingUp,
  Link2, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

// --- SUB-COMPONENTS ---

const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: () => void, label?: string }) => (
  <div className="flex items-center justify-between py-2">
    {label && <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>}
    <button 
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${checked ? 'ltr:left-7 rtl:right-7' : 'ltr:left-1 rtl:right-1'}`}></div>
    </button>
  </div>
);

const SettingCard = ({ title, icon: Icon, children, className = "" }: any) => (
  <div className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm ${className}`}>
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
        <Icon size={20} />
      </div>
      <h3 className="font-bold text-lg text-slate-800 dark:text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// --- SECTIONS ---

const PersonalizationSettings = () => {
  const { theme, setTheme, mode, setMode, availableThemes } = useTheme();
  const { language, setLanguage, availableLanguages, t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Theme Selection */}
      <SettingCard title={t('settings.pers.theme_mode')} icon={Palette}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           <button 
             onClick={() => setMode('light')}
             className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${mode === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-200 dark:border-slate-700'}`}
           >
             <Sun size={24} />
             <span className="text-xs font-bold">{t('settings.pers.light')}</span>
           </button>
           <button 
             onClick={() => setMode('dark')}
             className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${mode === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-200 dark:border-slate-700'}`}
           >
             <Moon size={24} />
             <span className="text-xs font-bold">{t('settings.pers.dark')}</span>
           </button>
        </div>
        
        <div className="pt-4">
          <label className="text-sm font-bold text-slate-500 mb-3 block">{t('settings.pers.accent')}</label>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {availableThemes.map(th => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id)}
                className={`group relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all hover:scale-105 ${theme === th.id ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900' : ''}`}
                style={{ backgroundColor: th.color }}
                title={th.name}
              >
                {theme === th.id && <CheckCircle className="text-white drop-shadow-md" size={20} />}
              </button>
            ))}
          </div>
        </div>
      </SettingCard>

      {/* Language Selection */}
      <SettingCard title={t('settings.pers.lang_region')} icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
           {availableLanguages.map(lang => (
             <button
               key={lang.code}
               onClick={() => setLanguage(lang.code)}
               className={`flex items-center justify-between p-4 rounded-xl border transition-all ${language === lang.code ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
             >
               <div className="flex items-center gap-3">
                 <span className="text-2xl">{lang.flag}</span>
                 <div className="text-start">
                   <p className="font-bold text-sm text-slate-800 dark:text-white">{lang.nativeName}</p>
                   <p className="text-xs text-slate-400">{lang.name}</p>
                 </div>
               </div>
               {language === lang.code && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
             </button>
           ))}
        </div>
      </SettingCard>
    </div>
  );
};

const SystemSettings = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6 animate-fade-in">
      <SettingCard title={t('settings.sys.org_info')} icon={Monitor}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="text-xs font-bold text-slate-500 mb-1 block">{t('settings.sys.org_name')}</label>
               <input type="text" defaultValue="الشركة العامة للموارد البشرية" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none font-bold" />
            </div>
            <div>
               <label className="text-xs font-bold text-slate-500 mb-1 block">{t('settings.sys.license')}</label>
               <input type="text" defaultValue="IRQ-GOV-99201" disabled className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none text-slate-500 font-mono" />
            </div>
         </div>
      </SettingCard>

      <SettingCard title={t('settings.sys.backup')} icon={Database}>
         <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Server size={20} /></div>
               <div>
                  <p className="text-sm font-bold">{t('settings.sys.last_backup')}</p>
                  <p className="text-xs text-slate-500">25 OCT 2024 - 03:00 AM</p>
               </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Success</span>
         </div>
         <div className="flex gap-3 mt-4">
            <button className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2">
               <Upload size={16} /> {t('settings.sys.restore')}
            </button>
            <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
               <Download size={16} /> {t('settings.sys.backup_now')}
            </button>
         </div>
      </SettingCard>
    </div>
  );
};

const SecuritySettings = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
       <SettingCard title={t('settings.sec.auth')} icon={Shield}>
          <Toggle 
            checked={mfaEnabled} 
            onChange={() => setMfaEnabled(!mfaEnabled)} 
            label={t('settings.sec.2fa')} 
          />
          <p className="text-xs text-slate-500 mb-4 px-1">Require SMS or Authenticator App code for new logins.</p>
          
          <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4">
             <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold">Change Password</span>
                <button className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 font-bold">Update</button>
             </div>
          </div>
       </SettingCard>

       <SettingCard title={t('settings.sec.audit')} icon={FileText}>
          <div className="space-y-3">
             {[
               { action: 'UPDATE_PERMISSIONS', user: 'Admin', time: '10 mins ago', ip: '192.168.1.5' },
               { action: 'EXPORT_PAYROLL', user: 'Finance_Mgr', time: '1 hour ago', ip: '192.168.1.8' },
               { action: 'LOGIN_FAILED', user: 'Unknown', time: '2 hours ago', ip: '45.32.11.90', alert: true },
             ].map((log, i) => (
               <div key={i} className={`flex justify-between items-center p-3 rounded-xl border ${log.alert ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-900 dark:border-slate-700'}`}>
                  <div>
                     <p className={`text-xs font-bold ${log.alert ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>{log.action}</p>
                     <p className="text-[10px] text-slate-400 font-mono">{log.user} • {log.ip}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{log.time}</span>
               </div>
             ))}
          </div>
          <button className="w-full mt-4 text-xs text-blue-600 font-bold hover:underline flex items-center justify-center gap-1">
             {t('settings.sec.view_log')}
          </button>
       </SettingCard>
    </div>
  );
};

const HRSettings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       <SettingCard title="صلاحيات الأدوار (Roles & Permissions)" icon={UserCog}>
          <div className="overflow-x-auto">
             <table className="w-full text-xs text-right">
                <thead>
                   <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 font-bold text-slate-500">الدور</th>
                      <th className="pb-2 font-bold text-slate-500 text-center">الرواتب</th>
                      <th className="pb-2 font-bold text-slate-500 text-center">الموظفين</th>
                      <th className="pb-2 font-bold text-slate-500 text-center">الإعدادات</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {['Admin', 'HR Manager', 'Accountant', 'Employee'].map((role, i) => (
                      <tr key={role} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                         <td className="py-3 font-bold">{role}</td>
                         <td className="py-3 text-center"><input type="checkbox" defaultChecked={i < 2} className="accent-blue-600" /></td>
                         <td className="py-3 text-center"><input type="checkbox" defaultChecked={i < 3} className="accent-blue-600" /></td>
                         <td className="py-3 text-center"><input type="checkbox" defaultChecked={i === 0} className="accent-blue-600" /></td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </SettingCard>

       <SettingCard title="السياسات الوظيفية (Policies)" icon={TrendingUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">مدة الترفيع (سنوات)</label>
                <input type="number" defaultValue="4" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm font-bold" />
             </div>
             <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">نسبة العلاوة السنوية</label>
                <input type="text" defaultValue="ثابت حسب القانون" disabled className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-500 font-bold" />
             </div>
          </div>
       </SettingCard>
    </div>
  );
};

const IntegrationSettings = () => {
  const [devMode, setDevMode] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-white/5">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-xl"><Code size={24} /></div>
             <div>
                <h3 className="font-bold text-lg">{t('settings.dev.mode')}</h3>
                <p className="text-xs text-slate-400 font-medium">{t('settings.dev.desc')}</p>
             </div>
          </div>
          <Toggle checked={devMode} onChange={() => setDevMode(!devMode)} />
       </div>

       {devMode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <SettingCard title={t('settings.dev.api_config')} icon={Key}>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Public API Key</label>
                      <div className="flex gap-2">
                         <input type="text" defaultValue="pk_live_51M..." className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs" />
                         <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200">Copy</button>
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Webhook URL</label>
                      <input type="text" placeholder="https://your-domain.com/api/webhook" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs" />
                   </div>
                </div>
             </SettingCard>
          </motion.div>
       )}

       <SettingCard title={t('settings.gov.title')} icon={Link2}>
          <div className="space-y-4">
             {/* Ministry of Finance */}
             <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                         <Server size={20} className="text-slate-600 dark:text-slate-300" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.gov.finance')}</h4>
                      <p className="text-[10px] text-slate-500">{t('settings.gov.finance_desc')}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                      {t('settings.gov.status_connected')}
                   </span>
                </div>
             </div>

             {/* FPSC */}
             <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                         <Database size={20} className="text-slate-600 dark:text-slate-300" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-slate-400 border-2 border-white dark:border-slate-900 rounded-full"></span>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.gov.fpsc')}</h4>
                      <p className="text-[10px] text-slate-500">Sync employee grades</p>
                   </div>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors">
                   {t('settings.gov.config')}
                </button>
             </div>
          </div>
       </SettingCard>
    </div>
  );
};

// --- MAIN PAGE ---

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<'personalization' | 'system' | 'security' | 'hr' | 'integrations'>('personalization');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const TABS = [
    { id: 'personalization', label: t('settings.personalization'), icon: Palette },
    { id: 'system', label: t('settings.system'), icon: Monitor },
    { id: 'hr', label: t('settings.hr'), icon: UserCog },
    { id: 'security', label: t('settings.security'), icon: Shield },
    { id: 'integrations', label: t('settings.integrations'), icon: Database },
  ];

  return (
    <div className="p-4 md:p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 shrink-0 gap-4">
         <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
              <div className="p-3 bg-slate-200 dark:bg-slate-800 rounded-2xl">
                 <SettingsIcon className="text-slate-700 dark:text-slate-300 w-6 h-6 md:w-8 md:h-8" />
              </div>
              {t('settings.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base font-medium max-w-2xl">
               {t('settings.subtitle')}
            </p>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder={t('settings.search_placeholder')} 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm transition-all"
               />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition active:scale-95 whitespace-nowrap">
               <Save size={18} /> {t('settings.save')}
            </button>
         </div>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-8 overflow-hidden">
         {/* Sidebar Navigation */}
         <div className="w-full lg:w-72 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-4 shrink-0 no-scrollbar">
            {TABS.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-start group whitespace-nowrap lg:whitespace-normal min-w-[200px] lg:min-w-0 ${
                    activeTab === tab.id 
                      ? 'bg-white dark:bg-slate-800 shadow-md border border-blue-100 dark:border-slate-700' 
                      : 'hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent'
                 }`}
               >
                  <div className={`p-2.5 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-slate-700'}`}>
                     <tab.icon size={20} />
                  </div>
                  <div className="flex-1">
                     <span className={`block font-bold text-sm ${activeTab === tab.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                        {tab.label}
                     </span>
                  </div>
               </button>
            ))}
         </div>

         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto pb-20 px-1 custom-scrollbar">
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.2 }}
                 className="max-w-4xl"
               >
                  {activeTab === 'personalization' && <PersonalizationSettings />}
                  {activeTab === 'system' && <SystemSettings />}
                  {activeTab === 'security' && <SecuritySettings />}
                  {activeTab === 'hr' && <HRSettings />}
                  {activeTab === 'integrations' && <IntegrationSettings />}
               </motion.div>
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
};
