
import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Filter, Printer, Download, 
  Edit3, UserPlus, X, Save, Trash2, Briefcase, 
  ChevronRight, MoreHorizontal, BadgeCheck,
  CheckCircle2, AlertCircle, Stamp, Award, GraduationCap,
  MapPin, Phone, Mail, Calendar, CreditCard, FileText, ExternalLink,
  RefreshCw, ChevronDown
} from 'lucide-react';
import { Employee, EmployeeStatus, ContractType, JobGrade } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// --- بيانات افتراضية أولية ---
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '10203', financialNumber: '882910', name: 'أحمد كاظم حسن', 
    role: 'رئيس مبرمجين أقدم', department: 'تكنولوجيا المعلومات', grade: 3 as JobGrade, step: 2,
    joinDate: '2010-05-15', status: EmployeeStatus.ACTIVE, contractType: ContractType.PERMANENT,
    nominalSalary: 680000, avatar: 'https://i.pravatar.cc/150?u=10203',
    nationalId: '198800223344', dob: '1988-03-22',
    allowances: { certificate: 100000, risk: 200000, position: 150000, family: 50000, costOfLiving: 0 },
    leaveBalance: { regular: 21, sick: 30, timeOff: 5 }
  },
  {
    id: '10204', financialNumber: '882911', name: 'زينب محمد كريم', 
    role: 'معاون محاسب رئيسي', department: 'الدائرة المالية', grade: 7 as JobGrade, step: 1,
    joinDate: '2022-01-10', status: EmployeeStatus.ACTIVE, contractType: ContractType.PERMANENT,
    nominalSalary: 296000, avatar: 'https://i.pravatar.cc/150?u=10204',
    nationalId: '199511223344', dob: '1995-11-12',
    allowances: { certificate: 45000, risk: 0, position: 0, family: 0, costOfLiving: 0 },
    leaveBalance: { regular: 15, sick: 10, timeOff: 2 }
  },
  {
    id: '10205', financialNumber: '990123', name: 'حسين علي رضا', 
    role: 'حرفي ماهر', department: 'الخدمات الإدارية', grade: 9 as JobGrade, step: 4,
    joinDate: '2019-11-01', status: EmployeeStatus.ACTIVE, contractType: ContractType.CONTRACT_315,
    nominalSalary: 210000, avatar: 'https://i.pravatar.cc/150?u=10205',
    nationalId: '199244556677', dob: '1992-05-05',
    allowances: { certificate: 0, risk: 50000, position: 0, family: 50000, costOfLiving: 0 },
    leaveBalance: { regular: 10, sick: 5, timeOff: 0 }
  }
];

const CONTRACT_BADGES: Record<string, string> = {
  [ContractType.PERMANENT]: 'bg-emerald-500 text-white shadow-emerald-500/20',
  [ContractType.CONTRACT_315]: 'bg-orange-500 text-white shadow-orange-500/20',
  [ContractType.DAILY_WAGE]: 'bg-blue-500 text-white shadow-blue-500/20',
};

const STATUS_COLORS: Record<string, string> = {
  [EmployeeStatus.ACTIVE]: 'bg-green-100 text-green-700',
  [EmployeeStatus.ON_LEAVE]: 'bg-blue-100 text-blue-700',
  [EmployeeStatus.TERMINATED]: 'bg-red-100 text-red-700',
  [EmployeeStatus.RETIRED]: 'bg-slate-100 text-slate-700',
};

