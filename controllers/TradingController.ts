import { TradingStrategy } from "../interfaces/trading-strategy";

export class TradingController {
  private activeStrategy: TradingStrategy | null = null;

  setStrategy(strategy: TradingStrategy): void {
    this.activeStrategy = strategy;
  }

  executeStrategy(): void {
    if (this.activeStrategy) {
      this.activeStrategy.execute();
    } else {
      console.log("No active strategy set.");
    }
  }
}
