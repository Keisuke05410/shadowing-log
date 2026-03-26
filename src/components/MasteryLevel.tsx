import { useMemo } from 'react';
import { getMasteryLevel } from '../lib/mastery';
import { useCountUp } from '../hooks/useCountUp';

interface MasteryLevelProps {
  totalMinutes: number;
}

export default function MasteryLevel({ totalMinutes }: MasteryLevelProps) {
  const info = useMemo(() => getMasteryLevel(totalMinutes), [totalMinutes]);
  const animatedProgress = useCountUp(Math.round(info.progressPercent));

  return (
    <div className="card">
      <p className="text-sm text-muted">習熟レベル</p>
      <p className="font-heading text-3xl font-bold mt-1" style={{ color: 'var(--accent)' }}>
        {info.level.rank}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div
          className="flex-1 h-2 rounded-full overflow-hidden"
          style={{ background: 'var(--accent-soft)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              background: 'var(--accent)',
              width: `${animatedProgress}%`,
            }}
          />
        </div>
        <span className="font-heading text-sm font-medium text-muted">{animatedProgress}%</span>
      </div>

      <p className="text-sm text-muted mt-2">
        {info.nextLevel ? (
          <>
            次のレベル: <span className="text-theme font-medium">{info.nextLevel.rank}</span>{' '}
            まであと {info.remainingHours}時間{info.remainingMins}分
          </>
        ) : (
          '最高レベル達成！'
        )}
      </p>
    </div>
  );
}
