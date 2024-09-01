import React, { useState } from "react";
import api from "../../utility/api";
import { useNavigate } from "react-router-dom";
interface RegisterResponse {
	token: string;
}

interface ApiErrorResponse {
	response: {
		data: {
			message: string;
		};
	};
}

const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleRegister = async (): Promise<void> => {
		try {
			const response = await api.post<RegisterResponse>(
				"/auth/register",
				{ username, email, password }
			);
			localStorage.setItem("token", response.data.token);
			navigate("/login");

			console.log("User Registered Successfully");
		} catch (err) {
			const error = err as ApiErrorResponse;
			setError(error.response?.data?.message || "Registration Failed...");
		}
	};

	return (
		<main className="login">
			<div className="login-content">
				<div className="login-content-text">
					<h2>AI COVER LETTER GENERATOR</h2>
					<p>Fitst Time? Create an account Here.</p>
				</div>

				{error && <p style={{ color: "red" }}>{error}</p>}

				<form
					className="login-content-form"
					action="/register"
					method="POST"
				>
					<input
						type="text"
						placeholder="username"
						name="username"
						id="username"
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Email"
						name="email"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						name="password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<button
						onClick={handleRegister}
						className="login-content-form-submit"
						id="register_submit"
					>
						<span>Create Account</span>
					</button>
				</form>

				<a className="login-content-link" href="/login">
					Already Have An Account?
				</a>
			</div>
		</main>
	);
};

export default Register;
