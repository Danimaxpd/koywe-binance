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
  getAccountInfo(): Promise<AccountInfo>;
  getUserTrades(symbol: string): Promise<UserTrades>;
  setNewOrder(
    symbol: string,
    side: string,
    type: string,
    options: NewOrderOptions
  ): Promise<Order>;
  cancelOrder(
    symbol: string,
    options: CancelOrderOptions
  ): Promise<OrderCancellationResponse>;
}
/** Responses interfaces **/
interface Balance {
  asset: string;
  free: string;
  locked: string;
}

interface CommissionRates {
  maker: string;
  taker: string;
  buyer: string;
  seller: string;
}

interface AccountInfo {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  commissionRates: CommissionRates;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  brokered: boolean;
  requireSelfTradePrevention: boolean;
  preventSor: boolean;
  updateTime: number;
  accountType: string;
  balances: Balance[];
  permissions: string[];
  uid: bigint;
}

interface UserTrades {
  symbol: string;
  id: number;
  orderId: number;
  orderListId: number | -1; // Unless OCO, the value will always be -1
  price: string;
  qty: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
  isBestMatch: boolean;
}

interface OrderFill {
  price: string;
  qty: string;
  commission: string;
  commissionAsset: string;
  tradeId: number;
}

interface Order {
  symbol: string;
  orderId: number;
  orderListId: number | -1; // Unless OCO, the value will always be -1
  clientOrderId: string;
  transactTime: number;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  workingTime: number;
  selfTradePreventionMode: string;
  fills: OrderFill[];
}

interface OrderCancellationResponse {
  symbol: string;
  origClientOrderId: string;
  orderId: number;
  orderListId: number | -1; // Unless OCO, the value will always be -1
  clientOrderId: string;
  transactTime: number;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  selfTradePreventionMode: string;
}
