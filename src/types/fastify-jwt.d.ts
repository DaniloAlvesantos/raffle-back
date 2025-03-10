import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      cpf: string;
      number:string;
      email:string;
    };
  }
}