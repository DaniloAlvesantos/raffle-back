import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { api_mercadopago } from "../lib/axios";
import { prisma } from "../lib/prisma";

export const generateNumbers = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      paymentId,
    },
    include: {
      rifas: true,
    },
  });

  if (!payment) {
    return;
  }

  const quantityNumbers = payment.rifas.numbersQuantity;
  const allNumbers = Array.from({ length: quantityNumbers }, (_, i) => {
    return (i++).toString();
  });

  const purchaseadNumbers = await prisma.purchasedNumbers.findMany({
    where: {
      rifaId: payment.rifas.id,
    },
  });

  const boughtNumbers = purchaseadNumbers.flatMap((r) => r.numbers);

  const avalaibleNumbers = allNumbers
    .filter((number) => !boughtNumbers.includes(number))
    .sort(() => Math.random() - 0.5);

  const extractPayment = await api_mercadopago.get(`/v1/payments/${paymentId}`);
  const response: PaymentResponse = extractPayment.data;
  const itemsAmount = response.additional_info.items[0].quantity; // Quantity of bought numbers.

  const randomNumbers = avalaibleNumbers.slice(0, itemsAmount);

  console.log(payment.rifaId, payment.rifas.id);

  const generateNumbersResponse = await prisma.purchasedNumbers.create({
    data: {
      rifaId: payment.rifas.id,
      participantId: payment.participantId,
      numbers: randomNumbers,
    },
  });

  return generateNumbersResponse;
};
