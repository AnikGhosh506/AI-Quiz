import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  MessageSquare,
  Plus,
  Send,
  ArrowLeft,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Share2,
  Clock,
  User,
  Zap,
  HelpCircle,
  FileText,
  Code2,
  Binary,
  Image as ImageIcon,
  Copy,
  Check,
  X,
  ChevronRight,
  Maximize2,
  Terminal,
} from 'lucide-react';
import { StudentUser } from '../services/authService';
import { studyChatService, StudyChatMessage } from '../services/studyChatService';
import { playHoverSound } from '../utils/audioEffects';

interface VirtualStudyRoomsViewProps {
  currentUser: StudentUser | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onBack?: () => void;
}

interface StudyRoom {
  id: string;
  title: string;
  classLevel: string;
  subject: string;
  focusTopic: string;
  activeCount: number;
  hostName: string;
  createdTime: string;
}

export const VirtualStudyRoomsView: React.FC<VirtualStudyRoomsViewProps> = ({
  currentUser,
  onOpenAuth,
  onBack,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Form state for room creation
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('Physics');
  const [newTopic, setNewTopic] = useState<string>('');

  // Initial Rooms List
  const [rooms, setRooms] = useState<StudyRoom[]>([
    {
      id: 'room_1',
      title: 'Class 10 Physics Numericals & Ohm’s Law Sprint',
      classLevel: 'Class 10',
      subject: 'Physics',
      focusTopic: 'Electricity & Resistance Calculations',
      activeCount: 5,
      hostName: 'Arpita Ghosh',
      createdTime: '10 mins ago',
    },
    {
      id: 'room_2',
      title: 'Class 10 Math Quadratic Equations Problem Solving',
      classLevel: 'Class 10',
      subject: 'Mathematics',
      focusTopic: 'Completing Square & Formula Method',
      activeCount: 7,
      hostName: 'Saheb Mukherjee',
      createdTime: '25 mins ago',
    },
    {
      id: 'room_3',
      title: 'Class 11 Chemistry Periodic Trends & Bonding',
      classLevel: 'Class 11',
      subject: 'Chemistry',
      focusTopic: 'Ionization Enthalpy & Electronegativity',
      activeCount: 4,
      hostName: 'Rahul Verma',
      createdTime: '40 mins ago',
    },
    {
      id: 'room_4',
      title: 'Class 9 Biology Cell Structure & Functions',
      classLevel: 'Class 9',
      subject: 'Biology',
      focusTopic: 'Organelles & Osmosis Experiments',
      activeCount: 3,
      hostName: 'Priya Sharma',
      createdTime: '1 hour ago',
    },
  ]);

  // Sidebar Chat State
  const [chatMessages, setChatMessages] = useState<StudyChatMessage[]>([]);
  const [messageInputType, setMessageInputType] = useState<'text' | 'code' | 'latex' | 'image'>('text');
  const [textInput, setTextInput] = useState<string>('');
  const [codeSnippetInput, setCodeSnippetInput] = useState<string>('');
  const [codeLanguage, setCodeLanguage] = useState<string>('python');
  const [latexFormulaInput, setLatexFormulaInput] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentRoomId = activeRoom ? activeRoom.id : 'room_1';

  useEffect(() => {
    loadChatMessages();
  }, [currentRoomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, sidebarOpen]);

  const loadChatMessages = async () => {
    const list = await studyChatService.fetchRoomMessages(currentRoomId);
    setChatMessages(list);
  };

  // Filter rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesClass = selectedClass === 'All' || r.classLevel === selectedClass;
    const matchesSubject = selectedSubject === 'All' || r.subject.toLowerCase() === selectedSubject.toLowerCase();
    return matchesClass && matchesSubject;
  });

  const handleJoinRoom = (room: StudyRoom) => {
    playHoverSound('pop');
    setActiveRoom(room);
    setSidebarOpen(true);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let finalType = messageInputType;
    let finalMsgText = textInput.trim();

    if (finalType === 'code' && !codeSnippetInput.trim()) return;
    if (finalType === 'latex' && !latexFormulaInput.trim()) return;
    if (finalType === 'image' && !imageUrlInput.trim()) return;
    if (finalType === 'text' && !finalMsgText) return;

    if (!finalMsgText) {
      if (finalType === 'code') finalMsgText = `Code snippet (${codeLanguage})`;
      if (finalType === 'latex') finalMsgText = `Math LaTeX equation`;
      if (finalType === 'image') finalMsgText = `Concept diagram attachment`;
    }

    playHoverSound('pop');

    const created = await studyChatService.sendMessage({
      roomId: currentRoomId,
      senderName: currentUser ? currentUser.name : 'Arpita Ghosh',
      senderEmail: currentUser?.email,
      senderClass: currentUser ? currentUser.classLevel : 'Class 10',
      senderRole: 'student',
      messageType: finalType,
      text: finalMsgText,
      codeSnippet: codeSnippetInput.trim(),
      codeLanguage: codeLanguage,
      latexFormula: latexFormulaInput.trim(),
      imageUrl: imageUrlInput.trim(),
    });

    setChatMessages((prev) => [...prev, created]);

    // Reset inputs
    setTextInput('');
    setCodeSnippetInput('');
    setLatexFormulaInput('');
    setImageUrlInput('');

    // AI Moderator trigger response
    if (finalMsgText.toLowerCase().includes('help') || finalMsgText.includes('?') || finalType === 'latex') {
      setTimeout(async () => {
        const aiResp = await studyChatService.sendMessage({
          roomId: currentRoomId,
          senderName: 'AURIX AI Tutor',
          senderClass: 'AI Moderator',
          senderRole: 'moderator_ai',
          messageType: 'text',
          text: `🤖 AI Assistant Tip: Verified concept! Remember to check units (e.g. Ohms Ω, Joules J) before finalizing calculations.`,
        });
        setChatMessages((prev) => [...prev, aiResp]);
      }, 1200);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopic.trim()) return;

    playHoverSound('pop');
    const created: StudyRoom = {
      id: 'room_' + Date.now(),
      title: newTitle.trim(),
      classLevel: selectedClass === 'All' ? 'Class 10' : selectedClass,
      subject: newSubject,
      focusTopic: newTopic.trim(),
      activeCount: 1,
      hostName: currentUser ? currentUser.name : 'Student Host',
      createdTime: 'Just now',
    };

    setRooms((prev) => [created, ...prev]);
    setActiveRoom(created);
    setCreateModalOpen(false);
    setNewTitle('');
    setNewTopic('');
  };

  const copyToClipboard = (str: string, id: string) => {
    navigator.clipboard.writeText(str);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick preset LaTeX formulas
  const PRESET_LATEX_FORMULAS = [
    { label: 'Quadratic Formula', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { label: "Ohm's Law", formula: 'V = I \\cdot R \\implies R = \\frac{V}{I}' },
    { label: 'Einstein Mass-Energy', formula: 'E = m \\cdot c^2' },
    { label: 'Pythagoras', formula: 'a^2 + b^2 = c^2' },
    { label: 'Gravitation', formula: 'F = G \\frac{m_1 m_2}{r^2}' },
    { label: 'Definite Integral', formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)' },
  ];

  // Quick preset image diagrams
  const PRESET_IMAGE_DIAGRAMS = [
    { label: 'Circuit Diagram', url: '/src/assets/images/hero_nature_backdrop_1793877327579.jpg' },
    { label: 'Structure of Atom', url: '/src/assets/images/hero_nature_backdrop_1793877327579.jpg' },
    { label: 'Trigonometric Triangle', url: '/src/assets/images/hero_nature_backdrop_1793877327579.jpg' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left relative">
      {/* Lightbox Image Preview Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={lightboxImage} alt="Concept diagram" className="max-w-full max-h-[85vh] rounded-2xl border border-[#a3e635]/50 object-contain shadow-2xl" />
            <button className="absolute top-3 right-3 p-2 rounded-full bg-[#040604]/80 text-white font-bold">✕</button>
          </div>
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

      {/* Main Header Banner */}
      <div className="aurix-3d-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#122415] via-[#09140b] to-[#040604] border border-[#a3e635]/40 mb-8 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/40 text-xs text-[#bef264] font-bold mb-2 shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>Real-Time Peer Collaboration &amp; Group Study</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight aurix-3d-lime-heading">
              Virtual Study Rooms
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Join live text-based study sessions with peers in your grade. Drop code snippets, LaTeX math equations, and concept diagrams in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playHoverSound('pop');
                setSidebarOpen((prev) => !prev);
              }}
              className="aurix-3d-glass-btn px-4 py-3 rounded-2xl text-xs font-extrabold text-[#bef264] border border-[#a3e635]/40 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-[#a3e635]" />
              <span>{sidebarOpen ? 'Hide Study Chat' : 'Show Study Chat'}</span>
            </button>

            <button
              onClick={() => {
                playHoverSound('pop');
                if (!currentUser) {
                  onOpenAuth('signup');
                } else {
                  setCreateModalOpen(true);
                }
              }}
              className="aurix-3d-button px-5 py-3 rounded-2xl text-xs font-extrabold text-[#040604] flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.35)] cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#040604]" />
              <span>Create Room</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
          <div>
            <label className="block text-[11px] font-bold text-[#bef264] mb-1 uppercase tracking-wider">
              Filter By Grade / Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white text-xs focus:outline-none focus:border-[#a3e635]"
            >
              {['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((c) => (
                <option key={c} value={c} className="bg-[#0c140e] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#bef264] mb-1 uppercase tracking-wider">
              Filter By Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white text-xs focus:outline-none focus:border-[#a3e635]"
            >
              {['All', 'Physics', 'Mathematics', 'Chemistry', 'Biology', 'Science', 'English'].map((s) => (
                <option key={s} value={s} className="bg-[#0c140e] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Rooms / Active Room, Right = Collaborative Study Chat Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL (8 Cols when sidebar open, 12 when closed) */}
        <div className={sidebarOpen ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
          {activeRoom ? (
            /* ACTIVE ROOM DETAILS & OVERVIEW */
            <div className="aurix-3d-card rounded-3xl bg-[#0c140e] border border-[#a3e635]/40 p-5 sm:p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <button
                  onClick={() => setActiveRoom(null)}
                  className="px-3 py-1.5 rounded-xl bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-xs font-semibold text-[#bef264] transition-all cursor-pointer"
                >
                  ← Exit Study Room
                </button>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{activeRoom.activeCount} Peers Connected</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#142316] text-[#bef264] border border-[#a3e635]/40 inline-block mb-2">
                  {activeRoom.classLevel} · {activeRoom.subject}
                </span>
                <h2 className="text-xl font-extrabold text-white">{activeRoom.title}</h2>
                <p className="text-xs text-neutral-300 mt-1">
                  Focus Topic: <strong className="text-white">{activeRoom.focusTopic}</strong> · Host: <strong className="text-[#a3e635]">{activeRoom.hostName}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d09] border border-white/10 text-xs text-neutral-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#bef264]">
                  <Sparkles className="w-4 h-4 text-[#a3e635]" />
                  <span>Room Collaboration Guidelines</span>
                </div>
                <p className="leading-relaxed">
                  Use the <strong>Collaborative Study Chat sidebar</strong> on the right to share step-by-step math proofs, Python/C++ logic snippets, and concept diagrams.
                </p>
              </div>
            </div>
          ) : (
            /* ROOMS LIST GRID */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white">
                  Active Peer Study Rooms ({filteredRooms.length})
                </h2>
                <span className="text-xs text-[#bef264]">Real-Time Collaboration</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => handleJoinRoom(room)}
                    onMouseEnter={() => playHoverSound('hiss')}
                    className="aurix-3d-card group p-5 rounded-3xl bg-[#0a120b]/90 hover:bg-[#0f1b10] border border-white/10 hover:border-[#a3e635]/50 transition-all cursor-pointer space-y-4 flex flex-col justify-between shadow-xl"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#142316] border border-[#a3e635]/35 text-[#bef264] uppercase tracking-wider">
                          {room.classLevel} · {room.subject}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>{room.activeCount} Active</span>
                        </div>
                      </div>

                      <h3 className="text-base font-extrabold text-white group-hover:text-[#bef264] transition-colors">
                        {room.title}
                      </h3>
                      <p className="text-xs text-neutral-300">
                        Focus Topic: <strong className="text-white">{room.focusTopic}</strong>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Host: {room.hostName}</span>
                      <button className="aurix-3d-button py-1.5 px-3.5 rounded-xl text-xs font-bold text-[#040604]">
                        Join Room →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: COLLABORATIVE STUDY CHAT SIDEBAR (5 Cols) */}
        {sidebarOpen && (
          <div className="lg:col-span-5 aurix-3d-card rounded-3xl bg-[#0a120b] border border-[#a3e635]/40 p-4 sm:p-5 flex flex-col justify-between min-h-[580px] shadow-2xl relative overflow-hidden">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#142316] border border-[#a3e635]/40 flex items-center justify-center text-[#a3e635]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-none">Collaborative Study Chat</h3>
                  <span className="text-[10px] text-[#bef264]">Real-Time Code, LaTeX &amp; Images</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 my-3 overflow-y-auto max-h-[380px] space-y-3 pr-1">
              {chatMessages.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-center text-xs text-neutral-400">
                  No messages yet. Send a code snippet or LaTeX formula below!
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isAI = msg.senderRole === 'moderator_ai';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-all ${
                        isAI
                          ? 'bg-[#122214] border-[#a3e635]/40 text-[#bef264]'
                          : 'bg-[#080d09] border-white/15 text-neutral-200'
                      }`}
                    >
                      {/* Sender Info */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {isAI ? (
                            <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-neutral-400" />
                          )}
                          <span>{msg.senderName} ({msg.senderClass})</span>
                        </span>
                        <span className="text-neutral-400 text-[10px]">{msg.timestamp}</span>
                      </div>

                      {/* Text Note */}
                      {msg.text && <p className="leading-relaxed text-neutral-200">{msg.text}</p>}

                      {/* CODE SNIPPET MESSAGE */}
                      {msg.messageType === 'code' && msg.codeSnippet && (
                        <div className="mt-2 rounded-xl bg-[#040604] border border-white/20 overflow-hidden font-mono text-[11px]">
                          <div className="px-3 py-1.5 bg-[#0e1610] border-b border-white/10 flex items-center justify-between text-neutral-400 text-[10px]">
                            <span className="flex items-center gap-1 text-[#bef264] font-bold uppercase">
                              <Terminal className="w-3 h-3 text-[#a3e635]" />
                              {msg.codeLanguage || 'python'}
                            </span>
                            <button
                              onClick={() => copyToClipboard(msg.codeSnippet!, msg.id)}
                              className="hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-sans">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span className="font-sans">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 text-emerald-300 overflow-x-auto whitespace-pre leading-normal">
                            {msg.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {/* LATEX MATH FORMULA MESSAGE */}
                      {msg.messageType === 'latex' && msg.latexFormula && (
                        <div className="mt-2 p-3 rounded-xl bg-[#08120a] border border-[#a3e635]/40 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-[#bef264] font-bold">
                            <span className="flex items-center gap-1">
                              <Binary className="w-3.5 h-3.5 text-[#a3e635]" />
                              <span>Formatted LaTeX Math Equation</span>
                            </span>
                            <button
                              onClick={() => copyToClipboard(msg.latexFormula!, msg.id)}
                              className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          {/* Rendered Math Formula Display */}
                          <div className="p-3 rounded-lg bg-[#040604] border border-white/10 text-center font-mono text-sm text-[#bef264] tracking-wide overflow-x-auto">
                            {msg.latexFormula}
                          </div>
                        </div>
                      )}

                      {/* IMAGE ATTACHMENT MESSAGE */}
                      {msg.messageType === 'image' && msg.imageUrl && (
                        <div className="mt-2 relative group rounded-xl overflow-hidden border border-white/20">
                          <img
                            src={msg.imageUrl}
                            alt="Concept visualizer attachment"
                            className="w-full h-36 object-cover cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setLightboxImage(msg.imageUrl!)}
                          />
                          <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#040604]/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Composer Section */}
            <form onSubmit={handleSendMessage} className="space-y-2 pt-3 border-t border-white/10">
              {/* Type Switcher Bar */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#040604] border border-white/10 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setMessageInputType('text')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                    messageInputType === 'text' ? 'bg-[#142316] text-[#bef264] border border-[#a3e635]/40' : 'text-neutral-400'
                  }`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setMessageInputType('code')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    messageInputType === 'code' ? 'bg-[#142316] text-[#bef264] border border-[#a3e635]/40' : 'text-neutral-400'
                  }`}
                >
                  <Code2 className="w-3 h-3 text-[#a3e635]" />
                  <span>Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessageInputType('latex')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    messageInputType === 'latex' ? 'bg-[#142316] text-[#bef264] border border-[#a3e635]/40' : 'text-neutral-400'
                  }`}
                >
                  <Binary className="w-3 h-3 text-[#a3e635]" />
                  <span>LaTeX</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessageInputType('image')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    messageInputType === 'image' ? 'bg-[#142316] text-[#bef264] border border-[#a3e635]/40' : 'text-neutral-400'
                  }`}
                >
                  <ImageIcon className="w-3 h-3 text-[#a3e635]" />
                  <span>Image</span>
                </button>
              </div>

              {/* TEXT MODE */}
              {messageInputType === 'text' && (
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type study message or question..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#040604] border border-white/15 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#a3e635]"
                />
              )}

              {/* CODE MODE */}
              {messageInputType === 'code' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#bef264] font-bold uppercase">Language</span>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="px-2 py-1 rounded-lg bg-[#040604] border border-white/15 text-white text-[11px]"
                    >
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      <option value="latex">LaTeX</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <textarea
                    rows={3}
                    value={codeSnippetInput}
                    onChange={(e) => setCodeSnippetInput(e.target.value)}
                    placeholder="Paste code snippet here..."
                    className="w-full px-3 py-2 rounded-xl bg-[#040604] border border-white/15 text-emerald-300 font-mono text-xs focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              )}

              {/* LATEX MATH MODE */}
              {messageInputType === 'latex' && (
                <div className="space-y-2">
                  {/* Preset Equation Buttons */}
                  <div className="flex flex-wrap gap-1">
                    {PRESET_LATEX_FORMULAS.map((pf) => (
                      <button
                        key={pf.label}
                        type="button"
                        onClick={() => setLatexFormulaInput(pf.formula)}
                        className="px-2 py-1 rounded-lg bg-[#0e1710] border border-white/10 hover:border-[#a3e635]/40 text-[10px] text-[#bef264] transition-all cursor-pointer"
                      >
                        + {pf.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={latexFormulaInput}
                    onChange={(e) => setLatexFormulaInput(e.target.value)}
                    placeholder="Enter LaTeX equation (e.g. V = I \cdot R or \frac{-b \pm \sqrt{b^2-4ac}}{2a})..."
                    className="w-full px-3 py-2 rounded-xl bg-[#040604] border border-white/15 text-[#bef264] font-mono text-xs focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              )}

              {/* IMAGE MODE */}
              {messageInputType === 'image' && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {PRESET_IMAGE_DIAGRAMS.map((pd) => (
                      <button
                        key={pd.label}
                        type="button"
                        onClick={() => setImageUrlInput(pd.url)}
                        className="px-2 py-1 rounded-lg bg-[#0e1710] border border-white/10 hover:border-[#a3e635]/40 text-[10px] text-[#bef264] transition-all cursor-pointer"
                      >
                        + {pd.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Enter concept diagram image URL..."
                    className="w-full px-3 py-2 rounded-xl bg-[#040604] border border-white/15 text-white text-xs focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full aurix-3d-button py-2.5 rounded-xl text-xs font-extrabold text-[#040604] flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(163,230,53,0.3)]"
              >
                <span>Send to Study Chat</span>
                <Send className="w-3.5 h-3.5 fill-current text-[#040604]" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CREATE ROOM MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateRoom}
            className="relative w-full max-w-md aurix-3d-card bg-[#0c140e] border border-[#a3e635]/45 rounded-3xl p-6 sm:p-8 text-left space-y-4 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-white"
            >
              ✕
            </button>

            <div>
              <span className="text-[11px] font-bold text-[#bef264] uppercase tracking-wider block">
                Peer Collaboration
              </span>
              <h2 className="text-xl font-extrabold text-white">Create Virtual Study Room</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Room Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Class 10 Physics Numericals Sprint..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                >
                  {['Physics', 'Mathematics', 'Chemistry', 'Biology', 'English'].map((s) => (
                    <option key={s} value={s} className="bg-[#0c140e] text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">Focus Topic / Chapter</label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Ohm's law, Quadratic equations..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 aurix-3d-button py-2.5 rounded-xl text-xs font-bold text-[#040604] cursor-pointer"
              >
                Launch Room
              </button>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="aurix-3d-glass-btn py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-300 cursor-pointer"
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
