"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizAnalysis = exports.createOrUpdateAnalysis = void 0;
const zod_1 = require("zod");
const prismaClient_1 = require("../prismaClient");
// Define Zod schema for analysis data, now `analysisId` is a string (cuid)
const analysisSchema = zod_1.z.object({
    analysisId: zod_1.z.string().cuid().optional(), // Now a string, optional for upsert
    questionAttemptedCount: zod_1.z.number().optional(),
    questionCorrectlyAnswered: zod_1.z.number().optional(),
    questionIncorrectlyAnswered: zod_1.z.number().optional(),
    ChosedOptionOneCount: zod_1.z.number().optional(),
    ChosedOptionTwoCount: zod_1.z.number().optional(),
    ChosedOptionThreeCount: zod_1.z.number().optional(),
    ChosedOptionFourCount: zod_1.z.number().optional(),
    questionId: zod_1.z.string().cuid(), // Required field for question relation
});
// Define Zod schema for array of analysis data
const analysisArraySchema = zod_1.z.array(analysisSchema);
// Upsert multiple analysis data
const createOrUpdateAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = analysisArraySchema.safeParse(req.body);
    // Handle invalid input
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
    }
    const analysisDataArray = parseResult.data;
    try {
        // Use Promise.all to handle multiple upserts concurrently
        const upsertPromises = analysisDataArray.map((analysisData) => __awaiter(void 0, void 0, void 0, function* () {
            // Fetch the existing analysis data by questionId
            const existingAnalysis = yield prismaClient_1.prismaClient.analysis.findUnique({
                where: { questionId: analysisData.questionId },
            });
            return prismaClient_1.prismaClient.analysis.upsert({
                where: {
                    questionId: analysisData.questionId, // Use questionId for the upsert
                },
                create: {
                    analysisId: analysisData.analysisId || undefined, // Create a new cuid if not provided
                    questionAttemptedCount: analysisData.questionAttemptedCount || 0,
                    questionCorrectlyAnswered: analysisData.questionCorrectlyAnswered || 0,
                    questionIncorrectlyAnswered: analysisData.questionIncorrectlyAnswered || 0,
                    ChosedOptionOneCount: analysisData.ChosedOptionOneCount || 0,
                    ChosedOptionTwoCount: analysisData.ChosedOptionTwoCount || 0,
                    ChosedOptionThreeCount: analysisData.ChosedOptionThreeCount || 0,
                    ChosedOptionFourCount: analysisData.ChosedOptionFourCount || 0,
                    questionId: analysisData.questionId, // Required for relation
                },
                update: {
                    questionAttemptedCount: ((existingAnalysis === null || existingAnalysis === void 0 ? void 0 : existingAnalysis.questionAttemptedCount) || 0) +
                        (analysisData.questionAttemptedCount || 0),
                    questionCorrectlyAnswered: ((existingAnalysis === null || existingAnalysis === void 0 ? void 0 : existingAnalysis.questionCorrectlyAnswered) || 0) +
                        (analysisData.questionCorrectlyAnswered || 0),
                    questionIncorrectlyAnswered: ((existingAnalysis === null || existingAnalysis === void 0 ? void 0 : existingAnalysis.questionIncorrectlyAnswered) || 0) +
                        (analysisData.questionIncorrectlyAnswered || 0),
                    ChosedOptionOneCount: ((existingAnalysis === null || existingAnalysis === void 0 ? void 0 : existingAnalysis.ChosedOptionOneCount) || 0) +
                        (analysisData.ChosedOptionOneCount || 0),
                    ChosedOptionTwoCount: ((existingAnalysis === null || existingAnalysis === void 0 ? void 0 : existingAnalysis.ChosedOptionTwoCount) || 0) +
                        (analysisData.ChosedOptionTwoCount || 0),
                    ChosedOptionThreeCount: ((existingAnalysis === null || existingAnalysis === void 0 ? void 0 : existingAnalysis.ChosedOptionThreeCount) || 0) +
                        (analysisData.ChosedOptionThreeCount || 0),
                    ChosedOptionFourCount: ((existingAnalysis === null || existingAnalysis === void 0 ? void 0 : existingAnalysis.ChosedOptionFourCount) || 0) +
                        (analysisData.ChosedOptionFourCount || 0),
                },
            });
        }));
        // Await all upserts to finish
        const upsertedAnalysisData = yield Promise.all(upsertPromises);
        res.json(upsertedAnalysisData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to upsert analysis data" });
    }
});
exports.createOrUpdateAnalysis = createOrUpdateAnalysis;
const getQuizAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId } = req.params;
    try {
        // Fetch all analysis related to the given quiz ID
        const quizWithAnalysis = yield prismaClient_1.prismaClient.quiz.findUnique({
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
        const analysisData = quizWithAnalysis.questions.flatMap((question) => question.questionAnalysis);
        res.json(analysisData); // Return the analysis data for the specific quiz
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve analysis data" });
    }
});
exports.getQuizAnalysis = getQuizAnalysis;
