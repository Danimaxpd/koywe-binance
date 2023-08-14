const { WebsocketStream, WebsocketAPI } = require("@binance/connector");

export default class BinanceWebSocketService {
  private binanceClientWebsocketStream: typeof WebsocketStream;
  private binanceClientWebsocketAPI: typeof WebsocketAPI;

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
        console.debug("Connected with Websocket server");
        // send message to get orderbook info after connection open
        client.orderbook("BTCUSDT");
        client.orderbook("BNBUSDT", { limit: 10 });
      },
      close: () => console.debug("Disconnected with Websocket server"),
      message: (data: any) => console.info(data),
    };

    this.binanceClientWebsocketAPI = new WebsocketAPI(null, null, {
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
}
