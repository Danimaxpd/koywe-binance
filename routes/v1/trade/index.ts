import { FastifyPluginAsync } from "fastify";
import { tradeApiController } from "../../../controllers/TradeApiController";

const tradeController = new tradeApiController();

const routes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/accountInfo", async (request, reply) => {
    await tradeController.getAccountInfo(reply);
  });

  fastify.get("/userTrades", async (request, reply) => {
    await tradeController.getUserTrades(request, reply);
  });

  fastify.post("/newOrder", async (request, reply) => {
    await tradeController.setNewOrder(request, reply);
  });

  fastify.delete("/cancelOrder", async (request, reply) => {
    await tradeController.cancelOrder(request, reply);
  });
};

export default routes;
