// Web Audio API로 효과음을 직접 생성
export function playSound(type: 'click' | 'expand') {
  if (typeof window === 'undefined') return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);

  if (type === 'click') {
    // 짧은 딸깍 소리
    o.type = 'square';
    o.frequency.value = 800;
    g.gain.value = 0.15;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    o.stop(ctx.currentTime + 0.08);
  } else if (type === 'expand') {
    // 펼침: 신스 느낌 효과음
    o.type = 'triangle';
    o.frequency.setValueAtTime(300, ctx.currentTime);
    o.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.18);
    g.gain.value = 0.12;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    o.stop(ctx.currentTime + 0.18);
  }

  o.onended = () => ctx.close();
}
