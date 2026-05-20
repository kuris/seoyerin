// Web Audio API로 효과음을 직접 생성
export type SoundType = 'click' | 'typewriter' | 'mechanical';

export function playSound(type: SoundType) {
  if (typeof window === 'undefined') return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

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
    playOsc(800, 'square', 0.1, 0.08);
  } else if (type === 'typewriter') {
    // 타자기 소리: 짧고 높은 타격음
    playOsc(1200, 'sine', 0.15, 0.05);
    setTimeout(() => playOsc(1000, 'sine', 0.1, 0.04), 20);
  } else if (type === 'mechanical') {
    // 치킹 소리: 두 단계의 기계적 소리
    playOsc(150, 'sawtooth', 0.1, 0.15);
    setTimeout(() => {
      const { o } = playOsc(600, 'square', 0.08, 0.1);
      o.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.1);
    }, 50);
  }

  // 컨텍스트 정리는 대략적인 시간 후 수행
  setTimeout(() => ctx.close(), 500);
}
