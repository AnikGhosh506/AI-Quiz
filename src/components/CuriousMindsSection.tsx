import React, { useState } from 'react';
import { BookOpen, Brain, Target, Compass, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

interface CuriousMindsSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const CuriousMindsSection: React.FC<CuriousMindsSectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      id: 'learning',
      name: 'Learning',
      simpleTitle: 'Understand Concepts Clearly',
      icon: BookOpen,
      lead: 'Learning is not about memorizing lines from a textbook; it is about understanding how things work in the real world.',
      details:
        'AURIX breaks down complex formulas and theories into simple, intuitive ideas with real-life examples so you never have to blindly cram before an exam.',
      targetNav: 'study-materials',
      btnLabel: 'Explore Study Materials',
    },
    {
      id: 'critical-thinking',
      name: 'Critical Thinking',
      simpleTitle: 'Think for Yourself',
      icon: Brain,
      lead: 'Ask questions, understand why things happen, and build strong problem-solving skills.',
      details:
        'Develop sharp thinking through chess puzzles, brain riddles, and logical reasoning challenges that make school mathematics and science fun and approachable.',
      targetNav: 'play-games',
      btnLabel: 'Play Brain Games',
    },
    {
      id: 'assessment',
      name: 'Take a Test',
      simpleTitle: 'Check What You Know',
      icon: Target,
      lead: 'Tests are not meant to scare you; they show you where you are strong and what to practise next.',
      details:
        'Our chapter tests give you instant feedback. If you pick the wrong answer, we explain the mistake step by step so you learn and improve immediately.',
      targetNav: 'take-test',
      btnLabel: 'Take a Practice Test',
    },
    {
      id: 'discovery',
      name: 'Ask AI Doubts',
      simpleTitle: 'Clear Doubts Anytime',
      icon: Compass,
      lead: 'No question is silly. Ask whatever you find confusing as many times as you like.',
      details:
        'Our friendly AI tutor is ready 24/7. Ask it to explain a math step, simplify a physics chapter, or give you extra practice questions.',
      targetNav: 'ask-ai',
      btnLabel: 'Ask AI a Question',
    },
    {
      id: 'competition',
      name: 'Competitions',
      simpleTitle: 'Friendly Challenges',
      icon: Trophy,
      lead: 'Compete in weekly quizzes with students of your class from across the country.',
      details:
        'Earn badges, climb the weekly class leaderboard, and build confidence by solving timed questions under light competition.',
      targetNav: 'competitions',
      btnLabel: 'Join Competitions',
    },
  ];

  const currentPillar = pillars[activeTab];
  const CurrentIcon = currentPillar.icon;

  return (
    <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#a3e635] font-semibold mb-2 inline-block">
          How AURIX Helps You
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          BUILT FOR CURIOUS MINDS
        </h2>
        <p className="mt-3 text-sm sm:text-base text-neutral-300">
          Five simple ways we make school learning enjoyable, clear, and stress-free.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 max-w-4xl mx-auto">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isSelected = activeTab === idx;
          return (
            <button
              key={pillar.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border whitespace-nowrap cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#142316] text-[#bef264] border-[#a3e635]/60 shadow-[0_0_20px_rgba(163,230,53,0.2)]'
                  : 'bg-[#0a100b]/60 text-neutral-400 border-white/5 hover:border-white/15 hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#a3e635]' : 'text-neutral-500'}`} />
              <span>{pillar.name}</span>
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div className="aurix-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#a3e635]/20 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635]">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#a3e635]">
                Pillar {activeTab + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {currentPillar.simpleTitle}
              </h3>
            </div>
          </div>

          <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
            &ldquo;{currentPillar.lead}&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {currentPillar.details}
          </p>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => onNavigate(currentPillar.targetNav)}
              className="aurix-pill-button px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] inline-flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{currentPillar.btnLabel}</span>
              <ArrowRight className="w-4 h-4 text-[#040604]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
