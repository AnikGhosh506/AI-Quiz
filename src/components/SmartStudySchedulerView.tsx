import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Plus,
  CheckCircle2,
  Trash2,
  Play,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Brain,
  Zap,
  BookOpen,
  Users,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { StudentUser, authService } from '../services/authService';
import { studySchedulerService, StudyScheduleEvent } from '../services/studySchedulerService';
import { playHoverSound } from '../utils/audioEffects';

interface SmartStudySchedulerViewProps {
  currentUser: StudentUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onNavigateToFeature?: (sectionId: string) => void;
  onBack?: () => void;
}

export const SmartStudySchedulerView: React.FC<SmartStudySchedulerViewProps> = ({
  currentUser,
  onOpenAuth,
  onNavigateToFeature,
  onBack,
}) => {
  const [events, setEvents] = useState<StudyScheduleEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week');
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Form states for creating custom study event
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('Physics');
  const [newChapter, setNewChapter] = useState<string>('Electricity & Circuits');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState<string>('07:00 PM');
  const [newEndTime, setNewEndTime] = useState<string>('08:00 PM');
  const [newCategory, setNewCategory] = useState<'AI Focus' | 'Test Rehearsal' | 'Peer Group' | 'Revision'>('AI Focus');
  const [newRationale, setNewRationale] = useState<string>('Custom student schedule event.');

  const studentEmail = currentUser?.email || 'arpitaghosh2167@gmail.com';

  useEffect(() => {
    loadEvents();
  }, [studentEmail]);

  const loadEvents = async () => {
    setLoading(true);
    const data = await studySchedulerService.getEvents(studentEmail);
    setEvents(data);
    setLoading(false);
  };

  const handleAddEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playHoverSound('pop');
    const created = await studySchedulerService.addEvent({
      studentEmail,
      title: newTitle.trim(),
      subject: newSubject,
      chapter: newChapter,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      eventCategory: newCategory,
      aiOptimizationRationale: newRationale.trim() || 'Custom student scheduled session.',
      status: 'scheduled',
    });

    setEvents((prev) => [created, ...prev]);
    setAddModalOpen(false);
    setNewTitle('');
    showToast('Event saved to Firestore Calendar!');
  };

  const handleToggleComplete = async (eventId: string, currentStatus: string) => {
    playHoverSound('pop');
    const nextStatus = currentStatus === 'completed' ? 'scheduled' : 'completed';
    await studySchedulerService.updateEventStatus(eventId, nextStatus);
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, status: nextStatus } : ev))
    );
    showToast(nextStatus === 'completed' ? 'Slot marked complete (+25 XP)!' : 'Status updated');
  };

  const handleDeleteEvent = async (eventId: string) => {
    playHoverSound('hiss');
    await studySchedulerService.deleteEvent(eventId);
    setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    showToast('Event removed from schedule');
  };

  const handleAutoGenerateAI = async () => {
    playHoverSound('pop');
    const quizResults = authService.getQuizResults();
    const suggestions = studySchedulerService.generateAISuggestedEvents(studentEmail, quizResults);

    for (const sug of suggestions) {
      await studySchedulerService.addEvent(sug);
    }

    await loadEvents();
    showToast('⚡ AI generated 3 optimal focus slots based on weak topics!');
  };

  const showToast = (msg: string) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(null), 3500);
  };

  // Helper for generating week days starting from today
  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ iso, dayName, monthDay, isToday: i === 0 });
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Category badge colors
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'AI Focus':
        return 'bg-[#142316] text-[#bef264] border-[#a3e635]/50';
      case 'Test Rehearsal':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      case 'Peer Group':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/40';
      case 'Revision':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-600';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 aurix-glass-card bg-[#0d160f]/95 border border-[#a3e635]/50 py-3 px-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-[#a3e635]/20 border border-[#a3e635] flex items-center justify-center text-[#a3e635]">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">{syncToast}</span>
        </div>
      )}

      {/* Back Button */}
      {onBack && (
        <div className="mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0e1610] hover:bg-[#142316] border border-white/15 hover:border-[#a3e635]/50 text-xs font-semibold text-neutral-300 hover:text-[#bef264] transition-all cursor-pointer group shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#a3e635] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Previous Page</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="aurix-3d-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#122415] via-[#09140b] to-[#040604] border border-[#a3e635]/40 mb-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#a3e635]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/40 text-xs text-[#bef264] font-bold mb-2 shadow-sm">
              <Brain className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>Adaptive Study Calendar &amp; Firestore Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight aurix-3d-lime-heading">
              Smart Study Scheduler
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Analyzes your test performance history, memory decay curves, and upcoming exam dates to schedule optimal high-retention study slots.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAutoGenerateAI}
              className="aurix-3d-button px-4 py-3 rounded-2xl text-xs font-extrabold text-[#040604] flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.35)] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#040604] fill-[#040604]" />
              <span>⚡ Auto-Schedule AI Slots</span>
            </button>

            <button
              onClick={() => {
                playHoverSound('pop');
                setAddModalOpen(true);
              }}
              className="aurix-3d-glass-btn px-4 py-3 rounded-2xl text-xs font-extrabold text-[#bef264] border border-[#a3e635]/40 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#a3e635]" />
              <span>+ Add Custom Event</span>
            </button>

            <button
              onClick={loadEvents}
              className="p-3 rounded-2xl bg-[#080d09] border border-white/15 hover:border-[#a3e635]/40 text-neutral-300 hover:text-[#bef264] transition-all cursor-pointer"
              title="Sync with Firestore"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-[#080d09]/80 border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Scheduled</span>
            <span className="text-base font-extrabold text-white">{events.length} Study Slots</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#080d09]/80 border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Completed Slots</span>
            <span className="text-base font-extrabold text-[#bef264]">
              {events.filter((e) => e.status === 'completed').length} Completed
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#080d09]/80 border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Peak Recall Window</span>
            <span className="text-base font-extrabold text-amber-300">07:00 PM – 08:30 PM</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#080d09]/80 border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Retention Boost</span>
            <span className="text-base font-extrabold text-emerald-400">+18% Score Gain</span>
          </div>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#080d09] border border-white/15">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'week'
                ? 'bg-[#142316] text-[#bef264] border border-[#a3e635]/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Weekly Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#142316] text-[#bef264] border border-[#a3e635]/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Agenda List View
          </button>
        </div>

        <span className="text-xs text-[#bef264] font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#a3e635]" />
          <span>Real-time Firestore Sync Active</span>
        </span>
      </div>

      {/* WEEKLY CALENDAR GRID VIEW */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayEvents = events.filter((e) => e.date === day.iso);
            return (
              <div
                key={day.iso}
                className={`aurix-3d-card rounded-2xl p-3 bg-[#0a120b] border flex flex-col justify-between space-y-3 min-h-[360px] ${
                  day.isToday
                    ? 'border-[#a3e635] shadow-[0_0_15px_rgba(163,230,53,0.2)]'
                    : 'border-white/10'
                }`}
              >
                {/* Day Column Header */}
                <div className="pb-2 border-b border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    {day.dayName}
                  </span>
                  <span className={`text-sm font-extrabold ${day.isToday ? 'text-[#bef264]' : 'text-white'}`}>
                    {day.monthDay}
                  </span>
                  {day.isToday && (
                    <span className="mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#a3e635] text-[#040604]">
                      Today
                    </span>
                  )}
                </div>

                {/* Events list for this day */}
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px]">
                  {dayEvents.length === 0 ? (
                    <div className="h-28 flex items-center justify-center text-center text-[11px] text-neutral-500 italic p-2">
                      No study slots
                    </div>
                  ) : (
                    dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                          evt.status === 'completed'
                            ? 'bg-[#080d09] border-emerald-500/40 opacity-70'
                            : 'bg-[#0e1710] border-white/15 hover:border-[#a3e635]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${getCategoryColor(
                              evt.eventCategory
                            )}`}
                          >
                            {evt.eventCategory}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {evt.startTime}
                          </span>
                        </div>

                        <h4
                          className={`font-bold leading-tight ${
                            evt.status === 'completed' ? 'line-through text-neutral-400' : 'text-white'
                          }`}
                        >
                          {evt.title}
                        </h4>

                        <p className="text-[10px] text-neutral-300">
                          {evt.subject} · {evt.chapter}
                        </p>

                        <div className="pt-1 border-t border-white/10 flex items-center justify-between gap-1">
                          <button
                            onClick={() => handleToggleComplete(evt.id, evt.status)}
                            className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                            title={evt.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${evt.status === 'completed' ? 'fill-emerald-400 text-[#040604]' : ''}`}
                            />
                          </button>

                          {onNavigateToFeature && (
                            <button
                              onClick={() => {
                                playHoverSound('pop');
                                onNavigateToFeature('take-test');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-[#a3e635]/20 hover:bg-[#a3e635] text-[#bef264] hover:text-[#040604] text-[10px] font-bold transition-all cursor-pointer flex items-center gap-0.5"
                            >
                              <span>Start</span>
                              <Play className="w-2.5 h-2.5 fill-current" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AGENDA LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="aurix-3d-card p-12 text-center rounded-3xl bg-[#0c140e] border border-white/10 space-y-3">
              <CalendarIcon className="w-10 h-10 text-neutral-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Study Events Scheduled</h3>
              <p className="text-xs text-neutral-400">
                Click "+ Add Custom Event" or "⚡ Auto-Schedule AI Slots" to generate your study calendar.
              </p>
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                className="aurix-3d-card p-5 rounded-3xl bg-[#0a120b] border border-white/10 hover:border-[#a3e635]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                        evt.eventCategory
                      )}`}
                    >
                      {evt.eventCategory}
                    </span>
                    <span className="text-xs text-[#bef264] font-semibold">
                      📅 {evt.date} ({evt.startTime} – {evt.endTime})
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-extrabold ${
                      evt.status === 'completed' ? 'line-through text-neutral-400' : 'text-white'
                    }`}
                  >
                    {evt.title}
                  </h3>

                  <p className="text-xs text-neutral-300">
                    Subject: <strong className="text-white">{evt.subject}</strong> · Chapter:{' '}
                    <strong className="text-white">{evt.chapter}</strong>
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#080d09] border border-white/10 text-xs text-neutral-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                    <span>AI Rationale: {evt.aiOptimizationRationale}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleToggleComplete(evt.id, evt.status)}
                    className="aurix-3d-glass-btn px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        evt.status === 'completed' ? 'text-emerald-400 fill-emerald-400' : 'text-neutral-400'
                      }`}
                    />
                    <span>{evt.status === 'completed' ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  {onNavigateToFeature && (
                    <button
                      onClick={() => {
                        playHoverSound('pop');
                        onNavigateToFeature('take-test');
                      }}
                      className="aurix-3d-button px-5 py-2.5 rounded-xl text-xs font-extrabold text-[#040604] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Start Practice</span>
                      <Play className="w-3.5 h-3.5 fill-current text-[#040604]" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="p-2.5 rounded-xl bg-[#080d09] border border-white/10 hover:border-red-500/50 text-neutral-400 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ADD CUSTOM STUDY EVENT MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleAddEventSubmit}
            className="relative w-full max-w-lg aurix-3d-card bg-[#0c140e] border border-[#a3e635]/45 rounded-3xl p-6 sm:p-8 text-left space-y-4 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-white"
            >
              ✕
            </button>

            <div>
              <span className="text-[11px] font-bold text-[#bef264] uppercase tracking-wider block">
                Personalized Schedule
              </span>
              <h2 className="text-xl font-extrabold text-white">Add Study Calendar Slot</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Event Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Physics Ohm's Law Sprint..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                  >
                    {['Physics', 'Mathematics', 'Chemistry', 'Biology', 'English', 'Social Science'].map((s) => (
                      <option key={s} value={s} className="bg-[#0c140e] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                  >
                    <option value="AI Focus" className="bg-[#0c140e]">AI Focus</option>
                    <option value="Test Rehearsal" className="bg-[#0c140e]">Test Rehearsal</option>
                    <option value="Peer Group" className="bg-[#0c140e]">Peer Group</option>
                    <option value="Revision" className="bg-[#0c140e]">Revision</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Chapter / Topic</label>
                <input
                  type="text"
                  required
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  placeholder="e.g. Electricity, Quadratic Equations..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">Start Time</label>
                  <input
                    type="text"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="07:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">End Time</label>
                  <input
                    type="text"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    placeholder="08:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Study Rationale / Note</label>
                <input
                  type="text"
                  value={newRationale}
                  onChange={(e) => setNewRationale(e.target.value)}
                  placeholder="e.g. Preparation for upcoming weekly diagnostic..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 aurix-3d-button py-3 rounded-xl text-xs font-bold text-[#040604] cursor-pointer"
              >
                Save Event to Calendar
              </button>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="aurix-3d-glass-btn py-3 px-4 rounded-xl text-xs font-bold text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
