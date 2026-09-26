import { get } from './client';
import type { PortfolioResponse } from './types';

export function getLatestPortfolio() {
  return get<PortfolioResponse>('/api/portfolio/latest');
}
