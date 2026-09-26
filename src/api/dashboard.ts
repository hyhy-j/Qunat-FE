import { get } from './client';
import type { DashboardResponse } from './types';

export function getDashboard() {
  return get<DashboardResponse>('/api/dashboard');
}
