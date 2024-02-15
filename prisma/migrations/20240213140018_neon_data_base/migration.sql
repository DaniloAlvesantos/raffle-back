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

    CONSTRAINT "Rifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Choosen" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "rifaId" TEXT NOT NULL,
    "numbersChossed" TEXT[],
    "sortedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Choosen_pkey" PRIMARY KEY ("id")
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
    "googleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParticipantToRifa" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Choosen_numbersChossed_key" ON "Choosen"("numbersChossed");

-- CreateIndex
CREATE UNIQUE INDEX "Choosen_rifaId_participantId_key" ON "Choosen"("rifaId", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchasedNumbers_numbers_key" ON "PurchasedNumbers"("numbers");

-- CreateIndex
CREATE UNIQUE INDEX "PurchasedNumbers_participantId_key" ON "PurchasedNumbers"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_googleId_key" ON "Participant"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToRifa_AB_unique" ON "_ParticipantToRifa"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToRifa_B_index" ON "_ParticipantToRifa"("B");

-- AddForeignKey
ALTER TABLE "Choosen" ADD CONSTRAINT "Choosen_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choosen" ADD CONSTRAINT "Choosen_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choosen" ADD CONSTRAINT "Choosen_numbersChossed_fkey" FOREIGN KEY ("numbersChossed") REFERENCES "PurchasedNumbers"("numbers") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedNumbers" ADD CONSTRAINT "PurchasedNumbers_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasedNumbers" ADD CONSTRAINT "PurchasedNumbers_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToRifa" ADD CONSTRAINT "_ParticipantToRifa_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToRifa" ADD CONSTRAINT "_ParticipantToRifa_B_fkey" FOREIGN KEY ("B") REFERENCES "Rifa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
