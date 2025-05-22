/*
  Warnings:

  - A unique constraint covering the columns `[questionId]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Analysis_questionId_key" ON "Analysis"("questionId");
