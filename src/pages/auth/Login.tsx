import { useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import LogoAnim from '../../components/LogoAnim';
import { FillButton, OutlineButton, Field } from '../../components/ui';

export default function Login() {
  const navigate = useNavigate();

  return (
    <AuthWrap>
      <div className="mb-2.5 text-center">
        <div className="mb-5 flex justify-center">
          <LogoAnim variant="login" />
        </div>
        <div className="text-[22px] font-extrabold tracking-[-0.4px] text-text">QuantAI</div>
        <div className="mono mt-1.5 text-[11px] tracking-[1px] text-text-faint">
          AI가 분석하고, 당신이 결정합니다
        </div>
      </div>
      <div className="w-full max-w-[400px] rounded-lg border border-line bg-panel p-[30px]">
        <div className="mb-[3px] text-[17px] font-extrabold text-text">로그인</div>
        <div className="mb-[22px] text-[12.5px] text-text-faint">계정에 로그인하세요</div>
        <Field label="이메일" placeholder="name@email.com" />
        <Field label="비밀번호" type="password" placeholder="비밀번호 입력" />
        <FillButton className="mb-[9px]" onClick={() => navigate('/dashboard')}>
          로그인
        </FillButton>
        <OutlineButton
          className="w-full rounded-lg py-[13px] text-center text-sm"
          onClick={() => navigate('/signup')}
        >
          계정 만들기
        </OutlineButton>
      </div>
    </AuthWrap>
  );
}
