import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { CHARACTERS, MATERIALS, TEMPLATE_FIELDS, TASKS, XP, levelOf, LEVELS, genCode, studTotal, RUBRIC } from '../constants';
import { toast } from './UI';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

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

export const NarasumberKelola: React.FC = () => {
  const { state, updateState } = useAppContext();
  const [paName, setPaName] = useState('');
  const [paGroup, setPaGroup] = useState(state.config.groups[0] || '');
  const [importText, setImportText] = useState('');
  const [newGrpName, setNewGrpName] = useState('');

  const codes = Object.keys(state.participants);

  const addParticipant = async () => {
    if (!paName.trim()) return;
    let code = genCode();
    while (state.participants[code]) code = genCode();
    await updateState(draft => {
      draft.participants[code] = { name: paName.trim(), group: paGroup, scores: {} };
    });
    setPaName('');
    toast("Kode dibuat: " + code);
  };

  const addGroup = async () => {
    if (!newGrpName.trim() || state.config.groups.includes(newGrpName.trim())) return;
    const nm = newGrpName.trim();
    await updateState(draft => {
      draft.config.groups.push(nm);
      draft.groups[nm] = { xp: 0, character: CHARACTERS[draft.config.groups.length % 4], template: {}, reflection: "" };
    });
    setNewGrpName('');
    toast("Kelompok ditambahkan");
  };

  const delParticipant = async (c: string) => {
    await updateState(draft => { delete draft.participants[c]; });
  };

  const delGroup = async (g: string) => {
    if (!window.confirm("Hapus " + g + "?")) return;
    await updateState(draft => {
      draft.config.groups = draft.config.groups.filter(x => x !== g);
      delete draft.groups[g];
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Kelola akses</motion.div>
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">👥 Data peserta</motion.h2>
      
      <motion.h3 variants={itemVariants} className="font-bold text-sm text-[var(--color-ink)] mb-3 mt-6">Tambah satu peserta</motion.h3>
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-6">
        <input value={paName} onChange={e=>setPaName(e.target.value)} placeholder="Nama peserta" className="flex-1 min-w-[130px] px-4 py-2 border border-[var(--color-line)] rounded-lg text-sm bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
        <select value={paGroup} onChange={e=>setPaGroup(e.target.value)} className="px-4 py-2 border border-[var(--color-line)] rounded-lg bg-white/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
          {state.config.groups.map(g => <option key={g}>{g}</option>)}
        </select>
        <button onClick={addParticipant} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 shadow-sm transition-colors">+ Buat kode</button>
      </motion.div>
      
      <hr className="border-t border-[var(--color-line)] my-6" />
      
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Daftar peserta ({codes.length})</motion.div>
      <motion.h3 variants={itemVariants} className="font-bold text-sm text-[var(--color-ink)] mb-3">Kode akses</motion.h3>
      {codes.length > 0 ? state.config.groups.map(g => {
        const mem = Object.entries(state.participants).filter(([_, p]: [string, any]) => p.group === g);
        if (!mem.length) return null;
        return (
          <motion.div variants={itemVariants} key={g} className="my-4">
            <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 mb-2 uppercase tracking-wide">{g}</span>
            {mem.map(([c, p]: [string, any]) => (
              <div key={c} className="flex items-center gap-3 py-2 border-b border-[var(--color-line)] flex-wrap last:border-b-0 hover:bg-white/50 transition-colors">
                <span className="flex-1 min-w-[120px] font-semibold text-sm text-[var(--color-ink)]">{p.name}</span>
                <span onClick={() => { navigator.clipboard.writeText(c); toast("Kode disalin"); }} className="font-mono bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-md tracking-wider cursor-copy hover:bg-amber-100 transition-colors text-xs">{c}</span>
                <button onClick={() => delParticipant(c)} className="bg-white text-red-600 text-xs font-semibold px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors">Hapus</button>
              </div>
            ))}
          </motion.div>
        );
      }) : <motion.p variants={itemVariants} className="text-[var(--color-muted)] text-sm">Belum ada peserta.</motion.p>}
      
      <hr className="border-t border-[var(--color-line)] my-6" />
      
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Kelompok</motion.div>
      <motion.h3 variants={itemVariants} className="font-bold text-sm text-[var(--color-ink)] mb-3">Tambah / hapus kelompok</motion.h3>
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-4">
        <input value={newGrpName} onChange={e=>setNewGrpName(e.target.value)} placeholder="Nama kelompok baru…" className="flex-1 min-w-[140px] px-4 py-2 border border-[var(--color-line)] rounded-lg text-sm bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
        <button onClick={addGroup} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 shadow-sm transition-colors">+ Tambah</button>
      </motion.div>
      <motion.div variants={containerVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-xl overflow-hidden">
        {state.config.groups.map(g => (
          <motion.div variants={itemVariants} key={g} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-line)] flex-wrap last:border-b-0 hover:bg-white/50 transition-colors">
            <span className="flex-1 min-w-[120px] font-semibold text-sm text-[var(--color-ink)]">{g}</span>
            <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700">{state.groups[g].xp} XP</span>
            <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700">{Object.values(state.participants).filter((p: any) => p.group === g).length} peserta</span>
            <button onClick={() => delGroup(g)} className="bg-white text-red-600 text-xs font-semibold px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors ml-2">Hapus</button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export const NarasumberOverview: React.FC = () => {
  const { state, refreshState } = useAppContext();
  const gs = state.config.groups;
  const totXp = gs.reduce((s, g) => s + state.groups[g].xp, 0);
  const nMem = Object.keys(state.participants).length;
  const submitted = gs.filter(g => state.groups[g].template && Object.values(state.groups[g].template).some((v: any) => v && typeof v === 'string' && v.trim())).length;
  const rows = gs.map(g => ({ name: g, ...state.groups[g] })).sort((a,b) => b.xp - a.xp);
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const chartData = rows.map(r => ({ name: r.name, xp: r.xp }));
  const pieData = gs.map(g => ({ name: g, value: Object.values(state.participants).filter((p: any) => p.group === g).length }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <div className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Panel narasumber</div>
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">📊 Ringkasan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
            <b className="block text-3xl text-indigo-700 font-serif mb-1">{gs.length}</b>
            <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Kelompok</span>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
            <b className="block text-3xl text-indigo-700 font-serif mb-1">{nMem}</b>
            <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Peserta</span>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
            <b className="block text-3xl text-indigo-700 font-serif mb-1">{totXp}</b>
            <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Total XP</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="h-[250px] border border-[var(--color-line)] rounded-xl p-4">
            <h3 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2 text-center">Distribusi XP</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="xp" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-[250px] border border-[var(--color-line)] rounded-xl p-4">
            <h3 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2 text-center">Sebaran Peserta</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <p className="text-sm text-[var(--color-muted)]">{submitted}/{gs.length} kelompok sudah mengirim template game.</p>
        <button onClick={refreshState} className="mt-4 px-4 py-2 border border-[var(--color-line)] rounded-md bg-white text-sm font-semibold text-[var(--color-muted)] hover:border-indigo-500 hover:text-indigo-600 transition-colors">🔄 Segarkan</button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">🏆 Klasemen kelompok</h2>
        <div className="border border-[var(--color-line)] rounded-xl overflow-hidden bg-white">
          {rows.map((r, i) => {
            const li = levelOf(r.xp);
            return (
              <motion.div variants={itemVariants} key={r.name} className="flex items-center gap-4 py-3 px-4 border-b border-[var(--color-line)] last:border-b-0 hover:bg-white/50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 font-semibold text-sm text-[var(--color-ink)]">
                  {r.name}
                  <div className="text-xs text-[var(--color-muted)] font-normal mt-0.5">{r.character} · {LEVELS[li].name}</div>
                </div>
                <div className="font-bold text-[var(--color-teal-main)]">{r.xp} XP</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const NarasumberPenilaian: React.FC = () => {
  const { state, updateState } = useAppContext();
  
  const GroupRow: React.FC<{ g: string }> = ({ g }) => {
    const d = state.groups[g];
    const [scores, setScores] = useState<Record<string, number>>(d.scores || {});
    
    const setScore = (k: string, val: number) => {
      setScores(prev => ({ ...prev, [k]: Math.max(0, Math.min(100, val)) }));
    };

    const saveAndAward = async (k: string) => {
      const val = scores[k] || 0;
      await updateState(draft => {
        if (!draft.groups[g].scores) draft.groups[g].scores = {};
        const oldVal = draft.groups[g].scores[k] || 0;
        draft.groups[g].scores[k] = val;
        
        const diff = val - oldVal;
        if (diff !== 0) {
          draft.groups[g].xp += diff;
          if (!draft.groups[g].xpHistory) draft.groups[g].xpHistory = [];
          draft.groups[g].xpHistory!.unshift({ reason: "Nilai " + k, amount: diff, timestamp: Date.now() });
        }
      });
      toast(`Nilai ${k} tersimpan untuk ${g} (${val > 0 ? '+' : ''}${val} XP) ✔`);
    };

    const awardManualXP = async (amt: number, reason: string) => {
      await updateState(draft => {
        draft.groups[g].xp += amt;
        if (!draft.groups[g].xpHistory) draft.groups[g].xpHistory = [];
        draft.groups[g].xpHistory!.unshift({ reason, amount: amt, timestamp: Date.now() });
      });
      toast(`+${amt} XP untuk ${g} ✔`);
    };

    const resetSemua = async () => {
      if (confirm(`Yakin ingin mereset XP dan Nilai untuk kelompok ${g}?`)) {
        await updateState(draft => {
          draft.groups[g].xp = 0;
          draft.groups[g].scores = {};
          if (!draft.groups[g].xpHistory) draft.groups[g].xpHistory = [];
          draft.groups[g].xpHistory!.unshift({ reason: "Reset Manual", amount: 0, timestamp: Date.now() });
        });
        setScores({});
        toast(`Nilai & XP ${g} direset ✔`);
      }
    };

    const setManualXP = async (val: number) => {
      const newXp = Math.max(0, val);
      if (newXp === d.xp) return;
      await updateState(draft => {
        draft.groups[g].xp = newXp;
        if (!draft.groups[g].xpHistory) draft.groups[g].xpHistory = [];
        draft.groups[g].xpHistory!.unshift({ reason: "Edit XP Manual", amount: newXp - d.xp, timestamp: Date.now() });
      });
    };

    return (
      <div className="border border-[var(--color-line)] rounded-xl p-4 mb-3 bg-white/50">
        <div className="flex justify-between items-center gap-2 flex-wrap mb-3">
          <span className="font-semibold text-[var(--color-ink)] text-lg">{g}</span>
          <div className="flex items-center gap-2">
            <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 uppercase tracking-wide">{LEVELS[levelOf(d.xp)].name} · {d.xp} XP</span>
            <button onClick={resetSemua} className="px-2 py-1 bg-white text-red-600 border border-red-200 rounded-md font-semibold text-[10px] hover:bg-red-50 transition-colors shadow-sm uppercase tracking-wider">Reset</button>
          </div>
        </div>
        
        <div className="space-y-3">
          {RUBRIC.map(k => {
            const val = scores[k] || 0;
            const savedVal = d.scores?.[k] || 0;
            const isChanged = val !== savedVal;
            return (
              <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-2 my-1.5 pb-2 border-b border-slate-200/60 last:border-0">
                <span className="text-sm font-medium text-[var(--color-ink)] min-w-[100px] flex-1">{k}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setScore(k, val - 5)} className="w-8 h-8 rounded-md border border-[var(--color-line)] bg-white text-lg font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center">−</button>
                  <input type="number" min="0" max="100" value={val} onChange={e => setScore(k, parseInt(e.target.value)||0)} className="w-16 text-center py-1 border border-[var(--color-line)] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold" />
                  <button onClick={() => setScore(k, val + 5)} className="w-8 h-8 rounded-md border border-[var(--color-line)] bg-white text-lg font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center">+</button>
                </div>
                <button 
                  onClick={() => saveAndAward(k)} 
                  disabled={!isChanged}
                  className={`ml-2 px-3 py-1.5 rounded-md font-semibold text-xs transition-colors shadow-sm ${isChanged ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  Simpan & Beri XP
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-[var(--color-line)]">
          <span className="text-xs font-semibold text-[var(--color-muted)] block mb-2 uppercase tracking-wider">Beri XP Manual Tambahan / Edit Total</span>
          <div className="flex flex-wrap gap-2 items-center mb-3">
            {Object.entries(XP).map(([reason, amt]) => (
              <button key={reason} onClick={() => awardManualXP(amt, reason)} className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-xs hover:bg-emerald-200 transition-colors shadow-sm">
                {reason} (+{amt})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--color-muted)]">Set Total XP:</span>
            <button onClick={() => setManualXP(d.xp - 10)} className="w-8 h-8 rounded-md border border-[var(--color-line)] bg-white text-lg font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center">−</button>
            <input type="number" min="0" value={d.xp} onChange={e => setManualXP(parseInt(e.target.value)||0)} className="w-16 text-center py-1 border border-[var(--color-line)] rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-sm" />
            <button onClick={() => setManualXP(d.xp + 10)} className="w-8 h-8 rounded-md border border-[var(--color-line)] bg-white text-lg font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center">+</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Penilaian & XP</motion.div>
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">📝 Penilaian Kelompok</motion.h2>
      <motion.p variants={itemVariants} className="text-[var(--color-muted)] text-sm mb-6">Beri nilai per sesi (otomatis dikonversi menjadi XP) atau beri XP manual tambahan.</motion.p>
      
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {state.config.groups.map(g => (
          <motion.div variants={itemVariants} key={g}>
            <GroupRow g={g} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export const NarasumberTemplate: React.FC = () => {
  const { state } = useAppContext();
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Hasil & Karya Peserta</motion.div>
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">🎲 Lembar Kerja Kelompok</motion.h2>
      
      <motion.div variants={containerVariants}>
        {state.config.groups.map(g => {
          const t = state.groups[g].template || {};
          const has = Object.values(t).some((v: any) => v && typeof v === 'string' && v.trim());
          const refl = state.groups[g].reflection;
          
          return (
            <motion.div variants={itemVariants} key={g} className="border border-[var(--color-line)] rounded-xl p-5 mb-4 bg-white/50">
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <span className="font-bold text-lg text-[var(--color-ink)]">{g}</span>
                {has ? <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">Terkirim</span> : <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-slate-200 text-slate-500 uppercase tracking-wider">Kosong</span>}
              </div>
              
              {has ? (
                <div className="space-y-4">
                  {TASKS.map(task => {
                    const taskHasAns = task.fields.some(f => t[f] && t[f].trim());
                    if (!taskHasAns) return null;
                    return (
                      <div key={task.id} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-lg p-4 shadow-sm">
                        <h4 className="font-bold text-sm text-indigo-700 mb-2">{task.title}</h4>
                        <div className="space-y-2 text-sm whitespace-pre-wrap text-[var(--color-ink)]">
                          {task.fields.filter(f => t[f] && t[f].trim()).map(f => (
                            <div key={f}><span className="font-semibold text-[var(--color-ink)]">{f}:</span> <span className="text-[var(--color-muted)]">{t[f]}</span></div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <div className="text-sm text-[var(--color-muted)]">Belum ada kiriman.</div>}
              
              {refl && refl.trim() && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-3 text-sm whitespace-pre-wrap text-indigo-900 shadow-sm">
                  <span className="font-semibold">Refleksi:</span> {refl}
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export const NarasumberReaksi: React.FC = () => {
  const { state, refreshState } = useAppContext();
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
      <motion.div variants={itemVariants} className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Umpan balik peserta</motion.div>
      <motion.h2 variants={itemVariants} className="text-xl font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">💬 Reaksi materi</motion.h2>
      <motion.p variants={itemVariants} className="text-[var(--color-muted)] text-sm mb-6">Rekap suka/tidak suka & paham/belum paham per sesi.</motion.p>
      
      <motion.div variants={containerVariants}>
        {MATERIALS.map(m => {
          const r = state.reactions[m.id] || {};
          const vals = Object.values(r) as any[];
          const like = vals.filter(x => x.senti === 'like').length;
          const dislike = vals.filter(x => x.senti === 'dislike').length;
          const paham = vals.filter(x => x.paham === 'paham').length;
          const bingung = vals.filter(x => x.paham === 'bingung').length;
          const chartData = [
            { name: 'Suka', value: like, fill: '#10b981' },
            { name: 'Tidak suka', value: dislike, fill: '#ef4444' },
            { name: 'Paham', value: paham, fill: '#4f46e5' },
            { name: 'Belum paham', value: bingung, fill: '#f59e0b' }
          ].filter(x => x.value > 0);
          
          return (
            <motion.div variants={itemVariants} key={m.id} className="border border-[var(--color-line)] rounded-xl p-5 mb-4 bg-white/50 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="font-bold text-sm text-[var(--color-ink)] mb-3">{m.label}</div>
                <div className="flex gap-3 flex-wrap text-sm text-[var(--color-muted)]">
                  <span className="bg-white px-3 py-1.5 rounded-md border border-[var(--color-line)] shadow-sm">👍 <b className="text-[var(--color-ink)]">{like}</b> suka</span>
                  <span className="bg-white px-3 py-1.5 rounded-md border border-[var(--color-line)] shadow-sm">👎 <b className="text-[var(--color-ink)]">{dislike}</b> tidak suka</span>
                  <span className="bg-white px-3 py-1.5 rounded-md border border-[var(--color-line)] shadow-sm">💡 <b className="text-[var(--color-ink)]">{paham}</b> paham</span>
                  <span className="bg-white px-3 py-1.5 rounded-md border border-[var(--color-line)] shadow-sm">❓ <b className="text-[var(--color-ink)]">{bingung}</b> belum paham</span>
                </div>
              </div>
              {chartData.length > 0 && (
                <div className="w-full md:w-[200px] h-[120px] bg-white rounded-lg border border-[var(--color-line)] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ fontSize: '11px', borderRadius: '4px', border: 'none', boxShadow: '0 2px 4px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
      <motion.button variants={itemVariants} onClick={refreshState} className="mt-4 px-4 py-2 border border-[var(--color-line)] rounded-md bg-white text-sm font-semibold text-[var(--color-muted)] hover:border-[var(--color-plum-main)] hover:text-[var(--color-plum-main)] transition-colors shadow-sm">🔄 Segarkan</motion.button>
    </motion.div>
  );
};
