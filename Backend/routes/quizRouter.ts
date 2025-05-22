import express from "express";
import authenticateToken from "../middleware/authentication";
import {
	createQuizRoute,
	deleteQuizRoute,
	increaseQuizImpressionCount,
	quizCreatedBySpecificUser,
	showTrendingQuizzes,
	singleQuiz,
	totalCountOfQuiz_Question_Impression,
} from "../controller/quizeController";
const quizRouter = express.Router();

quizRouter.post("/quiz/create", createQuizRoute);
quizRouter.delete("/quiz/delete/:id", deleteQuizRoute);
quizRouter.put("/quiz/increase/:id", increaseQuizImpressionCount);
quizRouter.post("/quiz/showtrendingquiz", showTrendingQuizzes);
quizRouter.post("/quiz/quizbyuser/:id", quizCreatedBySpecificUser);
quizRouter.post("/quiz/totalCount", totalCountOfQuiz_Question_Impression);
quizRouter.post("/quiz/singleQuiz/:id", singleQuiz);

export default quizRouter;
