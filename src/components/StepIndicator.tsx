import InfoTip from './InfoTip';

interface StepIndicatorProps {
  current: number; // 0 = signup(idle), 1..5 = q1..q5
}

const SCORE_INFO =
  '리스크 허용도·투자 기간·투자 금액에 대한 답변을 점수로 합산해 안정형·중립형·공격형 중 하나로 투자 유형을 분류해요.';

export default function StepIndicator({ current }: StepIndicatorProps) {
  const steps = [1, 2, 3, 4, 5];
  return (
    <div className="mb-7 flex items-center justify-center">
      <div className="flex w-full max-w-[280px] items-center">
        {steps.map((i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} className="flex flex-1 items-center last:flex-none">
              <div
                className={
                  'flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full border-2 text-[13px] font-bold transition-all ' +
                  (done
                    ? 'bg-accent border-accent text-ink-fixed'
                    : active
                      ? 'bg-transparent border-accent text-accent'
                      : 'bg-transparent border-line text-text-faint')
                }
              >
                {i}
              </div>
              {i < 5 && <div className={'flex-1 h-0.5 ' + (i < current ? 'bg-accent' : 'bg-line')} />}
            </div>
          );
        })}
      </div>
      {current > 0 && <InfoTip text={SCORE_INFO} variant="white" size="md" />}
    </div>
  );
}
