
import React, { useState } from 'react';
import { 
  Calculator, PieChart as PieChartIcon, TrendingUp, TrendingDown, BookOpen, 
  FileText, Plus, Filter, Search, Calendar, Save, Trash2, Printer, 
  CheckCircle, AlertCircle, DollarSign, LayoutGrid, Briefcase, Archive,
  CreditCard, RefreshCw, ShoppingCart, Users, ChevronRight, ChevronDown,
  ArrowUpRight, ArrowDownRight, FileCheck, Layers, Landmark, BarChart3,
  Building, Truck, Receipt, Repeat, Edit3, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  Account, AccountType, JournalEntry, JournalStatus, FixedAsset, 
  Invoice, InvoiceStatus, BankTransaction 
} from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', code: '1', name: 'الأصول', type: AccountType.ASSET, level: 1, balance: 450000000, currency: 'IQD', isDebit: true, isActive: true },
  { id: '11', code: '11', name: 'النقد وما في حكمه', type: AccountType.ASSET, level: 2, parentId: '1', balance: 120000000, currency: 'IQD', isDebit: true, isActive: true },
  { id: '111', code: '111', name: 'الصندوق الرئيسي', type: AccountType.ASSET, level: 3, parentId: '11', balance: 45000000, currency: 'IQD', isDebit: true, isActive: true },
  { id: '112', code: '112', name: 'مصرف الرافدين', type: AccountType.ASSET, level: 3, parentId: '11', balance: 75000000, currency: 'IQD', isDebit: true, isActive: true },
  { id: '12', code: '12', name: 'الأصول الثابتة', type: AccountType.ASSET, level: 2, parentId: '1', balance: 330000000, currency: 'IQD', isDebit: true, isActive: true },
  
  { id: '2', code: '2', name: 'الخصوم', type: AccountType.LIABILITY, level: 1, balance: 95000000, currency: 'IQD', isDebit: false, isActive: true },
  { id: '21', code: '21', name: 'الموردون (AP)', type: AccountType.LIABILITY, level: 2, parentId: '2', balance: 45000000, currency: 'IQD', isDebit: false, isActive: true },
  
  { id: '4', code: '4', name: 'الإيرادات', type: AccountType.REVENUE, level: 1, balance: 280000000, currency: 'IQD', isDebit: false, isActive: true },
  { id: '5', code: '5', name: 'المصروفات', type: AccountType.EXPENSE, level: 1, balance: 110000000, currency: 'IQD', isDebit: true, isActive: true },
];

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: 'JE-2024-100', serialNumber: 'JE-100', date: '2024-10-25', description: 'إثبات رواتب شهر تشرين الأول',
    status: JournalStatus.POSTED, totalAmount: 45000000, createdBy: 'Ahmed Ali',
    lines: [
      { id: 'l1', accountId: '51', accountCode: '51', accountName: 'الرواتب والأجور', debit: 45000000, credit: 0, costCenter: 'HR' },
      { id: 'l2', accountId: '112', accountCode: '112', accountName: 'مصرف الرافدين', debit: 0, credit: 45000000, costCenter: 'HR' }
    ]
  },
  {
    id: 'JE-2024-101', serialNumber: 'JE-101', date: '2024-10-26', description: 'شراء أثاث مكتبي',
    status: JournalStatus.DRAFT, totalAmount: 5000000, createdBy: 'Sara Hassan',
    lines: [
      { id: 'l3', accountId: '12', accountCode: '12', accountName: 'الأصول الثابتة', debit: 5000000, credit: 0, costCenter: 'Admin' },
      { id: 'l4', accountId: '21', accountCode: '21', accountName: 'الموردون', debit: 0, credit: 5000000, costCenter: 'Admin' }
    ]
  }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// --- SUB-COMPONENTS ---

