import React, { useState } from "react";
import styles from "./QuestionCreate.module.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { QuestionCreateState } from "../Store/QuestionCreateState";
import {
	getPlaceholder,
	handleAddQuestion,
	handleCorrectAnsChange,
	handleInputChange,
	handleOptionTypeChange,
	handleRemoveQuestion,
	handleTimerChange,
} from "../utils/questionHandlers";
import axios from "axios";
import { QuizCreate } from "../Store/QuizCreate";

const QuestionCreate: React.FC = () => {
	const [question, setQuestion] = useRecoilState(QuestionCreateState);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [addOption, setAddOption] = useState<number>(1);
	const quizState = useRecoilValue(QuizCreate);
	const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
	const [error, setError] = useState<string>("");
	const handleCreateQuiz = async () => {
		try {
			console.log(question, quizState);
			setError("");
			const { quizName, quizType } = quizState;
			const userId = localStorage.getItem("userId");

			// Validate quizType
			if (!quizType || (quizType !== "qna" && quizType !== "poll")) {
				console.error("Invalid quizType. It should be 'qna' or 'poll'.");
				setError("Invalid quizType. It should be 'qna' or 'poll'.");
				return;
			}

			// Construct the payload based on all questions
			const questionsArr = question.questionInfo
				.map((q) => {
					// Convert the timer to a number or set to null if invalid

					// Validate optionType for each question
					if (
						!q.questionType ||
						!["text", "image", "imageAndText"].includes(q.questionType)
					) {
						console.error(
							"Invalid questionType. It should be 'text', 'image', or 'imageAndText'."
						);
						setError(
							"Select questionType. It should be 'text', 'image', or 'imageAndText'."
						);
						return;
					}
					if (!q.optionOne && !q.optionTwo) {
						setError("Two Options Are Compulsary");
						return;
					}
					if (!q.questionTitle) {
						setError("Enter Question Title");
						return;
					}
					return {
						questionTitle: q.questionTitle,
						optionType: q.questionType,
						optionOne: q.optionOne,
						optionTwo: q.optionTwo,
						optionThree: q.optionThree,
						optionFour: q.optionFour,
						timer: q.questionTimer,
						correctAns: q.correctAns,
					};
				})
				.filter(Boolean); // Remove any null values from invalid questions

			// // Check if all questions are valid
			// if (questionsArr.length !== question.questionInfo.length) {
			// 	console.error("Some questions have invalid values.");
			// 	setError(
			// 		"Enter the data for all Question OR Remove the question which is not needed"
			// 	);
			// 	return;
			// }

			const payload = {
				quizName,
				quizType,
				userId,
				questionsArr,
			};

			// Send the data
			const response = await axios.post(
				"http://localhost:3000/quiz/create",
				payload
			);
			console.log(response);
		} catch (error) {
			console.error("Error creating quiz:", error);
		}
	};

	return (
		<div className={styles.mainDiv}>
			<div className={styles.questionNoDiv}>
				<div className={styles.questions}>
					{question.questionInfo.map((_, index) => (
						<div key={index} className={styles.questionItem}>
							<p onClick={() => setCurrentQuestionIndex(index)}>{index + 1}</p>
							{index > 0 && ( // Check if the index is greater than 0
								<button
									className={styles.removeButton}
									onClick={() =>
										handleRemoveQuestion(
											index,
											currentQuestionIndex,
											question,
											setQuestion,
											setCurrentQuestionIndex
										)
									}
								>
									&times;
								</button>
							)}
						</div>
					))}

					{question.questionInfo.length < question.maxQuestion && (
						<button
							onClick={() =>
								handleAddQuestion(
									question,
									setQuestion,
									setCurrentQuestionIndex
								)
							}
						>
							+
						</button>
					)}
				</div>
				<div className={styles.maxQuestion}>
					Max {question.maxQuestion} Questions
				</div>
			</div>

			<input
				className={styles.pollQuestion}
				placeholder={`Poll Question ${currentQuestionIndex + 1}`}
				value={question.questionInfo[currentQuestionIndex].questionTitle}
				onChange={(e) =>
					handleInputChange(
						e,
						"questionTitle",
						currentQuestionIndex,
						question,
						setQuestion
					)
				}
			/>

			<div className={styles.optionType}>
				<label>Option Type</label>
				<label>
					<input
						type='radio'
						name='optionType'
						value='text'
						checked={
							question.questionInfo[currentQuestionIndex].questionType ===
							"text"
						}
						onChange={(e) =>
							handleOptionTypeChange(e, currentQuestionIndex, setQuestion)
						}
					/>
					Text
				</label>
				<label>
					<input
						type='radio'
						name='optionType'
						value='image'
						checked={
							question.questionInfo[currentQuestionIndex].questionType ===
							"image"
						}
						onChange={(e) =>
							handleOptionTypeChange(e, currentQuestionIndex, setQuestion)
						}
					/>
					Image
				</label>
				<label>
					<input
						type='radio'
						name='optionType'
						value='imageAndText'
						checked={
							question.questionInfo[currentQuestionIndex].questionType ===
							"imageAndText"
						}
						onChange={(e) =>
							handleOptionTypeChange(e, currentQuestionIndex, setQuestion)
						}
					/>
					Text & Image URL
				</label>
			</div>

			<div className={styles.optionsAndTimerCombineDiv}>
				<div className={styles.options}>
					{["optionOne", "optionTwo"].map((option, index) => (
						<label
							key={index}
							className={`${
								question.questionInfo[currentQuestionIndex].correctAns === index
									? styles.correctOption
									: ""
							}`}
						>
							<input
								type='radio'
								name='option'
								checked={
									question.questionInfo[currentQuestionIndex].correctAns ===
									index
								}
								className={
									question.questionInfo[currentQuestionIndex].correctAns ===
									index
										? styles.correctOption
										: ""
								}
								onChange={() =>
									handleCorrectAnsChange(
										index,
										currentQuestionIndex,
										setQuestion
									)
								}
							/>
							<input
								type='text'
								placeholder={getPlaceholder(
									question.questionInfo[currentQuestionIndex].questionType
								)}
								value={
									question.questionInfo[currentQuestionIndex][
										option as keyof (typeof question)["questionInfo"][number]
									] ?? ""
								}
								className={
									question.questionInfo[currentQuestionIndex].correctAns ===
									index
										? styles.selectedInput
										: styles.optionInput
								}
								onChange={(e) =>
									handleInputChange(
										e,
										option as keyof (typeof question)["questionInfo"][number],
										currentQuestionIndex,
										question,
										setQuestion
									)
								}
							/>
						</label>
					))}
					{addOption > 1 && (
						<>
							{addOption >= 2 && (
								<div className={styles.forOptionThirdAndFour}>
									<label
										className={
											question.questionInfo[currentQuestionIndex].correctAns ===
											3
												? styles.correctOption
												: ""
										}
									>
										<input
											type='radio'
											name='option'
											checked={
												question.questionInfo[currentQuestionIndex]
													.correctAns === 3
											}
											className={
												question.questionInfo[currentQuestionIndex]
													.correctAns === 3
													? styles.correctOption
													: ""
											}
											onChange={() =>
												handleCorrectAnsChange(
													3,
													currentQuestionIndex,
													setQuestion
												)
											}
										/>
										<input
											type='text'
											placeholder={getPlaceholder(
												question.questionInfo[currentQuestionIndex].questionType
											)}
											value={
												question.questionInfo[currentQuestionIndex][
													"optionThree" as keyof (typeof question)["questionInfo"][number]
												] ?? ""
											}
											className={
												question.questionInfo[currentQuestionIndex]
													.correctAns === 3
													? styles.selectedInput
													: styles.optionInput
											}
											onChange={(e) =>
												handleInputChange(
													e,
													"optionThree" as keyof (typeof question)["questionInfo"][number],
													currentQuestionIndex,
													question,
													setQuestion
												)
											}
										/>
									</label>
									<button
										className={styles.deleteBtn}
										onClick={() => setAddOption(addOption - 1)}
									>
										delete
									</button>
								</div>
							)}
							{addOption >= 3 && (
								<div className={styles.forOptionThirdAndFour}>
									<label
										className={
											question.questionInfo[currentQuestionIndex].correctAns ===
											4
												? styles.correctOption
												: ""
										}
									>
										<input
											type='radio'
											name='option'
											checked={
												question.questionInfo[currentQuestionIndex]
													.correctAns === 4
											}
											className={
												question.questionInfo[currentQuestionIndex]
													.correctAns === 4
													? styles.correctOption
													: ""
											}
											onChange={() =>
												handleCorrectAnsChange(
													4,
													currentQuestionIndex,
													setQuestion
												)
											}
										/>
										<input
											type='text'
											placeholder={getPlaceholder(
												question.questionInfo[currentQuestionIndex].questionType
											)}
											value={
												question.questionInfo[currentQuestionIndex][
													"optionFour" as keyof (typeof question)["questionInfo"][number]
												] ?? ""
											}
											className={
												question.questionInfo[currentQuestionIndex]
													.correctAns === 4
													? styles.selectedInput
													: styles.optionInput
											}
											onChange={(e) =>
												handleInputChange(
													e,
													"optionFour" as keyof (typeof question)["questionInfo"][number],
													currentQuestionIndex,
													question,
													setQuestion
												)
											}
										/>
									</label>
									<button
										className={styles.deleteBtn}
										onClick={() => setAddOption(addOption - 1)}
									>
										delete
									</button>
								</div>
							)}
						</>
					)}
					{addOption < 3 && (
						<button
							className={styles.addOption}
							onClick={() => setAddOption(addOption + 1)}
						>
							Add Option
						</button>
					)}
				</div>
				<div className={styles.questionTimer}>
					<p>Timer</p>
					{[null, 5, 10].map((timer, index) => (
						<button
							key={index + 432}
							className={`${styles.timerBtn} ${
								selectedTimer == timer ? styles.activeTimer : ""
							}`}
							onClick={() => {
								setSelectedTimer(timer);
								handleTimerChange(timer, currentQuestionIndex, setQuestion);
							}}
						>
							{timer === null ? "Off" : `${timer} sec`}
						</button>
					))}
				</div>
			</div>

			<div className={styles.CreateCancleBtn}>
				<button className={styles.CancleBtn}>Cancel</button>
				<button onClick={handleCreateQuiz} className={styles.CreateBtn}>
					Create Quiz
				</button>
			</div>
			<div style={{ color: "red" }}>{error}</div>
		</div>
	);
};

export default QuestionCreate;
