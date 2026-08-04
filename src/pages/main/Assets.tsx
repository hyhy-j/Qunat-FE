import PageHeader from '../../components/PageHeader';
import { orderHistory, weeklyPnl } from '../../data/mock';

export default function Assets() {
  const maxAbsPnl = Math.max(...weeklyPnl.map((w) => Math.abs(w.pnl)));

  return (
    <div>
      <PageHeader eyebrow="MY ASSETS" title="나의 자산" subtitle="지금까지의 거래 내역과 손익 흐름을 확인해보세요" />

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">총 체결 건수</div>
          <div className="mono text-[22px] font-bold text-accent">{orderHistory.length}건</div>
        </div>
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">실현 손익</div>
          <div className="mono text-[22px] font-bold text-rise">+8,000원</div>
        </div>
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">누적 체결금액</div>
          <div className="mono text-xl font-bold text-accent">3,199,500원</div>
        </div>
      </div>

      <div className="mb-3 overflow-x-auto rounded-lg border border-line bg-panel p-[22px]">
        <div className="mb-3.5 text-[13.5px] font-bold text-text">거래 내역</div>
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
            {orderHistory.map((o, i) => (
              <tr key={i}>
                <td className="mono border-b border-line-soft px-[11px] py-3 text-[11.5px] text-text-faint last:border-b-0">
                  {o.datetime}
                </td>
                <td className="border-b border-line-soft px-[11px] py-3 last:border-b-0">
                  <div className="font-bold text-accent">{o.name}</div>
                  <div className="mono text-[10.5px] text-text-faint">{o.code}</div>
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
                <td className="mono border-b border-line-soft px-[11px] py-3 text-text last:border-b-0">{o.qty}주</td>
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
      </div>

      <div className="rounded-lg border border-line bg-panel p-[22px]">
        <div className="mb-4 text-[13.5px] font-bold text-text">주별 손익</div>
        <div className="flex h-[160px] items-stretch gap-4 px-2">
          {weeklyPnl.map((w) => {
            const barHeight = Math.max((Math.abs(w.pnl) / maxAbsPnl) * 56, 4);
            const isUp = w.pnl >= 0;
            return (
              <div key={w.week} className="flex flex-1 flex-col items-center">
                <div className="relative h-[120px] w-full">
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-line-soft" />
                  <div
                    className={'absolute left-1/2 w-7 -translate-x-1/2 ' + (isUp ? 'rounded-t-sm bg-rise' : 'rounded-b-sm bg-fall')}
                    style={
                      isUp
                        ? { bottom: '50%', height: barHeight }
                        : { top: '50%', height: barHeight }
                    }
                  />
                </div>
                <div className="mono mt-2 text-[11px] text-text-faint">{w.week}</div>
                <div className={'mono text-xs font-semibold ' + (isUp ? 'text-rise' : 'text-fall')}>
                  {isUp ? '+' : ''}
                  {w.pnl.toLocaleString()}원
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
