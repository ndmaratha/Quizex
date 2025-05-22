import React, { useEffect, useState } from "react";
import styles from "./AttendQuiz.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { AttendQuestion } from "../../Store/AttendQuestion";
import { QuestionStatistics } from "../../Store/AnalysisState";

const AttendQuiz: React.FC = () => {
	const [attendQuestion, setAttendQuestion] = useRecoilState(AttendQuestion);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [timer, setTimer] = useState<number | null>(null);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const { id } = useParams<{ id: string }>();
	const [questionAnalysis, setQuestionAnalysis] =
		useRecoilState(QuestionStatistics);
	const [quizdata, setQuizData] = useState({
		quizId: "",
		quizType: "",
	});
	const handleQuizData = async () => {
		try {
			const res = await axios.post(
				`http://localhost:3000/quiz/singleQuiz/${id}`
			);
			const increase = await axios.put(
				`http://localhost:3000/quiz/increase/${id}`
			);
			setAttendQuestion(res.data.questions);
			setQuizData(res.data);
			console.log(quizdata);
			console.log(res.data);
		} catch (error) {
			console.error("Error fetching quiz data:", error);
		}
	};

	useEffect(() => {
		handleQuizData();
	}, [id]);

	const currentQuestion = attendQuestion?.[currentQuestionIndex];

	useEffect(() => {
		if (currentQuestion) {
			setTimer(currentQuestion.questionTimer);
			setSelectedOption(null); // Reset the selected option when the question changes
		}
	}, [currentQuestion]);

	useEffect(() => {
		if (timer !== null && timer > 0) {
			const intervalId = setInterval(() => {
				setTimer((prevTimer) => {
					if (prevTimer && prevTimer > 0) {
						return prevTimer - 1;
					}
					return 0;
				});
			}, 1000);

			return () => clearInterval(intervalId);
		} else if (timer === 0) {
			handleNextQuestion();
		}
	}, [timer]);

	const handleNextQuestion = () => {
		if (currentQuestionIndex < attendQuestion.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			console.log("Quiz complete. Submitting answers...");
		}
	};

	const handleSubmitQuiz = () => {
		console.log("Submitting the quiz...");
		// Add logic to submit the quiz data here
	};

	const handleOptionSelect = (option: string, optionNo: number) => {
		setSelectedOption(option);

		// Update QuestionStatistics based on quiz type
		setQuestionAnalysis((prevAnalysis) => {
			const questionId = currentQuestion?.questionId;
			const isQnA = quizdata?.quizType === "qna";
			const isPoll = quizdata?.quizType === "poll";

			// Find the index of the current question in the analysis array
			const questionIndex = prevAnalysis.findIndex(
				(stat) => stat.questionId === questionId
			);

			// If the question doesn't exist in the analysis state, add it
			if (questionIndex === -1) {
				const newStat = {
					questionId,
					attendedCount: 1,
					correctCount:
						isQnA && currentQuestion.correctAns === optionNo ? 1 : 0,
					incorrectCount:
						isQnA && currentQuestion.correctAns !== optionNo ? 1 : 0,
					optionOneCount: option === "optionOne" ? 1 : 0,
					optionTwoCount: option === "optionTwo" ? 1 : 0,
					optionThreeCount: option === "optionThree" ? 1 : 0,
					optionFourCount: option === "optionFour" ? 1 : 0,
				};

				return [...prevAnalysis, newStat];
			}

			// Update existing question analysis
			const updatedStat = { ...prevAnalysis[questionIndex] };
			updatedStat.attendedCount += 1;

			if (isQnA) {
				if (currentQuestion.correctAns === optionNo) {
					updatedStat.correctCount += 1;
				} else {
					updatedStat.incorrectCount += 1;
				}
			} else if (isPoll) {
				if (option === "optionOne") updatedStat.optionOneCount += 1;
				else if (option === "optionTwo") updatedStat.optionTwoCount += 1;
				else if (option === "optionThree") updatedStat.optionThreeCount += 1;
				else if (option === "optionFour") updatedStat.optionFourCount += 1;
			}

			const newAnalysis = [...prevAnalysis];
			newAnalysis[questionIndex] = updatedStat;
			return newAnalysis;
		});
	};

	return (
		<div className={styles.wrapper}>
			{attendQuestion && attendQuestion.length > 0 ? (
				<div className={styles.mainDiv}>
					<div className={styles.NoOfQuestionAndTimer}>
						<p className={styles.questionNo}>
							Question {currentQuestionIndex + 1} / {attendQuestion.length}
						</p>
						<p className={styles.timer}>{timer ?? ""}</p>
					</div>
					<p className={styles.Question}>{currentQuestion?.questionTitle}</p>
					<div className={styles.fourOptions}>
						{currentQuestion.optionType === "text" ? (
							<>
								<p
									className={`${styles.option} ${
										selectedOption === "optionOne" ? styles.selected : ""
									}`}
									onClick={() => handleOptionSelect("optionOne", 1)}
								>
									{currentQuestion?.optionOne}
								</p>
								<p
									className={`${styles.option} ${
										selectedOption === "optionTwo" ? styles.selected : ""
									}`}
									onClick={() => handleOptionSelect("optionTwo", 2)}
								>
									{currentQuestion?.optionTwo}
								</p>
								<p
									className={`${styles.option} ${
										selectedOption === "optionThree" ? styles.selected : ""
									}`}
									onClick={() => handleOptionSelect("optionThree", 3)}
								>
									{currentQuestion?.optionThree}
								</p>
								<p
									className={`${styles.option} ${
										selectedOption === "optionFour" ? styles.selected : ""
									}`}
									onClick={() => handleOptionSelect("optionFour", 4)}
								>
									{currentQuestion?.optionFour}
								</p>
							</>
						) : (
							<>
								<img
									src={currentQuestion.optionOne}
									alt=''
									className={`${styles.option} ${
										selectedOption === "optionOne" ? styles.selected : ""
									}`}
									onClick={() => handleOptionSelect("optionOne", 1)}
								/>
								<img
									src={currentQuestion.optionTwo}
									alt=''
									className={`${styles.option} ${
										selectedOption === "optionTwo" ? styles.selected : ""
									}`}
									onClick={() => handleOptionSelect("optionTwo", 2)}
								/>
								<img
									src={currentQuestion.optionThree}
									alt=''
									className={`${styles.option} ${
										selectedOption === "optionThree" ? styles.selected : ""
									}`}
									onClick={() => handleOptionSelect("optionThree", 3)}
								/>
								<img
									src={currentQuestion.optionFour}
									alt=''
									className={`${styles.option} ${
										selectedOption === "optionFour" ? styles.selected : ""
									}`}
									onClick={() => handleOptionSelect("optionFour", 4)}
								/>
							</>
						)}
					</div>
					{currentQuestionIndex < attendQuestion.length - 1 ? (
						<button className={styles.nextBtn} onClick={handleNextQuestion}>
							Next
						</button>
					) : (
						<button className={styles.submitBtn} onClick={handleSubmitQuiz}>
							Submit
						</button>
					)}
				</div>
			) : (
				<p>Loading quiz...</p>
			)}
		</div>
	);
};

export default AttendQuiz;
