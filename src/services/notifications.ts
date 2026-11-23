import { Obligation } from '../types';

class NotificationService {
  private audioContext: AudioContext | null = null;

  // Synthesizes a warm Jazz Cafe acoustic chime using Web Audio API
  playJazzChime(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext || this.audioContext.state === 'suspended') {
        this.audioContext = new AudioCtx();
      }

      const ctx = this.audioContext;
      const now = ctx.currentTime;

      // Note 1: E5 (659.25 Hz) -> Note 2: B5 (987.77 Hz) -> Note 3: E6 (1318.5 Hz) - Jazz Major triad
      const notes = [
        { freq: 659.25, time: now, duration: 0.6 },
        { freq: 830.61, time: now + 0.12, duration: 0.8 },
        { freq: 987.77, time: now + 0.24, duration: 1.2 },
      ];

      notes.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm harmonic tone (triangle / sine blend)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        // Exponential decay envelope
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.25, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
      });
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  // Request browser notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  isPermissionGranted(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  // Send immediate notification
  sendNotification(title: string, body: string, tag?: string): void {
    this.playJazzChime();

    const iconUrl = `${import.meta.env.BASE_URL}icons/coffee-icon.svg`;

    if ('Notification' in window && Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          title,
          body,
          tag: tag || 'jazzapp-alert',
          icon: iconUrl
        });
      } else {
        new Notification(title, {
          body,
          icon: iconUrl,
          badge: iconUrl,
          tag: tag || 'jazzapp-alert',
        });
      }
    }
  }

  // Check obligations and trigger any pending due reminders
  checkDueReminders(obligations: Obligation[], onTrigger: (triggeredId: string) => void): void {
    const now = new Date();

    obligations.forEach((item) => {
      if (item.status === 'paid' || item.reminderTriggered || !item.reminderDateTime) {
        return;
      }

      const reminderTime = new Date(item.reminderDateTime);
      // If reminder time has arrived or passed
      if (now >= reminderTime) {
        this.sendNotification(
          `تذكير Jazzapp: ${item.title}`,
          `المبلغ المستحق: ${item.amount} ${item.currency} — تاريخ الاستحقاق: ${item.dueDate}`,
          `reminder-${item.id}`
        );
        onTrigger(item.id);
      }
    });
  }
}

export const notifications = new NotificationService();
