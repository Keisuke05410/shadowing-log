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
      className={`card card-hover block text-center ${hasPracticed ? 'border-success' : ''}`}
      style={hasPracticed ? { borderLeftWidth: '4px' } : {}}
    >
      {hasPracticed ? (
        <>
          <p className="text-2xl font-bold text-success">済 ✓</p>
          <p className="text-sm mt-1 text-muted">合計 {todayTotal}分</p>
        </>
      ) : (
        <p className="text-lg text-muted">今日のシャドーイング、始めますか？</p>
      )}
    </Link>
  );
}
