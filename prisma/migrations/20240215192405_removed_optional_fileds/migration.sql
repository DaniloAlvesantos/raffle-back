/*
  Warnings:

  - Made the column `avatarUrl` on table `Participant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cpf` on table `Participant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "avatarUrl" SET NOT NULL,
ALTER COLUMN "cpf" SET NOT NULL;
