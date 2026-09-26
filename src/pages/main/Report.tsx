import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import ReportDatePicker from '../../components/ReportDatePicker';
import StockLogo from '../../components/StockLogo';
import { getReport, getReports } from '../../api/reports';
import { parseMarketReport } from '../../utils/parseMarketReport';
import type { StockTone } from '../../utils/parseMarketReport';
import type { MarketReportListResponse } from '../../api/types';

const TONE_LABEL: Record<StockTone, string> = { positive: '호재', negative: '악재', caution: '주의' };
const TONE_BADGE_CLASS: Record<StockTone, string> = {
  positive: 'border-fall/35 bg-fall/[0.1] text-fall',
  negative: 'border-rise/35 bg-rise/[0.1] text-rise',
  caution: 'border-accent/35 bg-accent-dim text-accent',
};

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function Report() {
  const [reports, setReports] = useState<MarketReportListResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const reportForDate = reports.find((r) => r.generatedAt.slice(0, 10) === selectedDate);
  const reportId = reportForDate?.id;

  useEffect(() => {
    if (!reportId) {
      setContent(null);
      return;
    }
    let cancelled = false;
    getReport(reportId).then((data) => {
      if (!cancelled) setContent(data.content);
    });
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  const latestDate = reports[0]?.generatedAt.slice(0, 10);
  const reportDates = new Set(reports.map((r) => r.generatedAt.slice(0, 10)));
  const parsed = content ? parseMarketReport(content) : null;
  const [selY, selM, selD] = selectedDate.split('-').map(Number);

  return (
    <div>
      <PageHeader
        eyebrow="MARKET REPORT"
        title="시장 리포트"
        subtitle="AI가 매일 아침 시장을 훑어 알기 쉬운 인사이트로 정리해드려요"
        action={<ReportDatePicker selected={selectedDate} onSelect={setSelectedDate} reportDates={reportDates} />}
      />

      {loading ? (
        <div className="rounded-lg border border-line bg-panel p-10 text-center text-sm text-text-faint">
          불러오는 중...
        </div>
      ) : !reportForDate || !parsed ? (
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
              <div className="text-[15px] font-extrabold text-text">
                {selY}년 {selM}월 {selD}일 시장 리포트
              </div>
              <div className="mono mt-0.5 text-[11px] text-text-faint">
                {reportForDate.reportType === 'MORNING' ? '오전 8시 자동 생성' : '오후 자동 생성'}
              </div>
            </div>
            {selectedDate === latestDate && (
              <span className="inline-flex items-center rounded border border-accent/35 bg-accent-dim px-[9px] py-1 text-[10.5px] font-bold tracking-[0.3px] text-accent">
                최신
              </span>
            )}
          </div>

          <div className="mono mb-2 text-[10.5px] font-bold tracking-[1px] text-text-faint">1. 오늘 시장 한줄 요약</div>
          <div className="mb-[18px] rounded-r-md border border-l-2 border-line border-l-accent bg-panel-elev px-3.5 py-[11px] text-[12.5px] leading-[1.7] text-text-dim">
            {parsed.summary || '요약 정보가 없습니다.'}
          </div>

          {parsed.stockNews.length > 0 && (
            <>
              <div className="mono mb-3 text-[10.5px] font-bold tracking-[1px] text-text-faint">2. 종목별 오늘 뉴스 흐름</div>
              <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {parsed.stockNews.map((s) => (
                  <div key={s.code} className="flex items-start gap-2.5 rounded-[10px] border border-line bg-panel-elev p-3.5">
                    <StockLogo code={s.code} name={s.name} size="sm" />
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-1.5">
                        <span className="text-[12.5px] font-semibold text-text">{s.name}</span>
                        <span className="mono text-[11px] text-text-faint">{s.code}</span>
                        <span
                          className={
                            'ml-auto inline-flex items-center rounded-full border px-2 py-[1px] text-[9.5px] font-bold leading-[1.5] tracking-[0.2px] ' +
                            TONE_BADGE_CLASS[s.tone]
                          }
                        >
                          {TONE_LABEL[s.tone]}
                        </span>
                      </div>
                      <div className="text-xs leading-[1.6] text-text-dim">{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {parsed.watchPoints.length > 0 && (
            <div className="border-t border-line-soft pt-4">
              <div className="mono mb-2.5 text-[10.5px] font-bold tracking-[1px] text-text-faint">
                3. 오늘 시장에서 조심할 점
              </div>
              <ul className="flex flex-col gap-2">
                {parsed.watchPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13.5px] leading-[1.7] text-text-dim">
                    <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-text-faint" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
