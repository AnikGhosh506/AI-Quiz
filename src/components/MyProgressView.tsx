import React, { useState, useEffect } from 'react';
import { QuizResult } from '../data/quizData';
import { StudentUser, authService } from '../services/authService';
import { KnowledgeMilestones } from './KnowledgeMilestones';
import { SubjectRadarChart } from './SubjectRadarChart';
import { DailyLearningGoals } from './DailyLearningGoals';
import { SubjectMasteryDeepDive } from './SubjectMasteryDeepDive';
import { StreakRiskReminder } from './StreakRiskReminder';
import { UserRankLevelSystem } from './UserRankLevelSystem';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  QrCode,
  Edit3,
  Users,
  HeartHandshake,
  School as SchoolIcon,
  ArrowLeft,
} from 'lucide-react';

interface MyProgressViewProps {
  currentUser: StudentUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onTakeTest: () => void;
  onOpenEditProfile?: () => void;
  onOpenSwitchAccount?: () => void;
  onOpenParentLogin?: () => void;
  onBack?: () => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
  currentUser,
  onOpenAuth,
  onTakeTest,
  onOpenEditProfile,
  onOpenSwitchAccount,
  onOpenParentLogin,
  onBack,
}) => {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const list = authService.getQuizResults();
    setResults(list);
  }, []);

  const totalTests = results.length;
  const averageScore =
    totalTests > 0
      ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / totalTests)
      : 0;

  const totalCorrect = results.reduce((acc, r) => acc + r.correctCount, 0);
  const totalQuestions = results.reduce((acc, r) => acc + r.totalQuestions, 0);

  // Aggregate topics
  const strongTopicSet = new Set<string>();
  const weakTopicSet = new Set<string>();

  results.forEach((r) => {
    r.strongTopics.forEach((t) => strongTopicSet.add(t));
    r.topicsToPractise.forEach((t) => {
      if (t !== 'All answers were correct!') {
        weakTopicSet.add(t);
      }
    });
  });

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your test history?')) {
      authService.clearQuizResults();
      setResults([]);
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
            <TrendingUp className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>My Learning Progress</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight aurix-3d-heading">
            Check Your Progress
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            See your recent test scores, strongest topics, and what to practise next.
          </p>
        </div>

        <button
          onClick={onTakeTest}
          className="aurix-3d-button px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center gap-1.5 cursor-pointer"
        >
          <span>Take a Test</span>
          <ArrowRight className="w-4 h-4 text-[#040604]" />
        </button>
      </div>

      {/* Account Status & Verified Student ID Card */}
      {!currentUser ? (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl aurix-3d-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl aurix-3d-icon-box text-[#a3e635] flex items-center justify-center shrink-0">
              <User className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            </div>
            <div>
              <p className="text-white font-medium">
                You are currently viewing guest progress.
              </p>
              <p className="text-neutral-400 text-xs mt-0.5">
                Register with your school ID (digital or manual verification) to save scores and unlock full AI tutor perks.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('signup')}
            className="aurix-3d-button px-4 py-2 rounded-xl text-xs font-extrabold text-[#040604] shrink-0 cursor-pointer"
          >
            Verify Student ID
          </button>
        </div>
      ) : (
        <div className="mb-8 aurix-3d-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#a3e635]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Verification Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#142316] border border-[#a3e635]/40 flex items-center justify-center text-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Official Student ID Card
                </span>
                <span className="text-[11px] text-[#bef264]">
                  {currentUser.verificationMethod === 'ai_digital' ? 'Real-Time AI Verified School ID' : 'Verified Student ID'} · Active Session
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-[#a3e635]/20 border border-[#a3e635]/40 text-[#bef264]">
                ✓ AI VERIFIED
              </span>
              <span className="text-xs text-neutral-400">
                Joined {currentUser.joinedDate}
              </span>
            </div>
          </div>

          {/* ID Card Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {currentUser.name}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#162919] text-[#a3e635] border border-[#a3e635]/30">
                  {currentUser.classLevel}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                <SchoolIcon className="w-4 h-4 text-[#a3e635] shrink-0" />
                <span className="font-medium text-white">{currentUser.schoolName || 'Delhi Public School'}</span>
                {currentUser.schoolBoard && (
                  <span className="text-neutral-400 text-xs">({currentUser.schoolBoard})</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                <span>Roll No: <strong className="text-neutral-200">{currentUser.rollNumber || '14'}</strong></span>
                <span>•</span>
                <span>ID Code: <strong className="font-mono text-[#bef264]">{currentUser.studentIdNumber || 'AURIX-2026-9284'}</strong></span>
                {currentUser.schoolCity && (
                  <>
                    <span>•</span>
                    <span>City: <strong className="text-neutral-200">{currentUser.schoolCity}</strong></span>
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-4 flex items-center md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
              <div className="p-2 rounded-xl bg-[#09100a] border border-[#a3e635]/30 flex items-center justify-center shadow-inner">
                <QrCode className="w-12 h-12 text-[#a3e635] opacity-90" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">ID Pass</span>
                <span className="text-xs font-bold text-white block">AURIX Verified</span>
                <span className="text-[10px] text-[#bef264]">Academic 2026–27</span>
              </div>
            </div>
          </div>

          {/* Student Profile Action Bar: Edit Credentials, Switch Account, Parental Login */}
          <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {onOpenEditProfile && (
                <button
                  onClick={onOpenEditProfile}
                  className="px-3 py-1.5 rounded-xl bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-xs font-semibold text-[#bef264] flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#a3e635]" />
                  <span>Edit Credentials (Class, Name, School, Board, City, Roll)</span>
                </button>
              )}

              {onOpenSwitchAccount && (
                <button
                  onClick={onOpenSwitchAccount}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#a3e635]" />
                  <span>Switch Account</span>
                </button>
              )}
            </div>

            {onOpenParentLogin && (
              <button
                onClick={onOpenParentLogin}
                className="px-3 py-1.5 rounded-xl bg-[#0d160f] hover:bg-[#142316] border border-[#a3e635]/30 text-xs font-semibold text-[#bef264] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-[#a3e635]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Streak Risk Alert & PWA Notification Trigger */}
      <StreakRiskReminder currentStreakDays={7} onTakeTest={onTakeTest} />

      {/* User Rank & Level System with XP Progress Bar and Visual Badges */}
      <UserRankLevelSystem
        totalTestsCompleted={totalTests}
        averageScore={averageScore}
        currentStreakDays={7}
        totalPoints={1840}
      />

      {/* Knowledge Milestones Timeline */}
      <KnowledgeMilestones quizResults={results} onSelectMilestoneTest={() => onTakeTest()} />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
          <span className="text-xs text-neutral-400 block mb-1">Tests Completed</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalTests}
          </span>
        </div>

        <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 border border-[#a3e635]/25 text-center">
          <span className="text-xs text-neutral-400 block mb-1">Average Score</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#bef264]">
            {averageScore}%
          </span>
        </div>

        <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 border border-white/10 text-center">
          <span className="text-xs text-neutral-400 block mb-1">Total Questions</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalQuestions}
          </span>
        </div>

        <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 border border-emerald-500/20 text-center">
          <span className="text-xs text-neutral-400 block mb-1">Correct Answers</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {totalCorrect}
          </span>
        </div>
      </div>

      {/* Daily Learning Goals & 28-Day Consistency Heat Map */}
      <DailyLearningGoals onTakeTest={onTakeTest} />

      {/* Subject Mastery Deep-Dive with 30-Day Sparkline Graphs */}
      <SubjectMasteryDeepDive quizResults={results} />

      {/* Knowledge Gap Analysis Spider Radar Chart */}
      <SubjectRadarChart quizResults={results} />

      {totalTests === 0 ? (
        /* Empty State */
        <div className="aurix-glass-card rounded-2xl p-8 sm:p-12 text-center border border-white/10 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#142316] border border-[#a3e635]/30 text-[#a3e635] flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">
            No Test Results Recorded Yet
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
            Start with our quick 5-question demo test or select your specific class chapter to see your learning progress here.
          </p>
          <div className="pt-2">
            <button
              onClick={onTakeTest}
              className="aurix-pill-button px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] inline-flex items-center gap-2"
            >
              <span>Take Your First Test</span>
              <ArrowRight className="w-4 h-4 text-[#040604]" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Diagnostic Strengths & Topics to Practise */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="aurix-glass-card rounded-2xl p-5 border border-emerald-500/25 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                My Strongest Topics
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-200">
                {Array.from(strongTopicSet).slice(0, 6).map((topic, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="aurix-glass-card rounded-2xl p-5 border border-[#a3e635]/30 space-y-3">
              <span className="text-xs font-bold text-[#bef264] uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#a3e635]" />
                Topics I Need to Practise
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-200">
                {Array.from(weakTopicSet).slice(0, 6).map((topic, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Past Tests List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Recent Test History
              </h3>
              <button
                onClick={handleClearHistory}
                className="text-xs text-neutral-400 hover:text-red-300 transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="space-y-3">
              {results.map((res) => (
                <div
                  key={res.id}
                  className="aurix-glass-card rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {res.testTitle}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-[#a3e635]">
                        {res.classLevel}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400">
                      {res.date} · {res.correctCount} of {res.totalQuestions} correct
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-[#bef264]">
                        {res.score}%
                      </span>
                    </div>
                    <button
                      onClick={onTakeTest}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition-colors"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
