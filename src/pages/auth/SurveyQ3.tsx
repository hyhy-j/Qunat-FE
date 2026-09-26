import { useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import SurveyCard from '../../components/SurveyCard';
import Choice from '../../components/Choice';
import { BackButton, FillButton } from '../../components/ui';
import { useAppState } from '../../state/AppContext';

const OPTIONS = [
  { value: 'UNDER_1Y', main: '1년 미만', sub: '단기 투자 · 0점', score: 0 },
  { value: 'ONE_TO_3Y', main: '1~3년', sub: '중기 투자 · 10점', score: 10 },
  { value: 'THREE_TO_5Y', main: '3~5년', sub: '중장기 투자 · 20점', score: 20 },
  { value: 'OVER_5Y', main: '5년 이상', sub: '장기 투자 · 30점', score: 30 },
];

export default function SurveyQ3() {
  const navigate = useNavigate();
  const { survey, setPeriod } = useAppState();

  return (
    <AuthWrap>
      <SurveyCard
        step={3}
        eyebrow="투자 기간"
        title="얼마나 오래 투자하실 계획인가요?"
        footer={
          <FillButton disabled={!survey.period} onClick={() => navigate('/survey/4')}>
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
              selected={survey.period === opt.value}
              onSelect={() => setPeriod(opt.value, opt.score)}
            />
          ))}
        </div>
      </SurveyCard>
      <BackButton onClick={() => navigate('/survey/2')}>← 이전</BackButton>
    </AuthWrap>
  );
}
