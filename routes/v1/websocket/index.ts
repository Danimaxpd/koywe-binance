import { FastifyPluginAsync } from "fastify";
import { webSocketController } from "../../../controllers/WebSocketController";

const routes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const WebSocketController = new webSocketController(fastify.prisma);

  fastify.get("/tradesStreamConnect", (request, reply) => {
    WebSocketController.getTradesStreamConnect(request, reply);
  });

  fastify.get("/tradesStreamDisconnect", (request, reply) => {
    WebSocketController.getTradesStreamDisconnect(reply);
  });

  fastify.get("/historicalData", (request, reply) => {
    WebSocketController.getHistoricalData(request, reply);
  });

  fastify.get(
    "/fetchHistoricalTrades",
    { websocket: true },
    (connection, request) => {
      WebSocketController.fetchHistoricalTrades(connection, request);
    }
  );

  fastify.get("/runTradingBot", (request, reply) => {
    WebSocketController.runTradingBot(request, reply);
  });
};

export default routes;
