import React, { useState } from 'react';
import { ArrowRight, Compass, Sparkles, BookOpen, Bot, TrendingUp, Brain, Trophy, Clock } from 'lucide-react';
import { FocusSessionWidget } from './FocusSessionWidget';

interface HeroProps {
  onStartTest: () => void;
  onAskAI: () => void;
  onExplore: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartTest,
  onAskAI,
  onExplore,
}) => {
  const [showFocusTimer, setShowFocusTimer] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-36 pb-16 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      {/* Hero Content Container scrolling over the fixed background */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* High Visibility Student Announcement */}
        <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-full aurix-3d-glass-btn text-xs sm:text-sm text-white mb-6 backdrop-blur-xl max-w-[95vw] sm:max-w-full text-center">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bef264] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#a3e635]"></span>
          </span>
          <span className="font-semibold text-white tracking-wide leading-tight break-words sm:whitespace-nowrap">
            Welcome to AURIX · Class 6 to Class 11 Learning Platform
          </span>
        </div>

        {/* Primary Student Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-5 text-balance max-w-3xl aurix-3d-heading">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-white via-white to-neutral-200 bg-clip-text text-transparent">
            AURIX!
          </span>
          <span className="block text-2xl sm:text-4xl md:text-5xl font-bold mt-2 text-[#bef264] aurix-3d-lime-heading">
            Learn something new.{' '}
            <span className="italic">
              Improve every day.
            </span>
          </span>
        </h1>

        {/* Supporting Text in Simple Language */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-normal max-w-2xl leading-relaxed mb-8 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Test yourself with chapter tests, ask our friendly AI tutor about your doubts, check your progress, and play brain games.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-8">
          <button
            onClick={onStartTest}
            className="w-full sm:w-auto aurix-3d-button px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base text-[#040604] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <span>Take a Test Now</span>
            <ArrowRight className="w-4.5 h-4.5 text-[#040604]" />
          </button>

          <button
            onClick={onAskAI}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold aurix-3d-glass-btn flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bot className="w-4.5 h-4.5 text-[#a3e635]" />
            <span>Ask AI About Your Doubts</span>
          </button>

          <button
            onClick={() => setShowFocusTimer(!showFocusTimer)}
            className={`w-full sm:w-auto px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              showFocusTimer
                ? 'bg-[#18281a] border border-[#a3e635] text-[#bef264] shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                : 'aurix-3d-glass-btn text-neutral-200'
            }`}
          >
            <Clock className="w-4 h-4 text-[#a3e635]" />
            <span>{showFocusTimer ? 'Hide Focus Timer' : '25-Min Focus Session'}</span>
          </button>
        </div>

        {/* Focus Session Pomodoro Widget (Toggled or active) */}
        {showFocusTimer && (
          <div className="w-full mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <FocusSessionWidget />
          </div>
        )}

        {/* Quick Jump Grid to the Key Sections */}
        <div className="w-full pt-6 border-t border-[#a3e635]/20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3.5 text-xs">
          <button
            onClick={() => onExplore('take-test')}
            className="p-3 rounded-xl aurix-3d-card text-neutral-200 hover:text-white transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="aurix-3d-icon-box p-2 rounded-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 text-[#a3e635]" />
            </div>
            <span className="font-bold text-xs mt-0.5">Take a Test</span>
          </button>

          <button
            onClick={() => onExplore('ask-ai')}
            className="p-3 rounded-xl aurix-3d-card text-neutral-200 hover:text-white transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="aurix-3d-icon-box p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Bot className="w-4 h-4 text-[#bef264]" />
            </div>
            <span className="font-bold text-xs mt-0.5">Ask AI</span>
          </button>

          <button
            onClick={() => onExplore('my-progress')}
            className="p-3 rounded-xl aurix-3d-card text-neutral-200 hover:text-white transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="aurix-3d-icon-box p-2 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 text-[#84cc16]" />
            </div>
            <span className="font-bold text-xs mt-0.5">Check Progress</span>
          </button>

          <button
            onClick={() => onExplore('play-games')}
            className="p-3 rounded-xl aurix-3d-card text-neutral-200 hover:text-white transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="aurix-3d-icon-box p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Brain className="w-4 h-4 text-[#a3e635]" />
            </div>
            <span className="font-bold text-xs mt-0.5">Play Games</span>
          </button>

          <button
            onClick={() => onExplore('competitions')}
            className="p-3 rounded-xl aurix-3d-card text-neutral-200 hover:text-white transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="aurix-3d-icon-box p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4 text-[#bef264]" />
            </div>
            <span className="font-bold text-xs mt-0.5">Competitions</span>
          </button>
        </div>
      </div>
    </section>
  );
};
