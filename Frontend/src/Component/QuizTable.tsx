import React from "react";
import styles from "./QuizTable.module.css"; // Import the module CSS

const QuizTable = ({ quizzes }: { quizzes: any[] }) => {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Sr. No.</th>
					<th>Quiz Name</th>
					<th>Created On</th>
					<th>Impression</th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{quizzes.map((quiz, index) => (
					<tr
						key={quiz.quizId}
						className={index % 2 === 0 ? styles.evenRow : styles.oddRow} // Apply alternating row colors
					>
						<td>{index + 1}</td>
						<td>{quiz.quizName}</td>
						<td>{new Date(quiz.quizCreatedOn).toISOString().split("T")[0]}</td>
						<td>{quiz.quizImpression}</td>
						<td>edit</td>
						<td>Question wise Analysis</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default QuizTable;
