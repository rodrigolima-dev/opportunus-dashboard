import { formatDay, formatNumber } from "@/lib/format";

export function TrendChart({ points, label, color = "#a94c61", currency = false }: { points: { day: string; value: number }[]; label: string; color?: string; currency?: boolean }) {
  const width = 780;
  const height = 250;
  const padding = 28;
  const max = Math.max(1, ...points.map((point) => point.value));
  const xy = points.map((point, index) => ({
    x: padding + index * ((width - padding * 2) / Math.max(1, points.length - 1)),
    y: height - padding - (point.value / max) * (height - padding * 2)
  }));
  const line = xy.map(({ x, y }) => `${x},${y}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;
  const ticks = [0, Math.floor((points.length - 1) / 2), points.length - 1];

  return <div className="trend-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} preserveAspectRatio="none">
    <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".22" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
    {[.25, .5, .75, 1].map((ratio) => <line key={ratio} x1={padding} x2={width - padding} y1={height - padding - ratio * (height - padding * 2)} y2={height - padding - ratio * (height - padding * 2)} stroke="#e8dfdc" strokeDasharray="4 6" />)}
    <polygon points={area} fill="url(#chart-fill)" />
    <polyline points={line} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    {xy.map(({ x, y }, index) => index === xy.length - 1 ? <circle key={index} cx={x} cy={y} r="6" fill={color} stroke="white" strokeWidth="3" /> : null)}
  </svg><div className="chart-axis">{ticks.map((index) => <span key={index}>{formatDay(points[index].day)}</span>)}</div><span className="sr-only">Maior valor: {currency ? "R$ " : ""}{formatNumber(max)}.</span></div>;
}
