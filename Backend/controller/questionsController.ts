import { Request, Response } from "express";
import { prismaClient } from "../prismaClient";

export const createQuestions = async (req: Request, res: Response) => {
	const { quizId, questions } = req.body;

	// Check if the quizId and questions array exist
	if (!quizId || !questions || !questions.length) {
		return res.status(400).json({ msg: "quizId and questions are required" });
	}

	try {
		// Validate if the quiz exists
		const quiz = await prismaClient.quiz.findUnique({
			where: { quizeId: quizId },
		});

		if (!quiz) {
			return res.status(404).json({ msg: "Quiz not found" });
		}

		// Create the questions
		const createdQuestions = await prismaClient.question.createMany({
			data: questions.map((question: any) => ({
				qtitle: question.qtitle,
				optionType: question.optionType,
				op1: question.op1,
				op2: question.op2,
				op3: question.op3 || null,
				op4: question.op4 || null,
				quizId: quizId,
				correctAns: question.correctAns,
			})),
		});

		return res.status(201).json({
			msg: "Questions created successfully",
			createdQuestions,
		});
	} catch (error) {
		return res.status(500).json({
			msg: "Error creating questions",
			error: error,
		});
	}
};
export const editQuestions = async (req: Request, res: Response) => {
	const questions = req.body; // Expecting an array of questions to be updated

	if (!Array.isArray(questions) || questions.length === 0) {
		return res.status(400).json({ msg: "No questions provided for update" });
	}

	try {
		// Loop through each question and update them individually
		const updatePromises = questions.map(async (question: any) => {
			const { qid, qtitle, op1, op2, op3, op4 } = question;

			if (!qid) {
				throw new Error("qid (question ID) is required for each question");
			}

			return prismaClient.question.update({
				where: {
					qid: parseInt(qid), // Ensure qid is an integer
				},
				data: {
					qtitle,
					op1,
					op2,
					op3: op3 || null, // Optional fields set to null if not provided
					op4: op4 || null,
				},
			});
		});

		// Execute all updates in parallel
		const updatedQuestions = await Promise.all(updatePromises);

		return res.status(200).json({
			msg: "Questions updated successfully",
			updatedQuestions,
		});
	} catch (error) {
		return res.status(500).json({
			msg: "Error updating questions",
			error: error,
		});
	}
};

export const deleteAllQuestions = async (req: Request, res: Response) => {
	const quizeId = req.body;
	try {
		await prismaClient.question.deleteMany({
			where: {
				quizId: quizeId,
			},
		});
		return res
			.status(200)
			.json({ msg: "Quize question deleted Successfully!" });
	} catch (error) {
		return res.status(500).json({
			msg: "Error in Deleting the Quize Question",
			error: error,
		});
	}
};
