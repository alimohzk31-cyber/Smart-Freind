
import React, { useState } from 'react';
import { 
  Banknote, Download, Plus, FileText, Info, Calculator, 
  DollarSign, TrendingUp, Filter, CheckCircle, AlertTriangle, 
  Printer, Share2, Search, Calendar, Edit3, Trash2, Settings, MoreVertical
} from 'lucide-react';
import { PayrollRecord, EmployeeStatus } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// --- MOCK PAYROLL ENGINE ---
// Simulating an Iraqi Government Payroll Master Sheet
const generatePayrollData = (): PayrollRecord[] => {
  return [
    { 
      id: 'PR-1001', month: '2024-10', employeeId: '10203', employeeName: "أحمد كاظم حسن", financialNumber: '882910',
      grade: 3, step: 2,
      nominalSalary: 680000,
      allowanceCertificate: 100000, allowanceFamily: 50000, allowanceRisk: 200000, allowancePosition: 150000, allowanceTransport: 30000, allowanceOther: 0,
      totalEarnings: 1210000,
      deductionRetirement: 68000, deductionTax: 12000, deductionAbsence: 0, deductionLoan: 50000,
      totalDeductions: 130000,
      netSalary: 1080000, status: 'APPROVED'
    },
    { 
      id: 'PR-1002', month: '2024-10', employeeId: '10204', employeeName: "زينب محمد كريم", financialNumber: '882911',
      grade: 7, step: 1,
      nominalSalary: 296000,
      allowanceCertificate: 45000, allowanceFamily: 0, allowanceRisk: 0, allowancePosition: 0, allowanceTransport: 20000, allowanceOther: 0,
      totalEarnings: 361000,
      deductionRetirement: 29600, deductionTax: 0, deductionAbsence: 15000, deductionLoan: 0,
      totalDeductions: 44600,
      netSalary: 316400, status: 'PAID'
    },
    { 
      id: 'PR-1003', month: '2024-10', employeeId: '10205', employeeName: "حسين علي رضا", financialNumber: '990123',
      grade: 9, step: 4,
      nominalSalary: 210000,
      allowanceCertificate: 0, allowanceFamily: 75000, allowanceRisk: 50000, allowancePosition: 0, allowanceTransport: 0, allowanceOther: 150000, // 315 Contract Support
      totalEarnings: 485000,
      deductionRetirement: 0, deductionTax: 0, deductionAbsence: 0, deductionLoan: 0,
      totalDeductions: 0,
      netSalary: 485000, status: 'DRAFT'
    }
  ];
};

