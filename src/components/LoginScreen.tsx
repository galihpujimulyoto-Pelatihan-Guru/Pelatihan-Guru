import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';
import { NS_USER, NS_PASS } from '../constants';

export const LoginScreen: React.FC = () => {
  const { state, setUser, refreshState, updateState } = useAppContext();
  const [role, setRole] = useState<'peserta' | 'narasumber'>('peserta');
  const [pesertaMode, setPesertaMode] = useState<'login' | 'register'>('login');
  
  const [participantName, setParticipantName] = useState('');
  const [participantCode, setParticipantCode] = useState('');
  const [participantGroup, setParticipantGroup] = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const [user, setUserName] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    await refreshState();
    
    if (role === 'narasumber') {
      if (user.trim() !== NS_USER || pass !== NS_PASS) {
        setError('Username atau password salah.');
        setLoading(false);
        return;
      }
      setUser({ role: 'narasumber', name: 'Narasumber' });
    } else {
      const name = participantName.trim().toUpperCase();
      const code = participantCode.trim().toUpperCase();
      
      if (!name || !code) {
        setError('Mohon isi nama dan kode akses.');
        setLoading(false);
        return;
      }
      
      if (code !== 'STEAM2026') {
        setError('Kode akses salah.');
        setLoading(false);
        return;
      }
      
      const pId = Object.keys(state.participants).find(
        k => state.participants[k].name === name
      );
      
      if (!pId) {
        setError('Akun tidak ditemukan. Pastikan nama lengkap sudah benar atau buat akun baru.');
        setLoading(false);
        return;
      }
      
      const p = state.participants[pId];
      setUser({ role: 'peserta', name: p.name, group: p.group, code: pId });
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    await refreshState();

    const name = participantName.trim().toUpperCase();
    const group = participantGroup;

    if (!name || !group) {
      setError('Mohon isi nama lengkap dan pilih kelompok.');
      setLoading(false);
      return;
    }

    if (!nameConfirmed) {
      setError('Mohon centang konfirmasi nama sudah benar.');
      setLoading(false);
      return;
    }

    // Check if name already exists in that group
    const existingPcode = Object.keys(state.participants).find(
      k => state.participants[k].name === name
    );

    if (existingPcode) {
      setError('Nama ini sudah terdaftar. Silakan gunakan tab "Masuk" dengan kode akses STEAM2026.');
      setLoading(false);
      return;
    }

    const pcode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await updateState(draft => {
      draft.participants[pcode] = { name, group, scores: {} };
    });

    setUser({ role: 'peserta', name, group, code: pcode });
    setLoading(false);
  };

  const continueAfterRegister = () => {
    const name = participantName.trim().toUpperCase();
    setUser({ role: 'peserta', name, group: participantGroup, code: generatedCode });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden"
    >
      {/* Animated Elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute top-[15%] left-[15%] text-white/20"
      >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </motion.div>
      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          x: [0, -30, 0],
          rotate: [0, -90, 0]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-[25%] right-[15%] text-white/20"
      >
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 22 22 22" />
        </svg>
      </motion.div>
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.4, 0.1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-[40%] right-[25%] w-32 h-32 border border-white/20 rounded-full"
      />

      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-2xl p-8 border border-white/40 shadow-2xl relative z-10 overflow-hidden">
        
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-plum-main)] to-purple-600 flex items-center justify-center text-white text-2xl mb-6 shadow-md shadow-purple-500/30">
          🎮
        </div>
        <div className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Pelatihan Guru MI</div>
        <h1 className="text-2xl font-bold mb-2 text-[var(--color-ink)]">Guru Level Up</h1>
        <p className="text-[var(--color-muted)] text-sm mb-6">Menjadi Guru Gen Alfa — Gamifikasi berkolaborasi STEAM.</p>

        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setRole('peserta')}
            className={`flex-1 p-2 border rounded-md font-medium text-sm transition-colors ${role === 'peserta' ? 'bg-[var(--color-plum-soft)] text-[var(--color-plum-2)] border-[var(--color-plum-soft)]' : 'bg-white text-[var(--color-muted)] border-[var(--color-line)] hover:bg-[var(--color-paper)]'}`}
          >
            👩‍🏫 Peserta
          </button>
          <button 
            onClick={() => setRole('narasumber')}
            className={`flex-1 p-2 border rounded-md font-medium text-sm transition-colors ${role === 'narasumber' ? 'bg-[var(--color-plum-soft)] text-[var(--color-plum-2)] border-[var(--color-plum-soft)]' : 'bg-white text-[var(--color-muted)] border-[var(--color-line)] hover:bg-[var(--color-paper)]'}`}
          >
            🎤 Narasumber
          </button>
        </div>

        {role === 'peserta' ? (
            <div>
              {pesertaMode === 'register' && (
                <h2 className="text-lg font-bold mb-6 text-[var(--color-ink)] text-center tracking-wide">
                  BUAT AKUN BARU
                </h2>
              )}

              {pesertaMode === 'login' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">NAMA LENGKAP</label>
                    <input 
                      value={participantName} onChange={e => setParticipantName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm uppercase font-semibold italic placeholder:italic placeholder:normal-case placeholder:font-normal"
                      placeholder="Nama Lengkap" autoComplete="off" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">KODE AKSES</label>
                    <input 
                      value={participantCode} onChange={e => setParticipantCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm uppercase font-semibold tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
                      placeholder="Masukan Kode Akses Pelatihan" autoComplete="off" />
                  </div>
                  <button 
                    onClick={handleLogin} disabled={loading}
                    className="w-full py-3 bg-[var(--color-plum-main)] text-white rounded-md font-bold text-sm shadow-sm hover:bg-[var(--color-plum-2)] transition-colors disabled:opacity-60 uppercase tracking-widest"
                  >
                    {loading ? 'Memuat...' : 'Masuk'}
                  </button>

                  <div className="mt-6 text-center text-sm text-[var(--color-muted)] pt-4 border-t border-[var(--color-line)]">
                    <span className="italic">Apabila Anda belum memiliki AKUN,</span> <br/>
                    <button onClick={() => { setPesertaMode('register'); setError(''); }} className="mt-2 text-[var(--color-plum-main)] font-bold hover:underline uppercase tracking-wide">BUAT AKUN BARU</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">NAMA LENGKAP</label>
                    <input 
                      value={participantName} onChange={e => setParticipantName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm uppercase font-semibold italic placeholder:italic placeholder:normal-case placeholder:font-normal"
                      placeholder="Nama Lengkap" autoComplete="off" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">KELOMPOK</label>
                    <select 
                      value={participantGroup} onChange={e => setParticipantGroup(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm appearance-none font-medium"
                    >
                      <option value="" disabled>Pilih kelompok Anda</option>
                      {state.config.groups.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-6 flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      id="confirm-name" 
                      checked={nameConfirmed} 
                      onChange={e => setNameConfirmed(e.target.checked)}
                      className="mt-1 shrink-0"
                    />
                    <label htmlFor="confirm-name" className="text-xs text-[var(--color-muted)] leading-relaxed font-medium">
                      Saya memastikan bahwa nama lengkap di atas sudah benar. (Nama yang salah tidak akan bisa diubah nantinya)
                    </label>
                  </div>
                  <button 
                    onClick={handleRegister} disabled={loading}
                    className="w-full py-3 bg-[var(--color-plum-main)] text-white rounded-md font-bold text-sm shadow-sm hover:bg-[var(--color-plum-2)] transition-colors disabled:opacity-60 uppercase tracking-widest"
                  >
                    {loading ? 'Membuat Akun...' : 'Daftar & Masuk'}
                  </button>

                  <div className="mt-6 text-center text-sm text-[var(--color-muted)] pt-4 border-t border-[var(--color-line)]">
                    Sudah memiliki AKUN? Silahkan <br/>
                    <button onClick={() => { setPesertaMode('login'); setError(''); }} className="mt-2 text-[var(--color-plum-main)] font-bold hover:underline uppercase tracking-wide">MASUK DISINI</button>
                  </div>
                </>
              )}
            </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Username</label>
              <input value={user} onChange={e => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm"
                placeholder="username narasumber" autoComplete="off" />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm"
                placeholder="••••••" autoComplete="off" />
            </div>
            <button 
              onClick={handleLogin} disabled={loading}
              className="w-full py-2.5 bg-[var(--color-plum-main)] text-white rounded-md font-medium text-sm shadow-sm hover:bg-[var(--color-plum-2)] transition-colors disabled:opacity-60"
            >
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </div>
        )}
        
        <div className="text-[var(--color-coral-main)] text-xs mt-3 min-h-[16px] font-medium text-center">{error}</div>
      </div>
    </div>
  );
};
