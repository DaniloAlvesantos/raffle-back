import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugin/authenticate";

interface RaffleItem {
  category_id: string;
  description: string;
  id: string;
  picture_url: string | null;
  quantity: string;
  title: string;
  unit_price: string;
}

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
        },
      });

      if (!ownNumbers) {
        reply.send("You are not participating in any raffle.").status(400);
        return [];
      }
      if (ownNumbers === null || ownNumbers === undefined) {
        console.log(ownNumbers);
        reply.send("Error with authentication").status(400);
        return;
      }

      console.log(ownNumbers);

      return reply.send({ ownNumbers }).status(200);
    }
  );
}
