export interface Strategy {
  analyzeData(data: HistoryMarketData): number;
  generateOrderParameters(
    data: HistoryMarketData,
    symbols: string
  ): OrderParameters;
}

export interface MarketData {
  symbol: string;
  quantity: number;
  price: number;
  stopPrice?: number; // Only applicable for some strategies
}

export interface OrderParameters {
  type:
    | "LIMIT"
    | "MARKET"
    | "STOP_LOSS"
    | "STOP_LOSS_LIMIT"
    | "TAKE_PROFIT"
    | "TAKE_PROFIT_LIMIT"
    | "LIMIT_MAKER";
  side: "BUY" | "SELL";
  symbol: string;
  options?: {
    timeInForce?: string;
    quantity?: number;
    price?: number;
    quoteOrderQty?: number;
    stopPrice?: number;
    trailingDelta?: number;
    icebergQty?: number;
    newOrderRespType?: string;
  };
}

export interface TradeEntry {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
  isBestMatch: boolean;
}

export interface HistoryMarketData {
  quantity: number | undefined;
  id: string;
  status: number;
  result: TradeEntry[];
  rateLimits: RateLimit[];
}

export interface RateLimit {
  rateLimitType: string;
  interval: string;
  intervalNum: number;
  limit: number;
  count: number;
}
