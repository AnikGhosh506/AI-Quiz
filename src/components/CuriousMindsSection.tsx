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
      targetNav: 'take-test',
      btnLabel: 'Practise with Tests',
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
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight aurix-3d-heading">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'aurix-3d-glass-btn text-[#bef264] font-bold border-[#a3e635]/70 transform -translate-y-1'
                  : 'bg-[#0a100b]/80 text-neutral-300 border border-white/10 hover:border-white/20 hover:text-white hover:-translate-y-0.5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#a3e635] drop-shadow-[0_0_6px_#a3e635]' : 'text-neutral-400'}`} />
              <span>{pillar.name}</span>
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div className="aurix-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="aurix-3d-icon-box w-11 h-11 rounded-xl flex items-center justify-center text-[#a3e635]">
              <CurrentIcon className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#a3e635] tracking-wide">
                Pillar {activeTab + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
                {currentPillar.simpleTitle}
              </h3>
            </div>
          </div>

          <p className="text-base sm:text-lg text-white font-medium leading-relaxed drop-shadow-sm">
            &ldquo;{currentPillar.lead}&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {currentPillar.details}
          </p>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => onNavigate(currentPillar.targetNav)}
              className="aurix-3d-button px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] inline-flex items-center gap-2 cursor-pointer"
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
