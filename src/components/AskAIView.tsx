import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, RotateCcw, AlertCircle, BookOpen, HelpCircle } from 'lucide-react';
import { StudentUser } from '../services/authService';

interface AskAIViewProps {
  currentUser: StudentUser | null;
  initialQuestion?: string;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AskAIView: React.FC<AskAIViewProps> = ({
  currentUser,
  initialQuestion,
  onOpenAuth,
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
                <span>AURIX AI is formulating a clear explanation for you...</span>
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

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-3 border-t border-white/5 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question or doubt here (e.g. How does photosynthesis work?)..."
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
