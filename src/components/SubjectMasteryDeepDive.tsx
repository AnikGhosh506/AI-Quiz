import React, { useState } from 'react';
import { QuizResult } from '../data/quizData';
import { TrendingUp, Sparkles, Activity, ArrowUpRight, ZoomIn, ZoomOut, RotateCcw, Calendar } from 'lucide-react';
import { playHoverSound } from '../utils/audioEffects';

interface SubjectMasteryDeepDiveProps {
  quizResults: QuizResult[];
}

interface SubjectTrend {
  subject: string;
  scores: number[];
  dates: string[];
  averageScore: number;
  latestScore: number;
  trendPercent: number;
  totalTests: number;
  masteryLevel: 'Mastered' | 'Proficient' | 'Developing' | 'Needs Focus';
  color: string;
}

export const SubjectMasteryDeepDive: React.FC<SubjectMasteryDeepDiveProps> = ({ quizResults }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 1.5 = 150%, 2 = 200%
  const [hoveredPoint, setHoveredPoint] = useState<{ subject: string; score: number; date: string } | null>(null);

  const subjectsList = ['Physics', 'Mathematics', 'Chemistry', 'Biology', 'English'];

  // Process test history according to timeframe (7d, 30d, 90d)
  const trends: SubjectTrend[] = subjectsList.map((subjectName) => {
    const matchingTests = quizResults.filter((r) => {
      const titleLower = (r.testTitle || '').toLowerCase();
      const sLower = subjectName.toLowerCase();
      if (sLower === 'mathematics') return titleLower.includes('math');
      return titleLower.includes(sLower);
    });

    let rawScores: number[] = [];
    let rawDates: string[] = [];

    if (timeframe === '7d') {
      if (subjectName === 'Physics') { rawScores = [78, 85, 92]; rawDates = ['Nov 01', 'Nov 03', 'Nov 05']; }
      else if (subjectName === 'Mathematics') { rawScores = [75, 80, 88]; rawDates = ['Nov 01', 'Nov 03', 'Nov 04']; }
      else if (subjectName === 'Chemistry') { rawScores = [82, 86, 90]; rawDates = ['Nov 02', 'Nov 04', 'Nov 06']; }
      else if (subjectName === 'Biology') { rawScores = [85, 89, 95]; rawDates = ['Nov 01', 'Nov 03', 'Nov 05']; }
      else { rawScores = [80, 85, 88]; rawDates = ['Nov 02', 'Nov 04', 'Nov 06']; }
    } else if (timeframe === '90d') {
      if (subjectName === 'Physics') { rawScores = [55, 62, 70, 78, 85, 92]; rawDates = ['Sep 10', 'Sep 25', 'Oct 10', 'Oct 22', 'Nov 01', 'Nov 05']; }
      else if (subjectName === 'Mathematics') { rawScores = [50, 58, 68, 75, 80, 88]; rawDates = ['Sep 08', 'Sep 22', 'Oct 08', 'Oct 20', 'Nov 01', 'Nov 04']; }
      else if (subjectName === 'Chemistry') { rawScores = [60, 68, 75, 82, 86, 90]; rawDates = ['Sep 12', 'Sep 28', 'Oct 12', 'Oct 25', 'Nov 02', 'Nov 06']; }
      else if (subjectName === 'Biology') { rawScores = [65, 72, 80, 85, 89, 95]; rawDates = ['Sep 09', 'Sep 24', 'Oct 09', 'Oct 21', 'Nov 01', 'Nov 05']; }
      else { rawScores = [60, 68, 75, 80, 85, 88]; rawDates = ['Sep 11', 'Sep 26', 'Oct 11', 'Oct 24', 'Nov 02', 'Nov 06']; }
    } else {
      // 30d default
      if (subjectName === 'Physics') { rawScores = [65, 70, 78, 85, 92]; rawDates = ['Oct 12', 'Oct 18', 'Oct 25', 'Nov 01', 'Nov 05']; }
      else if (subjectName === 'Mathematics') { rawScores = [60, 68, 75, 80, 88]; rawDates = ['Oct 10', 'Oct 15', 'Oct 22', 'Oct 29', 'Nov 04']; }
      else if (subjectName === 'Chemistry') { rawScores = [72, 75, 82, 86, 90]; rawDates = ['Oct 14', 'Oct 20', 'Oct 27', 'Nov 02', 'Nov 06']; }
      else if (subjectName === 'Biology') { rawScores = [78, 82, 85, 89, 95]; rawDates = ['Oct 11', 'Oct 17', 'Oct 24', 'Nov 01', 'Nov 05']; }
      else { rawScores = [70, 75, 80, 85, 88]; rawDates = ['Oct 13', 'Oct 19', 'Oct 26', 'Nov 03', 'Nov 06']; }
    }

    if (matchingTests.length > 0) {
      matchingTests.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      rawScores = matchingTests.map((t) => t.score);
      rawDates = matchingTests.map((t) => t.date);
    }

    const totalTests = rawScores.length;
    const avg = Math.round(rawScores.reduce((a, b) => a + b, 0) / totalTests);
    const latest = rawScores[rawScores.length - 1];
    const first = rawScores[0];
    const trendPercent = Math.round(latest - first);

    let masteryLevel: SubjectTrend['masteryLevel'] = 'Needs Focus';
    if (avg >= 85) masteryLevel = 'Mastered';
    else if (avg >= 75) masteryLevel = 'Proficient';
    else if (avg >= 60) masteryLevel = 'Developing';

    let color = '#a3e635';
    if (subjectName === 'Physics') color = '#bef264';
    if (subjectName === 'Mathematics') color = '#38bdf8';
    if (subjectName === 'Chemistry') color = '#fbbf24';
    if (subjectName === 'Biology') color = '#34d399';
    if (subjectName === 'English') color = '#c084fc';

    return {
      subject: subjectName,
      scores: rawScores,
      dates: rawDates,
      averageScore: avg,
      latestScore: latest,
      trendPercent,
      totalTests,
      masteryLevel,
      color,
    };
  });

  // Main Zoomable Area Chart Rendering
  const renderInteractiveAreaChart = () => {
    const width = 600 * zoomLevel;
    const height = 180;
    const padding = 20;

    const minVal = 40;
    const maxVal = 100;

    return (
      <div className="w-full overflow-x-auto no-scrollbar border border-white/10 rounded-2xl bg-[#070d08] p-4 relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 transition-all duration-300 overflow-visible"
        >
          {/* Background Horizontal Gridlines */}
          {[40, 60, 80, 100].map((val) => {
            const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
            return (
              <g key={val}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <text x={padding - 5} y={y + 3} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end" fontFamily="sans-serif">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Subject Area Curves */}
          {trends.map((t) => {
            const points = t.scores.map((score, i) => {
              const x = padding + (i / (t.scores.length - 1)) * (width - 2 * padding);
              const y = height - padding - ((score - minVal) / (maxVal - minVal)) * (height - 2 * padding);
              return { x, y, score, date: t.dates[i] || `P${i + 1}` };
            });

            const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
            const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

            return (
              <g key={t.subject}>
                <defs>
                  <linearGradient id={`area-${t.subject}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={t.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={t.color} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Filled Area */}
                <path d={areaD} fill={`url(#area-${t.subject})`} />

                {/* Line Path */}
                <path d={pathD} fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round" />

                {/* Interactive Points */}
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    fill={t.color}
                    stroke="#040604"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        subject: t.subject,
                        score: p.score,
                        date: p.date,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 px-3 py-1.5 rounded-xl bg-[#0f1b11] border border-[#a3e635]/50 text-xs text-[#bef264] shadow-lg animate-in fade-in">
            <span className="font-bold">{hoveredPoint.subject}: </span>
            <span className="font-extrabold text-white">{hoveredPoint.score}%</span>
            <span className="text-[10px] text-neutral-400 block">Date: {hoveredPoint.date}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="my-8 aurix-3d-card p-6 sm:p-8 rounded-3xl bg-[#09100a]/90 border border-[#a3e635]/35 shadow-2xl text-left space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/40 text-xs text-[#bef264] font-bold">
            <Activity className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Interactive Zoomable Area Chart</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Historical Subject Mastery Trends
          </h2>
          <p className="text-xs text-neutral-300">
            Compare performance trajectories across all subjects over 7-day, 30-day, and 90-day timeframes.
          </p>
        </div>

        {/* Controls Toolbar: Timeframe + Zoom */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Timeframe Toggles */}
          <div className="flex p-1 rounded-xl bg-[#050805] border border-white/10 text-xs font-semibold">
            {(['7d', '30d', '90d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  playHoverSound('click');
                  setTimeframe(tf);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#142316] text-[#bef264] border border-[#a3e635]/40 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-[#050805] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                playHoverSound('click');
                setZoomLevel((prev) => Math.min(2.5, prev + 0.25));
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#a3e635]" />
            </button>
            <button
              onClick={() => {
                playHoverSound('click');
                setZoomLevel((prev) => Math.max(1, prev - 0.25));
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5 text-[#a3e635]" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Multi-Subject Area Chart */}
      {renderInteractiveAreaChart()}

      {/* Subject Legend & Sparkline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {trends.map((t) => (
          <div
            key={t.subject}
            onMouseEnter={() => playHoverSound('hiss')}
            className="p-4 sm:p-5 rounded-2xl bg-[#0c150e] hover:bg-[#111e13] border border-white/10 hover:border-[#a3e635]/50 transition-all space-y-3 shadow-md group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-xs font-extrabold text-white group-hover:text-[#bef264] transition-colors">
                  {t.subject}
                </span>
              </div>

              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
                style={{
                  backgroundColor: `${t.color}20`,
                  color: t.color,
                  border: `1px solid ${t.color}40`,
                }}
              >
                {t.masteryLevel}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-2xl font-extrabold text-white">{t.latestScore}%</span>
                <span className="text-[11px] text-neutral-400 ml-1.5 font-medium">
                  (Avg: {t.averageScore}%)
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-[#a3e635]">
                <ArrowUpRight className="w-4 h-4 text-[#a3e635]" />
                <span>+{t.trendPercent}% {timeframe}</span>
              </div>
            </div>

            {/* Mastery Progress Bar */}
            <div className="pt-1">
              <div className="flex justify-between text-[10px] text-neutral-400 mb-1 font-mono">
                <span>Mastery Progress</span>
                <span className="text-white font-bold">{t.averageScore}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#040604] overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${t.averageScore}%`,
                    backgroundColor: t.color,
                    boxShadow: `0 0 10px ${t.color}`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
