export interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  nickname: string | null;
}

export interface PnlInfo {
  amount: number;
  rate: number;
}

export type InvestmentPeriod = 'UNDER_1Y' | 'ONE_TO_3Y' | 'THREE_TO_5Y' | 'OVER_5Y';
export type ProfileType = 'AGGRESSIVE' | 'NEUTRAL' | 'STABLE';

export interface InvestmentProfileRequest {
  investmentGoal: string;
  riskTolerance: number;
  investmentPeriod: InvestmentPeriod;
  investableAmount: number;
}

export interface InvestmentProfileResponse {
  id: number;
  investmentGoal: string;
  riskTolerance: number;
  investmentPeriod: InvestmentPeriod;
  investableAmount: number;
  profileType: ProfileType;
  createdAt: string;
}

export interface DashboardStockSummary {
  stockCode: string;
  stockName: string;
  currentPrice: number | null;
  quantity: number;
  avgPrice: number | null;
  totalValue: number | null;
  unrealizedPnl: PnlInfo | null;
}

export type ReportType = 'MORNING' | 'EVENING';

export interface MarketReportResponse {
  id: number;
  reportType: ReportType;
  content: string;
  generatedAt: string;
}

export interface MarketReportListResponse {
  id: number;
  reportType: ReportType;
  generatedAt: string;
}

export interface DashboardResponse {
  asset: {
    totalAssets: number;
    todayPnl: PnlInfo;
    cumulativePnl: PnlInfo;
  };
  stocks: DashboardStockSummary[];
  todayReport: MarketReportResponse | null;
}

export interface PortfolioStockInfo {
  name: string;
  weight: number;
  amount: number;
  quantity: number;
  reason: string;
}

export interface PortfolioBacktestResult {
  top_stocks: string[];
  curve: number[];
  monthly_returns: number[];
  expected_return: number;
  mdd: number;
  sharpe: number;
}

export interface PortfolioResponse {
  portfolio: Record<string, PortfolioStockInfo>;
  backtest_result: PortfolioBacktestResult;
  report: string;
  risk_type: string | null;
  created_at: string;
}

export type OrderSide = 'BUY' | 'SELL';

export interface TradeOrderRequest {
  stockName: string;
  side: OrderSide;
  quantity: number;
  orderAmount: number;
}

export interface OrderExecuteResponse {
  status: string;
  stockId: string;
  side: string;
  quantity: number;
  price: number;
  amount: number;
  balanceAfter: number;
  message: string;
}

export interface TradeOrderResponse {
  id: number;
  stockCode: string;
  side: string;
  quantity: number;
  price: number;
  amount: number;
  balanceAfter: number;
  status: string;
  executedAt: string;
}

export interface OrderStatsHistoryPoint {
  date: string;
  totalAssets: number;
}

export interface OrderStatsResponse {
  daily: PnlInfo;
  weekly: PnlInfo;
  monthly: PnlInfo;
  history: OrderStatsHistoryPoint[];
}

export interface TradableStockResponse {
  code: string;
  name: string;
  price: number | null;
}

export type AgentStatus = 'RUNNING' | 'SUCCEEDED' | 'FAILED';

export interface AgentActivityLogResponse {
  id: number;
  agentType: string;
  action: string;
  status: AgentStatus;
  detail: string | null;
  startedAt: string;
  finishedAt: string | null;
}
