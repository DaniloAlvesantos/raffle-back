import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugin/authenticate";

export async function NumbersRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/numbers/user",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const ownNumbers = await prisma.purchasedNumbers.findMany({
        where: {
          participantId: request.user.sub,
        },
        include: {
          Rifa: true,
        }
      });

      if (!ownNumbers) {
        reply.send("You are not participating in any raffle.").status(400);
        return [];
      }
      if (ownNumbers === null || ownNumbers === undefined) {
        reply.send("Error with authentication").status(400);
        return;
      }
      
      return reply.send({ ownNumbers }).status(200);
    }
  );
}
