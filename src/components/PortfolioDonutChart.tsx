export const DONUT_COLORS = [
  '#F0B429',
  '#4C8DFF',
  '#FF5C5C',
  '#34D399',
  '#A78BFA',
  '#FB923C',
  '#38BDF8',
  '#F472B6',
  '#94A3B8',
  '#2DD4BF',
];

interface DonutItem {
  code: string;
  name: string;
  weightPct: number;
}

export default function PortfolioDonutChart({ items }: { items: DonutItem[] }) {
  let cursor = 0;
  const stops = items.map((item, i) => {
    const start = cursor;
    const end = cursor + item.weightPct;
    cursor = end;
    return `${DONUT_COLORS[i % DONUT_COLORS.length]} ${start}% ${end}%`;
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
      <div
        className="relative h-[168px] w-[168px] flex-shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops.join(', ')})` }}
      >
        <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-panel text-center">
          <div className="text-[10px] font-bold text-text-faint">종목 수</div>
          <div className="text-xl font-extrabold text-text">{items.length}</div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {items.map((item, i) => (
          <div key={item.code} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
              style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            <span className="flex-1 truncate text-text-dim">{item.name}</span>
            <span className="mono font-semibold text-text">{item.weightPct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
