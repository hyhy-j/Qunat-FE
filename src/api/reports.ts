import { get } from './client';
import type { MarketReportListResponse, MarketReportResponse } from './types';

export function getReports() {
  return get<MarketReportListResponse[]>('/api/reports');
}

export function getReport(id: number) {
  return get<MarketReportResponse>(`/api/reports/${id}`);
}
