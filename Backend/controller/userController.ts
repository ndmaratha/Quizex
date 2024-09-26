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
	name: z.string(),
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
		return res.status(400).json({ error: resp.error.errors });
	}

	try {
		// Find the user by email
		const existingUser = await prismaClient.user.findUnique({
			where: { email: user.email },
		});

		if (!existingUser) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Verify the password
		const passwordMatch = await bcrypt.compare(
			user.password,
			existingUser.password
		);
		if (!passwordMatch) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Generate a JWT token
		const token: string = jwt.sign(
			{ id: existingUser.id, email: existingUser.email },
			secretKey,
			{
				expiresIn: "48h",
			}
		);

		// Send response with the token and user data
		res.json({
			token,
			user: {
				id: existingUser.id,
				email: existingUser.email,
				name: existingUser.name,
			},
		});
	} catch (error) {
		res.status(500).json({ error: "An unexpected error occurred" });
	}
};

export const signup = async (req: Request, res: Response) => {
	const user = req.body;

	// Validate the user data using zod schema
	const resp = userSchema.safeParse(user);
	if (!resp.success) {
		return res.status(400).json({ error: resp.error.errors });
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
		const salt = await bcrypt.genSalt(10);
		const hashedPassword: string = await bcrypt.hash(user.password, salt);
		const newUser = await prismaClient.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: hashedPassword,
			},
		});
		return res.json({ user: newUser.name });
	} catch (error) {
		res.status(500).json({ error: "An unexpected error occurred" });
	}
};