export const Finance = () => {
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>(generatePayrollData());
  const [selectedMonth, setSelectedMonth] = useState('2024-10');
  const [searchTerm, setSearchTerm] = useState('');

  // Stats Calculation
  const totalNominal = payrollData.reduce((sum, r) => sum + r.nominalSalary, 0);
  const totalAllowances = payrollData.reduce((sum, r) => sum + (r.totalEarnings - r.nominalSalary), 0);
  const totalDeductions = payrollData.reduce((sum, r) => sum + r.totalDeductions, 0);
  const totalNet = payrollData.reduce((sum, r) => sum + r.netSalary, 0);

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القيد المالي؟')) {
      setPayrollData(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    // Placeholder for edit functionality
    console.log('Edit record:', id);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-[1920px] mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 relative group">
        
        {/* Settings Icon for Header Section */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition">
              <Settings size={18} />
           </button>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Banknote className="text-emerald-600 w-8 h-8 md:w-10 md:h-10" />
            الرواتب والمالية
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-lg">
            نظام الرواتب المركزي الموحد - وزارة الموارد البشرية
          </p>
          <div className="flex items-center gap-2 mt-4 text-[10px] md:text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full w-fit">
            <Info size={14} />
            يتم الاحتساب وفق قانون رواتب موظفي الدولة والقطاع العام رقم 22 لسنة 2008 المعدل
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-end gap-3 w-full xl:w-auto">
           <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm rounded-lg text-xs md:text-sm font-bold">تشرين الأول 2024</button>
              <button className="flex-1 sm:flex-none px-4 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs md:text-sm font-bold">أيلول 2024</button>
           </div>
           <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition font-bold shadow-sm text-sm">
                <Printer size={18} />
                <span className="hidden sm:inline">طباعة الماستر</span>
                <span className="sm:hidden">طباعة</span>
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 transition font-bold text-sm">
                <Calculator size={18} />
                احتساب رواتب الشهر
              </button>
           </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/10 transition"></div>
            
            {/* Edit Icon for Card */}
            <button className="absolute top-4 left-4 p-1.5 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition opacity-0 group-hover:opacity-100">
               <Edit3 size={14} />
            </button>

            <p className="text-slate-400 text-xs font-bold uppercase mb-1">إجمالي الرواتب الاسمية</p>
            <h3 className="text-2xl md:text-3xl font-black">{totalNominal.toLocaleString()} <span className="text-sm font-normal text-slate-400">د.ع</span></h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-white/5 w-fit px-2 py-1 rounded-lg">
               <Calculator size={12} /> أساس الاحتساب
            </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl -mr-5 -mt-5"></div>
            
            <button className="absolute top-4 left-4 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-600 transition opacity-0 group-hover:opacity-100">
               <Edit3 size={14} />
            </button>

            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">إجمالي المخصصات</p>
            <h3 className="text-2xl md:text-3xl font-black text-blue-600">{totalAllowances.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
               <TrendingUp size={12} className="text-emerald-500" />
               تشكل 45% من اجمالي الصرف
            </p>
         </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl -mr-5 -mt-5"></div>
            
            <button className="absolute top-4 left-4 p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
               <Edit3 size={14} />
            </button>

            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">الاستقطاعات (تقاعد/ضريبة)</p>
            <h3 className="text-2xl md:text-3xl font-black text-red-500">{totalDeductions.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-2">تشمل التوقيفات التقاعدية 10%</p>
         </div>

         <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <button className="absolute top-4 left-4 p-1.5 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition opacity-0 group-hover:opacity-100">
               <Edit3 size={14} />
            </button>

            <p className="text-emerald-100 text-xs font-bold uppercase mb-1">صافي الصرف الفعلي</p>
            <h3 className="text-2xl md:text-3xl font-black">{totalNet.toLocaleString()}</h3>
            <div className="mt-4 w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
               <div className="bg-white/80 h-full w-[85%]"></div>
            </div>
            <p className="text-[10px] text-emerald-100 mt-1 text-left">85% تم الصرف</p>
         </div>
      </div>

      {/* Salary Master Sheet Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-full md:w-auto">
               <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                 <FileText className="text-blue-600" size={20} />
                 سجل الرواتب (Master Sheet)
               </h3>
               <p className="text-xs text-slate-500">لشهر تشرين الأول 2024</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="بحث باسم الموظف..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                  />
               </div>
               <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300">
                  <Filter size={16} /> تصفية
               </button>
            </div>
         </div>

         <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right text-sm min-w-[1200px]">
               <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  <tr>
                     <th className="p-4 w-16">#</th>
                     <th className="p-4">الموظف</th>
                     <th className="p-4">الدرجة/المرحلة</th>
                     <th className="p-4 bg-blue-50/50 dark:bg-blue-900/10">الراتب الاسمي</th>
                     <th className="p-4 text-green-700 dark:text-green-400">م. شهادة</th>
                     <th className="p-4 text-green-700 dark:text-green-400">م. زوجية</th>
                     <th className="p-4 text-green-700 dark:text-green-400">م. خطورة</th>
                     <th className="p-4 text-green-700 dark:text-green-400">اخرى</th>
                     <th className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 font-black">إجمالي الاستحقاق</th>
                     <th className="p-4 text-red-600 dark:text-red-400">تقاعد (10%)</th>
                     <th className="p-4 text-red-600 dark:text-red-400">استقطاعات</th>
                     <th className="p-4 bg-slate-200/50 dark:bg-slate-700/50 font-black">صافي الراتب</th>
                     <th className="p-4 text-center">الحالة</th>
                     <th className="p-4 text-center print:hidden">إجراءات</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {payrollData.filter(r => r.employeeName.includes(searchTerm)).map((record, idx) => (
                     <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition whitespace-nowrap group">
                        <td className="p-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                        <td className="p-4">
                           <div className="font-bold text-slate-800 dark:text-white">{record.employeeName}</div>
                           <div className="text-[10px] text-slate-500 font-mono">{record.financialNumber}</div>
                        </td>
                        <td className="p-4">
                           <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                             د {record.grade} - م {record.step}
                           </span>
                        </td>
                        <td className="p-4 font-mono font-bold bg-blue-50/30 dark:bg-blue-900/5 text-slate-800 dark:text-white">{record.nominalSalary.toLocaleString()}</td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{record.allowanceCertificate.toLocaleString()}</td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{record.allowanceFamily.toLocaleString()}</td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{record.allowanceRisk.toLocaleString()}</td>
                        <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                           {(record.allowancePosition + record.allowanceTransport + record.allowanceOther).toLocaleString()}
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/5">{record.totalEarnings.toLocaleString()}</td>
                        <td className="p-4 font-mono text-red-500">{record.deductionRetirement.toLocaleString()}</td>
                        <td className="p-4 font-mono text-red-500">
                           {(record.deductionTax + record.deductionAbsence + record.deductionLoan).toLocaleString()}
                        </td>
                        <td className="p-4 font-mono font-black text-slate-900 dark:text-white bg-slate-100/50 dark:bg-slate-700/30 border-r border-l border-slate-200 dark:border-slate-700 text-lg">
                           {record.netSalary.toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                           <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                              record.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                              record.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                           }`}>
                              {record.status === 'PAID' ? 'تم الصرف' : record.status === 'APPROVED' ? 'مصدق' : 'مسودة'}
                           </span>
                        </td>
                        <td className="p-4 text-center print:hidden">
                           <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(record.id)} className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-lg hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition shadow-sm">
                                 <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDelete(record.id)} className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-lg hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition shadow-sm">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
            <div>عرض {payrollData.length} من أصل 1240 قيد</div>
            <div className="flex gap-2">
               <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300">السابق</button>
               <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300">التالي</button>
            </div>
         </div>
      </div>
    </div>
  );
};
