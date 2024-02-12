"use strict";

import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify, { FastifyReply, FastifyRequest } from "fastify";

const app = Fastify({
  logger: true,
});

// Importe as rotas necessárias aqui
import { RifaRoutes } from "../src/routes/rifa";
import { NumbersRoutes } from "../src/routes/numbers";
import { AuthRoutes } from "../src/routes/auth";
import jwt from "@fastify/jwt";

// Registrar middleware de autenticação JWT
app.register(jwt, {
  secret: "waypremios13121123312",
});

// Registrar todas as rotas
app.register(RifaRoutes);
app.register(NumbersRoutes);
app.register(AuthRoutes);
export default async (req: FastifyRequest, res: FastifyReply) => {
  await app.ready();
  app.server.emit("request", req, res);
};
