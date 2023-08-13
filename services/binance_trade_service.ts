const { Spot } = require("@binance/connector");
import { handleError } from "../helpers/handle_errors";
import { BINANCE_URL_DOMAIN } from "../helpers/global_const";
import {
  BinanceTradeServiceInterface,
  NewOrderOptions,
  C2CTradeHistoryOptions,
  CancelOrderOptions,
  TradeTypeEnum,
} from "../interfaces/binance_trade_service";

// @TODO Change the promise<any> to the correct type

export default class BinanceTradeService
  implements BinanceTradeServiceInterface
{
  private binanceClientSpot;
  private baseUrl = BINANCE_URL_DOMAIN;
  private apiKey: string = "";
  private apiSecret: string = "";

  constructor(ApiKey: string, ApiSecret: string) {
    this.apiKey = ApiKey;
    this.apiSecret = ApiSecret;

    try {
      this.binanceClientSpot = new Spot(this.apiKey, this.apiSecret, {
        baseURL: this.baseUrl,
      });
    } catch (error) {
      console.error(`Failed to initialize Binance client: ${error}`);
      throw error;
    }
  }
  /**
   * Account Information (USER_DATA)<br>
   *
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#account-information-user_data}
   *
   * @param {object} [options]
   * @param {number} [options.recvWindow] - The value cannot be greater than 60000
   */
  public async getAccountInfo() {
    try {
      const response = await this.binanceClientSpot.account();
      console.log(response.data);
    } catch (error) {
      handleError("getAccountInfo", error);
    }
  }
  /**
   * Account Trade List (USER_DATA)<br>
   *
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#account-trade-list-user_data}
   *
   * @param {string} symbol
   * @param {object} [options]
   * @param {number} [options.orderId] - This can only be used in combination with symbol.
   * @param {number} [options.startTime]
   * @param {number} [options.endTime]
   * @param {number} [options.fromId]
   * @param {number} [options.limit]
   * @param {number} [options.recvWindow] - The value cannot be greater than 60000
   */
  public async getUserTrades(symbol: string): Promise<any> {
    try {
      const response = await this.binanceClientSpot.myTrades(symbol);
      console.log(response.data);
      return response.data;
    } catch (error) {
      handleError("getUserTrades", error);
    }
  }
  /**
   * Get C2C Trade History (USER_DATA)<br>
   *
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#get-c2c-trade-history-user_data}
   *
   * @param {string} tradeType - BUY, SELL
   * @param {object} [options]
   * @param {number} [options.startTimestamp] - The max interval between startTimestamp and endTimestamp is 30 days.<br>
   *     If startTimestamp and endTimestamp are not sent, the recent 30-day data will be returned.
   * @param {number} [options.endTimestamp]
   * @param {number} [options.page] - default 1
   * @param {number} [options.rows] - default 100, max 100
   * @param {number} [options.recvWindow]
   *
   */
  public async getC2cTradeHistory(
    TradeType: TradeTypeEnum,
    options: C2CTradeHistoryOptions = {}
  ): Promise<any> {
    try {
      const response = await this.binanceClientSpot.c2cTradeHistory(
        TradeType,
        options
      );
      console.log("getC2cTradeHistory", response.data);
      return response.data;
    } catch (error) {
      handleError("getC2cTradeHistory", error);
    }
  }
  /**
   * New Order (TRADE)<br>
   *
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#new-order-trade}
   *
   * @param {string} symbol
   * @param {string} side
   * @param {string} type
   * @param {object} [options]
   * @param {string} [options.timeInForce]
   * @param {number} [options.quantity]
   * @param {number} [options.quoteOrderQty]
   * @param {number} [options.price]
   * @param {string} [options.newClientOrderId]
   * @param {number} [options.strategyId]
   * @param {number} [options.strategytype] - The value cannot be less than 1000000.
   * @param {number} [options.stopPrice]
   * @param {number} [options.trailingDelta]
   * @param {number} [options.icebergQty]
   * @param {string} [options.newOrderRespType]
   * @param {number} [options.recvWindow] - The value cannot be greater than 60000
   */

  public async setNewOrder(
    symbol: string,
    side: string,
    type: string,
    options: NewOrderOptions
  ): Promise<any> {
    try {
      const response = await this.binanceClientSpot.newOrder(
        symbol,
        side,
        type,
        options
      );
      console.log("setNewOrder", response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Spot.InvalidOrderParameters) {
        console.error("Invalid order parameters:", error);
      } else {
        handleError("setNewOrder", error);
      }
    }
  }

  /**
   * Cancel Order (TRADE)<br>
   *
   * DELETE /api/v3/order<br>
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#cancel-order-trade}
   *
   * @param {string} symbol
   * @param {object} [options]
   * @param {number} [options.orderId]
   * @param {string} [options.origClientOrderId]
   * @param {string} [options.newClientOrderId]
   * @param {number} [options.recvWindow] - The value cannot be greater than 60000
   */

  public async cancelOrder(
    symbol: string,
    options: CancelOrderOptions
  ): Promise<any> {
    try {
      const response = await this.binanceClientSpot.cancelOrder(
        symbol,
        options
      );
      console.log("cancelOrder", response.data);
      return response.data;
    } catch (error) {
      handleError("cancelOrder", error);
    }
  }
}
