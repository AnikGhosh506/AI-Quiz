import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Network,
  BookOpen,
  Zap,
  ArrowRight,
  Info,
  Maximize2,
  RefreshCw,
  Layers,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { playHoverSound } from '../utils/audioEffects';

export interface ConceptNode {
  id: string;
  label: string;
  category: 'core' | 'formula' | 'experiment' | 'application' | 'subtopic';
  summary: string;
  keyFormula?: string;
  importanceScore: number;
  x?: number;
  y?: number;
}

export interface ConceptEdge {
  source: string;
  target: string;
  relationLabel: string;
  strength: number;
}

export interface ConceptMapData {
  chapterTitle: string;
  nodes: ConceptNode[];
  edges: ConceptEdge[];
}

interface InteractiveConceptMapProps {
  initialSubject?: string;
  initialChapter?: string;
  onAskAIAboutTopic?: (topic: string) => void;
  onTakeTest?: () => void;
}

export const InteractiveConceptMap: React.FC<InteractiveConceptMapProps> = ({
  initialSubject = 'Physics',
  initialChapter = 'Electricity & Circuits',
  onAskAIAboutTopic,
  onTakeTest,
}) => {
  const [subject, setSubject] = useState<string>(initialSubject);
  const [chapter, setChapter] = useState<string>(initialChapter);
  const [mapData, setMapData] = useState<ConceptMapData | null>(null);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    fetchConceptMap(subject, chapter);
  }, [subject, chapter]);

  const fetchConceptMap = async (subj: string, ch: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-concept-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subj, chapterTitle: ch }),
      });
      const data: ConceptMapData = await res.json();
      positionNodes(data);
    } catch (err) {
      console.warn('Failed to fetch Gemini concept map:', err);
    } finally {
      setLoading(false);
    }
  };

  // Position nodes in an aesthetic circular / organic layout for SVG canvas
  const positionNodes = (data: ConceptMapData) => {
    const nodes = data.nodes || [];
    const count = nodes.length;
    const centerX = 360;
    const centerY = 240;
    const radius = 170;

    const positioned = nodes.map((node, index) => {
      if (index === 0) {
        // Center core concept node
        return { ...node, x: centerX, y: centerY };
      }
      const angle = ((index - 1) / (count - 1)) * 2 * Math.PI - Math.PI / 2;
      const rx = radius + (index % 2 === 0 ? 25 : -15);
      const ry = radius * 0.85 + (index % 2 === 1 ? 20 : -10);
      return {
        ...node,
        x: Math.round(centerX + rx * Math.cos(angle)),
        y: Math.round(centerY + ry * Math.sin(angle)),
      };
    });

    const finalMap = { ...data, nodes: positioned };
    setMapData(finalMap);
    if (positioned.length > 0) {
      setSelectedNode(positioned[0]);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'core':
        return { bg: 'bg-[#142316]', border: 'border-[#a3e635]', text: 'text-[#bef264]', circle: '#a3e635' };
      case 'formula':
        return { bg: 'bg-[#1a2b16]', border: 'border-lime-400', text: 'text-lime-300', circle: '#84cc16' };
      case 'experiment':
        return { bg: 'bg-amber-950/60', border: 'border-amber-400', text: 'text-amber-300', circle: '#f59e0b' };
      case 'application':
        return { bg: 'bg-blue-950/60', border: 'border-blue-400', text: 'text-blue-300', circle: '#3b82f6' };
      case 'subtopic':
        return { bg: 'bg-purple-950/60', border: 'border-purple-400', text: 'text-purple-300', circle: '#a855f7' };
      default:
        return { bg: 'bg-neutral-900', border: 'border-neutral-500', text: 'text-neutral-200', circle: '#9ca3af' };
    }
  };

  return (
    <div className="aurix-3d-card p-6 sm:p-8 rounded-3xl bg-[#0a120b] border border-[#a3e635]/40 space-y-6 shadow-2xl relative overflow-hidden text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142316] border border-[#a3e635]/40 text-xs text-[#bef264] font-bold mb-2 shadow-sm">
            <Network className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Gemini AI Interconnected Knowledge Network</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight aurix-3d-lime-heading">
            Interactive Concept Map Generator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
            Visualizes relationships, formulas, and experimental connections between chapter topics in an interactive graph.
          </p>
        </div>

        {/* Chapter Selector & Generate Trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080d09] border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-[#a3e635]"
          >
            <option value="Physics">Physics</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>

          <button
            onClick={() => {
              playHoverSound('pop');
              fetchConceptMap(subject, chapter);
            }}
            disabled={loading}
            className="aurix-3d-button px-4 py-2.5 rounded-xl text-xs font-extrabold text-[#040604] flex items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.35)] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#040604] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Generating AI Graph...' : '⚡ Generate AI Map'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Node Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG NODE GRAPH CANVAS (8 Cols) */}
        <div className="lg:col-span-7 aurix-3d-card rounded-2xl bg-[#040604] border border-white/15 p-4 relative min-h-[440px] flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="space-y-3 text-center">
              <Sparkles className="w-8 h-8 text-[#a3e635] animate-spin mx-auto" />
              <p className="text-xs text-neutral-300 font-semibold">
                Analyzing chapter connections with Gemini AI...
              </p>
            </div>
          ) : mapData && mapData.nodes.length > 0 ? (
            <div className="w-full h-full relative flex items-center justify-center">
              <svg
                viewBox="0 0 720 480"
                className="w-full h-full max-h-[450px] transition-transform duration-300"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Connection Edges */}
                {mapData.edges.map((edge, idx) => {
                  const srcNode = mapData.nodes.find((n) => n.id === edge.source);
                  const tgtNode = mapData.nodes.find((n) => n.id === edge.target);
                  if (!srcNode || !tgtNode) return null;

                  const midX = (srcNode.x! + tgtNode.x!) / 2;
                  const midY = (srcNode.y! + tgtNode.y!) / 2;

                  const isSelectedEdge =
                    selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

                  return (
                    <g key={idx}>
                      <line
                        x1={srcNode.x}
                        y1={srcNode.y}
                        x2={tgtNode.x}
                        y2={tgtNode.y}
                        stroke={isSelectedEdge ? '#a3e635' : '#1e3321'}
                        strokeWidth={isSelectedEdge ? 2.5 : 1.5}
                        strokeDasharray={isSelectedEdge ? 'none' : '4 4'}
                        className="transition-all duration-300"
                      />
                      <rect
                        x={midX - 35}
                        y={midY - 9}
                        width="70"
                        height="18"
                        rx="5"
                        fill="#080d09"
                        stroke={isSelectedEdge ? '#a3e635' : '#1e3321'}
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY + 3}
                        textAnchor="middle"
                        fill={isSelectedEdge ? '#bef264' : '#9ca3af'}
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {edge.relationLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {mapData.nodes.map((node) => {
                  const colors = getCategoryColor(node.category);
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => {
                        playHoverSound('pop');
                        setSelectedNode(node);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Node Halo Pulsing Circle */}
                      {isSelected && (
                        <circle
                          r="38"
                          fill="none"
                          stroke="#a3e635"
                          strokeWidth="2"
                          className="animate-ping opacity-60"
                        />
                      )}
                      <circle
                        r={isSelected ? 30 : 25}
                        fill="#0c140e"
                        stroke={isSelected ? '#a3e635' : colors.circle}
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all duration-300 group-hover:scale-110 shadow-xl"
                      />
                      <circle r={isSelected ? 6 : 4} fill={colors.circle} />

                      {/* Node Label Text */}
                      <text
                        y={isSelected ? 44 : 38}
                        textAnchor="middle"
                        fill={isSelected ? '#white' : '#d1d5db'}
                        fontSize={isSelected ? '11' : '10'}
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="text-xs text-neutral-400">Click Generate to build Concept Map</div>
          )}
        </div>

        {/* CONCEPT DEEP DIVE INSPECTOR PANEL (4 Cols) */}
        <div className="lg:col-span-5 aurix-3d-card rounded-2xl bg-[#080d09] border border-[#a3e635]/35 p-5 space-y-4 shadow-xl min-h-[440px] flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border inline-block mb-2 ${
                    getCategoryColor(selectedNode.category).bg
                  } ${getCategoryColor(selectedNode.category).text} ${
                    getCategoryColor(selectedNode.category).border
                  }`}
                >
                  {selectedNode.category} Concept
                </span>
                <h3 className="text-lg font-extrabold text-white leading-tight">{selectedNode.label}</h3>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e1710] border border-white/10 text-xs text-neutral-300 leading-relaxed space-y-2">
                <span className="font-bold text-[#bef264] block">Summary &amp; Core Insight:</span>
                <p>{selectedNode.summary}</p>
              </div>

              {selectedNode.keyFormula && selectedNode.keyFormula !== 'N/A' && (
                <div className="p-3 rounded-xl bg-[#040604] border border-[#a3e635]/40 text-xs font-mono space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Key Formula:</span>
                  <div className="text-center py-1 text-sm font-bold text-[#bef264]">
                    {selectedNode.keyFormula}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                <span className="text-neutral-400">Explanative Weight:</span>
                <span className="text-amber-300 font-bold">
                  {'★'.repeat(selectedNode.importanceScore || 4)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-neutral-400 italic">
              Select any node in the interactive graph to view detailed concept explanation.
            </div>
          )}

          {/* Action Triggers */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            {selectedNode && onAskAIAboutTopic && (
              <button
                onClick={() => {
                  playHoverSound('pop');
                  onAskAIAboutTopic(`Explain ${selectedNode.label} in ${subject} with clear examples and formulas.`);
                }}
                className="w-full aurix-3d-button py-2.5 rounded-xl text-xs font-bold text-[#040604] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current text-[#040604]" />
                <span>Ask AI Tutor About "{selectedNode?.label}"</span>
              </button>
            )}

            {onTakeTest && (
              <button
                onClick={() => {
                  playHoverSound('pop');
                  onTakeTest();
                }}
                className="w-full aurix-3d-glass-btn py-2.5 rounded-xl text-xs font-bold text-neutral-200 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#a3e635]" />
                <span>Practice Chapter Test Questions →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
