import { PrismaClient } from "@prisma/client";
import { SocketStream } from "@fastify/websocket";
import { FastifyRequest, FastifyReply } from "fastify";
import BinanceWebSocketService from "../services/binance_websocket_service";
import { TradingBot } from "../observers/trading-bot";
import { strategies } from "../strategies/index";
import {
  BinanceWebSocketServiceInterface,
  tradesStreamConnectRequestQuery,
  fetchHistoricalTradesRequestQuery,
} from "../interfaces/binance_web_socket_service";

export class webSocketController {
  private _binanceWebSocketService!: BinanceWebSocketServiceInterface;
  private _prismaClient!: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this._prismaClient = prismaClient;
    this._binanceWebSocketService = new BinanceWebSocketService(prismaClient);
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
      reply
        .status(200)
        .send(await this._binanceWebSocketService.getHistoricalData());
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  async fetchHistoricalTrades(
    connection: SocketStream,
    request: FastifyRequest
  ) {
    // Error handling function to avoid duplication
    const handleError = (err: Error) => {
      console.error("fetchHistoricalTrades Error:", err);
      connection.socket.send(
        `An error occurred while processing your request. ${err}`
      );
      connection.socket.close();
    };

    try {
      const requestQuery = request.query as fetchHistoricalTradesRequestQuery;
      const result = await this._binanceWebSocketService.fetchHistoricalTrades(
        requestQuery
      );

      // @ts-ignore type error in fastify-websocket library
      connection.socket.send(result);

      connection.socket.on("error", console.error);

      connection.socket.on("message", async () => {
        try {
          connection.socket.send("Data retrieved from the database");
          const dbData =
            await this._binanceWebSocketService.getHistoricalData();
          // @ts-ignore type error in fastify-websocket library
          connection.socket.send(dbData);
        } catch (innerError) {
          handleError(innerError as Error);
        }
      });
    } catch (error) {
      handleError(error as Error);
    }
  }

  async runTradingBot(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { symbols: symbolStr } = request.query as { symbols: string };

      if (!symbolStr) {
        return reply.status(400).send("Symbols query parameter is required.");
      }

      const symbols = symbolStr.split(",");
      const marketData =
        await this._binanceWebSocketService.getHistoricalData();
      console.info("SYMBOL: ", symbols.length);
      reply
        .status(200)
        .send("Executing Trading Bot for each symbol, check logs for details");

      for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        console.info("SYMBOL: ", symbol);
        const bot = new TradingBot(strategies, symbol, this._prismaClient);
        bot.executeTrade(marketData);
      }
    } catch (error) {
      reply.status(500).send(error);
    }
  }
}
