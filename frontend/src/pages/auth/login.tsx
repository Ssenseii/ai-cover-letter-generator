import { useState } from "react";
import api from "../../utility/api";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const response = await api.post("/auth/login", {
				email,
				password,
			});
			localStorage.setItem("token", response.data.token);
			console.log("Login successful", response.data.user);
			window.location.href = "/";
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		}
	};

	return (
		<main className="login">
			<div className="login-content">
				<div className="login-content-text">
					<h2>AI COVER LETTER GENERATOR</h2>
					<p>Enter Your Credential Below</p>
				</div>

				{error && <p>{error}</p>}

				<form
					className="login-content-form"
					action="/login"
					method="POST"
				>
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
						className="login-content-form-submit"
						id="login_submit"
						onClick={handleLogin}
					>
						<span>Unlock</span>
					</button>
				</form>

				<a className="login-content-link" href="/contact">
					Forgot Your Password?
				</a>
				<a className="login-content-link" href="/register">
					Create a New Account?
				</a>
			</div>
		</main>
	);
};

export default Login;
