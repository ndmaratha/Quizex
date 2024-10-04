import { Request, Response } from "express";
import { prismaClient } from "../prismaClient";
import { z } from "zod";

// Define the question schema
const questionSchema = z.object({
	questionTitle: z.string(),
	optionType: z.enum(["single", "multiple"]),
	optionOne: z.string(),
	optionTwo: z.string(),
	optionThree: z.string().nullable().optional(), // Optional and nullable
	optionFour: z.string().nullable().optional(), // Optional and nullable
	timer: z.union([z.literal(5), z.literal(10), z.null()]).optional(), // Optional field: 5, 10, or null
	correctAns: z.number().int().nullable().optional(), // Optional field
});

// Define the schema for the quiz creation data
const quizSchema = z.object({
	quizName: z.string(),
	quizCreatedOn: z.date().optional(), // Optional since Prisma may handle it with default value
	userId: z.string().cuid(),
	quizType: z.enum(["qna", "poll"]),
	questionsArr: z.array(questionSchema), // Array of questions
});

const quizIdSchema = z.string().cuid();

export const createQuizRoute = async (req: Request, res: Response) => {
	const quizData = req.body;

	// Validate the quiz data
	const CorrectQuizFormat = quizSchema.safeParse(quizData);
	if (!CorrectQuizFormat.success) {
		const errors = CorrectQuizFormat.error.errors.map((err) => ({
			path: err.path.join(" > "),
			message: err.message,
		}));

		return res.status(400).json({
			msg: "Validation error",
			errors,
		});
	}

	try {
		const quiz = await prismaClient.quiz.create({
			data: {
				quizName: quizData.quizName,
				quizCreatedOn: new Date(), // Set createdOn to current date and time
				userId: quizData.userId,
				quizType: quizData.quizType,
				questions: {
					create: quizData.questionsArr.map((data: any) => ({
						questionTitle: data.questionTitle,
						optionType: data.optionType,
						optionOne: data.optionOne,
						optionTwo: data.optionTwo,
						optionThree: data.optionThree || null,
						optionFour: data.optionFour || null,
						questionTimer: data.timer || null, // Optional field
						correctAns: data.correctAns || null, // Optional field
					})),
				},
			},
			include: {
				questions: true,
			},
		});

		return res.status(201).json(quiz); // Return the created quiz along with questions
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: "Failed to create quiz",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const deleteQuizRoute = async (req: Request, res: Response) => {
	const quizId = req.params.id;

	// Validate the quizId
	const CorrectQuizFormat = quizIdSchema.safeParse(quizId);
	if (!CorrectQuizFormat.success) {
		const errors = CorrectQuizFormat.error.errors.map((err) => ({
			path: err.path.join(" > "),
			message: err.message,
		}));

		return res.status(400).json({
			msg: "Validation error",
			errors,
		});
	}

	try {
		const quiz = await prismaClient.quiz.delete({
			where: {
				quizId: quizId,
			},
		});

		return res.status(200).json({
			message: "Quiz and related data deleted successfully",
			quiz,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: "Failed to delete quiz and related data",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const increaseQuizImpressionCount = async (
	req: Request,
	res: Response
) => {
	const quizId = req.params.id;

	// Validate the quizId
	const CorrectQuizFormat = quizIdSchema.safeParse(quizId);
	if (!CorrectQuizFormat.success) {
		const errors = CorrectQuizFormat.error.errors.map((err) => ({
			path: err.path.join(" > "),
			message: err.message,
		}));

		return res.status(400).json({
			msg: "Validation error",
			errors,
		});
	}

	try {
		await prismaClient.quiz.update({
			where: {
				quizId,
			},
			data: {
				quizImpression: {
					increment: 1,
				},
			},
		});
		return res.status(200).json({ msg: "Impression count increased" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: "Can't increase impression count",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
export const totalCountOfQuiz_Question_Impression = async (
	req: Request,
	res: Response
) => {
	try {
		const totalImpressionSum = await prismaClient.quiz.aggregate({
			_sum: {
				quizImpression: true,
			},
		});
		const totalQuizCount = await prismaClient.quiz.count();
		const totalQuestionCount = await prismaClient.question.count();
		const totalImpression = totalImpressionSum._sum.quizImpression;
		return res
			.status(200)
			.json({ totalImpression, totalQuestionCount, totalQuizCount });
	} catch (error) {
		return res.status(400).json({
			msg: "cant Count the No of Quiz Question And Impressions",
			error: error,
		});
	}
};

const userIdSchema = z.string().cuid();
export const quizCreatedBySpecificUser = async (
	req: Request,
	res: Response
) => {
	const userId = req.params.id;

	// Validate the userId
	const CorrectQuizFormat = userIdSchema.safeParse(userId);
	if (!CorrectQuizFormat.success) {
		const errors = CorrectQuizFormat.error.errors.map((err) => ({
			path: err.path.join(" > "),
			message: err.message,
		}));

		return res.status(400).json({
			msg: "Validation error",
			errors,
		});
	}

	try {
		const allQuizzes = await prismaClient.quiz.findMany({
			where: {
				userId,
			},
		});

		if (allQuizzes.length === 0) {
			return res.status(200).json({ quizzes: [] });
		}

		return res.status(200).json(allQuizzes);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			msg: "Can't send all quizzes by specific user",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const showTrendingQuizzes = async (req: Request, res: Response) => {
	try {
		let trendingQuizzes = await prismaClient.quiz.findMany({
			where: {
				quizImpression: {
					gt: 10, // Find quizzes with impressions greater than 10
				},
			},
			include: {
				questions: true, // Include related questions in the result
			},
			take: 12, // Limit the result to 12 quizzes
		});

		// Fallback to quizzes sorted by high impressions if no trending quizzes are found
		if (trendingQuizzes.length < 12) {
			trendingQuizzes = await prismaClient.quiz.findMany({
				orderBy: {
					quizImpression: "desc", // Sort by impressions in descending order
				},
				include: {
					questions: true, // Include related questions in the result
				},
				take: 12, // Limit to 12 quizzes
			});
		}
		return res.status(200).json(trendingQuizzes);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: "Can't send Trending quizzes",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
};