export const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState<'add' | 'edit' | 'details' | null>(null);
  const [currentEmp, setCurrentEmp] = useState<Partial<Employee>>({});

  const filteredData = useMemo(() => {
    return employees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.id.includes(searchQuery) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const handleOpenAdd = () => {
    setCurrentEmp({ 
      name: '', id: '', role: '', department: '', 
      grade: 7 as JobGrade, step: 1, contractType: ContractType.PERMANENT,
      status: EmployeeStatus.ACTIVE, nominalSalary: 450000
    });
    setShowModal('add');
  };

  const handleOpenEdit = (emp: Employee) => {
    setCurrentEmp(emp);
    setShowModal('edit');
  };

  const handleOpenDetails = (emp: Employee) => {
    setCurrentEmp(emp);
    setShowModal('details');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('⚠️ تحذير: هل أنت متأكد من حذف هذا الموظف نهائياً؟ سيؤدي ذلك لإزالة كافة السجلات المرتبطة به.')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: EmployeeStatus) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (showModal === 'add') {
      const newEmp: Employee = {
        ...currentEmp as Employee,
        id: currentEmp.id || Math.floor(10000 + Math.random() * 90000).toString(),
        financialNumber: Math.floor(800000 + Math.random() * 100000).toString(),
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://i.pravatar.cc/150?u=${currentEmp.id || Date.now()}`,
        allowances: currentEmp.allowances || { certificate: 0, risk: 0, position: 0, family: 0, costOfLiving: 0 },
        leaveBalance: { regular: 21, sick: 30, timeOff: 5 }
      };
      setEmployees([newEmp, ...employees]);
    } else {
      setEmployees(prev => prev.map(e => e.id === currentEmp.id ? { ...e, ...currentEmp } as Employee : e));
    }
    setShowModal(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1700px] mx-auto font-sans min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shrink-0 print:hidden">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
            <div className="p-3 bg-primary rounded-[1.5rem] shadow-2xl shadow-primary/30 text-white">
               <Users size={28} md:size={32} />
            </div>
            إدارة الموارد البشرية
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm md:text-lg mr-2">Core HR Functions</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
           <button onClick={handleOpenAdd} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm md:text-lg shadow-xl hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-95">
              <UserPlus size={20} /> إضافة للملاك
           </button>
           <button onClick={() => window.print()} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-sm md:text-lg hover:bg-slate-50 transition shadow-lg">
              <Printer size={20} className="text-primary" /> طباعة
           </button>
        </div>
      </div>

      {/* 2. Search & Stats Strip */}
      <div className="flex flex-col xl:flex-row gap-6 shrink-0 print:hidden">
         <div className="flex-1 bg-white dark:bg-slate-900 p-4 md:p-5 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
               <input 
                 type="text" 
                 placeholder="بحث شامل بالاسم، الوظيفة..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-6 pr-14 py-4 md:py-5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-base md:text-lg font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 outline-none transition-all"
               />
            </div>
            <button className="flex items-center justify-center gap-3 px-8 py-4 md:py-5 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-base md:text-lg font-black text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition">
               <Filter size={22} /> تصفية
            </button>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full xl:w-1/3">
            {[
              { label: 'الملاك الدائم', value: employees.filter(e => e.contractType === ContractType.PERMANENT).length.toLocaleString(), color: 'bg-emerald-500' },
              { label: 'عقود 315', value: employees.filter(e => e.contractType === ContractType.CONTRACT_315).length.toLocaleString(), color: 'bg-orange-500' },
              { label: 'نشط حالياً', value: employees.filter(e => e.status === EmployeeStatus.ACTIVE).length.toLocaleString(), color: 'bg-blue-500' },
              { label: 'إجمالي القيود', value: employees.length.toLocaleString(), color: 'bg-red-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                 <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className="text-lg md:text-xl font-black text-slate-800 dark:text-white">{stat.value}</p>
                 <div className={`w-6 h-1 mt-2 rounded-full ${stat.color} opacity-30`}></div>
              </div>
            ))}
         </div>
      </div>

      {/* 3. Main Table */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col print:border-0">
         <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-right border-collapse min-w-[1000px]">
               <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black border-b-2 border-slate-200 dark:border-slate-700">
                  <tr>
                     <th className="p-5 md:p-7 text-xs md:text-sm font-black uppercase tracking-widest">الموظف</th>
                     <th className="p-5 md:p-7 text-xs md:text-sm font-black uppercase tracking-widest">العنوان والرمز</th>
                     <th className="p-5 md:p-7 text-xs md:text-sm font-black uppercase tracking-widest text-center">الدرجة والمرحلة</th>
                     <th className="p-5 md:p-7 text-xs md:text-sm font-black uppercase tracking-widest text-center">نوع التوظيف</th>
                     <th className="p-5 md:p-7 text-xs md:text-sm font-black uppercase tracking-widest text-center">الحالة</th>
                     <th className="p-5 md:p-7 text-xs md:text-sm font-black uppercase tracking-widest text-center print:hidden">إجراءات</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredData.map(emp => (
                     <tr key={emp.id} className="hover:bg-primary/5 transition-all group cursor-pointer" onClick={() => handleOpenDetails(emp)}>
                        <td className="p-5 md:p-7">
                           <div className="flex items-center gap-4 md:gap-6">
                              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl shrink-0 transition-transform group-hover:scale-110">
                                 <img src={emp.avatar} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div>
                                 <div className="font-black text-slate-900 dark:text-white text-lg md:text-2xl leading-none mb-2">{emp.name}</div>
                                 <div className="text-xs md:text-sm text-slate-500 font-bold">{emp.department}</div>
                              </div>
                           </div>
                        </td>
                        <td className="p-5 md:p-7">
                           <div className="space-y-1">
                             <div className="font-black text-slate-800 dark:text-slate-200 text-sm md:text-lg">{emp.role}</div>
                             <div className="font-mono text-[10px] md:text-xs text-white bg-slate-800 dark:bg-primary px-3 py-0.5 rounded-full w-fit tracking-widest">ID: {emp.id}</div>
                           </div>
                        </td>
                        <td className="p-5 md:p-7 text-center">
                           <div className="inline-flex items-center gap-4 md:gap-6 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 md:px-7 md:py-4 rounded-3xl shadow-2xl border-2 border-white/5">
                              <div className="text-center">
                                 <span className="block text-[8px] md:text-[10px] uppercase font-black opacity-50 tracking-widest mb-1">الدرجة</span>
                                 <span className="text-lg md:text-2xl font-black text-primary">{emp.grade}</span>
                              </div>
                              <div className="w-px h-8 md:h-10 bg-white/10"></div>
                              <div className="text-center">
                                 <span className="block text-[8px] md:text-[10px] uppercase font-black opacity-50 tracking-widest mb-1">المرحلة</span>
                                 <span className="text-lg md:text-2xl font-black text-emerald-400">{emp.step}</span>
                              </div>
                           </div>
                        </td>
                        <td className="p-5 md:p-7 text-center">
                           <span className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-black border-2 tracking-tight shadow-xl inline-block ${CONTRACT_BADGES[emp.contractType] || 'bg-slate-400'}`}>
                              {emp.contractType}
                           </span>
                        </td>
                        <td className="p-5 md:p-7 text-center">
                           <span className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-black shadow-sm ${STATUS_COLORS[emp.status] || 'bg-gray-100'}`}>
                              {emp.status}
                           </span>
                        </td>
                        <td className="p-5 md:p-7 print:hidden" onClick={(e) => e.stopPropagation()}>
                           <div className="flex items-center justify-center gap-2 md:gap-4">
                              <button onClick={() => handleOpenEdit(emp)} className="p-3 md:p-4 bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-xl border-2 border-slate-100 dark:border-slate-700 text-emerald-600 group/btn">
                                <Edit3 size={20} className="md:w-6 md:h-6 group-hover/btn:rotate-12 transition-transform" />
                              </button>
                              <button onClick={() => handleDelete(emp.id)} className="p-3 md:p-4 bg-white dark:bg-slate-800 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-xl border-2 border-slate-100 dark:border-slate-700 text-red-500 group/btn">
                                <Trash2 size={20} className="md:w-6 md:h-6 group-hover/btn:scale-110 transition-transform" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {(showModal === 'add' || showModal === 'edit') && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-5xl h-full md:h-auto max-h-[95vh] rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 border-primary/20 overflow-hidden flex flex-col">
              <div className="p-6 md:p-10 border-b-2 border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
                 <div className="flex items-center gap-4 md:gap-6">
                    <div className="p-3 md:p-4 bg-primary text-white rounded-3xl">
                      {showModal === 'add' ? <UserPlus size={24} md:size={32} /> : <Edit3 size={24} md:size={32} />}
                    </div>
                    <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{showModal === 'add' ? 'إضافة موظف' : 'تحديث بيانات'}</h3>
                 </div>
                 <button onClick={() => setShowModal(null)} className="p-3 md:p-4 text-slate-400 hover:text-red-500 transition"><X size={24} md:size={32} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 overflow-y-auto custom-scrollbar flex-1">
                 <div className="space-y-3 md:space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">الاسم الكامل</label>
                    <input required value={currentEmp.name || ''} onChange={e => setCurrentEmp({...currentEmp, name: e.target.value})} className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-base md:text-xl outline-none focus:border-primary transition-all" />
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">العنوان الوظيفي</label>
                    <input required value={currentEmp.role || ''} onChange={e => setCurrentEmp({...currentEmp, role: e.target.value})} className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-base md:text-lg outline-none focus:border-primary transition-all" />
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">الدائرة / القسم</label>
                    <select value={currentEmp.department || ''} onChange={e => setCurrentEmp({...currentEmp, department: e.target.value})} className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-base md:text-lg outline-none appearance-none">
                       <option value="">اختر الدائرة...</option>
                       <option>تكنولوجيا المعلومات</option>
                       <option>الدائرة المالية</option>
                       <option>الخدمات الإدارية</option>
                       <option>الدائرة القانونية</option>
                    </select>
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">نوع التوظيف</label>
                    <select value={currentEmp.contractType || ''} onChange={e => setCurrentEmp({...currentEmp, contractType: e.target.value as ContractType})} className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-base md:text-lg outline-none appearance-none">
                       {Object.values(ContractType).map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3 md:space-y-4">
                       <label className="text-xs font-black text-primary uppercase tracking-widest">الدرجة الوظيفية</label>
                       <input type="number" min="1" max="10" value={currentEmp.grade || 1} onChange={e => setCurrentEmp({...currentEmp, grade: Number(e.target.value) as JobGrade})} className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-base md:text-xl outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-3 md:space-y-4">
                       <label className="text-xs font-black text-primary uppercase tracking-widest">المرحلة</label>
                       <input type="number" min="1" max="11" value={currentEmp.step || 1} onChange={e => setCurrentEmp({...currentEmp, step: Number(e.target.value)})} className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-base md:text-xl outline-none focus:border-primary transition-all" />
                    </div>
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">الراتب الاسمي</label>
                    <input type="number" value={currentEmp.nominalSalary || 0} onChange={e => setCurrentEmp({...currentEmp, nominalSalary: Number(e.target.value)})} className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-mono font-black text-base md:text-xl outline-none focus:border-primary transition-all" />
                 </div>
                 <div className="space-y-3 md:space-y-4">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">حالة الموظف</label>
                    <select value={currentEmp.status || ''} onChange={e => setCurrentEmp({...currentEmp, status: e.target.value as EmployeeStatus})} className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-base md:text-lg outline-none appearance-none">
                       {Object.values(EmployeeStatus).map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                 </div>
                 <div className="col-span-full pt-6 md:pt-10 flex gap-4 md:gap-6 shrink-0">
                    <button type="button" onClick={() => setShowModal(null)} className="flex-1 py-4 md:py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[1.5rem] md:rounded-[1.75rem] font-black text-lg md:text-xl transition-all hover:bg-slate-200">إلغاء</button>
                    <button type="submit" className="flex-[2] py-4 md:py-6 bg-primary text-white rounded-[1.5rem] md:rounded-[1.75rem] font-black text-lg md:text-xl shadow-2xl shadow-primary/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                       <Save size={24} md:size={28} /> {showModal === 'add' ? 'إضافة' : 'حفظ'}
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DETAILS DRAWER (FULL VIEW) --- */}
      <AnimatePresence>
        {showModal === 'details' && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(null)} className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 right-0 z-[110] w-full md:w-[700px] bg-white dark:bg-slate-900 shadow-2xl border-l-4 border-primary/20 flex flex-col">
               {/* Drawer Header */}
               <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-start shrink-0">
                  <div className="flex gap-4 md:gap-6">
                     <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl">
                        <img src={currentEmp.avatar} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">{currentEmp.name}</h2>
                        <p className="text-slate-500 font-bold text-sm md:text-lg mb-2">{currentEmp.role}</p>
                        <div className="flex flex-wrap gap-2">
                           <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-black border-2 tracking-tight ${CONTRACT_BADGES[currentEmp.contractType || ''] || 'bg-slate-400'}`}>
                              {currentEmp.contractType}
                           </span>
                           <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-black border-2 tracking-tight ${STATUS_COLORS[currentEmp.status || ''] || 'bg-slate-400'}`}>
                              {currentEmp.status}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => handleOpenEdit(currentEmp as Employee)} className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition"><Edit3 size={18} md:size={20} /></button>
                     <button onClick={() => setShowModal(null)} className="p-2 md:p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500 transition"><X size={20} md:size={24} /></button>
                  </div>
               </div>

               {/* Drawer Content */}
               <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 md:space-y-10 custom-scrollbar">
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                     <div className="bg-slate-50 dark:bg-slate-800 p-3 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-2">رصيد الإجازات</p>
                        <p className="text-lg md:text-2xl font-black text-blue-600">{currentEmp.leaveBalance?.regular}</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800 p-3 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-2">الراتب الاسمي</p>
                        <p className="text-lg md:text-2xl font-black text-emerald-600">{currentEmp.nominalSalary?.toLocaleString()}</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800 p-3 md:p-5 rounded-3xl border border-slate-100 dark:border-slate-700 text-center">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase mb-2">الخدمة (سنة)</p>
                        <p className="text-lg md:text-2xl font-black text-purple-600">14</p>
                     </div>
                  </div>

                  {/* Actions Quick Menu */}
                  <section className="bg-blue-600/5 dark:bg-blue-900/10 p-4 md:p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
                     <h3 className="text-xs md:text-sm font-black text-blue-600 mb-4 flex items-center gap-2 uppercase tracking-widest"><RefreshCw size={16} /> تغيير الحالة الوظيفية</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.values(EmployeeStatus).slice(0, 4).map(st => (
                           <button 
                             key={st}
                             onClick={() => handleStatusChange(currentEmp.id!, st)}
                             className={`py-2 md:py-3 px-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all ${currentEmp.status === st ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-blue-50'}`}
                           >
                              {st}
                           </button>
                        ))}
                     </div>
                  </section>

                  {/* Info Sections */}
                  <div className="space-y-8">
                     <section>
                        <h3 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                           <FileText size={16} className="text-primary" /> البيانات الشخصية والوظيفية
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                           <div>
                              <p className="text-xs text-slate-400 font-bold mb-1">الرقم الوطني الموحد</p>
                              <p className="font-mono font-black text-slate-700 dark:text-white">{currentEmp.nationalId || '---'}</p>
                           </div>
                           <div>
                              <p className="text-xs text-slate-400 font-bold mb-1">تاريخ الميلاد</p>
                              <p className="font-mono font-black text-slate-700 dark:text-white">{currentEmp.dob || '---'}</p>
                           </div>
                           <div>
                              <p className="text-xs text-slate-400 font-bold mb-1">الرقم المالي</p>
                              <p className="font-mono font-black text-slate-700 dark:text-white">{currentEmp.financialNumber}</p>
                           </div>
                           <div>
                              <p className="text-xs text-slate-400 font-bold mb-1">تاريخ المباشرة</p>
                              <p className="font-mono font-black text-slate-700 dark:text-white">{currentEmp.joinDate}</p>
                           </div>
                        </div>
                     </section>

                     <section>
                        <h3 className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                           <ExternalLink size={16} className="text-primary" /> الأضبارة الإلكترونية (الوثائق)
                        </h3>
                        <div className="space-y-3">
                           {[
                             { name: 'هوية الأحوال المدنية', type: 'IMG', date: '2024/01/10' },
                             { name: 'الأمر الإداري بالتعيين', type: 'PDF', date: '2010/05/15' },
                             { name: 'شهادة البكالوريوس', type: 'PDF', date: '2009/07/20' },
                           ].map((doc, idx) => (
                              <div key={idx} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary transition cursor-pointer group">
                                 <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${doc.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                       <FileText size={20} />
                                    </div>
                                    <div>
                                       <p className="font-black text-sm text-slate-700 dark:text-white">{doc.name}</p>
                                       <p className="text-[10px] text-slate-400 font-bold">{doc.date}</p>
                                    </div>
                                 </div>
                                 <Download size={18} className="text-slate-300 group-hover:text-primary transition" />
                              </div>
                           ))}
                           <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                              + إضافة وثيقة جديدة للأضبارة
                           </button>
                        </div>
                     </section>
                  </div>
               </div>

               {/* Drawer Footer Actions */}
               <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4 shrink-0">
                  <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm md:text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                     <Stamp size={20} /> إصدار أمر إداري
                  </button>
                  <button onClick={() => handleDelete(currentEmp.id!)} className="px-6 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl font-black">
                     <Trash2 size={24} />
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @media print {
          header, aside, .print\\:hidden, button, input { display: none !important; }
          .p-4, .p-8 { padding: 0 !important; }
          table { width: 100% !important; border-collapse: collapse !important; border: 2px solid black !important; direction: rtl; }
          th, td { border: 1px solid black !important; padding: 10px !important; color: black !important; text-align: right; }
          th { background: #f0f0f0 !important; font-weight: 900 !important; }
        }
      `}</style>
    </div>
  );
};
