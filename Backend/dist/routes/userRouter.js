"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const userRouter = express_1.default.Router();
// POST route for login
userRouter.post("/api/login", userController_1.login);
// POST route for signup
userRouter.post("/api/signup", userController_1.signup);
exports.default = userRouter;
