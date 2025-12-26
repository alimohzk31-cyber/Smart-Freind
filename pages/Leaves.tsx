
import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle, XCircle, AlertCircle, 
  FileText, Search, Plus, Filter, UserCheck, Timer, Fingerprint 
} from 'lucide-react';
import { LeaveRequest, AttendanceRecord, LeaveType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const ATTENDANCE_LOGS: AttendanceRecord[] = [
  { id: 'ATT-001', employeeId: '10203', date: '2024-10-25', checkIn: '07:55', checkOut: '14:30', status: 'PRESENT', overtimeHours: 0.5, deviceSource: 'Fingerprint_Main_Gate' },
  { id: 'ATT-002', employeeId: '10204', date: '2024-10-25', checkIn: '08:15', checkOut: '14:00', status: 'LATE', overtimeHours: 0, deviceSource: 'Fingerprint_Main_Gate' },
  { id: 'ATT-003', employeeId: '10205', date: '2024-10-25', checkIn: '-', checkOut: '-', status: 'ABSENT', overtimeHours: 0, deviceSource: 'Manual_Entry' },
];

const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'LR-101', employeeId: '10204', employeeName: 'زينب محمد كريم', type: 'SICK', startDate: '2024-10-28', endDate: '2024-10-30', days: 3, status: 'PENDING', reason: 'ظرف صحي طارئ' },
  { id: 'LR-102', employeeId: '10203', employeeName: 'أحمد كاظم حسن', type: 'REGULAR', startDate: '2024-11-01', endDate: '2024-11-05', days: 5, status: 'APPROVED', approvedBy: 'المدير العام' },
];

export const Leaves = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves'>('leaves');
  const [showRequestModal, setShowRequestModal] = useState(false);

  return (
    <div className="p-6 space-y-8 max-w-[1920px] mx-auto font-sans">
       
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
               <Clock className="text-purple-600 w-10 h-10" />
               الزمن والدوام
             </h1>
             <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
               نظام البصمة الإلكترونية وإدارة الإجازات
             </p>
          </div>
          
          <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
             <button 
               onClick={() => setActiveTab('leaves')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'leaves' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
             >
               الإجازات والطلبات
             </button>
             <button 
               onClick={() => setActiveTab('attendance')}
               className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'attendance' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
             >
               سجل الحضور (البصمة)
             </button>
          </div>
       </div>

       {activeTab === 'leaves' && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                   <h3 className="font-bold text-lg mb-1">رصيد الإجازات</h3>
                   <p className="text-blue-100 text-sm mb-6">لعام 2024</p>
                   <div className="flex justify-between text-center">
                      <div>
                         <p className="text-2xl font-black">21</p>
                         <p className="text-xs text-blue-200">اعتيادية</p>
                      </div>
                      <div className="w-px bg-white/20"></div>
                      <div>
                         <p className="text-2xl font-black">30</p>
                         <p className="text-xs text-blue-200">مرضية</p>
                      </div>
                      <div className="w-px bg-white/20"></div>
                      <div>
                         <p className="text-2xl font-black">5</p>
                         <p className="text-xs text-blue-200">زمنية</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center items-center text-center">
                   <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-full flex items-center justify-center mb-4">
                      <Plus size={32} />
                   </div>
                   <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">طلب إجازة جديد</h3>
                   <p className="text-sm text-slate-500 mb-6">تقديم طلب إجازة اعتيادية أو مرضية للموافقة</p>
                   <button 
                     onClick={() => setShowRequestModal(true)}
                     className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition shadow-lg shadow-purple-500/30"
                   >
                     بدء الطلب
                   </button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                   <h3 className="font-bold text-slate-800 dark:text-white mb-4">حالة الطلبات الأخيرة</h3>
                   <div className="space-y-4">
                      {LEAVE_REQUESTS.map(req => (
                         <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div>
                               <p className="font-bold text-sm text-slate-800 dark:text-white">{req.type === 'SICK' ? 'إجازة مرضية' : 'إجازة اعتيادية'}</p>
                               <p className="text-xs text-slate-500">{req.days} يوم • {req.startDate}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                               req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                               req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                               {req.status === 'APPROVED' ? 'مقبول' : 'قيد الانتظار'}
                            </span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       )}

       {activeTab === 'attendance' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-fade-in">
             <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg flex items-center gap-2">
                   <Fingerprint className="text-blue-600" /> سجل البصمة اليومي
                </h3>
                <div className="flex gap-2">
                   <input type="date" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none" />
                   <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg">
                      <Search size={16} /> عرض
                   </button>
                </div>
             </div>
             <table className="w-full text-right text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                   <tr>
                      <th className="p-4">الموظف</th>
                      <th className="p-4">التاريخ</th>
                      <th className="p-4">وقت الحضور</th>
                      <th className="p-4">وقت الانصراف</th>
                      <th className="p-4">الساعات</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">المصدر</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {ATTENDANCE_LOGS.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                         <td className="p-4 font-bold text-slate-800 dark:text-white">
                            {log.employeeId === '10203' ? 'أحمد كاظم حسن' : log.employeeId === '10204' ? 'زينب محمد' : 'حسين علي'}
                         </td>
                         <td className="p-4 text-slate-500 font-mono">{log.date}</td>
                         <td className="p-4 font-mono font-bold text-green-600">{log.checkIn}</td>
                         <td className="p-4 font-mono font-bold text-red-500">{log.checkOut}</td>
                         <td className="p-4 font-mono text-slate-600 dark:text-slate-400">6.5</td>
                         <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                               log.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                               log.status === 'LATE' ? 'bg-amber-100 text-amber-700' :
                               'bg-red-100 text-red-700'
                            }`}>
                               {log.status === 'PRESENT' ? 'حضور' : log.status === 'LATE' ? 'متأخر' : 'غائب'}
                            </span>
                         </td>
                         <td className="p-4 text-xs text-slate-400">{log.deviceSource}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       )}

       {/* Leave Request Modal */}
       <AnimatePresence>
          {showRequestModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700"
                >
                   <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">تقديم طلب إجازة</h3>
                   <div className="space-y-4">
                      <div>
                         <label className="text-sm font-bold text-slate-500 mb-1 block">نوع الإجازة</label>
                         <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                            <option value="REGULAR">إجازة اعتيادية</option>
                            <option value="SICK">إجازة مرضية</option>
                            <option value="TIME">إجازة زمنية</option>
                         </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm font-bold text-slate-500 mb-1 block">من تاريخ</label>
                            <input type="date" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                         </div>
                         <div>
                            <label className="text-sm font-bold text-slate-500 mb-1 block">إلى تاريخ</label>
                            <input type="date" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                         </div>
                      </div>
                      <div>
                         <label className="text-sm font-bold text-slate-500 mb-1 block">السبب</label>
                         <textarea className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none h-24 resize-none" placeholder="يرجى ذكر سبب الإجازة..."></textarea>
                      </div>
                   </div>
                   <div className="flex gap-3 mt-8">
                      <button onClick={() => setShowRequestModal(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 transition">إلغاء</button>
                      <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">إرسال الطلب</button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>

    </div>
  );
};
