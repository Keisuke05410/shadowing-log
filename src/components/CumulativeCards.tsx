import { getCumulativeTotal } from '../lib/stats';
import { useCountUp } from '../hooks/useCountUp';
import type { PracticeSession, Material } from '../types';

interface CumulativeCardsProps {
  sessions: PracticeSession[];
  materials: Material[];
}

export default function CumulativeCards({ sessions, materials }: CumulativeCardsProps) {
  const totalMinutes = getCumulativeTotal(sessions);
  const sessionCount = sessions.length;
  const materialCount = materials.length;

  const animatedMinutes = useCountUp(totalMinutes);
  const animatedSessions = useCountUp(sessionCount);
  const animatedMaterials = useCountUp(materialCount);

  const items = [
    { value: animatedMinutes, unit: '分', label: '累計時間' },
    { value: animatedSessions, unit: '回', label: 'セッション数' },
    { value: animatedMaterials, unit: '個', label: '教材数' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
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
