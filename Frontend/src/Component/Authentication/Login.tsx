import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { LoginState } from "../../Store/LoginState";

interface LoginDetails {
	email: string;
	password: string;
}

const Login: React.FC = () => {
	const [loginDetails, setLoginDetails] = useState<LoginDetails>({
		email: "",
		password: "",
	});
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const SetLoginState = useSetRecoilState(LoginState);
	// Handle form input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
	};

	// Handle form submission
	const handleLoginDetails = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null); // Reset previous errors
		setSuccess(false); // Reset success state

		// Basic form validation
		if (!loginDetails.email || !loginDetails.password) {
			setError("Please fill in all fields.");
			return;
		}

		try {
			const response = await axios.post("http://localhost:3000/api/login", {
				email: loginDetails.email,
				password: loginDetails.password,
			});

			if (response.status === 200) {
				// Successful login
				setSuccess(true);
				console.log("Login successful:", response.data);
				localStorage.setItem("token", response.data.token);
				SetLoginState(true);
				navigate("/");
			}
		} catch (err: any) {
			// Handle specific backend error responses
			if (err.response) {
				if (err.response.status === 401) {
					setError("User Does Not Exist!..");
				} else if (err.response.status === 402) {
					setError("Invalid Password!.");
				} else {
					setError("An unexpected error occurred. Please try again later");
				}
			} else {
				setError("Network error. Please check your connection.");
			}
			console.error(err);
		}
	};

	return (
		<div className='login-container'>
			<div className='login-box'>
				<h1 className='login-title'>Quizee</h1>

				<div className='button-group'>
					<button className='text-button' onClick={() => navigate("/signup")}>
						Sign up
					</button>
					<button className='text-button-login'>Login</button>
				</div>

				<form onSubmit={handleLoginDetails}>
					<div className='form-group'>
						<div>
							<label htmlFor='email' className='label'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={loginDetails.email}
								onChange={handleChange}
								className='input-field'
								required
							/>
						</div>
						<div>
							<label htmlFor='password' className='label'>
								Password
							</label>
							<input
								type='password'
								name='password'
								value={loginDetails.password}
								onChange={handleChange}
								className='input-field'
								required
							/>
						</div>
					</div>
					<button type='submit' className='submit-button'>
						Login
					</button>
				</form>

				{error && <p className='error-message'>{error}</p>}
				{success && <p className='success-message'>Login successful!</p>}
			</div>
		</div>
	);
};

export default Login;
