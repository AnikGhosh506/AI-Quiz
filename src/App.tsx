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
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { SwitchAccountModal } from './components/SwitchAccountModal';
import { ParentalLoginModal } from './components/ParentalLoginModal';
import { ParentPortalView } from './components/ParentPortalView';
import { ParentPasswordModal } from './components/ParentPasswordModal';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { StudyMaterialsView } from './components/StudyMaterialsView';
import { PrintReportView } from './components/PrintReportView';
import { VirtualStudyRoomsView } from './components/VirtualStudyRoomsView';
import { SmartStudySchedulerView } from './components/SmartStudySchedulerView';
import { AIRecommendedDailyQuiz } from './components/AIRecommendedDailyQuiz';
import { NotificationCenter } from './components/NotificationCenter';
import { OfflineIndicator } from './components/OfflineIndicator';
import { authService, StudentUser, ParentUser } from './services/authService';
import { Check, BookOpen, Bot, Sparkles, TrendingUp, Trophy, FileText } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [parentUser, setParentUser] = useState<ParentUser | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [editProfileModalOpen, setEditProfileModalOpen] = useState<boolean>(false);
  const [switchAccountModalOpen, setSwitchAccountModalOpen] = useState<boolean>(false);
  const [parentLoginModalOpen, setParentLoginModalOpen] = useState<boolean>(false);
  const [parentPasswordModalOpen, setParentPasswordModalOpen] = useState<boolean>(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState<boolean>(false);

  const [askAIInitialPrompt, setAskAIInitialPrompt] = useState<string | undefined>(undefined);
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);

  // Navigation history stack for Back button functionality across all pages
  const [navHistory, setNavHistory] = useState<string[]>([]);

  // Restore authenticated session from localStorage & database on initial render
  useEffect(() => {
    // 1. Instant sync student from local cache (never logout student on refresh)
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // REQUIRE PARENT PASSWORD VERIFICATION ON PAGE REFRESH
    authService.logoutParent();
    setParentUser(null);

    // 2. Sync student session with persistent server database
    fetch('/api/database/session')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.activeUser) {
          setCurrentUser(data.activeUser);
          localStorage.setItem('aurix_current_student', JSON.stringify(data.activeUser));
        }
      })
      .catch(() => {});
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'parent-portal' && !parentUser) {
      setParentPasswordModalOpen(true);
      return;
    }
    if (sectionId !== activeSection) {
      setNavHistory((prev) => [...prev, activeSection]);
      setActiveSection(sectionId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (navHistory.length > 0) {
      const prevSection = navHistory[navHistory.length - 1];
      setNavHistory((prev) => prev.slice(0, -1));
      setActiveSection(prevSection);
    } else {
      setActiveSection('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: StudentUser, redirectRoute?: string | null) => {
    setCurrentUser(user);
    // Persist session to server database
    fetch('/api/database/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    }).catch(() => {});

    setWelcomeToast(`Welcome, ${user.name}!`);
    setTimeout(() => setWelcomeToast(null), 4000);

    // Navigate to requested section or directly to home
    const targetSection = redirectRoute || 'home';
    setActiveSection(targetSection);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Permanently delete user account from database and switch active user
  const handleDeleteAccount = (emailToDelete?: string) => {
    const targetEmail = emailToDelete || currentUser?.email;
    if (!targetEmail) return;

    const res = authService.deleteAccount(targetEmail);
    setCurrentUser(res.nextUser);
    setEditProfileModalOpen(false);
    setWelcomeToast(`Account (${targetEmail}) was permanently deleted from the database.`);
    setTimeout(() => setWelcomeToast(null), 4500);
  };

  const handleLogout = () => {
    authService.logout();
    authService.logoutParent();
    setCurrentUser(null);
    setParentUser(null);
    setWelcomeToast('Signed out successfully.');
    setTimeout(() => setWelcomeToast(null), 3000);
  };

  // Account switching handler
  const handleSelectSwitchedAccount = (user: StudentUser) => {
    setCurrentUser(user);
    setWelcomeToast(`Active account switched to ${user.name} (${user.classLevel})`);
    setTimeout(() => setWelcomeToast(null), 4000);
  };

  // Profile credentials update handler (Name, Class, School, Board, City, Roll Number)
  const handleUpdateProfile = (updatedUser: StudentUser) => {
    setCurrentUser(updatedUser);
    setWelcomeToast(`Credentials updated for ${updatedUser.name}!`);
    setTimeout(() => setWelcomeToast(null), 4000);
  };

  // Parental login success handler
  const handleParentLoginSuccess = (parent: ParentUser) => {
    setParentUser(parent);
    setWelcomeToast(`Welcome to Parent Portal, ${parent.parentName}!`);
    setTimeout(() => setWelcomeToast(null), 4000);
    setActiveSection('parent-portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exit parent mode back to student view
  const handleExitParentMode = () => {
    authService.logoutParent();
    setParentUser(null);
    setWelcomeToast('Switched back to Student Mode');
    setTimeout(() => setWelcomeToast(null), 3000);
    setActiveSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch student child within Parent Portal
  const handleSwitchParentChild = (newChild: StudentUser) => {
    setCurrentUser(newChild);
    if (parentUser) {
      const updatedParent = authService.loginAsParent({
        parentName: parentUser.parentName,
        email: parentUser.email,
        phoneNumber: parentUser.phoneNumber,
        relationship: parentUser.relationship,
        studentEmail: newChild.email,
      });
      setParentUser(updatedParent);
    }
    setWelcomeToast(`Monitoring switched to ${newChild.name}`);
    setTimeout(() => setWelcomeToast(null), 3500);
  };

  const handleAskAIAboutQuestion = (questionText: string) => {
    setAskAIInitialPrompt(questionText);
    setActiveSection('ask-ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#040604] text-neutral-200 selection:bg-[#a3e635]/30 selection:text-[#bef264] relative flex flex-col justify-between">
      {/* Fixed Viewport Background Layer: Prominent, clear and vivid while content scrolls over it */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/src/assets/images/hero_nature_backdrop_1793877327579.jpg"
          alt="Cinematic forest texture with moss and natural stone illumination"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-100 filter brightness-[0.95] contrast-[1.08] opacity-100"
        />
        {/* Transparent subtle tint to keep the backdrop crisp while ensuring optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040604]/30 via-[#040604]/15 to-[#040604]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(163,230,53,0.15),transparent_65%)]" />
        {/* Soft atmospheric lime glow spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#84cc16]/15 blur-[120px] rounded-full" />
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
        parentUser={parentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onGoBack={handleGoBack}
        onOpenEditProfile={() => setEditProfileModalOpen(true)}
        onOpenSwitchAccount={() => setSwitchAccountModalOpen(true)}
        onOpenParentLogin={() => setParentPasswordModalOpen(true)}
        onExitParentMode={handleExitParentMode}
        onOpenNotifications={() => setNotificationCenterOpen(true)}
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

            {/* AI Recommended Daily Practice Quiz Sprint */}
            <AIRecommendedDailyQuiz
              currentUser={currentUser}
              quizResults={authService.getQuizResults()}
              onStartQuiz={() => handleNavigate('take-test')}
            />

            {/* Clearly labelled feature section cards in student-friendly language */}
            <FeatureCards onNavigate={handleNavigate} />

            {/* Top 5 Competitive Global Leaderboard */}
            <GlobalLeaderboard onTakeTest={() => handleNavigate('take-test')} />

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
            onBack={handleGoBack}
          />
        )}

        {/* Study Materials & Notes Library Page */}
        {activeSection === 'study-materials' && (
          <StudyMaterialsView
            onBack={handleGoBack}
            onTakeTest={() => handleNavigate('take-test')}
            onAskAIAboutTopic={handleAskAIAboutQuestion}
          />
        )}

        {/* Ask AI Page */}
        {activeSection === 'ask-ai' && (
          <AskAIView
            currentUser={currentUser}
            initialQuestion={askAIInitialPrompt}
            onOpenAuth={handleOpenAuth}
            onBack={handleGoBack}
          />
        )}

        {/* My Progress Page */}
        {activeSection === 'my-progress' && (
          <MyProgressView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onTakeTest={() => handleNavigate('take-test')}
            onOpenEditProfile={() => setEditProfileModalOpen(true)}
            onOpenSwitchAccount={() => setSwitchAccountModalOpen(true)}
            onOpenParentLogin={() => setParentPasswordModalOpen(true)}
            onBack={handleGoBack}
          />
        )}

        {/* Play Games Page */}
        {activeSection === 'play-games' && <PlayGamesView onBack={handleGoBack} />}

        {/* Competitions Page */}
        {activeSection === 'competitions' && (
          <CompetitionsView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onTakeTest={() => handleNavigate('take-test')}
            onBack={handleGoBack}
          />
        )}

        {/* Printable Academic Dossier & Study Materials Page */}
        {activeSection === 'print-report' && (
          <PrintReportView
            currentUser={currentUser}
            onBack={handleGoBack}
          />
        )}

        {/* Virtual Peer Study Rooms Page */}
        {activeSection === 'study-rooms' && (
          <VirtualStudyRoomsView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onBack={handleGoBack}
          />
        )}

        {/* Smart Study Scheduler Page */}
        {activeSection === 'study-scheduler' && (
          <SmartStudySchedulerView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onNavigateToFeature={handleNavigate}
            onBack={handleGoBack}
          />
        )}

        {/* Parent Portal View */}
        {activeSection === 'parent-portal' && (
          <ParentPortalView
            parentUser={
              parentUser || {
                id: 'parent_default',
                parentName: 'Mrs. Sunita Ghosh',
                email: 'parent.ghosh@gmail.com',
                phoneNumber: '+91 98301 23456',
                relationship: 'Mother',
                linkedStudentEmail: currentUser?.email || 'arpitaghosh2167@gmail.com',
                linkedStudentName: currentUser?.name || 'Arpita Ghosh',
                linkedStudentClass: currentUser?.classLevel || 'Class 10',
                linkedStudentSchool: currentUser?.schoolName || 'Delhi Public School (DPS RK Puram)',
                linkedStudentRoll: currentUser?.rollNumber || '18',
                loginDate: 'Nov 2026',
              }
            }
            studentUser={currentUser}
            onExitParentMode={handleExitParentMode}
            onNavigateToFeature={handleNavigate}
            onSwitchStudentChild={handleSwitchParentChild}
            onOpenEditStudentModal={() => setEditProfileModalOpen(true)}
            onBack={handleGoBack}
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
        onOpenParentLogin={() => setParentPasswordModalOpen(true)}
      />

      {/* Edit Student Credentials Modal */}
      {currentUser && (
        <EditProfileModal
          isOpen={editProfileModalOpen}
          currentUser={currentUser}
          onClose={() => setEditProfileModalOpen(false)}
          onUpdate={handleUpdateProfile}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      {/* Switch Account Modal */}
      <SwitchAccountModal
        isOpen={switchAccountModalOpen}
        currentUser={currentUser}
        onClose={() => setSwitchAccountModalOpen(false)}
        onSelectAccount={handleSelectSwitchedAccount}
        onAddNewAccount={() => handleOpenAuth('signin')}
        onOpenParentLogin={() => setParentPasswordModalOpen(true)}
      />

      {/* Parental Password Protection Gate Modal */}
      <ParentPasswordModal
        isOpen={parentPasswordModalOpen}
        onClose={() => setParentPasswordModalOpen(false)}
        onSuccess={(name, rel) => {
          setParentPasswordModalOpen(false);
          setParentLoginModalOpen(true);
        }}
      />

      {/* Parental Login Modal */}
      <ParentalLoginModal
        isOpen={parentLoginModalOpen}
        onClose={() => setParentLoginModalOpen(false)}
        onSuccess={handleParentLoginSuccess}
        activeStudent={currentUser}
      />

      {/* PWA Push Notification Center */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      {/* PWA Offline Connection Indicator */}
      <OfflineIndicator />
    </div>
  );
}
