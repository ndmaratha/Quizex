import axios from "axios";

export const fetchTotalCounts = async (setTotalCount: any) => {
	try {
		const res = await axios.post("http://localhost:3000/quiz/totalCount");
		setTotalCount({
			quizCount: res.data.totalQuizCount,
			questionCount: res.data.totalQuestionCount,
			impressionCount: res.data.totalImpression,
		});
	} catch (error) {
		console.error("Error fetching total counts:", error);
	}
};

export const fetchTrendingQuiz = async (
	setTrendingQuiz: any,
	setLoading: any
) => {
	try {
		setLoading(true);
		const res = await axios.post("http://localhost:3000/quiz/showtrendingquiz");
		setTrendingQuiz(res.data);
		console.log("data", res.data);
		setLoading(false);
	} catch (error) {
		console.log("error fetching quiz", error);
	}
};
export const fetchSpecificUserQuiz = async (
	setUserQuiz: any,
	setLoading: any,
	userId: any
) => {
	try {
		setLoading(true);
		const token = await localStorage.getItem("token");
		const userId = await localStorage.getItem("userId");
		const res = await axios.post(
			`http://localhost:3000/quiz/quizbyuser/${userId}`,
			{}, // If you don't have a request body, pass an empty object
			{
				headers: {
					Authorization: `Bearer ${token}`, // Send the token in the Authorization header
				},
			}
		);
		setUserQuiz(res.data);
		console.log("data", res.data);
		setLoading(false);
	} catch (error) {
		console.log("error fetching User quiz", error);
	}
};
