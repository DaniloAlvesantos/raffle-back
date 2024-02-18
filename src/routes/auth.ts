import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../plugin/authenticate";
import { prisma } from "../lib/prisma";

export async function AuthRoutes(fastify: FastifyInstance) {
  fastify.get("/me", { onRequest: [authenticate] }, async (req) => {
    const userInfo = await prisma.participant.findUnique({
      where: {
        id: req.user.sub,
      },
    });

    return { userInfo };
  });

  fastify.post("/create/user", async (req, reply) => {
    const createUserBody = z.object({
      name: z.string(),
      cpf: z.string(),
      phone: z.string(),
      email:z.string()
    });
    console.log(req.body);

    const { name, cpf, phone, email } = createUserBody.parse(req.body);


    let user = await prisma.participant.findUnique({
      where: {
        cpf,
      },
    });

    if (!user) {
      user = await prisma.participant.create({
        data: {
          name,
          phone,
          cpf,
          email,
        },
      });
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        cpf: user.cpf,
        phone: user.phone,
        email:user.email
      },
      {
        sub: user.id,
        expiresIn: "7 days",
      }
    );

    const data = {
      token,
      user,
    };
    return reply.send(data).status(201);
  });

  fastify.post("/login/user", async (req, reply) => {
    const createUserBody = z.object({
      cpf: z.string(),
    });
    console.log(req.params);

    const { cpf } = createUserBody.parse(req.body);

    let user = await prisma.participant.findUnique({
      where: {
        cpf: cpf,
      },
    });

    if (!user) {
      return reply.send("User not found").status(404);
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        cpf: user.cpf,
        phone: user.phone,
        email:user.email
      },
      {
        sub: user.id,
        expiresIn: "7 days",
      }
    );

    const data = {
      token,
      user,
    };
    console.log(token);
    return reply.send(data).status(201);
  });
}
