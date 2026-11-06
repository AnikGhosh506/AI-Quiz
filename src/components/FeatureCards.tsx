import React, { useState } from 'react';
import { BookOpen, Bot, Brain, ArrowRight, Sparkles } from 'lucide-react';

interface FeatureCardsProps {
  onNavigate: (sectionId: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onNavigate }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      id: 'take-test',
      kicker: 'PRACTISE & MASTER',
      title: 'Take a Test',
      description:
        'Choose your class from 6 to 12 and test yourself on any chapter. See your score, correct answers, and step-by-step explanations.',
      imageSrc: '/src/assets/images/card_assessment_visual_1793877328440.jpg',
      alt: 'Take a test and check your answers',
      tags: ['Classes 6–12', 'Detailed Explanations', 'Instant Results'],
      actionLabel: 'Start a Test',
      icon: BookOpen,
      highlightBadge: 'Demo Test Available',
    },
    {
      id: 'ask-ai',
      kicker: 'CLEAR YOUR DOUBTS',
      title: 'Ask AI About Your Doubts',
      description:
        'Got stuck on a maths problem or science formula? Ask our patient AI tutor for simple, step-by-step explanations anytime.',
      imageSrc: '/src/assets/images/card_tutor_visual_1793877329426.jpg',
      alt: 'Ask AI friendly tutor for doubts',
      tags: ['Maths & Science', 'Step-by-Step Help', 'Available 24/7'],
      actionLabel: 'Chat with AI Tutor',
      icon: Bot,
      highlightBadge: 'Interactive Chat',
    },
    {
      id: 'play-games',
      kicker: 'THINK SHARP',
      title: 'Play Brain Games',
      description:
        'Refresh your mind with tactical chess puzzles, speed math sprints, and memory logic games designed to sharpen concentration.',
      imageSrc: '/src/assets/images/card_chess_visual_1793877329294.jpg',
      alt: 'Play brain games and chess tactics',
      tags: ['Chess Tactics', 'Speed Math', 'Memory Logic'],
      actionLabel: 'Play Games Now',
      icon: Brain,
      highlightBadge: 'Fun Mental Workout',
    },
  ];

  return (
    <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#a3e635] font-semibold mb-2 inline-block">
          Explore What You Can Do
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Three ways to learn smarter on AURIX.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-neutral-300">
          Everything you need to test your knowledge, clear doubts, and sharpen your thinking.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isHovered = hoveredCard === index;

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="aurix-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group border border-[#a3e635]/15 hover:border-[#a3e635]/40"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#a3e635]">
                    {card.kicker}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#0e1710] border border-[#a3e635]/25 flex items-center justify-center text-[#a3e635]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-[#bef264] transition-colors">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              {/* Visual Asset */}
              <div className="relative rounded-xl overflow-hidden mb-6 aspect-[4/3] bg-[#070b08] border border-white/10 group-hover:border-[#a3e635]/30 transition-all duration-300">
                <img
                  src={card.imageSrc}
                  alt={card.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#080d09]/80 backdrop-blur-md border border-white/10 text-[11px] text-neutral-200">
                  <span className="font-semibold text-white">{card.title}</span>
                  <span className="text-[#a3e635] text-xs font-semibold">{card.highlightBadge}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
                  {card.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="inline-flex items-center gap-1.5 text-neutral-300 text-[11px]">
                      <span className="w-1 h-1 rounded-full bg-[#a3e635]" />
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate(card.id)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-neutral-100 bg-[#121c13] hover:bg-[#19271a] border border-[#a3e635]/30 hover:border-[#a3e635]/60 hover:text-white transition-all flex items-center justify-between group/btn cursor-pointer active:scale-95"
                >
                  <span>{card.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 text-[#a3e635] transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
