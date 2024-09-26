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
exports.deleteAllQuestions = exports.editQuestions = exports.createQuestions = void 0;
const prismaClient_1 = require("../prismaClient");
const createQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, questions } = req.body;
    // Check if the quizId and questions array exist
    if (!quizId || !questions || !questions.length) {
        return res.status(400).json({ msg: "quizId and questions are required" });
    }
    try {
        // Validate if the quiz exists
        const quiz = yield prismaClient_1.prismaClient.quiz.findUnique({
            where: { quizeId: quizId },
        });
        if (!quiz) {
            return res.status(404).json({ msg: "Quiz not found" });
        }
        // Create the questions
        const createdQuestions = yield prismaClient_1.prismaClient.question.createMany({
            data: questions.map((question) => ({
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
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error creating questions",
            error: error,
        });
    }
});
exports.createQuestions = createQuestions;
const editQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = req.body; // Expecting an array of questions to be updated
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ msg: "No questions provided for update" });
    }
    try {
        // Loop through each question and update them individually
        const updatePromises = questions.map((question) => __awaiter(void 0, void 0, void 0, function* () {
            const { qid, qtitle, op1, op2, op3, op4 } = question;
            if (!qid) {
                throw new Error("qid (question ID) is required for each question");
            }
            return prismaClient_1.prismaClient.question.update({
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
        }));
        // Execute all updates in parallel
        const updatedQuestions = yield Promise.all(updatePromises);
        return res.status(200).json({
            msg: "Questions updated successfully",
            updatedQuestions,
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error updating questions",
            error: error,
        });
    }
});
exports.editQuestions = editQuestions;
const deleteAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizeId = req.body;
    try {
        yield prismaClient_1.prismaClient.question.deleteMany({
            where: {
                quizId: quizeId,
            },
        });
        return res
            .status(200)
            .json({ msg: "Quize question deleted Successfully!" });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error in Deleting the Quize Question",
            error: error,
        });
    }
});
exports.deleteAllQuestions = deleteAllQuestions;
