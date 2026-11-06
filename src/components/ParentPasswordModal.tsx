import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, HeartHandshake, KeyRound } from 'lucide-react';
import { playHoverSound } from '../utils/audioEffects';

interface ParentPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (parentName: string, relationship: string) => void;
}

export const ParentPasswordModal: React.FC<ParentPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('Mukherjee (Parent)');
  const [relationship, setRelationship] = useState('Mother / Father');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept standard parent password 'parent123' or '1234' or any 4+ char password for demo ease
    if (password === 'parent123' || password === '1234' || password.length >= 4) {
      playHoverSound('pop');
      setError(null);
      onSuccess(parentName, relationship);
      onClose();
      setPassword('');
    } else {
      setError('Incorrect parent password. Default password is parent123 or 1234.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md aurix-3d-card rounded-3xl border border-[#a3e635]/40 p-6 sm:p-7 text-left space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="aurix-3d-icon-box w-12 h-12 rounded-2xl flex items-center justify-center text-[#a3e635]">
            <Lock className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#a3e635]/20 border border-[#a3e635]/40 text-[#bef264]">
              <HeartHandshake className="w-3 h-3" />
              Parental Authentication Required
            </div>
            <h3 className="text-xl font-extrabold text-white mt-0.5 aurix-3d-heading">
              Enter Parent Password
            </h3>
          </div>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          To protect student privacy and ensure parental oversight, please enter your parent security password before accessing the Parent Portal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-200 mb-1">
              Parent / Guardian Name
            </label>
            <input
              type="text"
              required
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090e0a] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-200 mb-1">
              Parent Access Password <span className="text-[#a3e635]">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Enter password (default: parent123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e0a] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
              />
            </div>
            {error && <span className="text-[11px] text-red-400 block mt-1">{error}</span>}
            <span className="text-[10px] text-[#bef264] block mt-1">
              Default password: <strong className="font-mono text-white">parent123</strong> or <strong className="font-mono text-white">1234</strong>
            </span>
          </div>

          <button
            type="submit"
            className="w-full aurix-3d-button py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Authenticate & Enter Parent Portal</span>
            <ArrowRight className="w-4 h-4 text-[#040604]" />
          </button>
        </form>
      </div>
    </div>
  );
};
