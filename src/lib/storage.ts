import type { AppData } from '../types';

const STORAGE_KEY = 'shadowing-log-data';

const EMPTY_DATA: AppData = { materials: [], sessions: [] };

export class StorageReadError extends Error {
  constructor() {
    super('データの読み込みに失敗しました');
    this.name = 'StorageReadError';
  }
}

export class StorageWriteError extends Error {
  constructor() {
    super('データの保存に失敗しました');
    this.name = 'StorageWriteError';
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return EMPTY_DATA;
    const parsed = JSON.parse(raw) as AppData;
    if (!Array.isArray(parsed.materials) || !Array.isArray(parsed.sessions)) {
      throw new Error('Invalid data structure');
    }
    return parsed;
  } catch {
    throw new StorageReadError();
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new StorageWriteError();
  }
}

export function exportData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): AppData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('ファイルの形式が正しくありません');
  }

  const data = parsed as Record<string, unknown>;
  if (!Array.isArray(data.materials) || !Array.isArray(data.sessions)) {
    throw new Error('データが不完全です。インポートできません');
  }

  return { materials: data.materials, sessions: data.sessions } as AppData;
}
