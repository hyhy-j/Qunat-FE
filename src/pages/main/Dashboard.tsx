import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import AgentActivityLog from '../../components/AgentActivityLog';
import LogoAnim from '../../components/LogoAnim';
import StockLogo from '../../components/StockLogo';
import IntroLoading from '../../components/IntroLoading';
import { useAppState } from '../../state/AppContext';
import { getDashboard } from '../../api/dashboard';
import { getAgentLogs } from '../../api/agentLogs';
import { buildSystemLogEntries } from '../../utils/agentLogs';
import { parseMarketReport } from '../../utils/parseMarketReport';
import type { AgentLogEntry } from '../../components/AgentActivityLog';
import type { DashboardResponse } from '../../api/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { introShown, markIntroShown, agentEvents } = useAppState();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [systemLogEntries, setSystemLogEntries] = useState<AgentLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getDashboard(), getAgentLogs().catch(() => [])])
      .then(([dashboardData, logs]) => {
        if (cancelled) return;
        setDashboard(dashboardData);
        setSystemLogEntries(buildSystemLogEntries(logs));
        setError('');
      })
      .catch(() => {
        if (!cancelled) setError('대시보드를 불러오지 못했습니다.');
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
        {!introShown && <IntroLoading onFinish={markIntroShown} />}
        <PageHeader eyebrow="DASHBOARD" title="대시보드" subtitle="오늘의 투자 현황을 한눈에 확인해보세요" />
        <div className="rounded-lg border border-line bg-panel p-10 text-center text-sm text-text-faint">
          불러오는 중...
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div>
        {!introShown && <IntroLoading onFinish={markIntroShown} />}
        <PageHeader eyebrow="DASHBOARD" title="대시보드" subtitle="오늘의 투자 현황을 한눈에 확인해보세요" />
        <div className="rounded-lg border border-line bg-panel p-10 text-center text-sm text-fall">
          {error || '대시보드를 불러오지 못했습니다.'}
        </div>
      </div>
    );
  }

  const { asset, todayReport } = dashboard;
  const holdings = dashboard.stocks.filter((s) => s.quantity > 0);
  const reportSummary = todayReport ? parseMarketReport(todayReport.content).summary : '';

  return (
    <div>
      {!introShown && <IntroLoading onFinish={markIntroShown} />}

      <PageHeader eyebrow="DASHBOARD" title="대시보드" subtitle="오늘의 투자 현황을 한눈에 확인해보세요" />

      <AgentActivityLog systemEntries={systemLogEntries} tradeEntries={agentEvents} />

      <div className="grid-tex relative mb-3 overflow-hidden rounded-[18px] border border-accent/35 p-6 shadow-[0_0_15px_rgba(255,194,59,0.08)]">
        <div className="mono mb-1.5 text-[10.5px] font-bold text-text-faint">잔고 · BALANCE</div>
        <div className="mono mb-[18px] text-[32px] font-bold tracking-[-1px] text-text">
          {asset.totalAssets.toLocaleString()}<span className="text-base font-normal text-text-faint"> 원</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-md border border-line bg-panel-elev p-3.5">
            <div className="mono mb-1.5 text-[10px] font-bold text-text-faint">오늘 수익률</div>
            <div className={'mono text-lg font-bold ' + (asset.todayPnl.rate >= 0 ? 'text-rise' : 'text-fall')}>
              {asset.todayPnl.rate >= 0 ? '+' : ''}
              {asset.todayPnl.rate.toFixed(2)}%
            </div>
          </div>
          <div className="rounded-md border border-line bg-panel-elev p-3.5">
            <div className="mono mb-1.5 text-[10px] font-bold text-text-faint">평가손익</div>
            <div className={'mono text-lg font-bold ' + (asset.cumulativePnl.amount >= 0 ? 'text-rise' : 'text-fall')}>
              {asset.cumulativePnl.amount >= 0 ? '+' : ''}
              {asset.cumulativePnl.amount.toLocaleString()}원
            </div>
          </div>
          <div className="rounded-md border border-line bg-panel-elev p-3.5">
            <div className="mono mb-1.5 text-[10px] font-bold text-text-faint">보유 종목</div>
            <div className="mono text-lg font-bold text-text">{holdings.length}종목</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
                        {h.stockCode} · {h.quantity}주 · 평균 {(h.avgPrice ?? 0).toLocaleString()}원
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-[13.5px] font-bold text-text">
                      {h.currentPrice != null ? `${h.currentPrice.toLocaleString()}원` : '가격 정보 없음'}
                    </div>
                    {pnl != null && (
                      <div className={'mono mt-0.5 text-xs font-semibold ' + (pnl >= 0 ? 'text-rise' : 'text-fall')}>
                        {pnl >= 0 ? '+' : ''}
                        {pnl.toLocaleString()}원
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate('/trade')}
              className="flex-1 rounded-md border border-accent bg-accent px-3 py-[11px] text-center text-[13.5px] font-bold text-ink-fixed hover:bg-[#ffc94d]"
            >
              매수매도
            </button>
            <button
              onClick={() => navigate('/portfolio')}
              className="flex-1 rounded-md border border-line px-3 py-[11px] text-center text-[13.5px] font-bold text-text hover:border-accent hover:text-accent"
            >
              포트폴리오 보기
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-line bg-panel p-5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent to-60%" />
          <div className="relative mb-3.5 flex items-center gap-2.5">
            <LogoAnim variant="callout" />
            <div>
              <div className="text-[10.5px] font-bold tracking-[1.5px] text-accent">오늘 시장 한줄 요약</div>
              {todayReport && (
                <div className="mt-px text-[10px] text-text-faint">
                  {todayReport.generatedAt.slice(0, 10)} 자동 생성
                </div>
              )}
            </div>
          </div>
          <div className="relative mb-4 rounded-r-[10px] rounded-bl-[10px] border border-l-[3px] border-line border-l-accent bg-panel-elev px-[18px] py-4">
            <div className="text-[15px] font-normal leading-[1.7] text-text">
              {reportSummary || '아직 생성된 리포트가 없습니다.'}
            </div>
          </div>
          <div className="relative flex justify-end">
            <button
              onClick={() => navigate('/report')}
              className="rounded-md border border-line px-3.5 py-[7px] text-xs font-bold text-text hover:border-accent hover:text-accent"
            >
              전체 리포트 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
