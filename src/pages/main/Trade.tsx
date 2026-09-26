import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StockSelect from '../../components/StockSelect';
import StockLogo from '../../components/StockLogo';
import { useAppState } from '../../state/AppContext';
import { getDashboard } from '../../api/dashboard';
import { getOrders, getTradableStocks, placeOrder } from '../../api/trade';
import { ApiError } from '../../api/client';
import type { DashboardStockSummary, OrderSide, TradableStockResponse } from '../../api/types';

const INITIAL_BALANCE = 10000000;
const AGENT3_MESSAGE = '보유 종목과 잔고를 기준으로 리스크 검사를 수행하고 이상 없음을 확인했습니다.';

export default function Trade() {
  const navigate = useNavigate();
  const { pushAgentEvent } = useAppState();

  const [stocks, setStocks] = useState<TradableStockResponse[]>([]);
  const [holdings, setHoldings] = useState<DashboardStockSummary[]>([]);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [loading, setLoading] = useState(true);

  const [side, setSide] = useState<OrderSide>('BUY');
  const [code, setCode] = useState('');
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    setLoading(true);
    return Promise.all([
      getTradableStocks(),
      getDashboard().catch(() => null),
      getOrders(0, 1).catch(() => null),
    ])
      .then(([stockList, dashboard, orders]) => {
        setStocks(stockList);
        setCode((prev) => prev || stockList[0]?.code || '');
        setHoldings((dashboard?.stocks ?? []).filter((s) => s.quantity > 0));
        setBalance(orders?.content[0]?.balanceAfter ?? INITIAL_BALANCE);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stock = stocks.find((o) => o.code === code) ?? stocks[0];
  const price = stock?.price ?? 0;
  const amount = qty * price;
  const balanceAfter = side === 'BUY' ? balance - amount : balance + amount;

  const handleSubmit = async () => {
    if (!stock) return;
    setMessage(null);
    setSubmitting(true);
    try {
      const result = await placeOrder({
        stockName: stock.name,
        side,
        quantity: qty,
        orderAmount: amount,
      });
      setMessage({ type: 'success', text: result.message || '주문이 체결되었습니다.' });
      setBalance(result.balanceAfter);
      pushAgentEvent(AGENT3_MESSAGE);
      loadData();
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof ApiError ? e.message : '주문 처리 중 오류가 발생했습니다.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="TRADING" title="매수매도" subtitle="AI가 분석한 시장 흐름을 참고해 원하는 종목을 직접 사고팔아보세요" />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-panel p-[22px]">
          <div className="mb-3.5 text-[13.5px] font-bold text-text">주문 입력</div>
          <div className="mb-3.5 flex gap-2">
            <button
              onClick={() => setSide('BUY')}
              className={
                'flex-1 rounded-md border px-2.5 py-2.5 text-[13.5px] font-bold transition-colors ' +
                (side === 'BUY' ? 'border-rise bg-rise/[0.08] text-rise' : 'border-line text-text-faint')
              }
            >
              매수
            </button>
            <button
              onClick={() => setSide('SELL')}
              className={
                'flex-1 rounded-md border px-2.5 py-2.5 text-[13.5px] font-bold transition-colors ' +
                (side === 'SELL' ? 'border-fall bg-fall/[0.08] text-fall' : 'border-line text-text-faint')
              }
            >
              매도
            </button>
          </div>

          <div className="mb-[13px]">
            <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[1px] text-text-faint">
              종목
            </label>
            <StockSelect stocks={stocks} value={code} onChange={setCode} disabled={loading || stocks.length === 0} />
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
              <span className="mono font-bold text-text">
                {stock?.price != null ? `${price.toLocaleString()}원` : '가격 정보 없음'}
              </span>
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

          {message && (
            <div className={'mb-3.5 text-[12.5px] ' + (message.type === 'success' ? 'text-rise' : 'text-fall')}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !stock || stock.price == null}
            className="w-full rounded-md border border-accent bg-accent px-3 py-[13px] text-center text-sm font-bold text-ink-fixed transition-colors hover:enabled:bg-[#ffc94d] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? '처리 중...' : '주문 실행'}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-[18px] border border-accent/35 p-6 shadow-[0_0_15px_rgba(255,194,59,0.08)]">
            <div className="mono mb-1.5 text-[10.5px] font-bold text-text-faint">잔고 · BALANCE</div>
            <div className="mono text-[26px] font-bold text-text">{balance.toLocaleString()}원</div>
          </div>
          <div className="rounded-lg border border-line bg-panel p-[22px]">
            <div className="mb-3.5 text-[13.5px] font-bold text-text">보유 종목</div>
            {holdings.length === 0 ? (
              <div className="py-4 text-center text-[12.5px] text-text-faint">보유 중인 종목이 없습니다.</div>
            ) : (
              holdings.map((h) => {
                const pnl = h.unrealizedPnl?.amount ?? null;
                return (
                  <div
                    key={h.stockCode}
                    className="flex items-center justify-between border-b border-line-soft py-[11px] last:border-b-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <StockLogo code={h.stockCode} name={h.stockName} />
                      <div>
                        <div className="text-[13.5px] font-semibold text-text">{h.stockName}</div>
                        <div className="mono text-[11px] text-text-faint">
                          {h.quantity}주 · 평균 {(h.avgPrice ?? 0).toLocaleString()}원
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {pnl != null ? (
                        <div className={'mono text-[13.5px] font-bold ' + (pnl >= 0 ? 'text-rise' : 'text-fall')}>
                          {pnl >= 0 ? '+' : ''}
                          {pnl.toLocaleString()}원
                        </div>
                      ) : (
                        <div className="mono text-[13.5px] font-bold text-text-faint">-</div>
                      )}
                      <div className="text-[11px] text-text-faint">평가손익</div>
                    </div>
                  </div>
                );
              })
            )}
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
