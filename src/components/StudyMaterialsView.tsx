import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Clock,
  Zap,
  Bookmark,
  ChevronDown,
  Layers,
  Bot,
  MessageSquare,
} from 'lucide-react';
import { STUDY_MATERIALS, StudyMaterial } from '../data/studyMaterialsData';
import { playHoverSound } from '../utils/audioEffects';

interface StudyMaterialsViewProps {
  onBack?: () => void;
  onTakeTest?: () => void;
  onAskAIAboutTopic?: (topicPrompt: string) => void;
}

export const StudyMaterialsView: React.FC<StudyMaterialsViewProps> = ({
  onBack,
  onTakeTest,
  onAskAIAboutTopic,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'chapter_notes' | 'formula_sheet' | 'flashcard' | 'bookmarked'>('all');
  const [selectedMaterialModal, setSelectedMaterialModal] = useState<StudyMaterial | null>(null);

  // Bookmarking state synced with localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aurix_bookmarked_materials');
      return saved ? JSON.parse(saved) : ['mat_class10_physics_1', 'mat_class10_math_1'];
    } catch {
      return ['mat_class10_physics_1', 'mat_class10_math_1'];
    }
  });

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playHoverSound('pop');
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      localStorage.setItem('aurix_bookmarked_materials', JSON.stringify(updated));
      return updated;
    });
  };

  // Flashcard flip states
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filter materials
  const filteredMaterials = STUDY_MATERIALS.filter((mat) => {
    if (activeTab === 'bookmarked') {
      return bookmarkedIds.includes(mat.id);
    }
    const matchesClass = selectedClass === 'All' || mat.classLevel === selectedClass;
    const matchesSubject = selectedSubject === 'All' || mat.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesTab = activeTab === 'all' || mat.type === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesClass && matchesSubject && matchesTab && matchesSearch;
  });

  // Session Recap State
  const [reviewedTitles, setReviewedTitles] = useState<string[]>([]);
  const [sessionRecapModalOpen, setSessionRecapModalOpen] = useState<boolean>(false);
  const [recapSummaryText, setRecapSummaryText] = useState<string>('');
  const [isGeneratingRecap, setIsGeneratingRecap] = useState<boolean>(false);

  const handleOpenMaterial = (mat: StudyMaterial) => {
    playHoverSound('pop');
    setSelectedMaterialModal(mat);
    setActiveFlashcardIndex(0);
    setIsFlipped(false);
    setReviewedTitles((prev) => (prev.includes(mat.title) ? prev : [...prev, mat.title]));
  };

  const handleDownloadPDF = (mat: StudyMaterial) => {
    playHoverSound('pop');
    alert(`Downloading study guide PDF: "${mat.title}" for ${mat.classLevel} ${mat.subject}`);
  };

  const triggerSessionRecap = async () => {
    if (reviewedTitles.length === 0) {
      if (onBack) onBack();
      return;
    }

    setSessionRecapModalOpen(true);
    setIsGeneratingRecap(true);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Please summarize this student's study session in 3 high-yield key takeaway bullet points. Reviewed chapters: ${reviewedTitles.join(', ')}.`,
          studentClass: selectedClass,
          subject: selectedSubject,
        }),
      });

      const data = await response.json();
      setRecapSummaryText(
        data.reply ||
          `Key Session Concepts Reviewed:\n• ${reviewedTitles.join('\n• ')}\n\nGreat job reviewing your study materials today!`
      );
    } catch {
      setRecapSummaryText(
        `Key Session Concepts Reviewed:\n• ${reviewedTitles.join('\n• ')}\n\nGreat job reviewing your study materials today!`
      );
    } finally {
      setIsGeneratingRecap(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      {/* Back Button */}
      {onBack && (
        <div className="mb-4">
          <button
            onClick={triggerSessionRecap}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0e1610] hover:bg-[#142316] border border-white/15 hover:border-[#a3e635]/50 text-xs font-semibold text-neutral-300 hover:text-[#bef264] transition-all cursor-pointer group shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#a3e635] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Previous Page (Session Recap)</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="aurix-3d-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#122214] via-[#09130a] to-[#040604] border border-[#a3e635]/40 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/40 text-xs text-[#bef264] font-bold mb-2 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>High-Yield Revision &amp; Study Notes</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight aurix-3d-lime-heading">
              Study Materials Library
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Curated chapter summaries, formula sheets, interactive flashcards, and downloadable study guides for Class 6 to Class 11.
            </p>
          </div>

          {onTakeTest && (
            <button
              onClick={() => {
                playHoverSound('pop');
                onTakeTest();
              }}
              className="aurix-3d-button px-4 py-2.5 rounded-xl text-xs font-bold text-[#040604] flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Test Knowledge (Take Test)</span>
              <ArrowRight className="w-4 h-4 text-[#040604]" />
            </button>
          )}
        </div>

        {/* Filter Toolbar & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
          {/* Class Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#bef264] mb-1 uppercase tracking-wider">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                playHoverSound('click');
                setSelectedClass(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white text-xs focus:outline-none focus:border-[#a3e635] cursor-pointer"
            >
              {['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11'].map((c) => (
                <option key={c} value={c} className="bg-[#0c140e] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#bef264] mb-1 uppercase tracking-wider">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                playHoverSound('click');
                setSelectedSubject(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white text-xs focus:outline-none focus:border-[#a3e635] cursor-pointer"
            >
              {['All', 'Physics', 'Mathematics', 'Chemistry', 'Science', 'Biology', 'English'].map((s) => (
                <option key={s} value={s} className="bg-[#0c140e] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-bold text-[#bef264] mb-1 uppercase tracking-wider">
              Search Topics &amp; Formulas
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Electricity, Quadratic, Ohm's law..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#a3e635]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-[#080e09] rounded-2xl border border-white/10 mb-6 gap-1 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          All Resources ({filteredMaterials.length})
        </button>
        <button
          onClick={() => setActiveTab('chapter_notes')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'chapter_notes'
              ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          📘 Chapter Notes
        </button>
        <button
          onClick={() => setActiveTab('formula_sheet')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'formula_sheet'
              ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          ⚡ Formula Sheets
        </button>
        <button
          onClick={() => setActiveTab('flashcard')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'flashcard'
              ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm font-bold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          🎴 Flashcards
        </button>
        <button
          onClick={() => setActiveTab('bookmarked')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === 'bookmarked'
              ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm font-bold'
              : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>My Library ({bookmarkedIds.length})</span>
        </button>
      </div>

      {/* Material Cards Grid */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => {
            const isBookmarked = bookmarkedIds.includes(mat.id);
            return (
              <div
                key={mat.id}
                onClick={() => handleOpenMaterial(mat)}
                onMouseEnter={() => playHoverSound('hiss')}
                className="aurix-3d-card group p-5 rounded-3xl bg-[#0a120b]/90 hover:bg-[#0f1b10] border border-white/10 hover:border-[#a3e635]/50 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#142316] border border-[#a3e635]/35 text-[#bef264] uppercase tracking-wider">
                      {mat.classLevel} · {mat.subject}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                        <Clock className="w-3 h-3 text-[#a3e635]" />
                        <span>{mat.readTimeMinutes} min</span>
                      </div>
                      <button
                        onClick={(e) => toggleBookmark(mat.id, e)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                        title={isBookmarked ? 'Remove from My Library' : 'Save to My Library'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-[#bef264] transition-colors leading-snug">
                  {mat.title}
                </h3>
                <span className="text-xs text-[#a3e635] font-semibold block mt-1">
                  Chapter: {mat.chapter}
                </span>

                <p className="text-xs text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                  {mat.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#bef264] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#a3e635]" />
                  <span>Read Full Material</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDF(mat);
                  }}
                  className="p-1.5 rounded-lg bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-[#a3e635] hover:text-white transition-all cursor-pointer"
                  title="Download PDF Study Guide"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        <div className="aurix-3d-card p-10 text-center rounded-3xl bg-[#080d09] border border-[#a3e635]/30 space-y-3">
          <BookOpen className="w-10 h-10 text-[#a3e635] mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white">No Study Materials Found</h3>
          <p className="text-xs text-neutral-300">
            No resources matched your selected filters or search query ({selectedClass} · {selectedSubject}).
          </p>
          <button
            onClick={() => {
              setSelectedClass('All');
              setSelectedSubject('All');
              setSearchQuery('');
              setActiveTab('all');
            }}
            className="aurix-3d-button py-2 px-4 rounded-xl text-xs font-bold text-[#040604] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Study Material Reader / Flashcard Viewer Modal */}
      {selectedMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl aurix-3d-card bg-[#0c140e] border border-[#a3e635]/45 rounded-3xl p-6 sm:p-8 text-left space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedMaterialModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Title */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#142316] border border-[#a3e635]/40 text-[11px] text-[#bef264] font-bold mb-2">
                <BookOpen className="w-3.5 h-3.5 text-[#a3e635]" />
                <span>{selectedMaterialModal.classLevel} · {selectedMaterialModal.subject}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {selectedMaterialModal.title}
              </h2>
              <span className="text-xs text-[#a3e635] font-semibold block mt-0.5">
                Chapter: {selectedMaterialModal.chapter}
              </span>
            </div>

            {/* Key Summary Points */}
            <div className="space-y-2 bg-[#080d09] p-4 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-[#bef264] uppercase tracking-wider block">
                📘 Key Concept Takeaways:
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {selectedMaterialModal.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#a3e635] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formulas Section (If formula sheet) */}
            {selectedMaterialModal.formulas && selectedMaterialModal.formulas.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#bef264] uppercase tracking-wider block">
                  ⚡ High-Yield Formulas:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMaterialModal.formulas.map((f, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#142316] border border-[#a3e635]/35 space-y-1">
                      <div className="text-xs font-bold text-white">{f.name}</div>
                      <div className="text-sm font-extrabold font-mono text-[#bef264] bg-[#09100a] p-1.5 rounded-lg border border-[#a3e635]/30">
                        {f.formula}
                      </div>
                      <div className="text-[11px] text-neutral-300">{f.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flashcards Section (If available) */}
            {selectedMaterialModal.flashcards && selectedMaterialModal.flashcards.length > 0 && (
              <div className="space-y-3 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#bef264] uppercase tracking-wider">
                    🎴 Flashcard Revision ({activeFlashcardIndex + 1} of {selectedMaterialModal.flashcards.length}):
                  </span>
                  <span className="text-[11px] text-neutral-400">Click card to flip</span>
                </div>

                <div
                  onClick={() => {
                    playHoverSound('pop');
                    setIsFlipped(!isFlipped);
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer text-center min-h-[120px] flex flex-col items-center justify-center ${
                    isFlipped
                      ? 'bg-[#152a18] border-[#a3e635] text-[#bef264] shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                      : 'bg-[#09100a] border-white/20 text-white hover:border-[#a3e635]/50'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest text-[#a3e635] font-bold mb-1">
                    {isFlipped ? 'ANSWER (Click to flip back)' : 'QUESTION (Click to reveal answer)'}
                  </span>
                  <p className="text-sm font-bold leading-relaxed">
                    {isFlipped
                      ? selectedMaterialModal.flashcards[activeFlashcardIndex].answer
                      : selectedMaterialModal.flashcards[activeFlashcardIndex].question}
                  </p>
                </div>

                {/* Flashcard Next/Prev Controls */}
                <div className="flex justify-between items-center text-xs">
                  <button
                    disabled={activeFlashcardIndex === 0}
                    onClick={() => {
                      playHoverSound('click');
                      setActiveFlashcardIndex((prev) => Math.max(0, prev - 1));
                      setIsFlipped(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#142316] border border-white/10 disabled:opacity-40 text-white cursor-pointer"
                  >
                    ← Previous Flashcard
                  </button>
                  <button
                    disabled={activeFlashcardIndex === selectedMaterialModal.flashcards.length - 1}
                    onClick={() => {
                      playHoverSound('click');
                      setActiveFlashcardIndex((prev) => Math.min(selectedMaterialModal.flashcards!.length - 1, prev + 1));
                      setIsFlipped(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#142316] border border-[#a3e635]/40 text-[#bef264] disabled:opacity-40 cursor-pointer"
                  >
                    Next Flashcard →
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/10">
              {onAskAIAboutTopic && (
                <button
                  onClick={() => {
                    const chapterName = selectedMaterialModal.chapter;
                    const matTitle = selectedMaterialModal.title;
                    const cLevel = selectedMaterialModal.classLevel;
                    const subj = selectedMaterialModal.subject;
                    setSelectedMaterialModal(null);
                    onAskAIAboutTopic(
                      `Please explain chapter "${chapterName}" (${matTitle}) for ${cLevel} ${subj} in detail with formulas and step-by-step examples.`
                    );
                  }}
                  className="aurix-3d-button py-2.5 px-4 rounded-xl text-xs font-bold text-[#040604] bg-[#a3e635] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                >
                  <Bot className="w-4 h-4 text-[#040604]" />
                  <span>Ask AI Tutor About Chapter</span>
                </button>
              )}
              <button
                onClick={() => handleDownloadPDF(selectedMaterialModal)}
                className="flex-1 aurix-3d-glass-btn py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#a3e635]" />
                <span>Download PDF Revision Sheet</span>
              </button>
              <button
                onClick={() => setSelectedMaterialModal(null)}
                className="aurix-3d-glass-btn py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-300 cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Ask AI Button in Corner */}
      {onAskAIAboutTopic && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              playHoverSound('pop');
              const activeTopic = selectedMaterialModal
                ? selectedMaterialModal.chapter
                : selectedSubject !== 'All'
                ? `${selectedClass} ${selectedSubject}`
                : 'Science & Mathematics Syllabus';

              onAskAIAboutTopic(
                `Please explain ${activeTopic} in detail with step-by-step concepts, key formulas, and practice hints.`
              );
            }}
            className="aurix-3d-button px-4 py-3 rounded-2xl bg-[#a3e635] text-[#040604] font-extrabold text-xs flex items-center gap-2.5 shadow-[0_8px_30px_rgba(163,230,53,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#bef264]"
            title="Ask AI Tutor directly about this chapter"
          >
            <Bot className="w-5 h-5 text-[#040604] animate-bounce" />
            <span>Quick Ask AI Tutor</span>
          </button>
        </div>
      )}

      {/* Automated Session Recap Modal */}
      {sessionRecapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg aurix-3d-card bg-[#0c140e] border border-[#a3e635]/45 rounded-3xl p-6 sm:p-8 text-left space-y-5 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/40 text-xs text-[#bef264] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
                <span>AI Automated Session Recap</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Study Session Summary
              </h2>
              <p className="text-xs text-neutral-300 mt-1">
                You reviewed {reviewedTitles.length} chapter study guide{reviewedTitles.length > 1 ? 's' : ''} during this active study session.
              </p>
            </div>

            {/* AI Summary Text */}
            <div className="p-4 rounded-2xl bg-[#080d09] border border-white/10 space-y-2 text-xs">
              <span className="font-bold text-[#bef264] uppercase tracking-wider block">
                🧠 Key Concept Takeaways:
              </span>

              {isGeneratingRecap ? (
                <div className="flex items-center gap-2 text-neutral-300 py-3">
                  <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
                  <span>Generating AI executive recap of reviewed chapters...</span>
                </div>
              ) : (
                <div className="prose prose-invert text-xs leading-relaxed whitespace-pre-wrap text-neutral-200">
                  {recapSummaryText}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(recapSummaryText);
                  alert('Session recap copied to clipboard!');
                }}
                className="flex-1 aurix-3d-glass-btn py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Copy Recap Notes</span>
              </button>
              <button
                onClick={() => {
                  setSessionRecapModalOpen(false);
                  if (onBack) onBack();
                }}
                className="flex-1 aurix-3d-button py-2.5 px-4 rounded-xl text-xs font-bold text-[#040604] cursor-pointer"
              >
                Close &amp; Exit Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
