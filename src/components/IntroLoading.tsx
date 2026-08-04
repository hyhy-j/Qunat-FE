import { useEffect, useState } from 'react';

type AgentState = 'idle' | 'active' | 'done';

const AGENTS = [
  { label: '주가·뉴스 분석', duration: 750 },
  { label: '포트폴리오 생성', duration: 950 },
  { label: '리스크 검사', duration: 850 },
];

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function AgentIcon({ index, state, label }: { index: number; state: AgentState; label: string }) {
  const active = state === 'active';
  const done = state === 'done';
  return (
    <div className="flex w-[112px] flex-col items-center gap-3 rounded-xl border border-line-soft px-3 py-4">
      <div
        className={
          'relative flex h-10 w-10 items-center justify-center transition-opacity duration-300 ' +
          (active || done ? 'opacity-100' : 'opacity-30')
        }
      >
        {index === 0 && (
          <div className={'h-7 w-7 rounded-[6px] border-[1.5px] border-accent ' + (active ? 'rl-spin-1' : '')} />
        )}
        {index === 1 && (
          <>
            <div
              className={
                'absolute h-6 w-6 -translate-x-[5px] -translate-y-[5px] rounded-[5px] border-[1.5px] border-accent ' +
                (active ? 'rl-spin-2a' : '')
              }
            />
            <div
              className={
                'absolute h-6 w-6 translate-x-[5px] translate-y-[5px] rounded-[5px] border-[1.5px] border-accent/50 ' +
                (active ? 'rl-spin-2b' : '')
              }
            />
          </>
        )}
        {index === 2 && (
          <>
            <div className={'absolute h-9 w-9 rounded-[5px] border-[1.5px] border-accent/40 ' + (active ? 'rl-spin-3-ring1' : '')} />
            <div className={'absolute h-[26px] w-[26px] rounded-[4px] border-[1.5px] border-accent/22 ' + (active ? 'rl-spin-3-ring2' : '')} />
            <div className={'relative z-10 h-[9px] w-[9px] rounded-[2px] bg-accent ' + (active ? 'rl-spin-3-core' : '')} />
            <div
              className={
                'absolute left-1/2 top-1/2 -ml-0.5 -mt-0.5 h-1 w-1 rounded-full bg-accent ' + (active ? 'rl-spin-3-dot1' : '')
              }
            />
            <div
              className={
                'absolute left-1/2 top-1/2 -ml-[1.5px] -mt-[1.5px] h-[3px] w-[3px] rounded-full bg-accent/55 ' +
                (active ? 'rl-spin-3-dot2' : '')
              }
            />
          </>
        )}
        <div
          className={
            'absolute -bottom-[3px] -right-[3px] flex h-4 w-4 items-center justify-center rounded-full bg-accent transition-all duration-[250ms] ' +
            (done ? 'scale-100 opacity-100' : 'scale-[0.4] opacity-0')
          }
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2L5 8.7L9.5 3.2" stroke="#0A0D12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div
        className={
          'text-center text-[11px] font-semibold transition-colors ' +
          (active ? 'text-accent' : done ? 'text-text-dim' : 'text-text-faint')
        }
      >
        {label}
      </div>
    </div>
  );
}

export default function IntroLoading({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'show' | 'hide'>('show');
  const [agentStates, setAgentStates] = useState<AgentState[]>(['idle', 'idle', 'idle']);
  const [status, setStatus] = useState('오늘의 시장 데이터를 준비하고 있습니다');
  const [statusDone, setStatusDone] = useState(false);
  const [rendered, setRendered] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function runAgent(index: number, duration: number) {
      await sleep(duration);
      if (cancelled) return;
      setAgentStates((s) => s.map((v, i) => (i === index ? 'done' : v)));
    }

    async function run() {
      await sleep(300);
      if (cancelled) return;
      setAgentStates(['active', 'active', 'active']);

      await Promise.all(AGENTS.map((agent, i) => runAgent(i, agent.duration)));
      if (cancelled) return;

      await sleep(250);
      setStatus('AI 분석 완료, 오늘의 투자를 시작해보세요');
      setStatusDone(true);
      await sleep(1150);
      if (cancelled) return;
      setPhase('hide');
      await sleep(550);
      if (cancelled) return;
      setRendered(false);
      onFinish();
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!rendered) return null;

  return (
    <div
      className={
        'absolute inset-0 z-[60] flex flex-col items-center justify-center bg-ink transition-opacity duration-500 ' +
        (phase === 'hide' ? 'pointer-events-none opacity-0' : 'opacity-100')
      }
    >
      <div className="mb-[30px] flex items-start gap-5">
        {AGENTS.map((agent, i) => (
          <AgentIcon key={agent.label} index={i} state={agentStates[i]} label={agent.label} />
        ))}
      </div>
      <div
        className={
          'min-h-[20px] text-center font-semibold transition-colors ' +
          (statusDone ? 'text-[15.5px] font-extrabold text-accent' : 'text-sm text-text-dim')
        }
      >
        {status}
      </div>
    </div>
  );
}
