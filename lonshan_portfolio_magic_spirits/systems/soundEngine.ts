/**
 * soundEngine.ts — Procedural elemental sound system
 *
 * Uses the Web Audio API to synthesise unique sounds for each spirit in real-time.
 * No external audio files required; sounds work immediately in the browser.
 *
 * To swap in real audio files later, use Howler.js:
 *   import { Howl } from 'howler';
 *   new Howl({ src: ['/sounds/fire-click.mp3'] }).play();
 */

import { ElementType, ActiveTheme } from '../types/spirit.types';

// ── AudioContext singleton ─────────────────────────────────────────

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    try {
      _ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
    } catch {
      return null;
    }
  }
  // Resume suspended context caused by browser autoplay policy
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}

// ── Synth primitives ───────────────────────────────────────────────

/** Play a single oscillator tone with ADSR envelope */
function playTone(
  freq: number,
  type: OscillatorType,
  duration: number,
  attack: number,
  volume: number,
  pitchEnd?: number,
): void {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (pitchEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(pitchEnd, 1), now + duration);
  }

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

/** Play filtered white noise — fire, wind, static, etc. */
function playNoise(
  filterFreq: number,
  filterQ: number,
  duration: number,
  volume: number,
  filterType: BiquadFilterType = 'bandpass',
): void {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const bufSize = Math.ceil(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  filter.Q.value = filterQ;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration + 0.05);
}

// ── Per-element sound recipes ──────────────────────────────────────
// Each sound is tuned to its element's character:
//   Fire → crackling bandpass noise
//   Water → descending sine droplet
//   Ice → bright high-frequency ping
//   Wind → airy bandpass noise sweep
//   Soil → deep low thud
//   Trees → warm mid-range triangle
//   Lightning → electric sawtooth zap + noise
//   Dark → brooding low sawtooth
//   Light → bright major third chord
//   Healing → gentle 528 Hz + harmony
//   Void → sub-bass sine drone
//   Space → sine with slight reverb tail + noise shimmer
//   Time → bell-like multi-partial
//   Robot → square-wave blip

const SPIRIT_SOUNDS: Record<ElementType, () => void> = {
  fire:      () => playNoise(800,  2,   0.40, 0.12, 'bandpass'),
  water:     () => playTone(880,  'sine',      0.50, 0.01, 0.18, 220),
  ice:       () => playTone(1760, 'sine',      0.22, 0.005, 0.15, 2200),
  wind:      () => playNoise(400,  1.5, 0.55, 0.08, 'bandpass'),
  soil:      () => playTone(65,   'sine',      0.35, 0.01, 0.22, 40),
  trees:     () => playTone(440,  'triangle',  0.45, 0.04, 0.14),
  lightning: () => {
    playTone(1800, 'sawtooth', 0.15, 0.002, 0.20, 200);
    playNoise(2200, 6, 0.10, 0.14);
  },
  dark:      () => playTone(110,  'sawtooth',  0.60, 0.08, 0.14, 80),
  light:     () => {
    playTone(1047, 'sine', 0.40, 0.01, 0.13);   // C6
    playTone(1319, 'sine', 0.40, 0.01, 0.10);   // E6
  },
  healing:   () => {
    playTone(528,  'sine', 0.55, 0.05, 0.12);   // 528 Hz (love frequency)
    playTone(660,  'sine', 0.55, 0.05, 0.09);
  },
  void:      () => playTone(45,   'sine',      0.80, 0.20, 0.10, 35),
  space:     () => {
    playTone(261,  'sine', 0.80, 0.10, 0.10, 220);
    playNoise(1200, 1, 0.40, 0.04);
  },
  time:      () => {
    // Bell: fundamental + 2nd + 3rd partial
    playTone(880,  'sine', 0.70, 0.005, 0.14);
    playTone(1760, 'sine', 0.50, 0.005, 0.09);
    playTone(2637, 'sine', 0.30, 0.005, 0.05);
  },
  robot:     () => playTone(440,  'square',    0.20, 0.002, 0.15, 880),
};

// ── Sound engine class ─────────────────────────────────────────────

class SoundEngine {
  private enabled = true;

  private safe(fn: () => void): void {
    if (!this.enabled || typeof window === 'undefined') return;
    try { fn(); } catch { /* never crash on audio errors */ }
  }

  /** Play the signature sound for a spirit element */
  playSpiritClick(element: ElementType): void {
    this.safe(() => SPIRIT_SOUNDS[element]?.());
  }

  /** Cinematic rising sweep played on theme transition */
  playThemeTransition(): void {
    this.safe(() => {
      playTone(180, 'sine', 0.90, 0.04, 0.16, 720);
      playNoise(1200, 1, 0.65, 0.05);
    });
  }

  /** Magical chord strike when two elements combine */
  playCombination(): void {
    this.safe(() => {
      // C major chord — celebratory
      [261.63, 329.63, 392.0, 523.25].forEach((f, i) =>
        playTone(f, 'sine', 1.2, 0.01 + i * 0.04, 0.11),
      );
    });
  }

  /** Subtle bubble-pop when a dialogue line appears */
  playDialogueAppear(): void {
    this.safe(() => playTone(900, 'sine', 0.12, 0.005, 0.06, 1400));
  }

  setEnabled(v: boolean): void { this.enabled = v; }
  isEnabled(): boolean { return this.enabled; }
}

// Singleton — one engine instance shared by all hooks
let _instance: SoundEngine | null = null;

export function getSoundEngine(): SoundEngine {
  if (!_instance) _instance = new SoundEngine();
  return _instance;
}

// Re-export ActiveTheme so consumers can import from here
export type { ActiveTheme };
