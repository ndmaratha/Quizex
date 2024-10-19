import { atom } from "recoil";

export const QuizCreate = atom({
	key: "permission",
	default: {
		first: false,
		second: false,
		quizName: "",
		quizType: "",
	},
});
