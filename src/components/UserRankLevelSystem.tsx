import React from 'react';
import { Trophy, Award, Zap, Flame, ShieldCheck, Star, Sparkles, ChevronRight, Check } from 'lucide-react';
import { playHoverSound } from '../utils/audioEffects';

interface UserRankLevelSystemProps {
  totalTestsCompleted?: number;
  averageScore?: number;
  currentStreakDays?: number;
  totalPoints?: number;
}

interface BadgeItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export const UserRankLevelSystem: React.FC<UserRankLevelSystemProps> = ({
  totalTestsCompleted = 14,
  averageScore = 88,
  currentStreakDays = 7,
  totalPoints = 1840,
}) => {
  // Calculate Level and XP
  // Level formula: Level N = Math.floor(totalPoints / 150) + 1
  const currentLevel = Math.floor(totalPoints / 150) + 1;
  const xpCurrentLevel = totalPoints % 150;
  const xpNextLevel = 150;
  const levelProgressPercent = Math.round((xpCurrentLevel / xpNextLevel) * 100);

  // Level Titles
  let rankTitle = 'Scholar Apprentice';
  if (currentLevel >= 15) rankTitle = 'Apex Mind Grandmaster';
  else if (currentLevel >= 12) rankTitle = 'Master Scholar';
  else if (currentLevel >= 8) rankTitle = 'Academic Expert';
  else if (currentLevel >= 5) rankTitle = 'Curious Scholar';

  // Badges list
  const badges: BadgeItem[] = [
    {
      id: 'badge_first_ace',
      title: 'First Test Ace',
      category: 'Test Excellence',
      description: 'Scored 80%+ on your first official practice exam.',
      icon: '🛡️',
      unlocked: totalTestsCompleted >= 1,
      unlockedDate: 'Oct 14',
    },
    {
      id: 'badge_speed_math',
      title: 'Speed Math Sprinted',
      category: 'Brain Games',
      description: 'Completed 60-second math sprint with 10+ correct answers.',
      icon: '⚡',
      unlocked: true,
      unlockedDate: 'Oct 20',
    },
    {
      id: 'badge_flame_keeper',
      title: '7-Day Flame Keeper',
      category: 'Consistency',
      description: 'Maintained 7 consecutive days of practice tests.',
      icon: '🔥',
      unlocked: currentStreakDays >= 7,
      unlockedDate: 'Nov 02',
    },
    {
      id: 'badge_national_cup',
      title: 'National Cup Top 5',
      category: 'Competitions',
      description: 'Ranked in the top 5 students on the national leaderboard.',
      icon: '🏆',
      unlocked: totalPoints >= 1500,
      unlockedDate: 'Nov 05',
    },
    {
      id: 'badge_grandmaster',
      title: 'Physics Grandmaster',
      category: 'Subject Mastery',
      description: 'Achieved >90% average score in Class 10 Physics.',
      icon: '👑',
      unlocked: averageScore >= 85,
      unlockedDate: 'Nov 06',
    },
    {
      id: 'badge_perfect_centum',
      title: 'Centum Perfect 100',
      category: 'Flawless Score',
      description: 'Scored a perfect 100% on a full chapter assessment.',
      icon: '🎯',
      unlocked: totalPoints >= 1800,
      unlockedDate: 'Nov 06',
    },
  ];

  return (
    <div className="my-8 aurix-3d-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c160e] via-[#09100a] to-[#040604] border border-[#a3e635]/40 shadow-2xl text-left space-y-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3e635]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Rank Level Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#142618] border border-[#a3e635] flex flex-col items-center justify-center text-[#a3e635] shrink-0 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
            <span className="text-[10px] uppercase font-bold text-[#bef264]">LEVEL</span>
            <span className="text-2xl font-extrabold text-white leading-none">{currentLevel}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#142316] text-[#bef264] border border-[#a3e635]/40 uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#a3e635]" />
                <span>Student Level &amp; Rank</span>
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {totalPoints} Total XP
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {rankTitle}
            </h2>
            <p className="text-xs text-neutral-300">
              Earn XP points by taking practice tests, solving doubts, and playing brain games.
            </p>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full md:w-64 space-y-1.5 p-3 rounded-2xl bg-[#080d09] border border-white/10 shrink-0">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-neutral-300">Progress to Level {currentLevel + 1}</span>
            <span className="text-[#bef264] font-mono">{xpCurrentLevel}/{xpNextLevel} XP</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#040604] overflow-hidden border border-white/10 relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#84cc16] to-[#bef264] transition-all duration-700 shadow-[0_0_12px_#a3e635]"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-neutral-400 text-right block">
            {150 - xpCurrentLevel} XP needed to unlock next rank badge
          </span>
        </div>
      </div>

      {/* Unlockable Achievement Badges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#a3e635]" />
            <span>Unlockable Visual Achievement Badges ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
          </h3>
          <span className="text-xs text-[#bef264] font-semibold">
            All Badges Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              onMouseEnter={() => playHoverSound('hiss')}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 relative ${
                b.unlocked
                  ? 'bg-[#0f1b11] border-[#a3e635]/40 hover:border-[#a3e635] shadow-md'
                  : 'bg-[#070c08] border-white/10 opacity-50 grayscale'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-xl shrink-0">
                {b.icon}
              </div>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-extrabold text-white truncate">{b.title}</span>
                  {b.unlocked && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                      ✓ UNLOCKED
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-[#a3e635] font-semibold block">{b.category}</span>
                <p className="text-[11px] text-neutral-300 leading-snug line-clamp-2">{b.description}</p>

                {b.unlockedDate && (
                  <span className="text-[9px] text-neutral-400 block pt-1 font-mono">
                    Unlocked: {b.unlockedDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
