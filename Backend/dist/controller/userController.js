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
exports.signup = exports.login = exports.secretKey = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = require("../prismaClient");
exports.secretKey = "your-secret-key";
// Define the user schema
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    name: zod_1.z.string(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    // Validate the user data using zod schema
    const resp = loginSchema.safeParse(user);
    if (!resp.success) {
        return res.status(400).json({ error: resp.error.errors });
    }
    try {
        // Find the user by email
        const existingUser = yield prismaClient_1.prismaClient.user.findUnique({
            where: { email: user.email },
        });
        if (!existingUser) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Verify the password
        const passwordMatch = yield bcryptjs_1.default.compare(user.password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id, email: existingUser.email }, exports.secretKey, {
            expiresIn: "48h",
        });
        // Send response with the token and user data
        res.json({
            token,
            user: {
                id: existingUser.id,
                email: existingUser.email,
                name: existingUser.name,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    // Validate the user data using zod schema
    const resp = userSchema.safeParse(user);
    if (!resp.success) {
        return res.status(400).json({ error: resp.error.errors });
    }
    try {
        //Check if the email already exists
        const existingUser = yield prismaClient_1.prismaClient.user.findUnique({
            where: { email: user.email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        // Hash the password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(user.password, salt);
        const newUser = yield prismaClient_1.prismaClient.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
            },
        });
        return res.json({ user: newUser.name });
    }
    catch (error) {
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});
exports.signup = signup;
