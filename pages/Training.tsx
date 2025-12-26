
import React, { useState } from 'react';
import { 
  BookOpen, Users, Video, Award, Clock, Calendar, CheckCircle, 
  PlayCircle, FileText, Plus, Search, Filter, Monitor, Check, 
  X, AlertCircle, BarChart2, Star, Download, Printer, Share2, Layers,
  Trash2, Edit3
} from 'lucide-react';
import { 
  TrainingProgram, Exam, Question, Certificate 
} from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// --- MOCK DATA ---
const INITIAL_PROGRAMS: TrainingProgram[] = [
  {
    id: 'TR-101', title: 'إدارة المشاريع الاحترافية PMP', code: 'PMP-24', type: 'External', 
    trainer: 'د. سامي العلي', startDate: '2024-11-10', endDate: '2024-11-20', 
    durationHours: 35, location: 'مركز التدريب الحكومي', seats: 25, enrolled: 20, status: 'Upcoming', cost: 750000
  },
  {
    id: 'TR-102', title: 'الأمن السيبراني للموظفين', code: 'CYBER-01', type: 'E-Learning', 
    trainer: 'م. سارة حسن', startDate: '2024-10-01', endDate: '2024-12-01', 
    durationHours: 15, location: 'Online', seats: 100, enrolled: 85, status: 'Active', cost: 0,
    modules: [
      { id: 'm1', title: 'مقدمة في أمن المعلومات', type: 'Video', durationMin: 20, url: '#' },
      { id: 'm2', title: 'سياسات كلمة المرور', type: 'PDF', durationMin: 10, url: '#' },
      { id: 'm3', title: 'كشف التصيد الإلكتروني', type: 'Video', durationMin: 15, url: '#' },
    ],
    examId: 'EX-CYBER'
  },
  {
    id: 'TR-103', title: 'القيادة الإدارية الحديثة', code: 'MGT-50', type: 'Internal', 
    trainer: 'أ. حيدر محمد', startDate: '2024-09-15', endDate: '2024-09-18', 
    durationHours: 12, location: 'قاعة الاجتماعات', seats: 30, enrolled: 30, status: 'Completed', cost: 150000
  }
];

const MOCK_EXAM: Exam = {
  id: 'EX-CYBER', courseId: 'TR-102', title: 'الاختبار النهائي - الأمن السيبراني', 
  durationMin: 30, passingScore: 70, totalMarks: 100,
  questions: [
    { id: 'q1', text: 'ما هو الهدف الرئيسي من التصيد الإلكتروني؟', type: 'MCQ', options: ['سرقة المعلومات', 'تسريع الإنترنت', 'تحديث النظام', 'لا شيء مما سبق'], correctAnswer: 0, marks: 20 },
    { id: 'q2', text: 'يجب تغيير كلمة المرور كل 3 أشهر على الأقل.', type: 'TrueFalse', options: ['صح', 'خطأ'], correctAnswer: 0, marks: 20 },
    { id: 'q3', text: 'أي مما يلي يعتبر كلمة مرور قوية؟', type: 'MCQ', options: ['123456', 'Password', 'Tr@in!ng2024', 'Admin'], correctAnswer: 2, marks: 20 },
    { id: 'q4', text: 'المصادقة الثنائية تزيد من أمان الحساب.', type: 'TrueFalse', options: ['صح', 'خطأ'], correctAnswer: 0, marks: 20 },
    { id: 'q5', text: 'يجب قفل الشاشة عند مغادرة المكتب.', type: 'TrueFalse', options: ['صح', 'خطأ'], correctAnswer: 0, marks: 20 },
  ]
};

