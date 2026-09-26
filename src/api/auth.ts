import { post } from './client';
import type { TokenResponse } from './types';

export function login(email: string, password: string) {
  return post<TokenResponse>('/api/auth/login', { email, password }, { auth: false });
}

export function signup(email: string, password: string, nickname: string) {
  return post<TokenResponse>('/api/auth/signup', { email, password, nickname }, { auth: false });
}

export function logout() {
  return post<void>('/api/auth/logout');
}
