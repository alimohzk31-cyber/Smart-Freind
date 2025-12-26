import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'auto';
type AppTheme = 'default' | 'defense' | 'interior' | 'health' | 'corporate' | 'gold' | 'carbon' | 'crimson' | 'emerald' | 'violet' | 'royal';

interface ThemeContextType {
  mode: ThemeMode;
  theme: AppTheme;
  setMode: (mode: ThemeMode) => void;
  setTheme: (theme: AppTheme) => void;
  availableThemes: { id: AppTheme; name: string; color: string; type: 'classic' | 'luxury' | 'modern' }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const availableThemes: { id: AppTheme; name: string; color: string; type: 'classic' | 'luxury' | 'modern' }[] = [
  { id: 'default', name: 'الافتراضي (Blue)', color: '#0B4F8C', type: 'classic' },
  { id: 'defense', name: 'وزارة الدفاع (Camo)', color: '#3f6212', type: 'classic' },
  { id: 'interior', name: 'وزارة الداخلية (Police)', color: '#1e3a8a', type: 'classic' },
  { id: 'health', name: 'وزارة الصحة (Teal)', color: '#0891b2', type: 'classic' },
  { id: 'corporate', name: 'شركات (Gray)', color: '#334155', type: 'modern' },
  { id: 'gold', name: 'ذهبي فاخر (Royal Gold)', color: '#d97706', type: 'luxury' },
  { id: 'carbon', name: 'أسود فحمي (Carbon)', color: '#111827', type: 'modern' },
  { id: 'crimson', name: 'دموي (Blood Red)', color: '#dc2626', type: 'luxury' },
  { id: 'emerald', name: 'أخضر (Emerald)', color: '#059669', type: 'modern' },
  { id: 'violet', name: 'بنفسجي (Violet)', color: '#7c3aed', type: 'luxury' },
  { id: 'royal', name: 'ملكي (Royal)', color: '#4338ca', type: 'luxury' },
];

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => (localStorage.getItem('themeMode') as ThemeMode) || 'light');
  const [theme, setTheme] = useState<AppTheme>(() => (localStorage.getItem('appTheme') as AppTheme) || 'default');

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Handle Light/Dark Mode
    if (mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Handle Color Theme
    body.setAttribute('data-theme', theme);
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('appTheme', theme);

  }, [mode, theme]);

  return (
    <ThemeContext.Provider value={{ mode, theme, setMode, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};