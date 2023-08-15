const { WebsocketStream, WebsocketAPI } = require("@binance/connector");
import { env } from "../helpers/global_const";
import { HistoryMarketData } from "../interfaces/strategies";
import { handleError } from "../helpers/handle_errors";
import {
  BinanceWebSocketServiceInterface,
  tradesStreamConnectRequestQuery,
  getHistoricalDataRequestQuery,
  fetchHistoricalTradesRequestQuery,
} from "../interfaces/binance_web_socket_service";

export default class BinanceWebSocketService
  implements BinanceWebSocketServiceInterface
{
  private _trade: typeof WebsocketStream;
  private _historyMarketData!: HistoryMarketData;
  private cachedCurrencies: {} = {};
  private lastUpdateTimestamp: number = 0;
  /**
   * Trade Streams<br>
   *
   * The Trade Streams push raw trade information; each trade has a unique buyer and seller.<br>
   *
   * Stream Name: &lt;symbol&gt;@trade <br>
   * Update Speed: Real-time<br>
   *
   * {@link https://binance-docs.github.io/apidocs/spot/en/#trade-streams}
   *
   * @param {string} symbol
   */
  public tradesStreamConnect(
    requestQuery: tradesStreamConnectRequestQuery
  ): typeof WebsocketStream {
    const symbol = requestQuery.symbol;

    if (!symbol) {
      throw new Error("Symbol is required");
    }
    const callbacks = {
      open: () => console.debug("Connected with Websocket server"),
      close: () => console.debug("Disconnected with Websocket server"),
      message: (data: any) => console.info(data),
    };
    if (this._trade) {
      this.tradesStreamDisconnect();
    }
    this._trade = new WebsocketStream({ callbacks });
    return this._trade.trade(symbol);
  }

  public tradesStreamDisconnect(): void {
    if (this._trade) {
      this._trade.disconnect();
      console.info("Disconnected from Websocket stream");
    } else {
      console.warn("No active Websocket stream to disconnect");
    }
  }
  /**
   * Historical trades < br>
   * Get historical trades cache.<br>
   * @param {string} symbol
   */
  public getHistoricalData(
    requestQuery: getHistoricalDataRequestQuery
  ): HistoryMarketData {
    const symbol = requestQuery.symbol;
    const currentTime = Date.now();
    if (
      !this.cachedCurrencies ||
      currentTime - this.lastUpdateTimestamp >= 60000
    ) {
      if (!symbol) {
        throw new Error("Symbol is required");
      }
      console.log(
        "!this.cachedCurrencies",
        !this.cachedCurrencies,
        this.cachedCurrencies
      );
      console.log("this._historyMarketData", this._historyMarketData);
      if (!this.cachedCurrencies) {
        try {
          const requestQuery = { symbol, options: {} };
          this.fetchHistoricalTrades(requestQuery);
        } catch (error) {
          throw new Error("Failed to fetch historical trades");
        }
      }
    }

    return this._historyMarketData;
  }

  /**
   * Historical trades < br>
   *
   * Get historical trades.<br>
   *
   *
   * {@link https://binance-docs.github.io/apidocs/websocket_api/en/#historical-trades-market_data}
   *
   * @param {string} symbol
   * @param {object} [options]
   * @param {number} [options.limit]
   * @param {number} [options.fromId]
   *
   */
  public fetchHistoricalTrades(
    requestQuery: fetchHistoricalTradesRequestQuery
  ): void {
    try {
      const { symbol, options = { limit: 100 } } = requestQuery;
      if (!symbol) {
        throw new Error("Symbol is required");
      }

      const callbacks = {
        open: (client: any) => {
          console.info("Connected with Websocket server");
          client.historicalTrades(symbol, options);
        },
        close: () => {
          console.info("Disconnected with Websocket server");
        },
        message: (data: any) => {
          try {
            this._historyMarketData = JSON.parse(data);
            this.cachedCurrencies = JSON.parse(data);
          } catch (error) {
            console.error("Error parsing data:", error);
          }
        },
      };

      const apiKey = env.BINANCE_API_KEY;

      const websocketAPIClient = new WebsocketAPI(apiKey, null, {
        callbacks,
      });

      // Disconnecting after 10 seconds might not always be the best approach.
      // Consider finding a better event or timeout based on your use-case.
      setTimeout(() => websocketAPIClient.disconnect(), 10000);
    } catch (error) {
      handleError("BinanceWebSocketService: fetchHistoricalTrades", error);
    }
  }
}
