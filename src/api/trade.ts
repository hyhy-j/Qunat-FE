import { get, post } from './client';
import type {
  OrderExecuteResponse,
  OrderStatsResponse,
  Page,
  TradableStockResponse,
  TradeOrderRequest,
  TradeOrderResponse,
} from './types';

export function placeOrder(payload: TradeOrderRequest) {
  return post<OrderExecuteResponse>('/api/orders', payload);
}

export function getOrders(page = 0, size = 20) {
  return get<Page<TradeOrderResponse>>(`/api/orders?page=${page}&size=${size}&sort=executedAt,DESC`);
}

export function getOrderStats() {
  return get<OrderStatsResponse>('/api/orders/stats');
}

export function getTradableStocks() {
  return get<TradableStockResponse[]>('/api/orders/stocks');
}
