import { Request, Response } from "express";

import { prismaClient } from "../prismaClient";

export const createQuizeRoute = async (req: Request, res: Response) => {
	const { title, qtype } = req.body;

	if (!title && !qtype) {
		return res.status(400).json({ error: "Title is required" });
	}

	try {
		const quiz = await prismaClient.quiz.create({
			data: {
				title,
				createdOn: new Date(), // Set createdOn to current date and time
				userId: req.userId!, // Use the user ID from the verified token
				qtype,
			},
		});
		res.status(201).json(quiz); // Return the created quiz
	} catch (error) {
		res.status(500).json({ error: "Failed to create quiz" });
	}
};

export const deleteQuizeRoute = async (req: Request, res: Response) => {
	const quizId = parseInt(req.params.id); // Get quiz ID from route parameters

	if (isNaN(quizId)) {
		return res.status(400).json({ error: "Invalid quiz ID" });
	}

	try {
		const quiz = await prismaClient.quiz.delete({
			where: {
				quizeId: quizId, // Use quizId here to match your schema
			},
		});

		return res.status(200).json({ message: "Quiz deleted successfully", quiz });
	} catch (error) {
		return res.status(500).json({ error: "Failed to delete quiz" });
	}
};

export const increaseImpressionCount = async (req: Request, res: Response) => {
	const quizid = parseInt(req.params.id); // parse the quiz ID from params
	try {
		await prismaClient.quiz.update({
			where: {
				quizeId: quizid, // ensure 'quizeId' is the correct field name
			},
			data: {
				impression: {
					increment: 1, // increment the impression count by 1
				},
			},
		});
		return res.status(200).json({ msg: "Impression count increased" });
	} catch (error) {
		return res
			.status(401)
			.json({ msg: error, error: "Can't increase impression" });
	}
};
