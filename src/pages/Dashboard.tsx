import { useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { calculateStreak } from '../lib/streak';
import { getCumulativeTotal, getWeeklyTotal } from '../lib/stats';
import TodayStatus from '../components/TodayStatus';
import StreakDisplay from '../components/StreakDisplay';
import CumulativeCards from '../components/CumulativeCards';
import MasteryLevel from '../components/MasteryLevel';
import RollingComparison from '../components/RollingComparison';
import Heatmap from '../components/Heatmap';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const { data } = useAppData();
  const { sessions, materials } = data;
  const streak = useMemo(() => calculateStreak(sessions), [sessions]);
  const totalMinutes = useMemo(() => getCumulativeTotal(sessions), [sessions]);
  const weeklyTotal = useMemo(() => getWeeklyTotal(sessions), [sessions]);
  const hasAnyRecords = sessions.length > 0;

  if (!hasAnyRecords) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <EmptyState
          icon="✦"
          message="まだ練習記録がありません。最初の記録を追加しましょう！"
          linkTo="/record"
          linkLabel="記録する"
        />
        <Heatmap sessions={sessions} materials={materials} />
      </div>
    );
  }

  return (
    <div className="space-y-4 stagger-children">
      <TodayStatus sessions={sessions} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StreakDisplay streak={streak} hasAnyRecords={hasAnyRecords} />
        <MasteryLevel totalMinutes={totalMinutes} />
      </div>

      <CumulativeCards
        sessions={sessions}
        materials={materials}
        totalMinutes={totalMinutes}
        weeklyTotal={weeklyTotal}
      />

      <RollingComparison sessions={sessions} />
      <Heatmap sessions={sessions} materials={materials} />
    </div>
  );
}
