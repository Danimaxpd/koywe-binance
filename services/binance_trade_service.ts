const { Spot } = require("@binance/connector");
const { BINANCE_URL_DOMAIN } = require("../helpers/global_const");
import { BinanceTradeServiceInterface } from "../interfaces/binance_trade_service";

export default class BinanceTradeService
  implements BinanceTradeServiceInterface
{
  private binanceClientSpot;
  private baseUrl = BINANCE_URL_DOMAIN;

  constructor() {
    const apiKey = "";
    const apiSecret = "";
    this.binanceClientSpot = new Spot(apiKey, apiSecret, {
      baseURL: this.baseUrl,
    });
  }

  public getAccountInfo() {
    this.binanceClientSpot
      .account()
      .then((response) => client.logger.log(response.data));
  }

  public getUserTrades() {
    this.binanceClientSpot
      .myTrades("BNBUSDT")
      .then((response) => client.logger.log(response.data))
      .catch((error) => client.logger.error(error));
  }

  public getC2cTradeHistory() {
    this.binanceClientSpot
      .c2cTradeHistory("BUY")
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  }
  public getOrder() {
    this.binanceClientSpot
      .getOrder("BNBUSDT", {
        orderId: 52,
      })
      .then((response) => client.logger.log(response.data))
      .catch((error) => client.logger.error(error));
  }

  public setNewOrder() {
    this.binanceClientSpot
      .newOrder("BNBUSDT", "BUY", "LIMIT", {
        price: "350",
        quantity: 1,
        timeInForce: "GTC",
      })
      .then((response) => this.binanceClientSpot.logger.log(response.data))
      .catch((error) => this.binanceClientSpot.logger.error(error));
  }

  public cancelOrder(orderId) {
    this.binanceClientSpot
      .cancelOrder("BNBUSDT", {
        orderId,
      })
      .then((response) => this.binanceClientSpot.logger.log(response.data))
      .catch((error) => this.binanceClientSpot.logger.error(error));
  }
}
