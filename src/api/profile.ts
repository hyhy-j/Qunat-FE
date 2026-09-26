import { get, post, put } from './client';
import type { InvestmentProfileRequest, InvestmentProfileResponse } from './types';

export function getProfile() {
  return get<InvestmentProfileResponse>('/api/profile');
}

export function submitProfile(payload: InvestmentProfileRequest) {
  return post<InvestmentProfileResponse>('/api/profile', payload);
}

export function updateProfile(payload: InvestmentProfileRequest) {
  return put<InvestmentProfileResponse>('/api/profile', payload);
}