const AccountFormModal = ({ isOpen, onClose, initialData, onSave }: any) => {
  const [formData, setFormData] = useState(initialData || { code: '', name: '', type: 'ASSET', level: 1, parentId: '', balance: 0 });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{initialData ? 'تعديل الحساب' : 'إضافة حساب جديد'}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition"><X size={28} /></button>
        </div>
        <div className="p-8 space-y-5">
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase">رمز الحساب</label>
              <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none" placeholder="مثال: 112" />
           </div>
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase">اسم الحساب</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none" />
           </div>
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase">نوع الحساب</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none">
                 {Object.values(AccountType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
           </div>
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase">الرصيد الافتتاحي</label>
              <input type="number" value={formData.balance} onChange={e => setFormData({...formData, balance: Number(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none" />
           </div>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-950 flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold">إلغاء</button>
           <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl">حفظ</button>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendValue, icon: Icon, colorClass }: any) => (
  <div className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
    <div className={`absolute -right-6 -top-6 w-20 h-20 md:w-24 md:h-24 rounded-full opacity-5 group-hover:scale-110 transition-transform ${colorClass}`}></div>
    <div className="flex justify-between items-start mb-3 md:mb-4">
       <div>
         <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
         <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{value}</h3>
       </div>
       <div className={`p-2.5 md:p-3 rounded-xl ${colorClass.replace('bg-', 'text-').replace('500', '600')} bg-opacity-10`}>
         <Icon size={20} md:size={24} />
       </div>
    </div>
    {trend && (
      <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold">
        <span className={`${trend === 'up' ? 'text-emerald-500' : 'text-red-500'} flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 md:py-1 rounded-lg`}>
          {trend === 'up' ? <ArrowUpRight size={12} md:size={14} /> : <ArrowDownRight size={12} md:size={14} />} {trendValue}
        </span>
        <span className="text-slate-400">مقارنة بالسابق</span>
      </div>
    )}
  </div>
);

const AccountTreeItem = ({ account, level, expanded, toggle, onEdit, onDelete, accounts }: any) => {
  const isParent = accounts.some((a: Account) => a.parentId === account.id);
  const isOpen = expanded[account.id];

  return (
    <div className="animate-fade-in">
      <div 
        className={`flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer group ${level === 1 ? 'bg-slate-50/50 dark:bg-slate-900/30' : ''}`}
        style={{ paddingRight: window.innerWidth > 768 ? `${level * 24}px` : '12px' }}
        onClick={() => isParent && toggle(account.id)}
      >
        <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
          {isParent ? (
            <ChevronDown size={14} className={`text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-0' : 'rotate-90'}`} />
          ) : <div className="w-3 md:w-4 shrink-0" />}
          
          <div className="flex items-center gap-1 md:gap-2 overflow-hidden">
            <span className="font-mono text-[9px] md:text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">{account.code}</span>
            <span className={`text-slate-800 dark:text-slate-200 truncate ${level === 1 ? 'font-bold' : 'font-medium text-xs md:text-sm'}`}>
              {account.name}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 pl-1 shrink-0">
           <span className={`font-mono text-xs md:text-sm font-bold tracking-tight ${account.isDebit ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}`}>
             {account.balance.toLocaleString()} <span className="text-[9px] text-slate-400">د.ع</span>
           </span>
           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); onEdit(account); }} className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-100 dark:bg-slate-800 rounded"><Edit3 size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(account.id); }} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded"><Trash2 size={14} /></button>
           </div>
        </div>
      </div>
      {isOpen && accounts.filter((a: Account) => a.parentId === account.id).map((child: Account) => (
        <AccountTreeItem key={child.id} account={child} level={level + 1} expanded={expanded} toggle={toggle} onEdit={onEdit} onDelete={onDelete} accounts={accounts} />
      ))}
    </div>
  );
};

const JournalEntryForm = ({ onClose, accounts }: { onClose: () => void, accounts: Account[] }) => {
  const [lines, setLines] = useState([{ id: 1, account: '', debit: 0, credit: 0, note: '' }, { id: 2, account: '', debit: 0, credit: 0, note: '' }]);
  
  const totalDebit = lines.reduce((acc, l) => acc + (l.debit || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (l.credit || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-slate-950/80 backdrop-blur-sm">
       <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[95vh]">
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
             <div>
               <h3 className="font-bold text-sm md:text-lg text-slate-800 dark:text-white">قيد يومية جديد</h3>
               <p className="text-[10px] md:text-xs text-slate-500 font-mono">JE-2024-DRAFT</p>
             </div>
             <div className="flex gap-2">
                <input type="date" className="hidden sm:block bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none" />
                <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition"><Trash2 size={18} /></button>
             </div>
          </div>

          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
             <div className="space-y-4 md:space-y-2 min-w-[600px] md:min-w-0">
                <div className="hidden md:flex gap-4 text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wider">
                   <span className="flex-[3]">اسم الحساب</span>
                   <span className="flex-[1.5]">مدين</span>
                   <span className="flex-[1.5]">دائن</span>
                   <span className="flex-[2]">البيان</span>
                   <span className="w-8"></span>
                </div>
                {lines.map((line, idx) => (
                   <div key={line.id} className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center bg-slate-50 dark:bg-slate-800/50 p-3 md:p-0 md:bg-transparent rounded-xl">
                      <div className="flex-[3]">
                         <select className="w-full p-2.5 md:p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm outline-none">
                            <option>اختر الحساب...</option>
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}
                         </select>
                      </div>
                      <div className="flex gap-2 flex-[3]">
                        <div className="flex-1">
                           <input type="number" placeholder="مدين" 
                             onChange={(e) => { const n = [...lines]; n[idx].debit = Number(e.target.value); n[idx].credit = 0; setLines(n); }}
                             value={line.debit || ''}
                             className="w-full p-2.5 md:p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm font-mono outline-none" 
                           />
                        </div>
                        <div className="flex-1">
                           <input type="number" placeholder="دائن" 
                             onChange={(e) => { const n = [...lines]; n[idx].credit = Number(e.target.value); n[idx].debit = 0; setLines(n); }}
                             value={line.credit || ''}
                             className="w-full p-2.5 md:p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm font-mono outline-none" 
                           />
                        </div>
                      </div>
                      <div className="flex-[2]">
                         <input type="text" className="w-full p-2.5 md:p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm outline-none" placeholder="شرح القيد..." />
                      </div>
                      <button onClick={() => setLines(lines.filter(l => l.id !== line.id))} className="self-end md:self-auto w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                   </div>
                ))}
             </div>
             <button onClick={() => setLines([...lines, { id: Date.now(), account: '', debit: 0, credit: 0, note: '' }])} className="mt-4 flex items-center gap-2 text-blue-600 text-xs md:text-sm font-bold hover:bg-blue-50 px-3 py-2 rounded-lg transition">
               <Plus size={16} /> إضافة طرف جديد
             </button>
          </div>

          <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
             <div className="flex gap-4 md:gap-8 items-center w-full md:w-auto justify-between md:justify-start">
                <div className="text-center">
                   <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase">إجمالي المدين</p>
                   <p className="text-sm md:text-lg font-mono font-bold">{totalDebit.toLocaleString()}</p>
                </div>
                <div className="text-center">
                   <p className="text-[9px] md:text-xs text-slate-500 font-bold uppercase">إجمالي الدائن</p>
                   <p className="text-sm md:text-lg font-mono font-bold">{totalCredit.toLocaleString()}</p>
                </div>
                <div className={`text-center px-3 py-1.5 md:px-4 md:py-2 rounded-xl ${isBalanced ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                   <p className="text-[9px] md:text-xs font-bold">الفرق</p>
                   <p className="text-sm md:text-lg font-mono font-black">{(totalDebit - totalCredit).toLocaleString()}</p>
                </div>
             </div>
             <div className="flex gap-3 w-full md:w-auto">
                <button onClick={onClose} className="flex-1 md:px-6 py-2.5 md:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 text-xs md:text-sm">إلغاء</button>
                <button disabled={!isBalanced} className="flex-[2] md:px-8 py-2.5 md:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 text-xs md:text-sm shadow-lg">ترحيل القيد</button>
             </div>
          </div>
       </div>
    </div>
  );
};

export const Accounting = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coa' | 'journal' | 'ar' | 'ap' | 'assets' | 'banking' | 'reports'>('dashboard');
  const [expandedAccounts, setExpandedAccounts] = useState<Record<string, boolean>>({'1': true, '11': true, '2': true, '4': true, '5': true});
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [accountModal, setAccountModal] = useState({ isOpen: false, data: null as any });

  const TABS = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutGrid },
    { id: 'coa', label: 'الدليل', icon: Layers },
    { id: 'journal', label: 'القيود', icon: BookOpen },
    { id: 'ar', label: 'المبيعات', icon: TrendingUp },
    { id: 'ap', label: 'المشتريات', icon: ShoppingCart },
    { id: 'assets', label: 'الأصول', icon: Building },
    { id: 'banking', label: 'البنك', icon: Landmark },
    { id: 'reports', label: 'التقارير', icon: FileCheck },
  ];

  const handleSaveAccount = (data: any) => {
    if (accountModal.data) {
      setAccounts(prev => prev.map(a => a.id === accountModal.data.id ? { ...a, ...data } : a));
    } else {
      setAccounts(prev => [...prev, { ...data, id: Date.now().toString(), level: 2 }]); // Simplified creation
    }
  };

  const handleDeleteAccount = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-6 max-w-[1920px] mx-auto font-sans h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col gap-4 shrink-0">
         <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="text-blue-600 w-6 h-6 md:w-8 md:h-8" />
              النظام المالي
            </h1>
         </div>

         <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar mask-gradient-sides">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 rounded-lg text-[10px] md:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon size={14} md:size={18} />
                {tab.label}
              </button>
            ))}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
        
        {/* --- DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in pb-10">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard title="إجمالي الأصول" value="450M" trend="up" trendValue="12%" icon={DollarSign} colorClass="bg-blue-500" />
                <StatCard title="صافي الربح" value="85M" trend="up" trendValue="8%" icon={TrendingUp} colorClass="bg-emerald-500" />
                <StatCard title="المصروفات" value="32M" trend="down" trendValue="2%" icon={TrendingDown} colorClass="bg-red-500" />
                <StatCard title="النقد" value="120M" trend="up" trendValue="5%" icon={Landmark} colorClass="bg-purple-500" />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                   <h3 className="font-bold text-sm md:text-lg mb-4 md:mb-6">التدفقات النقدية (Cash Flow)</h3>
                   <div className="h-60 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={[
                           { name: 'Jan', in: 400, out: 240 }, { name: 'Feb', in: 300, out: 139 },
                           { name: 'Mar', in: 200, out: 980 }, { name: 'Apr', in: 278, out: 390 },
                           { name: 'May', in: 189, out: 480 }, { name: 'Jun', in: 239, out: 380 },
                         ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                            <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: 12}} />
                            <Area type="monotone" dataKey="in" stroke="#10b981" fillOpacity={0.2} fill="#10b981" name="وارد" />
                            <Area type="monotone" dataKey="out" stroke="#ef4444" fillOpacity={0.2} fill="#ef4444" name="صادر" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-4 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                   <h3 className="font-bold text-sm md:text-lg mb-4 self-start">توزيع المصروفات</h3>
                   <div className="h-48 md:h-64 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={[{name: 'رواتب', value: 45}, {name: 'تشغيل', value: 30}, {name: 'تسويق', value: 25}]} innerRadius={window.innerWidth > 768 ? 60 : 45} outerRadius={window.innerWidth > 768 ? 80 : 60} paddingAngle={5} dataKey="value">
                               {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-xl md:text-3xl font-black">110M</span>
                         <span className="text-[10px] text-slate-400">الإجمالي</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- CHART OF ACCOUNTS --- */}
        {activeTab === 'coa' && (
          <div className="animate-fade-in space-y-4">
             <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 gap-4">
                <div className="relative w-full md:w-80">
                   <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input type="text" placeholder="بحث في الدليل..." className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl pr-10 pl-4 py-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <button onClick={() => setAccountModal({ isOpen: true, data: null })} className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition">
                   <Plus size={16} /> حساب جديد
                </button>
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                   <span className="flex-1">اسم الحساب / الكود</span>
                   <span className="w-24 md:w-40 text-left">الرصيد</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-hidden">
                   {accounts.filter(a => a.level === 1).map(rootAcc => (
                      <AccountTreeItem 
                        key={rootAcc.id} 
                        account={rootAcc} 
                        level={1} 
                        expanded={expandedAccounts} 
                        toggle={(id: string) => setExpandedAccounts(prev => ({...prev, [id]: !prev[id]}))}
                        onEdit={(acc: any) => setAccountModal({ isOpen: true, data: acc })}
                        onDelete={handleDeleteAccount}
                        accounts={accounts}
                      />
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- JOURNAL ENTRIES --- */}
        {activeTab === 'journal' && (
          <div className="animate-fade-in space-y-4">
             <div className="flex justify-between items-center px-1">
                <h2 className="text-sm md:text-xl font-bold">سجل القيود اليومية</h2>
                <button 
                  onClick={() => setShowJournalModal(true)}
                  className="flex items-center gap-1.5 md:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-sm shadow-lg transition"
                >
                   <Plus size={16} /> قيد جديد
                </button>
             </div>

             <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-[10px] md:text-sm min-w-[600px]">
                     <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                        <tr>
                           <th className="p-3 md:p-5">رقم القيد</th>
                           <th className="p-3 md:p-5">التاريخ</th>
                           <th className="p-3 md:p-5">البيان</th>
                           <th className="p-3 md:p-5">المبلغ</th>
                           <th className="p-3 md:p-5">الحالة</th>
                           <th className="p-3 md:p-5"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {MOCK_ENTRIES.map(entry => (
                           <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                              <td className="p-3 md:p-5 font-mono font-bold text-blue-600">{entry.serialNumber}</td>
                              <td className="p-3 md:p-5 text-slate-500">{entry.date}</td>
                              <td className="p-3 md:p-5 font-medium truncate max-w-[150px] md:max-w-none">{entry.description}</td>
                              <td className="p-3 md:p-5 font-mono font-bold">{entry.totalAmount.toLocaleString()}</td>
                              <td className="p-3 md:p-5">
                                 <span className={`px-2 py-0.5 rounded-lg font-bold text-[9px] md:text-xs ${
                                   entry.status === JournalStatus.POSTED ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                                 }`}>
                                   {entry.status}
                                 </span>
                              </td>
                              <td className="p-3 md:p-5">
                                 <button className="text-slate-400 hover:text-blue-600 transition"><Printer size={16} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}

        {/* Fallback views for other tabs (REPORTS, BANKING, etc.) follow similar responsive patterns */}
        {(activeTab === 'reports' || activeTab === 'banking' || activeTab === 'assets') && (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in pb-10">
              {['الميزانية', 'الأرباح', 'التدفقات', 'أعمار الديون', 'سجل الأصول', 'التسوية البنكية'].map((item, i) => (
                 <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition group cursor-pointer flex flex-col items-center text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                       <FileCheck size={24} md:size={32} />
                    </div>
                    <h3 className="font-bold text-sm md:text-lg text-slate-800 dark:text-white mb-2">{item}</h3>
                    <p className="text-[10px] md:text-sm text-slate-500 mb-6">عرض وتصدير تقرير مفصل بصيغة PDF أو Excel.</p>
                    <div className="flex gap-2 w-full">
                       <button className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] md:text-xs font-bold">Excel</button>
                       <button className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-[10px] md:text-xs font-bold shadow-lg">PDF</button>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
         {showJournalModal && <JournalEntryForm onClose={() => setShowJournalModal(false)} accounts={accounts} />}
         {accountModal.isOpen && (
            <AccountFormModal 
               isOpen={accountModal.isOpen} 
               onClose={() => setAccountModal({ isOpen: false, data: null })} 
               initialData={accountModal.data}
               onSave={handleSaveAccount}
            />
         )}
      </AnimatePresence>

    </div>
  );
};
