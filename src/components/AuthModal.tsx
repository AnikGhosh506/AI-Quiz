import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, Lock, Mail, User, BookOpen } from 'lucide-react';
import { authService, StudentUser } from '../services/authService';
import { CLASSES_LIST } from '../data/quizData';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: StudentUser, redirectRoute?: string | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdUser, setCreatedUser] = useState<StudentUser | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setIsCompleted(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      let user: StudentUser;
      if (mode === 'signup') {
        user = authService.signup(fullName, email, classLevel);
      } else {
        user = authService.login(email, classLevel);
      }

      setCreatedUser(user);
      setIsSubmitting(false);
      setIsCompleted(true);

      const intended = authService.getIntendedRoute();
      authService.clearIntendedRoute();

      setTimeout(() => {
        onSuccess(user, intended);
        onClose();
      }, 900);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md aurix-glass-card bg-[#080d09] rounded-2xl sm:rounded-3xl border border-[#a3e635]/30 shadow-[0_0_50px_rgba(163,230,53,0.18)] overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isCompleted && createdUser ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-[#142316] border border-[#a3e635]/40 text-[#a3e635] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(163,230,53,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {mode === 'signup' ? 'Welcome to AURIX!' : 'Welcome Back!'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300">
              Logged in as <strong className="text-[#bef264]">{createdUser.name}</strong> ({createdUser.classLevel}).
              Returning to your learning page...
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a3e635]">
                  Student Account
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {mode === 'signup' ? 'Create Your Student Profile' : 'Sign In to AURIX'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                {mode === 'signup'
                  ? 'Save your test scores, track topics to practise, and ask AI doubts.'
                  : 'Enter your email to continue your saved learning progress.'}
              </p>
            </div>

            {/* Toggle */}
            <div className="flex p-1 bg-[#0e1610] rounded-xl border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#1a2d1d] text-[#bef264] shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign Up Free
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#1a2d1d] text-[#bef264] shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saheb Mukherjee"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    defaultValue="student123"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Choose Your Class
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                >
                  {CLASSES_LIST.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 aurix-pill-button py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(163,230,53,0.35)] active:scale-95 transition-all cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? 'Connecting...'
                    : mode === 'signup'
                    ? 'Create Free Account'
                    : 'Sign In to Workspace'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-white/5 text-center text-[11px] text-neutral-500">
              Free educational access for Classes 6 to 12. No credit card required.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
