import { describe, it, expect } from 'vitest';
import { getWeeklyTotal, getTodayTotal } from '../stats';
import type { PracticeSession } from '../../types';

function makeSession(date: string, minutes: number): PracticeSession {
  return {
    id: `s-${date}`,
    date,
    materialId: 'm1',
    durationMinutes: minutes,
    selfEvaluation: 3,
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
