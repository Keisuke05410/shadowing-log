import { createContext } from 'react';
import type { AppData, Material, PracticeSession } from '../types';

export interface AppDataContextValue {
  data: AppData;
  error: string | null;
  addMaterial: (input: Omit<Material, 'id' | 'createdAt'>) => Material;
  updateMaterial: (id: string, input: Partial<Omit<Material, 'id' | 'createdAt'>>) => void;
  deleteMaterial: (id: string) => void;
  addSession: (input: Omit<PracticeSession, 'id' | 'createdAt'>) => void;
  deleteSession: (id: string) => void;
  importAll: (newData: AppData) => void;
}

export const AppDataContext = createContext<AppDataContextValue | null>(null);
