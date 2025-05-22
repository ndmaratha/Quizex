import express from "express";
import {
	createOrUpdateAnalysis,
	getQuizAnalysis,
} from "../controller/analisysController";
const analisysRouter = express.Router();
analisysRouter.put("/analysis/update", createOrUpdateAnalysis);
analisysRouter.post("/analysis/get", getQuizAnalysis);
export default analisysRouter;
