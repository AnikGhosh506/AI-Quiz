import React, { useState, useEffect } from 'react';
import { QuizResult } from '../data/quizData';
import { StudentUser, authService } from '../services/authService';
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
} from 'lucide-react';

interface MyProgressViewProps {
  currentUser: StudentUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onTakeTest: () => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
  currentUser,
  onOpenAuth,
  onTakeTest,
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
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/30 text-xs text-[#bef264] font-medium mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>My Learning Progress</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Check Your Progress
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            See your recent test scores, strongest topics, and what to practise next.
          </p>
        </div>

        <button
          onClick={onTakeTest}
          className="aurix-pill-button px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <span>Take a Test</span>
          <ArrowRight className="w-4 h-4 text-[#040604]" />
        </button>
      </div>

      {/* Account Status Card */}
      {!currentUser ? (
        <div className="mb-6 p-4 rounded-2xl bg-[#0f1711] border border-[#a3e635]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#142316] text-[#a3e635] flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <p className="text-neutral-200">
              You are currently viewing guest progress. <strong>Create a free student account</strong> to permanently save your scores across devices.
            </p>
          </div>
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#040604] bg-[#a3e635] hover:bg-[#bef264] shrink-0"
          >
            Create Free Account
          </button>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-2xl bg-[#0e1710] border border-white/10 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16]" />
            <span className="text-white font-medium">
              Student: <strong>{currentUser.name}</strong> · {currentUser.classLevel}
            </span>
          </div>
          <span className="text-neutral-400 text-xs">
            Joined {currentUser.joinedDate}
          </span>
        </div>
      )}

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
