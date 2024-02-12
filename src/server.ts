import Fastify from "fastify";
import cors from "@fastify/cors";
import { RifaRoutes } from "./routes/rifa";
import { NumbersRoutes } from "./routes/numbers";
import { AuthRoutes } from "./routes/auth";
import jwt from "@fastify/jwt"

export async function bootStrap() {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(cors, {
    origin:"*",
  })

  fastify.register(AuthRoutes)
  fastify.register(RifaRoutes)
  fastify.register(NumbersRoutes)

  fastify.register(jwt, {
    secret: 'waypremios13121123312',
  })


  return fastify;
}
