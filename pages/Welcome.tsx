
import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Lock, 
  ChevronDown, Globe, Moon, Sun, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// --- صور السلايدر المتطورة (عناوين ونصوص احترافية مؤسساتية) ---
const SLIDES = [
  {
    id: 'pos',
    title: 'Financial Ecosystem',
    subtitle: { ar: 'الحوكمة المالية المتكاملة وأنظمة الجباية الرقمية', en: 'Integrated Fiscal Governance & Digital Revenue Systems' },
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1920',
    color: 'text-emerald-400'
  },
  {
    id: 'finance',
    title: 'Strategic Planning',
    subtitle: { ar: 'هندسة الموارد المالية ودعم اتخاذ القرار السيادي', en: 'Fiscal Engineering & Sovereign Decision Support' },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1920',
    color: 'text-blue-400'
  },
  {
    id: 'investment',
    title: 'Institutional Capital',
    subtitle: { ar: 'تعظيم الأصول المؤسساتية وإدارة محافظ الاستثمار', en: 'Maximizing Institutional Assets & Investment Portfolios' },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920',
    color: 'text-amber-400'
  },
  {
    id: 'digital',
    title: 'Digital Sovereignty',
    subtitle: { ar: 'بوابة التحول الرقمي الشامل لسيادة الدولة الرقمية', en: 'Comprehensive Gateway for National Digital Sovereignty' },
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920',
    color: 'text-cyan-400'
  },
  {
    id: 'ai-core',
    title: 'AI Intelligence Core',
    subtitle: { ar: 'الذكاء الاصطناعي التوليدي في خدمة الإدارة العامة', en: 'Generative AI Empowering Public Administration' },
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1920',
    color: 'text-indigo-400'
  },
  {
    id: 'cyber',
    title: 'Security Infrastructure',
    subtitle: { ar: 'أمن المعلومات القومي وحماية البيانات السيادية', en: 'National Information Security & Sovereign Data Protection' },
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1920',
    color: 'text-red-400'
  },
  {
    id: 'data-analytics',
    title: 'Advanced Analytics',
    subtitle: { ar: 'تحليلات البيانات الضخمة لرسم السياسات المستقبلية', en: 'Big Data Analytics for Future Policy Shaping' },
    image: 'https://images.unsplash.com/photo-1551288049-bbda48658a7d?auto=format&fit=crop&q=80&w=1920',
    color: 'text-purple-400'
  }
];

const WelcomeCardSlider = ({ currentSlide, onChange, language, mode, direction }: any) => {
  return (
    <div className="relative w-full max-w-6xl h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl mx-auto group z-30 ring-1 ring-white/10 bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={SLIDES[currentSlide].image} className="w-full h-full object-cover" alt="" />
          <div className={`absolute inset-0 ${mode === 'dark' ? 'bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent' : 'bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent'}`}></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-20 flex flex-col items-center text-center">
             <motion.div
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
             >
               <span className={`inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs md:text-sm font-black uppercase tracking-widest mb-4 shadow-lg`}>
                 {SLIDES[currentSlide].title}
               </span>
               <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none drop-shadow-2xl tracking-tight">
                 SMART <span className={`text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400`}>GLOBAL</span>
               </h1>
               <p className={`text-lg md:text-2xl font-bold text-slate-200 max-w-4xl mx-auto leading-relaxed ${SLIDES[currentSlide].color}`}>
                 {language === 'ar' ? SLIDES[currentSlide].subtitle.ar : SLIDES[currentSlide].subtitle.en}
               </p>
             </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-40 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
        {SLIDES.map((_, i) => (
          <button 
            key={i} 
            onClick={() => onChange(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-2 bg-white/40 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
};

export const Welcome = ({ onStart }: { onStart: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language, setLanguage, availableLanguages, direction } = useLanguage();
  const { mode, setMode } = useTheme();
  const [exitAnim, setExitAnim] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setExitAnim(true);
    setTimeout(() => onStart(), 800);
  };

  const currentLangObj = availableLanguages.find(l => l.code === language);

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans transition-colors duration-700 ${mode === 'dark' ? 'bg-[#05070a]' : 'bg-slate-50'}`}>
      
      {/* 1. Background (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-30 blur-sm scale-110">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src={SLIDES[currentSlide].image} 
              alt="Background" 
              className="w-full h-full object-cover grayscale"
            />
            <div className={`absolute inset-0 ${mode === 'dark' ? 'bg-black/80' : 'bg-white/80'}`}></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Top Bar */}
      <nav className="absolute top-0 inset-x-0 z-50 p-4 md:p-6 flex justify-between items-center">
         <motion.div 
           initial={{ opacity: 0, y: -20 }} 
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center gap-4"
         >
            <div className={`p-1.5 rounded-2xl backdrop-blur-xl border flex items-center gap-2 shadow-xl ${mode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/50 border-black/5'}`}>
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
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${language === lang.code ? 'bg-blue-600 text-white' : mode === 'dark' ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-black/5'}`}
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
      </nav>

      {/* 3. Main Slider Centerpiece */}
      <motion.div 
        className="relative z-20 w-full h-full flex flex-col items-center justify-center p-6"
        animate={exitAnim ? { scale: 1.1, opacity: 0, filter: 'blur(20px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8 }}
      >
        <WelcomeCardSlider 
          currentSlide={currentSlide} 
          onChange={setCurrentSlide}
          language={language}
          mode={mode}
          direction={direction}
        />

        {/* Start Button */}
        <motion.button 
          onClick={handleEnter}
          initial={{ opacity: 0, y: 20 }}
          animate={exitAnim ? { scale: 0.8, opacity: 0 } : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-16 py-5 mt-10 overflow-hidden transition-all shadow-2xl rounded-[2rem]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90 group-hover:opacity-100 transition-all"></div>
          
          <div className="relative z-10 flex items-center gap-4 text-white font-black text-xl tracking-tight">
            <Lock size={22} className="group-hover:rotate-12 transition-transform" />
            <span>{language === 'ar' ? 'ابدأ الآن' : 'Get Started'}</span>
            {direction === 'rtl' ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
          </div>

          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
        </motion.button>
      </motion.div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.5); border-radius: 10px; }
      `}</style>
    </div>
  );
};
