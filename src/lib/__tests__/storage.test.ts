import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadData, saveData, exportData, importData, StorageReadError } from '../storage';
import type { AppData } from '../../types';

const STORAGE_KEY = 'shadowing-log-data';

const sampleData: AppData = {
  materials: [
    {
      id: 'm1',
      name: 'Test Material',
      lengthSeconds: 120,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  sessions: [
    {
      id: 's1',
      date: '2026-01-01',
      materialId: 'm1',
      durationMinutes: 15,
      selfEvaluation: 4,
      createdAt: '2026-01-01T10:00:00.000Z',
    },
  ],
};

beforeEach(() => {
  localStorage.clear();
});

describe('loadData', () => {
  it('returns empty data when nothing in localStorage', () => {
    expect(loadData()).toEqual({ materials: [], sessions: [] });
  });

  it('loads valid data', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
    expect(loadData()).toEqual(sampleData);
  });

  it('throws StorageReadError on invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    expect(() => loadData()).toThrow(StorageReadError);
  });

  it('throws StorageReadError when data structure is invalid', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ materials: 'not-array' }));
    expect(() => loadData()).toThrow(StorageReadError);
  });
});

describe('saveData', () => {
  it('persists data to localStorage', () => {
    saveData(sampleData);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toEqual(sampleData);
  });

  it('throws on quota exceeded', () => {
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => saveData(sampleData)).toThrow('データの保存に失敗しました');
    mockSetItem.mockRestore();
  });
});

describe('exportData', () => {
  it('returns formatted JSON string', () => {
    const result = exportData(sampleData);
    expect(JSON.parse(result)).toEqual(sampleData);
  });
});

describe('importData', () => {
  it('parses valid JSON', () => {
    const json = JSON.stringify(sampleData);
    expect(importData(json)).toEqual(sampleData);
  });

  it('throws on invalid JSON', () => {
    expect(() => importData('{')).toThrow('ファイルの形式が正しくありません');
  });

  it('throws when materials is missing', () => {
    expect(() => importData(JSON.stringify({ sessions: [] }))).toThrow('データが不完全です');
  });

  it('throws when sessions is not array', () => {
    expect(() => importData(JSON.stringify({ materials: [], sessions: 'not-array' }))).toThrow(
      'データが不完全です',
    );
  });
});
