import { TradingStrategy } from "../interfaces/trading-strategy";

export class BuyStrategy implements TradingStrategy {
  execute(): void {
    // Logic for executing a buy based on signals
    console.log("Executing a buy operation");
  }
}
