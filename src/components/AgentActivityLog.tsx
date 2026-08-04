interface LogEntry {
  time: string;
  agent: string;
  message: string;
}

const LOG_ENTRIES: LogEntry[] = [
  {
    time: '08:03',
    agent: 'AGENT3',
    message: '보유 종목과 잔고를 기준으로 리스크 검사를 수행하고 이상 없음을 확인했습니다.',
  },
  {
    time: '08:02',
    agent: 'AGENT2',
    message: '모멘텀 전략을 바탕으로 오늘의 추천 포트폴리오 구성을 새로 생성했습니다.',
  },
  {
    time: '08:00',
    agent: 'AGENT1',
    message: '주가와 뉴스, 시장 감성 데이터를 수집·분석해 오늘의 리포트를 완성했습니다.',
  },
];

export default function AgentActivityLog() {
  return (
    <div className="mb-3 rounded-[10px] border border-line bg-panel px-5 py-[13px]">
      <div className="mb-2.5 text-[11px] font-bold tracking-[1px] text-text-faint">에이전트 활동 로그</div>
      <div className="flex flex-col gap-2.5">
        {LOG_ENTRIES.map((entry, i) => (
          <div key={i} className="flex items-start gap-2.5 text-[12.5px] leading-[1.5]">
            <span className="mono w-11 flex-shrink-0 pt-0.5 text-text-faint">{entry.time}</span>
            <span className="mt-0.5 inline-flex flex-shrink-0 items-center rounded border border-accent/35 bg-accent-dim px-[7px] py-0.5 text-[10px] font-bold tracking-[0.3px] text-accent">
              {entry.agent}
            </span>
            <span className="text-text-dim">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
