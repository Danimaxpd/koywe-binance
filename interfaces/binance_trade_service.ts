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

export interface CancelOrderOptions {
  orderId?: number;
  origClientOrderId?: string;
  newClientOrderId?: string;
  recvWindow?: number;
}

export interface NewOrderRequestBody {
  symbol: string;
  side: string;
  type: string;
  options?: NewOrderOptions;
}

export interface CancelOrderRequestBody {
  symbol: string;
  options?: CancelOrderOptions;
}

export interface UserTradesRequestQuery {
  symbol: string;
}

// BinanceTradeServiceInterface
export interface BinanceTradeServiceInterface {
  getAccountInfo(): Promise<AccountInfo | Error | undefined>;
  getUserTrades(
    requestQuery: UserTradesRequestQuery
  ): Promise<UserTrades | Error | undefined>;
  setNewOrder(
    requestBody: NewOrderRequestBody
  ): Promise<Order | Error | undefined>;
  cancelOrder(
    requestBody: CancelOrderRequestBody
  ): Promise<OrderCancellationResponse | Error | undefined>;
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

export interface Order {
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
