import type { StreakInfo } from '../lib/streak';

interface StreakDisplayProps {
  streak: StreakInfo;
  hasAnyRecords: boolean;
}

export default function StreakDisplay({ streak, hasAnyRecords }: StreakDisplayProps) {
  const { current, longest, hasRecordToday, previousStreak } = streak;

  const showBreakMessage = current === 0 && hasAnyRecords;

  return (
    <div className="card">
      <div className="flex items-baseline justify-between">
        <div>
          <p
            className={`font-heading text-5xl font-bold leading-none ${current > 0 ? 'text-accent' : 'text-theme'}`}
          >
            {current}
          </p>
          <p className="text-sm mt-2 text-muted">日連続</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-faint">過去最長</p>
          <p className="font-heading text-xl font-semibold text-muted">
            {longest}日
          </p>
        </div>
      </div>

      {!hasRecordToday && current > 0 && (
        <p className="text-sm mt-3 text-faint">今日はまだ記録がありません</p>
      )}

      {showBreakMessage && (
        <p className="text-sm mt-3 text-muted">
          {previousStreak}日間の記録がありました。また今日から始めましょう
        </p>
      )}
    </div>
  );
}
