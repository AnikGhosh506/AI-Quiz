import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  BookOpen,
  HelpCircle,
  ArrowLeft,
  Mic,
  MicOff,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { StudentUser } from '../services/authService';

interface AskAIViewProps {
  currentUser: StudentUser | null;
  initialQuestion?: string;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onBack?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  groundingSources?: Array<{ title: string; url: string }>;
}

export const AskAIView: React.FC<AskAIViewProps> = ({
  currentUser,
  initialQuestion,
  onOpenAuth,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hi! What would you like help with today? You can ask me to explain any difficult concept, solve a maths or science question step by step, or give you practice problems.',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>(
    currentUser?.classLevel || 'Class 10'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputText(transcript);
          }
        };

        rec.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input (Web Speech API) is not supported in this browser. You can type your question directly!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting mic:', err);
      }
    }
  };

  // Suggested prompt chips as specifically requested by user:
  const suggestedPrompts = [
    'Explain this question.',
    'Help me solve this maths problem.',
    'Explain this chapter.',
    'Give me some practice questions.',
    'Why is my answer wrong?',
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle incoming initialQuestion from TakeTestView
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim().length > 0) {
      handleSendMessage(`Can you explain why this question was answered incorrectly and teach me the right concept? Question: "${initialQuestion}"`);
    }
  }, [initialQuestion]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          studentClass: selectedClass,
          subject: selectedSubject,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from AI');
      }

      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: data.groundingSources || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      setErrorMessage(
        err.message ||
          'Could not connect to the AI tutor right now. Please verify your GEMINI_API_KEY in the Secrets panel.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'ai',
        text: 'Hi! What would you like help with today?',
        timestamp: 'Just now',
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col">
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

      {/* View Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/30 text-xs text-[#bef264] font-medium mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Ask AI · Patient Student Tutor</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Ask AI About Your Doubts
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Get clear, simple step-by-step explanations for your school syllabus.
          </p>
        </div>

        {/* Class and Subject selection for context */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2 rounded-xl bg-[#0e1610] border border-white/10 text-white text-xs focus:outline-none focus:border-[#a3e635]"
          >
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="p-2 rounded-xl bg-[#0e1610] border border-white/10 text-white text-xs focus:outline-none focus:border-[#a3e635]"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="English">English</option>
          </select>

          <button
            onClick={handleClearChat}
            title="Start New Topic"
            className="p-2 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
          Click an example question to start:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0e1610] hover:bg-[#152317] border border-white/10 hover:border-[#a3e635]/40 text-neutral-200 hover:text-white transition-all text-left disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area Card */}
      <div className="aurix-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#a3e635]/20 flex-1 flex flex-col justify-between min-h-[460px] bg-[#070c08]/90">
        {/* Messages Feed */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 pb-4">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635] shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-[#0e1710] border border-[#a3e635]/20 text-neutral-100 shadow-[0_2px_15px_rgba(0,0,0,0.3)]'
                      : 'bg-[#a3e635] text-[#040604] font-medium shadow-[0_2px_15px_rgba(163,230,53,0.25)]'
                  }`}
                >
                  {isAI ? (
                    <div className="space-y-2 whitespace-pre-wrap">
                      <div className="flex items-center justify-between text-[10px] text-[#a3e635] font-semibold border-b border-white/5 pb-1 mb-1">
                        <span>AURIX AI Tutor</span>
                        <span className="text-neutral-400 font-normal">{msg.timestamp}</span>
                      </div>
                      <div className="prose prose-invert text-xs sm:text-sm leading-relaxed">
                        {msg.text}
                      </div>

                      {/* Google Search Grounding References */}
                      {msg.groundingSources && msg.groundingSources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-[#a3e635] font-bold uppercase tracking-wider">
                            <Globe className="w-3.5 h-3.5 text-[#a3e635]" />
                            <span>Real-Time Google Search Grounded Sources:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {msg.groundingSources.map((src, i) => (
                              <a
                                key={i}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/30 text-[11px] text-[#bef264] hover:underline transition-all shadow-sm"
                              >
                                <span>{src.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-[#a3e635]" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>{msg.text}</p>
                      <span className="text-[10px] opacity-75 text-right block mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-[#223324] border border-[#a3e635]/40 flex items-center justify-center text-[#bef264] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0e1710] border border-[#a3e635]/20 flex items-center gap-2 text-xs text-[#bef264]">
                <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
                <span>AURIX AI is searching live sources &amp; formulating an explanation...</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Service Status:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Listening Status Banner */}
        {isListening && (
          <div className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2 my-2 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="font-semibold">Microphone Active:</span>
            <span>Listening to your voice... Speak your question clearly now.</span>
          </div>
        )}

        {/* Input Bar with Microphone Access */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-3 border-t border-white/5 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? 'Stop Listening' : 'Voice Input (Speak to AI Tutor)'}
            className={`p-3 rounded-xl transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-red-500/20 text-red-400 border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                : 'bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-[#a3e635] hover:text-white'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : 'Type or speak your question here (e.g. How does photosynthesis work?)...'
            }
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-xl bg-[#0a100b] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635] transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="aurix-pill-button p-3 rounded-xl text-[#040604] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
