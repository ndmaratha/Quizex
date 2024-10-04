// src/pages/Dashboard.tsx

import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";

const Dashboard: React.FC = () => {
	const [totalCount, setTotalCount] = useState({
		quizCount: 0,
		questionCount: 0,
		impressionCount: 0,
	});
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.post("http://localhost:3000/quiz/totalCount");

				// Assuming your server response is like:
				// { "totalImpression": 13, "totalQuestionCount": 9, "totalQuizCount": 3 }

				setTotalCount({
					quizCount: res.data.totalQuizCount,
					questionCount: res.data.totalQuestionCount,
					impressionCount: res.data.totalImpression,
				});
			} catch (error) {
				console.error("Error fetching total counts:", error);
			}
		};

		fetchData();
	}, [totalCount]);
	return (
		<div className='main-container-page'>
			<div className='first-div'>
				<div className='info-box-quiz'>
					<span>{totalCount.quizCount}</span>
					<div>Quiz Created</div>
				</div>
				<div className='info-box-question'>
					<span>{totalCount.questionCount}</span>
					<div>Question Created</div>
				</div>
				<div className='info-box-impression'>
					<span>{totalCount.impressionCount}</span>
					<div>Impressions</div>
				</div>
			</div>
			<div className='trending-quiz'>
				<div className='trending-heading'>Trending Quizzes</div>
				<div className='quiz-container'></div>
			</div>
		</div>
	);
};

export default Dashboard;
