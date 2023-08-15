import { HistoryMarketData, Strategy } from "../interfaces/strategies";
import { LimitStrategy } from "../strategies/limit_strategy";
import { MarketStrategy } from "../strategies/market_strategy";
import { StopLossStrategy } from "../strategies/stop_loss_strategy";

export default class StrategySelector {
  strategies: Strategy[];

  constructor(strategies: Strategy[]) {
    if (strategies.length === 0) {
      throw new Error("No strategies provided to StrategySelector");
    }
    this.strategies = strategies;
  }

  // Analyze data and select the best strategy
  selectStrategy(data: HistoryMarketData): {
    strategy: Strategy;
    score: number;
  } {
    let bestStrategy: Strategy | null = null;
    let highestScore = -Infinity;

    for (const strategy of this.strategies) {
      const score = strategy.analyzeData(data);
      if (score > highestScore) {
        highestScore = score;
        bestStrategy = strategy;
      }
      // If scores are equal, select randomly
      else if (score === highestScore) {
        bestStrategy = Math.random() < 0.5 ? bestStrategy : strategy;
      }
    }

    return {
      strategy: bestStrategy!,
      score: highestScore,
    };
  }
}

export const strategies = [
  new LimitStrategy(),
  new MarketStrategy(),
  new StopLossStrategy(),
];
