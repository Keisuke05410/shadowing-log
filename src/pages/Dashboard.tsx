import { Link } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { calculateStreak } from '../lib/streak';
import TodayStatus from '../components/TodayStatus';
import StreakDisplay from '../components/StreakDisplay';
import WeeklyTotal from '../components/WeeklyTotal';
import Heatmap from '../components/Heatmap';

export default function Dashboard() {
  const { data } = useAppData();
  const { sessions, materials } = data;
  const streak = calculateStreak(sessions);
  const hasAnyRecords = sessions.length > 0;

  if (!hasAnyRecords) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center py-16">
          <p className="font-heading text-4xl mb-2" style={{ color: 'var(--text-faint)' }}>
            ✦
          </p>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            まだ練習記録がありません。最初の記録を追加しましょう！
          </p>
          <Link
            to="/record"
            className="inline-block rounded-full px-6 py-3 text-base font-medium text-white transition-colors"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            記録する
          </Link>
        </div>
        <Heatmap sessions={sessions} materials={materials} />
      </div>
    );
  }

  return (
    <div className="space-y-4 stagger-children">
      <TodayStatus sessions={sessions} />
      <StreakDisplay streak={streak} hasAnyRecords={hasAnyRecords} />
      <WeeklyTotal sessions={sessions} />
      <Heatmap sessions={sessions} materials={materials} />
    </div>
  );
}
