import { format, subDays, parseISO } from 'date-fns';
import type { PracticeSession } from '../types';

function getUniqueDates(sessions: PracticeSession[]): Set<string> {
  return new Set(sessions.map((s) => s.date));
}

function countStreak(dates: Set<string>, startDate: Date): number {
  let count = 0;
  let current = startDate;
  while (dates.has(format(current, 'yyyy-MM-dd'))) {
    count++;
    current = subDays(current, 1);
  }
  return count;
}

export interface StreakInfo {
  current: number;
  longest: number;
  hasRecordToday: boolean;
  /** 直前のストリーク日数（断絶メッセージ用）。断絶していない場合は0 */
  previousStreak: number;
}

export function calculateStreak(sessions: PracticeSession[], today?: Date): StreakInfo {
  const now = today ?? new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');
  const dates = getUniqueDates(sessions);
  const hasRecordToday = dates.has(todayStr);

  if (dates.size === 0) {
    return { current: 0, longest: 0, hasRecordToday: false, previousStreak: 0 };
  }

  // 現在のストリーク
  let current: number;
  if (hasRecordToday) {
    current = countStreak(dates, now);
  } else if (dates.has(yesterdayStr)) {
    current = countStreak(dates, subDays(now, 1));
  } else {
    current = 0;
  }

  // 最長ストリーク
  const sortedDates = [...dates].sort();
  let longest = 0;
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = parseISO(sortedDates[i - 1]);
    const curr = parseISO(sortedDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  longest = Math.max(longest, streak);

  // 直前のストリーク（断絶時のみ）
  let previousStreak = 0;
  if (current === 0 && dates.size > 0) {
    const lastDate = sortedDates[sortedDates.length - 1];
    previousStreak = countStreak(dates, parseISO(lastDate));
  }

  return { current, longest, hasRecordToday, previousStreak };
}
