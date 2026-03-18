import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../streak';
import type { PracticeSession } from '../../types';

function makeSession(date: string): PracticeSession {
  return {
    id: `s-${date}`,
    date,
    materialId: 'm1',
    durationMinutes: 15,
    selfEvaluation: 3,
    createdAt: `${date}T10:00:00.000Z`,
  };
}

describe('calculateStreak', () => {
  const today = new Date('2026-03-18');

  it('returns all zeros for no sessions', () => {
    const result = calculateStreak([], today);
    expect(result).toEqual({
      current: 0,
      longest: 0,
      hasRecordToday: false,
      previousStreak: 0,
    });
  });

  it('counts current streak including today', () => {
    const sessions = [
      makeSession('2026-03-18'),
      makeSession('2026-03-17'),
      makeSession('2026-03-16'),
    ];
    const result = calculateStreak(sessions, today);
    expect(result.current).toBe(3);
    expect(result.hasRecordToday).toBe(true);
  });

  it('counts streak from yesterday when today has no record', () => {
    const sessions = [makeSession('2026-03-17'), makeSession('2026-03-16')];
    const result = calculateStreak(sessions, today);
    expect(result.current).toBe(2);
    expect(result.hasRecordToday).toBe(false);
  });

  it('returns 0 when streak is broken (no record yesterday)', () => {
    const sessions = [makeSession('2026-03-15'), makeSession('2026-03-14')];
    const result = calculateStreak(sessions, today);
    expect(result.current).toBe(0);
    expect(result.previousStreak).toBe(2);
  });

  it('counts same-day multiple sessions as 1 day', () => {
    const sessions = [
      makeSession('2026-03-18'),
      { ...makeSession('2026-03-18'), id: 's-extra' },
      makeSession('2026-03-17'),
    ];
    const result = calculateStreak(sessions, today);
    expect(result.current).toBe(2);
  });

  it('calculates longest streak', () => {
    const sessions = [
      // current streak: 2
      makeSession('2026-03-18'),
      makeSession('2026-03-17'),
      // gap on 2026-03-16
      // previous longer streak: 4
      makeSession('2026-03-15'),
      makeSession('2026-03-14'),
      makeSession('2026-03-13'),
      makeSession('2026-03-12'),
    ];
    const result = calculateStreak(sessions, today);
    expect(result.current).toBe(2);
    expect(result.longest).toBe(4);
  });

  it('previousStreak is 0 when streak is active', () => {
    const sessions = [makeSession('2026-03-18')];
    const result = calculateStreak(sessions, today);
    expect(result.previousStreak).toBe(0);
  });
});
