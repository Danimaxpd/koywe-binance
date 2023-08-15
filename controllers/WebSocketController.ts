import { FastifyRequest, FastifyReply } from "fastify";
import BinanceWebSocketService from "../services/binance_websocket_service";
import {
  BinanceWebSocketServiceInterface,
  tradesStreamConnectRequestQuery,
  getHistoricalDataRequestQuery,
  fetchHistoricalTradesRequestQuery,
} from "../interfaces/binance_web_socket_service";
import { TradingBot } from "../observers/trading-bot";
import { strategies } from "../strategies/index";

export class webSocketController {
  private _binanceWebSocketService!: BinanceWebSocketServiceInterface;

  constructor() {
    this._binanceWebSocketService = new BinanceWebSocketService();
  }

  async getTradesStreamConnect(request: FastifyRequest, reply: FastifyReply) {
    try {
      this._binanceWebSocketService.tradesStreamConnect(
        request.query as tradesStreamConnectRequestQuery
      );
      reply.status(200).send("Trades Stream Connect");
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  async getTradesStreamDisconnect(reply: FastifyReply) {
    try {
      this._binanceWebSocketService.tradesStreamDisconnect();
      reply.status(200).send("Trades Stream Disconnect");
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  async getHistoricalData(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = this._binanceWebSocketService.getHistoricalData(
        request.query as getHistoricalDataRequestQuery
      );
      reply.status(200).send(result);
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  fetchHistoricalTrades(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = this._binanceWebSocketService.fetchHistoricalTrades(
        request.query as fetchHistoricalTradesRequestQuery
      );

      reply.status(200).send(result);
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  async runTradingBot(request: FastifyRequest, reply: FastifyReply) {
    try {
      const marketData = this._binanceWebSocketService.getHistoricalData(
        request.query as getHistoricalDataRequestQuery
      );
      // @ts-ignore
      const symbol = request.query.symbol;

      const bot = new TradingBot(strategies, symbol);
      bot.executeTrade(marketData);
      reply.status(200).send("Executed Trading Bot");
    } catch (error) {
      reply.status(500).send(error);
    }
  }
}
