import Fastify from "fastify";
import cors from "@fastify/cors";
import { RifaRoutes } from "./routes/rifa";
import { AuthRoutes } from "./routes/auth";
import { NumbersRoutes } from "./routes/numbers";
import { PaymentRoutes } from "./routes/payment";
import jwt from "@fastify/jwt";

export async function bootStrap() {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(cors, {
    origin: "*",
  });

  fastify.register(AuthRoutes);
  fastify.register(RifaRoutes);
  fastify.register(NumbersRoutes);
  fastify.register(PaymentRoutes);

  fastify.register(jwt, {
    secret: `${process.env.JWT_SECRET}`,
  });

  fastify.listen({
    port: 33333,
  });

  return fastify;
}
bootStrap();
