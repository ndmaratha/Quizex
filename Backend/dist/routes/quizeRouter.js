"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const quizeController_1 = require("../controller/quizeController");
const quizeRouter = express_1.default.Router();
quizeRouter.post("/quize/create", authentication_1.default, quizeController_1.createQuizeRoute);
quizeRouter.delete("/quize/delete/:id", quizeController_1.deleteQuizeRoute);
quizeRouter.put("/quize/increase/:id", quizeController_1.increaseImpressionCount);
exports.default = quizeRouter;
