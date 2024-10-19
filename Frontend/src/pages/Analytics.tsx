import { useEffect, useState } from "react";
import QuizTable from "../Component/QuizTable";
import { fetchSpecificUserQuiz } from "../utils/Helper";
import { UserInfo } from "../Store/LoginState";
import { useRecoilValue } from "recoil";
import styles from "./Analytics.module.css"; // Correct import

const Analytics = () => {
	const userId = useRecoilValue(UserInfo);
	const [loading, setLoading] = useState(false);
	const [userQuiz, setUserQuiz] = useState([]);

	useEffect(() => {
		console.log(userId.id);
		fetchSpecificUserQuiz(setUserQuiz, setLoading, userId);
	}, []);

	return (
		<div className={styles["main-container-page"]}>
			<div className={styles["first-div"]}>
				<div className={styles["analytics-heading"]}>Quiz Analysis</div>
				<div className={styles["analysis-table"]}>
					<QuizTable quizzes={userQuiz} />
				</div>
			</div>
		</div>
	);
};

export default Analytics;
