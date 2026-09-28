import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import LogoAnim from '../../components/LogoAnim';
import { FillButton, OutlineButton, Field } from '../../components/ui';
import { ApiError } from '../../api/client';
import { login } from '../../api/auth';
import { getProfile } from '../../api/profile';
import { useAuth } from '../../state/AuthContext';
import { useAppState } from '../../state/AppContext';
import { profileResultFromType } from '../../types';

export default function Login() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { setProfile, syncAgentAccount } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const token = await login(email, password);
      setSession(token);
      syncAgentAccount(email);

      try {
        const profile = await getProfile();
        setProfile(profileResultFromType(profile.profileType));
        navigate('/dashboard');
      } catch (profileError) {
        if (profileError instanceof ApiError && profileError.code === 'IP001') {
          navigate('/survey/1');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
        <Field
          label="이메일"
          placeholder="name@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="비밀번호"
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="mb-[13px] text-[12.5px] text-fall">{error}</div>}
        <FillButton className="mb-[9px]" disabled={loading} onClick={handleSubmit}>
          {loading ? '로그인 중...' : '로그인'}
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
