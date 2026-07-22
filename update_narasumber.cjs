const fs = require('fs');
let code = fs.readFileSync('src/components/NarasumberViews.tsx', 'utf8');

// We need to replace export const NarasumberSkor ... and export const NarasumberNilai ...
// with export const NarasumberPenilaian ...

const skorStart = code.indexOf('export const NarasumberSkor: React.FC = () => {');
const templateStart = code.indexOf('export const NarasumberTemplate: React.FC = () => {');

const newComponent = `export const NarasumberPenilaian: React.FC = () => {
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
      toast(\`Nilai \${k} tersimpan untuk \${g} (\${val > 0 ? '+' : ''}\${val} XP) ✔\`);
    };

    const awardManualXP = async (amt: number, reason: string) => {
      await updateState(draft => {
        draft.groups[g].xp += amt;
        if (!draft.groups[g].xpHistory) draft.groups[g].xpHistory = [];
        draft.groups[g].xpHistory!.unshift({ reason, amount: amt, timestamp: Date.now() });
      });
      toast(\`+\${amt} XP untuk \${g} ✔\`);
    };

    return (
      <div className="border border-[var(--color-line)] rounded-xl p-4 mb-3 bg-slate-50">
        <div className="flex justify-between items-center gap-2 flex-wrap mb-3">
          <span className="font-semibold text-[var(--color-ink)] text-lg">{g}</span>
          <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 uppercase tracking-wide">{LEVELS[levelOf(d.xp)].name} · {d.xp} XP</span>
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
                  className={\`ml-2 px-3 py-1.5 rounded-md font-semibold text-xs transition-colors shadow-sm \${isChanged ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}\`}
                >
                  Simpan & Beri XP
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-[var(--color-line)]">
          <span className="text-xs font-semibold text-[var(--color-muted)] block mb-2 uppercase tracking-wider">Beri XP Manual Tambahan</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(XP).map(([reason, amt]) => (
              <button key={reason} onClick={() => awardManualXP(amt, reason)} className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-xs hover:bg-emerald-200 transition-colors shadow-sm">
                {reason} (+{amt})
              </button>
            ))}
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

`;

code = code.substring(0, skorStart) + newComponent + code.substring(templateStart);

fs.writeFileSync('src/components/NarasumberViews.tsx', code);
