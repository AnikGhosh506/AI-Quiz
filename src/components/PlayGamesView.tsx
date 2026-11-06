import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, RotateCcw, Trophy, Brain, Zap, Clock, ArrowLeft } from 'lucide-react';

interface PlayGamesViewProps {
  onBack?: () => void;
}

export const PlayGamesView: React.FC<PlayGamesViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'chess' | 'speedmath' | 'memory'>('chess');

  // --- Chess State ---
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [chessSolved, setChessSolved] = useState<boolean>(false);

  const chessMoves = [
    { notation: '1. Nd5', desc: 'Jump knight to d5, threatening both Queen and c7 fork', isWinning: true },
    { notation: '1. Be3', desc: 'Develop dark-squared bishop quietly to e3', isWinning: false },
    { notation: '1. a3', desc: 'Push rook pawn defensively', isWinning: false },
  ];

  const handleChessMove = (move: typeof chessMoves[0]) => {
    setSelectedMove(move.notation);
    setChessSolved(move.isWinning);
  };

  // --- Math Sprint State ---
  const [mathScore, setMathScore] = useState<number>(0);
  const [mathNum1, setMathNum1] = useState<number>(14);
  const [mathNum2, setMathNum2] = useState<number>(7);
  const [mathAnswer, setMathAnswer] = useState<string>('');
  const [mathStreak, setMathStreak] = useState<number>(0);
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctVal = mathNum1 * mathNum2;
    if (parseInt(mathAnswer) === correctVal) {
      setMathScore((prev) => prev + 10);
      setMathStreak((prev) => prev + 1);
      setMathFeedback('Correct! +10 Points');
    } else {
      setMathStreak(0);
      setMathFeedback(`Incorrect. ${mathNum1} × ${mathNum2} = ${correctVal}`);
    }
    // Generate new problem
    const n1 = Math.floor(Math.random() * 15) + 6;
    const n2 = Math.floor(Math.random() * 9) + 3;
    setMathNum1(n1);
    setMathNum2(n2);
    setMathAnswer('');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
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

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full aurix-3d-glass-btn text-xs text-[#bef264] font-semibold mb-1.5">
          <Brain className="w-3.5 h-3.5 text-[#a3e635]" />
          <span>Play Brain Games · Refresh Your Mind</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight aurix-3d-heading">
          Play Games
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300">
          Sharpen strategic thinking, memory, and calculation speed through engaging intellectual challenges.
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex gap-2 sm:gap-3 mb-6 p-1.5 bg-[#0e1610] rounded-2xl border border-white/10 max-w-md">
        <button
          onClick={() => setActiveTab('chess')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'chess'
              ? 'aurix-3d-glass-btn text-[#bef264] border-[#a3e635]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Chess Tactics
        </button>
        <button
          onClick={() => setActiveTab('speedmath')}
          className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'speedmath'
              ? 'aurix-3d-glass-btn text-[#bef264] border-[#a3e635]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Speed Math Sprint
        </button>
      </div>

      {/* GAME 1: CHESS */}
      {activeTab === 'chess' && (
        <div className="aurix-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs uppercase font-bold text-[#a3e635]">
                Tactical Puzzle #142 · White to Move
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5 drop-shadow-sm">
                The Royal Knight Fork
              </h2>
            </div>
            <span className="text-xs text-neutral-400">Class 6–12 Mind Gym</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Chessboard Asset */}
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-white/10 aspect-square">
              <img
                src="/src/assets/images/card_chess_visual_1793877329294.jpg"
                alt="Obsidian chessboard puzzle"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Interactive Move Choices */}
            <div className="md:col-span-7 space-y-4">
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                Black&apos;s King is on e8 and Queen is exposed. Find the winning knight sacrifice that tears through the center and forces material advantage:
              </p>

              <div className="space-y-2.5">
                {chessMoves.map((m, idx) => {
                  const isSelected = selectedMove === m.notation;
                  let style = 'bg-[#090e0a] border-white/10 text-neutral-200 hover:border-white/20';
                  if (isSelected) {
                    style = m.isWinning
                      ? 'bg-[#18281a] border-emerald-500 text-[#bef264]'
                      : 'bg-red-950/20 border-red-500 text-red-200';
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleChessMove(m)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <div>
                        <strong className="font-mono text-[#a3e635] mr-2.5">{m.notation}</strong>
                        <span>{m.desc}</span>
                      </div>
                      {isSelected && m.isWinning && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {chessSolved && (
                <div className="p-4 rounded-xl bg-[#121c13] border border-emerald-500/30 text-xs text-neutral-200 leading-relaxed animate-in fade-in">
                  <strong className="text-emerald-400 block mb-1">Brilliant Move!</strong>
                  <p>
                    1. Nd5 attacks the black Queen while simultaneously threatening Nc7+ royal check and capturing the a8 Rook!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GAME 2: SPEED MATH SPRINT */}
      {activeTab === 'speedmath' && (
        <div className="aurix-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#a3e635]/20 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <span className="text-xs uppercase font-semibold text-[#a3e635]">
                Mental Calculation Sprint
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Rapid Multiplication & Arithmetic
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Score: <strong className="text-[#bef264]">{mathScore}</strong></span>
              <span className="text-xs text-neutral-400">Streak: <strong className="text-emerald-400">{mathStreak}</strong></span>
            </div>
          </div>

          <div className="max-w-md mx-auto text-center space-y-6 py-6">
            <div className="p-6 rounded-2xl bg-[#090e0a] border border-[#a3e635]/30">
              <span className="text-xs uppercase font-semibold text-neutral-400 block mb-2">
                Calculate in your head:
              </span>
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white">
                {mathNum1} × {mathNum2} = ?
              </span>
            </div>

            <form onSubmit={handleMathSubmit} className="flex gap-2">
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Type answer..."
                autoFocus
                className="flex-1 p-3 rounded-xl bg-[#0e1610] border border-white/10 text-center font-mono text-xl text-white focus:outline-none focus:border-[#a3e635]"
              />
              <button
                type="submit"
                className="aurix-pill-button px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#040604] cursor-pointer"
              >
                Submit
              </button>
            </form>

            {mathFeedback && (
              <p className="text-xs sm:text-sm font-semibold text-[#bef264]">
                {mathFeedback}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
