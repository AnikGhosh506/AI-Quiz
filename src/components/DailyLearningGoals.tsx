import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle2, Calendar, Target, Plus, Trophy, Sparkles } from 'lucide-react';
import { playHoverSound } from '../utils/audioEffects';

interface DailyLearningGoalsProps {
  onTakeTest: () => void;
}

export const DailyLearningGoals: React.FC<DailyLearningGoalsProps> = ({ onTakeTest }) => {
  const [dailyTarget, setDailyTarget] = useState<number>(2); // 2 tests per day
  const [completedToday, setCompletedToday] = useState<number>(1);
  const [streakCount, setStreakCount] = useState<number>(7);

  // Generate 28-day heat map history data
  const [heatMapData, setHeatMapData] = useState<
    { date: string; dayNum: number; completed: number; target: number }[]
  >([]);

  useEffect(() => {
    // Generate simulated 28-day study consistency data
    const days = [];
    const now = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const isPastActive = i === 0 ? completedToday : Math.random() > 0.25 ? Math.floor(Math.random() * 3) + 1 : 0;
      days.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayNum: d.getDate(),
        completed: isPastActive,
        target: dailyTarget,
      });
    }
    setHeatMapData(days);
  }, [dailyTarget, completedToday]);

  const handleIncrementToday = () => {
    playHoverSound('pop');
    setCompletedToday((prev) => prev + 1);
  };

  const isGoalMetToday = completedToday >= dailyTarget;

  return (
    <div className="w-full my-8 p-6 sm:p-8 rounded-3xl aurix-3d-card border border-[#a3e635]/30 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full aurix-3d-glass-btn text-xs text-[#bef264] font-semibold mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>Daily Consistency & Goals</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight aurix-3d-heading">
            Daily Learning Goals & Activity Heat Map
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300">
            Set daily targets, maintain your study streak, and view your 28-day study consistency grid.
          </p>
        </div>

        {/* Active Streak Badge */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-950/60 to-[#142316] border border-orange-500/50 flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.25)]">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-pulse" />
            <div>
              <span className="text-xs font-black text-white block leading-tight">
                {streakCount}-Day Streak!
              </span>
              <span className="text-[10px] text-orange-300">Active Study Habit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Today's Goal Progress */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-[#122014] to-[#080d09] border border-[#a3e635]/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Today&apos;s Target Status
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-neutral-300 font-medium">Target:</span>
              <select
                value={dailyTarget}
                onChange={(e) => setDailyTarget(parseInt(e.target.value))}
                className="px-2 py-1 rounded-lg bg-[#080d09] border border-[#a3e635]/40 text-xs text-[#bef264] font-bold cursor-pointer"
              >
                <option value={1}>1 Test / Day</option>
                <option value={2}>2 Tests / Day</option>
                <option value={3}>3 Tests / Day</option>
                <option value={4}>4 Tests / Day</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">
                Completed: <strong className="text-white">{completedToday}</strong> / {dailyTarget} Tests
              </span>
              <span className="font-extrabold text-[#bef264] font-mono">
                {Math.min(100, Math.round((completedToday / dailyTarget) * 100))}%
              </span>
            </div>

            <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#84cc16] via-[#a3e635] to-[#bef264] rounded-full transition-all duration-500 shadow-[0_0_10px_#a3e635]"
                style={{ width: `${Math.min(100, (completedToday / dailyTarget) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onTakeTest}
              className="flex-1 aurix-3d-button py-2.5 px-4 rounded-xl text-xs font-extrabold text-[#040604] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Take Test Now</span>
            </button>

            <button
              onClick={handleIncrementToday}
              className="px-3.5 py-2.5 rounded-xl aurix-3d-glass-btn text-xs font-bold text-[#bef264] flex items-center gap-1.5 cursor-pointer"
              title="Log completed study session"
            >
              <Plus className="w-4 h-4" />
              <span>Log Session</span>
            </button>
          </div>
        </div>

        {/* Right Column: 28-Day Consistency Heat Map Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-300">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#a3e635]" />
              <span>28-Day Study Consistency Heat Map</span>
            </span>
            <span className="text-[11px] text-neutral-400">Dark = Rest · Bright Lime = Target Met</span>
          </div>

          {/* Grid Tiles */}
          <div className="grid grid-cols-7 gap-2 p-4 rounded-2xl bg-[#080d09] border border-white/10">
            {heatMapData.map((day, idx) => {
              const intensity =
                day.completed === 0
                  ? 'bg-neutral-900 border-white/5'
                  : day.completed >= day.target
                  ? 'bg-[#a3e635] border-[#bef264] shadow-[0_0_8px_rgba(163,230,53,0.5)]'
                  : 'bg-[#153018] border-[#a3e635]/40 text-[#bef264]';

              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-lg border p-1 flex flex-col items-center justify-between text-center transition-all hover:scale-110 cursor-pointer ${intensity}`}
                  title={`${day.date}: ${day.completed} completed`}
                >
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      day.completed >= day.target ? 'text-[#040604]' : 'text-neutral-400'
                    }`}
                  >
                    {day.dayNum}
                  </span>
                  {day.completed > 0 && (
                    <span
                      className={`text-[9px] font-black ${
                        day.completed >= day.target ? 'text-[#040604]' : 'text-[#a3e635]'
                      }`}
                    >
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
