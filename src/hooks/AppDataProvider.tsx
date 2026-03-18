import { useState, useCallback, useMemo, type ReactNode } from 'react';
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
      setState((prev) => {
        const nextData = { ...prev.data, materials: [material, ...prev.data.materials] };
        persist(nextData);
        return { ...prev, data: nextData };
      });
      return material;
    },
    [],
  );

  const updateMaterial = useCallback(
    (id: string, input: Partial<Omit<Material, 'id' | 'createdAt'>>) => {
      setState((prev) => {
        const nextData = {
          ...prev.data,
          materials: prev.data.materials.map((m) => (m.id === id ? { ...m, ...input } : m)),
        };
        persist(nextData);
        return { ...prev, data: nextData };
      });
    },
    [],
  );

  const deleteMaterial = useCallback((id: string) => {
    setState((prev) => {
      const nextData = {
        ...prev.data,
        materials: prev.data.materials.filter((m) => m.id !== id),
      };
      persist(nextData);
      return { ...prev, data: nextData };
    });
  }, []);

  const addSession = useCallback((input: Omit<PracticeSession, 'id' | 'createdAt'>) => {
    const session: PracticeSession = {
      ...input,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => {
      const nextData = { ...prev.data, sessions: [...prev.data.sessions, session] };
      persist(nextData);
      return { ...prev, data: nextData };
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setState((prev) => {
      const nextData = {
        ...prev.data,
        sessions: prev.data.sessions.filter((s) => s.id !== id),
      };
      persist(nextData);
      return { ...prev, data: nextData };
    });
  }, []);

  const importAll = useCallback((newData: AppData) => {
    setState({ data: newData, error: null });
    persist(newData);
  }, []);

  const value = useMemo(
    () => ({
      data,
      error,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      addSession,
      deleteSession,
      importAll,
    }),
    [data, error, addMaterial, updateMaterial, deleteMaterial, addSession, deleteSession, importAll],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
