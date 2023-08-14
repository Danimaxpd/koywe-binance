import BinanceTradeService from "../../services/binance_trade_service";
// @ts-ignore
import { Spot } from "@binance/connector";

// Rename the manual interface to avoid conflict
interface MockedSpot {
  account(): Promise<any>;
  myTrades(symbol: string): Promise<any>;
  newOrder(
    symbol: string,
    side: string,
    type: string,
    options: any
  ): Promise<any>;
  getOrder(symbol: string, options: any): Promise<any>;
  cancelOrder(symbol: string, options: any): Promise<any>;
}

// Mock the Spot class from @binance/connector
jest.mock("@binance/connector", () => {
  return {
    Spot: jest.fn().mockImplementation(() => ({
      account: jest.fn(),
      myTrades: jest.fn(),
      newOrder: jest.fn(),
      getOrder: jest.fn(),
      cancelOrder: jest.fn(),
    })),
  };
});

describe("BinanceTradeService", () => {
  let binanceTradeService: BinanceTradeService;
  let binanceClientSpotMock: jest.Mocked<MockedSpot>;

  beforeEach(() => {
    binanceClientSpotMock = new Spot() as jest.Mocked<MockedSpot>;
    binanceTradeService = new BinanceTradeService("apiKey", "apiSecret");
    binanceTradeService["binanceClientSpot"] = binanceClientSpotMock;
  });

  // @TODO Generate more tests for the other methods
  describe("getAccountInfo", () => {
    it("should fetch account information", async () => {
      // Mock the response
      const mockAccountInfo = {
        /* Mocked account info data */
      };
      binanceClientSpotMock.account.mockResolvedValueOnce({
        data: mockAccountInfo,
      });

      const result = await binanceTradeService.getAccountInfo();

      expect(result).toEqual(mockAccountInfo);
    });
  });
});
