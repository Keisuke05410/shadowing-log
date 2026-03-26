interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function Sparkline({
  data,
  width = 80,
  height = 24,
  color = 'var(--accent)',
}: SparklineProps) {
  if (data.length === 0) return null;

  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = padding + (i / Math.max(data.length - 1, 1)) * innerW;
      const y = padding + innerH - ((v - min) / range) * innerH;
      return `${x},${y}`;
    })
    .join(' ');

  const firstX = padding;
  const lastX = padding + innerW;
  const bottomY = height - padding;
  const fillPoints = `${firstX},${bottomY} ${points} ${lastX},${bottomY}`;

  return (
    <svg width={width} height={height} className="block">
      <polygon points={fillPoints} fill={color} opacity={0.12} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
