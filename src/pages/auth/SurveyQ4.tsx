import { useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import SurveyCard from '../../components/SurveyCard';
import Choice from '../../components/Choice';
import { BackButton, FillButton } from '../../components/ui';
import { useAppState } from '../../state/AppContext';

const OPTIONS = [
  { value: 'LT50', main: '50만원 미만', sub: '소액 투자 · 0점', score: 0 },
  { value: '50TO200', main: '50~200만원', sub: '중액 투자 · 10점', score: 10 },
  { value: 'GT200', main: '200만원 이상', sub: '고액 투자 · 20점', score: 20 },
];

export default function SurveyQ4() {
  const navigate = useNavigate();
  const { survey, setAmount } = useAppState();

  return (
    <AuthWrap>
      <SurveyCard
        step={4}
        eyebrow="월 투자 가능 금액"
        title="월 투자 가능 금액은 얼마인가요?"
        footer={
          <FillButton disabled={!survey.amountTier} onClick={() => navigate('/survey/5')}>
            다음
          </FillButton>
        }
      >
        <div className="mb-2">
          {OPTIONS.map((opt) => (
            <Choice
              key={opt.value}
              main={opt.main}
              sub={opt.sub}
              selected={survey.amountTier === opt.value}
              onSelect={() => setAmount(opt.value, opt.score)}
            />
          ))}
        </div>
      </SurveyCard>
      <BackButton onClick={() => navigate('/survey/3')}>← 이전</BackButton>
    </AuthWrap>
  );
}
