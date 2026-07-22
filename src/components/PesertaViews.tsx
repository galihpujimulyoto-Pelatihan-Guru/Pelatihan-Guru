import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { MATERIALS, TASKS, levelOf, nextLevel, LEVELS, BADGES, studTotal, RUBRIC } from '../constants';
import { toast } from './UI';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const PesertaBeranda: React.FC = () => {
  const { state, user } = useAppContext();
  const g = state.groups[user!.group!];
  if (!g) return <div className="bg-[var(--color-card)] border border-[var(--color-line)] rounded-[18px] p-5">Kelompokmu tidak ditemukan. Hubungi narasumber.</div>;
  
  const li = levelOf(g.xp);
  const lvl = LEVELS[li];
  const nx = nextLevel(g.xp);
  const pct = nx ? Math.min(100, Math.round(((g.xp - lvl.min)/(nx.min - lvl.min)) * 100)) : 100;
  const me = state.participants[user!.code!] || { scores: {} };
  const myTot = studTotal(me.scores);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={itemVariants} className="bg-indigo-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-[150px] h-[150px] bg-white/10 rounded-full animate-[floaty_6s_ease-in-out_infinite]" />
        <div className="text-xs opacity-85 tracking-widest uppercase relative font-bold mb-1">Level {li + 1}</div>
        <div className="text-3xl font-bold mb-1 relative">{lvl.name}</div>
        <div className="text-sm opacity-90 mb-4 relative">{g.character} · {user!.group}</div>
        <div className="h-2 bg-indigo-900/50 rounded-full overflow-hidden relative">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-emerald-400 rounded-full" />
        </div>
        <div className="flex justify-between text-xs mt-3 opacity-90 relative font-medium">
          <span>{g.xp} XP kelompok</span>
          <span>{nx ? `${nx.min} XP → ${nx.name}` : "Level maksimal 🎉"}</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-4 text-sm font-medium">
        ℹ️ XP & nilai hanya diberikan narasumber. Nilai individumu saat ini: <b className="text-emerald-900">{myTot}</b>. Tugasmu: kerjakan game, beri reaksi materi, pelajari modul.
      </motion.div>
    </motion.div>
  );
};

