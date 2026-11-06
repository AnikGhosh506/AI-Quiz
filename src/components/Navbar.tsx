import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, LogOut, CheckCircle } from 'lucide-react';
import { StudentUser } from '../services/authService';

interface NavbarProps {
  currentUser: StudentUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigate,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple, student-friendly navigation items required by user:
  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Take a Test', id: 'take-test' },
    { label: 'Ask AI', id: 'ask-ai' },
    { label: 'My Progress', id: 'my-progress' },
    { label: 'Play Games', id: 'play-games' },
    { label: 'Competitions', id: 'competitions' },
    { label: 'Study Materials', id: 'study-materials' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-5 pt-2 sm:pt-3 pointer-events-none transition-all duration-300">
      <div
        className={`w-full max-w-7xl pointer-events-auto rounded-2xl transition-all duration-300 ${
          isScrolled
            ? 'aurix-glass bg-[#080d09]/90 shadow-[0_8px_32px_rgba(0,0,0,0.55)] border border-[#a3e635]/20 backdrop-blur-xl py-2 px-3 sm:px-5'
            : 'aurix-glass bg-[#080d09]/75 border border-[#a3e635]/15 backdrop-blur-lg py-2.5 px-3 sm:px-5'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Brand Zone: AURIX logo + Saheb Mukherjee underneath as required */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a3e635] shrink-0"
            aria-label="AURIX Home"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#1b2b1c] to-[#0a120b] border border-[#a3e635]/30 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(163,230,53,0.15)] group-hover:border-[#a3e635]/60 transition-all duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(163,230,53,0.35),transparent_70%)]" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635] relative z-10 transition-transform group-hover:scale-110 duration-300"
              >
                <path
                  d="M12 2L3 8V16L12 22L21 16V8L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" fill="#bef264" />
                <path d="M12 2V8M12 16V22M3 8L8 11M16 13L21 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
            </div>

            {/* Brand text + Saheb Mukherjee underneath as strictly requested */}
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight flex items-center gap-1 group-hover:text-[#bef264] transition-colors">
                AURIX
                <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] inline-block" />
              </span>
              <span className="text-[10px] font-semibold tracking-wide text-[#a3e635] leading-tight">
                Saheb Mukherjee
              </span>
            </div>
          </button>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 lg:px-3 py-1.5 text-xs lg:text-[13px] font-medium rounded-lg transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-1 focus-visible:ring-[#a3e635] cursor-pointer ${
                    isActive
                      ? 'text-[#bef264] bg-[#a3e635]/15 border border-[#a3e635]/30'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('my-progress')}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#142316] border border-[#a3e635]/30 text-xs text-white hover:border-[#a3e635]/60 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
                  <span className="font-semibold text-[#bef264] truncate max-w-[120px]">{currentUser.name}</span>
                  <span className="text-neutral-400 text-[11px]">({currentUser.classLevel})</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-neutral-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="aurix-pill-button px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm whitespace-nowrap active:scale-95 transition-transform"
                >
                  <span>Student Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#040604]" />
                </button>
              </>
            )}

            {/* Mobile / Tablet menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#a3e635]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-[#a3e635]/15 flex flex-col gap-1 pb-2 animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${
                  activeSection === item.id
                    ? 'text-[#bef264] bg-[#a3e635]/20 font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {activeSection === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />}
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-white/5 flex gap-2">
              {currentUser ? (
                <div className="w-full flex items-center justify-between p-2 rounded-lg bg-[#142316] text-xs">
                  <span className="text-white">Logged in as <strong>{currentUser.name}</strong></span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="text-red-300 text-xs font-medium hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('signin');
                    }}
                    className="flex-1 py-2 text-xs font-medium text-neutral-200 bg-white/5 rounded-lg text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('signup');
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-[#040604] bg-[#a3e635] rounded-lg text-center"
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
