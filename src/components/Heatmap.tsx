import { useNavigate } from 'react-router-dom';
import { ActivityCalendar } from 'react-activity-calendar';
import type { Activity, BlockElement } from 'react-activity-calendar';
import type { PracticeSession, Material } from '../types';
import { buildHeatmapData, getDaySummary } from '../lib/heatmap';

interface HeatmapProps {
  sessions: PracticeSession[];
  materials: Material[];
}

export default function Heatmap({ sessions, materials }: HeatmapProps) {
  const navigate = useNavigate();
  const heatmapData = buildHeatmapData(sessions);

  const materialMap = new Map(materials.map((m) => [m.id, m.name]));

  const handleClick = (date: string) => {
    navigate('/history', { state: { jumpToDate: date } });
  };

  const renderBlock = (block: BlockElement, activity: Activity) => {
    if (activity.count === 0) return block;
    const summary = getDaySummary(sessions, activity.date, materialMap);
    const tooltip = `${summary.sessionCount}件 ・ ${summary.totalMinutes}分 — ${summary.materialNames.join(', ')}`;
    return (
      <g onClick={() => handleClick(activity.date)} style={{ cursor: 'pointer' }}>
        <title>{tooltip}</title>
        {block}
      </g>
    );
  };

  return (
    <div className="card overflow-x-auto">
      <ActivityCalendar
        data={heatmapData}
        theme={{
          dark: ['#e8e2db', '#f5e6d3', '#e8b87a', '#d4873f', '#b06a2a'],
          light: ['#e8e2db', '#f5e6d3', '#e8b87a', '#d4873f', '#b06a2a'],
        }}
        blockSize={12}
        blockMargin={3}
        fontSize={12}
        showWeekdayLabels
        renderBlock={renderBlock}
      />
    </div>
  );
}
