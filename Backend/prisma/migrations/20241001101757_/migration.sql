/*
  Warnings:

  - The primary key for the `Analysis` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_pkey",
ALTER COLUMN "analysisId" DROP DEFAULT,
ALTER COLUMN "analysisId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Analysis_pkey" PRIMARY KEY ("analysisId");
DROP SEQUENCE "Analysis_analysisId_seq";
