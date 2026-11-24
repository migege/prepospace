// Gentle, playful Web Audio API chimes (zero external audio files, works offline on iPad)

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.14
): void {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

/** Light wooden marimba pop when tapping a preposition button */
export function playPopSound(): void {
  playTone(523.25, 0, 0.12, 'triangle', 0.12); // C5
  playTone(659.25, 0.05, 0.14, 'sine', 0.1); // E5
}

/** Cheerful ascending sparkle arpeggio when a child nails an answer */
export function playWinSound(): void {
  playTone(523.25, 0, 0.16, 'triangle', 0.14); // C5
  playTone(659.25, 0.09, 0.16, 'triangle', 0.14); // E5
  playTone(783.99, 0.18, 0.18, 'triangle', 0.15); // G5
  playTone(1046.5, 0.27, 0.34, 'sine', 0.16); // C6
}

/** Gentle, non-harsh boing when encouraging a retry */
export function playTryAgainSound(): void {
  playTone(320, 0, 0.16, 'sine', 0.11);
  playTone(260, 0.11, 0.22, 'sine', 0.11);
}
