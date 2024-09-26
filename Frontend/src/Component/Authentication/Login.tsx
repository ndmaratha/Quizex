import React, { useState } from "react";

interface LoginDetails {
	email: string;
	password: string;
}

const Login: React.FC = () => {
	const [loginDetails, setLoginDetails] = useState<LoginDetails>({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
	};

	const handleLoginDetails = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(loginDetails);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
				<h1 className="text-3xl font-bold text-center text-gray-700 mb-8">
					Quizee
				</h1>

				<div className="flex justify-center space-x-4 mb-8">
					<button className="text-blue-500 font-medium hover:text-blue-700">
						Sign up
					</button>
					<button className="text-blue-500 font-medium hover:text-blue-700">
						Login
					</button>
				</div>

				<form onSubmit={handleLoginDetails}>
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							type="email"
							name="email"
							value={loginDetails.email}
							onChange={handleChange}
							className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>

					<div className="mb-6">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							type="password"
							name="password"
							value={loginDetails.password}
							onChange={handleChange}
							className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-300"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
