import { Navigate, useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import { FillButton } from '../../components/ui';
import { useAppState } from '../../state/AppContext';

export default function Done() {
  const navigate = useNavigate();
  const { profile, survey } = useAppState();

  if (!profile) return <Navigate to="/survey/1" replace />;

  return (
    <AuthWrap>
      <div className="w-full max-w-[420px] rounded-xl border border-line bg-panel p-8 pt-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-accent">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M7 16.5L13 22.5L25 10"
              stroke="#F0B429"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="mb-3 text-[22px] font-extrabold text-text">분석 완료</div>
        <div className="mb-[18px] inline-block rounded-full border border-accent px-4 py-[5px] text-[13px] font-bold text-accent">
          {profile.typeKr}
        </div>
        <div className="mb-[18px] text-[13.5px] leading-[1.7] text-text-dim">{profile.desc}</div>
        <div className="mono mb-6 text-[13px] font-bold text-accent">
          초기 투자금 ₩{survey.investableAmount.toLocaleString()}이 설정되었습니다.
        </div>
        <FillButton onClick={() => navigate('/dashboard')}>대시보드 시작하기</FillButton>
      </div>
    </AuthWrap>
  );
}
