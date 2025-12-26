
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, X, Mic, Paperclip, Sparkles, MessageSquare, 
  Terminal, ShieldCheck, BarChart2, FileText, UserSearch, 
  ChevronLeft, Printer, Download, Save, Activity
} from 'lucide-react';
import { sendMessageToAssistant } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  action?: any; 
  timestamp: Date;
}

// --- Specialized UI Components for AI Actions ---

const AdminOrderCard = ({ data }: { data: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-4 bg-white dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-900/30 rounded-2xl overflow-hidden shadow-xl"
  >
    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/20 flex justify-between items-center">
       <span className="text-xs font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <FileText size={14} /> مسودة أمر إداري
       </span>
       <button className="text-amber-600 hover:text-amber-700"><Printer size={16} /></button>
    </div>
    <div className="p-5">
       <h4 className="font-black text-slate-900 dark:text-white mb-2">{data.title}</h4>
       <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl font-serif text-sm leading-relaxed border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          {data.content}
       </div>
       <div className="mt-4 flex gap-2">
          <button className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-amber-900/20">اعتماد المسودة</button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">تعديل</button>
       </div>
    </div>
  </motion.div>
);

const AnalysisChart = ({ data }: { data: any }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-4 bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl"></div>
    <div className="flex justify-between items-center mb-4">
       <h4 className="text-white font-black text-sm flex items-center gap-2">
          <Activity className="text-emerald-400" size={16} /> تحليل الكوادر
       </h4>
       <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">نظام الملاك 4.0</span>
    </div>
    <div className="space-y-3">
       {data.metrics?.map((m: any, i: number) => (
          <div key={i} className="space-y-1">
             <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{m.label}</span>
                <span className="text-white">{m.value}%</span>
             </div>
             <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${m.value}%` }}></div>
             </div>
          </div>
       ))}
    </div>
  </motion.div>
);

const ActionRenderer = ({ action }: { action: any }) => {
  if (!action) return null;
  switch (action.type) {
    case 'ADMIN_ORDER': return <AdminOrderCard data={action.data} />;
    case 'ANALYSIS_CHART': return <AnalysisChart data={action.data} />;
    case 'EMPLOYEE_CARD': return (
      <div className="mt-4 bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-4">
         <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">{action.data.name?.[0]}</div>
         <div>
            <p className="font-black text-sm text-white">{action.data.name}</p>
            <p className="text-[10px] text-blue-400 font-bold">{action.data.role}</p>
         </div>
      </div>
    );
    default: return null;
  }
};

// --- MAIN WIDGET ---

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<'online' | 'analyzing' | 'offline'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUICK_ACTIONS = [
    { label: "تحليل الملاك", icon: BarChart2, cmd: "حلل وضع الملاك الحالي في الدائرة التقنية" },
    { label: "إنشاء أمر إداري", icon: FileText, cmd: "أنشئ مسودة أمر نقل للموظف أحمد كاظم" },
    { label: "تقرير نقص كوادر", icon: Activity, cmd: "أعطني ملخصاً عن الأقسام التي تعاني من عجز" },
    { label: "بحث ذكي", icon: UserSearch, cmd: "ابحث عن مبرمجين بخبرة تزيد عن 5 سنوات" }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        sender: 'ai',
        text: 'مرحباً بكم في نظام SMART HR AI. أنا مساعدكم الحكومي الرقمي المتخصص في شؤون الملاك والموارد البشرية. كيف يمكنني دعمكم اليوم؟',
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setStatus('analyzing');

    const response = await sendMessageToAssistant(text);
    
    const aiMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      sender: 'ai', 
      text: response.text, 
      action: response.action, 
      timestamp: new Date() 
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
    setStatus('online');
  };

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-6 rtl:left-6 ltr:right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-6 w-[380px] md:w-[450px] h-[750px] bg-slate-900/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col overflow-hidden ring-1 ring-white/5"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-3xl flex items-center justify-center border border-white/20 shadow-lg">
                       <Bot size={32} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-slate-900 rounded-full ${
                      status === 'online' ? 'bg-emerald-400' : status === 'analyzing' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'
                    }`}></span>
                  </div>
                  <div>
                     <h3 className="font-black text-lg text-white leading-none mb-1">SMART HR AI</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        {status === 'online' ? '🟢 متصل' : '🟡 تحليل البيانات...'}
                     </p>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white transition"><X size={24} /></button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/30">
               {messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                     <div className={`max-w-[90%] p-4 rounded-[1.75rem] shadow-xl backdrop-blur-md ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none rtl:rounded-tr-[1.75rem] rtl:rounded-tl-none border border-white/10' 
                          : 'bg-white/5 text-slate-100 border border-white/5 rounded-tl-none rtl:rounded-tl-[1.75rem] rtl:rounded-tr-none'
                     }`}>
                        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        {msg.action && <ActionRenderer action={msg.action} />}
                     </div>
                     <span className="text-[9px] font-black text-slate-500 mt-2 px-1 uppercase tracking-widest opacity-60">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {msg.sender === 'ai' ? 'SYSTEM AI' : 'USER'}
                     </span>
                  </div>
               ))}
               {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 border border-white/5">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                     </div>
                  </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions Scroll */}
            <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar mask-gradient-sides bg-black/10 shrink-0">
               {QUICK_ACTIONS.map((qa, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(qa.cmd)}
                    className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-2xl bg-slate-800/60 border border-white/5 hover:bg-blue-600/20 hover:border-blue-500/40 text-[11px] font-black uppercase tracking-wider text-slate-300 transition-all active:scale-95"
                  >
                     <qa.icon size={14} className="text-blue-400" />
                     {qa.label}
                  </button>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-900/90 border-t border-white/5 shrink-0">
               <div className="flex items-center gap-3">
                  <button className="p-4 bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-700 transition border border-white/5 shadow-inner">
                     <Paperclip size={22} />
                  </button>
                  <div className="flex-1 relative group">
                     <input 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        type="text" 
                        placeholder="أدخل استفسارك الإداري أو القانوني..."
                        className="w-full pl-4 pr-12 py-5 bg-slate-800/60 rounded-[1.5rem] border border-white/5 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 text-white text-sm outline-none transition-all font-medium"
                     />
                     <button className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white transition">
                        <Mic size={20} />
                     </button>
                  </div>
                  <button 
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim()}
                    className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[1.5rem] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all disabled:opacity-40 disabled:grayscale active:scale-95"
                  >
                     <Send size={22} className="rtl:rotate-180" />
                  </button>
               </div>
               <div className="mt-4 text-center">
                  <p className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1.5 opacity-60">
                     <ShieldCheck size={10} /> هذا المساعد للاستشارة الرقمية فقط - القرارات النهائية بيد المسؤول المخول
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Entry Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 group ${
          isOpen ? 'bg-slate-800 text-slate-400 rotate-90 border border-white/10' : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 text-white border border-white/20'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <X size={40} />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
               <Bot size={48} className="drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
               <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full border-4 border-slate-950 flex items-center justify-center text-[10px] font-black shadow-lg">AI</div>
               <Sparkles size={18} className="absolute -bottom-1 -left-3 text-emerald-400 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glow effect on hover */}
        {!isOpen && <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>}
      </motion.button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .mask-gradient-sides { 
           mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); 
           -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); 
        }
      `}</style>
    </div>
  );
};
