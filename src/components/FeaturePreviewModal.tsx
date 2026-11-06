import React, { useState } from 'react';
import { X, Target, MessageSquare, Play, Sparkles, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface FeaturePreviewModalProps {
  type: 'assessment' | 'tutor' | 'games' | null;
  onClose: () => void;
  onStartLearning: () => void;
}

export const FeaturePreviewModal: React.FC<FeaturePreviewModalProps> = ({
  type,
  onClose,
  onStartLearning,
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl aurix-glass-card bg-[#080d09] rounded-2xl sm:rounded-3xl border border-[#a3e635]/30 shadow-[0_0_50px_rgba(163,230,53,0.15)] overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'assessment' && <AssessmentPreview onStartLearning={onStartLearning} />}
        {type === 'tutor' && <TutorPreview onStartLearning={onStartLearning} />}
        {type === 'games' && <GamesPreview onStartLearning={onStartLearning} />}
      </div>
    </div>
  );
};

// 1. Assessment Live Preview
const AssessmentPreview: React.FC<{ onStartLearning: () => void }> = ({ onStartLearning }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const question = {
    domain: 'Physics & Thermodynamics',
    title: 'Entropy and Information Entropy',
    prompt:
      'A closed thermal system transitions between two macrostates. According to both Landauer’s principle and the second law of thermodynamics, what occurs when 1 bit of physical information is irreversibly erased?',
    options: [
      { text: 'Zero energy is exchanged because information is abstract rather than physical.', isCorrect: false },
      { text: 'A minimum heat of k_B * T * ln(2) must be dissipated into the surroundings.', isCorrect: true },
      { text: 'Entropy decreases both locally and universally without heat loss.', isCorrect: false },
      { text: 'The system enters a lower microstate volume without temperature variation.', isCorrect: false },
    ],
    explanation:
      'Landauer’s Principle demonstrates that erasure of one bit of physical information creates a minimum thermodynamic dissipation of Q = k_B * T * ln(2), proving information is physical and inextricably bound to entropy.',
  };

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setHasSubmitted(true);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635]">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a3e635]">
            Diagnostic Simulator
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Measure What Matters
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1610] border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Domain: {question.domain}</span>
          <span className="text-[#a3e635] font-medium">Concept Depth: Level 4</span>
        </div>
        <p className="text-sm sm:text-base text-neutral-100 font-medium leading-relaxed">
          {question.prompt}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          let borderStyle = 'border-white/10 hover:border-[#a3e635]/40 hover:bg-[#121c13]';
          if (isSelected) borderStyle = 'border-[#a3e635] bg-[#142416] text-[#bef264]';
          if (hasSubmitted) {
            if (option.isCorrect) borderStyle = 'border-[#84cc16] bg-[#84cc16]/15 text-[#bef264]';
            else if (isSelected) borderStyle = 'border-red-500/80 bg-red-950/20 text-red-200';
            else borderStyle = 'opacity-40 border-white/5';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${borderStyle}`}
            >
              <span>{option.text}</span>
              {hasSubmitted && option.isCorrect && (
                <CheckCircle2 className="w-4 h-4 text-[#84cc16] shrink-0 ml-2" />
              )}
              {hasSubmitted && isSelected && !option.isCorrect && (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation after submission */}
      {hasSubmitted && (
        <div className="p-4 rounded-xl bg-[#121c13] border border-[#a3e635]/30 text-xs sm:text-sm text-neutral-200 leading-relaxed space-y-2 animate-in fade-in">
          <div className="font-semibold text-[#a3e635] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            AURIX Diagnostic Feedback
          </div>
          <p>{question.explanation}</p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
        {!hasSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] bg-[#a3e635] hover:bg-[#bef264] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
          >
            Submit Diagnostic Answer
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}

        <button
          onClick={onStartLearning}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#bef264] hover:text-white transition-colors flex items-center justify-center gap-1.5 group"
        >
          <span>Unlock Full Adaptive Assessment</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// 2. AI Tutor Live Preview
const TutorPreview: React.FC<{ onStartLearning: () => void }> = ({ onStartLearning }) => {
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  const dialogues = [
    {
      prompt: 'Why does light bend when entering water from air?',
      tutorReply:
        'Light travels at different phase velocities through different optical media. In denser optical water, light waves slow down (~225,000 km/s vs ~300,000 km/s in vacuum). By Fermat’s Principle of Least Time, the path taken between two points is the one requiring the least duration, causing the trajectory to refract toward the normal.',
      socraticFollowUp:
        'If light slows down, does its frequency change, or does its wavelength compress? What does that imply about the energy of each photon?',
    },
    {
      prompt: 'What makes prime numbers so fundamental in mathematics?',
      tutorReply:
        'The Fundamental Theorem of Arithmetic proves every integer greater than 1 is either prime itself or uniquely factorizable as a product of prime powers. They act as the indivisible chemical elements of the number realm.',
      socraticFollowUp:
        'Consider the distribution: as numbers grow arbitrarily large, does the gap between consecutive primes have an upper limit? Think of the Twin Prime Conjecture.',
    },
    {
      prompt: 'How do neural networks avoid merely memorizing training data?',
      tutorReply:
        'Through regularized inductive biases: techniques like weight decay (L2 shrinkage), stochastic dropout, batch normalization, and early stopping constrain hypothesis space complexity, forcing the network to model invariant structural patterns rather than idiosyncratic noise.',
      socraticFollowUp:
        'What balance dictates whether a model underfits or overfits? How does validation loss signal when optimization turns into memorization?',
    },
  ];

  const currentDialogue = dialogues[selectedPrompt];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635]">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a3e635]">
            Socratic Intelligence Simulator
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Ask. Understand. Master.
          </h3>
        </div>
      </div>

      {/* Preset questions */}
      <div className="flex flex-wrap gap-2">
        {dialogues.map((d, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPrompt(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              selectedPrompt === idx
                ? 'bg-[#182619] border-[#a3e635] text-[#bef264]'
                : 'bg-white/5 border-white/5 text-neutral-300 hover:border-white/20'
            }`}
          >
            Prompt {idx + 1}
          </button>
        ))}
      </div>

      {/* Dialogue Thread */}
      <div className="space-y-3.5">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Student</span>
          &ldquo;{currentDialogue.prompt}&rdquo;
        </div>

        <div className="p-4 rounded-xl bg-[#0f1911] border border-[#a3e635]/30 text-xs sm:text-sm text-neutral-100 leading-relaxed space-y-3 shadow-[0_0_30px_rgba(163,230,53,0.06)]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#a3e635] flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AURIX AI Companion
            </span>
            <p className="text-neutral-200">{currentDialogue.tutorReply}</p>
          </div>

          <div className="pt-3 border-t border-[#a3e635]/20 text-[#bef264] text-xs">
            <span className="font-semibold block mb-1">Socratic Deepening:</span>
            <p className="italic text-neutral-300">{currentDialogue.socraticFollowUp}</p>
          </div>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
        <span className="text-xs text-neutral-400">
          Unlimited dialogue depth available in student portal.
        </span>
        <button
          onClick={onStartLearning}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] bg-[#a3e635] hover:bg-[#bef264] transition-all flex items-center justify-center gap-1.5"
        >
          <span>Begin Conversation with AI Tutor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 3. Chess & Mind Games Preview
const GamesPreview: React.FC<{ onStartLearning: () => void }> = ({ onStartLearning }) => {
  const [solved, setSolved] = useState(false);
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  const moves = [
    { notation: '1. Nd5', description: 'Attack queen and threaten c7 fork', isWinning: true },
    { notation: '1. Be3', description: 'Passive bishop defense', isWinning: false },
    { notation: '1. h3', description: 'Quiet pawn flank move', isWinning: false },
  ];

  const handleMove = (m: (typeof moves)[0]) => {
    setSelectedMove(m.notation);
    if (m.isWinning) {
      setSolved(true);
    } else {
      setSolved(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635]">
          <Play className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a3e635]">
            Cognitive Challenge Playground
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Play With Intelligence
          </h3>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#0d160f] border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Tactical Chess Problem · White to Move</span>
          <span className="text-[#a3e635] font-medium">Difficulty: Intermediate</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-200">
          Black has placed their King on e8 and Rook on a8. Find the tactical knight penetration that guarantees winning material or crushing positional tempo.
        </p>
      </div>

      {/* Move choices */}
      <div className="space-y-2">
        {moves.map((move, idx) => {
          const isSelected = selectedMove === move.notation;
          let btnStyle = 'border-white/10 hover:border-[#a3e635]/40 hover:bg-[#121c13]';
          if (isSelected) {
            btnStyle = move.isWinning
              ? 'border-[#84cc16] bg-[#84cc16]/20 text-[#bef264]'
              : 'border-red-500 bg-red-950/20 text-red-200';
          }
          return (
            <button
              key={idx}
              onClick={() => handleMove(move)}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <div>
                <span className="font-mono font-bold text-white mr-2">{move.notation}</span>
                <span className="text-neutral-300">{move.description}</span>
              </div>
              {isSelected && move.isWinning && (
                <CheckCircle2 className="w-4 h-4 text-[#84cc16] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {solved && (
        <div className="p-4 rounded-xl bg-[#121c13] border border-[#a3e635]/30 text-xs sm:text-sm text-neutral-200 leading-relaxed animate-in fade-in">
          <span className="font-bold text-[#bef264] block mb-1">Puzzle Solved!</span>
          <p>
            1. Nd5 creates an unavoidable double threat: either capturing the black queen or forcing 2. Nc7+ winning the rook with royal check. Rapid calculation strengthens neuroplasticity.
          </p>
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
        <span className="text-xs text-neutral-400">
          Over 500+ logic puzzles, chess challenges and memory gauntlets.
        </span>
        <button
          onClick={onStartLearning}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] bg-[#a3e635] hover:bg-[#bef264] transition-all flex items-center justify-center gap-1.5"
        >
          <span>Play Full Game Suite</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
