import express from "express";
import { editQuestions } from "../controller/questionsController";

const questionsRouter = express.Router();

questionsRouter.put("/question/update", editQuestions);

export default questionsRouter;
