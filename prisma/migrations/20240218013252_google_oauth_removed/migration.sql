/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Participant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Participant_email_key";

-- DropIndex
DROP INDEX "Participant_googleId_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "avatarUrl",
DROP COLUMN "email",
DROP COLUMN "googleId",
ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_phone_key" ON "Participant"("phone");
