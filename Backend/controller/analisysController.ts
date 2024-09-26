import { Request, Response } from "express";
import { prismaClient } from "../prismaClient";

export const updateAnalisys = async (req: Request, res: Response) => {
	const analisysData = req.body; // Expecting an array of analysis data

	if (!Array.isArray(analisysData) || analisysData.length === 0) {
		return res
			.status(400)
			.json({ msg: "No analysis data provided for update" });
	}

	try {
		// Update each analysis record one by one using a loop
		const updatePromises = analisysData.map(async (analisys: any) => {
			const {
				aid,
				q_attempted,
				q_incorrect,
				q_correct,
				op1,
				op2,
				op3,
				op4,
				questionId,
			} = analisys;

			if (!aid) {
				throw new Error(
					"Each analysis entry must include 'aid' (analysis ID)."
				);
			}

			// Update each analysis record
			return await prismaClient.analysis.update({
				where: {
					aid: aid, // Match the analysis record by its primary key (aid)
				},
				data: {
					q_attempted,
					q_incorrect,
					q_correct,
					op1,
					op2,
					op3,
					op4,
					questionId,
				},
			});
		});

		// Execute all updates in parallel
		const updatedAnalisysData = await Promise.all(updatePromises);

		return res.status(200).json({
			msg: "Analysis updated successfully",
			updatedAnalisysData,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Error in updating analysis",
			error: error,
		});
	}
};

export const createAnalysis = async (req: Request, res: Response) => {
	const analysisData = req.body; // Expecting an array of analysis data

	if (!Array.isArray(analysisData) || analysisData.length === 0) {
		return res
			.status(400)
			.json({ msg: "No analysis data provided for creation" });
	}

	try {
		const createdAnalysis = await prismaClient.analysis.createMany({
			data: analysisData, // Array of analysis objects
		});

		return res.status(201).json({
			msg: "Analysis records created successfully",
			createdAnalysis,
		});
	} catch (error) {
		return res.status(500).json({
			msg: "Error creating analysis records",
			error: error,
		});
	}
};
