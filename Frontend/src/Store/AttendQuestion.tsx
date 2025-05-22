// src/recoil/quizState.ts
import { atom } from "recoil";

interface Question {
	correctAns: number;
	optionOne: string;
	optionTwo: string;
	optionThree: string;
	optionFour: string;
	optionType: string;
	questionId: string;
	questionTimer: number | null;
	questionTitle: string;
	quizId: string;
}

export const AttendQuestion = atom<Question[]>({
	key: "AttendQuestion",
	default: [
		{
			correctAns: 0,
			optionOne: "",
			optionTwo: "",
			optionThree: "",
			optionFour: "",
			optionType: "",
			questionId: "",
			questionTimer: null,
			questionTitle: "",
			quizId: "",
		},
	],
});
