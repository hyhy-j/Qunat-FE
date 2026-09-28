import type { OrderStatsHistoryPoint } from '../api/types';

export interface WeeklyPnl {
  week: string;
  pnl: number;
}

function mondayOf(dateStr: string): Date {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function weekLabel(monday: Date): string {
  return `${monday.getMonth() + 1}/${monday.getDate()}주`;
}

export function buildWeeklyPnl(history: OrderStatsHistoryPoint[]): WeeklyPnl[] {
  const sorted = [...history].sort((a, b) => (a.date < b.date ? -1 : 1));
  const weeks = new Map<string, { monday: Date; first: number; last: number; count: number }>();

  for (const point of sorted) {
    const monday = mondayOf(point.date);
    const key = monday.toISOString().slice(0, 10);
    const existing = weeks.get(key);
    if (!existing) {
      weeks.set(key, { monday, first: point.totalAssets, last: point.totalAssets, count: 1 });
    } else {
      existing.last = point.totalAssets;
      existing.count += 1;
    }
  }

  // 데이터가 하루치뿐인 주(이번 주처럼 막 시작한 주)는 손익을 계산할 수 없어 0으로 왜곡되므로 제외한다.
  return Array.from(weeks.values())
    .filter(({ count }) => count >= 2)
    .map(({ monday, first, last }) => ({
      week: weekLabel(monday),
      pnl: last - first,
    }));
}

// 아래 차트 좌표계는 가로는 전부 %(0~100, 컨테이너 폭에 맞춰 자연스럽게 늘어남),
// 세로는 고정 px(컨테이너 높이가 고정이라 절대 왜곡되지 않음)로 분리했다.
// 화면 폭이 얼마든 텍스트·점이 옆으로 눌리거나 늘어나지 않게 하기 위함이다.

export interface WeeklyChartBar {
  week: string;
  pnl: number;
  isUp: boolean;
  widthPct: number;
  y: number;
  height: number;
  cxPct: number;
}

export interface WeeklyChartGridline {
  value: number;
  y: number;
  label: string;
}

export interface WeeklyChart {
  height: number;
  midY: number;
  bars: WeeklyChartBar[];
  points: { xPct: number; y: number }[];
  gridlines: WeeklyChartGridline[];
}

const CHART_HEIGHT = 180;
const BAR_MAX_HALF = 70;

// 눈금이 "62,483원" 같은 어중간한 값이 아니라 만원 단위로 딱 떨어지도록 올림한다.
function niceOuterValue(maxAbsPnl: number): number {
  const step = 10000;
  return Math.max(Math.ceil(maxAbsPnl / step) * step, step);
}

function formatWon(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toLocaleString()}원`;
}

export function buildWeeklyChart(weeklyPnl: WeeklyPnl[]): WeeklyChart {
  const midY = CHART_HEIGHT / 2;
  if (weeklyPnl.length === 0) {
    return { height: CHART_HEIGHT, midY, bars: [], points: [], gridlines: [] };
  }

  const slotPct = 100 / weeklyPnl.length;
  const barWidthPct = slotPct * 0.5;
  const maxAbsPnl = Math.max(...weeklyPnl.map((w) => Math.abs(w.pnl)), 1);
  const outerValue = niceOuterValue(maxAbsPnl);

  const bars: WeeklyChartBar[] = weeklyPnl.map((w, i) => {
    const cxPct = slotPct * (i + 0.5);
    const isUp = w.pnl >= 0;
    const barHeight = Math.max((Math.abs(w.pnl) / outerValue) * BAR_MAX_HALF, 4);
    return {
      week: w.week,
      pnl: w.pnl,
      isUp,
      cxPct,
      widthPct: barWidthPct,
      y: isUp ? midY - barHeight : midY,
      height: barHeight,
    };
  });

  // 각 막대의 끝(중앙) 지점을 그대로 이어서 추이선을 그린다 (별도 스케일 없음).
  const points = bars.map((b) => ({
    xPct: b.cxPct,
    y: b.isUp ? b.y : b.y + b.height,
  }));

  const halfOuterValue = outerValue / 2;
  const gridlines: WeeklyChartGridline[] = [
    { value: outerValue, y: midY - BAR_MAX_HALF, label: formatWon(outerValue) },
    { value: halfOuterValue, y: midY - BAR_MAX_HALF / 2, label: formatWon(halfOuterValue) },
    { value: 0, y: midY, label: '0원' },
    { value: -halfOuterValue, y: midY + BAR_MAX_HALF / 2, label: formatWon(-halfOuterValue) },
    { value: -outerValue, y: midY + BAR_MAX_HALF, label: formatWon(-outerValue) },
  ];

  return { height: CHART_HEIGHT, midY, bars, points, gridlines };
}
