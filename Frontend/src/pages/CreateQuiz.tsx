import React, { useState } from "react";
import styles from "./CreateQuiz.module.css";
import { useRecoilState } from "recoil";
import { QuizCreate } from "../Store/QuizCreate";
import { useNavigate } from "react-router-dom";
import QuestionCreate from "../Component/QuestionCreate";

// Define the types for the error state
interface ErrorState {
	error: boolean;
	errorMsg: string;
}

// Define the types for the permission state
interface PermissionState {
	quizName: string;
	quizType: string;
	first: boolean;
	second: boolean;
}

const CreateQuiz: React.FC = () => {
	const [permission, setPermission] =
		useRecoilState<PermissionState>(QuizCreate);
	const navigate = useNavigate();
	const [error, setError] = useState<ErrorState>({
		error: false,
		errorMsg: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPermission((prev) => ({ ...prev, [name]: value }));
	};

	const handleQuizTypeChange = (type: "qna" | "poll") => {
		setPermission((prev) => ({ ...prev, quizType: type }));
	};

	const handleCreateQuiz = () => {
		// Reset error state
		setError({ error: false, errorMsg: "" });

		// Validate fields
		if (!permission.quizName) {
			setError({ error: true, errorMsg: "Enter the name of the quiz" });
			return;
		}
		if (!permission.quizType) {
			setError({ error: true, errorMsg: "Select the type of quiz" });
			return;
		}

		// Update Recoil state
		setPermission((prev) => ({
			...prev,
			first: true,
		}));

		// Log permission state (for debugging)
		console.log(permission);
	};

	return (
		<div className={styles.wrapper}>
			<div
				className={
					permission.first
						? styles.questionNotSelected
						: styles.mainDivCreateQuiz
				}
			>
				<input
					type='text'
					placeholder='Quiz Name'
					className={styles.quizName}
					name='quizName'
					onChange={handleChange}
				/>
				<div className={styles.quizType}>
					<p>Quiz Type</p>
					<button
						className={permission.quizType === "qna" ? styles.active : ""}
						onClick={() => handleQuizTypeChange("qna")}
					>
						QnA
					</button>
					<button
						className={permission.quizType === "poll" ? styles.active : ""}
						onClick={() => handleQuizTypeChange("poll")}
					>
						Poll
					</button>
				</div>
				<div className={styles.CreateCancleBtn}>
					<button className={styles.CancleBtn} onClick={() => navigate("/")}>
						Cancel
					</button>
					<button className={styles.CreateBtn} onClick={handleCreateQuiz}>
						Create Quiz
					</button>
				</div>
				{error.error && <div className={styles.error}>{error.errorMsg}</div>}
			</div>
			<div
				className={
					permission.first ? styles.createQuestion : styles.questionNotSelected
				}
			>
				<QuestionCreate />
			</div>
		</div>
	);
};

export default CreateQuiz;
