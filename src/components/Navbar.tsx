import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  User,
  LogOut,
  CheckCircle,
  ShieldCheck,
  Edit3,
  Users,
  HeartHandshake,
  ChevronDown,
  Sparkles,
  Trash2,
  Home,
  BookOpen,
  TrendingUp,
  Bot,
  Gamepad2,
  Trophy,
  FileText,
  Bell,
  Printer,
  Calendar,
} from 'lucide-react';
import { StudentUser, ParentUser } from '../services/authService';
import { ThemeSwitcher } from './ThemeSwitcher';
import { PWAInstallButton } from './PWAInstallButton';
import { playHoverSound } from '../utils/audioEffects';

interface NavbarProps {
  currentUser: StudentUser | null;
  parentUser?: ParentUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onGoBack?: () => void;
  onOpenEditProfile?: () => void;
  onOpenSwitchAccount?: () => void;
  onOpenParentLogin?: () => void;
  onExitParentMode?: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  parentUser,
  onOpenAuth,
  onLogout,
  onNavigate,
  activeSection,
  onGoBack,
  onOpenEditProfile,
  onOpenSwitchAccount,
  onOpenParentLogin,
  onExitParentMode,
  onOpenNotifications,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple, student-friendly navigation items required by user:
  const navItems = [
    { label: 'Home', id: 'home', icon: Home },
    { label: 'Take a Test', id: 'take-test', icon: BookOpen },
    { label: 'Study Materials', id: 'study-materials', icon: FileText },
    { label: 'Study Rooms', id: 'study-rooms', icon: Users },
    { label: 'Study Scheduler', id: 'study-scheduler', icon: Calendar },
    { label: 'My Progress', id: 'my-progress', icon: TrendingUp },
    { label: 'Ask AI', id: 'ask-ai', icon: Bot },
    { label: 'Play Games', id: 'play-games', icon: Gamepad2 },
    { label: 'Competitions', id: 'competitions', icon: Trophy },
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
            ? 'aurix-glass bg-[#080d09]/95 shadow-[0_8px_32px_rgba(0,0,0,0.65)] border border-[#a3e635]/25 backdrop-blur-xl py-2 px-3 sm:px-5'
            : 'aurix-glass bg-[#080d09]/85 border border-[#a3e635]/20 backdrop-blur-lg py-2 px-3 sm:px-5'
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left Zone: Back Button (if not on home) + Brand */}
          <div className="flex items-center gap-2 shrink-0">
            {onGoBack && activeSection !== 'home' && (
              <button
                onClick={onGoBack}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#142316] hover:bg-[#1a2e1d] border border-[#a3e635]/40 text-xs font-semibold text-[#bef264] transition-all cursor-pointer shadow-[0_0_12px_rgba(163,230,53,0.15)] active:scale-95 group shrink-0"
                title="Back to previous page"
                aria-label="Back to previous page"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#a3e635] group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Brand Zone: AURIX logo + Saheb Mukherjee underneath as required */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a3e635] shrink-0"
              aria-label="AURIX Home"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl aurix-3d-logo flex items-center justify-center overflow-hidden shrink-0 cursor-pointer">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(163,230,53,0.35),transparent_70%)]" />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3e635] relative z-10 transition-transform group-hover:scale-110 duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
                <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight flex items-center gap-1 group-hover:text-[#bef264] transition-colors aurix-3d-heading">
                  AURIX
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] inline-block shadow-[0_0_8px_#a3e635]" />
                </span>
                <span className="text-[10px] font-semibold tracking-wide text-[#a3e635] leading-tight">
                  -by Saheb Mukherjee
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Tab Bar (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-0.5 xl:gap-1 bg-[#040805]/80 p-1 rounded-xl border border-white/10 shadow-inner overflow-x-auto no-scrollbar max-w-[48vw] lg:max-w-none shrink min-w-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2 lg:px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1 lg:gap-1.5 shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#a3e635] cursor-pointer ${
                    isActive
                      ? 'text-[#bef264] bg-[#a3e635]/20 border border-[#a3e635]/45 shadow-[0_0_12px_rgba(163,230,53,0.18)] font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#a3e635]' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenNotifications && (
              <button
                onClick={() => {
                  playHoverSound('pop');
                  onOpenNotifications();
                }}
                onMouseEnter={() => playHoverSound('hiss')}
                className="aurix-glass-btn p-2 rounded-xl text-[#a3e635] hover:text-white transition-all cursor-pointer relative group"
                title="PWA Push Notifications & Study Reminders"
                aria-label="Study Notifications"
              >
                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#a3e635] border-2 border-[#040604] shadow-[0_0_8px_#a3e635]" />
              </button>
            )}
            <button
              onClick={() => {
                playHoverSound('pop');
                onNavigate('print-report');
              }}
              onMouseEnter={() => playHoverSound('hiss')}
              className="aurix-glass-btn p-2 rounded-xl text-[#bef264] hover:text-white transition-all cursor-pointer relative group"
              title="Print Academic Dossier (ID Card, Leaderboard & Study Materials)"
              aria-label="Print Academic Dossier"
            >
              <Printer className="w-4 h-4 group-hover:scale-110 transition-transform text-[#a3e635]" />
            </button>
            <ThemeSwitcher />
            <PWAInstallButton />
            {/* If Parent Mode is Active */}
            {parentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#142618] border border-[#a3e635]/50 text-xs text-white shadow-[0_0_15px_rgba(163,230,53,0.15)]">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#a3e635]" />
                  <span className="font-bold text-[#bef264]">Parent Portal</span>
                  <span className="text-neutral-300 text-[11px] hidden sm:inline">
                    · {parentUser.parentName}
                  </span>
                </div>
                {onExitParentMode && (
                  <button
                    onClick={onExitParentMode}
                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-neutral-200 transition-colors cursor-pointer"
                  >
                    Student Mode
                  </button>
                )}
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-neutral-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : currentUser ? (
              <div className="flex items-center gap-2 relative" ref={userDropdownRef}>
                {/* Parent Portal Direct Quick Access */}
                {onOpenParentLogin && (
                  <button
                    onClick={onOpenParentLogin}
                    className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#09120a] hover:bg-[#142316] border border-[#a3e635]/30 text-[11px] font-semibold text-[#bef264] transition-all cursor-pointer shadow-sm hover:border-[#a3e635]/60 shrink-0"
                    title="Parental Login & Oversight"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-[#a3e635]" />
                    <span>Parent Portal</span>
                  </button>
                )}

                {/* Profile Pill with Dropdown Trigger */}
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#142316] hover:bg-[#192b1b] border border-[#a3e635]/40 hover:border-[#a3e635]/70 text-xs text-white transition-all shadow-[0_0_15px_rgba(163,230,53,0.15)] cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#a3e635]" />
                  <span className="font-semibold text-[#bef264] truncate max-w-[110px] sm:max-w-[130px]">
                    {currentUser.name}
                  </span>
                  <span className="text-neutral-300 text-[11px] truncate hidden sm:inline font-mono">
                    ({currentUser.classLevel})
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-[#0c140e] border border-[#a3e635]/40 shadow-2xl p-2 z-50 text-left animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-white/5 mb-1 bg-[#101c13] rounded-xl">
                      <div className="font-bold text-white text-xs truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-[#bef264] font-medium">
                        {currentUser.classLevel} · Roll #{currentUser.rollNumber || '18'}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                        {currentUser.schoolName} ({currentUser.schoolBoard || 'CBSE'})
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('my-progress');
                      }}
                      className="w-full text-left p-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-[#142316] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#a3e635]" />
                      <span>View Student ID &amp; Progress</span>
                    </button>

                    {onOpenEditProfile && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenEditProfile();
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs text-[#bef264] hover:bg-[#142316] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#a3e635]" />
                        <span>Edit Credentials (Class, Name, School...)</span>
                      </button>
                    )}

                    {onOpenSwitchAccount && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenSwitchAccount();
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-[#142316] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-[#a3e635]" />
                        <span>Switch Account</span>
                      </button>
                    )}

                    {onOpenParentLogin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenParentLogin();
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-[#142316] flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#a3e635]" />
                        <span>Parental Login / Portal</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-white/5" />

                    {onOpenEditProfile && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenEditProfile();
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Delete Account</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left p-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {onOpenParentLogin && (
                  <button
                    onClick={onOpenParentLogin}
                    className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-[#bef264] hover:text-white transition-colors cursor-pointer bg-[#142316]/60 border border-[#a3e635]/30 rounded-xl"
                  >
                    Parent Portal
                  </button>
                )}
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 whitespace-nowrap cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="aurix-pill-button px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-xl flex items-center gap-1 shadow-sm whitespace-nowrap active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Student Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#040604]" />
                </button>
              </>
            )}

            {/* Mobile / Tablet menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#a3e635]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick Horizontal Tab Switcher Strip (Mobile only < md) */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 mt-2 border-t border-white/10 text-left">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#bef264] bg-[#a3e635]/25 border border-[#a3e635]/50 font-bold shadow-[0_0_12px_rgba(163,230,53,0.2)]'
                    : 'text-neutral-400 hover:text-white bg-[#0e1610] hover:bg-[#142316] border border-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#a3e635]' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu (< md) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#a3e635]/15 flex flex-col gap-1 pb-2 animate-in fade-in slide-in-from-top-2 text-left">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-between ${
                    activeSection === item.id
                      ? 'text-[#bef264] bg-[#a3e635]/20 font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#a3e635]" />
                    <span>{item.label}</span>
                  </div>
                  {activeSection === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />}
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/5 space-y-2">
              {currentUser ? (
                <div className="space-y-1.5 p-2 rounded-xl bg-[#142316] text-xs">
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>{currentUser.name} ({currentUser.classLevel})</span>
                    <span className="text-[10px] text-[#bef264]">Roll #{currentUser.rollNumber || '18'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {onOpenEditProfile && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenEditProfile();
                        }}
                        className="py-1 px-2 rounded-lg bg-white/5 text-[11px] text-[#bef264] border border-white/10 text-center"
                      >
                        Edit Credentials
                      </button>
                    )}
                    {onOpenSwitchAccount && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenSwitchAccount();
                        }}
                        className="py-1 px-2 rounded-lg bg-white/5 text-[11px] text-neutral-200 border border-white/10 text-center"
                      >
                        Switch Account
                      </button>
                    )}
                  </div>

                  {onOpenParentLogin && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenParentLogin();
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-[#0e1710] text-[11px] text-[#bef264] border border-[#a3e635]/30 text-center block mt-1"
                    >
                      Parental Login / Portal
                    </button>
                  )}

                  <div className="pt-1 text-right">
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
                </div>
              ) : (
                <>
                  {onOpenParentLogin && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenParentLogin();
                      }}
                      className="w-full py-2 text-xs font-semibold text-[#bef264] bg-[#142316] rounded-lg text-center"
                    >
                      Parental Login (Parent Portal)
                    </button>
                  )}
                  <div className="flex gap-2">
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
                      Student Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
