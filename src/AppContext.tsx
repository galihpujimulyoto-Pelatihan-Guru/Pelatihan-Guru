import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, User } from './types';
import { fetchState, saveState, normalize } from './api';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  state: AppState;
  updateState: (updater: (draft: AppState) => void) => Promise<void>;
  loading: boolean;
  syncing: boolean;
  refreshState: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<AppState>(normalize(null));
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Initial fetch to ensure the document exists and we have data
    fetchState().then(s => {
      setState(s);
      setLoading(false);
    });

    const docRef = doc(db, 'app_state', 'main');
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setState(normalize(doc.data()));
      }
    });

    return () => unsubscribe();
  }, []);

  const updateState = async (updater: (draft: AppState) => void) => {
    setSyncing(true);
    const newState = JSON.parse(JSON.stringify(state));
    updater(newState);
    setState(newState);
    await saveState(newState);
    setSyncing(false);
  };

  const refreshState = async () => {
    const s = await fetchState();
    setState(s);
  };

  return (
    <AppContext.Provider value={{ user, setUser, state, updateState, loading, syncing, refreshState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
