/*
  Warnings:

  - Added the required column `rifaId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "rifaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
