import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Middleware to authenticate token and extract user ID from token payload
const authenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Extract the token from the Authorization header
	const authHeader = req.get("authorization");
	const token =
		authHeader && authHeader.startsWith("Bearer ")
			? authHeader.split(" ")[1]
			: null;

	if (!token) return res.sendStatus(401); // Unauthorized if no token is found

	try {
		// Verify the JWT using the secret and extract the payload (e.g., user id)
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: number;
		};

		// Attach the userId to the request object for later use
		req.userId = decoded.id;

		next(); // Proceed to the next middleware or route handler
	} catch (err) {
		return res.sendStatus(403); // Forbidden if token verification fails
	}
};

// Extend the Express Request interface to include userId
declare global {
	namespace Express {
		interface Request {
			userId?: number; // Add userId as a number to Request
		}
	}
}

export default authenticateToken;
