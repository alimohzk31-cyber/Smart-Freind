
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, ShoppingBag, Calculator, Banknote, 
  BookOpen, FileText, Settings, Briefcase, LayoutGrid, 
  Zap, Sun, Moon, ChevronDown, Check, ShieldCheck
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

// --- الموارد البصرية (نفس مصفوفة الواجهة الترحيبية لتوحيد التجربة) ---
const HERO_SLIDES = [
  { id: 'pos', title: 'POS Systems', color: 'text-emerald-400', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1920' },
  { id: 'finance', title: 'Financial Systems', color: 'text-blue-400', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1920' },
  { id: 'investment', title: 'Enterprise Growth', color: 'text-amber-400', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920' },
  { id: 'digital', title: 'Digital Transformation', color: 'text-cyan-400', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920' },
  { id: 'ai-core', title: 'AI Integration', color: 'text-indigo-400', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1920' },
  { id: 'cyber', title: 'Cyber Security', color: 'text-red-400', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1920' },
  { id: 'data-analytics', title: 'Big Data Analytics', color: 'text-purple-400', image: 'https://images.unsplash.com/photo-1551288049-bbda48658a7d?auto=format&fit=crop&q=80&w=1920' },
  { id: 'global-network', title: 'Global Connectivity', color: 'text-sky-400', image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=1920' },
  { id: 'smart-city', title: 'Smart Infrastructure', color: 'text-violet-400', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1920' },
  { id: 'modern-hr', title: 'Human Capital', color: 'text-rose-400', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920' },
  { id: 'logistics', title: 'Smart Logistics', color: 'text-emerald-300', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1920' },
  { id: 'cloud-tech', title: 'Cloud Solutions', color: 'text-blue-300', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920' }
];

const MAIN_MODULES = [
  { id: 'employees', label: 'إدارة الموظفين', icon: Users, path: '/employees', desc: 'Core HR' },
  { id: 'recruitment', label: 'التعيينات والملاك', icon: UserPlus, path: '/recruitment', desc: 'Recruitment' },
  { id: 'hr', label: 'الموارد البشرية AI', icon: Zap, path: '/hr-ai', desc: 'AI Management' },
  { id: 'accounting', label: 'المالية والمحاسبة', icon: Calculator, path: '/accounting', desc: 'Accounting' },
  { id: 'cashier', label: 'نظام الكاشير', icon: ShoppingBag, path: '/cashier', desc: 'POS System' },
  { id: 'finance', label: 'الرواتب', icon: Banknote, path: '/finance', desc: 'Payroll' },
  { id: 'training', label: 'التدريب', icon: BookOpen, path: '/training', desc: 'LMS' },
  { id: 'documents', label: 'الأرشيف', icon: FileText, path: '/documents', desc: 'Archive' },
  { id: 'settings', label: 'الإعدادات', icon: Settings, path: '/settings', desc: 'System' },
];

const STATS_WIDGETS = [
  { title: 'موظفو الملاك', value: '1,240', trend: '+12%', isUp: true, icon: Users },
  { title: 'طلبات التوظيف', value: '348', trend: 'نشط', isUp: true, icon: Briefcase },
  { title: 'كفاءة النظام', value: '99.9%', trend: 'مستقر', isUp: true, icon: ShieldCheck },
  { title: 'العمليات اليومية', value: '1.2k', trend: '+5%', isUp: true, icon: Zap },
];

const SHOWCASE_SLIDES = [
  { 
    id: 1, 
    title: 'نظام الموارد البشرية الذكي', 
    subtitle: 'SMART HR SYSTEM', 
    desc: 'إدارة متكاملة للموظفين، الرواتب، والهيكل التنظيمي.',
    image: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=1000' 
  },
  { 
    id: 2, 
    title: 'الأنظمة المالية والمحاسبية', 
    subtitle: 'FINANCIAL & ACCOUNTING', 
    desc: 'دليل محاسبي موحد وتقارير مالية دقيقة.',
    image: 'https://images.unsplash.com/photo-1554224155-9ffd486f6975?auto=format&fit=crop&q=80&w=1000' 
  },
  { 
    id: 3, 
    title: 'نقاط البيع والمخازن', 
    subtitle: 'POS & INVENTORY', 
    desc: 'إدارة المبيعات والمخزون والفواتير الفورية.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000' 
  },
  { 
    id: 4, 
    title: 'التحليلات والتقارير', 
    subtitle: 'ANALYTICS & REPORTS', 
    desc: 'لوحات قيادة تفاعلية لدعم اتخاذ القرار.',
    image: 'https://images.unsplash.com/photo-1551288049-bbda48658a7d?auto=format&fit=crop&q=80&w=1000' 
  },
];

const BackgroundSlider = ({ currentIdx }: { currentIdx: number }) => {
  const { mode } = useTheme();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${
            mode === 'dark' 
              ? 'bg-gradient-to-b from-black/80 via-black/40 to-[#05070a]' 
              : 'bg-gradient-to-b from-white/90 via-white/40 to-slate-50'
          }`}></div>
          <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${
            mode === 'dark' 
              ? 'bg-gradient-to-r from-black/80 via-transparent to-black/80' 
              : 'bg-gradient-to-r from-white/60 via-transparent to-white/60'
          }`}></div>
          <img 
            src={HERO_SLIDES[currentIdx].image} 
            alt="Hero" 
            className={`w-full h-full object-cover transition-all duration-1000 ${mode === 'dark' ? 'grayscale-[30%]' : 'grayscale-0 opacity-40'}`}
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      ></div>
    </div>
  );
};

const ShowcaseSlider = () => {
  const [index, setIndex] = useState(0);
  const { mode } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-6xl h-56 md:h-80 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl mx-auto mb-8 group z-30 ring-1 ring-white/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={SHOWCASE_SLIDES[index].image} className="w-full h-full object-cover" alt="" />
          <div className={`absolute inset-0 ${mode === 'dark' ? 'bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent' : 'bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent'}`}></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col items-center text-center">
             <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
             >
               <span className="inline-block px-3 py-1 rounded-full bg-blue-600/90 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-2 shadow-lg backdrop-blur-sm">
                 {SHOWCASE_SLIDES[index].subtitle}
               </span>
               <h2 className="text-xl md:text-4xl font-black text-white mb-2 leading-tight drop-shadow-xl">
                 {SHOWCASE_SLIDES[index].title}
               </h2>
               <p className="text-xs md:text-base text-slate-200 font-medium max-w-xl mx-auto opacity-90 leading-relaxed px-4 line-clamp-2 md:line-clamp-none">
                 {SHOWCASE_SLIDES[index].desc}
               </p>
             </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
        {SHOWCASE_SLIDES.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-1.5 bg-white/40 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { mode, setMode } = useTheme();
  const { language, setLanguage, availableLanguages, direction } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentLangObj = availableLanguages.find(l => l.code === language);

  return (
    <div className={`relative min-h-[calc(100vh-80px)] flex flex-col font-sans overflow-x-hidden transition-colors duration-700 ${mode === 'dark' ? 'bg-[#05070a]' : 'bg-slate-50'}`}>
      
      <BackgroundSlider currentIdx={currentSlide} />

      <div className="relative z-30 flex-1 flex flex-col items-center px-4 md:px-8 pb-20 overflow-y-auto custom-scrollbar">
        
        {/* Top Controls */}
        <div className="w-full flex justify-between items-center py-4 mb-2 max-w-6xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, x: -20 }} 
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-4"
           >
              <div className={`p-1.5 rounded-2xl backdrop-blur-xl border flex items-center gap-2 shadow-2xl transition-colors duration-500 ${
                mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}>
                 <button 
                   onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                   className={`p-1.5 rounded-xl transition-all ${mode === 'dark' ? 'text-yellow-400 hover:bg-white/10' : 'text-indigo-600 hover:bg-black/10'}`}
                 >
                   {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                 </button>
                 
                 <div className={`w-px h-5 ${mode === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}></div>
                 
                 <div className="relative">
                    <button 
                      onClick={() => setIsLangOpen(!isLangOpen)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-xl transition-all ${mode === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-black/10'}`}
                    >
                       <span className="text-base">{currentLangObj?.flag}</span>
                       <span className="text-[10px] font-black uppercase tracking-widest">{currentLangObj?.nativeName}</span>
                       <ChevronDown size={12} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isLangOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className={`absolute top-full mt-2 w-52 rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-2xl z-[60] ${mode === 'dark' ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-black/10'} ${direction === 'rtl' ? 'right-0' : 'left-0'}`}
                        >
                           <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
                              {availableLanguages.map(lang => (
                                <button
                                  key={lang.code}
                                  onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${language === lang.code ? 'bg-blue-600 text-white' : mode === 'dark' ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-black/5'}`}
                                >
                                   <div className="flex items-center gap-3">
                                      <span className="text-base">{lang.flag}</span>
                                      <span className="text-xs font-bold">{lang.nativeName}</span>
                                   </div>
                                   {language === lang.code && <Check size={12} />}
                                </button>
                              ))}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              </div>
           </motion.div>

           <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-xl transition-colors duration-500 opacity-60 hover:opacity-100 ${
             mode === 'dark' ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-black/5 border-black/10 text-blue-600'
           }`}>
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse shadow-[0_0_10px_currentColor]"></div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">Engine v4.0.2</span>
           </div>
        </div>

        {/* --- SHOWCASE SLIDER --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <ShowcaseSlider />
        </motion.div>

        {/* --- MODULES GRID --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 w-full max-w-6xl mb-12">
           {MAIN_MODULES.map((mod, idx) => (
             <motion.div
               key={mod.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
             >
                <Link 
                  to={mod.path} 
                  className={`group relative flex flex-col items-center p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full ${
                    mode === 'dark' 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                      : 'bg-white/70 backdrop-blur-sm border-black/5 hover:bg-white/90 hover:shadow-xl'
                  }`}
                >
                   <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_2s_ease-in-out_infinite]"></div>
                   
                   <div className={`mb-3 md:mb-4 p-3 md:p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-sm ${
                     mode === 'dark' ? 'bg-white/5 text-white group-hover:bg-blue-600' : 'bg-slate-100 text-slate-900 group-hover:bg-blue-600 group-hover:text-white'
                   }`}>
                      <mod.icon size={24} className="md:w-8 md:h-8" strokeWidth={1.5} />
                   </div>
                   
                   <span className="text-xs md:text-sm font-black text-center mb-1 group-hover:text-blue-500 transition-colors line-clamp-1">{mod.label}</span>
                   <span className="text-[8px] md:text-[9px] font-bold opacity-40 uppercase tracking-widest text-center">{mod.desc}</span>
                </Link>
             </motion.div>
           ))}
        </div>

        {/* --- STATS WIDGETS --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl"
        >
           {STATS_WIDGETS.map((stat, i) => (
             <div key={i} className={`p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-500 group ${
               mode === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/80 border-black/5 shadow-lg shadow-black/5'
             }`}>
                <div className="flex justify-between items-start mb-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                   <stat.icon size={18} className="text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex justify-between items-end">
                   <h3 className="text-2xl md:text-3xl font-black tracking-tight">{stat.value}</h3>
                   <span className={`text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm ${
                      stat.isUp 
                        ? (mode === 'dark' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') 
                        : (mode === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-600 text-red-600')
                   }`}>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                      {stat.trend}
                   </span>
                </div>
             </div>
           ))}
        </motion.div>

      </div>

      {/* Side dots indicator for background slider (kept subtle) */}
      <div className={`absolute ${direction === 'rtl' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3`}>
        {HERO_SLIDES.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentSlide(i)}
            className={`w-1 rounded-full transition-all duration-500 ${
              currentSlide === i ? 'bg-blue-500 h-10 shadow-[0_0_15px_#3b82f6]' : (mode === 'dark' ? 'bg-white/10 h-5' : 'bg-black/10 h-5')
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};
