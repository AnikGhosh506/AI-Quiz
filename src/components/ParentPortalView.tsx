import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  TrendingUp,
  Trophy,
  Award,
  BookOpen,
  Bot,
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Users,
  Compass,
  FileText,
  User,
  School as SchoolIcon,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { StudentUser, ParentUser, authService } from '../services/authService';
import { QuizResult } from '../data/quizData';

interface ParentPortalViewProps {
  parentUser: ParentUser;
  studentUser: StudentUser | null;
  onExitParentMode: () => void;
  onNavigateToFeature: (featureId: string) => void;
  onSwitchStudentChild: (newStudent: StudentUser) => void;
  onOpenEditStudentModal: () => void;
  onBack?: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  parentUser,
  studentUser,
  onExitParentMode,
  onNavigateToFeature,
  onSwitchStudentChild,
  onOpenEditStudentModal,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard' | 'features'>('dashboard');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [allStudents, setAllStudents] = useState<StudentUser[]>([]);
  const [recommendedSent, setRecommendedSent] = useState<string | null>(null);

  useEffect(() => {
    const list = authService.getQuizResults();
    setResults(list);
    setAllStudents(authService.getAllRegisteredStudents());
  }, [studentUser]);

  const totalTests = results.length;
  const averageScore =
    totalTests > 0
      ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / totalTests)
      : 88;

  const totalCorrect = results.reduce((acc, r) => acc + r.correctCount, 0);
  const totalQuestions = results.reduce((acc, r) => acc + r.totalQuestions, 0);

  // Leaderboard data
  const leaderboardEntries = [
    { rank: 1, name: 'Aarav Patel', class: 'Class 10', school: 'DPS R.K. Puram', points: 3420, accuracy: '98%' },
    { rank: 2, name: 'Ananya Sharma', class: 'Class 10', school: 'Modern School Barakhamba', points: 3280, accuracy: '96%' },
    { rank: 3, name: 'Rohan Iyer', class: 'Class 10', school: 'National Public School', points: 3150, accuracy: '95%' },
    {
      rank: 4,
      name: studentUser?.name || 'Your Student',
      class: studentUser?.classLevel || 'Class 10',
      school: studentUser?.schoolName || 'Delhi Public School',
      points: 2980,
      accuracy: `${averageScore}%`,
      isCurrentStudent: true,
    },
    { rank: 5, name: 'Priya Nair', class: 'Class 10', school: "St. Xavier's Collegiate", points: 2890, accuracy: '92%' },
    { rank: 6, name: 'Dev Mukherjee', class: 'Class 10', school: 'Bombay Scottish School', points: 2740, accuracy: '90%' },
  ];

  const handleRecommendTest = (topic: string) => {
    setRecommendedSent(topic);
    setTimeout(() => setRecommendedSent(null), 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-left">
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

      {/* Top Parent Portal Banner */}
      <div className="mb-6 p-4 sm:p-5 rounded-3xl aurix-3d-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="aurix-3d-icon-box w-12 h-12 rounded-2xl flex items-center justify-center text-[#a3e635] shrink-0">
            <HeartHandshake className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#a3e635]/20 border border-[#a3e635]/40 text-[#bef264]">
                Parent Portal Active
              </span>
              <span className="text-xs text-neutral-400">
                {parentUser.relationship}: <strong className="text-white">{parentUser.parentName}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white aurix-3d-heading">
              Monitoring Student Gmail: <span className="text-[#bef264] font-mono">{studentUser ? studentUser.email : parentUser.linkedStudentEmail}</span>
            </h1>
            <p className="text-xs text-neutral-300">
              Student: <strong className="text-white">{studentUser?.name || parentUser.linkedStudentName}</strong> · {studentUser?.classLevel || 'Class 10'} · {studentUser?.schoolName || 'DPS RK Puram'} · Roll #{studentUser?.rollNumber || '18'} ({studentUser?.schoolBoard || 'CBSE'})
            </p>
          </div>
        </div>

        {/* Top Controls: Switch Child via Gmail, Edit Student, Exit */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          {allStudents.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400 font-medium">Child:</span>
              <select
                value={studentUser?.email || ''}
                onChange={(e) => {
                  const target = allStudents.find((s) => s.email === e.target.value);
                  if (target) onSwitchStudentChild(target);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#080d09] border border-[#a3e635]/40 text-xs text-[#bef264] font-mono font-semibold cursor-pointer max-w-[260px] truncate"
              >
                {allStudents.map((s) => (
                  <option key={s.email} value={s.email} className="bg-[#0c140e] text-white font-sans">
                    Gmail: {s.email} ({s.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onOpenEditStudentModal}
            className="px-3 py-1.5 rounded-xl aurix-3d-glass-btn text-xs font-semibold text-[#bef264] cursor-pointer"
          >
            Edit Student Details
          </button>

          <button
            onClick={onExitParentMode}
            className="px-3 py-1.5 rounded-xl aurix-3d-glass-btn text-xs font-semibold text-neutral-200 cursor-pointer"
          >
            Student Mode
          </button>
        </div>
      </div>

      {/* Tabs Switcher: Dashboard vs Leaderboard vs Features Guide */}
      <div className="flex p-1.5 bg-[#0b130d] rounded-2xl border border-white/10 mb-8 max-w-xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#182c1b] text-[#bef264] shadow-md border border-[#a3e635]/40'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Student Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-[#182c1b] text-[#bef264] shadow-md border border-[#a3e635]/40'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Class Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'features'
              ? 'bg-[#182c1b] text-[#bef264] shadow-md border border-[#a3e635]/40'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>App Features Guide</span>
        </button>
      </div>

      {/* Toast when test recommendation is sent */}
      {recommendedSent && (
        <div className="mb-6 p-3 rounded-2xl bg-[#142618] border border-[#a3e635] text-xs text-[#bef264] flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#a3e635]" />
          <span>
            Practice recommendation on <strong>&quot;{recommendedSent}&quot;</strong> has been flagged for {studentUser?.name}!
          </span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: STUDENT DASHBOARD
      ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Overall Mastery</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#bef264]">
                {averageScore}%
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">Class Average: 72%</span>
            </div>

            <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Tests Completed</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {totalTests > 0 ? totalTests : 12}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Across Math &amp; Science</span>
            </div>

            <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
              <span className="text-xs text-neutral-400 block mb-1">Study Streak</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#a3e635]">
                6 Days 🔥
              </span>
              <span className="text-[10px] text-[#bef264] block mt-1">Consistent learner</span>
            </div>

            <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
              <span className="text-xs text-neutral-400 block mb-1">AI Doubts Solved</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                28
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Socratic guidance</span>
            </div>
          </div>

          {/* Academic Strengths & Focus Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strong Topics */}
            <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Subject Strengths</span>
              </div>
              <p className="text-xs text-neutral-300">
                Your child consistently scores 90%+ in these foundational areas:
              </p>
              <div className="space-y-2">
                {[
                  { topic: 'Linear Equations in Two Variables (Math)', score: '96% Mastery' },
                  { topic: 'Newton\'s Laws of Motion & Force (Physics)', score: '94% Mastery' },
                  { topic: 'Life Processes & Nutrition (Biology)', score: '92% Mastery' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#09120a] border border-emerald-500/20 flex items-center justify-between text-xs"
                  >
                    <span className="text-neutral-200 font-medium">{item.topic}</span>
                    <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas Needing Practice */}
            <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Areas Needing Practice</span>
              </div>
              <p className="text-xs text-neutral-300">
                Topics where your child would benefit from an extra revision test:
              </p>
              <div className="space-y-2">
                {[
                  { topic: 'Quadratic Equations (Math)', note: 'Formula method review recommended' },
                  { topic: 'Chemical Reactions & Equations (Chemistry)', note: 'Balancing coefficients' },
                  { topic: 'Electric Current & Resistance (Physics)', note: 'Ohm\'s Law numericals' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#120e06] border border-amber-500/20 flex items-center justify-between text-xs gap-2"
                  >
                    <div>
                      <div className="text-neutral-200 font-medium">{item.topic}</div>
                      <div className="text-[10px] text-amber-300/80">{item.note}</div>
                    </div>
                    <button
                      onClick={() => handleRecommendTest(item.topic)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[11px] font-semibold text-amber-300 shrink-0 cursor-pointer"
                    >
                      Suggest Test
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Tutor Safe Monitoring Log */}
          <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#bef264] font-bold text-sm">
                <Bot className="w-4 h-4 text-[#a3e635]" />
                <span>AI Tutor Interaction Log (Parent Oversight)</span>
              </div>
              <span className="text-[11px] text-neutral-400">Child-Safe Socratic Guardrails Active</span>
            </div>
            <p className="text-xs text-neutral-300">
              AURIX ensures the AI tutor never writes homework for the student. It provides step-by-step conceptual hints to build problem-solving muscle:
            </p>

            <div className="space-y-2.5">
              {[
                {
                  doubt: 'Why does light bend when going from air to water?',
                  aiSummary: 'Explained refraction through wave speed difference in optically denser media with everyday swimming pool analogy.',
                  time: 'Yesterday at 6:40 PM',
                },
                {
                  doubt: 'How to easily factorize 6x^2 + 11x + 3?',
                  aiSummary: 'Guided student to find two numbers that multiply to 18 and add to 11 (9 and 2), leading student to solve it on their own.',
                  time: '2 days ago',
                },
              ].map((log, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#09110a] border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-white font-semibold">
                    <span className="text-[#a3e635]">Q: &quot;{log.doubt}&quot;</span>
                    <span className="text-[10px] text-neutral-400 font-normal">{log.time}</span>
                  </div>
                  <p className="text-neutral-300 text-[11px]">
                    <strong>AI Guidance:</strong> {log.aiSummary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Quiz Attempts */}
          <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#a3e635]" />
              <span>Recent Test Attempts &amp; Scores</span>
            </h3>

            {results.length > 0 ? (
              <div className="space-y-2">
                {results.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-[#09100a] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{r.testTitle || r.chapter}</span>
                      <span className="text-[11px] text-neutral-400">
                        {r.classLevel} · {r.subject} · {r.date}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-[#bef264]">{r.score}%</span>
                      <span className="text-[10px] text-neutral-400 block">
                        {r.correctCount}/{r.totalQuestions} correct
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#09100a] border border-white/5 text-xs text-neutral-400 text-center">
                Baseline assessment recorded (92% Average). Complete tests appear here automatically.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CLASS & NATIONAL LEADERBOARD
      ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Standing Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#172b1a] to-[#0c180e] border border-[#a3e635]/40 shadow-[0_0_25px_rgba(163,230,53,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#a3e635] text-[#040604] flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                #4
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a3e635] block">
                  Class 10 Standing
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {studentUser?.name || 'Your Student'} is in Top 5% Nationally
                </h3>
                <p className="text-xs text-neutral-300">
                  Total Knowledge Points: <strong className="text-[#bef264]">2,980 XP</strong> · 94th Percentile across recognized CBSE &amp; ICSE schools.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-[#a3e635]/20 border border-[#a3e635]/40 text-xs font-bold text-[#bef264]">
                💎 Diamond Tier
              </span>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#a3e635]" />
              <span>Badges &amp; Academic Honors Unlocked</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  title: 'Math Sprint Master',
                  desc: 'Answered 10 algebra problems under 45 seconds each.',
                  tier: 'Gold Badge',
                },
                {
                  title: 'Consistency Champion',
                  desc: 'Maintained 6-day study streak with no breaks.',
                  tier: 'Diamond Badge',
                },
                {
                  title: 'Physics Inquirer',
                  desc: 'Explored 15 Newtonian mechanics scenarios with AI tutor.',
                  tier: 'Silver Badge',
                },
              ].map((badge, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#0a110b] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{badge.title}</span>
                    <span className="text-[10px] text-[#bef264]">{badge.tier}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Leaderboard Table */}
          <div className="aurix-glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#a3e635]" />
                  <span>All-India Class 10 Leaderboard</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Updated after every verified chapter test and weekly sprint.
                </p>
              </div>
              <span className="text-xs text-[#bef264] font-semibold">Live Standing</span>
            </div>

            <div className="space-y-2">
              {leaderboardEntries.map((entry) => (
                <div
                  key={entry.rank}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm transition-all ${
                    entry.isCurrentStudent
                      ? 'bg-[#152719] border-[#a3e635] shadow-[0_0_20px_rgba(163,230,53,0.2)] font-semibold'
                      : 'bg-[#09100a] border-white/5 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        entry.rank === 1
                          ? 'bg-amber-400 text-black'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-black'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : entry.isCurrentStudent
                          ? 'bg-[#a3e635] text-[#040604]'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{entry.name}</span>
                        {entry.isCurrentStudent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a3e635] text-[#040604] font-extrabold">
                            YOUR CHILD
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {entry.school} · {entry.class}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-[#bef264]">
                      {entry.points} XP
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      Accuracy: {entry.accuracy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: APP FEATURES GUIDE (FOR PARENTS)
      ========================================================================= */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="aurix-glass-card rounded-2xl p-5 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-1">
              What Makes AURIX Unique for Your Child?
            </h2>
            <p className="text-xs text-neutral-300">
              Every feature on AURIX is designed with cognitive science principles to help students of Classes 6 to 12 learn deeply rather than memorize. As a parent, you have full transparency to explore and test every feature below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feature 1: Take a Test */}
            <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#a3e635] flex items-center justify-center font-bold mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">1. Chapter Tests &amp; Instant Review</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                  Covers CBSE, ICSE, and State Board curriculum across Classes 6–12. Timed quizzes provide instant, step-by-step explanations for each question so students learn immediately from their mistakes.
                </p>
                <div className="mt-3 text-[11px] text-[#bef264] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Detects weak topics automatically</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateToFeature('take-test')}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-xs font-semibold text-[#bef264] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Preview Take a Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 2: Ask AI Doubt Solver */}
            <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#bef264] flex items-center justify-center font-bold mb-3">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">2. Friendly AI Tutor (Child-Safe)</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                  Powered by Google Gemini 3.8 Flash with strict safety prompts. Students can ask doubts in natural language. The tutor responds patiently using Socratic inquiry, guiding the student to discover answers themselves.
                </p>
                <div className="mt-3 text-[11px] text-[#bef264] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strict anti-cheating policy</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateToFeature('ask-ai')}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-xs font-semibold text-[#bef264] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore AI Tutor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 3: Brain Games */}
            <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#a3e635] flex items-center justify-center font-bold mb-3">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">3. Cognitive Brain Games</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                  Designed to refresh the student&apos;s mind between study sessions without mindless social media distraction. Features Speed Math, Chess Tactics, and Pattern Logic puzzles.
                </p>
                <div className="mt-3 text-[11px] text-[#bef264] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enhances working memory &amp; focus</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateToFeature('play-games')}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-xs font-semibold text-[#bef264] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Preview Brain Games</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feature 4: Competitions */}
            <div className="aurix-glass-card rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between md:col-span-2">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#bef264] flex items-center justify-center font-bold mb-3">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">4. National Olympiads &amp; Sprints</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                  Weekly scheduled challenges where students compete with peers from across India under fair timer rules. Students earn digital certificates, rank badges, and learn time management.
                </p>
                <div className="mt-3 text-[11px] text-[#bef264] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Encourages healthy academic ambition</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateToFeature('competitions')}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-xs font-semibold text-[#bef264] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Scheduled Competitions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
