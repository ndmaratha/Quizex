"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionsController_1 = require("../controller/questionsController");
const questionsRouter = express_1.default.Router();
questionsRouter.post("/question/create", questionsController_1.createQuestions);
questionsRouter.put("/question/update", questionsController_1.editQuestions);
questionsRouter.delete("/question/delete/:id", questionsController_1.deleteAllQuestions);
exports.default = questionsRouter;
