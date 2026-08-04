import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Accordion from '../../components/Accordion';
import InfoTip from '../../components/InfoTip';
import PortfolioDonutChart from '../../components/PortfolioDonutChart';
import { portfolioItems } from '../../data/mock';
import { useAppState } from '../../state/AppContext';

const DEFAULT_AMOUNT = 10000000;

export default function Portfolio() {
  const navigate = useNavigate();
  const { profile, survey } = useAppState();
  const badge = profile?.type ?? 'NEUTRAL';
  const baseAmount = survey.investableAmount || DEFAULT_AMOUNT;

  const itemsWithAmount = portfolioItems.map((item) => ({
    ...item,
    amount: Math.round((baseAmount * item.weightPct) / 100),
  }));

  const topItem = portfolioItems.reduce((a, b) => (b.weightPct > a.weightPct ? b : a));
  const minWeight = Math.min(...portfolioItems.map((i) => i.weightPct));
  const smallHoldingsCount = portfolioItems.filter((i) => i.weightPct === minWeight).length;

  return (
    <div>
      <PageHeader
        eyebrow="PORTFOLIO"
        title="포트폴리오"
        subtitle="투자 성향과 시장 데이터를 반영한 맞춤형 포트폴리오를 확인해보세요"
      />

      {/* 1단: 비중 도넛차트 + 추천 종목 리스트 */}
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="flex flex-col rounded-lg border border-line bg-panel p-[22px]">
          <div className="mb-3.5 text-[13.5px] font-bold text-text">비중 한눈에 보기</div>
          <div className="flex flex-1 flex-col justify-center gap-5">
            <PortfolioDonutChart items={portfolioItems} />
            <div className="flex flex-col gap-[7px] border-t border-line-soft pt-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-faint">총 투자금액</span>
                <span className="mono font-semibold text-accent">{baseAmount.toLocaleString()}원</span>
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
          <Accordion items={itemsWithAmount} defaultVisibleCount={5} />
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

      {/* 2단: 핵심 지표 */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] flex items-center justify-center text-[10.5px] font-bold text-text-faint">
            백테스트 기대수익률
            <InfoTip text="최근 1년간 이 포트폴리오 전략을 과거 시장 데이터에 적용했을 때 얻었을 것으로 추정되는 누적 수익률입니다." />
          </div>
          <div className="mono text-2xl font-bold text-rise">+288.12%</div>
        </div>
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] flex items-center justify-center text-[10.5px] font-bold text-text-faint">
            MDD (최대 낙폭)
            <InfoTip text="투자 기간 중 자산이 고점 대비 가장 크게 떨어졌던 하락폭입니다. 0에 가까울수록 안정적인 전략입니다." />
          </div>
          <div className="mono text-2xl font-bold text-fall">-19.50%</div>
        </div>
        <div className="rounded-[18px] border border-accent/35 p-6 text-center shadow-[0_0_15px_rgba(255,194,59,0.08)]">
          <div className="mono mb-[7px] flex items-center justify-center text-[10.5px] font-bold text-text-faint">
            샤프지수
            <InfoTip text="감수한 위험 대비 얻은 수익의 효율성을 나타내는 지표로, 높을수록 위험 대비 수익이 좋다는 뜻입니다." />
          </div>
          <div className="mono text-2xl font-bold text-text">2.64</div>
        </div>
      </div>

      {/* 3단: 백테스트 차트 */}
      <div className="rounded-lg border border-line bg-panel p-[22px]">
        <div className="mb-3.5 text-[13.5px] font-bold text-text">수익률 곡선 (롤링 백테스트)</div>
        <div className="relative mb-3.5 h-[140px] overflow-hidden rounded-md border border-line bg-panel-elev">
          <svg width="100%" height="100%" viewBox="0 0 640 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F0B429" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#F0B429" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,119 L80,108 L160,98 L240,80 L320,69 L400,48 L480,34 L560,18 L640,10"
              fill="none"
              stroke="#F0B429"
              strokeWidth="2"
            />
            <path
              d="M0,119 L80,108 L160,98 L240,80 L320,69 L400,48 L480,34 L560,18 L640,10 L640,140 L0,140Z"
              fill="url(#cg)"
            />
          </svg>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-[7px] border-t border-line-soft pt-2.5 sm:grid-cols-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center text-text-faint">
              모멘텀 점수
              <InfoTip text="최근 3개월·6개월·12개월 주가 상승률에 각각 50%·30%·20%의 가중치를 부여해 계산한 점수로, 상승 추세가 강한 종목을 찾는 데 사용됩니다." />
            </span>
            <span className="text-text-dim">상승 추세 기반 산출</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-faint">상위 집중 종목</span>
            <span className="text-accent">SK스퀘어 · SK하이닉스 · 삼성생명</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-faint">최고 월 수익</span>
            <span className="text-rise">+40.3%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-faint">최저 월 수익</span>
            <span className="text-fall">-19.5%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="flex items-center text-text-faint">
              백테스트 기간
              <InfoTip text="이 포트폴리오 전략을 과거 데이터에 적용해 시뮬레이션한 기간입니다." />
            </span>
            <span className="text-text-dim">10개월</span>
          </div>
        </div>
      </div>
    </div>
  );
}
