import React, { useState } from 'react';
import { Flame, BellRing, AlertTriangle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { playHoverSound } from '../utils/audioEffects';

interface StreakRiskReminderProps {
  currentStreakDays?: number;
  onTakeTest: () => void;
}

export const StreakRiskReminder: React.FC<StreakRiskReminderProps> = ({
  currentStreakDays = 7,
  onTakeTest,
}) => {
  const [notificationSent, setNotificationSent] = useState(false);

  const handleTriggerPushNotification = async () => {
    playHoverSound('pop');
    const granted = await notificationService.requestPermission();
    if (!granted) {
      alert('Notification permissions are required to receive PWA streak alerts.');
      return;
    }

    notificationService.sendNotification(
      '🚨 Streak Loss Risk Alert!',
      `Your ${currentStreakDays}-Day Learning Streak is about to expire today! Take a quick test now to preserve your rank 🔥`
    );

    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 5000);
  };

  return (
    <div className="my-6 aurix-3d-card p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#180a0a] via-[#120808] to-[#09100a] border border-amber-500/40 shadow-2xl text-left relative overflow-hidden">
      {/* Background ambient flame glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#26100c] border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Daily Goal &amp; Streak Alert</span>
              </span>
              <span className="text-xs font-extrabold text-amber-400 font-mono">
                {currentStreakDays}-Day Flame 🔥
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Streak at Risk! No Test Recorded Today
            </h3>
            <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
              Complete at least 1 practice session today before midnight to maintain your daily study goal and retain your placement on the student leaderboard.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleTriggerPushNotification}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              notificationSent
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-[#142316] hover:bg-[#1a2e1d] border-[#a3e635]/40 text-[#bef264] hover:border-[#a3e635]'
            }`}
          >
            {notificationSent ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>PWA Push Reminder Triggered!</span>
              </>
            ) : (
              <>
                <BellRing className="w-4 h-4 text-[#a3e635]" />
                <span>Send PWA Risk Notification</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              playHoverSound('pop');
              onTakeTest();
            }}
            className="aurix-3d-button px-4 py-2.5 rounded-xl text-xs font-extrabold text-[#040604] flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            <span>Protect Streak (Take Test)</span>
            <ArrowRight className="w-4 h-4 text-[#040604]" />
          </button>
        </div>
      </div>
    </div>
  );
};