const STATS = [
  { title: 'الدورات النشطة', value: 5, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
  { title: 'إجمالي المتدربين', value: 145, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  { title: 'ساعات التدريب', value: 1200, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { title: 'شهادات ممنوحة', value: 85, icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' },
];

const ProgramModal = ({ isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({ title: '', trainer: '', durationHours: 0, location: '', type: 'Internal' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">إضافة دورة جديدة</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition"><X size={28} /></button>
        </div>
        <div className="p-8 space-y-5">
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase">عنوان الدورة</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none" />
           </div>
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase">المدرب</label>
              <input type="text" value={formData.trainer} onChange={e => setFormData({...formData, trainer: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none" />
           </div>
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase">المدة (ساعات)</label>
              <input type="number" value={formData.durationHours} onChange={e => setFormData({...formData, durationHours: Number(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none" />
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

const ExamInterface = ({ exam, onFinish }: { exam: Exam, onFinish: (score: number) => void }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(exam.durationMin * 60);
  
  React.useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    let score = 0;
    exam.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score += q.marks;
    });
    onFinish(score);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl h-[90vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-100 dark:bg-slate-900 p-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{exam.title}</h2>
            <p className="text-sm text-slate-500">مجموع الدرجات: {exam.totalMarks}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-mono font-bold text-xl flex items-center gap-2">
               <Clock size={20} />
               {formatTime(timeLeft)}
             </div>
             <button onClick={handleSubmit} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">
               تسليم الاختبار
             </button>
          </div>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           {exam.questions.map((q, idx) => (
             <div key={q.id} className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-4 flex items-start gap-3">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">{idx + 1}</span>
                  {q.text}
                </h3>
                
                <div className="space-y-3 pr-11">
                  {q.type === 'MCQ' || q.type === 'TrueFalse' ? (
                    q.options?.map((opt, optIdx) => (
                      <label key={optIdx} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        answers[q.id] === optIdx 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}>
                         <input 
                           type="radio" 
                           name={q.id} 
                           value={optIdx} 
                           checked={answers[q.id] === optIdx}
                           onChange={() => setAnswers(prev => ({...prev, [q.id]: optIdx}))}
                           className="w-5 h-5 text-blue-600"
                         />
                         <span className="font-medium text-slate-700 dark:text-slate-300">{opt}</span>
                      </label>
                    ))
                  ) : (
                    <textarea 
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="اكتب إجابتك هنا..."
                      onChange={(e) => setAnswers(prev => ({...prev, [q.id]: e.target.value}))}
                    />
                  )}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const CertificateView = ({ cert, onClose }: { cert: Certificate, onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div className="bg-white w-[297mm] h-[210mm] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center p-20 transform scale-75 origin-center">
       {/* Border & Decorations */}
       <div className="absolute inset-4 border-4 border-double border-slate-800"></div>
       <div className="absolute top-10 left-10 w-32 h-32 opacity-10"><Award size={128} /></div>
       <div className="absolute bottom-10 right-10 w-32 h-32 opacity-10"><Award size={128} /></div>

       {/* Header */}
       <h1 className="text-6xl font-black font-serif text-slate-900 mb-4 uppercase tracking-widest">Certificate</h1>
       <h2 className="text-3xl font-serif text-slate-600 mb-12 uppercase tracking-wide">Of Completion</h2>

       {/* Body */}
       <p className="text-xl text-slate-500 italic mb-4">This certifies that</p>
       <h3 className="text-5xl font-bold text-blue-800 mb-8 border-b-2 border-slate-300 pb-4 px-12 inline-block">{cert.traineeName}</h3>
       
       <p className="text-xl text-slate-500 italic mb-4">Has successfully completed the training program</p>
       <h4 className="text-3xl font-bold text-slate-800 mb-12">{cert.courseTitle}</h4>

       {/* Details */}
       <div className="flex justify-between w-full max-w-3xl mt-12 px-12">
          <div className="text-center">
             <div className="w-48 border-b border-slate-800 mb-2"></div>
             <p className="font-bold text-slate-600">Director Signature</p>
          </div>
          <div className="text-center">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${cert.qrCode}`} alt="QR" className="w-24 h-24 mx-auto mb-2" />
             <p className="font-mono text-xs text-slate-400">{cert.id}</p>
          </div>
          <div className="text-center">
             <div className="w-48 border-b border-slate-800 mb-2"></div>
             <p className="font-bold text-slate-600">Date: {cert.issueDate}</p>
          </div>
       </div>

       {/* Close Button (Screen Only) */}
       <button onClick={onClose} className="absolute top-4 right-4 bg-slate-900 text-white p-2 rounded-full hover:bg-red-600 transition print:hidden">
         <X size={24} />
       </button>
    </div>
  </div>
);

export const Training = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'learning' | 'certs'>('dashboard');
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [showCert, setShowCert] = useState<Certificate | null>(null);
  const [programs, setPrograms] = useState<TrainingProgram[]>(INITIAL_PROGRAMS);
  const [showProgramModal, setShowProgramModal] = useState(false);

  const handleExamFinish = (score: number) => {
    setActiveExam(null);
    if (score >= MOCK_EXAM.passingScore) {
       setShowCert({
         id: `CERT-${Date.now()}`,
         traineeName: 'أحمد علي',
         courseTitle: 'الأمن السيبراني للموظفين',
         issueDate: new Date().toLocaleDateString('en-GB'),
         grade: score,
         qrCode: 'https://smarthr.iq/verify/CERT-123'
       });
    } else {
       alert(`للأسف، لم تتجاوز درجة النجاح. درجتك: ${score}`);
    }
  };

  const handleAddProgram = (data: any) => {
    const newProg: TrainingProgram = {
      id: `TR-${Date.now()}`,
      code: `CODE-${Date.now()}`,
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      seats: 20,
      enrolled: 0,
      status: 'Upcoming',
      cost: 0,
      ...data
    };
    setPrograms([...programs, newProg]);
  };

  const handleDeleteProgram = (id: string) => {
    if (window.confirm('هل تريد حذف هذه الدورة؟')) {
      setPrograms(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-[1920px] mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
         <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <BookOpen className="text-blue-600 w-8 h-8" />
              التدريب والتطوير
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              إدارة برامج التدريب، الاختبارات الإلكترونية، والشهادات
            </p>
         </div>

         <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
           {[
             { id: 'dashboard', label: 'الرئيسية', icon: BarChart2 },
             { id: 'courses', label: 'إدارة الدورات', icon: Layers },
             { id: 'learning', label: 'منصتي التعليمية', icon: Monitor },
             { id: 'certs', label: 'الشهادات', icon: Award },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                 activeTab === tab.id 
                   ? 'bg-slate-900 text-white shadow-md' 
                   : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
               }`}
             >
               <tab.icon size={18} />
               {tab.label}
             </button>
           ))}
         </div>
      </div>

      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon size={32} />
                   </div>
                   <div>
                      <p className="text-slate-500 text-sm font-bold mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</h3>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h3 className="font-bold text-lg mb-6">ساعات التدريب حسب القسم</h3>
                 <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={[
                         { name: 'IT', hours: 450 }, { name: 'HR', hours: 300 }, 
                         { name: 'Finance', hours: 250 }, { name: 'Admin', hours: 200 }
                       ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                          <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h3 className="font-bold text-lg mb-4">الدورات القادمة</h3>
                 <div className="space-y-4">
                    {programs.filter(p => p.status === 'Upcoming').map(prog => (
                       <div key={prog.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex flex-col items-center justify-center font-bold">
                             <span className="text-xs">{prog.startDate.split('-')[1]}</span>
                             <span className="text-lg">{prog.startDate.split('-')[2]}</span>
                          </div>
                          <div className="flex-1">
                             <h4 className="font-bold text-slate-900 dark:text-white">{prog.title}</h4>
                             <p className="text-xs text-slate-500">{prog.trainer} • {prog.location}</p>
                          </div>
                          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">تسجيل</button>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* COURSES MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fade-in">
           <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">قائمة البرامج التدريبية</h2>
              <button onClick={() => setShowProgramModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                 <Plus size={20} /> دورة جديدة
              </button>
           </div>
           
           <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-right">
                 <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                       <th className="p-5">اسم الدورة</th>
                       <th className="p-5">المدرب</th>
                       <th className="p-5">التاريخ</th>
                       <th className="p-5 text-center">المقاعد</th>
                       <th className="p-5 text-center">الحالة</th>
                       <th className="p-5 text-center">إجراءات</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {programs.map(prog => (
                       <tr key={prog.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-5 font-bold text-slate-900 dark:text-white">{prog.title}</td>
                          <td className="p-5 text-slate-500">{prog.trainer}</td>
                          <td className="p-5 text-sm font-mono text-slate-500">{prog.startDate}</td>
                          <td className="p-5 text-center">
                             <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold text-xs">{prog.enrolled}/{prog.seats}</span>
                          </td>
                          <td className="p-5 text-center">
                             <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                prog.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                                prog.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'
                             }`}>{prog.status}</span>
                          </td>
                          <td className="p-5 text-center">
                             <button onClick={() => handleDeleteProgram(prog.id)} className="p-2 text-slate-400 hover:text-red-500 transition"><Trash2 size={18} /></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* LEARNING HUB (LMS) */}
      {activeTab === 'learning' && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative group">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <button 
                       onClick={() => window.open('https://www.youtube.com/watch?v=XjTHXwYofVM&list=PL5LpARb4uOiow3_M-28_OWjmkdZrxSdnF', '_blank')}
                       className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:scale-110 transition"
                     >
                        <PlayCircle size={48} fill="white" className="opacity-90" />
                     </button>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                     <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold mb-2 inline-block">فيديو 1</span>
                     <h3 className="text-2xl font-bold text-white">مقدمة في أمن المعلومات</h3>
                  </div>
               </div>

               <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">محتوى الدورة: الأمن السيبراني</h3>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                           <CheckCircle className="text-blue-600" size={20} />
                           <div>
                              <p className="font-bold text-sm text-blue-900 dark:text-blue-100">1. مقدمة في أمن المعلومات</p>
                              <p className="text-xs text-blue-500">فيديو • 20 دقيقة</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => window.open('https://www.youtube.com/watch?v=XjTHXwYofVM&list=PL5LpARb4uOiow3_M-28_OWjmkdZrxSdnF', '_blank')}
                          className="text-xs bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                        >
                          مشاهدة
                        </button>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                           <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                           <div>
                              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">2. سياسات كلمة المرور</p>
                              <p className="text-xs text-slate-500">ملف PDF • 10 دقائق</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
                          className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                        >
                          بدء
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <h3 className="text-2xl font-black mb-2">الاختبار النهائي</h3>
                  <p className="text-indigo-200 text-sm mb-8">يجب إكمال جميع الوحدات لفتح الاختبار</p>
                  <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 border-4 border-indigo-400">
                     <span className="text-3xl font-black">70%</span>
                  </div>
                  <button 
                    onClick={() => setActiveExam(MOCK_EXAM)}
                    className="w-full py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
                  >
                     بدء الاختبار الآن
                  </button>
               </div>
               
               <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold mb-4">موارد إضافية</h3>
                  <div className="space-y-3">
                     {['دليل المتدرب.pdf', 'السياسات الأمنية.docx'].map((f, i) => (
                        <div 
                          key={i} 
                          onClick={() => window.open(f.endsWith('.pdf') ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : '#', '_blank')}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition"
                        >
                           <FileText size={20} className="text-slate-400" />
                           <span className="text-sm font-medium">{f}</span>
                           <Download size={16} className="ml-auto text-slate-400" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* CERTIFICATES */}
      {activeTab === 'certs' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
             <div 
               onClick={() => setShowCert({
                 id: 'CERT-OLD-001', traineeName: 'أحمد علي', courseTitle: 'إدارة المشاريع الاحترافية',
                 issueDate: '2023-12-15', grade: 95, qrCode: 'sample'
               })}
               className="bg-white dark:bg-slate-800 p-1 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition cursor-pointer group"
             >
                <div className="bg-slate-100 dark:bg-slate-900 rounded-[20px] p-8 text-center relative overflow-hidden border border-dashed border-slate-300 dark:border-slate-700">
                   <Award size={48} className="mx-auto text-amber-500 mb-4" />
                   <h3 className="font-serif font-bold text-xl text-slate-800 dark:text-white mb-1">شهادة مشاركة</h3>
                   <p className="text-sm text-slate-500">إدارة المشاريع الاحترافية</p>
                   <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between text-xs text-slate-400">
                      <span>2023-12-15</span>
                      <span>Grade: 95%</span>
                   </div>
                </div>
             </div>
         </div>
      )}

      {/* --- OVERLAYS --- */}
      <AnimatePresence>
         {showProgramModal && <ProgramModal isOpen={showProgramModal} onClose={() => setShowProgramModal(false)} onSave={handleAddProgram} />}
         {activeExam && <ExamInterface exam={activeExam} onFinish={handleExamFinish} />}
         {showCert && <CertificateView cert={showCert} onClose={() => setShowCert(null)} />}
      </AnimatePresence>

    </div>
  );
};
