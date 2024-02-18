"use strict";
.
import * as dotenv from "dotenv";
dotenv.config();

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { bootStrap } from "../src/server";

export default async (req: FastifyRequest, res: FastifyReply) => {
  const app:FastifyInstance = await bootStrap();
  await app.ready();
  app.server.emit("request", req, res);
};