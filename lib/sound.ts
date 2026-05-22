// Web Audio API로 효과음을 직접 생성
export type SoundType = 'click' | 'typewriter' | 'mechanical' | 'ding';

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playSound(type: SoundType) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const playOsc = (freq: number, type: OscillatorType, gain: number, duration: number, ramp = true) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    if (ramp) {
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    }
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + duration);
    return { o, g };
  };

  if (type === 'click') {
    playOsc(800, 'square', 0.05, 0.08);
  } else if (type === 'typewriter') {
    // 타자기 소리: 더 짧고 선명한 타격음
    playOsc(1500, 'sine', 0.1, 0.03);
    setTimeout(() => playOsc(1000, 'sine', 0.05, 0.02), 15);
  } else if (type === 'mechanical') {
    playOsc(150, 'sawtooth', 0.08, 0.15);
    setTimeout(() => {
      const { o } = playOsc(600, 'square', 0.05, 0.1);
      o.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.1);
    }, 50);
  } else if (type === 'ding') {
    [[880,0],[1320,0.07],[1760,0.13]].forEach(([freq,delay]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0,ctx.currentTime + delay);
      g.gain.linearRampToValueAtTime(0.1,ctx.currentTime + delay + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime + delay + 1.3);
      o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + delay); o.stop(ctx.currentTime + delay + 1.4);
    });
  }
}
