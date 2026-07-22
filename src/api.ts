import { AppState } from "./types";
import { CHARACTERS, MATERIALS } from "./constants";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export function freshState(): AppState {
  const s: AppState = {
    config: { groups: ["Kelompok 1", "Kelompok 2", "Kelompok 3", "Kelompok 4"] },
    groups: {},
    participants: {},
    reactions: {}
  };
  s.config.groups.forEach((g, i) => {
    s.groups[g] = { xp: 0, character: CHARACTERS[i % 4], template: {}, reflection: "" };
  });
  MATERIALS.forEach(m => { s.reactions[m.id] = {}; });
  return s;
}

export function normalize(s?: any): AppState {
  if (!s) s = freshState();
  s.config = s.config || { groups: [] };
  s.groups = s.groups || {};
  s.participants = s.participants || {};
  s.reactions = s.reactions || {};
  MATERIALS.forEach(m => { if (!s.reactions[m.id]) s.reactions[m.id] = {}; });
  s.config.groups.forEach((g: string, i: number) => {
    if (!s.groups[g]) s.groups[g] = { xp: 0, character: CHARACTERS[i % 4], template: {}, reflection: "" };
  });
  Object.values(s.participants).forEach((p: any) => { if (!p.scores) p.scores = {}; });
  return s;
}

export async function fetchState(): Promise<AppState> {
  try {
    const docRef = doc(db, "app_state", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return normalize(docSnap.data());
    }
  } catch (e) {
    console.error("Error fetching state:", e);
  }
  return normalize(null);
}

export async function saveState(state: AppState): Promise<void> {
  try {
    const docRef = doc(db, "app_state", "main");
    await setDoc(docRef, state);
  } catch (e) {
    console.error("Error saving state:", e);
  }
}
