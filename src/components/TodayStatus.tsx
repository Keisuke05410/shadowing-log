import { Link } from 'react-router-dom';
import { getTodayTotal } from '../lib/stats';
import type { PracticeSession } from '../types';

interface TodayStatusProps {
  sessions: PracticeSession[];
}

export default function TodayStatus({ sessions }: TodayStatusProps) {
  const todayTotal = getTodayTotal(sessions);
  const hasPracticed = todayTotal > 0;

  return (
    <Link
      to="/record"
      className="card card-hover block text-center"
      style={hasPracticed ? { borderColor: 'var(--success)', borderLeftWidth: '4px' } : {}}
    >
      {hasPracticed ? (
        <>
          <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
            済 ✓
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            合計 {todayTotal}分
          </p>
        </>
      ) : (
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
          今日のシャドーイング、始めますか？
        </p>
      )}
    </Link>
  );
}
