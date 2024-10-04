"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analisysController_1 = require("../controller/analisysController");
const analysisRouter = express_1.default.Router();
analysisRouter.post("/analysis/create", analisysController_1.createOrUpdateAnalysis);
analysisRouter.post("/analysis/quizanalysis/:quizId", analisysController_1.getQuizAnalysis);
exports.default = analysisRouter;
