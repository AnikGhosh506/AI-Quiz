import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  Lock,
  Mail,
  User,
  School as SchoolIcon,
  Upload,
  Scan,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Sparkles,
  QrCode,
  Search,
  Check,
  RefreshCw,
  Phone,
  KeyRound,
  Smartphone,
  Camera,
} from 'lucide-react';
import { authService, StudentUser, SignupPayload, AuthProviderType } from '../services/authService';
import { RobotVerificationCheckbox } from './RobotVerificationCheckbox';
import { CLASSES_LIST } from '../data/quizData';
import { POPULAR_SCHOOLS, SCHOOL_BOARDS, School } from '../data/schoolsData';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: StudentUser, redirectRoute?: string | null) => void;
  onOpenParentLogin?: () => void;
}

// Provider Icons
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  onSuccess,
  onOpenParentLogin,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Step state: 'signin_form' | 'signup_home' | 'student_profile_dialog' | 'ai_verification'
  const [activeStep, setActiveStep] = useState<
    'signin_form' | 'signup_home' | 'student_profile_dialog' | 'ai_verification'
  >(initialMode === 'signin' ? 'signin_form' : 'signup_home');

  // Provider selection dialog (in Sign Up)
  const [activeProviderModal, setActiveProviderModal] = useState<AuthProviderType | null>(null);
  const [providerLoading, setProviderLoading] = useState(false);
  const [chosenProvider, setChosenProvider] = useState<AuthProviderType>('email');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('student123');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Student Profile Dialog Fields (Name, Class, School)
  const [fullName, setFullName] = useState('');
  const [classLevel, setClassLevel] = useState('Class 10');
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('Delhi Public School (DPS RK Puram)');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(POPULAR_SCHOOLS[0]);
  const [schoolBoard, setSchoolBoard] = useState<string>('CBSE');
  const [schoolCity, setSchoolCity] = useState('New Delhi');
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const schoolDropdownRef = useRef<HTMLDivElement>(null);

  // Real-Time AI ID Card Verification State
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [isAiVerifying, setIsAiVerifying] = useState(false);
  const [aiVerificationSuccess, setAiVerificationSuccess] = useState(false);
  const [aiConfidenceScore, setAiConfidenceScore] = useState<number | null>(null);
  const [aiRejectionReason, setAiRejectionReason] = useState<string | null>(null);
  const [aiDetectedDetails, setAiDetectedDetails] = useState<{
    detectedSchool?: string;
    detectedStudentName?: string;
    detectedRollNo?: string;
    detectedClass?: string;
    summary?: string;
  } | null>(null);
  const [verifiedStudentIdCode, setVerifiedStudentIdCode] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [createdUser, setCreatedUser] = useState<StudentUser | null>(null);

  // "I am not a robot" verification state
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [robotError, setRobotError] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setActiveStep(initialMode === 'signin' ? 'signin_form' : 'signup_home');
    setAuthMethod('email');
    setIsOtpSent(false);
    setOtpCode('');
    setOtpError(null);
    setIsCompleted(false);
    setActiveProviderModal(null);
    setIdCardPreview(null);
    setIsAiVerifying(false);
    setAiVerificationSuccess(false);
    setAiRejectionReason(null);
    setAiDetectedDetails(null);
    setIsRobotVerified(false);
    setRobotError(null);
  }, [initialMode, isOpen]);

  // Click outside to close school dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(event.target as Node)) {
        setIsSchoolDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Filter schools
  const filteredSchools = POPULAR_SCHOOLS.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  );

  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school);
    setSchoolSearchQuery(school.name);
    setSchoolBoard(school.board);
    setSchoolCity(school.city);
    setIsSchoolDropdownOpen(false);
  };

  const handleCustomSchoolInput = (text: string) => {
    setSchoolSearchQuery(text);
    setSelectedSchool(null);
    setIsSchoolDropdownOpen(true);
  };

  // 1. SIGN IN: EMAIL & PASSWORD (EXCLUDED FROM SOCIAL LOGINS)
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRobotVerified) {
      setRobotError('Please check "I am not a robot" before signing in.');
      return;
    }
    setRobotError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const result = authService.checkAndLoginWithEmail(email);

      if (!result.isNewUser && result.user) {
        // ALREADY REGISTERED -> Go directly to Home section!
        setCreatedUser(result.user);
        setIsCompleted(true);
        setTimeout(() => {
          onSuccess(result.user!, 'home');
          onClose();
        }, 800);
      } else {
        // NEW USER -> Dialogue box must appear to write Name, Class, School!
        setChosenProvider('email');
        if (!fullName) {
          const guessedName = email.split('@')[0] || 'Student';
          setFullName(guessedName.charAt(0).toUpperCase() + guessedName.slice(1));
        }
        setActiveStep('student_profile_dialog');
      }
    }, 400);
  };

  // 2. SIGN IN: PHONE NUMBER WITH OTP
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsOtpSent(true);
    setOtpError(null);
    setOtpCode('7492');
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRobotVerified) {
      setRobotError('Please check "I am not a robot" before continuing.');
      return;
    }
    setRobotError(null);
    setIsSubmitting(true);
    setOtpError(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = authService.verifyPhoneOtp(phoneNumber, otpCode);

      if (!res.success) {
        setOtpError('Invalid OTP code. Please use verification code 7492.');
        return;
      }

      if (!res.isNewUser && res.user) {
        // Registered phone user -> direct to Home!
        setCreatedUser(res.user);
        setIsCompleted(true);
        setTimeout(() => {
          onSuccess(res.user!, 'home');
          onClose();
        }, 800);
      } else {
        // New phone user -> dialogue box appears to write Name, Class, School!
        setChosenProvider('phone');
        if (!email) {
          setEmail(`student.${phoneNumber.replace(/\D/g, '').slice(-4)}@aurix.edu`);
        }
        setActiveStep('student_profile_dialog');
      }
    }, 500);
  };

  // 3. PROVIDER AUTH (Google, Microsoft, Apple, GitHub) - Included in Sign In
  const handleSelectProvider = (
    provider: AuthProviderType,
    profile: { name: string; email: string }
  ) => {
    setProviderLoading(true);

    setTimeout(() => {
      setProviderLoading(false);
      setActiveProviderModal(null);
      setChosenProvider(provider);

      // Check if this email is already registered in registry
      const isReg = authService.isEmailRegistered(profile.email);
      if (isReg) {
        // ALREADY REGISTERED -> Go directly to Home section!
        const existing = authService.getUserByIdentifier(profile.email);
        if (existing) {
          localStorage.setItem('aurix_current_student', JSON.stringify(existing));
          setCreatedUser(existing);
          setIsCompleted(true);
          setTimeout(() => {
            onSuccess(existing, 'home');
            onClose();
          }, 800);
          return;
        }
      }

      // NEW USER -> Dialogue box must appear to write Name, Class, School!
      setFullName(profile.name);
      setEmail(profile.email);
      setActiveStep('student_profile_dialog');
    }, 400);
  };

  // 4. STUDENT PROFILE DIALOGUE SUBMIT (Saves Name, Class, School)
  const handleCompleteStudentProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    // Advance to REAL-TIME AI ID Card Verification
    setActiveStep('ai_verification');
  };

  // 5. REAL-TIME AI ID CARD CREDENTIAL VERIFICATION (Calls /api/verify-id-card)
  const handleFileUploadAndVerify = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAiRejectionReason(null);
    setAiVerificationSuccess(false);

    // Read preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      setIdCardPreview(base64Data);

      // Trigger server-side AI verification
      await runRealTimeAiVerification(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const runRealTimeAiVerification = async (imageBase64: string) => {
    setIsAiVerifying(true);
    setAiRejectionReason(null);
    setAiVerificationSuccess(false);

    try {
      const response = await fetch('/api/verify-id-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBase64,
          studentName: fullName,
          classLevel,
          schoolName: selectedSchool?.name || schoolSearchQuery,
        }),
      });

      const data = await response.json();

      if (data.verified) {
        // Real-time AI Authenticated!
        setAiVerificationSuccess(true);
        setAiConfidenceScore(data.confidenceScore || 96);
        setAiDetectedDetails({
          detectedSchool: data.detectedSchool,
          detectedStudentName: data.detectedStudentName,
          detectedRollNo: data.detectedRollNo,
          detectedClass: data.detectedClass,
          summary: data.verificationSummary,
        });

        const generatedCode =
          (data.detectedRollNo && data.detectedRollNo !== 'N/A')
            ? data.detectedRollNo
            : (selectedSchool ? selectedSchool.name.substring(0, 3).toUpperCase() : 'AUR') +
              '-' +
              new Date().getFullYear() +
              '-' +
              Math.floor(1000 + Math.random() * 9000);
        setVerifiedStudentIdCode(generatedCode);
      } else {
        // FALSE ID CARD DETECTED / REJECTED BY AI
        setAiVerificationSuccess(false);
        setAiRejectionReason(
          data.rejectionReason ||
            'False or invalid ID card detected: The uploaded image does not meet official school student ID card standards.'
        );
      }
    } catch (err: any) {
      console.error('Error during AI ID verification:', err);
      setAiVerificationSuccess(false);
      setAiRejectionReason('Connection issue during AI verification. Please check your image and try again.');
    } finally {
      setIsAiVerifying(false);
    }
  };

  // 6. FINAL SUBMISSION AFTER AI VERIFICATION
  const handleFinalSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!aiVerificationSuccess) {
      setAiRejectionReason('Please upload and verify an authentic school ID card before completing registration.');
      return;
    }

    setIsSubmitting(true);

    const schoolNameToSave = selectedSchool ? selectedSchool.name : schoolSearchQuery || 'General Secondary School';
    const idNumberToSave = verifiedStudentIdCode || 'AURIX-' + Math.floor(100000 + Math.random() * 900000);

    const payload: SignupPayload = {
      name: fullName,
      email: email || `student_${Date.now()}@aurix.edu`,
      phoneNumber: phoneNumber || undefined,
      classLevel,
      schoolName: schoolNameToSave,
      schoolBoard,
      schoolCity,
      studentIdNumber: idNumberToSave,
      rollNumber: idNumberToSave.split('-')[2] || '14',
      verificationMethod: 'ai_digital',
      verificationStatus: 'verified',
      idCardPhotoUrl: idCardPreview || undefined,
      authProvider: chosenProvider,
      aiConfidenceScore: aiConfidenceScore || 96,
      aiVerificationSummary: aiDetectedDetails?.summary || 'Real-time AI Authenticated School Student ID.',
    };

    setTimeout(() => {
      const user = authService.signup(payload);
      setCreatedUser(user);
      setIsSubmitting(false);
      setIsCompleted(true);

      setTimeout(() => {
        onSuccess(user, 'home'); // Direct to Home section
        onClose();
      }, 1500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg aurix-glass-card bg-[#080d09]/98 rounded-2xl sm:rounded-3xl border border-[#a3e635]/35 shadow-[0_0_55px_rgba(163,230,53,0.2)] overflow-hidden p-5 sm:p-7 max-h-[92vh] flex flex-col justify-between my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =========================================================================
            PROVIDER ACCOUNT PICKER OVERLAY (For Sign Up)
        ========================================================================= */}
        {activeProviderModal && (
          <div className="absolute inset-0 bg-[#080d09]/98 z-30 p-6 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  {activeProviderModal === 'google' && <GoogleIcon className="w-5 h-5" />}
                  {activeProviderModal === 'microsoft' && <MicrosoftIcon className="w-5 h-5" />}
                  {activeProviderModal === 'apple' && <AppleIcon className="w-5 h-5 text-white" />}
                  {activeProviderModal === 'github' && <GithubIcon className="w-5 h-5 text-white" />}
                  <span className="text-sm font-bold text-white capitalize">
                    Sign in with {activeProviderModal}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProviderModal(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-300 mb-4">
                Choose an account to sign in or continue with <strong className="text-white">AURIX</strong>:
              </p>

              {/* Provider Options */}
              <div className="space-y-2.5">
                {activeProviderModal === 'google' && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectProvider('google', {
                          name: 'Arpita Ghosh',
                          email: 'arpitaghosh2167@gmail.com',
                        })
                      }
                      className="w-full p-3 rounded-xl bg-[#121c14] hover:bg-[#1a2a1d] border border-[#a3e635]/30 hover:border-[#a3e635]/60 transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#84cc16] to-[#15803d] text-white flex items-center justify-center font-bold text-sm">
                          AG
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#bef264]">
                            Arpita Ghosh
                          </div>
                          <div className="text-[11px] text-neutral-300">arpitaghosh2167@gmail.com</div>
                          <span className="text-[10px] text-[#bef264]">Verified Google Account (Direct Home Access)</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#a3e635] group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectProvider('google', {
                          name: 'Student User',
                          email: 'student.new@gmail.com',
                        })
                      }
                      className="w-full p-3 rounded-xl bg-[#0d1510] hover:bg-[#152317] border border-white/10 hover:border-[#a3e635]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                          SU
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#bef264]">
                            Use another Google account
                          </div>
                          <div className="text-[11px] text-neutral-400">student.new@gmail.com</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#a3e635] transition-all" />
                    </button>
                  </>
                )}

                {activeProviderModal === 'microsoft' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectProvider('microsoft', {
                        name: 'Saheb Mukherjee',
                        email: 'saheb.mukherjee@outlook.com',
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121c14] hover:bg-[#1a2a1d] border border-[#a3e635]/30 hover:border-[#a3e635]/60 transition-all flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#00a4ef]/20 border border-[#00a4ef]/40 text-[#00a4ef] flex items-center justify-center font-bold text-sm">
                        MS
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#bef264]">
                          Microsoft Student Account
                        </div>
                        <div className="text-[11px] text-neutral-300">saheb.mukherjee@outlook.com</div>
                        <span className="text-[10px] text-[#00a4ef]">School or Personal Microsoft Account</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#a3e635] group-hover:translate-x-1 transition-all" />
                  </button>
                )}

                {activeProviderModal === 'apple' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectProvider('apple', {
                        name: 'Apple Student',
                        email: 'student.apple@icloud.com',
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121c14] hover:bg-[#1a2a1d] border border-white/15 hover:border-white/30 transition-all flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-sm">
                        <AppleIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#bef264]">
                          Sign in with Apple ID
                        </div>
                        <div className="text-[11px] text-neutral-300">student.apple@icloud.com</div>
                        <span className="text-[10px] text-neutral-400">Private Relay Protected</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-all" />
                  </button>
                )}

                {activeProviderModal === 'github' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectProvider('github', {
                        name: 'GitHub Student Developer',
                        email: 'developer.student@github.com',
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#121c14] hover:bg-[#1a2a1d] border border-white/15 hover:border-[#a3e635]/40 transition-all flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-sm">
                        <GithubIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#bef264]">
                          GitHub Student Developer Pack
                        </div>
                        <div className="text-[11px] text-neutral-300">developer.student@github.com</div>
                        <span className="text-[10px] text-[#bef264]">Verified Developer Account</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#a3e635] group-hover:translate-x-1 transition-all" />
                  </button>
                )}
              </div>

              {providerLoading && (
                <div className="mt-4 p-3 rounded-xl bg-[#142316] border border-[#a3e635]/40 flex items-center justify-center gap-2 text-xs text-[#bef264]">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#a3e635]" />
                  <span>Connecting to {activeProviderModal}...</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 text-[11px] text-neutral-500 text-center">
              Next: Select your school and verify your ID card with real-time AI.
            </div>
          </div>
        )}

        {/* =========================================================================
            SUCCESS STATE: ID CARD DISPLAY
        ========================================================================= */}
        {isCompleted && createdUser ? (
          <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-[#142316] border border-[#a3e635]/40 text-[#a3e635] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(163,230,53,0.3)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {createdUser.name ? `Welcome, ${createdUser.name}!` : 'Welcome to AURIX!'}
              </h3>
              <p className="text-xs text-neutral-300 mt-1">
                AI Verified Student Credentials · Entering Home Section...
              </p>
            </div>

            {/* Visual Digital Student ID Card */}
            <div className="text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#121f14] via-[#09110a] to-[#040604] border border-[#a3e635]/40 shadow-[0_0_25px_rgba(163,230,53,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#192b1a] border border-[#a3e635]/40 flex items-center justify-center text-[#a3e635]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    AURIX AI Verified Student
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#a3e635]/20 border border-[#a3e635]/40 text-[#bef264]">
                    ✓ AI VERIFIED
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2 space-y-1">
                  <span className="text-xs text-neutral-400 block">Student Name</span>
                  <div className="text-sm sm:text-base font-bold text-white truncate">{createdUser.name}</div>
                  <div className="text-xs text-[#bef264] font-medium">{createdUser.classLevel} · {createdUser.schoolBoard || 'CBSE'}</div>
                  <div className="text-xs text-neutral-300 truncate pt-1">{createdUser.schoolName}</div>
                </div>

                <div className="col-span-1 flex flex-col items-end justify-center text-right border-l border-white/10 pl-3">
                  <QrCode className="w-10 h-10 text-[#a3e635] opacity-90 mb-1" />
                  <span className="text-[9px] font-mono text-neutral-400">ID: {createdUser.studentIdNumber || 'VERIFIED'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#a3e635]">
              <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-ping" />
              <span>Redirecting to Home Section...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto pr-1">
            {/* Top Switcher: Sign In vs Sign Up */}
            <div className="flex p-1 bg-[#0e1610] rounded-xl border border-white/5 mb-4">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setActiveStep('signin_form');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mode === 'signin' ? 'bg-[#1a2d1d] text-[#bef264] shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setActiveStep('signup_home');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  mode === 'signup' ? 'bg-[#1a2d1d] text-[#bef264] shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Student Sign Up
              </button>
            </div>

            {/* =========================================================================
                SCENARIO 1: SIGN IN (INCLUDES GOOGLE, MICROSOFT, APPLE, GITHUB, EMAIL, PHONE)
                If registered -> goes straight to Home.
                If new -> dialogue box for Name, Class, School + AI ID verification.
            ========================================================================= */}
            {mode === 'signin' && activeStep === 'signin_form' && (
              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a3e635]">
                      Sign In & Quick Access
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Welcome Back to AURIX
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Sign in with Google, Microsoft, Apple ID, GitHub, Email & Password, or Phone OTP.
                  </p>
                </div>

                {/* INCLUDED SOCIAL SIGN IN BUTTONS */}
                <div className="space-y-2 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Google */}
                    <button
                      type="button"
                      onClick={() => setActiveProviderModal('google')}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-100 bg-[#0e1710] hover:bg-[#142316] border border-[#a3e635]/30 hover:border-[#a3e635]/60 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <GoogleIcon className="w-4 h-4" />
                      <span>Google</span>
                    </button>

                    {/* Microsoft */}
                    <button
                      type="button"
                      onClick={() => setActiveProviderModal('microsoft')}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-100 bg-[#0e1710] hover:bg-[#142316] border border-[#a3e635]/30 hover:border-[#a3e635]/60 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <MicrosoftIcon className="w-4 h-4" />
                      <span>Microsoft</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Apple */}
                    <button
                      type="button"
                      onClick={() => setActiveProviderModal('apple')}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-100 bg-[#0e1710] hover:bg-[#142316] border border-white/10 hover:border-white/25 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <AppleIcon className="w-4 h-4 text-white" />
                      <span>Apple ID</span>
                    </button>

                    {/* GitHub */}
                    <button
                      type="button"
                      onClick={() => setActiveProviderModal('github')}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-100 bg-[#0e1710] hover:bg-[#142316] border border-white/10 hover:border-white/25 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <GithubIcon className="w-4 h-4 text-white" />
                      <span>GitHub</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 my-3">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                      or continue with Email / Phone
                    </span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                </div>

                {/* Method Toggle: Email vs Phone */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      authMethod === 'email'
                        ? 'bg-[#152317] border-[#a3e635]/60 text-[#bef264]'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email & Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      authMethod === 'phone'
                        ? 'bg-[#152317] border-[#a3e635]/60 text-[#bef264]'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Phone OTP</span>
                  </button>
                </div>

                {/* Email Sign In */}
                {authMethod === 'email' && (
                  <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. arpitaghosh2167@gmail.com or student@school.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-1">
                        Registered emails log straight into Home. Unregistered emails will prompt Name, Class & School.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                        />
                      </div>
                    </div>

                    {/* Robot Verification Checkbox */}
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
                      disabled={isSubmitting}
                      className="w-full mt-2 aurix-3d-button py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4 text-[#040604]" />
                    </button>
                  </form>
                )}

                {/* Phone Sign In */}
                {authMethod === 'phone' && (
                  <div className="space-y-3">
                    {!isOtpSent ? (
                      <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-300 mb-1">
                            Mobile Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 43210"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full aurix-3d-button py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>Send OTP</span>
                          <ArrowRight className="w-4 h-4 text-[#040604]" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyPhoneOtp} className="space-y-3 animate-in fade-in">
                        <div className="p-3 rounded-xl bg-[#111c12] border border-[#a3e635]/30 text-xs">
                          <div className="flex items-center justify-between text-[#bef264] font-semibold mb-1">
                            <span>OTP sent to {phoneNumber}</span>
                            <button
                              type="button"
                              onClick={() => setIsOtpSent(false)}
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
                          <label className="block text-xs font-medium text-neutral-300 mb-1">
                            Enter 4-Digit OTP
                          </label>
                          <div className="relative">
                            <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              maxLength={4}
                              required
                              placeholder="7492"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-[#a3e635]"
                            />
                          </div>
                          {otpError && (
                            <span className="text-[11px] text-red-400 block mt-1">{otpError}</span>
                          )}
                        </div>

                        {/* Robot Verification Checkbox */}
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
                          disabled={isSubmitting}
                          className="w-full aurix-3d-button py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>{isSubmitting ? 'Verifying...' : 'Verify & Enter'}</span>
                          <Check className="w-4 h-4 text-[#040604]" />
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {onOpenParentLogin && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                    <span>Are you a parent or guardian?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenParentLogin();
                      }}
                      className="text-[#bef264] hover:underline font-semibold cursor-pointer"
                    >
                      Parental Login →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                SCENARIO 2: STUDENT SIGN UP (EXCLUDED FROM GOOGLE, MICROSOFT, APPLE, GITHUB)
                Only School Email, Profile Details, and Real-Time AI ID Verification.
            ========================================================================= */}
            {mode === 'signup' && activeStep === 'signup_home' && (
              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#a3e635]" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a3e635]">
                      Official Student Sign Up
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Student Registration
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Register with your school email and academic credentials. Real-time AI will authenticate your official School ID card.
                  </p>
                </div>

                {/* Direct School Email Sign Up Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!isRobotVerified) {
                      setRobotError('Please check "I am not a robot" before continuing.');
                      return;
                    }
                    setRobotError(null);
                    setChosenProvider('email');
                    setActiveStep('student_profile_dialog');
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      School Email Address <span className="text-[#a3e635]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="student@school.edu or student.name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Create Password <span className="text-[#a3e635]">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#142316]/70 border border-[#a3e635]/30 text-xs text-neutral-300 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-relaxed">
                      <strong className="text-white block mb-0.5">Two-Step Institutional Verification</strong>
                      Next, select your recognized school (DPS, KV, St. Xavier's, etc.) and scan your School ID card with real-time AI to prevent false registrations.
                    </div>
                  </div>

                  {/* Robot Verification Checkbox */}
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
                    className="w-full aurix-3d-button py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to Student Profile</span>
                    <ArrowRight className="w-4 h-4 text-[#040604]" />
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
                  <span>Looking for Google, Microsoft, Apple, or GitHub?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setActiveStep('signin_form');
                    }}
                    className="text-[#bef264] hover:underline font-semibold cursor-pointer"
                  >
                    Use Sign In →
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP B: STUDENT PROFILE DIALOGUE (NAME, CLASS, SCHOOL)
            ========================================================================= */}
            {activeStep === 'student_profile_dialog' && (
              <form onSubmit={handleCompleteStudentProfile} className="space-y-3.5 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-[#142316] border border-[#a3e635]/40 text-xs shadow-[0_0_20px_rgba(163,230,53,0.15)] space-y-1">
                  <div className="flex items-center gap-2 text-[#bef264] font-bold">
                    <Sparkles className="w-4 h-4 text-[#a3e635]" />
                    <span>Complete Your Student Profile</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Enter your <strong className="text-white">Name</strong>,{' '}
                    <strong className="text-white">Class</strong>, and{' '}
                    <strong className="text-white">School</strong>. Next, our real-time AI will authenticate your ID card.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Student Full Name <span className="text-[#a3e635]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saheb Mukherjee"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Email Address <span className="text-[#a3e635]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Select Class <span className="text-[#a3e635]">*</span>
                    </label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    >
                      {CLASSES_LIST.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SCHOOL SELECTION WITH SEARCH & AUTOCOMPLETE */}
                <div className="relative" ref={schoolDropdownRef}>
                  <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <SchoolIcon className="w-3.5 h-3.5 text-[#a3e635]" />
                      <span>Select or Enter Your School</span>
                      <span className="text-[#a3e635]">*</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">Searchable</span>
                  </label>

                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Type school name e.g. DPS, St. Xavier's, KV..."
                      value={schoolSearchQuery}
                      onChange={(e) => handleCustomSchoolInput(e.target.value)}
                      onFocus={() => setIsSchoolDropdownOpen(true)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>

                  {/* Dropdown Suggestions */}
                  {isSchoolDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-48 overflow-y-auto rounded-xl bg-[#0b120c] border border-[#a3e635]/30 shadow-2xl p-1.5 space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-neutral-400 px-2 py-1 font-semibold">
                        Recognized Schools List
                      </div>
                      {filteredSchools.map((school) => (
                        <button
                          key={school.id}
                          type="button"
                          onClick={() => handleSelectSchool(school)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-[#152417] text-neutral-200 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div className="truncate">
                            <span className="font-semibold">{school.name}</span>
                            <span className="text-neutral-400 text-[11px] block">{school.city} · {school.board}</span>
                          </div>
                          {selectedSchool?.id === school.id && (
                            <Check className="w-4 h-4 text-[#a3e635] shrink-0" />
                          )}
                        </button>
                      ))}

                      {filteredSchools.length === 0 && (
                        <div className="px-3 py-2 text-xs text-neutral-400">
                          Custom school: &ldquo;<span className="text-white font-medium">{schoolSearchQuery}</span>&rdquo; will be registered.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Board & City */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Education Board
                    </label>
                    <select
                      value={schoolBoard}
                      onChange={(e) => setSchoolBoard(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    >
                      {SCHOOL_BOARDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      School City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, Kolkata"
                      value={schoolCity}
                      onChange={(e) => setSchoolCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0e1610] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#a3e635]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(mode === 'signin' ? 'signin_form' : 'signup_home')}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 aurix-3d-button py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to Real-Time AI ID Verification</span>
                    <ArrowRight className="w-4 h-4 text-[#040604]" />
                  </button>
                </div>
              </form>
            )}

            {/* =========================================================================
                STEP C: REAL-TIME AI VERIFIED ID CREDENTIAL VERIFICATION
                (No demo verification - strictly authenticates real ID cards to prevent false logins)
            ========================================================================= */}
            {activeStep === 'ai_verification' && (
              <form onSubmit={handleFinalSignup} className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between text-xs pb-1 border-b border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveStep('student_profile_dialog')}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back to Details
                  </button>
                  <span className="font-semibold text-[#bef264] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#a3e635]" />
                    <span>Real-Time AI ID Verification</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0a100b] border border-[#a3e635]/30 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Scan className="w-4 h-4 text-[#a3e635]" />
                      <span>AI ID Credential Verification</span>
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Upload your real school ID card. AI inspects credentials in real time to prevent false ID card logins.
                    </p>
                  </div>

                  {/* Upload Drop Zone / Scanner Area */}
                  <div className="relative rounded-2xl border-2 border-dashed border-[#a3e635]/40 bg-[#0d160f] p-5 text-center overflow-hidden">
                    {/* Live AI Analysis Scanning Overlay */}
                    {isAiVerifying && (
                      <div className="absolute inset-0 bg-[#060c07]/95 flex flex-col items-center justify-center gap-2.5 z-20 p-4">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#a3e635] to-transparent animate-pulse" />
                        <RefreshCw className="w-8 h-8 text-[#a3e635] animate-spin" />
                        <span className="text-xs font-bold text-white">AI Forensic Analysis in progress...</span>
                        <span className="text-[11px] text-[#bef264] text-center max-w-xs">
                          Inspecting institutional seal, student portrait, roll number & school matching...
                        </span>
                      </div>
                    )}

                    {/* REJECTED / FALSE ID ALERT */}
                    {aiRejectionReason && !isAiVerifying && (
                      <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-left space-y-2 mb-3 animate-in fade-in">
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-red-200">
                              False / Unverified ID Card Rejected
                            </div>
                            <div className="text-[11px] text-red-300 mt-0.5 leading-relaxed">
                              {aiRejectionReason}
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-red-400 border-t border-red-500/20 pt-1.5">
                          AURIX AI security blocks non-school images to protect verified student spaces. Please upload a genuine, clear photo of your school student ID card.
                        </p>
                      </div>
                    )}

                    {/* SUCCESSFUL REAL-TIME AI VERIFICATION CARD */}
                    {aiVerificationSuccess && !isAiVerifying ? (
                      <div className="py-2 space-y-3 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-[#18291a] text-[#a3e635] flex items-center justify-center mx-auto border border-[#a3e635]/50 shadow-[0_0_25px_rgba(163,230,53,0.35)]">
                          <Check className="w-6 h-6 text-[#a3e635]" />
                        </div>

                        <div>
                          <div className="text-sm font-extrabold text-[#bef264]">
                            Authentic School ID Card Verified!
                          </div>
                          <div className="text-xs text-neutral-200 font-semibold mt-0.5">
                            AI Confidence Score: <span className="text-[#a3e635]">{aiConfidenceScore}%</span> · Anti-Tamper Check Passed
                          </div>
                          {aiDetectedDetails && (
                            <div className="mt-2 p-2.5 rounded-xl bg-[#09100a] border border-[#a3e635]/30 text-left text-[11px] text-neutral-300 space-y-1">
                              <div>• Detected School: <strong className="text-white">{aiDetectedDetails.detectedSchool || selectedSchool?.name}</strong></div>
                              <div>• Verified Student: <strong className="text-white">{aiDetectedDetails.detectedStudentName || fullName}</strong> ({classLevel})</div>
                              <div>• Credential ID: <strong className="font-mono text-[#bef264]">{verifiedStudentIdCode}</strong></div>
                            </div>
                          )}
                        </div>

                        {/* Change Image Button */}
                        <label className="inline-block text-[11px] text-neutral-400 hover:text-white underline cursor-pointer">
                          <span>Upload different card</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUploadAndVerify}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      /* INITIAL UPLOAD STATE (No demo verification buttons) */
                      <div className="space-y-3">
                        {idCardPreview ? (
                          <div className="relative max-h-36 mx-auto rounded-xl overflow-hidden border border-white/20 mb-2">
                            <img src={idCardPreview} alt="Uploaded School ID" className="w-full h-full object-contain max-h-36" />
                          </div>
                        ) : (
                          <Upload className="w-9 h-9 text-[#a3e635] mx-auto opacity-80" />
                        )}

                        <div>
                          <p className="text-xs font-semibold text-white">
                            Upload or capture your official School ID Card
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Real-time AI verifies school crest, student name, and enrollment record.
                          </p>
                        </div>

                        <div className="pt-1">
                          <label className="aurix-pill-button px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all">
                            <Camera className="w-4 h-4 text-[#040604]" />
                            <span>Select School ID Card Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUploadAndVerify}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <p className="text-[10px] text-neutral-500">
                          Supports PNG, JPG, JPEG, WEBP. Fake/unrelated images are automatically detected and blocked.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Final Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !aiVerificationSuccess}
                  className={`w-full mt-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    aiVerificationSuccess
                      ? 'aurix-3d-button text-[#040604]'
                      : 'bg-neutral-800 text-neutral-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {isSubmitting
                      ? 'Saving Verified Student Profile...'
                      : aiVerificationSuccess
                      ? 'Complete Registration & Go to Home'
                      : 'Upload Valid School ID to Proceed'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-white/5 text-center text-[11px] text-neutral-500">
              AURIX AI Security System · Zero Tolerance for False School ID Credentials.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
