/*
  Warnings:

  - You are about to drop the column `quizTimer` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "quizTimer",
ADD COLUMN     "questionTimer" INTEGER;
