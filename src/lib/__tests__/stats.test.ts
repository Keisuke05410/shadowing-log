import { describe, it, expect } from 'vitest';
import {
  getWeeklyTotal,
  getTodayTotal,
  getCumulativeTotal,
  getRollingComparison,
  getDailyMinutes,
  getDailyAvgEvaluation,
} from '../stats';
import type { PracticeSession } from '../../types';

function makeSession(
  date: string,
  minutes: number,
  evaluation: 1 | 2 | 3 | 4 | 5 = 3,
): PracticeSession {
  return {
    id: `s-${date}-${minutes}`,
    date,
    materialId: 'm1',
    durationMinutes: minutes,
    selfEvaluation: evaluation,
    createdAt: `${date}T10:00:00.000Z`,
  };
}

describe('getWeeklyTotal', () => {
  // 2026-03-18 is Wednesday. Week starts Mon 2026-03-16
  const today = new Date('2026-03-18');

  it('sums sessions in current week', () => {
    const sessions = [
      makeSession('2026-03-16', 10), // Monday
      makeSession('2026-03-17', 15), // Tuesday
      makeSession('2026-03-18', 20), // Wednesday (today)
    ];
    expect(getWeeklyTotal(sessions, today)).toBe(45);
  });

  it('excludes sessions outside current week', () => {
    const sessions = [
      makeSession('2026-03-15', 30), // Last Sunday
      makeSession('2026-03-18', 10), // Today
    ];
    expect(getWeeklyTotal(sessions, today)).toBe(10);
  });

  it('returns 0 when no sessions', () => {
    expect(getWeeklyTotal([], today)).toBe(0);
  });
});

describe('getTodayTotal', () => {
  const today = new Date('2026-03-18');

  it('sums sessions for today', () => {
    const sessions = [makeSession('2026-03-18', 10), makeSession('2026-03-18', 20)];
    expect(getTodayTotal(sessions, today)).toBe(30);
  });

  it('excludes other days', () => {
    const sessions = [makeSession('2026-03-17', 15), makeSession('2026-03-18', 10)];
    expect(getTodayTotal(sessions, today)).toBe(10);
  });
});

describe('getCumulativeTotal', () => {
  it('sums all sessions regardless of date', () => {
    const sessions = [
      makeSession('2026-01-01', 30),
      makeSession('2026-02-15', 45),
      makeSession('2026-03-18', 20),
    ];
    expect(getCumulativeTotal(sessions)).toBe(95);
  });

  it('returns 0 when no sessions', () => {
    expect(getCumulativeTotal([])).toBe(0);
  });
});

describe('getRollingComparison', () => {
  // today = 2026-03-18
  // current period: 2026-02-17 ~ 2026-03-18 (30 days)
  // previous period: 2026-01-18 ~ 2026-02-16 (30 days)
  const today = new Date('2026-03-18');

  it('computes stats and deltas for both periods', () => {
    const sessions = [
      // previous period
      makeSession('2026-01-20', 30, 3),
      makeSession('2026-02-10', 20, 2),
      // current period
      makeSession('2026-03-01', 40, 4),
      makeSession('2026-03-10', 30, 5),
      makeSession('2026-03-10', 20, 3), // same day as above
    ];
    const result = getRollingComparison(sessions, today);
    expect(result.current.practiceDays).toBe(2);
    expect(result.current.totalMinutes).toBe(90);
    expect(result.current.avgEvaluation).toBe(4); // (4+5+3)/3 = 4.0
    expect(result.previous.practiceDays).toBe(2);
    expect(result.previous.totalMinutes).toBe(50);
    expect(result.previous.avgEvaluation).toBe(2.5);
    expect(result.deltas.practiceDays).toBe(0); // 2 vs 2 = 0%
    expect(result.deltas.totalMinutes).toBe(80); // (90-50)/50*100 = 80%
    expect(result.deltas.avgEvaluation).toBe(60); // (4-2.5)/2.5*100 = 60%
  });

  it('returns null deltas when previous period is empty', () => {
    const sessions = [makeSession('2026-03-05', 20, 4)];
    const result = getRollingComparison(sessions, today);
    expect(result.current.totalMinutes).toBe(20);
    expect(result.previous.totalMinutes).toBe(0);
    expect(result.deltas.practiceDays).toBeNull();
    expect(result.deltas.totalMinutes).toBeNull();
    expect(result.deltas.avgEvaluation).toBeNull();
  });

  it('returns -100% delta when current period is empty but previous has data', () => {
    const sessions = [makeSession('2026-02-01', 30, 3)];
    const result = getRollingComparison(sessions, today);
    expect(result.current.totalMinutes).toBe(0);
    expect(result.deltas.totalMinutes).toBe(-100);
    expect(result.deltas.practiceDays).toBe(-100);
  });

  it('handles no data at all', () => {
    const result = getRollingComparison([], today);
    expect(result.current.practiceDays).toBe(0);
    expect(result.current.totalMinutes).toBe(0);
    expect(result.current.avgEvaluation).toBeNull();
    expect(result.deltas.practiceDays).toBeNull();
    expect(result.deltas.totalMinutes).toBeNull();
    expect(result.deltas.avgEvaluation).toBeNull();
  });
});

describe('getDailyMinutes', () => {
  const today = new Date('2026-03-18');

  it('returns array of correct length with daily totals', () => {
    const sessions = [
      makeSession('2026-03-17', 15),
      makeSession('2026-03-18', 30),
      makeSession('2026-03-18', 10), // same day
    ];
    const result = getDailyMinutes(sessions, 3, today);
    expect(result).toHaveLength(3);
    // index 0 = 2026-03-16, index 1 = 2026-03-17, index 2 = 2026-03-18
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(15);
    expect(result[2]).toBe(40);
  });

  it('returns all zeros when no sessions', () => {
    const result = getDailyMinutes([], 5, today);
    expect(result).toEqual([0, 0, 0, 0, 0]);
  });
});

describe('getDailyAvgEvaluation', () => {
  const today = new Date('2026-03-18');

  it('returns daily averages with null for no-practice days', () => {
    const sessions = [
      makeSession('2026-03-17', 10, 2),
      makeSession('2026-03-17', 10, 4), // same day
      makeSession('2026-03-18', 10, 5),
    ];
    const result = getDailyAvgEvaluation(sessions, 3, today);
    expect(result[0]).toBeNull(); // 2026-03-16
    expect(result[1]).toBe(3); // (2+4)/2
    expect(result[2]).toBe(5);
  });

  it('returns all nulls when no sessions', () => {
    const result = getDailyAvgEvaluation([], 3, today);
    expect(result).toEqual([null, null, null]);
  });
});
