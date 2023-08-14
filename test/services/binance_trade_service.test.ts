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

  describe("getAccountInfo", () => {
    it("should fetch account information", async () => {
      // Mock the response
      const mockAccountInfo = {
        makerCommission: 0,
        takerCommission: 0,
        buyerCommission: 0,
        sellerCommission: 0,
        commissionRates: {
          maker: "0.00000000",
          taker: "0.00000000",
          buyer: "0.00000000",
          seller: "0.00000000",
        },
        canTrade: true,
        canWithdraw: false,
        canDeposit: false,
        brokered: false,
        requireSelfTradePrevention: false,
        preventSor: false,
        updateTime: 1691994146689,
        accountType: "SPOT",
        balances: [
          {
            asset: "BNB",
            free: "1001.00000000",
            locked: "0.00000000",
          },
          {
            asset: "BTC",
            free: "1.00000000",
            locked: "0.00000000",
          },
          {
            asset: "BUSD",
            free: "10000.00000000",
            locked: "0.00000000",
          },
          {
            asset: "ETH",
            free: "100.00000000",
            locked: "0.00000000",
          },
          {
            asset: "LTC",
            free: "500.00000000",
            locked: "0.00000000",
          },
          {
            asset: "TRX",
            free: "500000.00000000",
            locked: "0.00000000",
          },
          {
            asset: "USDT",
            free: "9759.14000000",
            locked: "0.00000000",
          },
          {
            asset: "XRP",
            free: "50000.00000000",
            locked: "0.00000000",
          },
        ],
        permissions: ["SPOT"],
        uid: 1691723715780558600,
      };
      binanceClientSpotMock.account.mockResolvedValueOnce({
        data: mockAccountInfo,
      });

      const result = await binanceTradeService.getAccountInfo();

      expect(result).toEqual(mockAccountInfo);
    });
  });

  describe("getUserTrades", () => {
    it("should fetch user trades", async () => {
      // Mock the response
      const mockUserTrades = [
        {
          symbol: "BNBUSDT",
          id: 49600,
          orderId: 747403,
          orderListId: -1,
          price: "240.86000000",
          qty: "1.00000000",
          quoteQty: "240.86000000",
          commission: "0.00000000",
          commissionAsset: "BNB",
          time: 1691994146689,
          isBuyer: true,
          isMaker: false,
          isBestMatch: true,
        },
      ];
      binanceClientSpotMock.myTrades.mockResolvedValueOnce({
        data: mockUserTrades,
      });

      const result = await binanceTradeService.getUserTrades({
        symbol: "BTCUSDT",
      });

      expect(result).toEqual(mockUserTrades);
    });

    it("should throw an error if symbol is not provided", async () => {
      // @ts-ignore
      await expect(binanceTradeService.getUserTrades({})).rejects.toThrow(
        "symbol is empty"
      );
    });
  });

  describe("setNewOrder", () => {
    it("should place a new order", async () => {
      // Mock the response
      const mockOrder = {
        symbol: "BNBUSDT",
        orderId: 747403,
        orderListId: -1,
        clientOrderId: "4oqrOh8is0gKmWNbRPTc6C",
        transactTime: 1691994146689,
        price: "350.00000000",
        origQty: "1.00000000",
        executedQty: "1.00000000",
        cummulativeQuoteQty: "240.86000000",
        status: "FILLED",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "BUY",
        workingTime: 1691994146689,
        fills: [
          {
            price: "240.86000000",
            qty: "1.00000000",
            commission: "0.00000000",
            commissionAsset: "BNB",
            tradeId: 49600,
          },
        ],
        selfTradePreventionMode: "NONE",
      };
      binanceClientSpotMock.newOrder.mockResolvedValueOnce({
        data: mockOrder,
      });

      const requestBody = {
        symbol: "BTCUSDT",
        side: "BUY",
        type: "LIMIT",
        options: {},
      };
      const result = await binanceTradeService.setNewOrder(requestBody);

      expect(result).toEqual(mockOrder);
    });

    it("should throw an error if required parameters are missing", async () => {
      const requestBody = {
        // Missing required parameters
      };
      await expect(
        // @ts-ignore
        binanceTradeService.setNewOrder(requestBody)
      ).rejects.toThrow("symbol or side or type is empty");
    });
  });
  describe("cancelOrder", () => {
    it("should cancel an order", async () => {
      // Mock the getOrder response
      const mockGetOrderResponse = {
        data: {
          status: "NEW",
          orderId: 4,
        },
      };
      binanceClientSpotMock.getOrder.mockResolvedValueOnce(
        mockGetOrderResponse
      );

      // Mock the cancelOrder response
      const mockCancelOrderResponse = {
        symbol: "BTCUSDT",
        origClientOrderId: "myOrder1",
        orderId: 4,
        orderListId: -1, //Unless part of an OCO, the value will always be -1.
        clientOrderId: "cancelMyOrder1",
        transactTime: 1684804350068,
        price: "2.00000000",
        origQty: "1.00000000",
        executedQty: "0.00000000",
        cummulativeQuoteQty: "0.00000000",
        status: "CANCELED",
        timeInForce: "GTC",
        type: "LIMIT",
        side: "BUY",
        selfTradePreventionMode: "NONE",
      };
      binanceClientSpotMock.cancelOrder.mockResolvedValueOnce({
        data: mockCancelOrderResponse,
      });

      const requestBody = {
        symbol: "BTCUSDT",
        options: {
          orderId: 4,
        },
      };
      const result = await binanceTradeService.cancelOrder(requestBody);

      expect(result).toEqual(mockCancelOrderResponse);
    });

    it("should throw an error if symbol is not provided", async () => {
      const requestBody = {
        Symbol: "",
      };
      await expect(
        // @ts-ignore
        binanceTradeService.cancelOrder(requestBody)
      ).rejects.toThrow("symbol is empty");
    });

    it("should throw an error if order status is not NEW or PARTIALLY_FILLED", async () => {
      // Mock the getOrder response with a FILLED status
      const mockGetOrderResponse = {
        data: {
          status: "FILLED",
          orderId: 12345,
        },
      };
      binanceClientSpotMock.getOrder.mockResolvedValueOnce(
        mockGetOrderResponse
      );

      const requestBody = {
        symbol: "BTCUSDT",
        options: {
          orderId: 12345,
        },
      };
      await expect(
        binanceTradeService.cancelOrder(requestBody)
      ).rejects.toThrow(
        `Order ${mockGetOrderResponse.data.orderId} is ${mockGetOrderResponse.data.status}`
      );
    });
  });
});
