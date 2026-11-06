import React, { useState } from 'react';
import { Trophy, Award, Users, Calendar, ArrowRight, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import { StudentUser } from '../services/authService';

interface CompetitionsViewProps {
  currentUser: StudentUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onTakeTest: () => void;
  onBack?: () => void;
}

export const CompetitionsView: React.FC<CompetitionsViewProps> = ({
  currentUser,
  onOpenAuth,
  onTakeTest,
  onBack,
}) => {
  const [registeredCompetitions, setRegisteredCompetitions] = useState<string[]>([]);

  const upcomingEvents = [
    {
      id: 'weekly_math',
      title: 'Weekly All-India Math Olympiad Sprint',
      targetClass: 'Classes 8 to 10',
      date: 'This Sunday · 11:00 AM IST',
      format: '25 Questions · 30 Minutes',
      participants: '1,420 registered',
      badge: 'Championship Cup',
    },
    {
      id: 'science_cup',
      title: 'Science Discovery & Physics Challenge',
      targetClass: 'Classes 9 to 12',
      date: 'Next Saturday · 5:00 PM IST',
      format: '20 Questions · 25 Minutes',
      participants: '980 registered',
      badge: 'National Medal',
    },
    {
      id: 'junior_logic',
      title: 'Junior Cognitive Logic & Speed Cup',
      targetClass: 'Classes 6 to 8',
      date: 'Every Wednesday · 6:00 PM IST',
      format: '15 Puzzles · 20 Minutes',
      participants: '650 registered',
      badge: 'Rising Star',
    },
  ];

  const handleRegister = (id: string) => {
    if (!currentUser) {
      onOpenAuth('signup');
      return;
    }
    if (!registeredCompetitions.includes(id)) {
      setRegisteredCompetitions((prev) => [...prev, id]);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back Button to Previous Page */}
      {onBack && (
        <div className="mb-4 text-left">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0e1610] hover:bg-[#142316] border border-white/15 hover:border-[#a3e635]/50 text-xs font-semibold text-neutral-300 hover:text-[#bef264] transition-all cursor-pointer group shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#a3e635] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Previous Page</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full aurix-3d-glass-btn text-xs text-[#bef264] font-semibold mb-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Join Competitions · Test Your Mettle</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight aurix-3d-heading">
            Competitions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Compete with students across Classes 6 to 12 in weekly timed subject tournaments.
          </p>
        </div>

        <button
          onClick={onTakeTest}
          className="aurix-3d-button px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center gap-1.5 cursor-pointer"
        >
          <span>Practise Before Competing</span>
          <ArrowRight className="w-4 h-4 text-[#040604]" />
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-white drop-shadow-sm">Upcoming Tournaments</h2>
        <div className="grid grid-cols-1 gap-4">
          {upcomingEvents.map((event) => {
            const isRegistered = registeredCompetitions.includes(event.id);
            return (
              <div
                key={event.id}
                className="aurix-3d-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#bef264] px-2.5 py-0.5 rounded-md bg-[#142316] border border-[#a3e635]/40 shadow-sm">
                      {event.targetClass}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#a3e635]" />
                      {event.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white drop-shadow-sm">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span>{event.format}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#a3e635] font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      {event.participants}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  {isRegistered ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 px-4 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                      <Check className="w-4 h-4" />
                      <span>Registered</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="aurix-3d-button px-5 py-2.5 rounded-xl text-xs font-extrabold text-[#040604] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Join Competition</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#040604]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hall of Fame / Leaderboard Section */}
      <div className="aurix-glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#a3e635]" />
            <span>Weekly Class Champions</span>
          </h3>
          <span className="text-xs text-neutral-400">Live National Standing</span>
        </div>

        <div className="space-y-2.5">
          {[
            { rank: 1, name: 'Aarav Patel', class: 'Class 10', school: 'DPS R.K. Puram', score: '98% (29m 12s)' },
            { rank: 2, name: 'Ananya Sharma', class: 'Class 10', school: 'Modern School Barakhamba', score: '96% (28m 44s)' },
            { rank: 3, name: 'Rohan Iyer', class: 'Class 9', school: 'National Public School', score: '94% (29m 01s)' },
          ].map((leader) => (
            <div
              key={leader.rank}
              className="p-3.5 rounded-xl bg-[#0a100b] border border-white/5 flex items-center justify-between text-xs sm:text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    leader.rank === 1
                      ? 'bg-amber-400 text-black'
                      : leader.rank === 2
                      ? 'bg-slate-300 text-black'
                      : 'bg-amber-700 text-white'
                  }`}
                >
                  {leader.rank}
                </span>
                <div>
                  <span className="font-bold text-white block">{leader.name}</span>
                  <span className="text-[11px] text-neutral-400">{leader.school} · {leader.class}</span>
                </div>
              </div>
              <span className="font-mono font-bold text-[#bef264]">{leader.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
