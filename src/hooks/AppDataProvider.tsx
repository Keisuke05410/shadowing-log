import { useState, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AppData, Material, PracticeSession } from '../types';
import { loadData, saveData, StorageReadError } from '../lib/storage';
import { AppDataContext } from './AppDataContext';
import toast from 'react-hot-toast';

function initData(): { data: AppData; error: string | null } {
  try {
    return { data: loadData(), error: null };
  } catch (e) {
    if (e instanceof StorageReadError) {
      return { data: { materials: [], sessions: [] }, error: e.message };
    }
    return { data: { materials: [], sessions: [] }, error: null };
  }
}

function persist(data: AppData) {
  try {
    saveData(data);
  } catch {
    toast.error('データの保存に失敗しました');
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [{ data, error }, setState] = useState(initData);

  const addMaterial = useCallback(
    (input: Omit<Material, 'id' | 'createdAt'>): Material => {
      const material: Material = {
        ...input,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      const next = { ...data, materials: [material, ...data.materials] };
      setState({ data: next, error });
      persist(next);
      return material;
    },
    [data, error],
  );

  const updateMaterial = useCallback(
    (id: string, input: Partial<Omit<Material, 'id' | 'createdAt'>>) => {
      const next = {
        ...data,
        materials: data.materials.map((m) => (m.id === id ? { ...m, ...input } : m)),
      };
      setState({ data: next, error });
      persist(next);
    },
    [data, error],
  );

  const deleteMaterial = useCallback(
    (id: string) => {
      const next = {
        ...data,
        materials: data.materials.filter((m) => m.id !== id),
      };
      setState({ data: next, error });
      persist(next);
    },
    [data, error],
  );

  const addSession = useCallback(
    (input: Omit<PracticeSession, 'id' | 'createdAt'>) => {
      const session: PracticeSession = {
        ...input,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      const next = { ...data, sessions: [...data.sessions, session] };
      setState({ data: next, error });
      persist(next);
    },
    [data, error],
  );

  const deleteSession = useCallback(
    (id: string) => {
      const next = {
        ...data,
        sessions: data.sessions.filter((s) => s.id !== id),
      };
      setState({ data: next, error });
      persist(next);
    },
    [data, error],
  );

  const importAll = useCallback((newData: AppData) => {
    setState({ data: newData, error: null });
    persist(newData);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        data,
        error,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addSession,
        deleteSession,
        importAll,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
