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
exports.increaseImpressionCount = exports.deleteQuizeRoute = exports.createQuizeRoute = void 0;
const prismaClient_1 = require("../prismaClient");
const createQuizeRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, qtype } = req.body;
    if (!title && !qtype) {
        return res.status(400).json({ error: "Title is required" });
    }
    try {
        const quiz = yield prismaClient_1.prismaClient.quiz.create({
            data: {
                title,
                createdOn: new Date(), // Set createdOn to current date and time
                userId: req.userId, // Use the user ID from the verified token
                qtype,
            },
        });
        res.status(201).json(quiz); // Return the created quiz
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create quiz" });
    }
});
exports.createQuizeRoute = createQuizeRoute;
const deleteQuizeRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizId = parseInt(req.params.id); // Get quiz ID from route parameters
    if (isNaN(quizId)) {
        return res.status(400).json({ error: "Invalid quiz ID" });
    }
    try {
        const quiz = yield prismaClient_1.prismaClient.quiz.delete({
            where: {
                quizeId: quizId, // Use quizId here to match your schema
            },
        });
        return res.status(200).json({ message: "Quiz deleted successfully", quiz });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete quiz" });
    }
});
exports.deleteQuizeRoute = deleteQuizeRoute;
const increaseImpressionCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizid = parseInt(req.params.id); // parse the quiz ID from params
    try {
        yield prismaClient_1.prismaClient.quiz.update({
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
    }
    catch (error) {
        return res
            .status(401)
            .json({ msg: error, error: "Can't increase impression" });
    }
});
exports.increaseImpressionCount = increaseImpressionCount;
