import express from "express";
import { login, signup } from "../controller/userController";
const userRouter = express.Router();

// POST route for login
userRouter.post("/api/login", login);

// POST route for signup
userRouter.post("/api/signup", signup);

export default userRouter;
