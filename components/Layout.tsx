
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Banknote, Settings, Search, Menu, 
  Bot, FileText, BookOpen, Calendar, QrCode, LogOut, ChevronDown, 
  Calculator, UserPlus, Briefcase, LayoutGrid, DollarSign, Globe, Palette, Check,
  Moon, Sun, X, ShoppingBag, Bell
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  closeMobile: () => void;
}

const NavItem = ({ to, icon: Icon, label, active, onClick }: { to: string, icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
      active 
        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-blue-500/30' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <div className={`absolute inset-0 bg-primary/10 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'opacity-100 !bg-transparent' : ''}`}></div>
    <Icon size={22} className={active ? 'animate-pulse' : ''} />
    <span className="font-medium text-sm relative z-10">{label}</span>
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full opacity-50"></div>}
  </Link>
);

const IraqiFlag = () => (
  <div className="relative flex items-center justify-center p-2 no-print group">
    {/* Glow background */}
    <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-white/0 to-black/10 blur-3xl rounded-full animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    
    <div className="animate-flag-wave transform-gpu will-change-transform relative overflow-hidden rounded-[4px] shadow-[0_15px_35px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/20">
      <svg 
        width="80" 
        height="54" 
        viewBox="0 0 900 600" 
        className="transition-all duration-700 hover:scale-105"
      >
        <rect width="900" height="200" fill="#ce1126"/>
        <rect width="900" height="200" y="200" fill="#ffffff"/>
        <rect width="900" height="200" y="400" fill="#000000"/>
        
        {/* Allahu Akbar Script */}
        <g fill="#007a3d">
          <text 
            x="450" 
            y="315" 
            fontFamily="serif" 
            fontSize="115" 
            fontWeight="900" 
            textAnchor="middle" 
            fill="#007a3d"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
          >
            الله ★ أكبر
          </text>
        </g>

        {/* Dynamic Shadow Layer */}
        <defs>
          <linearGradient id="waveShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="black" stopOpacity="0.1" />
            <stop offset="25%" stopColor="white" stopOpacity="0.15" />
            <stop offset="50%" stopColor="black" stopOpacity="0.2" />
            <stop offset="75%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="900" height="600" fill="url(#waveShadow)" className="mix-blend-overlay" />
      </svg>
      
      {/* Moving Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[300%] h-full animate-shine-move pointer-events-none"></div>
    </div>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, closeMobile }) => {
  const location = useLocation();
  const path = location.pathname;
  const { t, direction } = useLanguage();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-[90] backdrop-blur-sm transition-opacity"
          onClick={closeMobile}
        />
      )}

      <aside 
        className={`fixed inset-y-0 ${direction === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'} z-[100] w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : (direction === 'rtl' ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                <Bot size={28} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">SMART HR</h1>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Platform</span>
              </div>
            </div>
            <button onClick={closeMobile} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur pb-2 px-4 flex items-center gap-2 mb-2 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Platform</span>
              <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            </div>

            <NavItem onClick={closeMobile} to="/" icon={LayoutDashboard} label={t('nav.dashboard')} active={path === '/'} />
            <NavItem onClick={closeMobile} to="/cashier" icon={ShoppingBag} label={t('nav.pos')} active={path === '/cashier'} />
            <NavItem onClick={closeMobile} to="/recruitment" icon={UserPlus} label={t('nav.recruitment')} active={path === '/recruitment'} />
            <NavItem onClick={closeMobile} to="/accounting" icon={Calculator} label={t('nav.accounting')} active={path === '/accounting'} />
            
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur pt-6 pb-2 px-4 flex items-center gap-2 mb-2 mt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Core HR</span>
              <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            </div>
            
            <NavItem onClick={closeMobile} to="/employees" icon={Users} label={t('nav.employees')} active={path === '/employees'} />
            <NavItem onClick={closeMobile} to="/finance" icon={Banknote} label={t('nav.finance')} active={path === '/finance'} />
            <NavItem onClick={closeMobile} to="/leaves" icon={Calendar} label={t('nav.leaves')} active={path === '/leaves'} />
            <NavItem onClick={closeMobile} to="/documents" icon={FileText} label={t('nav.documents')} active={path === '/documents'} />
            
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur pt-6 pb-2 px-4 flex items-center gap-2 mb-2 mt-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modules</span>
               <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            </div>

            <NavItem onClick={closeMobile} to="/training" icon={BookOpen} label={t('nav.training')} active={path === '/training'} />
            <NavItem onClick={closeMobile} to="/settings" icon={Settings} label={t('nav.settings')} active={path === '/settings'} />
          </nav>
        </div>
      </aside>
    </>
  );
};

export const Topbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { direction, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full h-16 md:h-24 flex items-center justify-between px-4 md:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors">
      
      <div className="flex items-center gap-4 lg:gap-8">
        <button onClick={toggleSidebar} className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors">
          <Menu size={24} />
        </button>

        <div className="flex flex-col">
           <h2 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider leading-none mb-1">{t('header.platform')}</h2>
           <p className="text-[8px] md:text-[10px] font-bold text-primary tracking-[0.2em] uppercase opacity-70">{t('header.subtitle')}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-10">
        {/* Actions Group */}
        <div className="hidden md:flex items-center gap-3">
           <button className="p-3 text-slate-400 hover:text-primary transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
           </button>
           <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2"></div>
        </div>

        {/* Official Identity Section */}
        <div className="flex items-center gap-3 md:gap-6 bg-slate-50 dark:bg-white/5 pl-2 md:pl-4 pr-1 py-1 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-inner">
           <div className="hidden sm:flex flex-col text-left rtl:text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t('header.country_en')}</span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">{t('header.country')}</span>
           </div>
           <IraqiFlag />
        </div>
      </div>
    </header>
  );
};
