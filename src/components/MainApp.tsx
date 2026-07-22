import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';
import { PTabs, NTabs } from './Tabs';
import { PesertaBeranda, PesertaReaksi, PesertaGame, PesertaPapan, PesertaLencana } from './PesertaViews';
import { NarasumberKelola, NarasumberOverview, NarasumberSkor, NarasumberNilai, NarasumberTemplate, NarasumberReaksi } from './NarasumberViews';
import { ModulView } from './SharedViews';
import { SparkleToastContainer } from './UI';

export const MainApp: React.FC = () => {
  const { user, setUser, syncing, state, updateState } = useAppContext();
  const [activeTab, setActiveTab] = useState('beranda');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;
  const isPeserta = user.role === 'peserta';

  const userAvatar = isPeserta && user.code && state.participants[user.code]?.avatar 
    ? state.participants[user.code].avatar 
    : localStorage.getItem(`avatar_${user.name}`);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isPeserta && user.code) {
          updateState(draft => {
            if (draft.participants[user.code!]) {
              draft.participants[user.code!].avatar = base64String;
            }
          });
        } else {
          localStorage.setItem(`avatar_${user.name}`, base64String);
          // force re-render
          setActiveTab(prev => prev);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPesertaView = () => {
    switch(activeTab) {
      case 'beranda': return <PesertaBeranda />;
      case 'modul': return <ModulView />;
      case 'reaksi': return <PesertaReaksi />;
      case 'game': return <PesertaGame />;
      case 'papan': return <PesertaPapan />;
      case 'lencana': return <PesertaLencana />;
      default: return <PesertaBeranda />;
    }
  };

  const renderNarasumberView = () => {
    switch(activeTab) {
      case 'peserta_kelola': return <NarasumberKelola />;
      case 'overview': return <NarasumberOverview />;
      case 'skor': return <NarasumberSkor />;
      case 'nilai': return <NarasumberNilai />;
      case 'template': return <NarasumberTemplate />;
      case 'reaksi_ns': return <NarasumberReaksi />;
      case 'modul': return <ModulView />;
      default: return <NarasumberKelola />;
    }
  };

  return (
    <div className="max-w-[980px] mx-auto px-4 pb-[70px]">
      <SparkleToastContainer />
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[var(--color-line)] flex items-center gap-3 py-3 px-4 mb-4 shadow-sm -mx-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div 
            onClick={handleAvatarClick}
            className="w-10 h-10 rounded-lg bg-[var(--color-plum-main)] flex items-center justify-center text-white shrink-0 font-bold overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            title="Ubah Foto Profil"
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              isPeserta ? 'P' : 'N'
            )}
          </div>
          <div>
            <div className="font-bold text-[15px] text-[var(--color-ink)] truncate">{user.name}</div>
            <div className="text-xs text-[var(--color-muted)]">{isPeserta ? user.group : 'Narasumber'}</div>
          </div>
        </div>
        <span className={`text-[10px] uppercase font-bold tracking-widest ${syncing ? 'text-[var(--color-coral-main)]' : 'text-[var(--color-teal-main)]'}`} title={syncing ? 'Menyinkron...' : 'Tersinkron'}>
          {syncing ? 'Syncing...' : 'Online'}
        </span>
        <button 
          onClick={() => { setUser(null); setActiveTab(isPeserta ? 'beranda' : 'peserta_kelola'); }}
          className="px-3 py-1.5 border border-[var(--color-line)] rounded-md bg-white text-xs font-medium text-[var(--color-muted)] hover:bg-[var(--color-paper)] transition-colors"
        >
          Keluar
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto py-2 mb-4 scrollbar-hide -webkit-overflow-scrolling-touch">
        {(isPeserta ? PTabs : NTabs).map(([id, lb]) => (
          <button 
            key={id}
            onClick={() => setActiveTab(id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium text-sm transition-all ${activeTab === id ? 'bg-[var(--color-plum-soft)] text-[var(--color-plum-2)] border-[var(--color-plum-soft)]' : 'text-[var(--color-muted)] border-transparent hover:bg-white hover:text-[var(--color-ink)] border'}`}
          >
            {lb}
          </button>
        ))}
      </div>

      <div className="mt-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isPeserta ? renderPesertaView() : renderNarasumberView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
