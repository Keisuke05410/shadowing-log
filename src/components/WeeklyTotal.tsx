import { getWeeklyTotal } from '../lib/stats';
import type { PracticeSession } from '../types';

interface WeeklyTotalProps {
  sessions: PracticeSession[];
}

export default function WeeklyTotal({ sessions }: WeeklyTotalProps) {
  const total = getWeeklyTotal(sessions);

  return (
    <div className="card">
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        今週
      </p>
      <p className="font-heading text-3xl font-bold mt-1" style={{ color: 'var(--text)' }}>
        {total}
        <span className="text-base font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
          分
        </span>
      </p>
    </div>
  );
}
