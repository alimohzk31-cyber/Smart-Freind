
import React, { useState } from 'react';
import { 
  Folder, FileText, Search, Upload, MoreVertical, Shield, Clock, 
  FileCheck, Image, Archive, Plus, Filter, LayoutGrid, List,
  Stamp, Trash2, Download, Eye, ExternalLink, ShieldCheck, ChevronRight,
  Award, RefreshCw, Settings, X, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ORDER_CATEGORIES = [
  { id: 'all', name: 'كافة الوثائق', icon: Archive, color: 'text-slate-500' },
  { id: 'hiring', name: 'أوامر التعيين', icon: Stamp, color: 'text-emerald-500' },
  { id: 'promo', name: 'أوامر الترفيع', icon: Award, color: 'text-amber-500' },
  { id: 'transfer', name: 'أوامر النقل', icon: RefreshCw, color: 'text-blue-500' },
  { id: 'legal', name: 'الكتب القانونية', icon: Shield, color: 'text-red-500' },
];

const INITIAL_DOCUMENTS = [
  { id: 1, name: 'أمر إداري 1520 - ترفيع دورة تشرين.pdf', type: 'PDF', size: '2.5 MB', date: '2024/10/25', category: 'promo', status: 'SIGNED' },
  { id: 2, name: 'عقد عمل الموظف - أحمد كاظم.docx', type: 'DOCX', size: '1.1 MB', date: '2024/10/24', category: 'hiring', status: 'ARCHIVED' },
  { id: 3, name: 'بطاقة سكن - زينب محمد.jpg', type: 'IMG', size: '4.2 MB', date: '2024/10/22', category: 'legal', status: 'SIGNED' },
  { id: 4, name: 'كتاب وزارة المالية 990 - المباشرة.pdf', type: 'PDF', size: '1.8 MB', date: '2024/10/20', category: 'hiring', status: 'SIGNED' },
  { id: 5, name: 'أمر نقل داخلي - رقم 442.pdf', type: 'PDF', size: '1.5 MB', date: '2024/10/18', category: 'transfer', status: 'SIGNED' },
];

const DocumentModal = ({ isOpen, onClose, initialData, onSave }: any) => {
  const [formData, setFormData] = useState(initialData || { name: '', category: 'all', type: 'PDF', status: 'DRAFT' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {initialData ? 'تعديل وثيقة' : 'أرشفة وثيقة جديدة'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition"><X size={28} /></button>
        </div>
        <div className="p-8 space-y-5">
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-widest">اسم الوثيقة / الرقم الإداري</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-amber-500/20" 
              />
           </div>
           <div>
              <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-widest">التصنيف</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                 {ORDER_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
           </div>
           {!initialData && (
             <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                <Upload size={32} className="mx-auto mb-2" />
                <p className="text-sm font-bold">اضغط لرفع الملف (PDF/IMG)</p>
             </div>
           )}
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-950 flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold border border-slate-200 dark:border-slate-700">إلغاء</button>
           <button onClick={() => { onSave(formData); onClose(); }} className="flex-1 py-4 bg-amber-600 text-white rounded-2xl font-black shadow-xl hover:bg-amber-700 transition">حفظ</button>
        </div>
      </motion.div>
    </div>
  );
};

export const Documents = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [docs, setDocs] = useState(INITIAL_DOCUMENTS);
  const [docModal, setDocModal] = useState({ isOpen: false, data: null as any });

  const filteredDocs = docs.filter(doc => 
    (activeCategory === 'all' || doc.category === activeCategory) &&
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('⚠️ هل أنت متأكد من حذف هذه الوثيقة من الأرشيف نهائياً؟')) {
      setDocs(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleStatusChange = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'SIGNED' ? 'ARCHIVED' : 'SIGNED' } : d));
  };

  const handleSaveDocument = (data: any) => {
    if (docModal.data) {
      setDocs(prev => prev.map(d => d.id === docModal.data.id ? { ...d, ...data } : d));
    } else {
      setDocs(prev => [{ id: Date.now(), ...data, date: new Date().toLocaleDateString('en-CA'), size: '1.0 MB', status: 'DRAFT' }, ...prev]);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1920px] mx-auto font-sans h-[calc(100vh-80px)] flex flex-col overflow-hidden">
       
       {/* Header Strip */}
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shrink-0">
          <div>
             <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
               <div className="p-3 bg-amber-600 rounded-2xl shadow-xl shadow-amber-600/20 text-white">
                  <Archive size={28} md:size={32} />
               </div>
               مركز الأرشيف والوثائق
             </h1>
             <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-lg font-bold">
                Document Management System (DMS)
             </p>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
             <button onClick={() => setDocModal({ isOpen: true, data: null })} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-amber-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-amber-700 transition active:scale-95">
                <Upload size={24} /> أرشفة وثيقة
             </button>
             <button onClick={() => setDocModal({ isOpen: true, data: null })} className="flex items-center justify-center p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-primary transition shadow-md">
                <Plus size={24} />
             </button>
          </div>
       </div>

       {/* Main Dashboard Layout */}
       <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 shrink-0 space-y-3">
             <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto lg:overflow-visible">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 hidden lg:block">التصنيفات الرسمية</p>
                <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
                   {ORDER_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                           activeCategory === cat.id 
                             ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                             : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                         <div className="flex items-center gap-3">
                            <cat.icon size={18} className={activeCategory === cat.id ? '' : cat.color} />
                            <span className="font-black text-sm whitespace-nowrap">{cat.name}</span>
                         </div>
                         {activeCategory === cat.id && <ChevronRight size={14} className="rtl:rotate-180 hidden lg:block" />}
                      </button>
                   ))}
                </div>
             </div>

             <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group hidden lg:block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h4 className="text-sm font-black mb-1">المساحة السحابية</h4>
                <div className="w-full bg-white/10 h-2 rounded-full mb-2 mt-4 overflow-hidden">
                   <div className="bg-amber-500 h-full w-[65%]" />
                </div>
                <div className="flex justify-between text-[10px] font-black">
                   <span>650 GB مستخدم</span>
                   <span className="text-amber-500">1 TB</span>
                </div>
             </div>
          </div>

          {/* Documents Content */}
          <div className="flex-1 flex flex-col min-w-0">
             
             {/* Toolbar */}
             <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                   <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input 
                     type="text" 
                     placeholder="بحث ذكي في الأرشيف..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-6 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/20"
                   />
                </div>
                <div className="flex gap-2 self-end md:self-auto">
                   <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                      <List size={20} />
                   </button>
                   <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                      <LayoutGrid size={20} />
                   </button>
                </div>
             </div>

             {/* Documents Display */}
             <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-10">
                {viewMode === 'list' ? (
                   <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-x-auto shadow-sm">
                      <table className="w-full text-right min-w-[800px]">
                         <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                            <tr>
                               <th className="p-5">اسم الوثيقة / الرقم الإداري</th>
                               <th className="p-5 text-center">التصنيف</th>
                               <th className="p-5 text-center">التاريخ</th>
                               <th className="p-5 text-center">الحالة</th>
                               <th className="p-5 text-center">إجراءات</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredDocs.map(doc => (
                               <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer group">
                                  <td className="p-5">
                                     <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${doc.type === 'PDF' ? 'bg-red-50 text-red-500' : doc.type === 'IMG' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-500'}`}>
                                           <FileText size={24} />
                                        </div>
                                        <div>
                                           <p className="font-black text-slate-800 dark:text-white group-hover:text-amber-600 transition-colors leading-tight">{doc.name}</p>
                                           <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase">{doc.size} • {doc.type}</p>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="p-5 text-center">
                                     <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                        {doc.category}
                                     </span>
                                  </td>
                                  <td className="p-5 text-center font-mono font-black text-slate-500 text-xs">{doc.date}</td>
                                  <td className="p-5 text-center">
                                     <button onClick={(e) => { e.stopPropagation(); handleStatusChange(doc.id); }} className="flex items-center justify-center gap-1.5 mx-auto">
                                        <div className={`w-2 h-2 rounded-full ${doc.status === 'SIGNED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{doc.status}</span>
                                     </button>
                                  </td>
                                  <td className="p-5">
                                     <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                                        <button className="p-2 text-slate-400 hover:text-primary transition"><Eye size={18} /></button>
                                        <button onClick={() => setDocModal({ isOpen: true, data: doc })} className="p-2 text-slate-400 hover:text-blue-600 transition"><Settings size={18} /></button>
                                        <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-400 hover:text-red-500 transition"><Trash2 size={18} /></button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredDocs.map(doc => (
                         <div key={doc.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative">
                            <div className="flex justify-between items-start mb-6">
                               <div className={`p-4 rounded-2xl ${doc.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                  <FileText size={32} />
                               </div>
                               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setDocModal({ isOpen: true, data: doc })} className="p-2 text-slate-300 hover:text-blue-500"><Settings size={18} /></button>
                                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                               </div>
                            </div>
                            <h4 className="font-black text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight h-10">{doc.name}</h4>
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                               <span className="text-[10px] font-black text-slate-400 uppercase">{doc.date}</span>
                               <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">{doc.category}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          </div>
       </div>

       <AnimatePresence>
          {docModal.isOpen && (
             <DocumentModal 
               isOpen={docModal.isOpen} 
               onClose={() => setDocModal({ isOpen: false, data: null })} 
               initialData={docModal.data}
               onSave={handleSaveDocument}
             />
          )}
       </AnimatePresence>
    </div>
  );
};
