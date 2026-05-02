// Tiny SFX generator using Web Audio API. No external audio files —
// everything is synthesized at runtime. Sounds are intentionally short
// and friendly (light bells, no harsh attacks) for a kids' game.

let ctx = null;
let muted = false;

function getCtx() {
  if (ctx) return ctx;
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  ctx = new C();
  return ctx;
}

// Resume the context after a user gesture. Safari/iOS won't play before this.
export function unlockAudio() {
  const c = getCtx();
  if (c && c.state === 'suspended') c.resume();
}

export function setMuted(v) {
  muted = !!v;
}

function tone({ freq, type = 'sine', duration = 0.15, volume = 0.18, attack = 0.005, release = 0.08, freqEnd, when = 0 }) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd != null) {
    osc.frequency.linearRampToValueAtTime(freqEnd, t0 + duration);
  }
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + attack);
  gain.gain.linearRampToValueAtTime(0, t0 + duration + release);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + release + 0.05);
}

export function playJump() {
  tone({ freq: 380, freqEnd: 720, type: 'square', duration: 0.08, volume: 0.10, release: 0.06 });
}

export function playPickup() {
  // Sparkly two-note chime
  tone({ freq: 1320, type: 'triangle', duration: 0.07, volume: 0.18 });
  tone({ freq: 1980, type: 'triangle', duration: 0.10, volume: 0.14, when: 0.06 });
}

export function playRespawn() {
  tone({ freq: 660, freqEnd: 440, type: 'sine', duration: 0.18, volume: 0.14 });
}

export function playWin() {
  // Ascending C-E-G-C arpeggio
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    tone({ freq: f, type: 'triangle', duration: 0.18, volume: 0.18, when: i * 0.12 });
  });
}
