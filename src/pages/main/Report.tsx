import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import ReportDatePicker from '../../components/ReportDatePicker';
import { reportStocks, reportWatchPoints, LATEST_REPORT_DATE, type ReportTone } from '../../data/mock';

const TONE_STYLE: Record<ReportTone, { label: string; dot: string; text: string }> = {
  up: { label: '긍정', dot: 'bg-fall', text: 'text-fall' },
  down: { label: '부정', dot: 'bg-rise', text: 'text-rise' },
  mixed: { label: '혼조', dot: 'bg-accent', text: 'text-accent' },
};

export default function Report() {
  const [selectedDate, setSelectedDate] = useState(LATEST_REPORT_DATE);
  const hasData = selectedDate === LATEST_REPORT_DATE;

  return (
    <div>
      <PageHeader
        eyebrow="MARKET REPORT"
        title="시장 리포트"
        subtitle="AI가 하루 두 번 시장을 훑어 알기 쉬운 인사이트로 정리해드려요"
        action={<ReportDatePicker selected={selectedDate} onSelect={setSelectedDate} />}
      />

      {!hasData ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-line bg-panel px-6 py-20 text-center">
          <div className="mb-2 text-sm font-bold text-text">{selectedDate} 리포트가 아직 없습니다</div>
          <div className="text-xs text-text-faint">아직 생성되지 않은 날짜예요. 최신 리포트를 확인해보세요.</div>
        </div>
      ) : (
        <div className="mb-3 rounded-lg border border-line bg-panel p-[22px]">
          <div className="mb-[18px] flex items-center gap-3.5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-accent">
              <div className="h-4 w-4 rounded-[3px] bg-accent" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-extrabold text-text">2026년 7월 8일 시장 리포트</div>
              <div className="mono mt-0.5 text-[11px] text-text-faint">오전 8시 자동 생성</div>
            </div>
            <span className="inline-flex items-center rounded border border-accent/35 bg-accent-dim px-[9px] py-1 text-[10.5px] font-bold tracking-[0.3px] text-accent">
              최신
            </span>
          </div>

          <div className="mono mb-2 text-[10.5px] font-bold tracking-[1px] text-text-faint">1. 오늘 시장 한줄 요약</div>
          <div className="mb-[18px] rounded-r-md border border-l-2 border-line border-l-accent bg-panel-elev px-3.5 py-[11px] text-[12.5px] leading-[1.7] text-text-dim">
            전반적으로 시장에 대한 다양한 예측이 나오는 가운데, 기업별로 각기 다른 소식들이 전해지며 투자자들의
            주목을 받고 있습니다.
          </div>

          <div className="mono mb-3 text-[10.5px] font-bold tracking-[1px] text-text-faint">2. 종목별 오늘 뉴스 흐름</div>
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {reportStocks.map((s) => {
              const tone = TONE_STYLE[s.tone];
              return (
                <div key={s.code} className="flex items-start gap-2.5 rounded-[10px] border border-line bg-panel-elev p-3.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[5px] border border-line bg-panel text-[9px] font-bold text-text-dim">
                    {s.short}
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-text">{s.name}</span>
                      <span className="mono text-[11px] text-text-faint">{s.code}</span>
                      <span className={'ml-auto inline-flex items-center gap-1 text-[10px] font-bold ' + tone.text}>
                        <span className={'h-1.5 w-1.5 rounded-full ' + tone.dot} />
                        {tone.label}
                      </span>
                    </div>
                    <div className="text-xs leading-[1.6] text-text-dim">{s.note}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-line-soft pt-4">
            <div className="mono mb-2.5 text-[10.5px] font-bold tracking-[1px] text-text-faint">3. 오늘 시장에서 조심할 점</div>
            <ul className="flex flex-col gap-2">
              {reportWatchPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-[1.7] text-text-dim">
                  <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-text-faint" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
