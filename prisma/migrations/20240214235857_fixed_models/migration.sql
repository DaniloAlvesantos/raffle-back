/*
  Warnings:

  - You are about to drop the column `numbersChossed` on the `Choosen` table. All the data in the column will be lost.
  - You are about to drop the column `rifaId` on the `Choosen` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[raffleId]` on the table `Choosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[drawnNumber]` on the table `Choosen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `drawnNumber` to the `Choosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raffleId` to the `Choosen` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Choosen" DROP CONSTRAINT "Choosen_numbersChossed_fkey";

-- DropForeignKey
ALTER TABLE "Choosen" DROP CONSTRAINT "Choosen_rifaId_fkey";

-- DropIndex
DROP INDEX "Choosen_numbersChossed_key";

-- DropIndex
DROP INDEX "Choosen_rifaId_participantId_key";

-- AlterTable
ALTER TABLE "Choosen" DROP COLUMN "numbersChossed",
DROP COLUMN "rifaId",
ADD COLUMN     "drawnNumber" TEXT NOT NULL,
ADD COLUMN     "raffleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rifa" ADD COLUMN     "winnerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Choosen_raffleId_key" ON "Choosen"("raffleId");

-- CreateIndex
CREATE UNIQUE INDEX "Choosen_drawnNumber_key" ON "Choosen"("drawnNumber");

-- AddForeignKey
ALTER TABLE "Choosen" ADD CONSTRAINT "Choosen_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
