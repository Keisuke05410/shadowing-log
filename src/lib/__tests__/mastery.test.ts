import { describe, it, expect } from 'vitest';
import { getMasteryLevel, MASTERY_LEVELS } from '../mastery';

describe('getMasteryLevel', () => {
  it('returns 見習い at 0 minutes', () => {
    const result = getMasteryLevel(0);
    expect(result.level.rank).toBe('見習い');
    expect(result.totalHours).toBe(0);
    expect(result.progressPercent).toBe(0);
    expect(result.remainingHours).toBe(5);
    expect(result.remainingMins).toBe(0);
    expect(result.nextLevel?.rank).toBe('入門');
  });

  it('returns 見習い at 150 minutes (2.5h, mid-level)', () => {
    const result = getMasteryLevel(150);
    expect(result.level.rank).toBe('見習い');
    expect(result.progressPercent).toBe(50);
    expect(result.remainingHours).toBe(2);
    expect(result.remainingMins).toBe(30);
  });

  it('returns 入門 at exactly 300 minutes (5h boundary)', () => {
    const result = getMasteryLevel(300);
    expect(result.level.rank).toBe('入門');
    expect(result.progressPercent).toBe(0);
    expect(result.remainingHours).toBe(15);
    expect(result.remainingMins).toBe(0);
    expect(result.nextLevel?.rank).toBe('修行中');
  });

  it('returns 修行中 at 2400 minutes (40h, mid-level)', () => {
    const result = getMasteryLevel(2400);
    expect(result.level.rank).toBe('修行中');
    expect(result.progressPercent).toBe(50);
    expect(result.remainingHours).toBe(20);
    expect(result.remainingMins).toBe(0);
    expect(result.nextLevel?.rank).toBe('一人前');
  });

  it('returns 達人 at exactly 18000 minutes (300h)', () => {
    const result = getMasteryLevel(18000);
    expect(result.level.rank).toBe('達人');
    expect(result.progressPercent).toBe(100);
    expect(result.remainingHours).toBeNull();
    expect(result.remainingMins).toBeNull();
    expect(result.nextLevel).toBeNull();
  });

  it('returns 達人 at 30000 minutes (500h, above max)', () => {
    const result = getMasteryLevel(30000);
    expect(result.level.rank).toBe('達人');
    expect(result.progressPercent).toBe(100);
    expect(result.remainingHours).toBeNull();
  });

  it('returns correct totalHours', () => {
    const result = getMasteryLevel(90);
    expect(result.totalHours).toBe(1.5);
  });

  it('MASTERY_LEVELS has 6 levels', () => {
    expect(MASTERY_LEVELS).toHaveLength(6);
  });
});
