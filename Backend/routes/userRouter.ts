import express from "express";
import { login, signup } from "../controller/userController";
const userRouter = express.Router();

userRouter.post("/api/login", login);

userRouter.post("/api/signup", signup);

export default userRouter;
