import { FastifyRequest, FastifyReply } from "fastify";
import BinanceTradeService from "../services/binance_trade_service";
import {
  BinanceTradeServiceInterface,
  NewOrderRequestBody,
  CancelOrderRequestBody,
} from "../interfaces/binance_trade_service";
import { env } from "../helpers/global_const";

export class tradeApiController {
  private binanceTradeService!: BinanceTradeServiceInterface;

  constructor(reply: FastifyReply) {
    this.initBinanceTradeService(reply);
  }

  initBinanceTradeService(reply: FastifyReply) {
    try {
      this.binanceTradeService = new BinanceTradeService(
        env.BINANCE_API_KEY,
        env.BINANCE_SECRET_KEY
      );
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  async getAccountInfo(reply: FastifyReply) {
    try {
      reply.status(200).send(await this.binanceTradeService.getAccountInfo());
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  async getUserTrades(reply: FastifyReply) {
    try {
      reply.status(200).send(await this.binanceTradeService.getAccountInfo());
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  async setNewOrder(request: FastifyRequest, reply: FastifyReply) {
    try {
      reply
        .status(200)
        .send(
          await this.binanceTradeService.setNewOrder(
            request.body as NewOrderRequestBody
          )
        );
    } catch (error) {
      reply.status(400).send(error);
    }
  }

  async cancelOrder(request: FastifyRequest, reply: FastifyReply) {
    try {
      reply
        .status(200)
        .send(
          await this.binanceTradeService.cancelOrder(
            request.body as CancelOrderRequestBody
          )
        );
    } catch (error) {
      reply.status(400).send(error);
    }
  }
}
