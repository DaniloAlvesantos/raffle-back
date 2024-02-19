import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { authenticate } from "../plugin/authenticate";
import { Payment, Preference } from "mercadopago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { MercadoPagoClient } from "../lib/mercadopago";
import ShortUniqueId from "short-unique-id";
import { api_mercadopago } from "../lib/axios";
import { generateNumbers } from "../utils/generateNumbers";

export async function PaymentRoutes(fastify: FastifyInstance) {
  fastify.post("/notification/webhook", async (req, reply) => {
    console.log(req.body);
    const webhookBody = z.object({
      action: z.string(),
      api_version: z.string(),
      data: z.object({
        id: z.string(),
      }),
      date_created: z.string(),
      id: z.union([z.string(), z.number()]),
      live_mode: z.boolean(),
      type: z.string(),
      user_id: z.union([z.number(), z.string()]),
    });

    const webhookSchema = webhookBody.parse(req.body);
    if (!webhookSchema) {
      return;
    }

    const { data } = webhookSchema;

    const response = await api_mercadopago.get(`/v1/payments/${data.id}`);

    if (!response.data) {
      return reply.send("Payment not found.").status(400);
    }

    const paymentInfo: PaymentResponse = await response.data;
    if (!paymentInfo) {
      return reply.send("Type error.").status(404);
    }

    let payerIdentification = "";

    if (paymentInfo.payment_method_id === "pix") {
      payerIdentification = paymentInfo.additional_info.payer.phone.number;
    } else {
      payerIdentification = paymentInfo.card.cardholder.identification.number;
    }

    console.log(payerIdentification);

    switch (paymentInfo.status) {
      case "approved": {
        const user = await prisma.participant.findFirst({
          where: {
            cpf: payerIdentification,
          },
          include: {
            purchasedNumbers: true,
          },
        });

        console.log(user);

        if (!user) {
          return reply.status(404).send("CPF not found in participant");
        }

        const paymentCheck = await prisma.payment.findUnique({
          where: {
            paymentId: data.id,
          },
          include: {
            participant: true,
          },
        });

        console.log("Pagamento Check");

        if (paymentCheck) {
          console.log("Pagamento existente");
          return { paymentCheck, numbers: user.purchasedNumbers };
        }

        await prisma.payment.create({
          data: {
            amount: paymentInfo.transaction_amount,
            currency: "BRL",
            paymentId: data.id,
            paymentMethod: paymentInfo.payment_method_id,
            status: paymentInfo.status,
            external_reference: paymentInfo.external_reference,
            participantId: user.id,
            rifaId: paymentInfo.additional_info.items[0].id,
          },
        });

        console.log("Pagamento criado");

        const numbers = await generateNumbers(data.id);

        return { paymentInfo, numbers: numbers };
      }
      case "failed": {
        return reply.send("Payment Failed.").status(406);
      }
      case "in_process":
      case "pending": {
        return reply.send("Waiting to confirm payment.").status(402);
      }
      case "cancelled": {
        return reply.send("Cancelled.").status(406);
      }
      default: {
        return reply.send("Unknown payment status.").status(400);
      }
    }
  });

  fastify.post(
    "/create/payment/pix",
    { onRequest: [authenticate] },
    async (req, reply) => {
      const pixBody = z.object({
        title: z.string(),
        description: z.string(),
        amount: z.number(),
        unit_price: z.number(),
      });

      const payer = await prisma.participant.findUnique({
        where: {
          id: req.user.sub,
        },
      });

      if (!payer) {
        return reply.send("Participant not found.").status(404);
      }

      const pixSchema = pixBody.parse(req.body);
      const { description, title, amount, unit_price } = pixSchema;

      const rifa = await prisma.rifa.findFirst({
        where: {
          name: title,
        },
      });

      if (!rifa) {
        return reply.send("Rifa not found.").status(404);
      }

      const generate = new ShortUniqueId({ length: 6 });
      const code = String(generate.rnd()).toUpperCase();

      const full_price = amount * unit_price;

      const payment = new Payment(MercadoPagoClient);
      const paymentResponse = payment
        .create({
          body: {
            transaction_amount: full_price,
            description: description,
            payment_method_id: "pix",
            additional_info: {
              payer: {
                first_name: payer.name,
                last_name: "Customer",
                phone: {
                  number: payer.cpf,
                },
              },
              items: [
                {
                  id: rifa.id,
                  title,
                  description,
                  quantity: amount,
                  unit_price,
                  category_id: "stocks",
                },
              ],
            },
            payer: {
              first_name: payer.name,
              last_name: "Customer",
              email: payer.email,
              identification: {
                type: "CPF",
                number: payer.cpf,
              },
            },
            external_reference: String(code),
            notification_url:
              "https://way-premios-back-end.vercel.app/notification/webhook",
            statement_descriptor: "Kalov Stocks",
          },
        })
        .catch((err) => {
          console.error(err);
        });

      return paymentResponse;
    }
  );

  fastify.post(
    "/create/payment/preference",
    { onRequest: [authenticate] },
    async (req, reply) => {
      const preferencesBody = z.object({
        title: z.string(),
        description: z.string(),
        unit_price: z.number(),
        amount: z.number(),
      });

      const preferencesSchema = preferencesBody.parse(req.body);
      const payer = await prisma.participant.findUnique({
        where: {
          id: req.user.sub,
        },
      });

      if (!payer) {
        return reply.send("Participant not found.").status(404);
      }

      const rifa = await prisma.rifa.findFirst({
        where: {
          name: preferencesSchema.title,
        },
      });

      if (!rifa) {
        return reply.send("Rifa not found.").status(404);
      }

      const generate = new ShortUniqueId({ length: 6 });
      const code = String(generate.rnd()).toUpperCase();

      const preferences = new Preference(MercadoPagoClient);
      const preferencesResponse = preferences
        .create({
          body: {
            items: [
              {
                id: rifa.id,
                title: preferencesSchema.title,
                description: preferencesSchema.description,
                quantity: preferencesSchema.amount,
                unit_price: preferencesSchema.unit_price,
                currency_id: "BRL",
                category_id: "stocks",
              },
            ],
            payment_methods: {
              excluded_payment_methods: [
                {
                  id: "pix",
                },
                {
                  id: "bolbradesco",
                },
                {
                  id: "pec",
                },
              ],
            },
            payer: {
              name: payer.name,
              surname: "Customer",
              email: payer.email,
              identification: {
                type: "CPF",
                number: payer.cpf,
              },
            },
            notification_url:
              "https://way-premios-back-end.vercel.app/notification/webhook",
            external_reference: String(code),
            auto_return: "approved",
            back_urls: {
              success: "https://kalovepremios.com.br/user",
              pending: "http://localhost:5173/",
              failure: "http://localhost:5173/",
            },
            expires: true,
          },
        })
        .catch((err) => console.error(err));

      return preferencesResponse;
    }
  );

  fastify.get(
    "/payments/me",
    { onRequest: [authenticate] },
    async (req, reply) => {
      const payments = await prisma.payment.findMany({
        where: {
          participantId: req.user.sub,
        },
      });

      if (!payments) {
        return reply.send("You don't have any payment.").status(404);
      }

      return reply.send({ payments }).status(200);
    }
  );

  fastify.get(
    "/payments/:id",
    { onRequest: [authenticate] },
    async (req, reply) => {
      const paymentId = z.object({
        id: z.string(),
      });

      const { id } = paymentId.parse(req.params);

      const payments = await prisma.payment.findUnique({
        where: {
          paymentId: id,
        },
        include: {
          rifas: true,
        },
      });

      if (!payments) {
        return reply.send("Payment not found").status(404);
      }

      const numbers = await prisma.purchasedNumbers.findMany({
        where: {
          rifaId: payments.rifaId,
          participantId: req.user.sub,
        },
      });

      console.log(numbers);

      if (!payments) {
        return reply.send("You don't have any payment.").status(404);
      }

      return reply.send({ payments, numbers: numbers }).status(200);
    }
  );
}
