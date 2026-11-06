import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, Clock, Bell } from 'lucide-react';
import { playHoverSound } from '../utils/audioEffects';

interface FocusSessionWidgetProps {
  onSessionComplete?: () => void;
}

export const FocusSessionWidget: React.FC<FocusSessionWidgetProps> = ({ onSessionComplete }) => {
  const DEFAULT_TIME = 25 * 60; // 25 minutes
  const [secondsLeft, setSecondsLeft] = useState<number>(DEFAULT_TIME);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Sound synthesis for completion chime
  const playCompletionChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.15 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.6);
      });
    } catch (e) {
      // Ignore autoplay error
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        setCompletedSessions((prev) => prev + 1);
        setShowNotification(true);
        playCompletionChime();
        if (onSessionComplete) onSessionComplete();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, isBreak]);

  const toggleTimer = () => {
    playHoverSound('pop');
    setIsActive(!isActive);
  };

  const resetTimer = (mode: 'focus' | 'break' = 'focus') => {
    playHoverSound('click');
    setIsActive(false);
    setIsBreak(mode === 'break');
    setSecondsLeft(mode === 'break' ? 5 * 60 : DEFAULT_TIME);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const totalDuration = isBreak ? 5 * 60 : DEFAULT_TIME;
  const progressPercent = Math.round(((totalDuration - secondsLeft) / totalDuration) * 100);

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-5 sm:p-6 rounded-3xl aurix-3d-card border border-[#a3e635]/35 shadow-[0_0_35px_rgba(163,230,53,0.18)] relative overflow-hidden text-center">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#a3e635]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Completion Notification Banner */}
      {showNotification && (
        <div className="mb-4 p-3.5 rounded-2xl bg-[#142618] border border-[#a3e635] text-xs text-white flex items-center justify-between gap-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#bef264] text-[#040604] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-[#bef264] block">Focus Session Completed! 🎉</span>
              <span className="text-[11px] text-neutral-300">Great job! Take a 5-minute break or start another round.</span>
            </div>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <div className="aurix-3d-icon-box w-7 h-7 rounded-lg flex items-center justify-center text-[#a3e635]">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            25-Min Student Focus Session (Pomodoro)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#bef264] px-2.5 py-0.5 rounded-full bg-[#a3e635]/15 border border-[#a3e635]/30">
            {completedSessions} {completedSessions === 1 ? 'Session' : 'Sessions'} Done
          </span>
        </div>
      </div>

      {/* Timer Display with Graphical Circular Progress */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-neutral-800"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-[#a3e635] transition-all duration-1000 ease-linear"
              strokeWidth="7"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white font-mono tracking-tight aurix-3d-heading">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3e635] mt-0.5">
              {isBreak ? 'Break Time' : isActive ? 'Focusing...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimer}
              className={`flex-1 sm:w-36 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-transform ${
                isActive ? 'aurix-3d-glass-btn text-yellow-300 border-yellow-500/50' : 'aurix-3d-button text-[#040604]'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isActive ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={() => resetTimer(isBreak ? 'break' : 'focus')}
              className="p-2.5 rounded-xl aurix-3d-glass-btn text-neutral-300 hover:text-white cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => resetTimer('focus')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                !isBreak
                  ? 'bg-[#142316] text-[#bef264] border-[#a3e635]/60'
                  : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => resetTimer('break')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                isBreak
                  ? 'bg-[#142316] text-[#bef264] border-[#a3e635]/60'
                  : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              5m Break
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
