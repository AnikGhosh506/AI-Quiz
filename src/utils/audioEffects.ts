// Lightweight Web Audio API synthesizer for subtle tactile click/hiss hover feedback
let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a ultra subtle, soft mechanical click/pop sound for button hover.
 * Uses Web Audio API oscillator + bandpass noise burst at low volume (~0.025).
 */
export function playHoverSound(type: 'click' | 'hiss' | 'pop' = 'click') {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();

    if (type === 'hiss') {
      // Soft airy hiss burst
      const bufferSize = ctx.sampleRate * 0.015; // 15ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(3.0, now);

      gainNode.gain.setValueAtTime(0.018, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.015);
    } else {
      // Subtle tactile click/pop
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'pop' ? 320 : 1200, now);
      osc.frequency.exponentialRampToValueAtTime(type === 'pop' ? 120 : 400, now + 0.012);

      gainNode.gain.setValueAtTime(0.025, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.012);
    }
  } catch (err) {
    // Ignore audio context autoplay restriction edge cases
  }
}

/**
 * Initializes global delegation listener for tactile hover feedback
 * on all 3D buttons, 3D cards, 3D glass controls, and 3D icons.
 */
export function initGlobalTactileAudio() {
  if (typeof window === 'undefined') return;

  let lastPlayedTime = 0;

  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const interactiveEl = target.closest(
      '.aurix-3d-button, .aurix-3d-glass-btn, .aurix-3d-card, .aurix-3d-logo, .aurix-3d-icon-box, button, [role="button"]'
    );

    if (interactiveEl) {
      const now = Date.now();
      // Throttle to prevent audio overload when rapidly moving mouse across elements
      if (now - lastPlayedTime > 40) {
        lastPlayedTime = now;
        if (interactiveEl.classList.contains('aurix-3d-button')) {
          playHoverSound('pop');
        } else if (interactiveEl.classList.contains('aurix-3d-card')) {
          playHoverSound('hiss');
        } else {
          playHoverSound('click');
        }
      }
    }
  };

  document.addEventListener('mouseover', handleMouseOver, { passive: true });
}

export function toggleAudioMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getAudioMuteState(): boolean {
  return isMuted;
}
