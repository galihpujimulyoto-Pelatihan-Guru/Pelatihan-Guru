/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { LoginScreen } from './components/LoginScreen';
import { MainApp } from './components/MainApp';

const BackgroundElements: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute -top-[10%] -left-[5%] w-64 h-64 bg-[var(--color-plum-main)] opacity-[0.03] rounded-full blur-3xl"
        style={{ animation: 'floaty 12s ease-in-out infinite' }}
      />
      <div 
        className="absolute top-[20%] right-[10%] w-72 h-72 bg-[var(--color-sky-main)] opacity-[0.03] rounded-full blur-3xl"
        style={{ animation: 'floaty 15s ease-in-out infinite reverse' }}
      />
      <div 
        className="absolute bottom-[10%] -left-[10%] w-96 h-96 bg-[var(--color-teal-main)] opacity-[0.03] rounded-full blur-3xl"
        style={{ animation: 'floaty 18s ease-in-out infinite' }}
      />
      <div 
        className="absolute -bottom-[5%] right-[5%] w-80 h-80 bg-[var(--color-plum-2)] opacity-[0.03] rounded-full blur-3xl"
        style={{ animation: 'floaty 14s ease-in-out infinite reverse' }}
      />
      
      {/* Decorative particles */}
      <div 
        className="absolute top-[30%] left-[20%] w-3 h-3 rounded-full bg-[var(--color-plum-main)] opacity-20"
        style={{ animation: 'floaty 8s ease-in-out infinite' }}
      />
      <div 
        className="absolute top-[60%] right-[25%] w-4 h-4 rounded-full bg-[var(--color-gold-main)] opacity-20"
        style={{ animation: 'floaty 10s ease-in-out infinite 2s' }}
      />
      <div 
        className="absolute bottom-[20%] left-[40%] w-2 h-2 rounded-full bg-[var(--color-teal-main)] opacity-20"
        style={{ animation: 'floaty 9s ease-in-out infinite 1s' }}
      />
      <div 
        className="absolute top-[15%] right-[40%] w-2 h-2 rounded-full bg-[var(--color-coral-main)] opacity-20"
        style={{ animation: 'floaty 11s ease-in-out infinite' }}
      />
      <div 
        className="absolute top-[70%] left-[10%] opacity-20 text-[var(--color-sky-main)] text-xl font-bold"
        style={{ animation: 'floaty 12s ease-in-out infinite 3s' }}
      >
        +
      </div>
      <div 
        className="absolute top-[20%] right-[15%] opacity-20 text-[var(--color-plum-main)] text-xl font-bold"
        style={{ animation: 'floaty 13s ease-in-out infinite 1.5s' }}
      >
        +
      </div>
      <div 
        className="absolute bottom-[30%] right-[20%] w-6 h-6 border-2 border-[var(--color-teal-main)] rounded-sm opacity-20"
        style={{ animation: 'floaty 14s ease-in-out infinite 4s' }}
      />
    </div>
  );
};

const Root: React.FC = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)] relative">
        <BackgroundElements />
        <div className="text-[var(--color-plum-main)] font-bold animate-pulse text-[18px] relative z-10">Memuat...</div>
      </div>
    );
  }

  return (
    <>
      <BackgroundElements />
      <div className="relative z-10">
        {user ? <MainApp /> : <LoginScreen />}
      </div>
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}

