import { HistoryMarketData } from "./strategies";
const { WebsocketStream } = require("@binance/connector");

export interface tradesStreamConnectRequestQuery {
  symbol: string;
}

export interface getHistoricalDataRequestQuery {
  symbol: string;
}
export interface fetchHistoricalTradesRequestQuery {
  symbol: string;
  options?: { limit?: number; fromId?: number };
}

export interface BinanceWebSocketServiceInterface {
  tradesStreamConnect(
    requestQuery: tradesStreamConnectRequestQuery
  ): typeof WebsocketStream;
  tradesStreamDisconnect(): void;
  getHistoricalData(
    requestQuery: getHistoricalDataRequestQuery
  ): HistoryMarketData;
  fetchHistoricalTrades(requestQuery: fetchHistoricalTradesRequestQuery): void;
}
