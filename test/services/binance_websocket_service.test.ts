import BinanceWebSocketService from "../../services/binance_websocket_service";

// Mocking necessary modules
const mockTrade = jest.fn();
const mockHistoricalTrades = jest.fn();
const mockDisconnect = jest.fn();

jest.mock("@binance/connector", () => ({
  WebsocketStream: jest.fn().mockImplementation(() => ({
    trade: mockTrade,
    disconnect: mockDisconnect,
  })),
  WebsocketAPI: jest.fn().mockImplementation(() => ({
    historicalTrades: mockHistoricalTrades,
    disconnect: mockDisconnect,
  })),
}));

// Mock prisma client
const mockPrismaClient = {
  historicalTrades: {
    findFirstOrThrow: jest.fn(),
    create: jest.fn(),
  },
};

describe("BinanceWebSocketService", () => {
  let service: BinanceWebSocketService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    service = new BinanceWebSocketService(mockPrismaClient as any);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test("tradesStreamConnect should create a new WebsocketStream", () => {
    const mockSymbol = "BTCUSDT";
    const requestQuery = { symbol: mockSymbol };

    service.tradesStreamConnect(requestQuery);

    expect(mockTrade).toHaveBeenCalledWith(mockSymbol);
  });

  test("tradesStreamDisconnect should disconnect an active WebsocketStream", () => {
    const mockSymbol = "BTCUSDT";
    const requestQuery = { symbol: mockSymbol };
    service.tradesStreamConnect(requestQuery);
    service.tradesStreamDisconnect();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  test("getHistoricalData should fetch the latest historical data", async () => {
    const mockData = {
      rawData: JSON.stringify({
        someKey: "someValue",
      }),
    };
    mockPrismaClient.historicalTrades.findFirstOrThrow.mockResolvedValueOnce(
      mockData
    );

    const result = await service.getHistoricalData();

    expect(result).toEqual({ someKey: "someValue" });
    expect(
      mockPrismaClient.historicalTrades.findFirstOrThrow
    ).toHaveBeenCalled();
  });

  test("fetchHistoricalTrades should fetch historical trades data", () => {
    const mockSymbol = "BTCUSDT";
    const requestQuery = { symbol: mockSymbol, options: { limit: 100 } };
    const mockData = {
      id: "0aa624bbb8a2d2d2dde8f0c77647f064",
      status: 200,
      result: [
        {
          id: 667317625,
          price: "235.20000000",
          qty: "0.10000000",
          quoteQty: "23.52000000",
          time: 1692167153513,
          isBuyerMaker: false,
          isBestMatch: true,
        },
        {
          id: 667317626,
          price: "235.20000000",
          qty: "1.45200000",
          quoteQty: "341.51040000",
          time: 1692167154536,
          isBuyerMaker: false,
          isBestMatch: true,
        },
        {
          id: 667317627,
          price: "235.10000000",
          qty: "0.30000000",
          quoteQty: "70.53000000",
          time: 1692167155528,
          isBuyerMaker: true,
          isBestMatch: true,
        },
      ],
      rateLimits: [
        {
          rateLimitType: "REQUEST_WEIGHT",
          interval: "MINUTE",
          intervalNum: 1,
          limit: 1200,
          count: 6,
        },
      ],
    };

    mockHistoricalTrades.mockImplementation((symbol, options, callback) => {
      callback(mockData);
    });
    jest.advanceTimersByTime(11000);
    service.fetchHistoricalTrades(requestQuery).then((result) => {
      expect(result).toEqual(mockData);
      expect(mockPrismaClient.historicalTrades.create).toHaveBeenCalled();
    });
  });
});
