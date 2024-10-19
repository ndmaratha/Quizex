// src/pages/Dashboard.tsx

import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import TrendingQuizCard from "../Component/TrendingQuizCard";
import { fetchTotalCounts, fetchTrendingQuiz } from "../utils/Helper";

const Dashboard: React.FC = () => {
	const [totalCount, setTotalCount] = useState({
		quizCount: 0,
		questionCount: 0,
		impressionCount: 0,
	});
	const [trendingQuiz, setTrendingQuiz] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		fetchTotalCounts(setTotalCount);
		fetchTrendingQuiz(setTrendingQuiz, setLoading);
	}, []);
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
				<div className='quiz-container'>
					{loading ? (
						<div>loading</div>
					) : (
						<>
							{trendingQuiz.map((data: any, index) => {
								return (
									<TrendingQuizCard
										key={data.quizId}
										quizCreatedOn={data.quizCreatedOn}
										number={index}
										quizImpression={data.quizImpression}
									/>
								);
							})}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
