import express from "express";
import authenticateToken from "../middleware/authentication";
import {
	createQuizRoute,
	deleteQuizRoute,
	increaseQuizImpressionCount,
	quizCreatedBySpecificUser,
	showTrendingQuizzes,
	totalCountOfQuiz_Question_Impression,
} from "../controller/quizeController";
const quizRouter = express.Router();

quizRouter.post("/quiz/create", authenticateToken, createQuizRoute);
quizRouter.delete("/quiz/delete/:id", deleteQuizRoute);
quizRouter.put("/quiz/increase/:id", increaseQuizImpressionCount);
quizRouter.post(
	"/quiz/showtrendingquiz",
	authenticateToken,
	showTrendingQuizzes
);
quizRouter.post(
	"/quiz/quizbyuser/:id",
	authenticateToken,
	quizCreatedBySpecificUser
);
quizRouter.post("/quiz/totalCount", totalCountOfQuiz_Question_Impression);

export default quizRouter;
