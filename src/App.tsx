import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureCards } from './components/FeatureCards';
import { CuriousMindsSection } from './components/CuriousMindsSection';
import { TakeTestView } from './components/TakeTestView';
import { AskAIView } from './components/AskAIView';
import { MyProgressView } from './components/MyProgressView';
import { PlayGamesView } from './components/PlayGamesView';
import { CompetitionsView } from './components/CompetitionsView';
import { StudyMaterialsView } from './components/StudyMaterialsView';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { authService, StudentUser } from './services/authService';
import { Check, BookOpen, Bot, Sparkles, TrendingUp, Trophy } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [askAIInitialPrompt, setAskAIInitialPrompt] = useState<string | undefined>(undefined);
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);

  // Restore authenticated session from localStorage on initial render
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: StudentUser, redirectRoute?: string | null) => {
    setCurrentUser(user);
    setWelcomeToast(`Welcome back, ${user.name}!`);
    setTimeout(() => setWelcomeToast(null), 4000);

    // If an intended route was stored, navigate there
    if (redirectRoute && redirectRoute !== 'home') {
      setActiveSection(redirectRoute);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setWelcomeToast('Signed out successfully.');
    setTimeout(() => setWelcomeToast(null), 3000);
  };

  const handleAskAIAboutQuestion = (questionText: string) => {
    setAskAIInitialPrompt(questionText);
    setActiveSection('ask-ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#040604] text-neutral-200 selection:bg-[#a3e635]/30 selection:text-[#bef264] relative flex flex-col justify-between">
      {/* Fixed Viewport Background Layer: Stays stationary while text, cards, and buttons scroll over it */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/hero_nature_backdrop_1793877327579.jpg"
          alt="Cinematic forest texture with moss and natural stone illumination"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.75] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040604]/75 via-[#040604]/55 to-[#040604]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(163,230,53,0.12),transparent_70%)]" />
        <div className="absolute inset-0 aurix-vignette" />
        {/* Atmospheric Lime Glow Spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#84cc16]/10 blur-[130px] rounded-full" />
      </div>

      {/* Toast Notification */}
      {welcomeToast && (
        <div className="fixed bottom-6 right-6 z-50 aurix-glass-card bg-[#0d160f]/95 border border-[#a3e635]/40 py-3 px-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-[#a3e635]/20 border border-[#a3e635] flex items-center justify-center text-[#a3e635]">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white block">{welcomeToast}</span>
            <span className="text-[11px] text-[#bef264]">Session active & saved</span>
          </div>
        </div>
      )}

      {/* Floating Glass Navigation Bar with AURIX logo & Saheb Mukherjee credit */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* Main Content Area scrolling over the fixed background */}
      <main className="relative z-10 flex-1">
        {activeSection === 'home' && (
          <>
            <Hero
              onStartTest={() => handleNavigate('take-test')}
              onAskAI={() => handleNavigate('ask-ai')}
              onExplore={handleNavigate}
            />

            {/* Clearly labelled feature section cards in student-friendly language */}
            <FeatureCards onNavigate={handleNavigate} />

            {/* 6 Clearly Labelled Sections Grid */}
            <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs uppercase tracking-widest text-[#a3e635] font-semibold mb-2 inline-block">
                  Everything for Your Studies
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Learn, Practise, and Improve Every Day
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  onClick={() => handleNavigate('take-test')}
                  className="aurix-glass-card rounded-2xl p-5 border border-white/10 hover:border-[#a3e635]/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#a3e635] flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#bef264]">
                    Take a Test
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Choose from Classes 6 to 12. Test chapter topics with timer and get complete step-by-step explanations.
                  </p>
                </div>

                <div
                  onClick={() => handleNavigate('ask-ai')}
                  className="aurix-glass-card rounded-2xl p-5 border border-white/10 hover:border-[#a3e635]/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#bef264] flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#bef264]">
                    Ask AI About Your Doubts
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Have doubts in math, physics, or chemistry? Ask your friendly AI tutor for simple, patient guidance.
                  </p>
                </div>

                <div
                  onClick={() => handleNavigate('my-progress')}
                  className="aurix-glass-card rounded-2xl p-5 border border-white/10 hover:border-[#a3e635]/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#84cc16] flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#bef264]">
                    Check Your Progress
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    See your scores over time, review strongest topics, and identify exactly what you need to practise.
                  </p>
                </div>

                <div
                  onClick={() => handleNavigate('play-games')}
                  className="aurix-glass-card rounded-2xl p-5 border border-white/10 hover:border-[#a3e635]/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#a3e635] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#bef264]">
                    Play Brain Games
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Sharpen concentration with chess tactical puzzles and 60-second speed math calculation sprints.
                  </p>
                </div>

                <div
                  onClick={() => handleNavigate('competitions')}
                  className="aurix-glass-card rounded-2xl p-5 border border-white/10 hover:border-[#a3e635]/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#bef264] flex items-center justify-center font-bold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#bef264]">
                    Join Competitions
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Participate in national weekly subject cups, earn badges, and climb the class student leaderboard.
                  </p>
                </div>

                <div
                  onClick={() => handleNavigate('study-materials')}
                  className="aurix-glass-card rounded-2xl p-5 border border-white/10 hover:border-[#a3e635]/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#142316] text-[#84cc16] flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#bef264]">
                    Explore Study Materials
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Quick formula revision sheets and concept summaries crafted for Classes 6 to 12 exams.
                  </p>
                </div>
              </div>
            </section>

            {/* Built for Curious Minds Section */}
            <CuriousMindsSection onNavigate={handleNavigate} />
          </>
        )}

        {/* Take a Test Page */}
        {activeSection === 'take-test' && (
          <TakeTestView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onViewProgress={() => handleNavigate('my-progress')}
            onAskAIAboutQuestion={handleAskAIAboutQuestion}
          />
        )}

        {/* Ask AI Page */}
        {activeSection === 'ask-ai' && (
          <AskAIView
            currentUser={currentUser}
            initialQuestion={askAIInitialPrompt}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {/* My Progress Page */}
        {activeSection === 'my-progress' && (
          <MyProgressView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onTakeTest={() => handleNavigate('take-test')}
          />
        )}

        {/* Play Games Page */}
        {activeSection === 'play-games' && <PlayGamesView />}

        {/* Competitions Page */}
        {activeSection === 'competitions' && (
          <CompetitionsView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onTakeTest={() => handleNavigate('take-test')}
          />
        )}

        {/* Study Materials Page */}
        {activeSection === 'study-materials' && (
          <StudyMaterialsView
            onAskAI={(topic) => {
              setAskAIInitialPrompt(`Please explain ${topic} in simple steps with examples.`);
              handleNavigate('ask-ai');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />

      {/* Persistent Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
