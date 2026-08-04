import { useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import SurveyCard from '../../components/SurveyCard';
import { BackButton, FillButton } from '../../components/ui';
import { useAppState } from '../../state/AppContext';

const QUICK_AMOUNTS = [1000000, 3000000, 5000000, 10000000];

export default function SurveyQ5() {
  const navigate = useNavigate();
  const { survey, setInvestableAmount, finalizeProfile } = useAppState();

  const handleComplete = () => {
    finalizeProfile();
    navigate('/done');
  };

  return (
    <AuthWrap>
      <SurveyCard
        step={5}
        eyebrow="초기 투자금"
        title="QuantAI에 처음 투자할 금액을 입력해주세요."
        footer={<FillButton onClick={handleComplete}>완료</FillButton>}
      >
        <div className="mb-3 flex items-center gap-2.5 rounded-lg border border-line bg-panel-elev px-[18px] py-3.5 focus-within:border-accent">
          <span className="mono text-lg text-text-faint">₩</span>
          <input
            type="number"
            min={0}
            value={survey.investableAmount}
            onChange={(e) => setInvestableAmount(parseInt(e.target.value, 10) || 0)}
            className="mono flex-1 bg-transparent text-right text-lg font-bold text-text outline-none"
          />
        </div>
        <div className="mb-2.5 grid grid-cols-2 gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => setInvestableAmount(amt)}
              className="rounded-md border border-line bg-panel-elev p-2.5 text-center text-[13px] font-semibold text-text-dim transition-colors hover:border-accent hover:text-accent"
            >
              ₩{amt.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="text-center text-[11.5px] text-text-faint">
          이 금액을 기준으로 포트폴리오와 수익률이 계산됩니다.
        </div>
      </SurveyCard>
      <BackButton onClick={() => navigate('/survey/4')}>← 이전</BackButton>
    </AuthWrap>
  );
}
