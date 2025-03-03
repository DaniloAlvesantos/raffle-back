import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugin/authenticate";


export async function RifaRoutes(fastify: FastifyInstance) {
  fastify.get("/rifas", async () => {
    const rifas = await prisma.rifa.findMany({
      orderBy: {
        status:"asc"
      }
    });

    return rifas;
  });

  fastify.get("/rifas/:id", async (req, reply) => {
    const rifaParams = z.object({
      id:z.string()
    })

    const { id }  = rifaParams.parse(req.params) 

    if(!id) {
      return reply.send("id invaliable.")
    }
    
    const rifa = await prisma.rifa.findUnique({
      where: {
        id,
      }
    });

    if(!rifa) {
      return reply.send("Raffle not found.").status(404)
    }

    return rifa;
  });

  fastify.post("/create/rifa", async (req, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      reward: z.string(),
      numbersQuantity: z.number(),
      price: z.number(),
      status:z.string(),
      picture:z.string()
    });
    const startedAt = new Date().toISOString();

    const rifaSchema = bodySchema.parse(req.body);

    const rifa = await prisma.rifa.findFirst({
      where: {
        name: rifaSchema.name,
      },
    });

    if (rifa) {
      return reply.send("Raffle already exist.").status(400);
    }

    const createdRifa = await prisma.rifa.create({
      data: {
        ...rifaSchema,
        startedAt
      },
    });

    return reply.send({ createdRifa }).status(201);
  });
}
