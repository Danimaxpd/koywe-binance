import {
  HistoryMarketData,
  Strategy,
  OrderParameters,
} from "../interfaces/strategies";

export class MarketStrategy implements Strategy {
  private _sideValue: "BUY" | "SELL";
  private _analyzeDataValue: number;

  constructor() {
    this._sideValue = "BUY";
    this._analyzeDataValue = 0;
  }

  analyzeData(data: HistoryMarketData): number {
    // Basic example: Favor this strategy if high volatility (difference between highest and lowest price)
    const prices = data.result.map((r) => parseFloat(r.price));
    this._analyzeDataValue = Math.max(...prices) - Math.min(...prices);
    return this._analyzeDataValue;
  }

  generateOrderParameters(
    data: HistoryMarketData,
    symbol: string
  ): OrderParameters {
    if (this._analyzeDataValue > 100) {
      this._sideValue = "BUY";
    } else {
      this._sideValue = "SELL";
    }
    const orderParameters: OrderParameters = {
      type: "MARKET",
      symbol,
      side: this._sideValue,
      options: {
        quantity: data.quantity || 1,
      },
    };
    return orderParameters;
  }
}
