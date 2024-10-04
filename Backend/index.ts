import express from "express";
import userRouter from "./routes/userRouter";
import quizRouter from "./routes/quizRouter";
import questionsRouter from "./routes/questionsRouter";
import analysisRouter from "./routes/analysisRouter";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(quizRouter);
app.use(questionsRouter);
app.use(analysisRouter);
app.listen(3000, () => {
	console.log("listning to port 3000");
});
