export type Role = 'peserta' | 'narasumber';

export interface User {
  role: Role;
  name: string;
  group?: string;
  code?: string;
}

export interface GroupState {
  xp: number;
  character: string;
  template: Record<string, string>;
  reflection: string;
  scores?: Record<string, number>;
  xpHistory?: { reason: string; amount: number; timestamp: number }[];
}

export interface ParticipantState {
  name: string;
  group: string;
  scores: Record<string, number>;
}

export interface AppState {
  config: {
    groups: string[];
  };
  groups: Record<string, GroupState>;
  participants: Record<string, ParticipantState>;
  reactions: Record<string, Record<string, { senti?: string; paham?: string }>>;
}
