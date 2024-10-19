import { atom } from "recoil";

// Question info and state definitions (same as before)
interface QuestionInfo {
	questionTitle: string;
	questionType: string;
	questionTimer: number | null;
	optionOne: string;
	optionTwo: string;
	optionThree: string;
	optionFour: string;
	correctAns: number;
}

export interface QuestionState {
	totalOptions: number;
	totalPages: number;
	maxQuestion: number;
	questionInfo: QuestionInfo[];
}

// Atom definition
export const QuestionCreateState = atom<QuestionState>({
	key: "questionState",
	default: {
		totalOptions: 4,
		totalPages: 1,
		maxQuestion: 5,
		questionInfo: [
			{
				questionTitle: "",
				questionType: "",
				questionTimer: null,
				optionOne: "",
				optionTwo: "",
				optionThree: "",
				optionFour: "",
				correctAns: 0,
			},
		],
	},
});
