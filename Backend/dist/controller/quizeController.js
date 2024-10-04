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
exports.showTrendingQuizzes = exports.quizCreatedBySpecificUser = exports.totalCountOfQuiz_Question_Impression = exports.increaseQuizImpressionCount = exports.deleteQuizRoute = exports.createQuizRoute = void 0;
const prismaClient_1 = require("../prismaClient");
const zod_1 = require("zod");
// Define the question schema
const questionSchema = zod_1.z.object({
    questionTitle: zod_1.z.string(),
    optionType: zod_1.z.enum(["single", "multiple"]),
    optionOne: zod_1.z.string(),
    optionTwo: zod_1.z.string(),
    optionThree: zod_1.z.string().nullable().optional(), // Optional and nullable
    optionFour: zod_1.z.string().nullable().optional(), // Optional and nullable
    timer: zod_1.z.union([zod_1.z.literal(5), zod_1.z.literal(10), zod_1.z.null()]).optional(), // Optional field: 5, 10, or null
    correctAns: zod_1.z.number().int().nullable().optional(), // Optional field
});
// Define the schema for the quiz creation data
const quizSchema = zod_1.z.object({
    quizName: zod_1.z.string(),
    quizCreatedOn: zod_1.z.date().optional(), // Optional since Prisma may handle it with default value
    userId: zod_1.z.string().cuid(),
    quizType: zod_1.z.enum(["qna", "poll"]),
    questionsArr: zod_1.z.array(questionSchema), // Array of questions
});
const quizIdSchema = zod_1.z.string().cuid();
const createQuizRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const quiz = yield prismaClient_1.prismaClient.quiz.create({
            data: {
                quizName: quizData.quizName,
                quizCreatedOn: new Date(), // Set createdOn to current date and time
                userId: quizData.userId,
                quizType: quizData.quizType,
                questions: {
                    create: quizData.questionsArr.map((data) => ({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to create quiz",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createQuizRoute = createQuizRoute;
const deleteQuizRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const quiz = yield prismaClient_1.prismaClient.quiz.delete({
            where: {
                quizId: quizId,
            },
        });
        return res.status(200).json({
            message: "Quiz and related data deleted successfully",
            quiz,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to delete quiz and related data",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteQuizRoute = deleteQuizRoute;
const increaseQuizImpressionCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield prismaClient_1.prismaClient.quiz.update({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Can't increase impression count",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.increaseQuizImpressionCount = increaseQuizImpressionCount;
const totalCountOfQuiz_Question_Impression = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalImpressionSum = yield prismaClient_1.prismaClient.quiz.aggregate({
            _sum: {
                quizImpression: true,
            },
        });
        const totalQuizCount = yield prismaClient_1.prismaClient.quiz.count();
        const totalQuestionCount = yield prismaClient_1.prismaClient.question.count();
        const totalImpression = totalImpressionSum._sum.quizImpression;
        return res
            .status(200)
            .json({ totalImpression, totalQuestionCount, totalQuizCount });
    }
    catch (error) {
        return res.status(400).json({
            msg: "cant Count the No of Quiz Question And Impressions",
            error: error,
        });
    }
});
exports.totalCountOfQuiz_Question_Impression = totalCountOfQuiz_Question_Impression;
const userIdSchema = zod_1.z.string().cuid();
const quizCreatedBySpecificUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const allQuizzes = yield prismaClient_1.prismaClient.quiz.findMany({
            where: {
                userId,
            },
        });
        if (allQuizzes.length === 0) {
            return res.status(200).json({ quizzes: [] });
        }
        return res.status(200).json(allQuizzes);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Can't send all quizzes by specific user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.quizCreatedBySpecificUser = quizCreatedBySpecificUser;
const showTrendingQuizzes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let trendingQuizzes = yield prismaClient_1.prismaClient.quiz.findMany({
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
            trendingQuizzes = yield prismaClient_1.prismaClient.quiz.findMany({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Can't send Trending quizzes",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.showTrendingQuizzes = showTrendingQuizzes;
