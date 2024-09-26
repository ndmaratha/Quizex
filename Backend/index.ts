import express from "express";
import userRouter from "./routes/userRouter";
import quizeRouter from "./routes/quizeRouter";
import questionsRouter from "./routes/questionsRouter";
import analisysRouter from "./routes/analysysRouter";
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(quizeRouter);
app.use(questionsRouter);
app.use(analisysRouter);
app.listen(3000, () => {
	console.log("listning to port 3000");
});
