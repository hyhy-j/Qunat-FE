import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { getDashboard } from '../../api/dashboard';
import { getOrders, getOrderStats, getTradableStocks } from '../../api/trade';
import { buildWeeklyChart, buildWeeklyPnl, type WeeklyPnl } from '../../utils/weeklyPnl';
import type { OrderStatsResponse, PnlInfo, TradeOrderResponse } from '../../api/types';

const PAGE_SIZE = 100;

export default function Assets() {
  const [orders, setOrders] = useState<TradeOrderResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<OrderStatsResponse | null>(null);
  const [cumulativePnl, setCumulativePnl] = useState<PnlInfo | null>(null);
  const [stockNames, setStockNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getOrders(0, PAGE_SIZE), getOrderStats(), getTradableStocks(), getDashboard()])
      .then(([ordersPage, statsData, stockList, dashboard]) => {
        if (cancelled) return;
        setOrders(ordersPage.content);
        setTotalCount(ordersPage.totalElements);
        setStats(statsData);
        setCumulativePnl(dashboard.asset.cumulativePnl);
        setStockNames(Object.fromEntries(stockList.map((s) => [s.code, s.name])));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader eyebrow="MY ASSETS" title="나의 자산" subtitle="지금까지의 거래 내역과 손익 흐름을 확인해보세요" />
        <div className="rounded-lg border border-line bg-panel p-10 text-center text-sm text-text-faint">
          불러오는 중...
        </div>
      </div>
    );
  }

  if (error || !stats || !cumulativePnl) {
    return (
      <div>
        <PageHeader eyebrow="MY ASSETS" title="나의 자산" subtitle="지금까지의 거래 내역과 손익 흐름을 확인해보세요" />
        <div className="rounded-lg border border-line bg-panel p-10 text-center text-sm text-fall">
          자산 정보를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);
  const weeklyPnl: WeeklyPnl[] = buildWeeklyPnl(stats.history);
  const chart = buildWeeklyChart(weeklyPnl);

  return (
    <div>
      <PageHeader eyebrow="MY ASSETS" title="나의 자산" subtitle="지금까지의 거래 내역과 손익 흐름을 확인해보세요" />

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">총 체결 건수</div>
          <div className="mono text-[22px] font-bold text-accent">{totalCount}건</div>
        </div>
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">누적 손익</div>
          <div className={'mono text-[22px] font-bold ' + (cumulativePnl.amount >= 0 ? 'text-rise' : 'text-fall')}>
            {cumulativePnl.amount >= 0 ? '+' : ''}
            {cumulativePnl.amount.toLocaleString()}원
          </div>
        </div>
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">누적 체결금액</div>
          <div className="mono text-xl font-bold text-accent">{totalAmount.toLocaleString()}원</div>
        </div>
      </div>

      <div className="mb-3 overflow-x-auto rounded-lg border border-line bg-panel p-[22px]">
        <div className="mb-3.5 text-[13.5px] font-bold text-text">거래 내역</div>
        {orders.length === 0 ? (
          <div className="py-6 text-center text-[12.5px] text-text-faint">거래 내역이 없습니다.</div>
        ) : (
          <table className="w-full min-w-[640px] border-collapse text-[12.5px]">
            <thead>
              <tr>
                {['체결 일시', '종목', '구분', '수량', '체결가', '체결금액', '체결 후 잔고'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-line px-[11px] py-[9px] text-left text-[10px] font-bold uppercase tracking-[0.6px] text-text-faint"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="mono border-b border-line-soft px-[11px] py-3 text-[11.5px] text-text-faint last:border-b-0">
                    {o.executedAt.replace('T', ' ').slice(0, 16)}
                  </td>
                  <td className="border-b border-line-soft px-[11px] py-3 last:border-b-0">
                    <div className="font-bold text-accent">{stockNames[o.stockCode] ?? o.stockCode}</div>
                    <div className="mono text-[10.5px] text-text-faint">{o.stockCode}</div>
                  </td>
                  <td className="border-b border-line-soft px-[11px] py-3 last:border-b-0">
                    <span
                      className={
                        'inline-flex items-center rounded px-[9px] py-1 text-[10.5px] font-bold tracking-[0.3px] ' +
                        (o.side === 'BUY'
                          ? 'border border-rise/35 bg-rise/[0.08] text-rise'
                          : 'border border-fall/35 bg-fall/[0.08] text-fall')
                      }
                    >
                      {o.side}
                    </span>
                  </td>
                  <td className="mono border-b border-line-soft px-[11px] py-3 text-text last:border-b-0">{o.quantity}주</td>
                  <td className="mono border-b border-line-soft px-[11px] py-3 text-text last:border-b-0">
                    {o.price.toLocaleString()}원
                  </td>
                  <td className="mono border-b border-line-soft px-[11px] py-3 text-text last:border-b-0">
                    {o.amount.toLocaleString()}원
                  </td>
                  <td className="mono border-b border-line-soft px-[11px] py-3 text-text last:border-b-0">
                    {o.balanceAfter.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-lg border border-line bg-panel p-[22px]">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-[13.5px] font-bold text-text">주별 손익</div>
          <div className="flex items-center gap-3.5 text-[10.5px] text-text-faint">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ background: '#FF5C5C' }} />
              주별 손익
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-[2px] w-3 rounded-full" style={{ background: '#F0B429' }} />
              추이
            </span>
          </div>
        </div>
        {weeklyPnl.length === 0 ? (
          <div className="py-6 text-center text-[12.5px] text-text-faint">아직 데이터가 없습니다.</div>
        ) : (
          <>
            {/* 가로는 전부 %(컨테이너 폭에 맞춰 늘어남), 세로는 고정 px(컨테이너 높이 고정)로 분리해서
                화면 폭이 얼마든 눈금 글자·점이 옆으로 눌리거나 늘어나지 않게 한다. */}
            <div className="flex" style={{ height: chart.height }}>
              <div className="relative w-[72px] flex-shrink-0">
                {chart.gridlines.map((g) => (
                  <div
                    key={g.value}
                    className="mono absolute right-2 -translate-y-1/2 whitespace-nowrap text-[10.5px] text-text-faint"
                    style={{ top: g.y }}
                  >
                    {g.label}
                  </div>
                ))}
              </div>
              <div className="relative flex-1">
                {chart.gridlines.map((g) => (
                  <div
                    key={g.value}
                    className={'absolute left-0 right-0 border-t ' + (g.value === 0 ? 'border-line' : 'border-line-soft')}
                    style={{ top: g.y }}
                  />
                ))}
                {chart.bars.map((b) => (
                  <div
                    key={b.week}
                    className="absolute -translate-x-1/2 rounded-[3px]"
                    style={{
                      left: `${b.cxPct}%`,
                      width: `${b.widthPct}%`,
                      maxWidth: 40,
                      top: b.y,
                      height: b.height,
                      background: b.isUp ? '#FF5C5C' : '#4C8DFF',
                    }}
                  />
                ))}
                <svg
                  className="absolute inset-0 h-full w-full overflow-visible"
                  viewBox={`0 0 100 ${chart.height}`}
                  preserveAspectRatio="none"
                >
                  {chart.points.length > 0 && (
                    <path
                      d={chart.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.xPct.toFixed(2)},${p.y.toFixed(1)}`).join(' ')}
                      fill="none"
                      stroke="#F0B429"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </svg>
                {chart.points.map((p, i) => (
                  <div
                    key={i}
                    className="absolute h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: `${p.xPct}%`, top: p.y, background: '#F0B429' }}
                  />
                ))}
              </div>
            </div>
            <div className="flex">
              <div className="w-[72px] flex-shrink-0" />
              <div className="mt-2 flex flex-1">
                {weeklyPnl.map((w) => (
                  <div key={w.week} className="flex flex-1 flex-col items-center">
                    <div className="mono text-[11px] text-text-faint">{w.week}</div>
                    <div className={'mono text-xs font-semibold ' + (w.pnl >= 0 ? 'text-rise' : 'text-fall')}>
                      {w.pnl >= 0 ? '+' : ''}
                      {w.pnl.toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