export const PesertaReaksi: React.FC = () => {
  const { state, updateState, user } = useAppContext();
  
  const toggleReaksi = async (mid: string, key: 'senti' | 'paham', val: string) => {
    await updateState(draft => {
      if (!draft.reactions[mid]) draft.reactions[mid] = {};
      if (!draft.reactions[mid][user!.code!]) draft.reactions[mid][user!.code!] = {};
      const cur = draft.reactions[mid][user!.code!];
      cur[key] = cur[key] === val ? undefined : val;
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Umpan balik peserta</motion.div>
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">💬 Reaksi materi</motion.h2>
      <motion.p variants={itemVariants} className="text-[var(--color-muted)] text-sm mb-6">Beri tahu narasumber pendapatmu tiap sesi. Bisa diubah kapan saja.</motion.p>
      
      {MATERIALS.map((m, idx) => {
        const r = (state.reactions[m.id] || {})[user!.code!] || {};
        return (
          <motion.div variants={itemVariants} key={m.id} className="border-t border-dashed border-[var(--color-line)] mt-4 pt-4">
            <div className="text-xs text-[var(--color-muted)] font-bold mb-2 uppercase tracking-wide">{m.label}</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => toggleReaksi(m.id, 'senti', 'like')} className={`flex items-center gap-1.5 px-4 py-2 border rounded-full font-semibold text-xs transition-colors ${r.senti === 'like' ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'bg-white text-[var(--color-muted)] border-[var(--color-line)] hover:bg-slate-50'}`}>👍 Suka</button>
              <button onClick={() => toggleReaksi(m.id, 'senti', 'dislike')} className={`flex items-center gap-1.5 px-4 py-2 border rounded-full font-semibold text-xs transition-colors ${r.senti === 'dislike' ? 'border-red-500 text-red-700 bg-red-50' : 'bg-white text-[var(--color-muted)] border-[var(--color-line)] hover:bg-slate-50'}`}>👎 Tidak suka</button>
              <button onClick={() => toggleReaksi(m.id, 'paham', 'paham')} className={`flex items-center gap-1.5 px-4 py-2 border rounded-full font-semibold text-xs transition-colors ${r.paham === 'paham' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'bg-white text-[var(--color-muted)] border-[var(--color-line)] hover:bg-slate-50'}`}>💡 Paham</button>
              <button onClick={() => toggleReaksi(m.id, 'paham', 'bingung')} className={`flex items-center gap-1.5 px-4 py-2 border rounded-full font-semibold text-xs transition-colors ${r.paham === 'bingung' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'bg-white text-[var(--color-muted)] border-[var(--color-line)] hover:bg-slate-50'}`}>❓ Belum paham</button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export const PesertaGame: React.FC = () => {
  const { state, updateState, user } = useAppContext();
  const g = state.groups[user!.group!];
  const [tmpl, setTmpl] = useState(g?.template || {});
  const [refl, setRefl] = useState(g?.reflection || "");
  
  if (!g) return null;

  const saveTmpl = async () => {
    await updateState(draft => { draft.groups[user!.group!].template = tmpl; });
    toast("Template terkirim ✔");
  };

  const saveRefl = async () => {
    await updateState(draft => { draft.groups[user!.group!].reflection = refl; });
    toast("Refleksi tertempel ✔");
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Tugas & Karya Kelompok</motion.div>
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">✍️ Lembar Kerja Kelompok {user!.group}</motion.h2>
      <motion.p variants={itemVariants} className="text-[var(--color-muted)] text-sm mb-6">Kerjakan bersama kelompokmu. Semua jawaban akan langsung diterima oleh narasumber.</motion.p>
      
      <div className="space-y-8">
        {TASKS.map((task) => (
          <motion.div variants={itemVariants} key={task.id} className="border border-[var(--color-line)] rounded-xl p-5 bg-slate-50">
            <h3 className="font-bold text-lg text-indigo-700 mb-1">{task.title}</h3>
            <p className="text-sm text-[var(--color-muted)] mb-4">{task.desc}</p>
            {task.fields.map(f => (
              <div key={f} className="mb-4 last:mb-0">
                <label className="block font-bold text-sm mb-1.5 text-[var(--color-ink)]">{f}</label>
                <textarea 
                  value={tmpl[f] || ""}
                  onChange={e => setTmpl({...tmpl, [f]: e.target.value})}
                  className="w-full p-3 border border-[var(--color-line)] rounded-lg bg-white resize-y focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-colors text-sm shadow-sm"
                  style={{ minHeight: (f === 'Cerita' || f === 'Misi' || f === 'Ide Solusi' || f === 'Strategi & Pelajaran' || f === 'Hasil Diskusi') ? '100px' : '60px' }}
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="mt-6 flex justify-end">
        <motion.button onClick={saveTmpl} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">💾 Kirim Semua Tugas</motion.button>
      </motion.div>
      
      <motion.h3 variants={itemVariants} className="font-bold text-lg text-[var(--color-ink)] mt-10 mb-2">📝 Reflection wall</motion.h3>
      <motion.p variants={itemVariants} className="text-[var(--color-muted)] text-sm mb-3">"Saya akan mengubah…"</motion.p>
      <motion.textarea 
        variants={itemVariants}
        value={refl} onChange={e => setRefl(e.target.value)} placeholder="Tulis refleksimu…"
        className="w-full p-3 min-h-[100px] border border-[var(--color-line)] rounded-xl bg-slate-50 resize-y focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-colors mb-4 text-sm"
      />
      <motion.button variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveRefl} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-sm transition-colors">Tempel di papan</motion.button>
    </motion.div>
  );
};

const ParticleBurst: React.FC = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / 30;
    const distance = 60 + Math.random() * 60;
    const tx = `${Math.cos(angle) * distance}px`;
    const ty = `${Math.sin(angle) * distance}px`;
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 8;
    return { tx, ty, color, size, id: i };
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-50">
      <style>{`
        @keyframes particle-burst-anim {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        .particle-anim {
          animation: particle-burst-anim 1s cubic-bezier(0, 1, 0.2, 1) forwards;
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full particle-anim shadow-sm"
          style={{
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            '--tx': p.tx,
            '--ty': p.ty
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export const PesertaPapan: React.FC = () => {
  const { state, user, refreshState } = useAppContext();
  const rows = state.config.groups.map(g => ({ name: g, ...state.groups[g] })).sort((a,b) => b.xp - a.xp);

  const prevXpRef = React.useRef<Record<string, number>>({});
  const prevLevelRef = React.useRef<Record<string, number>>({});
  const [bursts, setBursts] = React.useState<Record<string, number>>({});
  const [levelUpData, setLevelUpData] = React.useState<{group: string, level: string, id: number} | null>(null);

  React.useEffect(() => {
    let changed = false;
    const newBursts = { ...bursts };
    rows.forEach(r => {
      const old = prevXpRef.current[r.name] || 0;
      if (r.xp > old) {
        if (Math.floor(r.xp / 500) > Math.floor(old / 500)) {
          newBursts[r.name] = Date.now();
          changed = true;
        }
      }
      prevXpRef.current[r.name] = r.xp;

      const currentLvlIdx = levelOf(r.xp);
      const oldLvlIdx = prevLevelRef.current[r.name] !== undefined ? prevLevelRef.current[r.name] : currentLvlIdx;
      
      if (currentLvlIdx > oldLvlIdx) {
        setLevelUpData({ group: r.name, level: LEVELS[currentLvlIdx].label, id: Date.now() });
      }
      prevLevelRef.current[r.name] = currentLvlIdx;
    });
    if (changed) {
      setBursts(newBursts);
    }
  }, [rows]);

  // Auto-dismiss level up overlay
  React.useEffect(() => {
    if (levelUpData) {
      const t = setTimeout(() => setLevelUpData(null), 4000);
      return () => clearTimeout(t);
    }
  }, [levelUpData]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white border border-[var(--color-line)] rounded-2xl p-6 shadow-sm relative overflow-hidden">
      
      <AnimatePresence>
        {levelUpData && (
          <motion.div 
            key={levelUpData.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(4px)' }}
            transition={{ type: "spring", damping: 15 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <ParticleBurst />
            <motion.div 
              initial={{ rotate: -10, scale: 0 }} 
              animate={{ rotate: 0, scale: 1 }} 
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h3 className="text-3xl font-extrabold text-[var(--color-ink)] mb-2 text-center px-4">
              {levelUpData.group} <br/> Level Up!
            </h3>
            <div className="px-6 py-2 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full text-amber-900 font-bold tracking-wider uppercase shadow-lg border border-amber-300">
              {levelUpData.level}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Kompetisi antar kelompok</motion.div>
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-[var(--color-ink)] mb-1 flex items-center gap-2">🏆 Papan skor</motion.h2>
      
      <div className="mt-6 space-y-6">
        <AnimatePresence>
          {rows.map((r, i) => {
            const li = levelOf(r.xp);
            const nextLvl = nextLevel(r.xp);
            const isMe = r.name === user?.group;
            
            let progressPercent = 100;
            let progressText = "Max Level!";
            if (nextLvl) {
              const currentMin = LEVELS[li].min;
              const targetMin = nextLvl.min;
              const range = targetMin - currentMin;
              const currentProgress = Math.max(0, r.xp - currentMin);
              progressPercent = Math.min(100, (currentProgress / range) * 100);
              progressText = `${r.xp} / ${targetMin} XP`;
            }

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                key={r.name} 
                className={`p-4 rounded-xl border relative ${isMe ? 'border-indigo-200 bg-indigo-50/30' : 'border-[var(--color-line)] bg-slate-50/50'}`}
              >
              {bursts[r.name] && <ParticleBurst key={bursts[r.name]} />}
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700 shadow-sm' : i === 1 ? 'bg-slate-200 text-slate-700' : i === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-500'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[var(--color-ink)] text-base truncate">{r.name}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${li >= 3 ? 'bg-amber-100 text-amber-800' : li >= 2 ? 'bg-purple-100 text-purple-800' : li >= 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                      {LEVELS[li].name}
                    </span>
                    {isMe && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide border border-indigo-200">Tim Kamu</span>}
                  </div>
                  <div className="text-xs text-[var(--color-muted)] font-medium mt-1">{r.character}</div>
                </div>
                <div className="text-right shrink-0">
                  <motion.div 
                    key={r.xp}
                    initial={{ scale: 1.3, color: '#10b981' }}
                    animate={{ scale: 1, color: 'var(--color-teal-main)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="font-bold text-lg"
                  >
                    {r.xp} <span className="text-xs text-[var(--color-muted)] font-medium" style={{ color: 'var(--color-muted)' }}>XP</span>
                  </motion.div>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex justify-between text-[10px] font-bold text-[var(--color-muted)] mb-1 uppercase tracking-wider">
                  <span>Progress Level</span>
                  <span>{progressText}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${i === 0 ? 'bg-amber-400' : isMe ? 'bg-indigo-500' : 'bg-emerald-500'}`}
                  />
                </div>
                {nextLvl && (
                  <div className="text-[10px] text-[var(--color-muted)] text-right mt-1 font-medium">
                    Menuju <span className="text-slate-600 font-bold">{nextLvl.name}</span>
                  </div>
                )}
              </div>

              {r.xpHistory && r.xpHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--color-line)]">
                  <h4 className="text-xs font-bold text-[var(--color-ink)] mb-2 flex items-center gap-1">⏱️ Riwayat XP</h4>
                  <div className="space-y-1.5">
                    {r.xpHistory.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="text-[var(--color-muted)] truncate mr-2">{log.reason}</span>
                        <span className={`font-bold shrink-0 ${log.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {log.amount > 0 ? '+' : ''}{log.amount} XP
                        </span>
                      </div>
                    ))}
                  </div>
                  {r.xpHistory.length > 5 && <div className="text-[10px] text-center text-slate-400 mt-2 italic">Menampilkan 5 riwayat terbaru...</div>}
                </div>
              )}
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
      <motion.button variants={itemVariants} onClick={refreshState} className="mt-6 px-4 py-2 border border-[var(--color-line)] rounded-md bg-white text-sm font-semibold text-[var(--color-muted)] hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm">🔄 Segarkan Papan Skor</motion.button>
    </motion.div>
  );
};

export const PesertaLencana: React.FC = () => {
  const { state, user } = useAppContext();
  const g = state.groups[user!.group!];
  if (!g) return null;
  const li = levelOf(g.xp);
  const earned = {
    alpha: li >= 3,
    creative: li >= 1,
    steam: !!(g.template && Object.values(g.template).some((v: any) => v && typeof v === 'string' && v.trim())),
    gami: g.xp >= 200
  };
  const me = state.groups[user!.group!] || { scores: {} };
  const tot = studTotal(me.scores);
  const scored = RUBRIC.some(k => me.scores?.[k] !== undefined && me.scores?.[k] !== null);
  const chartData = RUBRIC.map(k => ({ subject: k, A: me.scores?.[k] || 0, fullMark: 100 }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Graduation</motion.div>
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-[var(--color-ink)] mb-1 flex items-center gap-2">🏅 Lencana kelompok</motion.h2>
      <motion.p variants={itemVariants} className="text-[var(--color-muted)] text-sm mb-4">{user!.group}</motion.p>
      
      <motion.div variants={containerVariants} className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 mt-4">
        {BADGES.map(b => (
          <motion.div variants={itemVariants} key={b.id} className={`bg-white border border-[var(--color-line)] rounded-xl p-4 text-center transition-all duration-300 ${earned[b.id as keyof typeof earned] ? 'opacity-100 border-[var(--color-gold-main)] bg-[var(--color-gold-soft)] shadow-sm' : 'opacity-40'}`}>
            <span className="text-3xl block">{b.ic}</span>
            <span className="font-bold text-sm mt-2 block">{b.n}</span>
            <span className="text-[10px] text-[var(--color-muted)] block mt-0.5">{b.s}</span>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.h3 variants={itemVariants} className="font-bold text-lg text-[var(--color-ink)] mt-8 mb-3">📋 Nilai Kelompok — {user!.group}</motion.h3>
      {scored ? (
        <motion.div variants={itemVariants} className="border border-[var(--color-line)] rounded-lg overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Skor" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 p-4 border-t md:border-t-0 md:border-l border-[var(--color-line)]">
            <table className="w-full border-collapse text-sm text-[var(--color-ink)]">
              <tbody>
                {RUBRIC.map((k, i) => (
                  <tr key={k} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-2 border-b border-[var(--color-line)]">{k}</td>
                    <td className="px-4 py-2 border-b border-[var(--color-line)] text-right font-bold">{me.scores[k] ?? '–'}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50">
                  <td className="px-4 py-3 font-bold">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-600 text-base">{tot}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.p variants={itemVariants} className="text-[var(--color-muted)] text-sm">Nilai belum diberikan narasumber.</motion.p>
      )}
      
      <motion.blockquote variants={itemVariants} className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg p-5 font-serif italic text-sm text-indigo-900 mt-6 shadow-sm">
        "Generasi Alpha tidak membutuhkan guru yang tahu segalanya, tetapi guru yang mampu merancang pengalaman belajar yang membuat mereka penasaran, berani mencoba, mampu bekerja sama, dan mencintai proses belajar."
      </motion.blockquote>
    </motion.div>
  );
};
