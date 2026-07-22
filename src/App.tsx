/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { LoginScreen } from './components/LoginScreen';
import { MainApp } from './components/MainApp';

const Root: React.FC = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)]">
        <div className="text-[var(--color-plum-main)] font-bold animate-pulse text-[18px]">Memuat...</div>
      </div>
    );
  }

  return user ? <MainApp /> : <LoginScreen />;
};

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}

