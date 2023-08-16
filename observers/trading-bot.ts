import { PrismaClient } from "@prisma/client";
import { env } from "../helpers/global_const";
import StrategySelector from "../strategies/";
import { HistoryMarketData, Strategy } from "../interfaces/strategies";
import BinanceTradeService from "../services/binance_trade_service";
import { handleError } from "../helpers/handle_errors";
import {
  BinanceTradeServiceInterface,
  NewOrderRequestBody,
} from "../interfaces/binance_trade_service";

export class TradingBot {
  private strategySelector: StrategySelector;
  private binanceTradeService!: BinanceTradeServiceInterface;
  private symbol: string = "";
  private _prismaCl: PrismaClient;

  constructor(
    strategies: Strategy[],
    Symbol: string,
    prismaClient: PrismaClient
  ) {
    this.strategySelector = new StrategySelector(strategies);
    this.symbol = Symbol;
    this._prismaCl = prismaClient;
  }

  private initBinanceTradeService() {
    try {
      this.binanceTradeService = new BinanceTradeService(
        env.BINANCE_API_KEY,
        env.BINANCE_SECRET_KEY
      );
    } catch (error) {
      handleError("TradingBot: Failed to execute trade", error);
    }
  }

  public async executeTrade(data: HistoryMarketData) {
    try {
      const { strategy, score } = this.strategySelector.selectStrategy(data);
      console.info(
        `Selected strategy: ${strategy.constructor.name} with score: ${score}`
      );

      // Perform the trade based on the selected strategy
      const orderParameters = strategy.generateOrderParameters(
        data,
        this.symbol
      ) as NewOrderRequestBody;
      this.initBinanceTradeService();
      console.log("orderParameters-->>", orderParameters);
      this.binanceTradeService.setNewOrder(orderParameters);
      await this._prismaCl.trades.create({
        data: {
          timestamp: Date.now().toString(),
          // @ts-ignore
          rawData: orderParameters,
        },
      });
      console.info(`Order executed with parameters: `, orderParameters);
    } catch (error) {
      console.error(error);
    }
  }
}
