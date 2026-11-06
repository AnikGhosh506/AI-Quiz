import React from 'react';
import { ArrowRight, Compass, Sparkles, BookOpen, Bot, TrendingUp, Brain, Trophy, FileText } from 'lucide-react';

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
  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
    >
      {/* Hero Content Container scrolling over the fixed background */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Simple Student Announcement */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d160e]/85 border border-[#a3e635]/30 text-xs sm:text-[13px] text-neutral-200 mb-5 shadow-[0_0_20px_rgba(163,230,53,0.12)] backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bef264] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a3e635]"></span>
          </span>
          <span className="font-medium text-neutral-200">
            Welcome to AURIX · Classes 6 to 12 Learning Platform
          </span>
        </div>

        {/* Primary Student Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-5 text-balance max-w-3xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-white via-white to-neutral-300 bg-clip-text text-transparent">
            AURIX!
          </span>
          <span className="block text-2xl sm:text-4xl md:text-5xl font-bold mt-2 text-[#bef264]">
            Learn something new.{' '}
            <span className="italic">
              Improve every day.
            </span>
          </span>
        </h1>

        {/* Supporting Text in Simple Language */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-300/95 font-normal max-w-2xl leading-relaxed mb-8 text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          Test yourself with chapter tests, ask our friendly AI tutor about your doubts, check your progress, and play brain games.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-10">
          <button
            onClick={onStartTest}
            className="w-full sm:w-auto aurix-pill-button px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-[#040604] flex items-center justify-center gap-2.5 shadow-[0_4px_30px_rgba(163,230,53,0.35)] hover:shadow-[0_4px_45px_rgba(190,242,100,0.55)] transition-all active:scale-95 cursor-pointer"
          >
            <span>Take a Test Now</span>
            <ArrowRight className="w-4 h-4 text-[#040604]" />
          </button>

          <button
            onClick={onAskAI}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-neutral-200 bg-[#0c140d]/80 hover:bg-[#121e14]/90 border border-[#a3e635]/30 hover:border-[#a3e635]/60 backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#a3e635]" />
            <span>Ask AI About Your Doubts</span>
          </button>
        </div>

        {/* Quick Jump Grid to the 6 Key Sections as requested by user */}
        <div className="w-full pt-6 border-t border-[#a3e635]/15 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 text-xs">
          <button
            onClick={() => onExplore('take-test')}
            className="p-2.5 rounded-xl bg-[#090f0b]/80 border border-white/5 hover:border-[#a3e635]/40 text-neutral-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#a3e635]" />
            <span className="font-semibold">Take a Test</span>
          </button>

          <button
            onClick={() => onExplore('ask-ai')}
            className="p-2.5 rounded-xl bg-[#090f0b]/80 border border-white/5 hover:border-[#a3e635]/40 text-neutral-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#bef264]" />
            <span className="font-semibold">Ask AI</span>
          </button>

          <button
            onClick={() => onExplore('my-progress')}
            className="p-2.5 rounded-xl bg-[#090f0b]/80 border border-white/5 hover:border-[#a3e635]/40 text-neutral-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-[#84cc16]" />
            <span className="font-semibold">Check Progress</span>
          </button>

          <button
            onClick={() => onExplore('play-games')}
            className="p-2.5 rounded-xl bg-[#090f0b]/80 border border-white/5 hover:border-[#a3e635]/40 text-neutral-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
          >
            <Brain className="w-4 h-4 text-[#a3e635]" />
            <span className="font-semibold">Play Games</span>
          </button>

          <button
            onClick={() => onExplore('competitions')}
            className="p-2.5 rounded-xl bg-[#090f0b]/80 border border-white/5 hover:border-[#a3e635]/40 text-neutral-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-[#bef264]" />
            <span className="font-semibold">Competitions</span>
          </button>

          <button
            onClick={() => onExplore('study-materials')}
            className="p-2.5 rounded-xl bg-[#090f0b]/80 border border-white/5 hover:border-[#a3e635]/40 text-neutral-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#84cc16]" />
            <span className="font-semibold">Study Notes</span>
          </button>
        </div>
      </div>
    </section>
  );
};
