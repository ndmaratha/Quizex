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

	if (!token)
		return res
			.sendStatus(401)
			.json({ msg: "Token is Not Provided Or Unauthorized" }); // Unauthorized if no token is found

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			email: string;
		};
		next(); // Proceed to the next middleware or route handler
	} catch (err) {
		return res.sendStatus(403); // Forbidden if token verification fails
	}
};

export default authenticateToken;
