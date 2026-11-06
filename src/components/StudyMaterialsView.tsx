import React, { useState } from 'react';
import { BookOpen, FileText, Check, Download, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { CLASSES_LIST } from '../data/quizData';

export const StudyMaterialsView: React.FC<{ onAskAI: (topic: string) => void }> = ({ onAskAI }) => {
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const materials = [
    {
      id: 'm1',
      classLevel: 'Class 10',
      subject: 'Mathematics',
      title: 'Complete Formulas: Quadratic Equations & AP',
      summary: 'Discriminant D = b² - 4ac, nature of roots, sum of roots (-b/a), product of roots (c/a), nth term of AP a_n = a + (n-1)d, and sum of AP S_n = n/2 [2a + (n-1)d].',
      formulas: ['D = b² - 4ac', 'a_n = a + (n - 1)d', 'S_n = (n/2)[2a + (n - 1)d]'],
    },
    {
      id: 'm2',
      classLevel: 'Class 10',
      subject: 'Science (Physics)',
      title: 'Light: Reflection & Refraction Cheat Sheet',
      summary: 'Mirror formula 1/f = 1/v + 1/u, magnification m = -v/u = h_i/h_o, lens formula 1/f = 1/v - 1/u, lens magnification m = v/u, power of lens P = 1/f (in meters).',
      formulas: ['1/f = 1/v + 1/u (Mirror)', '1/f = 1/v - 1/u (Lens)', 'P = 1/f (Dioptres)'],
    },
    {
      id: 'm3',
      classLevel: 'Class 9',
      subject: 'Science (Physics)',
      title: 'Laws of Motion & Gravitation Key Points',
      summary: 'Newton’s three laws of motion, inertia, momentum p = mv, force F = ma, universal law of gravitation F = G(m1·m2)/r², and acceleration due to gravity g = GM/R² ≈ 9.8 m/s².',
      formulas: ['F = ma', 'p = mv', 'g = GM / R²'],
    },
    {
      id: 'm4',
      classLevel: 'Class 8',
      subject: 'Mathematics',
      title: 'Algebraic Identities & Linear Equations Guide',
      summary: 'Standard identities: (a+b)² = a² + 2ab + b², (a-b)² = a² - 2ab + b², (a+b)(a-b) = a² - b², (x+a)(x+b) = x² + (a+b)x + ab.',
      formulas: ['(a + b)² = a² + 2ab + b²', '(a - b)² = a² - 2ab + b²', 'a² - b² = (a - b)(a + b)'],
    },
    {
      id: 'm5',
      classLevel: 'Class 12',
      subject: 'Physics',
      title: 'Current Electricity & Kirchhoff’s Laws',
      summary: 'Ohm’s Law V = IR, drift velocity v_d = eEτ/m, resistance R = ρL/A, Kirchhoff’s Junction Rule (charge conservation), and Loop Rule (energy conservation).',
      formulas: ['V = IR', 'R = ρ(L / A)', 'Σ I_in = Σ I_out'],
    },
    {
      id: 'm6',
      classLevel: 'Class 11',
      subject: 'Chemistry',
      title: 'Structure of Atom & Chemical Bonding',
      summary: 'Bohr model radius and energy formulas, de Broglie relation λ = h/mv, Heisenberg uncertainty principle, quantum numbers, and octet rule with Lewis dot structures.',
      formulas: ['λ = h / (mv)', 'Δx · Δp ≥ h / (4π)', 'E_n = -13.6 eV / n²'],
    },
  ];

  const filtered = materials.filter(
    (m) => m.classLevel === selectedClass || selectedClass === 'All'
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/30 text-xs text-[#bef264] font-medium mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#a3e635]" />
          <span>Study Materials · Quick Revision Sheets</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Explore Study Materials
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300">
          Curated chapter summaries and formula sheets for Classes 6 to 12.
        </p>
      </div>

      {/* Class filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CLASSES_LIST.map((cls) => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedClass === cls
                ? 'bg-[#18281a] border border-[#a3e635] text-[#bef264] shadow-[0_0_15px_rgba(163,230,53,0.25)]'
                : 'bg-[#0a100b] border border-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="aurix-glass-card rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#a3e635]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span className="font-semibold text-[#a3e635]">{item.classLevel}</span>
                  <span className="bg-white/5 px-2.5 py-0.5 rounded text-neutral-300">
                    {item.subject}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Formula pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.formulas.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2.5 py-1 rounded-lg bg-[#0e1710] border border-[#a3e635]/25 text-xs font-mono text-[#bef264]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(item.id, `${item.title}\n${item.summary}\n${item.formulas.join(', ')}`)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-neutral-200 transition-colors flex items-center gap-1.5"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Copy Formulas</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onAskAI(item.title)}
                  className="text-xs font-semibold text-[#bef264] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Ask AI to explain</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center rounded-2xl bg-[#090e0a] border border-white/5 text-neutral-400 text-xs sm:text-sm">
            More chapter notes for {selectedClass} are being prepared. You can ask our AI tutor about any topic right now!
          </div>
        )}
      </div>
    </div>
  );
};
