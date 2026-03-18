import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { PracticeSession } from '../types';

export interface HeatmapEntry {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3;
}

function getLevel(totalMinutes: number): 0 | 1 | 2 | 3 {
  if (totalMinutes === 0) return 0;
  if (totalMinutes <= 15) return 1;
  if (totalMinutes <= 30) return 2;
  return 3;
}

export function buildHeatmapData(sessions: PracticeSession[], today?: Date): HeatmapEntry[] {
  const now = today ?? new Date();

  // 直近6カレンダー月（当月含む）
  const start = startOfMonth(subMonths(now, 5));
  const end = endOfMonth(now);

  // 日ごとの合計時間
  const dailyMinutes = new Map<string, number>();
  for (const s of sessions) {
    const current = dailyMinutes.get(s.date) ?? 0;
    dailyMinutes.set(s.date, current + s.durationMinutes);
  }

  // 全日付分のエントリを生成
  return eachDayOfInterval({ start, end }).map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const minutes = dailyMinutes.get(dateStr) ?? 0;
    return {
      date: dateStr,
      count: minutes,
      level: getLevel(minutes),
    };
  });
}

export const DELETED_MATERIAL_LABEL = '（削除済み教材）';

export interface DaySummary {
  date: string;
  totalMinutes: number;
  sessionCount: number;
  materialNames: string[];
}

export function getDaySummary(
  sessions: PracticeSession[],
  date: string,
  materialMap: Map<string, string>,
): DaySummary {
  const daySessions = sessions.filter((s) => s.date === date);
  const materialNames = [
    ...new Set(daySessions.map((s) => materialMap.get(s.materialId) ?? DELETED_MATERIAL_LABEL)),
  ];
  return {
    date,
    totalMinutes: daySessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    sessionCount: daySessions.length,
    materialNames,
  };
}
