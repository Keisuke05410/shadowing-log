export interface Material {
  id: string;
  name: string;
  lengthSeconds: number;
  url?: string;
  createdAt: string;
}

export interface PracticeSession {
  id: string;
  date: string; // YYYY-MM-DD
  materialId: string;
  durationMinutes: number;
  selfEvaluation: 1 | 2 | 3 | 4 | 5;
  memo?: string;
  createdAt: string;
}

export interface AppData {
  materials: Material[];
  sessions: PracticeSession[];
}
