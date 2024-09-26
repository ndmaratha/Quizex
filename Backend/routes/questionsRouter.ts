import express from "express";
import {
	createQuestions,
	deleteAllQuestions,
	editQuestions,
} from "../controller/questionsController";

const questionsRouter = express.Router();

questionsRouter.post("/question/create", createQuestions);
questionsRouter.put("/question/update", editQuestions);
questionsRouter.delete("/question/delete/:id", deleteAllQuestions);

export default questionsRouter;
