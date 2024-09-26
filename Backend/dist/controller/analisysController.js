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
exports.createAnalysis = exports.updateAnalisys = void 0;
const prismaClient_1 = require("../prismaClient");
const updateAnalisys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const analisysData = req.body; // Expecting an array of analysis data
    if (!Array.isArray(analisysData) || analisysData.length === 0) {
        return res
            .status(400)
            .json({ msg: "No analysis data provided for update" });
    }
    try {
        // Update each analysis record one by one using a loop
        const updatePromises = analisysData.map((analisys) => __awaiter(void 0, void 0, void 0, function* () {
            const { aid, q_attempted, q_incorrect, q_correct, op1, op2, op3, op4, questionId, } = analisys;
            if (!aid) {
                throw new Error("Each analysis entry must include 'aid' (analysis ID).");
            }
            // Update each analysis record
            return yield prismaClient_1.prismaClient.analysis.update({
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
        }));
        // Execute all updates in parallel
        const updatedAnalisysData = yield Promise.all(updatePromises);
        return res.status(200).json({
            msg: "Analysis updated successfully",
            updatedAnalisysData,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Error in updating analysis",
            error: error,
        });
    }
});
exports.updateAnalisys = updateAnalisys;
const createAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const analysisData = req.body; // Expecting an array of analysis data
    if (!Array.isArray(analysisData) || analysisData.length === 0) {
        return res
            .status(400)
            .json({ msg: "No analysis data provided for creation" });
    }
    try {
        const createdAnalysis = yield prismaClient_1.prismaClient.analysis.createMany({
            data: analysisData, // Array of analysis objects
        });
        return res.status(201).json({
            msg: "Analysis records created successfully",
            createdAnalysis,
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: "Error creating analysis records",
            error: error,
        });
    }
});
exports.createAnalysis = createAnalysis;
