import { atom } from "recoil";

interface QuestionStats {
	questionId: string;
	attendedCount: number;
	correctCount: number;
	incorrectCount: number;
	optionOneCount: number;
	optionTwoCount: number;
	optionThreeCount: number;
	optionFourCount: number;
}

export const QuestionStatistics = atom<QuestionStats[]>({
	key: "QuestionStatistics",
	default: [
		{
			questionId: "",
			attendedCount: 0,
			correctCount: 0,
			incorrectCount: 0,
			optionOneCount: 0,
			optionTwoCount: 0,
			optionThreeCount: 0,
			optionFourCount: 0,
		},
	],
});
