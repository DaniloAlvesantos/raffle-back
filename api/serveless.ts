"use strict";

import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify, { FastifyReply, FastifyRequest } from "fastify";

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(import("../src/server"));

export default async (req: FastifyRequest, res: FastifyReply) => {
    await app.ready();
    app.server.emit('request', req, res);
}