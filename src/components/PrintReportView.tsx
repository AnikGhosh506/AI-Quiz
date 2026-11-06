import React from 'react';
import { StudentUser } from '../services/authService';
import { STUDY_MATERIALS } from '../data/studyMaterialsData';
import { ShieldCheck, Printer, ArrowLeft, Trophy, BookOpen, CheckCircle, School, Award, Sparkles } from 'lucide-react';

interface PrintReportViewProps {
  currentUser: StudentUser | null;
  onBack?: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ currentUser, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const student = currentUser || {
    name: 'Arpita Ghosh',
    email: 'arpitaghosh2167@gmail.com',
    classLevel: 'Class 10',
    joinedDate: 'Nov 2026',
    schoolName: 'Delhi Public School (DPS RK Puram)',
    schoolBoard: 'CBSE',
    schoolCity: 'New Delhi',
    studentIdNumber: 'AURIX-2026-9284',
    rollNumber: '18',
    verificationMethod: 'ai_digital',
    verificationStatus: 'verified',
    verifiedAt: 'Nov 5, 2026',
  };

  // Sample study materials summary for print
  const featuredNotes = STUDY_MATERIALS.slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0e1610] hover:bg-[#142316] border border-white/15 hover:border-[#a3e635]/50 text-xs font-semibold text-neutral-300 hover:text-[#bef264] transition-all cursor-pointer group shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#a3e635] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Previous Page</span>
          </button>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="aurix-3d-button px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#040604] flex items-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#040604]" />
            <span>Print Academic Dossier (Save as PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Wrapper */}
      <div className="bg-[#0a120b] print:bg-white print:text-black border border-[#a3e635]/30 print:border-black rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl text-left">
        {/* Document Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/15 print:border-black">
          <div>
            <div className="text-xl font-extrabold text-white print:text-black flex items-center gap-2">
              <span>AURIX ACADEMIC DOSSIER &amp; REVISION GUIDE</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#142316] text-[#bef264] border border-[#a3e635]/40 print:bg-gray-100 print:text-black print:border-black">
                Session 2026–27
              </span>
            </div>
            <p className="text-xs text-neutral-300 print:text-gray-700 mt-1">
              Official Academic Transcript, Student ID Authentication, Leaderboard Standing, and High-Yield Study Formulas.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#a3e635] print:text-black font-bold block">
              DOC-ID: AURIX-{Math.floor(100000 + Math.random() * 900000)}
            </span>
            <span className="text-[10px] text-neutral-400 print:text-gray-600 block">
              Generated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* SECTION 1: VERIFIED STUDENT ID CARD */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#bef264] print:text-black flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#a3e635] print:text-black" />
            <span>Section 1: Verified Student Credentials &amp; ID Card</span>
          </h2>

          <div className="p-5 rounded-2xl bg-[#0e1810] print:bg-gray-50 border border-[#a3e635]/40 print:border-gray-400 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase block">Student Full Name</span>
                <span className="text-lg font-extrabold text-white print:text-black">{student.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase block">Academic Class</span>
                  <span className="font-bold text-[#bef264] print:text-black">{student.classLevel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase block">Roll Number</span>
                  <span className="font-bold text-white print:text-black">{student.rollNumber || '18'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/10 print:border-gray-300 md:pl-4">
              <div>
                <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase block">School Name &amp; Board</span>
                <span className="text-xs font-bold text-white print:text-black">
                  {student.schoolName || 'Delhi Public School'} ({student.schoolBoard || 'CBSE'})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase block">Student ID Number</span>
                  <span className="font-mono text-xs font-bold text-[#a3e635] print:text-black">{student.studentIdNumber || 'AURIX-2026-9284'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 print:text-gray-500 uppercase block">AI Verification Status</span>
                  <span className="text-[11px] font-bold text-emerald-400 print:text-black">✓ OFFICIAL VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC PERFORMANCE & GLOBAL LEADERBOARD */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#bef264] print:text-black flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#a3e635] print:text-black" />
            <span>Section 2: Academic Progress &amp; Global Leaderboard Standing</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-[#0e1810] print:bg-gray-50 border border-white/10 print:border-gray-300">
              <span className="text-[10px] text-neutral-400 print:text-gray-600 block">Tests Completed</span>
              <span className="text-xl font-extrabold text-white print:text-black">14</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0e1810] print:bg-gray-50 border border-[#a3e635]/30 print:border-gray-300">
              <span className="text-[10px] text-neutral-400 print:text-gray-600 block">Average Score</span>
              <span className="text-xl font-extrabold text-[#bef264] print:text-black">88%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0e1810] print:bg-gray-50 border border-white/10 print:border-gray-300">
              <span className="text-[10px] text-neutral-400 print:text-gray-600 block">National Percentile</span>
              <span className="text-xl font-extrabold text-white print:text-black">96.8%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0e1810] print:bg-gray-50 border border-amber-500/30 print:border-gray-300">
              <span className="text-[10px] text-neutral-400 print:text-gray-600 block">Daily Flame Streak</span>
              <span className="text-xl font-extrabold text-amber-400 print:text-black">7 Days 🔥</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1810] print:bg-gray-50 border border-white/10 print:border-gray-300 space-y-2 text-xs">
            <div className="font-bold text-white print:text-black uppercase text-[11px] tracking-wider">
              Top 5 National Student Leaderboard Placement:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[#142316] print:bg-gray-100 flex justify-between">
                <span>1. Arpita Ghosh (Delhi Public School)</span>
                <strong className="text-[#a3e635] print:text-black">1,840 pts (#1)</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#080d09] print:bg-gray-100 flex justify-between text-neutral-300 print:text-black">
                <span>2. Saheb Mukherjee (St. Xavier's Kolkata)</span>
                <strong>1,720 pts (#2)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: STUDY MATERIALS & HIGH-YIELD FORMULAS */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#bef264] print:text-black flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#a3e635] print:text-black" />
            <span>Section 3: Key Study Notes &amp; High-Yield Formulas</span>
          </h2>

          <div className="space-y-3">
            {featuredNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-2xl bg-[#0e1810] print:bg-gray-50 border border-white/10 print:border-gray-300 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 print:border-gray-300 pb-1.5">
                  <span className="font-extrabold text-white print:text-black text-sm">
                    {note.title} ({note.classLevel} · {note.subject})
                  </span>
                  <span className="text-[10px] text-[#a3e635] print:text-black font-semibold">
                    Chapter: {note.chapter}
                  </span>
                </div>
                <p className="text-neutral-300 print:text-gray-800 leading-relaxed">
                  {note.summary}
                </p>

                {note.formulas && note.formulas.length > 0 && (
                  <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {note.formulas.map((f, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#080d09] print:bg-gray-100 border border-[#a3e635]/30 print:border-gray-300">
                        <span className="font-bold text-white print:text-black block text-[11px]">{f.name}</span>
                        <code className="text-[#bef264] print:text-black font-mono font-bold block">{f.formula}</code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Document Footer */}
        <div className="pt-4 border-t border-white/15 print:border-black text-center text-[10px] text-neutral-400 print:text-gray-600 space-y-1">
          <p>AURIX Educational Platform · Verified Academic Dossier · Generated for {student.name}</p>
          <p>© 2026 AURIX -by Saheb Mukherjee · All Academic Records Certified</p>
        </div>
      </div>
    </div>
  );
};
