import { useCountUp } from '../hooks/useCountUp';
import type { PracticeSession, Material } from '../types';

interface CumulativeCardsProps {
  sessions: PracticeSession[];
  materials: Material[];
  totalMinutes: number;
  weeklyTotal: number;
}

export default function CumulativeCards({
  sessions,
  materials,
  totalMinutes,
  weeklyTotal,
}: CumulativeCardsProps) {
  const sessionCount = sessions.length;
  const materialCount = materials.length;

  const animatedMinutes = useCountUp(totalMinutes);
  const animatedSessions = useCountUp(sessionCount);
  const animatedMaterials = useCountUp(materialCount);
  const animatedWeekly = useCountUp(weeklyTotal);

  const items = [
    { value: animatedMinutes, unit: '分', label: '累計時間' },
    { value: animatedSessions, unit: '回', label: 'セッション数' },
    { value: animatedMaterials, unit: '個', label: '教材数' },
    { value: animatedWeekly, unit: '分', label: '今週' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="card">
          <p className="text-sm text-muted">{item.label}</p>
          <p className="font-heading text-3xl font-bold mt-1 text-theme">
            {item.value}
            <span className="text-base font-normal ml-1 text-muted">{item.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
