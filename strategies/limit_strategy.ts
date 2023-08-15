import {
  HistoryMarketData,
  Strategy,
  OrderParameters,
} from "../interfaces/strategies";

export class LimitStrategy implements Strategy {
  analyzeData(data: HistoryMarketData): number {
    // Basic example: Favor this strategy if the price is trending up
    const currentPrice = parseFloat(data.result[0].price);
    const previousPrice = parseFloat(data.result[data.result.length - 1].price);
    return currentPrice - previousPrice;
  }

  generateOrderParameters(
    data: HistoryMarketData,
    symbol: string
  ): OrderParameters {
    const price = parseFloat(data.result[0].price) * 0.98; // 2% below current price
    const orderParameters: OrderParameters = {
      type: "LIMIT",
      symbol,
      timeInForce: "GTC",
      quantity: data.quantity || 1,
      price: price,
    };
    return orderParameters;
  }
}
