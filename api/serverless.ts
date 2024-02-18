"use strict";

// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { bootStrap } from "../src/server";

export default async (req: FastifyRequest, res: FastifyReply) => {
  const app:FastifyInstance = await bootStrap();
  await app.ready();
  app.server.emit("request", req, res);
};