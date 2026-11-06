import React from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Compass, Shield } from 'lucide-react';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLearning: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onStartLearning,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg aurix-glass-card bg-[#080d09] rounded-2xl sm:rounded-3xl border border-[#a3e635]/30 shadow-[0_0_50px_rgba(163,230,53,0.2)] overflow-hidden p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#142316] border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a3e635]">
                Special Announcement
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                The Next Level of Learning
              </h3>
            </div>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            AURIX unites cognitive science with machine intelligence to replace rote memorization with authentic conceptual intuition.
          </p>

          <div className="p-4 rounded-xl bg-[#0e1610] border border-white/5 space-y-3 text-xs sm:text-[13px] text-neutral-300">
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] mt-1.5 shrink-0" />
              <span>
                <strong>Deep Diagnostic Calibration:</strong> Pinpoints latent micro-gaps before exams reveal them.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] mt-1.5 shrink-0" />
              <span>
                <strong>Zero-Judgment Socratic Tutor:</strong> Patient, multi-layered explanations adapted to your pace.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] mt-1.5 shrink-0" />
              <span>
                <strong>Mental Resilience Gym:</strong> Chess tactics and spatial logic games to refresh your focus.
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <span className="text-xs text-[#a3e635] font-medium">
              Curated by Saheb Mukherjee
            </span>
            <button
              onClick={() => {
                onClose();
                onStartLearning();
              }}
              className="w-full sm:w-auto aurix-pill-button py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold text-[#040604] flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
