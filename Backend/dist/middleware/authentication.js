"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to authenticate token and extract user ID from token payload
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the token from the Authorization header
    const authHeader = req.get("authorization");
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    if (!token)
        return res
            .sendStatus(401)
            .json({ msg: "Token is Not Provided Or Unauthorized" }); // Unauthorized if no token is found
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        next(); // Proceed to the next middleware or route handler
    }
    catch (err) {
        return res.sendStatus(403); // Forbidden if token verification fails
    }
});
exports.default = authenticateToken;
