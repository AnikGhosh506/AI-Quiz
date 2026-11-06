import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Send, ShieldCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { notificationService, StudyReminder } from '../services/notificationService';
import { playHoverSound } from '../utils/audioEffects';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  const [testSentToast, setTestSentToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPermission(notificationService.getPermissionStatus());
      setReminders(notificationService.getReminders());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnablePermission = async () => {
    playHoverSound('pop');
    const granted = await notificationService.requestPermission();
    setPermission(notificationService.getPermissionStatus());
    if (granted) {
      setTestSentToast('Push Notifications Enabled!');
      setTimeout(() => setTestSentToast(null), 3500);
    }
  };

  const handleToggleReminder = (id: string) => {
    playHoverSound('click');
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setReminders(updated);
    notificationService.saveReminders(updated);
  };

  const handleTriggerTestNotif = (reminder: StudyReminder) => {
    playHoverSound('pop');
    const success = notificationService.sendNotification(reminder.title, reminder.message);
    if (success) {
      setTestSentToast(`Notification sent: "${reminder.title}"`);
    } else {
      setTestSentToast('Please click "Enable Web Push Notifications" first!');
    }
    setTimeout(() => setTestSentToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md aurix-3d-card bg-[#0c140e] border border-[#a3e635]/40 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <div className="aurix-3d-icon-box w-11 h-11 rounded-2xl flex items-center justify-center text-[#a3e635]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#a3e635]/20 border border-[#a3e635]/40 text-[10px] text-[#bef264] font-bold uppercase">
              <Sparkles className="w-3 h-3" />
              PWA Push Notifications
            </div>
            <h3 className="text-lg font-extrabold text-white mt-0.5 aurix-3d-heading">
              Study Reminders &amp; Alerts
            </h3>
          </div>
        </div>

        {/* Permission Banner */}
        {permission !== 'granted' ? (
          <div className="p-3.5 rounded-2xl bg-[#142316] border border-[#a3e635]/40 space-y-2">
            <div className="flex items-start gap-2.5 text-xs text-neutral-200">
              <AlertCircle className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">Enable Desktop &amp; Mobile Notifications</strong>
                Receive alerts for scheduled test countdowns, 7-day streak goal reminders, and leaderboard position shifts.
              </div>
            </div>
            <button
              onClick={handleEnablePermission}
              className="w-full aurix-3d-button py-2.5 px-3 rounded-xl text-xs font-bold text-[#040604] flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Bell className="w-4 h-4" />
              <span>Enable Web Push Notifications</span>
            </button>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[#142618] border border-[#a3e635]/40 text-xs text-[#bef264] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#a3e635]" />
            <span className="font-semibold">Web Push Notifications Active &amp; Authorized</span>
          </div>
        )}

        {/* Toast alert */}
        {testSentToast && (
          <div className="p-2.5 rounded-xl bg-[#091a0c] border border-[#a3e635]/60 text-xs text-[#bef264] font-semibold flex items-center gap-2 animate-in fade-in">
            <Send className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>{testSentToast}</span>
          </div>
        )}

        {/* Reminders List */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-neutral-300 block">Scheduled Reminders &amp; Pattern Triggers:</span>

          {reminders.map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-2xl bg-[#080d09] border border-white/10 hover:border-[#a3e635]/40 transition-all flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate">{r.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#bef264] font-mono">
                    {r.time}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 truncate mt-0.5">{r.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTriggerTestNotif(r)}
                  className="px-2 py-1 rounded-lg bg-[#142316] hover:bg-[#1a2d1d] border border-[#a3e635]/40 text-[10px] font-bold text-[#bef264] transition-all cursor-pointer whitespace-nowrap"
                  title="Send immediate test notification"
                >
                  Test Now
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleReminder(r.id)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                    r.enabled ? 'bg-[#a3e635] justify-end' : 'bg-neutral-700 justify-start'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${r.enabled ? 'bg-[#040604]' : 'bg-neutral-300'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full aurix-3d-glass-btn py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-200 hover:text-white cursor-pointer"
        >
          Close Notification Center
        </button>
      </div>
    </div>
  );
};
