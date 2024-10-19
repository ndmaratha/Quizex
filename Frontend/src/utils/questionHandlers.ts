// questionHandlers.ts
import { QuestionState } from "../Store/QuestionCreateState";
import { SetterOrUpdater } from "recoil";

// Function to handle input changes for the question fields
export const handleInputChange = (
	e: React.ChangeEvent<HTMLInputElement>,
	field: keyof QuestionState["questionInfo"][number],
	currentQuestionIndex: number,
	question: QuestionState,
	setQuestion: SetterOrUpdater<QuestionState>
): void => {
	const updatedQuestion = {
		...question.questionInfo[currentQuestionIndex],
		[field]: e.target.value,
	};

	setQuestion((prev) => {
		const newQuestions = [...prev.questionInfo];
		newQuestions[currentQuestionIndex] = updatedQuestion;
		return {
			...prev,
			questionInfo: newQuestions,
		};
	});
};

// Function to handle changes in the option type (e.g., text, image, imageAndText)
export const handleOptionTypeChange = (
	e: React.ChangeEvent<HTMLInputElement>,
	currentQuestionIndex: number,
	setQuestion: SetterOrUpdater<QuestionState>
): void => {
	setQuestion((prev) => {
		const newQuestions = [...prev.questionInfo];
		newQuestions[currentQuestionIndex] = {
			...newQuestions[currentQuestionIndex],
			questionType: e.target.value,
		};
		return {
			...prev,
			questionInfo: newQuestions,
		};
	});
};

// Function to add a new question
export const handleAddQuestion = (
	question: QuestionState,
	setQuestion: SetterOrUpdater<QuestionState>,
	setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
): void => {
	if (question.questionInfo.length < question.maxQuestion) {
		const newQuestion = {
			questionTitle: "",
			questionType: "",
			questionTimer: null,
			optionOne: "",
			optionTwo: "",
			optionThree: "",
			optionFour: "",
			correctAns: 0,
		};
		setQuestion((prev) => ({
			...prev,
			questionInfo: [...prev.questionInfo, newQuestion],
		}));
		setCurrentQuestionIndex(question.questionInfo.length); // Navigate to the newly added question
	}
};

// Function to remove a question by its index
export const handleRemoveQuestion = (
	index: number,
	currentQuestionIndex: number,
	question: QuestionState,
	setQuestion: SetterOrUpdater<QuestionState>,
	setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
): void => {
	if (question.questionInfo.length > 1) {
		setQuestion((prev) => {
			const newQuestions = prev.questionInfo.filter((_, i) => i !== index);
			return {
				...prev,
				questionInfo: newQuestions,
			};
		});

		// Adjust current question index if necessary
		if (currentQuestionIndex >= index) {
			setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
		}
	}
};

// Function to handle changes to the correct answer option
export const handleCorrectAnsChange = (
	index: number,
	currentQuestionIndex: number,
	setQuestion: SetterOrUpdater<QuestionState>
): void => {
	setQuestion((prev) => {
		const newQuestions = [...prev.questionInfo];
		newQuestions[currentQuestionIndex] = {
			...newQuestions[currentQuestionIndex],
			correctAns: index,
		};
		return {
			...prev,
			questionInfo: newQuestions,
		};
	});
};
export const getPlaceholder = (
	questionType: QuestionState["questionInfo"][number]["questionType"]
): string => {
	switch (questionType) {
		case "text":
			return "Text";
		case "image":
			return "ImageURL";
		case "imageAndText":
			return "Text and ImageURL";
		default:
			return "Enter option";
	}
};

export const handleTimerChange = (
	timer: number | null,
	currentQuestionIndex: number,
	setQuestion: SetterOrUpdater<QuestionState>
): void => {
	setQuestion((prev) => {
		const newQuestions = [...prev.questionInfo];
		const updatedQuestion = {
			...newQuestions[currentQuestionIndex],
			questionTimer: timer,
		};
		newQuestions[currentQuestionIndex] = updatedQuestion;

		return {
			...prev,
			questionInfo: newQuestions,
		};
	});
};
