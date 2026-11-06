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
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight aurix-3d-heading">
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

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className="aurix-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group min-h-[340px]"
            >
              {/* Card Background Image: Low opacity background acting as texture rather than a separate image */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <img
                  src={card.imageSrc}
                  alt={card.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-15 group-hover:opacity-30 transition-opacity duration-500 scale-105 group-hover:scale-110 filter brightness-90 contrast-110"
                />
                {/* Gradient overlay to ensure optimal text contrast over the card background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a120c]/85 via-[#060a07]/80 to-[#040604]/92" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(163,230,53,0.08),transparent_70%)]" />
              </div>

              {/* Card Content sitting on top */}
              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold tracking-wider uppercase text-[#a3e635]">
                        {card.kicker}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a3e635]/15 border border-[#a3e635]/35 text-[#bef264] font-bold shadow-sm">
                        {card.highlightBadge}
                      </span>
                    </div>
                    <div className="aurix-3d-icon-box w-9 h-9 rounded-xl flex items-center justify-center text-[#a3e635] shrink-0">
                      <Icon className="w-4 h-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2.5 group-hover:text-[#bef264] transition-colors drop-shadow-sm">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Tags & Action Button */}
                <div className="space-y-4 pt-4 border-t border-white/10 mt-auto">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {card.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1.5 text-neutral-300 text-[11px] bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigate(card.id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-100 aurix-3d-glass-btn flex items-center justify-between group/btn cursor-pointer"
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowRight className="w-4 h-4 text-[#a3e635] transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
