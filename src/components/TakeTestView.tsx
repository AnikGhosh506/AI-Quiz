import React, { useState, useEffect } from 'react';
import {
  CLASSES_LIST,
  SUBJECTS_BY_CLASS,
  CHAPTERS_BY_SUBJECT,
  Question,
  getQuestionsForTest,
  DEMO_QUIZ_QUESTIONS,
  QuizResult,
} from '../data/quizData';
import { StudentUser, authService } from '../services/authService';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  Bookmark,
  Share2,
  Check,
} from 'lucide-react';

interface TakeTestViewProps {
  currentUser: StudentUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onViewProgress: () => void;
  onAskAIAboutQuestion?: (questionText: string) => void;
}

export const TakeTestView: React.FC<TakeTestViewProps> = ({
  currentUser,
  onOpenAuth,
  onViewProgress,
  onAskAIAboutQuestion,
}) => {
  // Setup state
  const [selectedClass, setSelectedClass] = useState<string>(
    currentUser?.classLevel || 'Class 10'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedChapter, setSelectedChapter] = useState<string>('Quadratic Equations');
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Active test state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 minutes
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [calculatedResult, setCalculatedResult] = useState<QuizResult | null>(null);

  // Update subjects & chapters when class changes
  useEffect(() => {
    const subjects = SUBJECTS_BY_CLASS[selectedClass] || [];
    if (subjects.length > 0 && !subjects.includes(selectedSubject)) {
      setSelectedSubject(subjects[0]);
    }
  }, [selectedClass]);

  useEffect(() => {
    const chapters =
      CHAPTERS_BY_SUBJECT[selectedClass]?.[selectedSubject] || [];
    if (chapters.length > 0) {
      setSelectedChapter(chapters[0]);
    }
  }, [selectedClass, selectedSubject]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTestActive && !isCompleted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, isCompleted, secondsRemaining]);

  // Start configured test
  const handleStartCustomTest = () => {
    const fetched = getQuestionsForTest(selectedClass, selectedSubject, selectedChapter, 5);
    setQuestions(fetched);
    setUserAnswers({});
    setCurrentIndex(0);
    setSecondsRemaining(300);
    setIsDemoMode(false);
    setIsTestActive(true);
    setIsCompleted(false);
    setSavedSuccess(false);
    setCalculatedResult(null);
  };

  // Start instant demo quiz (no login required)
  const handleStartDemoQuiz = () => {
    setQuestions(DEMO_QUIZ_QUESTIONS);
    setUserAnswers({});
    setCurrentIndex(0);
    setSecondsRemaining(300);
    setIsDemoMode(true);
    setIsTestActive(true);
    setIsCompleted(false);
    setSavedSuccess(false);
    setCalculatedResult(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleSkipQuestion = () => {
    // Leave answer undefined and move forward if possible
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Submit and compute results
  const handleSubmitTest = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const strongTopics: string[] = [];
    const weakTopics: string[] = [];

    const detailedQuestions = questions.map((q, idx) => {
      const selected = userAnswers[idx];
      const isSelected = selected !== undefined;
      const isCorr = isSelected && selected === q.correctAnswer;

      if (!isSelected) {
        skipped++;
        if (!weakTopics.includes(q.topic)) weakTopics.push(q.topic);
      } else if (isCorr) {
        correct++;
        if (!strongTopics.includes(q.topic)) strongTopics.push(q.topic);
      } else {
        wrong++;
        if (!weakTopics.includes(q.topic)) weakTopics.push(q.topic);
      }

      return {
        question: q,
        selectedAnswer: isSelected ? selected : null,
        isCorrect: isCorr,
      };
    });

    const scorePercentage = Math.round((correct / questions.length) * 100);

    const result: QuizResult = {
      id: 'quiz_' + Date.now(),
      testTitle: isDemoMode
        ? 'Quick Demo Test'
        : `${selectedSubject}: ${selectedChapter}`,
      classLevel: isDemoMode ? 'All Classes' : selectedClass,
      subject: isDemoMode ? 'Mixed Science & Math' : selectedSubject,
      chapter: isDemoMode ? 'General Diagnostic' : selectedChapter,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      totalQuestions: questions.length,
      score: scorePercentage,
      correctCount: correct,
      wrongCount: wrong,
      skippedCount: skipped,
      strongTopics: strongTopics.length > 0 ? strongTopics : ['Fundamental Concepts'],
      topicsToPractise: weakTopics.length > 0 ? weakTopics : ['All answers were correct!'],
      questions: detailedQuestions,
    };

    setCalculatedResult(result);
    setIsCompleted(true);

    // If student is logged in, automatically save their score
    if (currentUser) {
      authService.saveQuizResult(result);
      setSavedSuccess(true);
    }
  };

  // Save score for visitor who logs in after taking test
  const handleSaveToMyProgress = () => {
    if (!currentUser) {
      authService.setIntendedRoute('take-test');
      onOpenAuth('signup');
    } else if (calculatedResult) {
      authService.saveQuizResult(calculatedResult);
      setSavedSuccess(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const currentQ = questions[currentIndex];
  const availableSubjects = SUBJECTS_BY_CLASS[selectedClass] || [];
  const availableChapters =
    CHAPTERS_BY_SUBJECT[selectedClass]?.[selectedSubject] || ['Chapter 1: Foundations'];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Banner / Heading */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/30 text-xs text-[#bef264] font-medium mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#a3e635]" />
          <span>Interactive Student Tests · Classes 6 to 12</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Take a Test
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 mt-1">
          Select your class and subject, answer questions at your own speed, and get instant explanations.
        </p>
      </div>

      {!isTestActive ? (
        /* SCREEN 1: TEST CONFIGURATION & INSTANT DEMO */
        <div className="space-y-6">
          {/* Quick Demo Card - No Login Needed */}
          <div className="aurix-glass-card rounded-2xl p-5 sm:p-6 border border-[#a3e635]/30 bg-gradient-to-r from-[#0c150e] to-[#080d09] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(163,230,53,0.1)]">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a3e635] flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Try Without Signing In
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                5-Question Quick Demo Test
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                Experience the test format instantly with mixed questions in Math and Science. No password or email needed.
              </p>
            </div>
            <button
              onClick={handleStartDemoQuiz}
              className="aurix-pill-button px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] flex items-center gap-2 shrink-0 active:scale-95 transition-transform"
            >
              <span>Start Demo Test</span>
              <ArrowRight className="w-4 h-4 text-[#040604]" />
            </button>
          </div>

          {/* Custom Test Builder */}
          <div className="aurix-glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white">Custom Chapter Test</h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Choose your exact class and topic for targeted practice.
              </p>
            </div>

            {/* Step 1: Choose Class */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a3e635] mb-2.5">
                Step 1: Choose Your Class
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {CLASSES_LIST.map((cls) => {
                  const isSelected = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-center border cursor-pointer ${
                        isSelected
                          ? 'bg-[#18281a] border-[#a3e635] text-[#bef264] shadow-[0_0_15px_rgba(163,230,53,0.25)]'
                          : 'bg-[#090e0a] border-white/5 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Subject */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a3e635] mb-2.5">
                Step 2: Choose Your Subject
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {availableSubjects.map((sub) => {
                  const isSelected = selectedSubject === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubject(sub)}
                      className={`p-3 rounded-xl text-left text-xs sm:text-sm font-medium transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#18281a] border-[#a3e635] text-[#bef264] shadow-[0_0_15px_rgba(163,230,53,0.25)]'
                          : 'bg-[#090e0a] border-white/5 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Choose Chapter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a3e635] mb-2.5">
                Step 3: Select Chapter
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#090e0a] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
              >
                {availableChapters.map((ch) => (
                  <option key={ch} value={ch} className="bg-[#090e0a]">
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 4: Start custom test button */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-400">
                5 Questions · 5 Minutes Timer · Detailed Explanations
              </div>
              <button
                onClick={handleStartCustomTest}
                className="w-full sm:w-auto aurix-pill-button px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-[#040604] flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <span>Start Your Test Now</span>
                <ArrowRight className="w-4 h-4 text-[#040604]" />
              </button>
            </div>
          </div>
        </div>
      ) : !isCompleted ? (
        /* SCREEN 2: ACTIVE QUESTION SCREEN */
        <div className="space-y-6">
          {/* Top Bar with Timer and Progress */}
          <div className="aurix-glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border border-[#a3e635]/20">
            <div>
              <span className="text-xs font-semibold text-[#a3e635] block">
                {isDemoMode ? 'Demo Test' : `${selectedClass} · ${selectedSubject}`}
              </span>
              <span className="text-xs sm:text-sm text-neutral-300 font-medium">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e1710] border border-[#a3e635]/30 text-[#bef264] text-xs sm:text-sm font-mono font-semibold">
              <Clock className="w-4 h-4 text-[#a3e635]" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#0a100b] h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-[#84cc16] to-[#bef264] h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Card */}
          <div className="aurix-glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-white/5 pb-3">
              <span>Topic: {currentQ?.topic}</span>
              <span className="text-[#a3e635] font-medium">{currentQ?.chapter}</span>
            </div>

            <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed">
              {currentQ?.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ?.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentIndex] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#18281a] border-[#a3e635] text-[#bef264] shadow-[0_0_20px_rgba(163,230,53,0.2)]'
                        : 'bg-[#090e0a] border-white/10 text-neutral-200 hover:border-white/25 hover:bg-[#0f1811]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-[#a3e635] text-[#040604]'
                            : 'bg-white/10 text-neutral-300'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#bef264] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Controls: Prev, Skip, Next, Submit */}
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkipQuestion}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-transparent hover:bg-white/5 transition-colors"
                >
                  Skip Question
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#040604] bg-[#a3e635] hover:bg-[#bef264] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
                    className="aurix-pill-button px-6 py-2.5 rounded-xl text-xs font-bold text-[#040604] flex items-center gap-1.5 shadow-[0_0_20px_rgba(163,230,53,0.35)]"
                  >
                    <span>Submit Test</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SCREEN 3: TEST RESULTS DISPLAY */
        calculatedResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Score Summary Card */}
            <div className="aurix-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#a3e635]/30 bg-[#080d09] space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <span className="text-xs uppercase font-semibold text-[#a3e635] tracking-wider">
                    Test Completed Successfully
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Your Results: {calculatedResult.testTitle}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Taken on {calculatedResult.date} · {calculatedResult.classLevel}
                  </p>
                </div>

                {/* Score badge */}
                <div className="text-center p-4 rounded-2xl bg-[#0f1a11] border border-[#a3e635]/40 min-w-[130px]">
                  <span className="text-xs uppercase font-semibold text-neutral-400 block">
                    Your Score
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#bef264]">
                    {calculatedResult.score}%
                  </span>
                  <span className="text-[11px] text-[#a3e635] block mt-0.5">
                    {calculatedResult.correctCount} of {calculatedResult.totalQuestions} Correct
                  </span>
                </div>
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl bg-[#0b140d] border border-white/5 text-center">
                  <span className="text-xs text-neutral-400 block mb-1">Correct</span>
                  <span className="text-lg sm:text-xl font-bold text-emerald-400">
                    {calculatedResult.correctCount}
                  </span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#0b140d] border border-white/5 text-center">
                  <span className="text-xs text-neutral-400 block mb-1">Wrong</span>
                  <span className="text-lg sm:text-xl font-bold text-red-400">
                    {calculatedResult.wrongCount}
                  </span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#0b140d] border border-white/5 text-center">
                  <span className="text-xs text-neutral-400 block mb-1">Skipped</span>
                  <span className="text-lg sm:text-xl font-bold text-neutral-400">
                    {calculatedResult.skippedCount}
                  </span>
                </div>
              </div>

              {/* Strongest topics & Topics to practise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#0d160f] border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Your Strongest Topics
                  </span>
                  <ul className="text-xs text-neutral-300 space-y-1">
                    {calculatedResult.strongTopics.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#0d160f] border border-[#a3e635]/20 space-y-2">
                  <span className="text-xs font-semibold text-[#bef264] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#a3e635]" />
                    Topics You Should Practise More
                  </span>
                  <ul className="text-xs text-neutral-300 space-y-1">
                    {calculatedResult.topicsToPractise.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635]" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Save / Retake Action Strip */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setIsTestActive(false);
                    setIsCompleted(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Take Another Test
                </button>

                <div className="flex items-center gap-3">
                  {currentUser ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Saved in My Progress
                      </span>
                      <button
                        onClick={onViewProgress}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-[#040604] bg-[#a3e635] hover:bg-[#bef264]"
                      >
                        View My Progress →
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSaveToMyProgress}
                      className="aurix-pill-button px-5 py-2.5 rounded-xl text-xs font-semibold text-[#040604] flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#040604]" />
                      <span>Save Score to My Progress</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Question Review & Explanations */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Detailed Question Review & Explanations</span>
                <span className="text-xs font-normal text-neutral-400">
                  (Learn from every step)
                </span>
              </h3>

              <div className="space-y-4">
                {calculatedResult.questions.map((item, idx) => {
                  const q = item.question;
                  const isCorrect = item.isCorrect;
                  const isSkipped = item.selectedAnswer === null;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'bg-[#0a130c] border-emerald-500/25'
                          : isSkipped
                          ? 'bg-[#0d120e] border-white/10'
                          : 'bg-[#150f0f] border-red-500/25'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-xs font-semibold text-neutral-400">
                          Question {idx + 1} · {q.topic}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isCorrect
                              ? 'text-emerald-400 bg-emerald-950/40'
                              : isSkipped
                              ? 'text-neutral-400 bg-white/5'
                              : 'text-red-400 bg-red-950/40'
                          }`}
                        >
                          {isCorrect ? 'Correct (+1)' : isSkipped ? 'Skipped' : 'Incorrect'}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-white mb-3">
                        {q.question}
                      </p>

                      <div className="space-y-1.5 mb-3 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isOptionCorrect = oIdx === q.correctAnswer;
                          const wasSelected = item.selectedAnswer === oIdx;

                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-lg flex items-center justify-between ${
                                isOptionCorrect
                                  ? 'bg-emerald-950/30 text-emerald-300 font-semibold border border-emerald-500/30'
                                  : wasSelected
                                  ? 'bg-red-950/30 text-red-300 line-through border border-red-500/30'
                                  : 'text-neutral-400'
                              }`}
                            >
                              <span>
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </span>
                              {isOptionCorrect && (
                                <span className="text-[11px] text-emerald-400 font-semibold">
                                  Correct Answer
                                </span>
                              )}
                              {wasSelected && !isOptionCorrect && (
                                <span className="text-[11px] text-red-400 font-semibold">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="p-3.5 rounded-xl bg-[#090e0a] border border-[#a3e635]/20 text-xs text-neutral-200 leading-relaxed">
                        <strong className="text-[#a3e635] block mb-1">
                          Step-by-Step Explanation:
                        </strong>
                        <p>{q.explanation}</p>
                      </div>

                      {/* Ask AI about this question button */}
                      {onAskAIAboutQuestion && !isCorrect && (
                        <div className="mt-2.5 text-right">
                          <button
                            onClick={() => onAskAIAboutQuestion(q.question)}
                            className="inline-flex items-center gap-1.5 text-xs text-[#bef264] hover:text-white font-medium hover:underline cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
                            <span>Ask AI why this is wrong →</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
