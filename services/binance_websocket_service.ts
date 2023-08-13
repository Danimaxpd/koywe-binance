const { WebsocketStream, WebsocketAPI } = require("@binance/connector");

export default class BinanceWebSocketService {
  private binanceClientWebsocketStream: typeof WebsocketStream;
  private binanceClientWebsocketAPI: typeof WebsocketAPI;

  constructor() {}

  public connectWebSocketStream(): typeof WebsocketStream {
    const callbacks = {
      open: () => console.debug("Connected with Websocket server"),
      close: () => console.debug("Disconnected with Websocket server"),
      message: (data) => console.info(data),
    };

    this.binanceClientWebsocketStream = new WebsocketStream({ callbacks });
    // subscribe ticker stream
    return this.binanceClientWebsocketStream.ticker("bnbusdt");
  }

  public disconnectWebSocketStream(): void {
    this.binanceClientWebsocketStream.disconnect();
    console.info("Disconnected from websocket stream");
  }

  public connectWebSocketAPI(): typeof WebsocketAPI {
    const callbacks = {
      open: (client) => {
        console.debug("Connected with Websocket server");
        // send message to get orderbook info after connection open
        client.orderbook("BTCUSDT");
        client.orderbook("BNBUSDT", { limit: 10 });
      },
      close: () => console.debug("Disconnected with Websocket server"),
      message: (data) => console.info(data),
    };

    this.binanceClientWebsocketAPI = new WebsocketAPI(null, null, {
      callbacks,
    });
    // subscribe ticker stream
    return this.binanceClientWebsocketAPI.ticker("bnbusdt");
  }

  public disconnectWebSocketAPI(): void {
    this.binanceClientWebsocketAPI.disconnect();
    console.info("Disconnected from websocket API");
  }
}
