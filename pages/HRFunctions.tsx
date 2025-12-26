import React, { useState } from 'react';
import { Bot, FileText, UserCheck, MessageSquare, PenTool } from 'lucide-react';
import { generateJobDescription, generateInterviewQuestions, analyzeResume, draftPolicy, createForm } from '../services/geminiService';

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
    }`}
  >
    <Icon size={18} />
    <span className="font-medium">{label}</span>
  </button>
);

export const HRFunctions = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  // Inputs
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [dept, setDept] = useState('');
  const [level, setLevel] = useState('');
  const [industry, setIndustry] = useState('');
  const [policyTopic, setPolicyTopic] = useState('');

  const handleAction = async () => {
    setLoading(true);
    setResult('');
    let res = '';
    
    try {
        switch (activeTab) {
        case 'resume':
            res = await analyzeResume(resumeText, jobTitle);
            break;
        case 'jd':
            res = await generateJobDescription(jobTitle, dept, level);
            break;
        case 'interview':
            res = await generateInterviewQuestions(jobTitle, industry || 'عام');
            break;
        case 'policy':
            res = await draftPolicy(policyTopic);
            break;
        case 'form':
            res = await createForm('إنذار نهائي', 'محمد علي', 'بسبب الغياب المتكرر لمدة 3 أيام'); // Mock inputs for demo
            break;
        }
        setResult(res);
    } catch (e) {
        setResult("حدث خطأ غير متوقع.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Bot className="text-blue-500" />
          مساعد الموارد البشرية الذكي
        </h2>
        <p className="text-slate-500 dark:text-slate-400">استخدم الذكاء الاصطناعي لإنجاز مهام HR المعقدة في ثوانٍ.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <TabButton active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} icon={UserCheck} label="تحليل السيرة الذاتية" />
        <TabButton active={activeTab === 'jd'} onClick={() => setActiveTab('jd')} icon={FileText} label="الوصف الوظيفي" />
        <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={MessageSquare} label="أسئلة المقابلة" />
        <TabButton active={activeTab === 'policy'} onClick={() => setActiveTab('policy')} icon={PenTool} label="صياغة السياسات" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">إدخال البيانات</h3>
          
          <div className="space-y-4">
            {activeTab === 'resume' && (
              <>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المسمى الوظيفي المستهدف</label>
                    <input 
                        type="text" 
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="مثال: مهندس برمجيات"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نص السيرة الذاتية</label>
                  <textarea 
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full h-40 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="الصق نص السيرة الذاتية هنا..."
                  ></textarea>
                </div>
              </>
            )}

            {activeTab === 'jd' && (
              <>
                <input 
                    type="text" 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="المسمى الوظيفي"
                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" 
                />
                <input 
                    type="text" 
                    value={dept} 
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="القسم"
                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" 
                />
                <select 
                    value={level} 
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                    <option value="">اختر المستوى</option>
                    <option value="Junior">مبتدئ</option>
                    <option value="Mid-Level">متوسط</option>
                    <option value="Senior">خبير</option>
                    <option value="Manager">مدير</option>
                </select>
              </>
            )}

            {activeTab === 'interview' && (
                 <>
                 <input 
                     type="text" 
                     value={jobTitle} 
                     onChange={(e) => setJobTitle(e.target.value)}
                     placeholder="المسمى الوظيفي"
                     className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" 
                 />
                 <input 
                     type="text" 
                     value={industry} 
                     onChange={(e) => setIndustry(e.target.value)}
                     placeholder="قطاع العمل (مثال: تكنولوجيا، بنوك، صحة)"
                     className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" 
                 />
               </>
            )}

             {activeTab === 'policy' && (
                 <input 
                     type="text" 
                     value={policyTopic} 
                     onChange={(e) => setPolicyTopic(e.target.value)}
                     placeholder="موضوع السياسة (مثال: العمل عن بعد، استخدام السيارات)"
                     className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" 
                 />
            )}

            <button 
                onClick={handleAction}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري المعالجة...
                    </>
                ) : (
                    <>
                        <Bot size={20} />
                        توليد النتائج
                    </>
                )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 h-[600px] overflow-y-auto">
            {result ? (
                <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                    <h3 className="text-xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">النتائج المولدة:</h3>
                    {result}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Bot size={48} className="mb-4 opacity-50" />
                    <p>النتائج ستظهر هنا بعد المعالجة...</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};