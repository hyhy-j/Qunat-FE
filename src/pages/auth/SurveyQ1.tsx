import { useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import SurveyCard from '../../components/SurveyCard';
import Choice from '../../components/Choice';
import { BackButton, FillButton } from '../../components/ui';
import { useAppState } from '../../state/AppContext';

const OPTIONS = [
  { value: '자산 성장', sub: '장기 수익 극대화' },
  { value: '안정적 수익', sub: '리스크 최소화' },
  { value: '단기 수익', sub: '적극적 트레이딩' },
];

export default function SurveyQ1() {
  const navigate = useNavigate();
  const { survey, setGoal } = useAppState();

  return (
    <AuthWrap>
      <SurveyCard
        step={1}
        eyebrow="투자 목표"
        title="어떤 목표로 투자하시나요?"
        footer={
          <FillButton disabled={!survey.goal} onClick={() => navigate('/survey/2')}>
            다음
          </FillButton>
        }
      >
        <div className="mb-2">
          {OPTIONS.map((opt) => (
            <Choice
              key={opt.value}
              main={opt.value}
              sub={opt.sub}
              selected={survey.goal === opt.value}
              onSelect={() => setGoal(opt.value)}
            />
          ))}
        </div>
      </SurveyCard>
      <BackButton onClick={() => navigate('/signup')}>← 이전</BackButton>
    </AuthWrap>
  );
}
