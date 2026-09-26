export interface AgentLogEntry {
  time: string;
  agent: string;
  message: string;
}

interface AgentActivityLogProps {
  systemEntries: AgentLogEntry[];
  tradeEntries: AgentLogEntry[];
}

function EntryList({ entries, emptyText }: { entries: AgentLogEntry[]; emptyText: string }) {
  if (entries.length === 0) {
    return <div className="py-1.5 text-[12.5px] text-text-faint">{emptyText}</div>;
  }
  return (
    <div className="flex flex-col gap-2.5">
      {entries.map((entry, i) => (
        <div key={i} className="flex items-start gap-2.5 text-[12.5px] leading-[1.5]">
          <span className="mono w-11 flex-shrink-0 pt-0.5 text-text-faint">{entry.time}</span>
          <span
            className={
              'mt-0.5 inline-flex flex-shrink-0 items-center rounded border px-[7px] py-0.5 text-[10px] font-bold tracking-[0.3px] ' +
              (entry.agent === 'AGENT3'
                ? 'border-rise/35 bg-rise/[0.1] text-rise'
                : 'border-accent/35 bg-accent-dim text-accent')
            }
          >
            {entry.agent}
          </span>
          <span className="text-text-dim">{entry.message}</span>
        </div>
      ))}
    </div>
  );
}

export default function AgentActivityLog({ systemEntries, tradeEntries }: AgentActivityLogProps) {
  return (
    <div className="mb-3 rounded-[10px] border border-line bg-panel px-5 py-[13px]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:border-r sm:border-line-soft sm:pr-4">
          <div className="mb-2.5 text-[11px] font-bold tracking-[1px] text-text-faint">분석 로그 · AGENT1 · AGENT2</div>
          <EntryList entries={systemEntries} emptyText="아직 분석 로그가 없습니다." />
        </div>
        <div>
          <div className="mb-2.5 text-[11px] font-bold tracking-[1px] text-text-faint">나의 매매 활동 · AGENT3</div>
          <EntryList entries={tradeEntries} emptyText="아직 매매 활동이 없습니다." />
        </div>
      </div>
    </div>
  );
}
