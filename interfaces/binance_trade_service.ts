export interface NewOrderOptions {
  timeInForce?: string;
  quantity?: number;
  quoteOrderQty?: number;
  price?: number;
  newClientOrderId?: string;
  strategyId?: number;
  strategytype?: number;
  stopPrice?: number;
  trailingDelta?: number;
  icebergQty?: number;
  newOrderRespType?: string;
  recvWindow?: number;
}

export interface C2CTradeHistoryOptions {
  startTimestamp?: number;
  endTimestamp?: number;
  page?: number;
  rows?: number;
  recvWindow?: number;
}
export interface CancelOrderOptions {
  orderId?: number;
  origClientOrderId?: string;
  newClientOrderId?: string;
  recvWindow?: number;
}

export interface BinanceTradeServiceInterface {
  getAccountInfo(): Promise<any>;
  getUserTrades(): Promise<any>;
  getC2cTradeHistory(
    tradeType: string,
    options: C2CTradeHistoryOptions
  ): Promise<any>;
  setNewOrder(
    symbol: string,
    side: string,
    type: string,
    options: NewOrderOptions
  ): Promise<any>;
  cancelOrder(symbol: string, options: CancelOrderOptions): Promise<any>;
}

export enum TradeTypeEnum {
  BUY = "BUY",
  SELL = "SELL",
}
