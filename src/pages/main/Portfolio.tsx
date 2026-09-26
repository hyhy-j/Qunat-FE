import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Accordion from '../../components/Accordion';
import InfoTip from '../../components/InfoTip';
import PortfolioDonutChart from '../../components/PortfolioDonutChart';
import { useAppState } from '../../state/AppContext';
import { getLatestPortfolio } from '../../api/portfolio';
import { ApiError } from '../../api/client';
import type { PortfolioResponse } from '../../api/types';

const CHART_WIDTH = 640;
const CHART_HEIGHT = 140;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 21;

function buildCurvePaths(curve: number[]) {
  if (curve.length === 0) return { linePath: '', areaPath: '' };
  const min = Math.min(...curve);
  const max = Math.max(...curve);
  const range = max - min || 1;
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const points = curve.map((v, i) => {
    const x = curve.length === 1 ? 0 : (i / (curve.length - 1)) * CHART_WIDTH;
    const y = PADDING_TOP + (1 - (v - min) / range) * plotHeight;
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [firstX] = points[0];
  const [lastX] = points[points.length - 1];
  const areaPath = `${linePath} L${lastX.toFixed(1)},${CHART_HEIGHT} L${firstX.toFixed(1)},${CHART_HEIGHT}Z`;

  return { linePath, areaPath };
}

export default function Portfolio() {
  const navigate = useNavigate();
  const { profile } = useAppState();
  const badge = profile?.type ?? 'NEUTRAL';
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getLatestPortfolio()
      .then((data) => {
        if (!cancelled) setPortfolio(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof ApiError && e.code === 'PF001' ? 'notfound' : 'error');
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
        <PageHeader eyebrow="PORTFOLIO" title="포트폴리오" subtitle="투자 성향과 시장 데이터를 반영한 맞춤형 포트폴리오를 확인해보세요" />
        <div className="rounded-lg border border-line bg-panel p-10 text-center text-sm text-text-faint">
          불러오는 중...
        </div>
      </div>
    );
  }

  if (error === 'notfound') {
    return (
      <div>
        <PageHeader eyebrow="PORTFOLIO" title="포트폴리오" subtitle="투자 성향과 시장 데이터를 반영한 맞춤형 포트폴리오를 확인해보세요" />
        <div className="flex flex-col items-center justify-center rounded-lg border border-line bg-panel px-6 py-20 text-center">
          <div className="mb-2 text-sm font-bold text-text">아직 생성된 포트폴리오가 없습니다</div>
          <div className="text-xs text-text-faint">매주 월요일 자동으로 생성됩니다. 잠시 후 다시 확인해주세요.</div>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div>
        <PageHeader eyebrow="PORTFOLIO" title="포트폴리오" subtitle="투자 성향과 시장 데이터를 반영한 맞춤형 포트폴리오를 확인해보세요" />
        <div className="rounded-lg border border-line bg-panel p-10 text-center text-sm text-fall">
          포트폴리오를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  const entries = Object.entries(portfolio.portfolio).sort(([, a], [, b]) => b.weight - a.weight);
  const items = entries.map(([code, info]) => ({
    code,
    name: info.name,
    weightPct: Math.round(info.weight * 1000) / 10,
    amount: info.amount,
    quantity: info.quantity,
    reason: info.reason,
  }));
  const maxWeightPct = Math.max(...items.map((i) => i.weightPct), 1);
  const nameByCode = Object.fromEntries(items.map((item) => [item.code, item.name]));
  const accordionItems = items.map((item) => ({
    code: item.code,
    name: item.name,
    weightPct: item.weightPct,
    weightBar: Math.round((item.weightPct / maxWeightPct) * 100),
    reasons: [item.reason],
    amount: item.amount,
  }));
  const donutItems = items.map((item) => ({ code: item.code, name: item.name, weightPct: item.weightPct }));

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const topItem = items.reduce((a, b) => (b.weightPct > a.weightPct ? b : a), items[0]);
  const minWeight = Math.min(...items.map((i) => i.weightPct));
  const smallHoldingsCount = items.filter((i) => i.weightPct === minWeight).length;

  const { backtest_result: backtest } = portfolio;
  const { linePath, areaPath } = buildCurvePaths(backtest.curve);
  const bestMonth = backtest.monthly_returns.length ? Math.max(...backtest.monthly_returns) : 0;
  const worstMonth = backtest.monthly_returns.length ? Math.min(...backtest.monthly_returns) : 0;

  return (
    <div>
      <PageHeader
        eyebrow="PORTFOLIO"
        title="포트폴리오"
        subtitle="투자 성향과 시장 데이터를 반영한 맞춤형 포트폴리오를 확인해보세요"
      />

      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="flex flex-col rounded-lg border border-line bg-panel p-[22px]">
          <div className="mb-3.5 text-[13.5px] font-bold text-text">비중 한눈에 보기</div>
          <div className="flex flex-1 flex-col justify-center gap-5">
            <PortfolioDonutChart items={donutItems} />
            <div className="flex flex-col gap-[7px] border-t border-line-soft pt-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-faint">총 투자금액</span>
                <span className="mono font-semibold text-accent">{totalAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-faint">최대 비중 종목</span>
                <span className="text-text-dim">
                  {topItem.name} · {topItem.weightPct}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-faint">소형 비중 종목</span>
                <span className="text-text-dim">{smallHoldingsCount}개 종목 · 각 {minWeight}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-[22px]">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="text-[13.5px] font-bold text-text">추천 종목 및 비중</div>
            <span className="inline-flex items-center rounded border border-accent/35 bg-accent-dim px-[9px] py-1 text-[10.5px] font-bold tracking-[0.3px] text-accent">
              {badge}
            </span>
          </div>
          <Accordion items={accordionItems} defaultVisibleCount={5} />
          <div className="mt-4">
            <button
              onClick={() => navigate('/trade')}
              className="w-full rounded-md border border-accent bg-accent px-3 py-3 text-center text-[13.5px] font-bold text-ink-fixed hover:bg-[#ffc94d]"
            >
              매수매도하러 가기
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="absolute right-3 top-3">
            <InfoTip
              variant="white"
              size="md"
              text="최근 1년간 이 포트폴리오 전략을 과거 시장 데이터에 적용했을 때 얻었을 것으로 추정되는 누적 수익률입니다."
            />
          </div>
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">백테스트 기대수익률</div>
          <div className={'mono text-2xl font-bold ' + (backtest.expected_return >= 0 ? 'text-rise' : 'text-fall')}>
            {backtest.expected_return >= 0 ? '+' : ''}
            {backtest.expected_return.toFixed(2)}%
          </div>
        </div>
        <div className="relative rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="absolute right-3 top-3">
            <InfoTip
              variant="white"
              size="md"
              text="투자 기간 중 자산이 고점 대비 가장 크게 떨어졌던 하락폭입니다. 0에 가까울수록 안정적인 전략입니다."
            />
          </div>
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">MDD (최대 낙폭)</div>
          <div className="mono text-2xl font-bold text-fall">{backtest.mdd.toFixed(2)}%</div>
        </div>
        <div className="relative rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="absolute right-3 top-3">
            <InfoTip
              variant="white"
              size="md"
              text="감수한 위험 대비 얻은 수익의 효율성을 나타내는 지표로, 높을수록 위험 대비 수익이 좋다는 뜻입니다."
            />
          </div>
          <div className="mono mb-[7px] text-[10.5px] font-bold text-text-faint">샤프지수</div>
          <div className="mono text-2xl font-bold text-text">{backtest.sharpe.toFixed(2)}</div>
        </div>
      </div>

      <div className="relative rounded-lg border border-line bg-panel p-[22px]">
        <div className="absolute right-[22px] top-[22px]">
          <InfoTip
            variant="white"
            size="md"
            text="모멘텀 점수는 최근 3·6·12개월 주가 상승률에 각각 50%·30%·20%의 가중치를 부여해 계산하며, 상승 추세가 강한 종목을 찾는 데 사용됩니다. 백테스트 기간은 이 전략을 과거 데이터에 적용해 시뮬레이션한 기간입니다."
          />
        </div>
        <div className="mb-3.5 text-[13.5px] font-bold text-text">수익률 곡선 (롤링 백테스트)</div>
        <div className="relative mb-3.5 h-[140px] overflow-hidden rounded-md border border-line bg-panel-elev">
          {linePath && (
            <svg width="100%" height="100%" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F0B429" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#F0B429" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#cg)" />
              <path d={linePath} fill="none" stroke="#F0B429" strokeWidth="2" />
            </svg>
          )}
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-[7px] border-t border-line-soft pt-2.5 sm:grid-cols-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-faint">모멘텀 점수</span>
            <span className="text-text-dim">상승 추세 기반 산출</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-faint">상위 집중 종목</span>
            <span className="text-accent">
              {backtest.top_stocks.map((code) => nameByCode[code] ?? code).join(' · ')}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-faint">최고 월 수익</span>
            <span className="text-rise">
              {bestMonth >= 0 ? '+' : ''}
              {bestMonth.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-faint">최저 월 수익</span>
            <span className="text-fall">
              {worstMonth >= 0 ? '+' : ''}
              {worstMonth.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-faint">백테스트 기간</span>
            <span className="text-text-dim">{backtest.monthly_returns.length}개월</span>
          </div>
        </div>
      </div>
    </div>
  );
}
