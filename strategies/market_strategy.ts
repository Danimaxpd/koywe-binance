import {
  HistoryMarketData,
  Strategy,
  OrderParameters,
} from "../interfaces/strategies";

export class MarketStrategy implements Strategy {
  analyzeData(data: HistoryMarketData): number {
    // Basic example: Favor this strategy if high volatility (difference between highest and lowest price)
    const prices = data.result.map((r) => parseFloat(r.price));
    return Math.max(...prices) - Math.min(...prices);
  }

  generateOrderParameters(
    data: HistoryMarketData,
    symbol: string
  ): OrderParameters {
    const orderParameters: OrderParameters = {
      type: "MARKET",
      symbol,
      quantity: data.quantity || 1,
    };
    return orderParameters;
  }
}
