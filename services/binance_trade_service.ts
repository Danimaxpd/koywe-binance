const { Spot } = require("@binance/connector");
import { handleError } from "../helpers/handle_errors";
import { env } from "../helpers/global_const";
import {
  BinanceTradeServiceInterface,
  NewOrderRequestBody,
  CancelOrderRequestBody,
  UserTradesRequestQuery,
} from "../interfaces/binance_trade_service";

export default class BinanceTradeService
  implements BinanceTradeServiceInterface
{
  private binanceClientSpot;
  private baseUrl = env.BINANCE_URL_DOMAIN;
  private apiKey: string = "";
  private apiSecret: string = "";

  constructor(ApiKey: string, ApiSecret: string) {
    this.apiKey = ApiKey;
    this.apiSecret = ApiSecret;

    try {
      if (!ApiKey || !ApiSecret) {
        throw new Error("BinanceTradeService: ApiKey or ApiSecret is empty");
      }

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
   */
  public async getAccountInfo() {
    try {
      const { data } = await this.binanceClientSpot.account();
      return data;
    } catch (error) {
      handleError("BinanceTradeService: getAccountInfo", error);
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
  public async getUserTrades(requestQuery: UserTradesRequestQuery) {
    try {
      const { symbol } = requestQuery;
      if (!symbol) {
        throw new Error("symbol is empty");
      }
      const { data } = await this.binanceClientSpot.myTrades(symbol);
      return data;
    } catch (error) {
      handleError("BinanceTradeService: getUserTrades", error);
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

  public async setNewOrder(requestBody: NewOrderRequestBody) {
    try {
      const { symbol, side, type, options } = requestBody;
      if (!symbol || !side || !type) {
        throw new Error("symbol or side or type is empty");
      }

      const { data } = await this.binanceClientSpot.newOrder(
        symbol,
        side,
        type,
        options
      );
      return data;
    } catch (error) {
      handleError("BinanceTradeService: setNewOrder", error);
    }
  }

  /**
   * Cancel Order (TRADE)<br>
   *
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#cancel-order-trade}
   *
   * @param {string} symbol
   * @param {object} [options]
   * @param {number} [options.orderId]
   * @param {string} [options.origClientOrderId]
   * @param {string} [options.newClientOrderId]
   * @param {number} [options.recvWindow] - The value cannot be greater than 60000
   * 
   * Order status

    The order only can be cancelled if it’s status is NEW or PARTIALLY_FILLED
    The order in other status like FILLED, CANCELED, etc can NOT be cancelled.

   */

  public async cancelOrder(requestBody: CancelOrderRequestBody) {
    try {
      const { symbol, options = {} } = requestBody;
      if (!symbol) {
        throw new Error("symbol is empty");
      }
      // Added 59999 to avoid Error 1021  Timestamp for this request is outside of the recvWindow
      options.recvWindow = 59999;
      const res = await this.binanceClientSpot.getOrder(symbol, options);
      // The order in other status like FILLED, CANCELED, etc can NOT be cancelled.
      if (res.data.status !== "NEW" && res.data.status !== "PARTIALLY_FILLED") {
        throw new Error(`Order ${res.data.orderId} is ${res.data.status}`);
      }
      const { data } = await this.binanceClientSpot.cancelOrder(
        symbol,
        options
      );
      return data;
    } catch (error) {
      handleError("BinanceTradeService: cancelOrder", error);
    }
  }
}
