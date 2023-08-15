import { FastifyPluginAsync } from "fastify";
import { webSocketController } from "../../../controllers/WebSocketController";

const WebSocketController = new webSocketController();

const routes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/tradesStreamConnect", async (request, reply) => {
    WebSocketController.getTradesStreamConnect(request, reply);
  });

  fastify.get("/tradesStreamDisconnect", async (request, reply) => {
    WebSocketController.getTradesStreamDisconnect(reply);
  });

  fastify.get("/historicalData", (request, reply) => {
    WebSocketController.getHistoricalData(request, reply);
  });

  fastify.get("/fetchHistoricalTrades", (request, reply) => {
    WebSocketController.fetchHistoricalTrades(request, reply);
  });

  fastify.get("/runTradingBot", async (request, reply) => {
    await WebSocketController.runTradingBot(request, reply);
  });
};

export default routes;
