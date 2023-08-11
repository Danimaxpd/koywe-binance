import { TradingStrategy } from "../interfaces/trading-strategy";

export class SellStrategy implements TradingStrategy {
  execute(): void {
    // Logic for executing a sell based on signals
    console.log("Executing a sell operation");
  }
}
