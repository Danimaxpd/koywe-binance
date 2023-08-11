import { SignalObserver } from "../interfaces/signal-observer";
import { TradingStrategy } from "../interfaces/trading-strategy";

export class TradingBot implements SignalObserver {
  private strategy: TradingStrategy;

  constructor(strategy: TradingStrategy) {
    this.strategy = strategy;
  }

  updateSignal(signal: string, strategy: TradingStrategy): void {
    console.log("Signal received in the bot:", signal);
    if (strategy === this.strategy) {
      this.strategy.execute();
    }
  }
}
