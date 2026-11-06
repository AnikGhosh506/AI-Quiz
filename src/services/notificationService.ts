import { playHoverSound } from '../utils/audioEffects';

export interface StudyReminder {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'test' | 'goal' | 'streak' | 'competition';
  enabled: boolean;
  scheduledTime?: string;
}

const DEFAULT_REMINDERS: StudyReminder[] = [
  {
    id: 'goal-daily',
    title: '🔥 Daily Learning Goal Reminder',
    message: "Don't break your 7-Day Streak! 2 Math practice questions remaining today.",
    time: '07:00 PM',
    type: 'goal',
    enabled: true,
  },
  {
    id: 'test-scheduled',
    title: '📝 Physics Chapter 4 Practice Test',
    message: 'Electricity & Circuits mock test is scheduled to begin in 15 minutes.',
    time: '05:30 PM',
    type: 'test',
    enabled: true,
  },
  {
    id: 'streak-[#1]',
    title: '🏆 Leaderboard Alert',
    message: 'Aarav Sharma has earned 2310 XP! Take a quiz to maintain your #1 Rank.',
    time: '08:15 PM',
    type: 'competition',
    enabled: true,
  },
];

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public getPermissionStatus(): NotificationPermission {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Web Notifications are not supported in this browser environment.');
      return false;
    }

    try {
      const res = await Notification.requestPermission();
      this.permission = res;
      if (res === 'granted') {
        this.sendNotification(
          '🔔 AURIX Notifications Enabled!',
          'You will now receive PWA reminders for scheduled tests, daily goals, and leaderboard updates.'
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  }

  public sendNotification(title: string, body: string, icon = '/icon.svg'): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;

    if (Notification.permission === 'granted') {
      try {
        // Native Web / PWA Notification
        const notif = new Notification(title, {
          body,
          icon,
          badge: icon,
          tag: 'aurix-study-reminder',
          silent: false,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };

        // Play audio feedback
        playHoverSound('pop');
        return true;
      } catch (e) {
        console.warn('Direct notification error, trying service worker registration notification:', e);
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, { body, icon, tag: 'aurix-study-reminder' });
          });
          return true;
        }
      }
    }
    return false;
  }

  public getReminders(): StudyReminder[] {
    const saved = localStorage.getItem('aurix_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_REMINDERS;
      }
    }
    return DEFAULT_REMINDERS;
  }

  public saveReminders(reminders: StudyReminder[]) {
    localStorage.setItem('aurix_reminders', JSON.stringify(reminders));
  }
}

export const notificationService = new NotificationService();
