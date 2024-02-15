import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { authenticate } from "../plugin/authenticate";
import { api_mercadopago } from "../lib/axios";

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

  fastify.post("/numbers/generate", { onRequest: [authenticate] }, async (req, reply) => {
    const generateBody = z.object({
      paymentId: z.string()
    })

    const { paymentId } = generateBody.parse(req.body);

    const paymentResponse = await api_mercadopago.get(`/v1/payments/${paymentId}`)
    const res = paymentResponse.data;

    // const rifa = await prisma.rifa.findFirst({
    //   where: {
    //     id: ,
    //   }
    // })

    await Promise.all([
      paymentResponse,
    ])

  })
}
