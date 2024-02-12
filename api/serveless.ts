"use strict";

import * as dotenv from "dotenv";
import routes from "../src/server"
dotenv.config();

// Require the framework
import Fastify, { FastifyReply, FastifyRequest } from "fastify";

// Instantiate Fastify with some config
const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(routes, {
  prefix: "/"
});

export default async (req: FastifyRequest, res: FastifyReply) => {
    await app.ready();
    app.server.emit('request', req, res);
}