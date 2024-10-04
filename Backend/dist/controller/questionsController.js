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
exports.editQuestions = void 0;
const prismaClient_1 = require("../prismaClient");
const zod_1 = require("zod");
// Define Zod schema for the question update
const questionSchema = zod_1.z.object({
    questionId: zod_1.z.string(),
    questionTitle: zod_1.z.string().optional(),
    optionOne: zod_1.z.string().optional(),
    optionTwo: zod_1.z.string().optional(),
    optionThree: zod_1.z.string().optional(),
    optionFour: zod_1.z.string().optional(),
    questionTimer: zod_1.z.number().optional(),
});
// Define Zod schema for an array of questions
const questionArraySchema = zod_1.z.array(questionSchema);
const editQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = questionArraySchema.safeParse(req.body);
    // Handle invalid input
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
    }
    const questions = parseResult.data;
    try {
        // Map through the array of questions and update them
        const updatePromises = questions.map((question) => {
            return prismaClient_1.prismaClient.question.update({
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
        const updatedQuestions = yield Promise.all(updatePromises);
        res.json(updatedQuestions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update questions" });
    }
});
exports.editQuestions = editQuestions;
