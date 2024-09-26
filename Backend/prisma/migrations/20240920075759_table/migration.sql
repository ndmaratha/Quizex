-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('qna', 'poll');

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Question" (
    "qid" SERIAL NOT NULL,
    "qtitle" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "impression" INTEGER NOT NULL DEFAULT 0,
    "qtype" "QuizType" NOT NULL,
    "op1" TEXT NOT NULL,
    "op2" TEXT NOT NULL,
    "op3" TEXT,
    "op4" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("qid")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "aid" SERIAL NOT NULL,
    "q_attempted" INTEGER,
    "q_correct" INTEGER,
    "q_incorrect" INTEGER,
    "op1" INTEGER,
    "op2" INTEGER,
    "op3" INTEGER,
    "op4" INTEGER,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("aid")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("qid") ON DELETE RESTRICT ON UPDATE CASCADE;
