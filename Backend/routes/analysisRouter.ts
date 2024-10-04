import express from "express";
import {
	createOrUpdateAnalysis,
	getQuizAnalysis,
} from "../controller/analisysController";

const analysisRouter = express.Router();

analysisRouter.post("/analysis/create", createOrUpdateAnalysis);
analysisRouter.post("/analysis/quizanalysis/:quizId", getQuizAnalysis);

export default analysisRouter;
