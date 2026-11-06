import React from 'react';
import { Sparkles, ArrowRight, Zap, Target, AlertCircle, ShieldCheck } from 'lucide-react';
import { QuizResult } from '../data/quizData';
import { StudentUser } from '../services/authService';
import { playHoverSound } from '../utils/audioEffects';

interface AIRecommendedDailyQuizProps {
  currentUser: StudentUser | null;
  quizResults?: QuizResult[];
  onStartQuiz: (classLevel: string, subject: string, chapter: string) => void;
}

export const AIRecommendedDailyQuiz: React.FC<AIRecommendedDailyQuizProps> = ({
  currentUser,
  quizResults = [],
  onStartQuiz,
}) => {
  // Analyze past performance to determine weak subject & chapter
  let recommendedClass = currentUser?.classLevel || 'Class 10';
  let recommendedSubject = 'Physics';
  let recommendedChapter = 'Electricity & Circuits';
  let weakReason = 'Based on your recent diagnostic tests, Electricity & Circuits needs a quick 5-min refresher.';

  if (quizResults.length > 0) {
    const weakMap: Record<string, number> = {};
    quizResults.forEach((res) => {
      res.topicsToPractise.forEach((t) => {
        if (t !== 'All answers were correct!') {
          weakMap[t] = (weakMap[t] || 0) + 1;
        }
      });
    });

    const sortedWeak = Object.keys(weakMap).sort((a, b) => weakMap[b] - weakMap[a]);
    if (sortedWeak.length > 0) {
      const topWeakTopic = sortedWeak[0];
      weakReason = `Targeted AI recommendation to strengthen your recall in "${topWeakTopic}".`;
      if (topWeakTopic.toLowerCase().includes('math') || topWeakTopic.toLowerCase().includes('quadratic')) {
        recommendedSubject = 'Mathematics';
        recommendedChapter = 'Quadratic Equations';
      } else if (topWeakTopic.toLowerCase().includes('chem') || topWeakTopic.toLowerCase().includes('acid')) {
        recommendedSubject = 'Chemistry';
        recommendedChapter = 'Acids, Bases & Salts';
      } else if (topWeakTopic.toLowerCase().includes('bio') || topWeakTopic.toLowerCase().includes('life')) {
        recommendedSubject = 'Biology';
        recommendedChapter = 'Life Processes';
      }
    }
  }

  const handleStart = () => {
    playHoverSound('pop');
    onStartQuiz(recommendedClass, recommendedSubject, recommendedChapter);
  };

  return (
    <div className="my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="aurix-3d-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#122415] via-[#09140b] to-[#040604] border border-[#a3e635]/40 shadow-2xl text-left relative overflow-hidden">
        {/* Ambient Glow Spotlight */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3e635]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Recommendation Info */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/40 text-xs text-[#bef264] font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>AI Personalized Daily Practice</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight aurix-3d-heading">
              AI-Recommended Daily Quiz
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {weakReason} Completing this 5-question sprint boosts subject mastery and protects your daily streak.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="px-3 py-1 rounded-xl bg-[#080d09] border border-[#a3e635]/30 text-white font-bold">
                {recommendedClass}
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#080d09] border border-white/10 text-[#bef264] font-semibold">
                Subject: {recommendedSubject}
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#080d09] border border-white/10 text-neutral-300">
                Chapter: {recommendedChapter}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                +15% Target Boost
              </span>
            </div>
          </div>

          {/* Start Button */}
          <div className="shrink-0">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto aurix-3d-button px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(163,230,53,0.35)] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#040604] fill-[#040604]" />
              <span>Take AI Recommended Quiz (5 Mins)</span>
              <ArrowRight className="w-4 h-4 text-[#040604]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
