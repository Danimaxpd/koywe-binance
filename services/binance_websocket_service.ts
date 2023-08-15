const { WebsocketStream, WebsocketAPI } = require("@binance/connector");
import { env } from "../helpers/global_const";
import { HistoryMarketData } from "../interfaces/strategies";
import { handleError } from "../helpers/handle_errors";

export default class BinanceWebSocketService {
  private binanceClientWebsocketStream: typeof WebsocketStream;
  private binanceClientWebsocketAPI: typeof WebsocketAPI;
  private historyMarketData!: HistoryMarketData | null;

  public connectWebSocketStream(): typeof WebsocketStream {
    const callbacks = {
      open: () => console.debug("Connected with Websocket server"),
      close: () => console.debug("Disconnected with Websocket server"),
      message: (data: any) => console.info(data),
    };

    this.binanceClientWebsocketStream = new WebsocketStream({ callbacks });
    // subscribe ticker stream
    return this.binanceClientWebsocketStream.ticker("bnbusdt");
  }

  public disconnectWebSocketStream(): void {
    if (this.binanceClientWebsocketStream) {
      this.binanceClientWebsocketStream.disconnect();
      console.info("Disconnected from Websocket stream");
    } else {
      console.warn("No active Websocket stream to disconnect");
    }
  }

  public connectWebSocketAPI(): typeof WebsocketAPI {
    const callbacks = {
      open: (client: any) => {
        console.info("Connected with Websocket server");
        client.historicalTrades("BNBUSDT", { limit: 10 });
      },
      close: () => console.info("Disconnected with Websocket server"),
      message: (data: any) => console.info(data),
    };
    const apiKey = env.BINANCE_API_KEY;
    this.binanceClientWebsocketAPI = new WebsocketAPI(apiKey, null, {
      callbacks,
    });
    // subscribe ticker stream
    return this.binanceClientWebsocketAPI.ticker("bnbusdt");
  }

  public disconnectWebSocketAPI(): void {
    if (this.binanceClientWebsocketAPI) {
      this.binanceClientWebsocketAPI.disconnect();
      console.info("Disconnected from Websocket API");
    } else {
      console.warn("No active Websocket API connection to disconnect");
    }
  }

  public getHistoryMarketData(symbol: string): HistoryMarketData | null {
    if (!symbol) {
      throw new Error("Symbol is required");
    }

    if (!this.historyMarketData) {
      this.historyTrades(symbol);
    }
    setTimeout(() => {
      this.historyMarketData = null;
    }, 3600000);

    return this.historyMarketData;
  }

  public async historyTrades(symbol: string): Promise<void> {
    try {
      if (!symbol) {
        throw new Error("Symbol is required");
      }
      const callbacks = {
        open: (client: any) => {
          console.info("Connected with Websocket server");
          client.historicalTrades(symbol, { limit: 100 });
        },
        close: () => console.info("Disconnected with Websocket server"),
        message: (data: any) => (this.historyMarketData = JSON.parse(data)),
      };
      const apiKey = env.BINANCE_API_KEY;

      const websocketAPIClient = await new WebsocketAPI(apiKey, null, {
        callbacks,
      });

      // disconnect after 20 seconds
      setTimeout(() => websocketAPIClient.disconnect(), 20000);
    } catch (error) {
      handleError("BinanceWebSocketService: historyTrades", error);
    }
  }
}
