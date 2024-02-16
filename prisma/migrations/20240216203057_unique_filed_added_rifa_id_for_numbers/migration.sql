/*
  Warnings:

  - A unique constraint covering the columns `[rifaId]` on the table `PurchasedNumbers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rifaId,participantId]` on the table `PurchasedNumbers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PurchasedNumbers_rifaId_key" ON "PurchasedNumbers"("rifaId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchasedNumbers_rifaId_participantId_key" ON "PurchasedNumbers"("rifaId", "participantId");
