import React, { useState, useEffect } from 'react';
import {
  X,
  HeartHandshake,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Check,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Lock,
  KeyRound,
  Send,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { StudentUser, ParentUser, authService } from '../services/authService';
import { RobotVerificationCheckbox } from './RobotVerificationCheckbox';
import { playHoverSound } from '../utils/audioEffects';

interface ParentalLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (parentUser: ParentUser) => void;
  activeStudent: StudentUser | null;
}

// Social Provider Icons
const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const MicrosoftIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 23 23">
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
);

const AppleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 170 170" fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.99-6.42-9.9-11.45-20.98-15.08-33.24-3.63-12.27-5.45-23.77-5.45-34.52 0-14.28 3.73-26.15 11.19-35.61 7.46-9.46 16.89-14.28 28.29-14.48 4.7 0 10.15 1.25 16.35 3.76 6.2 2.51 10.02 3.82 11.46 3.93 2.02-.22 5.92-1.57 11.69-4.04 5.77-2.48 10.74-3.65 14.92-3.53 11.89.54 21.6 4.76 29.13 12.67-10.46 6.33-15.6 15.11-15.42 26.35.17 8.87 3.51 16.29 10.02 22.25 6.51 5.96 14.26 9.46 23.25 10.5-2.02 5.99-4.34 11.87-6.96 17.64zM119.22 33.15c0-6.72 2.45-13.16 7.35-19.33 4.9-6.17 11.02-10.27 18.35-12.32-.44 6.72-2.93 13.19-7.46 19.41-4.53 6.22-10.6 10.3-18.24 12.24z" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const ParentalLoginModal: React.FC<ParentalLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  activeStudent,
}) => {
  const [loginTab, setLoginTab] = useState<'social' | 'email_otp' | 'phone_otp' | 'direct'>('social');
  const [parentName, setParentName] = useState('Mrs. Sunita Ghosh');
  const [email, setEmail] = useState('parent.ghosh@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+91 98301 23456');
  const [relationship, setRelationship] = useState<'Mother' | 'Father' | 'Guardian'>('Mother');
  const [selectedStudentEmail, setSelectedStudentEmail] = useState('');
  const [availableStudents, setAvailableStudents] = useState<StudentUser[]>([]);

  // OTP Verification States
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState<string | null>(null);

  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState<string | null>(null);

  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [robotError, setRobotError] = useState<string | null>(null);
  const [socialProviderLoading, setSocialProviderLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const list = authService.getAllRegisteredStudents();
      setAvailableStudents(list);

      if (activeStudent) {
        setSelectedStudentEmail(activeStudent.email);
      } else if (list.length > 0) {
        setSelectedStudentEmail(list[0].email);
      }
      setIsRobotVerified(false);
      setRobotError(null);
      setIsEmailOtpSent(false);
      setIsPhoneOtpSent(false);
      setEmailOtpError(null);
      setPhoneOtpError(null);
    }
  }, [isOpen, activeStudent]);

  if (!isOpen) return null;

  // Social Login Handler (Google, Apple ID, Microsoft, GitHub)
  const handleSocialLogin = (provider: 'Google' | 'Apple ID' | 'Microsoft' | 'GitHub', defaultEmail: string) => {
    playHoverSound('click');
    setSocialProviderLoading(provider);

    setTimeout(() => {
      setSocialProviderLoading(null);
      const pName = parentName || (provider === 'Google' ? 'Mrs. Sunita Ghosh' : 'Parent User');
      const pEmail = email || defaultEmail;

      const parentUser = authService.loginAsParent({
        parentName: pName,
        email: pEmail,
        phoneNumber: phoneNumber || '+91 98301 23456',
        relationship,
        studentEmail: selectedStudentEmail || 'arpitaghosh2167@gmail.com',
      });

      onSuccess(parentUser);
      onClose();
    }, 600);
  };

  // Email OTP Send & Verify
  const handleSendEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    playHoverSound('pop');
    setIsEmailOtpSent(true);
    setEmailOtpCode('7492');
    setEmailOtpError(null);
  };

  const handleVerifyEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRobotVerified) {
      setRobotError("Please check 'I am not a robot' to verify.");
      return;
    }
    if (emailOtpCode !== '7492') {
      setEmailOtpError('Invalid OTP code. Please use 7492.');
      return;
    }
    playHoverSound('pop');

    const parentUser = authService.loginAsParent({
      parentName: parentName.trim() || 'Parent User',
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      relationship,
      studentEmail: selectedStudentEmail,
    });

    onSuccess(parentUser);
    onClose();
  };

  // Phone OTP Send & Verify
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    playHoverSound('pop');
    setIsPhoneOtpSent(true);
    setPhoneOtpCode('7492');
    setPhoneOtpError(null);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRobotVerified) {
      setRobotError("Please check 'I am not a robot' to verify.");
      return;
    }
    if (phoneOtpCode !== '7492') {
      setPhoneOtpError('Invalid OTP code. Please use 7492.');
      return;
    }
    playHoverSound('pop');

    const parentUser = authService.loginAsParent({
      parentName: parentName.trim() || 'Parent User',
      email: email.trim() || `parent.${phoneNumber.replace(/\D/g, '').slice(-4)}@gmail.com`,
      phoneNumber: phoneNumber.trim(),
      relationship,
      studentEmail: selectedStudentEmail,
    });

    onSuccess(parentUser);
    onClose();
  };

  // Direct Form Submission
  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRobotVerified) {
      setRobotError("Please check the 'I am not a robot' box to verify your login.");
      return;
    }

    playHoverSound('pop');
    const parentUser = authService.loginAsParent({
      parentName: parentName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      relationship,
      studentEmail: selectedStudentEmail,
    });

    onSuccess(parentUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0c140e] border border-[#a3e635]/35 p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.85)] max-h-[92vh] overflow-y-auto aurix-3d-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#142316] border border-[#a3e635]/30 text-[11px] text-[#bef264] font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Parent &amp; Guardian Access</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight aurix-3d-heading">
            Parental Login &amp; Oversight
          </h2>
          <p className="text-xs text-neutral-300 mt-1">
            Access child performance reports, test scores, progress analytics, and monitoring controls.
          </p>
        </div>

        {/* Linked Student Selector by Gmail (Always Visible) */}
        <div className="mb-4 text-left p-3 rounded-2xl bg-[#080e09] border border-white/10 space-y-2">
          <label className="block text-xs font-bold text-[#bef264]">
            1. Select Linked Student (Child Gmail Account) <span className="text-[#a3e635]">*</span>
          </label>
          <select
            value={selectedStudentEmail}
            onChange={(e) => setSelectedStudentEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0e1610] border border-white/10 text-white text-xs focus:outline-none focus:border-[#a3e635] cursor-pointer"
          >
            {availableStudents.map((s) => (
              <option key={s.email} value={s.email} className="bg-[#0c140e] text-white">
                {s.email} ({s.name} · {s.classLevel})
              </option>
            ))}
          </select>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="email"
              value={selectedStudentEmail}
              onChange={(e) => setSelectedStudentEmail(e.target.value)}
              placeholder="Or enter student Gmail (e.g. arpitaghosh2167@gmail.com)"
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0e1610] border border-white/10 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#a3e635]"
            />
          </div>
          <span className="text-[11px] text-neutral-400 block font-mono">
            Linked to: <span className="text-[#a3e635] font-semibold">{selectedStudentEmail || 'None'}</span>
          </span>
        </div>

        {/* Login Method Tabs */}
        <div className="flex p-1 bg-[#060a07] rounded-xl border border-white/10 mb-4 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLoginTab('social')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              loginTab === 'social'
                ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Social 1-Click
          </button>
          <button
            type="button"
            onClick={() => setLoginTab('email_otp')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              loginTab === 'email_otp'
                ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Email OTP
          </button>
          <button
            type="button"
            onClick={() => setLoginTab('phone_otp')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              loginTab === 'phone_otp'
                ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Phone OTP
          </button>
          <button
            type="button"
            onClick={() => setLoginTab('direct')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              loginTab === 'direct'
                ? 'bg-[#152719] text-[#bef264] border border-[#a3e635]/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Password/Form
          </button>
        </div>

        {/* Relationship Selector */}
        <div className="mb-4 text-left">
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            I am the student&apos;s:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Mother', 'Father', 'Guardian'] as const).map((rel) => (
              <button
                key={rel}
                type="button"
                onClick={() => {
                  playHoverSound('click');
                  setRelationship(rel);
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  relationship === rel
                    ? 'bg-[#152719] border-[#a3e635] text-[#bef264] shadow-sm'
                    : 'bg-[#09100a] border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TAB 1: 1-CLICK SOCIAL LOGINS ================= */}
        {loginTab === 'social' && (
          <div className="space-y-3 text-left">
            <span className="text-xs font-semibold text-neutral-300 block">
              Authenticate via Parental Social Single Sign-On:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Google', 'parent.ghosh@gmail.com')}
                className="aurix-3d-glass-btn p-3 rounded-xl text-xs font-bold text-white bg-[#0e1710] hover:bg-[#142316] border border-[#a3e635]/30 hover:border-[#a3e635]/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Google Login</span>
              </button>

              {/* Apple ID */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Apple ID', 'parent.apple@icloud.com')}
                className="aurix-3d-glass-btn p-3 rounded-xl text-xs font-bold text-white bg-[#0e1710] hover:bg-[#142316] border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <AppleIcon className="w-4 h-4 text-white" />
                <span>Apple ID</span>
              </button>

              {/* Microsoft */}
              <button
                type="button"
                onClick={() => handleSocialLogin('Microsoft', 'parent.outlook@outlook.com')}
                className="aurix-3d-glass-btn p-3 rounded-xl text-xs font-bold text-white bg-[#0e1710] hover:bg-[#142316] border border-[#a3e635]/30 hover:border-[#a3e635]/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MicrosoftIcon className="w-4 h-4" />
                <span>Microsoft</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub', 'parent.dev@github.com')}
                className="aurix-3d-glass-btn p-3 rounded-xl text-xs font-bold text-white bg-[#0e1710] hover:bg-[#142316] border border-white/15 hover:border-[#a3e635]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <GithubIcon className="w-4 h-4 text-white" />
                <span>GitHub</span>
              </button>
            </div>

            {socialProviderLoading && (
              <div className="p-3 rounded-xl bg-[#142316] border border-[#a3e635]/40 flex items-center justify-center gap-2 text-xs text-[#bef264]">
                <RefreshCw className="w-4 h-4 animate-spin text-[#a3e635]" />
                <span>Authenticating via {socialProviderLoading}...</span>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: EMAIL OTP VERIFICATION ================= */}
        {loginTab === 'email_otp' && (
          <div className="space-y-3.5 text-left">
            {!isEmailOtpSent ? (
              <form onSubmit={handleSendEmailOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1">
                    Parent Email Address <span className="text-[#a3e635]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full aurix-3d-button py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#040604] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#040604]" />
                  <span>Send Email Verification OTP</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailOtp} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[#111c12] border border-[#a3e635]/30 text-xs">
                  <div className="flex items-center justify-between text-[#bef264] font-semibold mb-1">
                    <span>OTP sent to {email}</span>
                    <button
                      type="button"
                      onClick={() => setIsEmailOtpSent(false)}
                      className="text-[11px] underline text-neutral-300 hover:text-white"
                    >
                      Change
                    </button>
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    Verification Code: <strong className="font-mono text-[#a3e635]">7492</strong> (auto-filled)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1">
                    Enter 4-Digit Email OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={emailOtpCode}
                      onChange={(e) => setEmailOtpCode(e.target.value)}
                      placeholder="7492"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white font-mono text-center tracking-widest text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                  {emailOtpError && <span className="text-[11px] text-red-400 block mt-1">{emailOtpError}</span>}
                </div>

                <RobotVerificationCheckbox
                  isVerified={isRobotVerified}
                  onVerify={(v) => {
                    setIsRobotVerified(v);
                    if (v) setRobotError(null);
                  }}
                  error={robotError}
                />

                <button
                  type="submit"
                  className="w-full aurix-3d-button py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#040604] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#040604]" />
                  <span>Verify Email OTP &amp; Log In</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= TAB 3: PHONE OTP VERIFICATION ================= */}
        {loginTab === 'phone_otp' && (
          <div className="space-y-3.5 text-left">
            {!isPhoneOtpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1">
                    Parent Mobile Number <span className="text-[#a3e635]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98301 23456"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full aurix-3d-button py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#040604] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-[#040604]" />
                  <span>Send Phone Verification OTP</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[#111c12] border border-[#a3e635]/30 text-xs">
                  <div className="flex items-center justify-between text-[#bef264] font-semibold mb-1">
                    <span>SMS OTP sent to {phoneNumber}</span>
                    <button
                      type="button"
                      onClick={() => setIsPhoneOtpSent(false)}
                      className="text-[11px] underline text-neutral-300 hover:text-white"
                    >
                      Change
                    </button>
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    Verification Code: <strong className="font-mono text-[#a3e635]">7492</strong> (auto-filled)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1">
                    Enter 4-Digit SMS OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={phoneOtpCode}
                      onChange={(e) => setPhoneOtpCode(e.target.value)}
                      placeholder="7492"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white font-mono text-center tracking-widest text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                  {phoneOtpError && <span className="text-[11px] text-red-400 block mt-1">{phoneOtpError}</span>}
                </div>

                <RobotVerificationCheckbox
                  isVerified={isRobotVerified}
                  onVerify={(v) => {
                    setIsRobotVerified(v);
                    if (v) setRobotError(null);
                  }}
                  error={robotError}
                />

                <button
                  type="submit"
                  className="w-full aurix-3d-button py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#040604] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#040604]" />
                  <span>Verify SMS OTP &amp; Log In</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= TAB 4: DIRECT FORM / PASSWORD LOG IN ================= */}
        {loginTab === 'direct' && (
          <form onSubmit={handleDirectSubmit} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-semibold text-neutral-200 mb-1">
                Parent / Guardian Full Name <span className="text-[#a3e635]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Mrs. Sunita Ghosh"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-200 mb-1">
                  Parent Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-200 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98301 23456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d09] border border-white/10 text-white text-xs focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              </div>
            </div>

            <RobotVerificationCheckbox
              isVerified={isRobotVerified}
              onVerify={(v) => {
                setIsRobotVerified(v);
                if (v) setRobotError(null);
              }}
              error={robotError}
            />

            <button
              type="submit"
              className="w-full aurix-3d-button py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#040604] flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(163,230,53,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              <span>Access Parent Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-[#142316]/70 border border-[#a3e635]/30 text-xs text-neutral-300 flex items-start gap-2.5 text-left">
          <ShieldCheck className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-[#bef264] block mb-0.5">Parental Transparency Guarantee</strong>
            Monitor test scores, inspect AI tutor responses, and view your child&apos;s academic standing in real time.
          </div>
        </div>
      </div>
    </div>
  );
};
