"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const quizeRouter_1 = __importDefault(require("./routes/quizeRouter"));
const questionsRouter_1 = __importDefault(require("./routes/questionsRouter"));
const analysysRouter_1 = __importDefault(require("./routes/analysysRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(userRouter_1.default);
app.use(quizeRouter_1.default);
app.use(questionsRouter_1.default);
app.use(analysysRouter_1.default);
app.listen(3000, () => {
    console.log("listning to port 3000");
});
