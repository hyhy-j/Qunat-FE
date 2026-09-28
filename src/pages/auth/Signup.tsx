import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthWrap from '../../components/AuthWrap';
import SurveyCard from '../../components/SurveyCard';
import { BackButton, Field, FillButton } from '../../components/ui';
import { ApiError } from '../../api/client';
import { signup } from '../../api/auth';
import { useAuth } from '../../state/AuthContext';
import { useAppState } from '../../state/AppContext';

export default function Signup() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { syncAgentAccount } = useAppState();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nickname || !email || !password || !passwordConfirm) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const token = await signup(email, password, nickname);
      setSession(token);
      syncAgentAccount(email);
      navigate('/survey/1');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrap>
      <div className="mb-5 text-center">
        <div className="text-xl font-extrabold text-text">QuantAI 회원가입</div>
        <div className="mt-1 text-xs text-text-faint">기본 정보를 입력하세요</div>
      </div>
      <SurveyCard
        step={0}
        eyebrow="SIGN UP"
        title="기본 정보를 입력해주세요"
        minHeightPx={420}
        footer={
          <FillButton disabled={loading} onClick={handleSubmit}>
            {loading ? '처리 중...' : '다음'}
          </FillButton>
        }
      >
        <Field label="이름" placeholder="홍길동" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <Field
          label="이메일"
          placeholder="name@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Field
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호 재입력"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        {error && <div className="mt-1 text-[12.5px] text-fall">{error}</div>}
      </SurveyCard>
      <BackButton onClick={() => navigate('/login')}>← 로그인으로</BackButton>
    </AuthWrap>
  );
}
