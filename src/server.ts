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

  fastify.get("/", async (req, res) => {
    res.status(200).send({
      hello:"world"
    })
  })

  await fastify.register(RifaRoutes);
  await fastify.register(NumbersRoutes);
  await fastify.register(AuthRoutes);
  await fastify.register(jwt, {
    secret: "waypremios13121123312",
  });

  await fastify
    .listen({
      host: "0.0.0.0",
      port: process.env.PORT ? Number(process.env.PORT) : 33333,
    })
    .then(() => {
      console.log("Running Server");
    });
}

export default bootStrap;
