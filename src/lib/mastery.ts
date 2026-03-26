import type { MasteryLevel, MasteryLevelInfo } from '../types';

export const MASTERY_LEVELS: MasteryLevel[] = [
  { rank: '見習い', minHours: 0, maxHours: 5 },
  { rank: '入門', minHours: 5, maxHours: 20 },
  { rank: '修行中', minHours: 20, maxHours: 60 },
  { rank: '一人前', minHours: 60, maxHours: 150 },
  { rank: '熟練', minHours: 150, maxHours: 300 },
  { rank: '達人', minHours: 300, maxHours: null },
];

export function getMasteryLevel(totalMinutes: number): MasteryLevelInfo {
  const totalHours = totalMinutes / 60;
  const currentIndex = MASTERY_LEVELS.findLastIndex((l) => totalHours >= l.minHours);

  const level = MASTERY_LEVELS[currentIndex];
  const nextLevel =
    currentIndex < MASTERY_LEVELS.length - 1 ? MASTERY_LEVELS[currentIndex + 1] : null;

  const progressPercent =
    level.maxHours === null
      ? 100
      : Math.min(
          100,
          Math.max(0, ((totalHours - level.minHours) / (level.maxHours - level.minHours)) * 100),
        );

  const remainingTotal = level.maxHours === null ? null : (level.maxHours - totalHours) * 60;

  return {
    level,
    totalHours,
    progressPercent,
    remainingHours: remainingTotal !== null ? Math.floor(remainingTotal / 60) : null,
    remainingMins: remainingTotal !== null ? Math.round(remainingTotal % 60) : null,
    nextLevel,
  };
}
