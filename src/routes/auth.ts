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
      access_token: z.string(),
      cpf: z.string(),
      number: z.string(),
    });

    const { access_token, cpf, number } = createUserBody.parse(req.body);

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });

    const userInfo = userInfoSchema.parse(userData);

    let user = await prisma.participant.findUnique({
      where: {
        googleId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.participant.create({
        data: {
          googleId: userInfo.id,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
          email: userInfo.email,
          phone: number,
          cpf,
        },
      });
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
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
      access_token: z.string(),
    });

    const { access_token } = createUserBody.parse(req.body);

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = await userResponse.json();

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });

    const userInfo = userInfoSchema.parse(userData);

    let user = await prisma.participant.findUnique({
      where: {
        googleId: userInfo.id,
      },
    });

    if (!user) {
      return reply.send("User not found").status(404);
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
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
    console.log(token)
    return reply.send(data).status(201);
  });
}
