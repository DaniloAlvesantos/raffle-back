import Fastify from "fastify";
import cors from "@fastify/cors";
import { RifaRoutes } from "./routes/rifa";
import { NumbersRoutes } from "./routes/numbers";
import { AuthRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";

async function bootStrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.register(RifaRoutes);
  fastify.register(NumbersRoutes);
  fastify.register(AuthRoutes);

  await fastify.register(jwt, {
    secret: "waypremios13121123312",
  });

}

export default bootStrap;
