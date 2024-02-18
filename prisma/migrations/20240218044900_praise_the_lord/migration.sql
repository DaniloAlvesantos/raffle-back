-- CreateTable
CREATE TABLE "Rifa" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reward" TEXT NOT NULL,
    "numbersQuantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "winnerId" TEXT,

    CONSTRAINT "Rifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chosen" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "raffleId" TEXT NOT NULL,
    "drawnNumber" TEXT NOT NULL,
    "sortedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchasedNumbers" (
    "id" TEXT NOT NULL,
    "rifaId" TEXT NOT NULL,
    "participantId" TEXT,
    "numbers" TEXT[],

    CONSTRAINT "PurchasedNumbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participantId" TEXT NOT NULL,
    "external_reference" TEXT NOT NULL,
    "rifaId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParticipantToRifa" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Chosen_raffleId_key" ON "Chosen"("raffleId");

-- CreateIndex
CREATE UNIQUE INDEX "Chosen_drawnNumber_key" ON "Chosen"("drawnNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PurchasedNumbers_numbers_key" ON "PurchasedNumbers"("numbers");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_phone_key" ON "Participant"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_cpf_key" ON "Participant"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentId_key" ON "Payment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_external_reference_key" ON "Payment"("external_reference");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToRifa_AB_unique" ON "_ParticipantToRifa"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToRifa_B_index" ON "_ParticipantToRifa"("B");

-- AddForeignKey
ALTER TABLE "Chosen" ADD CONSTRAINT "Chosen_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chosen" ADD CONSTRAINT "Chosen_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedNumbers" ADD CONSTRAINT "PurchasedNumbers_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedNumbers" ADD CONSTRAINT "PurchasedNumbers_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToRifa" ADD CONSTRAINT "_ParticipantToRifa_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToRifa" ADD CONSTRAINT "_ParticipantToRifa_B_fkey" FOREIGN KEY ("B") REFERENCES "Rifa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
