import { Request, Response } from "express";
import { prismaClient } from "../prismaClient";
import { z } from "zod";

// Define Zod schema for the question update
const questionSchema = z.object({
	questionId: z.string(),
	questionTitle: z.string().optional(),
	optionOne: z.string().optional(),
	optionTwo: z.string().optional(),
	optionThree: z.string().optional(),
	optionFour: z.string().optional(),
	questionTimer: z.number().optional(),
});

// Define Zod schema for an array of questions
const questionArraySchema = z.array(questionSchema);

export const editQuestions = async (req: Request, res: Response) => {
	const parseResult = questionArraySchema.safeParse(req.body);

	// Handle invalid input
	if (!parseResult.success) {
		return res.status(400).json({ error: parseResult.error.errors });
	}

	const questions = parseResult.data;

	try {
		// Map through the array of questions and update them
		const updatePromises = questions.map((question) => {
			return prismaClient.question.update({
				where: { questionId: question.questionId },
				data: {
					questionTitle: question.questionTitle,
					optionOne: question.optionOne,
					optionTwo: question.optionTwo,
					optionThree: question.optionThree,
					optionFour: question.optionFour,
					questionTimer: question.questionTimer,
				},
			});
		});

		const updatedQuestions = await Promise.all(updatePromises);
		res.json(updatedQuestions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to update questions" });
	}
};
