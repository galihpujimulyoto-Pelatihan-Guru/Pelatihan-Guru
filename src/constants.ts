export const NS_USER = "galihpujiiota";
export const NS_PASS = "220388";

export const CHARACTERS = [
  "🧙‍♀️ Guru Kreatif",
  "🦸‍♀️ Guru Inspiratif",
  "🧠 Guru Problem Solver",
  "🎯 Guru Digital"
];

export const XP: Record<string, number> = {
  Bertanya: 20,
  Menjawab: 15,
  Presentasi: 50,
  "Kerja Sama": 30
};

export const LEVELS = [
  { min: 0, name: "New Teacher" },
  { min: 100, name: "Creative Teacher" },
  { min: 250, name: "Master Teacher" },
  { min: 450, name: "Alpha Teacher" }
];

export const BADGES = [
  { id: "alpha", ic: "🏆", n: "Alpha Teacher", s: "Level 4" },
  { id: "creative", ic: "🎨", n: "Creative Teacher", s: "Level 2" },
  { id: "steam", ic: "🔭", n: "STEAM Designer", s: "Kirim template" },
  { id: "gami", ic: "🎮", n: "Gamification Master", s: "200+ XP" }
];

export const TASKS = [
  { id: 't1', title: 'Sesi 1 · Siapa Mereka?', desc: 'Diskusikan kebiasaan, cara belajar, tantangan, dan harapan.', fields: ['Hasil Diskusi'] },
  { id: 't2', title: 'Sesi 2 · Escape Mission', desc: 'Apa strategi memecahkan Kotak Misteri?', fields: ['Strategi & Pelajaran'] },
  { id: 't3', title: 'Sesi 3 · Mission Impossible', desc: 'Buat miniatur solusi banjir di sekolah.', fields: ['Ide Solusi'] },
  { id: 't4', title: 'Sesi 4 · Template Game', desc: 'Rancang game pembelajaran.', fields: ["Nama Game", "Tema", "Cerita", "Misi", "Level", "Boss Challenge", "Reward"] },
];

export const TEMPLATE_FIELDS = TASKS.flatMap(t => t.fields);

export const RUBRIC = [
  "Sesi 1",
  "Sesi 2",
  "Sesi 3",
  "Sesi 4"
];

export const MATERIALS = [
  { id: "m1", label: "Sesi 1 · Mengenal Gen Alpha" },
  { id: "m2", label: "Sesi 2 · Gamifikasi" },
  { id: "m3", label: "Sesi 3 · STEAM" },
  { id: "m4", label: "Sesi 4 · Praktik & Microteaching" }
];

export function levelOf(xp: number): number {
  let i = 0;
  LEVELS.forEach((l, k) => { if (xp >= l.min) i = k; });
  return i;
}

export function nextLevel(xp: number): { min: number, name: string } | null {
  const i = levelOf(xp);
  return i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}

export function studTotal(scores?: Record<string, number>): number {
  if (!scores) return 0;
  return RUBRIC.reduce((s, k) => s + ((Number(scores[k]) || 0) ), 0);
}

export function genCode(): string {
  const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 5; i++) c += a[Math.floor(Math.random() * a.length)];
  return c;
}
