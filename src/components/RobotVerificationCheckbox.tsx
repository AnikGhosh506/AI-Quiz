import React, { useState } from 'react';
import { Check, ShieldCheck, RefreshCw } from 'lucide-react';

interface RobotVerificationCheckboxProps {
  isVerified: boolean;
  onVerify: (verified: boolean) => void;
  error?: string | null;
}

export const RobotVerificationCheckbox: React.FC<RobotVerificationCheckboxProps> = ({
  isVerified,
  onVerify,
  error,
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleClick = () => {
    if (isVerified || isChecking) return;

    setIsChecking(true);
    // Realistic verification simulation
    setTimeout(() => {
      setIsChecking(false);
      onVerify(true);
    }, 600);
  };

  return (
    <div className="space-y-1 my-2">
      <div
        onClick={handleClick}
        className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
          isVerified
            ? 'bg-[#122215] border-[#a3e635]/60 shadow-[0_0_15px_rgba(163,230,53,0.15)]'
            : error
            ? 'bg-[#181111] border-red-500/50'
            : 'bg-[#0a100b] hover:bg-[#101912] border-white/15 hover:border-white/25'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Checkbox Box */}
          <div
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
              isVerified
                ? 'bg-[#a3e635] border-[#a3e635] text-[#040604]'
                : isChecking
                ? 'bg-transparent border-[#a3e635]'
                : 'bg-white/5 border-neutral-400 hover:border-white'
            }`}
          >
            {isVerified ? (
              <Check className="w-5 h-5 stroke-[3] animate-in zoom-in-75 duration-200" />
            ) : isChecking ? (
              <RefreshCw className="w-4 h-4 text-[#a3e635] animate-spin" />
            ) : null}
          </div>

          <div>
            <span
              className={`text-xs sm:text-sm font-semibold block ${
                isVerified ? 'text-white' : 'text-neutral-200'
              }`}
            >
              {isChecking
                ? 'Verifying human presence...'
                : isVerified
                ? 'Verification complete'
                : "I am not a robot"}
            </span>
            <span className="text-[10px] text-neutral-400 block">
              {isVerified ? 'Human verification passed ✓' : 'Click checkbox to verify your login'}
            </span>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex flex-col items-end pl-2 shrink-0">
          <div className="flex items-center gap-1 text-[#a3e635]">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-tight">reCAPTCHA</span>
          </div>
          <span className="text-[9px] text-neutral-400">Security · Privacy</span>
        </div>
      </div>

      {error && !isVerified && (
        <span className="text-[11px] text-red-400 block pl-1 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
