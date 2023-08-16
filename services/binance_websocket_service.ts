import { PrismaClient } from "@prisma/client";
const { WebsocketStream, WebsocketAPI } = require("@binance/connector");
import { env } from "../helpers/global_const";
import { HistoryMarketData } from "../interfaces/strategies";
import {
  BinanceWebSocketServiceInterface,
  tradesStreamConnectRequestQuery,
  fetchHistoricalTradesRequestQuery,
} from "../interfaces/binance_web_socket_service";

export default class BinanceWebSocketService
  implements BinanceWebSocketServiceInterface
{
  private _trade: typeof WebsocketStream;
  private _prismaCl;

  constructor(prismaClient: PrismaClient) {
    this._prismaCl = prismaClient;
  }
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
    setTimeout(() => this.tradesStreamDisconnect(), 300000); // Disconnect after 5 minutes
    return this._trade.trade(symbol);
  }
  /**
   * Disconnects the trade stream
   * @returns {void}
   * @memberof BinanceWebSocketService
   */
  public tradesStreamDisconnect(): void {
    if (this._trade) {
      this._trade.disconnect();
      console.info("Disconnected from Websocket stream");
    } else {
      console.warn("No active Websocket stream to disconnect");
    }
  }

  /**
   * Get historical data < br>
   *
   * @returns {Array} Promise<HistoryMarketData>
   *
   * */
  public async getHistoricalData(): Promise<HistoryMarketData> {
    const dbData = await this._prismaCl.historicalTrades.findFirstOrThrow({
      orderBy: {
        createdAt: "desc",
      },
    });
    // @ts-ignore Prisma don't have custom types for the moment - https://www.npmjs.com/package/prisma-json-types-generator This project should be a temporary workaround
    return JSON.parse(dbData.rawData);
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
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { symbol, options = { limit: 100 } } = requestQuery;
        if (!symbol) {
          reject("Symbol is required");
        }

        const callbacks = {
          open: (client: any) => {
            console.info("Connected with Websocket server");
            client.historicalTrades(symbol, options);
          },
          close: () => {
            console.info("Disconnected with Websocket server");
          },
          message: async (data: any) => {
            try {
              await this._prismaCl.historicalTrades.create({
                data: {
                  rawData: data,
                },
              });
              resolve(data); // Return the fetched data
            } catch (error) {
              console.error("Error parsing data:", error);
              reject(error); // Reject promise on error
            }
          },
        };

        const apiKey = env.BINANCE_API_KEY;

        const websocketAPIClient = new WebsocketAPI(apiKey, null, {
          callbacks,
        });

        setTimeout(() => {
          websocketAPIClient.disconnect();
          reject(new Error("Timed out"));
        }, 10000);
      } catch (error) {
        reject(`BinanceWebSocketService: fetchHistoricalTrades: ${error}`);
      }
    });
  }
}
