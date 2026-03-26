import { useMemo } from 'react';
import type { PracticeSession } from '../types';
import { getRollingComparison, getDailyMinutes, getDailyAvgEvaluation } from '../lib/stats';
import Sparkline from './Sparkline';

interface Props {
  sessions: PracticeSession[];
}

function formatDelta(delta: number | null): { label: string; arrow: string; colorClass: string } {
  if (delta === null) return { label: '--', arrow: '→', colorClass: 'text-muted' };
  if (delta > 0) return { label: `+${delta}%`, arrow: '↑', colorClass: 'text-success' };
  if (delta < 0) return { label: `${delta}%`, arrow: '↓', colorClass: 'text-danger' };
  return { label: '±0%', arrow: '→', colorClass: 'text-muted' };
}

function formatEval(v: number | null): string {
  if (v === null) return '--';
  return v.toFixed(1);
}

export default function RollingComparison({ sessions }: Props) {
  const { comparison, dailyMinutes, dailyEvalNumbers } = useMemo(() => {
    const comp = getRollingComparison(sessions);
    const mins = getDailyMinutes(sessions, 30);
    const evalRaw = getDailyAvgEvaluation(sessions, 30);
    return { comparison: comp, dailyMinutes: mins, dailyEvalNumbers: evalRaw.map((v) => v ?? 0) };
  }, [sessions]);

  const { current, deltas } = comparison;

  const metrics = [
    {
      label: '練習日数',
      value: `${current.practiceDays}日`,
      delta: deltas.practiceDays,
      sparkData: null as number[] | null,
    },
    {
      label: '合計時間',
      value: `${current.totalMinutes}分`,
      delta: deltas.totalMinutes,
      sparkData: dailyMinutes,
    },
    {
      label: '平均評価',
      value: formatEval(current.avgEvaluation),
      delta: deltas.avgEvaluation,
      sparkData: dailyEvalNumbers,
    },
  ];

  return (
    <div className="card">
      <p className="text-sm text-muted mb-3">直近30日 vs 前30日</p>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((m) => {
          const d = formatDelta(m.delta);
          return (
            <div key={m.label} className="text-center">
              <p className="text-xs text-muted mb-1">{m.label}</p>
              <p className="font-heading text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {m.value}
              </p>
              <p className={`text-xs font-medium mt-0.5 ${d.colorClass}`}>
                {d.arrow} {d.label}
              </p>
              {m.sparkData && (
                <div className="flex justify-center mt-1">
                  <Sparkline data={m.sparkData} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
