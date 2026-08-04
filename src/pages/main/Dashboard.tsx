import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import AgentActivityLog from '../../components/AgentActivityLog';
import LogoAnim from '../../components/LogoAnim';
import IntroLoading from '../../components/IntroLoading';
import { holdings } from '../../data/mock';
import { useAppState } from '../../state/AppContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { introShown, markIntroShown } = useAppState();

  return (
    <div>
      {!introShown && <IntroLoading onFinish={markIntroShown} />}

      <PageHeader eyebrow="DASHBOARD" title="대시보드" subtitle="오늘의 투자 현황을 한눈에 확인해보세요" />

      <AgentActivityLog />

      <div className="grid-tex relative mb-3 overflow-hidden rounded-[18px] border border-accent/35 p-6 shadow-[0_0_15px_rgba(255,194,59,0.08)]">
        <div className="mono mb-1.5 text-[10.5px] font-bold text-text-faint">잔고 · BALANCE</div>
        <div className="mono mb-[18px] text-[32px] font-bold tracking-[-1px] text-text">
          9,928,500<span className="text-base font-normal text-text-faint"> 원</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-md border border-line bg-panel-elev p-3.5">
            <div className="mono mb-1.5 text-[10px] font-bold text-text-faint">오늘 수익률</div>
            <div className="mono text-lg font-bold text-rise">+2.34%</div>
          </div>
          <div className="rounded-md border border-line bg-panel-elev p-3.5">
            <div className="mono mb-1.5 text-[10px] font-bold text-text-faint">평가손익</div>
            <div className="mono text-lg font-bold text-rise">+54,000원</div>
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
                      {h.code} · {h.qty}주 · 평균 {h.avgPrice.toLocaleString()}원
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mono text-[13.5px] font-bold text-text">{h.curPrice.toLocaleString()}원</div>
                  <div className="mono mt-0.5 text-xs font-semibold text-rise">
                    {pnl >= 0 ? '+' : ''}
                    {pnl.toLocaleString()}원
                  </div>
                </div>
              </div>
            );
          })}
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
              <div className="mt-px text-[10px] text-text-faint">2026-07-08 · 08:00 자동 생성</div>
            </div>
          </div>
          <div className="relative mb-4 rounded-r-[10px] rounded-bl-[10px] border border-l-[3px] border-line border-l-accent bg-panel-elev px-[18px] py-4">
            <div className="text-[15px] font-semibold leading-[1.7] text-text">
              반도체 관련 기업들의 소식과 시장 전체의 불안감이 겹치면서 주식 시장이 전반적으로 크게 흔들리는
              하루였습니다.
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
