import React, { useEffect, useState } from 'react';
import { Sun, Moon, Contrast } from 'lucide-react';
import { playHoverSound } from '../utils/audioEffects';

export type AppThemeMode = 'midnight' | 'high-contrast';

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<AppThemeMode>(() => {
    const saved = localStorage.getItem('aurix_theme');
    return saved === 'high-contrast' ? 'high-contrast' : 'midnight';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'high-contrast') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('aurix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    playHoverSound('pop');
    setTheme((prev) => (prev === 'midnight' ? 'high-contrast' : 'midnight'));
  };

  return (
    <button
      onClick={toggleTheme}
      onMouseEnter={() => playHoverSound('click')}
      className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 ${
        theme === 'high-contrast'
          ? 'bg-[#ccff00] text-black border-white shadow-[0_0_15px_rgba(204,255,0,0.5)] font-black'
          : 'bg-[#09120a] hover:bg-[#142316] border-[#a3e635]/30 text-[#bef264] hover:border-[#a3e635]/60'
      }`}
      title={theme === 'midnight' ? 'Switch to High Contrast Mode' : 'Switch to Midnight Forest Theme'}
    >
      <Contrast className="w-3.5 h-3.5 text-[#a3e635] high-contrast:text-black shrink-0" />
      <span className="hidden sm:inline">
        {theme === 'midnight' ? 'Midnight Forest' : 'High Contrast'}
      </span>
      <span className="sm:hidden">Theme</span>
    </button>
  );
};
