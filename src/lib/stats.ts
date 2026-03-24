import { startOfWeek, endOfWeek, format } from 'date-fns';
import type { PracticeSession } from '../types';

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
