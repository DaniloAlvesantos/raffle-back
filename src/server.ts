import Fastify from "fastify";
import cors from "@fastify/cors";
import { RifaRoutes } from "./routes/rifa";
import { NumbersRoutes } from "./routes/numbers";
import { AuthRoutes } from "./routes/auth";
import jwt from "@fastify/jwt"

export default async function bootStrap() {
  const port = process.env.PORT || 33333  

  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin:true,
  })

  fastify.register(RifaRoutes)
  fastify.register(NumbersRoutes)
  fastify.register(AuthRoutes)

  await fastify.register(jwt, {
    secret: 'waypremios13121123312',
  })

  try {
    await fastify.listen(port);
  } catch(err) {
    console.log(err)
    process.exit(1);
  }
}

bootStrap();

export { bootStrap }