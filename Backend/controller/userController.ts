import { number, z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prismaClient } from "../prismaClient";
import { Request, Response } from "express";
export const secretKey = "your-secret-key";
// Define the user schema
const userSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, "Password must be at least 6 characters long"),
	userName: z.string(),
});
const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});
export const login = async (req: Request, res: Response) => {
	const user = req.body;

	// Validate the user data using zod schema
	const resp = loginSchema.safeParse(user);
	if (!resp.success) {
		return res
			.status(400)
			.json({ error: resp.error.errors, msg: "error in Zod Checking" });
	}

	try {
		// Find the user by email
		const existingUser = await prismaClient.user.findUnique({
			where: { email: user.email },
		});

		if (!existingUser) {
			return res.status(401).json({ error: "User with Email Does Not Exist!" });
		}

		// Verify the password
		const passwordMatch = await bcrypt.compare(
			user.password,
			existingUser.password
		);
		if (!passwordMatch) {
			return res.status(402).json({ error: "Invalid password" });
		}

		// Generate a JWT token
		const token: string = jwt.sign({ email: existingUser.email }, secretKey, {
			expiresIn: "48h",
		});

		// Send response with the token and user data
		res.status(200).json({
			token,
			user: {
				id: existingUser.userId,
				email: existingUser.email,
				userName: existingUser.userName,
			},
		});
	} catch (error) {
		res.status(400).json({ error: "An unexpected error occurred while Login" });
	}
};

export const signup = async (req: Request, res: Response) => {
	const user = req.body;

	// Validate the user data using zod schema
	const resp = userSchema.safeParse(user);
	if (!resp.success) {
		return res
			.status(400)
			.json({ error: resp.error.errors, msg: "error in zod checking" });
	}
	try {
		//Check if the email already exists
		const existingUser = await prismaClient.user.findUnique({
			where: { email: user.email },
		});
		if (existingUser) {
			return res.status(400).json({ error: "Email already in use" });
		}

		// Hash the password
		const salt: string = await bcrypt.genSalt(10);
		const hashedPassword: string = await bcrypt.hash(user.password, salt);
		const newUser = await prismaClient.user.create({
			data: {
				userName: user.userName,
				email: user.email,
				password: hashedPassword,
			},
		});
		return res
			.status(200)
			.json({ user: newUser.userName, msg: "User Created Successfully!" });
	} catch (error) {
		res
			.status(400)
			.json({ error: "An unexpected error occurred while SignIn!" });
	}
};
