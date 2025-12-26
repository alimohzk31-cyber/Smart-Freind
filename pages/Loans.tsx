import React, { useState, useEffect } from 'react';
import { ContractType } from '../types';
import { Calculator, CheckCircle, AlertOctagon, TrendingUp, ShieldCheck, Users, Briefcase, Coins } from 'lucide-react';

// Exact Lookup Table for Loans (Amount -> Monthly Installment)
const LOAN_TABLE: Record<number, number> = {
  10000000: 150000,
  15000000: 225000,
  20000000: 300000,
  25000000: 375000,
  30000000: 450000,
  35000000: 525000,
  40000000: 600000,
  45000000: 675000,
  50000000: 750000,
  60000000: 900000,
  70000000: 1050000,
  80000000: 1200000,
  90000000: 1350000,
  100000000: 1500000,
};

const CATEGORIES = [
  { id: ContractType.CIVIL, icon: Briefcase, color: 'text-blue-500', label: 'موظف مدني' },
  { id: ContractType.MILITARY, icon: ShieldCheck, color: 'text-green-600', label: 'عسكري / دفاع' },
  { id: ContractType.INTELLIGENCE, icon: AlertOctagon, color: 'text-red-500', label: 'استخبارات' },
  { id: ContractType.SOCIAL_WELFARE, icon: Users, color: 'text-purple-500', label: 'رعاية اجتماعية' },
  { id: ContractType.POOR_FAMILIES, icon: Coins, color: 'text-amber-500', label: 'عوائل متعففة' },
];

export const Loans = () => {
  const [selectedCategory, setSelectedCategory] = useState<ContractType>(ContractType.CIVIL);
  const [amount, setAmount] = useState<number>(10000000);
  const [salary, setSalary] = useState<number>(0);
  
  const [installment, setInstallment] = useState<number>(0);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // 1. Get Installment from Table
    const monthlyPayment = LOAN_TABLE[amount] || 0;
    setInstallment(monthlyPayment);

    // 2. Eligibility Logic
    if (salary > 0) {
      const maxDeduction = salary * 0.50; // 50% max deduction rule from prompt
      
      if (monthlyPayment > maxDeduction) {
        setIsEligible(false);
        setMessage(`القسط (${monthlyPayment.toLocaleString()}) يتجاوز 50% من الراتب.`);
      } else {
        // Category Specific Rules
        if (selectedCategory === ContractType.POOR_FAMILIES && amount > 20000000) {
           setIsEligible(false);
           setMessage("الحد الأقصى للعوائل المتعففة هو 20 مليون دينار.");
        } else if (selectedCategory === ContractType.SOCIAL_WELFARE && amount > 15000000) {
           setIsEligible(false);
           setMessage("الحد الأقصى للرعاية الاجتماعية هو 15 مليون دينار.");
        } else {
           setIsEligible(true);
           setMessage("أنت مؤهل للحصول على هذه السلفة.");
        }
      }
    } else {
      setIsEligible(false);
      setMessage("يرجى إدخال الراتب للتحقق.");
    }
  }, [amount, salary, selectedCategory]);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 p-10 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">المنصة المالية الذكية</h1>
            <p className="text-slate-400 text-lg">نظام السلف والقروض المتقدم وفق المعايير العراقية</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <div className="text-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <p className="text-xs text-slate-400">سقف الإقراض</p>
              <p className="text-2xl font-bold text-emerald-400">100M IQD</p>
            </div>
            <div className="text-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <p className="text-xs text-slate-400">الفائدة السنوية</p>
              <p className="text-2xl font-bold text-blue-400">تناقصية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 ${
              selectedCategory === cat.id
                ? 'bg-white dark:bg-slate-800 border-primary shadow-lg scale-105 z-10'
                : 'bg-slate-50 dark:bg-slate-900 border-transparent opacity-70 hover:opacity-100 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <cat.icon size={32} className={cat.color} />
            <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{cat.label}</span>
            {selectedCategory === cat.id && (
              <div className="absolute inset-0 border-2 border-primary rounded-2xl animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calculator Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
           <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-2">
             <Calculator className="text-primary" />
             حاسبة القروض الدقيقة
           </h3>

           <div className="space-y-8">
             {/* Salary Input */}
             <div>
               <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">الراتب الشهري الكلي (دينار)</label>
               <div className="relative">
                 <input 
                   type="number" 
                   value={salary || ''}
                   onChange={(e) => setSalary(Number(e.target.value))}
                   className="w-full text-2xl font-bold p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-colors"
                   placeholder="0"
                 />
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">IQD</span>
               </div>
             </div>

             {/* Loan Amount Grid Selection */}
             <div>
               <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">قيمة السلفة المطلوبة</label>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                 {Object.keys(LOAN_TABLE).map((key) => {
                   const val = Number(key);
                   return (
                     <button
                       key={val}
                       onClick={() => setAmount(val)}
                       className={`py-3 px-2 rounded-xl text-sm font-bold transition-all ${
                         amount === val 
                           ? 'bg-slate-900 text-white shadow-lg scale-105' 
                           : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                       }`}
                     >
                       {(val / 1000000)} مليون
                     </button>
                   );
                 })}
               </div>
             </div>

           </div>
        </div>

        {/* Results Panel */}
        <div className="relative">
          <div className={`h-full rounded-3xl p-8 text-white flex flex-col justify-between transition-colors duration-500 shadow-2xl ${
             isEligible ? 'bg-gradient-to-b from-emerald-600 to-emerald-800' : 'bg-gradient-to-b from-slate-700 to-slate-900'
          }`}>
             <div>
               <div className="flex justify-between items-start mb-8">
                 <h4 className="text-lg font-bold opacity-80">تفاصيل القسط</h4>
                 {isEligible ? <CheckCircle size={32} className="text-emerald-300" /> : <AlertOctagon size={32} className="text-red-400" />}
               </div>

               <div className="space-y-6">
                 <div>
                   <p className="text-sm opacity-60 mb-1">مبلغ السلفة</p>
                   <p className="text-3xl font-black">{amount.toLocaleString()} <span className="text-base font-normal">د.ع</span></p>
                 </div>
                 
                 <div className="w-full h-px bg-white/20"></div>

                 <div>
                   <p className="text-sm opacity-60 mb-1">القسط الشهري</p>
                   <p className="text-4xl font-black text-yellow-300">{installment.toLocaleString()} <span className="text-base font-normal text-white">د.ع</span></p>
                 </div>

                 <div className={`p-4 rounded-xl backdrop-blur-md border ${isEligible ? 'bg-white/10 border-white/20' : 'bg-red-500/20 border-red-500/30'}`}>
                   <p className="text-sm font-medium leading-relaxed">
                     {message}
                   </p>
                 </div>
               </div>
             </div>

             <button 
               disabled={!isEligible}
               className="w-full mt-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
             >
               {isEligible ? 'تقديم الطلب الآن' : 'غير مؤهل'}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};
