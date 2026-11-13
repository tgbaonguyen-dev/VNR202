// Âm thanh cho "Hứng đáp án", tạo bằng Web Audio: không cần file, không lo bản quyền, chạy khi mất mạng.
// Hiệu ứng kiểu 8-bit; nhạc nền dùng thang ngũ cung (gần âm hưởng dân ca), âm lượng nhỏ.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

try {
  muted = localStorage.getItem("vnr202-mute") === "1";
} catch {
  /* không có localStorage thì mặc định bật tiếng */
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isMuted() {
  return muted;
}

export function setMuted(m: boolean) {
  muted = m;
  try {
    localStorage.setItem("vnr202-mute", m ? "1" : "0");
  } catch {
    /* bỏ qua */
  }
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.55, ctx.currentTime, 0.02);
}

/** Một nốt: dạng sóng, tần số (có thể trượt), độ dài, âm lượng */
function tone(type: OscillatorType, f0: number, f1: number, dur: number, vol = 0.25, delay = 0) {
  const c = ac();
  if (!c || !master || muted) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  /** Hứng đúng: hai nốt đi lên, cao dần theo chuỗi */
  good(streak = 0) {
    const b = 660 * Math.pow(1.06, Math.min(streak, 8));
    tone("square", b, b, 0.07, 0.16);
    tone("square", b * 1.5, b * 1.5, 0.09, 0.14, 0.06);
  },
  bad() {
    tone("sawtooth", 220, 110, 0.22, 0.14);
  },
  coin() {
    tone("square", 988, 988, 0.06, 0.14);
    tone("square", 1319, 1319, 0.16, 0.14, 0.06);
  },
  buff() {
    [523, 659, 784, 1047].forEach((f, i) => tone("triangle", f, f, 0.08, 0.18, i * 0.05));
  },
  block() {
    tone("triangle", 330, 660, 0.12, 0.18);
  },
  giftShake() {
    for (let i = 0; i < 6; i++) tone("square", 300 + i * 40, 300 + i * 40, 0.05, 0.1, i * 0.13);
  },
  flip(rare = false) {
    tone("triangle", 400, 1200, 0.18, 0.18);
    const notes = rare ? [784, 988, 1175, 1568] : [659, 784, 988];
    notes.forEach((f, i) => tone("square", f, f, 0.12, 0.13, 0.2 + i * 0.09));
  },
  tick() {
    tone("square", 880, 880, 0.05, 0.1);
  },
  go() {
    tone("square", 523, 523, 0.08, 0.14);
    tone("square", 1047, 1047, 0.2, 0.14, 0.08);
  },
  roundEnd(won: boolean) {
    const notes = won ? [523, 659, 784, 1047] : [392, 349, 330];
    notes.forEach((f, i) => tone("triangle", f, f, 0.14, 0.18, i * 0.1));
  },
};

// ---------------------------------------------------------------- nhạc nền ngũ cung

// Thang ngũ cung (Đô Rê Fa Sol La) ở hai quãng tám
const SCALE = [262, 294, 349, 392, 440, 523, 587, 698, 784, 880];
// Giai điệu ngắn lặp lại: chỉ số trong SCALE, -1 là nghỉ
const MELODY = [5, 4, 3, 4, 5, -1, 7, 6, 5, 4, 3, -1, 2, 3, 4, 3, 2, 0, -1, -1, 3, 4, 5, 7, 6, 5, 4, -1, 3, 2, 0, -1];
const BASS = [0, 0, 3, 3, 2, 2, 0, 0];

let musicTimer: number | null = null;

export function startMusic() {
  if (musicTimer !== null) return;
  const c = ac();
  if (!c) return;
  let step = 0;
  const beat = 0.24;
  musicTimer = window.setInterval(() => {
    if (muted) {
      step++;
      return;
    }
    const n = MELODY[step % MELODY.length];
    if (n >= 0) tone("triangle", SCALE[n], SCALE[n], beat * 0.9, 0.05);
    if (step % 4 === 0) {
      const bn = BASS[(step / 4) % BASS.length];
      tone("square", SCALE[bn] / 2, SCALE[bn] / 2, beat * 1.8, 0.025);
    }
    step++;
  }, 240);
}

export function stopMusic() {
  if (musicTimer !== null) window.clearInterval(musicTimer);
  musicTimer = null;
}
