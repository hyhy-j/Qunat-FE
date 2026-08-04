import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { holdings, tradeOptions } from '../../data/mock';

const BALANCE = 9928500;

export default function Trade() {
  const navigate = useNavigate();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [code, setCode] = useState(tradeOptions[0].code);
  const [qty, setQty] = useState(1);

  const stock = tradeOptions.find((o) => o.code === code) ?? tradeOptions[0];
  const amount = qty * stock.price;
  const balanceAfter = BALANCE - amount;

  return (
    <div>
      <PageHeader eyebrow="TRADING" title="매수매도" subtitle="AI가 분석한 시장 흐름을 참고해 원하는 종목을 직접 사고팔아보세요" />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-panel p-[22px]">
          <div className="mb-3.5 text-[13.5px] font-bold text-text">주문 입력</div>
          <div className="mb-3.5 flex gap-2">
            <button
              onClick={() => setSide('buy')}
              className={
                'flex-1 rounded-md border px-2.5 py-2.5 text-[13.5px] font-bold transition-colors ' +
                (side === 'buy' ? 'border-rise bg-rise/[0.08] text-rise' : 'border-line text-text-faint')
              }
            >
              매수
            </button>
            <button
              onClick={() => setSide('sell')}
              className={
                'flex-1 rounded-md border px-2.5 py-2.5 text-[13.5px] font-bold transition-colors ' +
                (side === 'sell' ? 'border-fall bg-fall/[0.08] text-fall' : 'border-line text-text-faint')
              }
            >
              매도
            </button>
          </div>

          <div className="mb-[13px]">
            <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[1px] text-text-faint">
              종목
            </label>
            <select
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full cursor-pointer rounded-md border border-line bg-panel-elev px-[13px] py-[11px] text-[13.5px] text-text outline-none focus:border-accent"
            >
              {tradeOptions.map((o) => (
                <option key={o.code} value={o.code}>
                  {o.code} — {o.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-[13px]">
            <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[1px] text-text-faint">
              수량
            </label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="mono w-full rounded-md border border-line bg-panel-elev px-[13px] py-[11px] text-[13.5px] text-text outline-none focus:border-accent"
            />
          </div>

          <div className="mb-3.5 rounded-lg border border-line bg-panel-elev px-[15px] py-[13px]">
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-text-faint">현재가</span>
              <span className="mono font-bold text-text">{stock.price.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-text-faint">예상 체결금액</span>
              <span className="mono font-bold text-text">{amount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between py-1.5 text-[13px]">
              <span className="text-text-faint">체결 후 잔고</span>
              <span className="mono font-bold text-text">{balanceAfter.toLocaleString()}원</span>
            </div>
          </div>

          <button className="w-full rounded-md border border-accent bg-accent px-3 py-[13px] text-center text-sm font-bold text-ink-fixed hover:bg-[#ffc94d]">
            주문 실행
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-[18px] border border-accent/35 p-6 shadow-[0_0_15px_rgba(255,194,59,0.08)]">
            <div className="mono mb-1.5 text-[10.5px] font-bold text-text-faint">잔고 · BALANCE</div>
            <div className="mono text-[26px] font-bold text-text">{BALANCE.toLocaleString()}원</div>
          </div>
          <div className="rounded-lg border border-line bg-panel p-[22px]">
            <div className="mb-3.5 text-[13.5px] font-bold text-text">보유 종목</div>
            {holdings.map((h) => {
              const pnl = (h.curPrice - h.avgPrice) * h.qty;
              return (
                <div key={h.code} className="flex items-center justify-between border-b border-line-soft py-[11px] last:border-b-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[5px] border border-line bg-panel-elev text-[10px] font-bold text-text-dim">
                      {h.short}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold text-text">{h.name}</div>
                      <div className="mono text-[11px] text-text-faint">
                        {h.qty}주 · 평균 {h.avgPrice.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-[13.5px] font-bold text-rise">
                      {pnl >= 0 ? '+' : ''}
                      {pnl.toLocaleString()}원
                    </div>
                    <div className="text-[11px] text-text-faint">평가손익</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate('/assets')}
          className="rounded-md border border-line px-3.5 py-[9px] text-xs font-bold text-text hover:border-accent hover:text-accent"
        >
          나의 자산 보러가기 →
        </button>
      </div>
    </div>
  );
}
