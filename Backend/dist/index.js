"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const quizRouter_1 = __importDefault(require("./routes/quizRouter"));
const questionsRouter_1 = __importDefault(require("./routes/questionsRouter"));
const analysisRouter_1 = __importDefault(require("./routes/analysisRouter"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(userRouter_1.default);
app.use(quizRouter_1.default);
app.use(questionsRouter_1.default);
app.use(analysisRouter_1.default);
app.listen(3000, () => {
    console.log("listning to port 3000");
});
