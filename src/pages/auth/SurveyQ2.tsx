import { useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import SurveyCard from '../../components/SurveyCard';
import { BackButton, FillButton } from '../../components/ui';
import { useAppState } from '../../state/AppContext';
import { RISK_LABELS } from '../../types';

export default function SurveyQ2() {
  const navigate = useNavigate();
  const { survey, setRisk } = useAppState();
  const pct = ((survey.riskVal - 1) / 4) * 100;

  return (
    <AuthWrap>
      <SurveyCard
        step={2}
        eyebrow="리스크 허용도"
        title="손실이 발생할 경우 어느 정도까지 감당할 수 있나요?"
        footer={<FillButton onClick={() => navigate('/survey/3')}>다음</FillButton>}
      >
        <div className="pb-1 pt-2">
          <input
            type="range"
            min={1}
            max={5}
            value={survey.riskVal}
            onChange={(e) => setRisk(parseInt(e.target.value, 10))}
            style={{ background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-line) ${pct}%)` }}
          />
          <div className="mt-2 flex justify-between">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="text-[11px] text-text-faint">
                {n}
              </span>
            ))}
          </div>
          <div className="mt-2.5 text-center text-[13px] font-semibold text-accent">
            {RISK_LABELS[survey.riskVal]}
          </div>
        </div>
      </SurveyCard>
      <BackButton onClick={() => navigate('/survey/1')}>← 이전</BackButton>
    </AuthWrap>
  );
}
