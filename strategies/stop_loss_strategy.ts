import {
  HistoryMarketData,
  Strategy,
  OrderParameters,
} from "../interfaces/strategies";

export class StopLossStrategy implements Strategy {
  analyzeData(data: HistoryMarketData): number {
    // Basic example: Favor this strategy if price is trending down
    const currentPrice = parseFloat(data.result[0].price);
    const previousPrice = parseFloat(data.result[data.result.length - 1].price);
    return previousPrice - currentPrice;
  }

  generateOrderParameters(
    data: HistoryMarketData,
    symbol: string
  ): OrderParameters {
    const stopPrice = parseFloat(data.result[0].price) * 0.97; // 3% below current price
    const orderParameters: OrderParameters = {
      type: "STOP_LOSS",
      symbol,
      side: "SELL",
      options: {
        quantity: data.quantity,
        stopPrice: stopPrice,
      },
    };
    return orderParameters;
  }
}
