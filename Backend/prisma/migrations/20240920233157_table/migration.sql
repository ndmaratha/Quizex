/*
  Warnings:

  - You are about to drop the column `qtype` on the `Question` table. All the data in the column will be lost.
  - Added the required column `qtype` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "qtype";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "qtype" "QuizType" NOT NULL;
