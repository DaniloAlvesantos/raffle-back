import Fastify from "fastify";
import cors from "@fastify/cors";
import { RifaRoutes } from "./routes/rifa";
import { NumbersRoutes } from "./routes/numbers";
import { AuthRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: true,
});

fastify.register(RifaRoutes);
fastify.register(NumbersRoutes);
fastify.register(AuthRoutes);
fastify.register(jwt, {
  secret: "waypremios13121123312",
});

fastify
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 33333,
  })
  .then(() => {
    console.log("Running Server");
  });
