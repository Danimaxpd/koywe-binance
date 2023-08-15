import StrategySelector from "../strategies/";
import { HistoryMarketData, Strategy } from "../interfaces/strategies";
import {
  BinanceTradeServiceInterface,
  NewOrderRequestBody,
} from "../interfaces/binance_trade_service";
import BinanceTradeService from "../services/binance_trade_service";
import { env } from "../helpers/global_const";
import { handleError } from "../helpers/handle_errors";

export class TradingBot {
  private strategySelector: StrategySelector;
  private binanceTradeService!: BinanceTradeServiceInterface;
  private symbol: string = "";

  constructor(strategies: Strategy[], Symbol: string) {
    this.strategySelector = new StrategySelector(strategies);
    this.symbol = Symbol;
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

  public executeTrade(data: HistoryMarketData) {
    try {
      const { strategy, score } = this.strategySelector.selectStrategy(data);
      console.log(
        `Selected strategy: ${strategy.constructor.name} with score: ${score}`
      );

      // Perform the trade based on the selected strategy
      const orderParameters = strategy.generateOrderParameters(
        data,
        this.symbol
      ) as NewOrderRequestBody;
      this.initBinanceTradeService();
      this.binanceTradeService.setNewOrder(orderParameters);
      console.log(`Order executed with parameters: `, orderParameters);
    } catch (error) {
      handleError("TradingBot: Failed to execute trade", error);
    }
  }
}
