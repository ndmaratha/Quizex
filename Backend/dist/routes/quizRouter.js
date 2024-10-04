"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const quizeController_1 = require("../controller/quizeController");
const quizRouter = express_1.default.Router();
quizRouter.post("/quiz/create", authentication_1.default, quizeController_1.createQuizRoute);
quizRouter.delete("/quiz/delete/:id", quizeController_1.deleteQuizRoute);
quizRouter.put("/quiz/increase/:id", quizeController_1.increaseQuizImpressionCount);
quizRouter.post("/quiz/showtrendingquiz", authentication_1.default, quizeController_1.showTrendingQuizzes);
quizRouter.post("/quiz/quizbyuser/:id", authentication_1.default, quizeController_1.quizCreatedBySpecificUser);
quizRouter.post("/quiz/totalCount", quizeController_1.totalCountOfQuiz_Question_Impression);
exports.default = quizRouter;
