/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[external_reference]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_reference` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "updatedAt",
ADD COLUMN     "external_reference" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_external_reference_key" ON "Payment"("external_reference");
