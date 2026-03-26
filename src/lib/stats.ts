import { startOfWeek, endOfWeek, subDays, format } from 'date-fns';
import type { PracticeSession } from '../types';

export interface RollingStats {
  practiceDays: number;
  totalMinutes: number;
  avgEvaluation: number | null;
}

export interface RollingComparisonResult {
  current: RollingStats;
  previous: RollingStats;
  deltas: {
    practiceDays: number | null;
    totalMinutes: number | null;
    avgEvaluation: number | null;
  };
}

export function getWeeklyTotal(sessions: PracticeSession[], today?: Date): number {
  const now = today ?? new Date();
  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  return sessions
    .filter((s) => s.date >= weekStart && s.date <= weekEnd)
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function getTodayTotal(sessions: PracticeSession[], today?: Date): number {
  const todayStr = format(today ?? new Date(), 'yyyy-MM-dd');
  return sessions.filter((s) => s.date === todayStr).reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function getCumulativeTotal(sessions: PracticeSession[]): number {
  return sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
}

function computeRollingStats(
  sessions: PracticeSession[],
  startStr: string,
  endStr: string,
): RollingStats {
  const filtered = sessions.filter((s) => s.date >= startStr && s.date <= endStr);
  const practiceDays = new Set(filtered.map((s) => s.date)).size;
  const totalMinutes = filtered.reduce((sum, s) => sum + s.durationMinutes, 0);
  const avgEvaluation =
    filtered.length > 0
      ? Math.round(
          (filtered.reduce((sum, s) => sum + s.selfEvaluation, 0) / filtered.length) * 10,
        ) / 10
      : null;
  return { practiceDays, totalMinutes, avgEvaluation };
}

function computeDelta(current: number | null, previous: number | null): number | null {
  if (previous === null || previous === 0) return null;
  return Math.round((((current ?? 0) - previous) / previous) * 100);
}

export function getRollingComparison(
  sessions: PracticeSession[],
  today?: Date,
): RollingComparisonResult {
  const now = today ?? new Date();
  const currentEnd = format(now, 'yyyy-MM-dd');
  const currentStart = format(subDays(now, 29), 'yyyy-MM-dd');
  const previousEnd = format(subDays(now, 30), 'yyyy-MM-dd');
  const previousStart = format(subDays(now, 59), 'yyyy-MM-dd');

  const current = computeRollingStats(sessions, currentStart, currentEnd);
  const previous = computeRollingStats(sessions, previousStart, previousEnd);

  return {
    current,
    previous,
    deltas: {
      practiceDays: computeDelta(current.practiceDays, previous.practiceDays),
      totalMinutes: computeDelta(current.totalMinutes, previous.totalMinutes),
      avgEvaluation: computeDelta(current.avgEvaluation, previous.avgEvaluation),
    },
  };
}

function groupByDate(sessions: PracticeSession[]): Map<string, PracticeSession[]> {
  const map = new Map<string, PracticeSession[]>();
  for (const s of sessions) {
    const list = map.get(s.date);
    if (list) list.push(s);
    else map.set(s.date, [s]);
  }
  return map;
}

function buildDateKeys(days: number, now: Date): string[] {
  const keys: string[] = new Array(days);
  for (let i = 0; i < days; i++) {
    keys[i] = format(subDays(now, days - 1 - i), 'yyyy-MM-dd');
  }
  return keys;
}

export function getDailyMinutes(sessions: PracticeSession[], days: number, today?: Date): number[] {
  const byDate = groupByDate(sessions);
  const keys = buildDateKeys(days, today ?? new Date());
  return keys.map((k) => {
    const list = byDate.get(k);
    return list ? list.reduce((sum, s) => sum + s.durationMinutes, 0) : 0;
  });
}

export function getDailyAvgEvaluation(
  sessions: PracticeSession[],
  days: number,
  today?: Date,
): (number | null)[] {
  const byDate = groupByDate(sessions);
  const keys = buildDateKeys(days, today ?? new Date());
  return keys.map((k) => {
    const list = byDate.get(k);
    if (!list) return null;
    return Math.round((list.reduce((sum, s) => sum + s.selfEvaluation, 0) / list.length) * 10) / 10;
  });
}
