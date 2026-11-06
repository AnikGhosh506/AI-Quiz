import React, { useState } from 'react';
import { Award, ShieldCheck, Trophy, Sparkles, BookOpen, Brain, CheckCircle2, Lock, ChevronRight, Target } from 'lucide-react';
import { QuizResult } from '../data/quizData';

interface KnowledgeMilestonesProps {
  quizResults: QuizResult[];
  onSelectMilestoneTest?: (topicName: string) => void;
}

export const KnowledgeMilestones: React.FC<KnowledgeMilestonesProps> = ({
  quizResults,
  onSelectMilestoneTest,
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const completedCount = quizResults.length;
  const totalCorrect = quizResults.reduce((acc, r) => acc + r.correctCount, 0);

  const milestones = [
    {
      id: 'm1',
      title: 'Platform Pioneer',
      subtitle: 'Student Profile & Verification',
      badgeIcon: ShieldCheck,
      required: 0,
      isUnlocked: true,
      category: 'Onboarding',
      description: 'Verified student credentials and activated institutional access.',
      unlockedDate: 'Day 1',
      points: '+100 XP',
    },
    {
      id: 'm2',
      title: 'Diagnostic Achiever',
      subtitle: 'First Assessment Completed',
      badgeIcon: BookOpen,
      required: 1,
      isUnlocked: completedCount >= 1,
      category: 'Assessment',
      description: 'Completed first chapter test and reviewed step-by-step solutions.',
      unlockedDate: completedCount >= 1 ? 'Unlocked' : '1 Test Required',
      points: '+250 XP',
    },
    {
      id: 'm3',
      title: 'Accuracy Specialist',
      subtitle: 'High Accuracy Master',
      badgeIcon: Target,
      required: 3,
      isUnlocked: completedCount >= 3 || totalCorrect >= 15,
      category: 'Precision',
      description: 'Achieved high accuracy across multiple science & math tests.',
      unlockedDate: completedCount >= 3 || totalCorrect >= 15 ? 'Unlocked' : '3 Tests Required',
      points: '+500 XP',
    },
    {
      id: 'm4',
      title: 'Tactical Mind Champion',
      subtitle: 'Brain Games & Logic',
      badgeIcon: Brain,
      required: 5,
      isUnlocked: completedCount >= 5 || totalCorrect >= 25,
      category: 'Strategy',
      description: 'Mastered chess tactics, speed math sprints, and cognitive riddles.',
      unlockedDate: completedCount >= 5 || totalCorrect >= 25 ? 'Unlocked' : '5 Tests Required',
      points: '+750 XP',
    },
    {
      id: 'm5',
      title: 'Olympiad Contender',
      subtitle: 'All-India Competition Tier',
      badgeIcon: Trophy,
      required: 8,
      isUnlocked: completedCount >= 8 || totalCorrect >= 40,
      category: 'Excellence',
      description: 'Ranked in weekly national student competitions and earned gold medal.',
      unlockedDate: completedCount >= 8 || totalCorrect >= 40 ? 'Unlocked' : '8 Tests Required',
      points: '+1,200 XP',
    },
  ];

  const activeMilestone = milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];

  return (
    <div className="w-full my-8 p-6 sm:p-8 rounded-3xl aurix-3d-card border border-[#a3e635]/30 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full aurix-3d-glass-btn text-xs text-[#bef264] font-semibold mb-1">
            <Award className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Graphical Learning Path</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight aurix-3d-heading">
            Knowledge Milestones & Proficiency Timeline
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300">
            Track your academic progress through graphical milestone nodes and earned badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#bef264] px-3 py-1.5 rounded-xl bg-[#142618] border border-[#a3e635]/40 shadow-sm">
            {milestones.filter((m) => m.isUnlocked).length} / {milestones.length} Milestones Unlocked
          </span>
        </div>
      </div>

      {/* Horizontal Graphical Timeline */}
      <div className="relative pt-6 pb-4 overflow-x-auto no-scrollbar">
        {/* Connecting Progress Line */}
        <div className="absolute top-[4.5rem] left-10 right-10 h-1 bg-neutral-800 rounded-full pointer-events-none z-0">
          <div
            className="h-full bg-gradient-to-r from-[#84cc16] via-[#a3e635] to-[#bef264] rounded-full transition-all duration-700 shadow-[0_0_12px_#a3e635]"
            style={{
              width: `${(milestones.filter((m) => m.isUnlocked).length / (milestones.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Nodes Grid */}
        <div className="relative z-10 flex items-center justify-between min-w-[650px] px-4">
          {milestones.map((m, idx) => {
            const Icon = m.badgeIcon;
            const isSelected = selectedMilestoneId === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setSelectedMilestoneId(m.id)}
                className="flex flex-col items-center group cursor-pointer text-center max-w-[120px] transition-transform"
              >
                {/* Milestone Node Circle */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 mb-2 relative ${
                    m.isUnlocked
                      ? isSelected
                        ? 'aurix-3d-button text-[#040604] scale-110 shadow-[0_0_25px_rgba(163,230,53,0.6)]'
                        : 'aurix-3d-glass-btn text-[#bef264] border-[#a3e635] group-hover:scale-105'
                      : 'bg-[#0a100b] border border-white/10 text-neutral-600'
                  }`}
                >
                  {m.isUnlocked ? (
                    <Icon className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                  ) : (
                    <Lock className="w-5 h-5 text-neutral-600" />
                  )}

                  {/* Badge Status Indicator */}
                  {m.isUnlocked && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#bef264] border-2 border-[#040604] flex items-center justify-center text-[9px] text-[#040604] font-black">
                      ✓
                    </span>
                  )}
                </div>

                {/* Node Title & Points */}
                <span
                  className={`text-xs font-bold leading-snug line-clamp-1 ${
                    m.isUnlocked ? 'text-white group-hover:text-[#bef264]' : 'text-neutral-500'
                  }`}
                >
                  {m.title}
                </span>

                <span
                  className={`text-[10px] font-mono mt-0.5 ${
                    m.isUnlocked ? 'text-[#a3e635]' : 'text-neutral-600'
                  }`}
                >
                  {m.points}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Detail Spotlight Card */}
      {activeMilestone && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#122014] to-[#080d09] border border-[#a3e635]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="aurix-3d-icon-box w-12 h-12 rounded-2xl flex items-center justify-center text-[#a3e635] shrink-0">
              <activeMilestone.badgeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#a3e635]/20 border border-[#a3e635]/40 text-[#bef264]">
                  {activeMilestone.category} Milestone
                </span>
                <span className="text-xs text-neutral-400 font-mono">{activeMilestone.unlockedDate}</span>
              </div>
              <h3 className="text-lg font-extrabold text-white">{activeMilestone.title}</h3>
              <p className="text-xs text-neutral-300 mt-0.5">{activeMilestone.description}</p>
            </div>
          </div>

          {onSelectMilestoneTest && (
            <button
              onClick={() => onSelectMilestoneTest(activeMilestone.title)}
              className="aurix-3d-button px-5 py-2.5 rounded-xl text-xs font-extrabold text-[#040604] shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Practise Topic</span>
              <ChevronRight className="w-4 h-4 text-[#040604]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
