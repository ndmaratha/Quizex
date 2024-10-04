-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('qna', 'poll');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "quizId" TEXT NOT NULL,
    "quizName" TEXT NOT NULL,
    "quizCreatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quizImpression" INTEGER DEFAULT 0,
    "quizType" "QuizType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("quizId")
);

-- CreateTable
CREATE TABLE "Question" (
    "questionId" TEXT NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "optionType" TEXT NOT NULL,
    "optionOne" TEXT NOT NULL,
    "optionTwo" TEXT NOT NULL,
    "optionThree" TEXT,
    "optionFour" TEXT,
    "quizId" TEXT NOT NULL,
    "quizTimer" INTEGER,
    "correctAns" INTEGER,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "analysisId" SERIAL NOT NULL,
    "questionAttemptedCount" INTEGER DEFAULT 0,
    "questionCorrectlyAnswered" INTEGER DEFAULT 0,
    "questionIncorrectlyAnswered" INTEGER DEFAULT 0,
    "ChosedOptionOneCount" INTEGER DEFAULT 0,
    "ChosedOptionTwoCount" INTEGER DEFAULT 0,
    "ChosedOptionThreeCount" INTEGER DEFAULT 0,
    "ChosedOptionFourCount" INTEGER DEFAULT 0,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("analysisId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("quizId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("questionId") ON DELETE CASCADE ON UPDATE CASCADE;
