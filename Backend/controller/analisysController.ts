import express, { Request, Response } from "express";
import { z } from "zod";
import { prismaClient } from "../prismaClient";

// Define Zod schema for analysis data, now `analysisId` is a string (cuid)
const analysisSchema = z.object({
	analysisId: z.string().cuid().optional(), // Now a string, optional for upsert
	questionAttemptedCount: z.number().optional(),
	questionCorrectlyAnswered: z.number().optional(),
	questionIncorrectlyAnswered: z.number().optional(),
	ChosedOptionOneCount: z.number().optional(),
	ChosedOptionTwoCount: z.number().optional(),
	ChosedOptionThreeCount: z.number().optional(),
	ChosedOptionFourCount: z.number().optional(),
	questionId: z.string().cuid(), // Required field for question relation
});

// Define Zod schema for array of analysis data
const analysisArraySchema = z.array(analysisSchema);

// Upsert multiple analysis data
export const createOrUpdateAnalysis = async (req: Request, res: Response) => {
	const parseResult = analysisArraySchema.safeParse(req.body);

	// Handle invalid input
	if (!parseResult.success) {
		return res.status(400).json({ error: parseResult.error.errors });
	}

	const analysisDataArray = parseResult.data;

	try {
		// Use Promise.all to handle multiple upserts concurrently
		const upsertPromises = analysisDataArray.map(async (analysisData) => {
			// Fetch the existing analysis data by questionId
			const existingAnalysis = await prismaClient.analysis.findUnique({
				where: { questionId: analysisData.questionId },
			});

			return prismaClient.analysis.upsert({
				where: {
					questionId: analysisData.questionId, // Use questionId for the upsert
				},
				create: {
					analysisId: analysisData.analysisId || undefined, // Create a new cuid if not provided
					questionAttemptedCount: analysisData.questionAttemptedCount || 0,
					questionCorrectlyAnswered:
						analysisData.questionCorrectlyAnswered || 0,
					questionIncorrectlyAnswered:
						analysisData.questionIncorrectlyAnswered || 0,
					ChosedOptionOneCount: analysisData.ChosedOptionOneCount || 0,
					ChosedOptionTwoCount: analysisData.ChosedOptionTwoCount || 0,
					ChosedOptionThreeCount: analysisData.ChosedOptionThreeCount || 0,
					ChosedOptionFourCount: analysisData.ChosedOptionFourCount || 0,
					questionId: analysisData.questionId, // Required for relation
				},
				update: {
					questionAttemptedCount:
						(existingAnalysis?.questionAttemptedCount || 0) +
						(analysisData.questionAttemptedCount || 0),
					questionCorrectlyAnswered:
						(existingAnalysis?.questionCorrectlyAnswered || 0) +
						(analysisData.questionCorrectlyAnswered || 0),
					questionIncorrectlyAnswered:
						(existingAnalysis?.questionIncorrectlyAnswered || 0) +
						(analysisData.questionIncorrectlyAnswered || 0),
					ChosedOptionOneCount:
						(existingAnalysis?.ChosedOptionOneCount || 0) +
						(analysisData.ChosedOptionOneCount || 0),
					ChosedOptionTwoCount:
						(existingAnalysis?.ChosedOptionTwoCount || 0) +
						(analysisData.ChosedOptionTwoCount || 0),
					ChosedOptionThreeCount:
						(existingAnalysis?.ChosedOptionThreeCount || 0) +
						(analysisData.ChosedOptionThreeCount || 0),
					ChosedOptionFourCount:
						(existingAnalysis?.ChosedOptionFourCount || 0) +
						(analysisData.ChosedOptionFourCount || 0),
				},
			});
		});

		// Await all upserts to finish
		const upsertedAnalysisData = await Promise.all(upsertPromises);
		res.json(upsertedAnalysisData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to upsert analysis data" });
	}
};

export const getQuizAnalysis = async (req: Request, res: Response) => {
	const { quizId } = req.params;

	try {
		// Fetch all analysis related to the given quiz ID
		const quizWithAnalysis = await prismaClient.quiz.findUnique({
			where: {
				quizId: quizId, // quizId comes from the request parameters
			},
			include: {
				questions: {
					include: {
						questionAnalysis: true, // Include all related Analysis records for each question
					},
				},
			},
		});

		// If no quiz is found, return a 404 error
		if (!quizWithAnalysis) {
			return res.status(404).json({ error: "Quiz not found" });
		}

		// Extract the analysis data from the questions
		const analysisData = quizWithAnalysis.questions.flatMap(
			(question) => question.questionAnalysis
		);

		res.json(analysisData); // Return the analysis data for the specific quiz
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to retrieve analysis data" });
	}
};
