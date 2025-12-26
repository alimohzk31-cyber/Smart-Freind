
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar, Topbar } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { HRFunctions } from './pages/HRFunctions';
import { Finance } from './pages/Finance';
import { Welcome } from './pages/Welcome';
import { Recruitment } from './pages/Recruitment';
import { Accounting } from './pages/Accounting';
import { Employees } from './pages/Employees';
import { Leaves } from './pages/Leaves';
import { Documents } from './pages/Documents';
import { Training } from './pages/Training';
import { Settings } from './pages/Settings';
import { Cashier } from './pages/Cashier';
import { useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { direction } = useLanguage();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  if (showWelcome) {
    return <Welcome onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div 
      dir={direction} 
      className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans overflow-x-hidden"
    >
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} closeMobile={closeMobileSidebar} />
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen && window.innerWidth >= 1024 ? 'ltr:lg:ml-72 rtl:lg:mr-72' : ''}`}>
        <Topbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 relative p-2 md:p-0 overflow-x-hidden print:p-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/hr-ai" element={<HRFunctions />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/training" element={<Training />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
