import React, { useState } from 'react';
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
      
      const p = state.participants[code];
      if (!p) {
        setError('Kode akses tidak valid atau belum terdaftar.');
        setLoading(false);
        return;
      }
      
      if (p.name !== name) {
        setError('Nama tidak cocok dengan kode akses ini. Pastikan nama lengkap sudah benar.');
        setLoading(false);
        return;
      }
      
      setUser({ role: 'peserta', name: p.name, group: p.group, code: code });
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
      setError('Nama ini sudah terdaftar. Silakan gunakan tab "Masuk" dengan kode akses Anda.');
      setLoading(false);
      return;
    }

    const pcode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await updateState(draft => {
      draft.participants[pcode] = { name, group, scores: {} };
    });

    setGeneratedCode(pcode);
    setParticipantCode(pcode);
    setLoading(false);
  };

  const continueAfterRegister = () => {
    const name = participantName.trim().toUpperCase();
    setUser({ role: 'peserta', name, group: participantGroup, code: generatedCode });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-paper)]">
      <div className="bg-[var(--color-card)] w-full max-w-md rounded-2xl p-8 border border-[var(--color-line)] shadow-sm relative z-10 overflow-hidden">
        
        <div className="w-12 h-12 rounded-lg bg-[var(--color-plum-main)] flex items-center justify-center text-white text-2xl mb-6 shadow-sm">
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
          generatedCode ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-4 text-center">
              <h3 className="text-emerald-800 font-bold mb-2">Pendaftaran Berhasil!</h3>
              <p className="text-emerald-700 text-sm mb-4">Harap simpan kode akses ini untuk login di kemudian hari:</p>
              <div className="text-3xl font-mono font-bold text-emerald-900 bg-emerald-100 py-3 rounded-md mb-6 tracking-widest">
                {generatedCode}
              </div>
              <button 
                onClick={continueAfterRegister}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-md font-medium text-sm shadow-sm hover:bg-emerald-700 transition-colors"
              >
                Mulai Bermain
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2 mb-6 border-b border-[var(--color-line)]">
                <button 
                  onClick={() => { setPesertaMode('login'); setError(''); }}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${pesertaMode === 'login' ? 'border-[var(--color-plum-main)] text-[var(--color-plum-main)]' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'}`}
                >
                  Sudah Punya Kode
                </button>
                <button 
                  onClick={() => { setPesertaMode('register'); setError(''); }}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${pesertaMode === 'register' ? 'border-[var(--color-plum-main)] text-[var(--color-plum-main)]' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'}`}
                >
                  Daftar Baru
                </button>
              </div>

              {pesertaMode === 'login' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Nama Lengkap</label>
                    <input 
                      value={participantName} onChange={e => setParticipantName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm uppercase"
                      placeholder="NAMA LENGKAP" autoComplete="off" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Kode Akses</label>
                    <input 
                      value={participantCode} onChange={e => setParticipantCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm uppercase"
                      placeholder="Misal: ABCD12" autoComplete="off" />
                  </div>
                  <button 
                    onClick={handleLogin} disabled={loading}
                    className="w-full py-2.5 bg-[var(--color-plum-main)] text-white rounded-md font-medium text-sm shadow-sm hover:bg-[var(--color-plum-2)] transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Memuat...' : 'Masuk'}
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Nama Lengkap</label>
                    <input 
                      value={participantName} onChange={e => setParticipantName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm uppercase"
                      placeholder="NAMA LENGKAP SESUAI ABSENSI" autoComplete="off" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[var(--color-muted)] mb-1 uppercase tracking-wider">Kelompok</label>
                    <select 
                      value={participantGroup} onChange={e => setParticipantGroup(e.target.value)}
                      className="w-full px-4 py-2 border border-[var(--color-line)] rounded-md bg-[var(--color-paper)] focus:outline-none focus:ring-2 focus:ring-[var(--color-plum-main)] focus:bg-white transition-all text-sm appearance-none"
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
                    <label htmlFor="confirm-name" className="text-xs text-[var(--color-muted)] leading-relaxed">
                      Saya memastikan bahwa nama lengkap di atas sudah benar. (Nama yang salah tidak akan bisa diubah nantinya)
                    </label>
                  </div>
                  <button 
                    onClick={handleRegister} disabled={loading}
                    className="w-full py-2.5 bg-[var(--color-plum-main)] text-white rounded-md font-medium text-sm shadow-sm hover:bg-[var(--color-plum-2)] transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Membuat Akun...' : 'Daftar & Dapatkan Kode'}
                  </button>
                </>
              )}
            </div>
          )
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
