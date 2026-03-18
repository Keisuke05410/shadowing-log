import { describe, it, expect } from 'vitest';
import { buildHeatmapData, getDaySummary } from '../heatmap';
import type { PracticeSession } from '../../types';

function makeSession(date: string, minutes: number, materialId = 'm1'): PracticeSession {
  return {
    id: `s-${date}-${minutes}`,
    date,
    materialId,
    durationMinutes: minutes,
    selfEvaluation: 3,
    createdAt: `${date}T10:00:00.000Z`,
  };
}

describe('buildHeatmapData', () => {
  const today = new Date('2026-03-18');

  it('returns entries for 6 calendar months', () => {
    const data = buildHeatmapData([], today);
    // Oct 2025 through Mar 2026
    const firstDate = data[0].date;
    const lastDate = data[data.length - 1].date;
    expect(firstDate).toBe('2025-10-01');
    expect(lastDate).toBe('2026-03-31');
  });

  it('assigns correct levels', () => {
    const sessions = [
      makeSession('2026-03-18', 10),
      makeSession('2026-03-17', 20),
      makeSession('2026-03-16', 40),
    ];
    const data = buildHeatmapData(sessions, today);
    const findEntry = (date: string) => data.find((d) => d.date === date)!;

    expect(findEntry('2026-03-18').level).toBe(1); // 10min → level 1
    expect(findEntry('2026-03-17').level).toBe(2); // 20min → level 2
    expect(findEntry('2026-03-16').level).toBe(3); // 40min → level 3
    expect(findEntry('2026-03-15').level).toBe(0); // no record
  });

  it('sums multiple sessions on same day', () => {
    const sessions = [makeSession('2026-03-18', 10), makeSession('2026-03-18', 25)];
    const data = buildHeatmapData(sessions, today);
    const entry = data.find((d) => d.date === '2026-03-18')!;
    expect(entry.count).toBe(35);
    expect(entry.level).toBe(3); // 35min → level 3
  });
});

describe('getDaySummary', () => {
  it('returns correct summary', () => {
    const sessions = [makeSession('2026-03-18', 10, 'm1'), makeSession('2026-03-18', 20, 'm2')];
    const materialMap = new Map([
      ['m1', 'Material A'],
      ['m2', 'Material B'],
    ]);
    const summary = getDaySummary(sessions, '2026-03-18', materialMap);
    expect(summary.totalMinutes).toBe(30);
    expect(summary.sessionCount).toBe(2);
    expect(summary.materialNames).toEqual(['Material A', 'Material B']);
  });

  it('shows deleted material label', () => {
    const sessions = [makeSession('2026-03-18', 10, 'deleted-id')];
    const materialMap = new Map<string, string>();
    const summary = getDaySummary(sessions, '2026-03-18', materialMap);
    expect(summary.materialNames).toEqual(['（削除済み教材）']);
  });
});
