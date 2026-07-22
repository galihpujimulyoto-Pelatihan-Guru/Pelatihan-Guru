import React, { useState, useEffect } from 'react';

// A simple event emitter for toasts
export const toastEmitter = {
  listeners: [] as ((msg: string) => void)[],
  emit(msg: string) {
    this.listeners.forEach(l => l(msg));
  },
  subscribe(l: (msg: string) => void) {
    this.listeners.push(l);
    return () => { this.listeners = this.listeners.filter(cb => cb !== l); };
  }
};

export const toast = (msg: string) => {
  toastEmitter.emit(msg);
};

export const SparkleToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<{id: number, msg: string}[]>([]);

  useEffect(() => {
    let id = 0;
    const unsub = toastEmitter.subscribe(msg => {
      const currentId = id++;
      setToasts(prev => [...prev, { id: currentId, msg }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== currentId));
      }, 1700);
    });
    return unsub;
  }, []);

  return (
    <div className="fixed bottom-[22px] left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="bg-[var(--color-plum-main)] text-white px-6 py-3 rounded-[30px] font-bold shadow-[var(--shadow)] text-[14px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          {t.msg}
        </div>
      ))}
    </div>
  );
};
