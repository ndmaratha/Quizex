import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignUpDetails {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}

const Signup: React.FC = () => {
	const [signUpDetails, setSignUPDetails] = useState<SignUpDetails>({
		email: "",
		name: "",
		password: "",
		confirm_password: "",
	});
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setSignUPDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
	};

	const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null); // Reset any previous errors
		setSuccess(false); // Reset success state

		// Simple password match check
		if (signUpDetails.password !== signUpDetails.confirm_password) {
			setError("Passwords do not match");
			return;
		}

		try {
			const response = await axios.post("http://localhost:3000/api/signup", {
				userName: signUpDetails.name,
				email: signUpDetails.email,
				password: signUpDetails.password,
			});

			if (response.status === 200 || response.status === 201) {
				// Successful signup
				setSuccess(true);
				console.log("Signup successful:", response.data);
			}
		} catch (err: any) {
			if (err.response) {
				if (err.response.status === 400) {
					// Handle specific "Email already in use" error from the backend
					if (err.response.data.error === "Email already in use") {
						setError("Email already in use. Please use a different email.");
					} else {
						// Handle other potential 400 errors
						setError("Signup failed. Please check your inputs.");
					}
				} else if (err.response.status === 500) {
					setError("Server error. Please try again later.");
				}
			} else {
				setError("Network error. Please check your connection.");
			}
			console.error(err);
		}
	};

	useEffect(() => {
		if (success) {
			setTimeout(() => {
				navigate("/login");
			}, 2000); // Optional: Navigate after 2 seconds to show the success message
		}
	}, [success, navigate]);

	return (
		<div className='login-container'>
			<div className='login-box'>
				<h1 className='login-title'>Quizee</h1>

				<div className='button-group'>
					<button className='text-button-login'>Sign up</button>
					<button className='text-button' onClick={() => navigate("/login")}>
						Login
					</button>
				</div>

				<form onSubmit={handleSignup}>
					<div className='form-group'>
						<div>
							<label htmlFor='name' className='label'>
								Name
							</label>
							<input
								type='text'
								name='name'
								value={signUpDetails.name}
								onChange={handleChange}
								className='input-field'
								required
							/>
						</div>
						<div>
							<label htmlFor='email' className='label'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={signUpDetails.email}
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
								value={signUpDetails.password}
								onChange={handleChange}
								className='input-field'
								required
							/>
						</div>
						<div>
							<label htmlFor='confirm_password' className='label'>
								Confirm Password
							</label>
							<input
								type='password'
								name='confirm_password'
								value={signUpDetails.confirm_password}
								onChange={handleChange}
								className='input-field'
								required
							/>
						</div>
					</div>
					<button type='submit' className='submit-button'>
						SignUp
					</button>
				</form>

				{error && <p className='error-message'>{error}</p>}
				{success && (
					<p className='success-message'>Signup successful! Redirecting...</p>
				)}
			</div>
		</div>
	);
};

export default Signup;
