
import React, { useState } from 'react';
import { 
  Users, UserPlus, Briefcase, FileText, CheckCircle, XCircle, Search, 
  Filter, Plus, Building, ChevronDown, Edit3, Trash2, Shield, 
  FileSpreadsheet, Activity, Map, Clock, Bot, ChevronLeft, BarChart2,
  Layers, Settings, UserCheck, PieChart, TrendingUp, AlertTriangle
} from 'lucide-react';
import { 
  RecruitmentType, ApplicantStatus, Applicant, JobPosting, OrgUnit 
} from '../types';
import { 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, 
  AreaChart, Area, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const INITIAL_ORG_TREE: OrgUnit[] = [
  {
    id: 'HQ',
    name: 'وزارة الموارد البشرية',
    type: 'Ministry',
    authorizedStrength: 2500,
    actualStrength: 2150,
    vacancies: 350,
    manager: 'د. حسين العلي',
    children: [
      {
        id: 'HR_DEPT',
        name: 'الدائرة الإدارية والمالية',
        type: 'Department',
        authorizedStrength: 400,
        actualStrength: 380,
        vacancies: 20,
        manager: 'أحمد سعيد',
        children: [
          { id: 'FIN_SEC', name: 'قسم الحسابات', type: 'Section', authorizedStrength: 50, actualStrength: 45, vacancies: 5, children: [] },
          { id: 'HR_SEC', name: 'قسم الموارد البشرية', type: 'Section', authorizedStrength: 80, actualStrength: 78, vacancies: 2, children: [] }
        ]
      },
      {
        id: 'IT_DEPT',
        name: 'دائرة تكنولوجيا المعلومات',
        type: 'Department',
        authorizedStrength: 150,
        actualStrength: 90,
        vacancies: 60,
        manager: 'سارة محمد',
        children: [
          { id: 'DEV_SEC', name: 'قسم التطوير', type: 'Section', authorizedStrength: 80, actualStrength: 40, vacancies: 40, children: [] },
          { id: 'NET_SEC', name: 'قسم الشبكات', type: 'Section', authorizedStrength: 40, actualStrength: 35, vacancies: 5, children: [] }
        ]
      }
    ]
  }
];

const INITIAL_JOB_POSTINGS: JobPosting[] = [
  {
    id: 'JOB-2024-001', 
    title: 'ملاحظ فني / مبرمج',
    titleEn: 'Technical Observer / Programmer',
    department: 'تكنولوجيا المعلومات', 
    vacancies: 5,
    type: RecruitmentType.FPSC, 
    status: 'Active', 
    deadline: '2024-12-01', 
    location: 'بغداد - المقر العام',
    postedDate: '2024-11-01', 
    description: 'تطوير وصيانة الأنظمة الداخلية وقواعد البيانات المركزية.', 
    requirements: ['بكالوريوس علوم حاسبات', 'خبرة سنتين في تطوير الويب', 'إجادة اللغة الإنجليزية'],
    grade: 7, 
    salaryScale: '420,000 - 550,000'
  }
];

const INITIAL_APPLICANTS: Applicant[] = [
  { 
    id: 'APP-001', name: 'محمد حسن علي', nationalId: '199512345678', phone: '07701234567', email: 'mohammed@test.com',
    dob: '1995-05-12', degree: 'Bachelor', major: 'Computer Science', university: 'University of Baghdad', graduationYear: 2018, experienceYears: 4,
    gpa: 85.5, isMartyrFamily: true, isPoliticalPrisoner: false, isDisabled: false, maritalStatus: 'married', 
    childrenCount: 2, points: 0, status: ApplicantStatus.PENDING_AUDIT, 
    recruitmentType: RecruitmentType.FPSC, governorate: 'Baghdad', appliedJobId: 'JOB-2024-001',
    cvText: "خبرة 4 سنوات في تطوير الويب باستخدام React و Node.js. عملت سابقاً في شركة زين للاتصالات.",
    documents: []
  }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

// --- COMPONENTS ---

const KpiCard = ({ title, value, subtext, icon: Icon, color, trend, trendValue }: any) => (
  <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group h-full">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 group-hover:scale-110 transition-transform ${color.replace('text-', 'bg-')}`}></div>
    <div className="relative z-10 flex justify-between items-start h-full flex-col">
      <div className="flex justify-between w-full mb-4">
         <div className={`p-3 rounded-2xl ${color.replace('text-', 'bg-')} bg-opacity-10 backdrop-blur-sm`}>
           <Icon className={`w-6 h-6 ${color}`} />
         </div>
         {trend && (
             <span className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {trend === 'up' ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />} {trendValue}
             </span>
         )}
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{value}</h3>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-[10px] mt-2 font-medium text-slate-400 opacity-80">{subtext}</p>
      </div>
    </div>
  </div>
);

const OrgUnitModal = ({ isOpen, onClose, mode, parentName, initialData, onSave }: any) => {
  const [formData, setFormData] = useState(initialData || { name: '', manager: '', authorizedStrength: 0, actualStrength: 0, type: mode === 'add-top' ? 'Ministry' : 'Section' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg h-full md:h-auto max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {mode === 'add' || mode === 'add-top' ? 'إضافة تشكيل جديد' : 'تعديل التشكيل'}
            </h3>
            {parentName && <p className="text-xs text-blue-600 font-bold mt-1">يتبع لـ: {parentName}</p>}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition"><XCircle size={28} /></button>
        </div>
        <div className="p-8 space-y-5 overflow-y-auto custom-scrollbar flex-1">
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-widest">اسم التشكيل (الدائرة/القسم)</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="مثال: قسم تكنولوجيا المعلومات"
              />
           </div>
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-widest">نوع التشكيل</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                 <option value="Ministry">وزارة / رئاسة</option>
                 <option value="Department">دائرة عامة</option>
                 <option value="Section">قسم</option>
                 <option value="Unit">شعبة / وحدة</option>
              </select>
           </div>
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-widest">اسم المسؤول / المدير</label>
              <input 
                type="text" 
                value={formData.manager} 
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="الاسم الثلاثي..."
              />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-widest">الملاك المصدق</label>
                 <input 
                   type="number" 
                   value={formData.authorizedStrength} 
                   onChange={(e) => setFormData({...formData, authorizedStrength: parseInt(e.target.value) || 0})}
                   className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
                 />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-widest">العدد الفعلي الحالي</label>
                 <input 
                   type="number" 
                   value={formData.actualStrength} 
                   onChange={(e) => setFormData({...formData, actualStrength: parseInt(e.target.value) || 0})}
                   className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20" 
                 />
              </div>
           </div>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-950 flex gap-4 shrink-0">
           <button onClick={onClose} className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold border border-slate-200 dark:border-slate-700">إلغاء</button>
           <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition">حفظ التغييرات</button>
        </div>
      </motion.div>
    </div>
  );
};

const OrgTreeItem: React.FC<{ node: OrgUnit; level?: number; onAction: (action: string, node: OrgUnit) => void }> = ({ node, level = 0, onAction }) => {
  const [expanded, setExpanded] = useState(true);
  const occupancyRate = node.authorizedStrength > 0 ? (node.actualStrength / node.authorizedStrength) * 100 : 0;
  
  const getProgressColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="animate-fade-in relative min-w-[700px]">
      {level > 0 && (
         <div className="absolute top-0 right-[-1.5rem] w-[1.5rem] h-8 border-r-2 border-b-2 border-slate-200 dark:border-slate-800 rounded-br-xl pointer-events-none" />
      )}

      <div 
        className={`flex flex-col lg:flex-row lg:items-center justify-between p-5 mb-3 rounded-[2rem] border transition-all group relative overflow-hidden ${
          node.type === 'Ministry' 
            ? 'bg-slate-900 text-white border-transparent shadow-xl' 
            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-lg'
        }`}
        style={{ marginRight: `${level * 1.5}rem` }}
      >
        <div className="flex items-center gap-4 mb-4 lg:mb-0 relative z-10">
           {hasChildren ? (
             <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-white/10 rounded-lg transition">
               <ChevronDown size={20} className={`text-slate-400 transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`} />
             </button>
           ) : (
             <div className="w-8" />
           )}
           
           <div className={`p-4 rounded-2xl ${
             node.type === 'Ministry' ? 'bg-blue-600 text-white' : 
             node.type === 'Department' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 
             'bg-slate-50 text-slate-500 dark:bg-slate-800'
           } shadow-sm`}>
             <Building size={24} />
           </div>
           
           <div>
             <h4 className={`font-black tracking-tight ${node.type === 'Ministry' ? 'text-2xl' : 'text-lg'}`}>{node.name}</h4>
             <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase font-black opacity-50 tracking-widest">{node.type}</span>
                {node.manager && (
                   <span className={`text-xs font-bold ${node.type === 'Ministry' ? 'text-blue-300' : 'text-slate-500'}`}>
                      • المدير: {node.manager}
                   </span>
                )}
             </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
           <div className="flex items-center gap-8 px-6">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">الملاك</p>
                <p className="font-black font-mono text-lg">{node.authorizedStrength.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">الفعلي</p>
                <p className="font-black font-mono text-lg text-blue-500">{node.actualStrength.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">الشاغر</p>
                <p className={`font-black font-mono text-lg ${node.vacancies > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{node.vacancies.toLocaleString()}</p>
              </div>
           </div>

           <div className="w-full sm:w-40">
              <div className="flex justify-between items-center mb-1 px-1">
                 <span className="text-[10px] font-bold text-slate-400">الإشغال</span>
                 <span className="text-[10px] font-black">{occupancyRate.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${occupancyRate}%` }}
                   className={`h-full rounded-full ${getProgressColor(occupancyRate)}`}
                 />
              </div>
           </div>

           <div className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-700 mr-4">
              <button 
                onClick={() => onAction('add', node)} 
                title="إضافة تشكيل فرعي"
                className={`p-2 rounded-xl transition ${node.type === 'Ministry' ? 'bg-white/10 hover:bg-white/20 text-white' : 'hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600'}`}
              >
                 <Plus size={18} />
              </button>
              <button 
                onClick={() => onAction('edit', node)}
                title="تعديل التشكيل"
                className={`p-2 rounded-xl transition ${node.type === 'Ministry' ? 'bg-white/10 hover:bg-emerald-600 hover:text-white' : 'hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600'}`}
              >
                 <Edit3 size={18} />
              </button>
              <button 
                onClick={() => onAction('delete', node)}
                title="حذف التشكيل"
                className={`p-2 rounded-xl transition ${node.type === 'Ministry' ? 'bg-white/10 hover:bg-red-500/20 text-red-300' : 'hover:bg-red-50 dark:hover:bg-slate-800 text-slate-400 hover:text-red-600'}`}
              >
                 <Trash2 size={18} />
              </button>
           </div>
        </div>
      </div>

      {expanded && node.children && node.children.length > 0 && (
         <div className="border-r-2 border-slate-100 dark:border-slate-800 mr-8 mb-4">
            {node.children.map(child => <OrgTreeItem key={child.id} node={child} level={level + 1} onAction={onAction} />)}
         </div>
      )}
    </div>
  );
};

// --- MAIN PAGE ---

export const Recruitment = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'applicants' | 'establishment'>('dashboard');
  const [orgData, setOrgData] = useState<OrgUnit[]>(INITIAL_ORG_TREE);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(INITIAL_JOB_POSTINGS);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  
  // Org Management State
  const [orgModal, setOrgModal] = useState({ isOpen: false, mode: 'add', node: null as any, parentNode: null as any });

  const TABS = [
    { id: 'dashboard', label: 'لوحة القيادة', icon: BarChart2 },
    { id: 'establishment', label: 'إدارة الملاك', icon: Layers },
    { id: 'jobs', label: 'الوظائف والدرجات', icon: Briefcase },
    { id: 'applicants', label: 'سجل المتقدمين', icon: Users }
  ];

  // --- ACTIONS ---
  const handleOrgAction = (action: string, node: OrgUnit) => {
    if (action === 'delete') {
      if (window.confirm(`⚠️ هل أنت متأكد من حذف ${node.name}؟ سيتم حذف كافة التشكيلات التابعة لها.`)) {
        setOrgData(prev => updateTree(prev, node.id, {}, 'delete'));
      }
    } else if (action === 'edit') {
      setOrgModal({ isOpen: true, mode: 'edit', node: node, parentNode: null });
    } else if (action === 'add') {
      setOrgModal({ isOpen: true, mode: 'add', node: null, parentNode: node });
    }
  };

  const updateTree = (nodes: OrgUnit[], id: string, newData: Partial<OrgUnit>, mode: 'edit' | 'add' | 'delete'): OrgUnit[] => {
    if (mode === 'delete') {
      return nodes.filter(node => node.id !== id).map(node => ({
        ...node,
        children: node.children ? updateTree(node.children, id, newData, 'delete') : []
      }));
    }
    return nodes.map(node => {
      if (node.id === id) {
        if (mode === 'edit') return { ...node, ...newData };
        if (mode === 'add') {
          const newNode: OrgUnit = {
            id: `UNIT-${Date.now()}`,
            name: newData.name || 'New Unit',
            type: (newData.type as any) || 'Section',
            authorizedStrength: newData.authorizedStrength || 0,
            actualStrength: newData.actualStrength || 0,
            vacancies: (newData.authorizedStrength || 0) - (newData.actualStrength || 0),
            manager: newData.manager,
            children: []
          };
          return { ...node, children: [...(node.children || []), newNode] };
        }
      }
      if (node.children) return { ...node, children: updateTree(node.children, id, newData, mode) };
      return node;
    });
  };

  const handleJobDelete = (id: string) => {
    if (window.confirm('🗑️ هل تريد حذف هذا الإعلان الوظيفي نهائياً؟')) {
      setJobPostings(prev => prev.filter(j => j.id !== id));
    }
  };

  const handleApplicantDelete = (id: string) => {
    if (window.confirm('❌ هل تريد استبعاد هذا المتقدم وحذف بياناته؟')) {
      setApplicants(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1920px] mx-auto font-sans h-full flex flex-col overflow-hidden">
       
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shrink-0">
          <div>
             <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
               <div className="p-3 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-600/20 text-white">
                  <UserPlus size={28} md:size={32} />
               </div>
               نظام التعيينات والملاك
             </h1>
             <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-lg font-bold">
               Staff Establishment & Recruitment
             </p>
          </div>

          <div className="flex bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar w-full lg:w-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
         </div>
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
          <AnimatePresence mode="wait">
             {activeTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                   
                   {/* KPI Grid */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                      <KpiCard title="الملاك المعتمد" value="2,500" subtext="السقف الوظيفي الكلي" icon={Shield} color="text-blue-600" trend="up" trendValue="0%" />
                      <KpiCard title="الملاك المشغول" value="2,150" subtext="الموظفين الحاليين" icon={Users} color="text-emerald-600" trend="up" trendValue="12%" />
                      <KpiCard title="الشواغر المتاحة" value="350" subtext="درجات شاغرة للحذف والاستحداث" icon={Briefcase} color="text-amber-500" trend="down" trendValue="5%" />
                      <KpiCard title="عدد المتقدمين" value={applicants.length.toString()} subtext="طلبات قيد المعالجة" icon={UserPlus} color="text-purple-600" />
                   </div>

                   {/* Charts Section */}
                   <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      <div className="xl:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-slate-200 dark:border-slate-700">
                         <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                           <Activity className="text-blue-500" /> حركة الملاك والتعيينات
                         </h3>
                         <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={[{ name: 'Q1', v: 400 }, { name: 'Q2', v: 300 }, { name: 'Q3', v: 600 }, { name: 'Q4', v: 850 }]}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={4} fillOpacity={0.1} fill="#3b82f6" />
                               </AreaChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
                         <h3 className="text-xl font-black mb-6 flex items-center gap-3"><PieChart className="text-emerald-500" /> نسب الإشغال</h3>
                         <div className="flex-1 relative">
                            <ResponsiveContainer width="100%" height="100%">
                               <RePieChart>
                                  <Pie data={[{name: 'مشغول', value: 86}, {name: 'شاغر', value: 14}]} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                                     {COLORS.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
                                  </Pie>
                               </RePieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                               <span className="text-4xl font-black text-slate-800 dark:text-white">86%</span>
                               <span className="text-sm font-bold text-slate-400">نسبة الإشغال</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )}

             {activeTab === 'establishment' && (
                <motion.div key="establishment" className="space-y-8">
                   <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-4 md:p-8 border-2 border-slate-100 dark:border-slate-800 shadow-sm relative overflow-x-auto custom-scrollbar">
                      <div className="space-y-4">
                         {orgData.map(node => (
                            <OrgTreeItem key={node.id} node={node} onAction={handleOrgAction} />
                         ))}
                      </div>
                   </div>
                </motion.div>
             )}

             {activeTab === 'jobs' && (
                <motion.div key="jobs" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {jobPostings.map(job => (
                      <div key={job.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                         
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex flex-col">
                               <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{job.title}</h3>
                               <p className="text-xs font-bold text-blue-500 mt-1 uppercase tracking-widest">{job.titleEn}</p>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
                               <Briefcase size={24} />
                            </div>
                         </div>
                         
                         <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                               <Building size={16} className="text-slate-400" />
                               <span className="font-bold">{job.department}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm px-1">
                               <span className="text-slate-500 font-bold">الدرجة الوظيفية:</span>
                               <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">الدرجة {job.grade}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm px-1">
                               <span className="text-slate-500 font-bold">عدد الشواغر:</span>
                               <span className="font-black text-emerald-600">{job.vacancies} وظائف</span>
                            </div>
                            <div className="flex justify-between items-center text-sm px-1">
                               <span className="text-slate-500 font-bold">عدد المتقدمين:</span>
                               <span className="font-black text-blue-600 flex items-center gap-1"><Users size={14} /> {applicants.filter(a => a.appliedJobId === job.id).length}</span>
                            </div>
                         </div>

                         <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition">
                               عرض المتقدمين
                            </button>
                            <button className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl hover:text-blue-600 transition">
                               <Edit3 size={18} />
                            </button>
                            <button onClick={() => handleJobDelete(job.id)} className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-100 transition">
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </div>
                   ))}
                   <button className="border-3 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50/50 transition group min-h-[350px]">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                         <Plus size={32} />
                      </div>
                      <span className="font-black text-lg">إضافة وظيفة جديدة</span>
                      <span className="text-xs font-bold mt-2 opacity-60">تعريف درجة شاغرة للملاك</span>
                   </button>
                </motion.div>
             )}

             {activeTab === 'applicants' && (
                <motion.div key="applicants" className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                   <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-right min-w-[1000px]">
                         <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-black border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                            <tr>
                               <th className="p-6">معلومات المتقدم</th>
                               <th className="p-6 text-center">المؤهل العلمي</th>
                               <th className="p-6 text-center">المعدل / النقاط</th>
                               <th className="p-6 text-center">حالة الطلب</th>
                               <th className="p-6 text-center">إجراءات</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {applicants.map(app => (
                               <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer group" onClick={() => setSelectedApplicant(app)}>
                                  <td className="p-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600 text-lg">
                                           {app.name[0]}
                                        </div>
                                        <div>
                                           <div className="font-black text-lg text-slate-800 dark:text-white">{app.name}</div>
                                           <div className="text-xs text-slate-400 font-bold mt-0.5">{app.email} • {app.phone}</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="p-6 text-center">
                                     <div className="font-bold text-sm">{app.degree} - {app.major}</div>
                                     <div className="text-xs text-slate-400 font-bold">{app.university} ({app.graduationYear})</div>
                                  </td>
                                  <td className="p-6 text-center">
                                     <div className="inline-flex flex-col items-center">
                                        <span className="font-black text-lg text-emerald-600">{app.gpa}%</span>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 rounded-full">{app.points} نقطة مفاضلة</span>
                                     </div>
                                  </td>
                                  <td className="p-6 text-center">
                                     <span className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm ${
                                        app.status === ApplicantStatus.ACCEPTED ? 'bg-emerald-100 text-emerald-700' :
                                        app.status === ApplicantStatus.REJECTED ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                     }`}>{app.status}</span>
                                  </td>
                                  <td className="p-6" onClick={(e) => e.stopPropagation()}>
                                     <div className="flex items-center justify-center gap-3">
                                        <button title="تدقيق ومطابقة" className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 hover:border-blue-600 transition rounded-xl shadow-sm"><UserCheck size={18} /></button>
                                        <button onClick={() => handleApplicantDelete(app.id)} title="حذف الطلب" className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:border-red-600 transition rounded-xl shadow-sm"><Trash2 size={18} /></button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       <AnimatePresence>
          {orgModal.isOpen && (
            <OrgUnitModal 
              isOpen={orgModal.isOpen}
              onClose={() => setOrgModal({ ...orgModal, isOpen: false })}
              mode={orgModal.mode}
              parentName={orgModal.parentNode?.name}
              initialData={orgModal.node}
              onSave={(data: any) => {
                 if (orgModal.mode === 'add-top') setOrgData([...orgData, { id: `U-${Date.now()}`, ...data, vacancies: data.authorizedStrength - data.actualStrength, children: [] }]);
                 else if (orgModal.mode === 'add') setOrgData(prev => updateTree(prev, orgModal.parentNode.id, data, 'add'));
                 else setOrgData(prev => updateTree(prev, orgModal.node.id, data, 'edit'));
                 setOrgModal({ ...orgModal, isOpen: false });
              }}
            />
          )}
       </AnimatePresence>
    </div>
  );
};
