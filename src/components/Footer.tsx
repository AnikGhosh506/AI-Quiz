import React from 'react';
import { ArrowUp, BookOpen, Bot, Shield, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#030503]/80 backdrop-blur-xl border-t border-[#a3e635]/15 pt-16 pb-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-[#a3e635]"
                >
                  <path
                    d="M12 2L3 8V16L12 22L21 16V8L12 2Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" fill="#bef264" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-tight">
                  AURIX
                </span>
                <span className="text-[10px] font-semibold tracking-wide text-[#a3e635]">
                  Saheb Mukherjee
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
              An intelligent learning companion for students of Classes 6 to 12. Test your knowledge, ask AI your doubts, track your progress, and play brain games.
            </p>

            <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1">
              <span className="inline-flex items-center gap-1.5 text-neutral-400">
                <BookOpen className="w-3.5 h-3.5 text-[#a3e635]" />
                Classes 6–12 Curriculum
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5 text-neutral-400">
                <Bot className="w-3.5 h-3.5 text-[#bef264]" />
                Patient Socratic AI
              </span>
            </div>
          </div>

          {/* Student Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
              Quick Links
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#bef264] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('take-test')}
                  className="hover:text-[#bef264] transition-colors cursor-pointer"
                >
                  Take a Test
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ask-ai')}
                  className="hover:text-[#bef264] transition-colors cursor-pointer"
                >
                  Ask AI About Doubts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-progress')}
                  className="hover:text-[#bef264] transition-colors cursor-pointer"
                >
                  Check Your Progress
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('play-games')}
                  className="hover:text-[#bef264] transition-colors cursor-pointer"
                >
                  Play Brain Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('competitions')}
                  className="hover:text-[#bef264] transition-colors cursor-pointer"
                >
                  Join Competitions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('study-materials')}
                  className="hover:text-[#bef264] transition-colors cursor-pointer"
                >
                  Explore Study Materials
                </button>
              </li>
            </ul>
          </div>

          {/* Student Access */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
              Student Account
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Create a free student profile to save your scores, track what to practise, and challenge your peers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => onOpenAuth('signup')}
                className="aurix-pill-button px-4 py-2 text-xs font-semibold rounded-xl text-center shadow-sm cursor-pointer"
              >
                Sign Up Free
              </button>
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-4 py-2 text-xs font-medium text-neutral-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center cursor-pointer"
              >
                Student Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} AURIX Platform. Developed by Saheb Mukherjee for school students.
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#a3e635] transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
