import React from "react";
import "./TrendingQuizCard.css";

interface QuizCardProps {
	quizCreatedOn: string;
	number: number;
	quizImpression: number;
}
const TrendingQuizCard: React.FC<QuizCardProps> = ({
	quizCreatedOn,
	number,
	quizImpression,
}) => {
	return (
		<div className='main-container-card'>
			<div className='first-container-card'>
				<div className='heading-quiz'>Quiz {number + 1}</div>
				<div className='impression'>{quizImpression}👁️</div>
			</div>
			<div className='second-container-card'>
				Created On:{new Date(quizCreatedOn).toISOString().split("T")[0]}
			</div>
		</div>
	);
};

export default TrendingQuizCard;
