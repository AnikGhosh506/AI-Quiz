import React from 'react';
import { Target, AlertCircle, CheckCircle2, Sparkles, Brain, BookOpen } from 'lucide-react';
import { QuizResult } from '../data/quizData';

interface SubjectRadarChartProps {
  quizResults: QuizResult[];
}

interface SubjectScore {
  subject: string;
  score: number;
  testsCount: number;
  status: 'strong' | 'moderate' | 'gap';
}

export const SubjectRadarChart: React.FC<SubjectRadarChartProps> = ({ quizResults }) => {
  const SUBJECTS = [
    { name: 'Mathematics', defaultScore: 90 },
    { name: 'Physics', defaultScore: 78 },
    { name: 'Chemistry', defaultScore: 84 },
    { name: 'Biology', defaultScore: 88 },
    { name: 'English & Logic', defaultScore: 92 },
  ];

  // Calculate real subject scores from quiz results
  const subjectScores: SubjectScore[] = SUBJECTS.map((sub) => {
    const matching = quizResults.filter(
      (r) =>
        r.subject.toLowerCase().includes(sub.name.toLowerCase()) ||
        (sub.name === 'Mathematics' && r.subject.toLowerCase().includes('math')) ||
        (sub.name === 'English & Logic' && (r.subject.toLowerCase().includes('english') || r.subject.toLowerCase().includes('mixed')))
    );

    if (matching.length > 0) {
      const avg = Math.round(matching.reduce((acc, curr) => acc + curr.score, 0) / matching.length);
      return {
        subject: sub.name,
        score: avg,
        testsCount: matching.length,
        status: avg >= 85 ? 'strong' : avg >= 70 ? 'moderate' : 'gap',
      };
    }

    return {
      subject: sub.name,
      score: sub.defaultScore,
      testsCount: 0,
      status: sub.defaultScore >= 85 ? 'strong' : sub.defaultScore >= 70 ? 'moderate' : 'gap',
    };
  });

  // SVG Radar geometry math
  const size = 300;
  const center = size / 2;
  const radius = 110;
  const numAxes = subjectScores.length;

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for subject scores
  const scorePoints = subjectScores
    .map((s, idx) => {
      const { x, y } = getCoordinates(idx, s.score / 100);
      return `${x},${y}`;
    })
    .join(' ');

  // Concentric rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const gapSubjects = subjectScores.filter((s) => s.status === 'gap' || s.score < 80);
  const strongestSubject = [...subjectScores].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="w-full my-8 p-6 sm:p-8 rounded-3xl aurix-3d-card border border-[#a3e635]/30 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full aurix-3d-glass-btn text-xs text-[#bef264] font-semibold mb-1">
            <Target className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>AI Diagnostic Visualization</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight aurix-3d-heading">
            Knowledge Gap Analysis (Radar Chart)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300">
            Graphical radar map identifying academic strengths and areas needing focus across subjects.
          </p>
        </div>

        {strongestSubject && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#bef264] px-3 py-1.5 rounded-xl bg-[#142618] border border-[#a3e635]/40 shadow-sm">
              Strongest: {strongestSubject.subject} ({strongestSubject.score}%)
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Radar SVG Chart */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            {/* Grid Rings */}
            {rings.map((ringVal, rIdx) => {
              const ringPoints = subjectScores
                .map((_, idx) => {
                  const { x, y } = getCoordinates(idx, ringVal);
                  return `${x},${y}`;
                })
                .join(' ');

              return (
                <polygon
                  key={rIdx}
                  points={ringPoints}
                  fill="none"
                  stroke="rgba(163, 230, 53, 0.15)"
                  strokeWidth="1"
                  strokeDasharray={ringVal === 1.0 ? '0' : '3 3'}
                />
              );
            })}

            {/* Axis Lines */}
            {subjectScores.map((_, idx) => {
              const { x, y } = getCoordinates(idx, 1.0);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(163, 230, 53, 0.2)"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Glowing Filled Score Polygon */}
            <polygon
              points={scorePoints}
              fill="rgba(163, 230, 53, 0.25)"
              stroke="#bef264"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_15px_rgba(163,230,53,0.5)] transition-all duration-700"
            />

            {/* Points & Labels */}
            {subjectScores.map((s, idx) => {
              const { x, y } = getCoordinates(idx, s.score / 100);
              const labelPos = getCoordinates(idx, 1.22);

              return (
                <g key={idx}>
                  {/* Glowing Node Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#bef264"
                    stroke="#040604"
                    strokeWidth="2"
                    className="drop-shadow-[0_0_8px_#a3e635]"
                  />

                  {/* Axis Text Label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-[11px] font-bold tracking-tight"
                  >
                    {s.subject} ({s.score}%)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Breakdown & Recommendations Panel */}
        <div className="lg:col-span-6 space-y-3.5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400">
            Subject Performance Breakdown
          </h3>

          <div className="space-y-2.5">
            {subjectScores.map((s) => (
              <div
                key={s.subject}
                className="p-3 rounded-2xl bg-[#09100a] border border-white/10 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      s.status === 'strong'
                        ? 'bg-[#a3e635] shadow-[0_0_8px_#a3e635]'
                        : s.status === 'moderate'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white block">{s.subject}</span>
                    <span className="text-[11px] text-neutral-400">
                      {s.testsCount > 0 ? `${s.testsCount} Tests Recorded` : 'Diagnostic Assessment'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Progress Bar */}
                  <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className={`h-full rounded-full ${
                        s.status === 'strong' ? 'bg-[#a3e635]' : s.status === 'moderate' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className="font-extrabold font-mono text-[#bef264] text-sm">{s.score}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Gap Alert */}
          {gapSubjects.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#18261b] border border-[#a3e635]/40 text-xs text-neutral-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-white block font-bold mb-0.5">Recommended Focus Area</strong>
                Consider taking chapter practice tests in <strong className="text-[#bef264]">{gapSubjects[0].subject}</strong> to improve overall diagnostic balance.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
