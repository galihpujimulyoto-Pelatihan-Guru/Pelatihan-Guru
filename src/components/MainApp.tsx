import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { PTabs, NTabs } from './Tabs';
import { PesertaBeranda, PesertaReaksi, PesertaGame, PesertaPapan, PesertaLencana } from './PesertaViews';
import { NarasumberKelola, NarasumberOverview, NarasumberSkor, NarasumberNilai, NarasumberTemplate, NarasumberReaksi } from './NarasumberViews';
import { ModulView } from './SharedViews';
import { SparkleToastContainer } from './UI';

export const MainApp: React.FC = () => {
  const { user, setUser, syncing } = useAppContext();
  const [activeTab, setActiveTab] = useState('beranda');

  if (!user) return null;
  const isPeserta = user.role === 'peserta';

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
          <div className="w-10 h-10 rounded-lg bg-[var(--color-plum-main)] flex items-center justify-center text-white shrink-0 font-bold">
            {isPeserta ? 'P' : 'N'}
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

      <div className="mt-4">
        {isPeserta ? renderPesertaView() : renderNarasumberView()}
      </div>
    </div>
  );
};
