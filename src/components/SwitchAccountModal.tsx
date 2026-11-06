import React, { useState, useEffect } from 'react';
import { X, Check, Users, UserPlus, ShieldCheck, ArrowRight, Sparkles, HeartHandshake } from 'lucide-react';
import { StudentUser, authService } from '../services/authService';

interface SwitchAccountModalProps {
  isOpen: boolean;
  currentUser: StudentUser | null;
  onClose: () => void;
  onSelectAccount: (user: StudentUser) => void;
  onAddNewAccount: () => void;
  onOpenParentLogin: () => void;
}

export const SwitchAccountModal: React.FC<SwitchAccountModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSelectAccount,
  onAddNewAccount,
  onOpenParentLogin,
}) => {
  const [accounts, setAccounts] = useState<StudentUser[]>([]);

  useEffect(() => {
    if (isOpen) {
      const list = authService.getAllRegisteredStudents();
      setAccounts(list);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSwitch = (account: StudentUser) => {
    const switched = authService.switchAccount(account.email);
    if (switched) {
      onSelectAccount(switched);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c140e] border border-[#a3e635]/35 p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.85)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#142316] border border-[#a3e635]/30 text-[11px] text-[#bef264] font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Multi-Account Switcher</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Switch Account
          </h2>
          <p className="text-xs text-neutral-300 mt-1">
            Choose an active student profile or sign into another account without losing saved progress.
          </p>
        </div>

        {/* Accounts List */}
        <div className="space-y-2.5 mb-6 text-left">
          {accounts.map((acc) => {
            const isActive = currentUser?.email.toLowerCase() === acc.email.toLowerCase();
            const initials = acc.name
              ? acc.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'ST';

            return (
              <div
                key={acc.id || acc.email}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#152719] border-[#a3e635]/70 shadow-[0_0_20px_rgba(163,230,53,0.15)]'
                    : 'bg-[#09100a] hover:bg-[#101c12] border-white/10 hover:border-[#a3e635]/40 cursor-pointer'
                }`}
                onClick={() => !isActive && handleSwitch(acc)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      isActive
                        ? 'bg-[#a3e635] text-[#040604] border-[#bef264]'
                        : 'bg-[#142316] text-[#bef264] border-[#a3e635]/30'
                    }`}
                  >
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">{acc.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#162a19] text-[#a3e635] font-semibold shrink-0">
                        {acc.classLevel}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 truncate">{acc.email}</div>
                    <div className="text-[11px] text-neutral-300 truncate">
                      {acc.schoolName} · Roll #{acc.rollNumber || '01'}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#a3e635]/20 border border-[#a3e635]/50 text-[#bef264]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSwitch(acc);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-xs font-semibold text-[#bef264] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Switch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          {/* Add Another Account */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNewAccount();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#a3e635]" />
            <span>+ Add / Log into Another Account</span>
          </button>

          {/* Parental Login Option */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenParentLogin();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#142316]/60 hover:bg-[#142316] border border-[#a3e635]/30 text-xs sm:text-sm font-semibold text-[#bef264] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-[#a3e635]" />
            <span>Switch to Parental Login (Parent Portal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
