import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { logout as logoutApi } from '../api/auth';
import { clearTokens, getTokens, setTokens, subscribeTokens, type AuthTokens } from '../api/tokenStore';

interface AuthContextValue extends AuthTokens {
  isAuthenticated: boolean;
  setSession: (tokens: { accessToken: string; refreshToken: string; nickname?: string | null }) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokensState] = useState<AuthTokens>(getTokens());

  useEffect(() => subscribeTokens(setTokensState), []);

  const setSession: AuthContextValue['setSession'] = ({ accessToken, refreshToken, nickname }) => {
    setTokens({ accessToken, refreshToken, nickname: nickname ?? tokens.nickname });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // 서버 로그아웃이 실패해도 클라이언트 세션은 정리한다
    }
    clearTokens();
  };

  const value: AuthContextValue = {
    ...tokens,
    isAuthenticated: !!tokens.accessToken,
    setSession,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
