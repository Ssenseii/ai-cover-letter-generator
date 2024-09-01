import { useEffect, useState } from "react";
import { Header } from "../../constants/index";
import { useNavigate } from "react-router-dom";

import api from "../../utility/api";
import Popup from "../../components/popup";
const Generator: React.FC = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
		null
	);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("token");

			if (token) {
				try {
					await api.get("/auth/me", {
						headers: { Authorization: `Bearer ${token}` },
					});
					setIsAuthenticated(true);
				} catch (err) {
					console.error("Token verification failed:", err);
					setIsAuthenticated(false);
				}
			} else {
				setIsAuthenticated(false);
			}
		};

		checkAuth();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		navigate("/login"); // Adjust to the correct path
	};

	const [isProcessing, setIsProcessing] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsProcessing(true); // Show popup

		const form = event.currentTarget;
		const formData = new FormData(form);

		const data = {
			userInput: {
				name: formData.get("fullname") as string | null,
				email: formData.get("email") as string | null,
				phone: formData.get("phoneNumber") as string | null,
				language: formData.get("language") as string | null,
			},
			jobDescriptionText:
				(formData.get("jobdescription") as string | null)?.replace(
					/\r?\n|\r/g,
					""
				) ?? "",
		};

		const token = localStorage.getItem("token"); // Retrieve token from local storage or another place

		try {
			const response = await fetch(
				"http://localhost:3000/api/cover-letters/generate",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Include token in headers
					},
					body: JSON.stringify(data),
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const result = await response.json();
			console.log("Generated Cover Letter:", result.coverLetter);
			const outputField = document.getElementById(
				"output_field"
			) as HTMLTextAreaElement | null;
			if (outputField) {
				outputField.value = result.coverLetter;
			}
		} catch (error) {
			console.error("Error generating cover letter:", error);
		} finally {
			setIsProcessing(false); // Hide popup
		}
	};
	if (isAuthenticated === null) {
		return (
			<Popup
				title="Authenticating"
				paragraph="Loading User Information..."
			/>
		);
	}

	return (
		<>
			<main className="generator">
				<div className="generator__input">
					{/* Actions */}
					<div className="generator__input-actions">
						{isAuthenticated ? (
							<>
								<button
									onClick={handleLogout}
									className="generator__input-actions-logout"
								>
									<a>
										<svg
											width="15"
											height="15"
											viewBox="0 0 15 15"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5.625 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H5.625"
												stroke="#818181"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M10 10.625L13.125 7.5L10 4.375"
												stroke="#818181"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M13.125 7.5H5.625"
												stroke="#818181"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>

										<span>Sign Out</span>
									</a>
								</button>

								<button className="generator__input-actions-coins">
									<a href="">
										<svg
											width="14"
											height="14"
											viewBox="0 0 14 14"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M6.02458 1.31824C6.25939 0.278689 7.74061 0.278688 7.97542 1.31824L8.14971 2.08981C8.3019 2.76354 9.07505 3.08379 9.65906 2.715L10.3279 2.29266C11.229 1.72363 12.2764 2.771 11.7073 3.67212L11.285 4.34094C10.9162 4.92495 11.2365 5.6981 11.9102 5.85029L12.6818 6.02458C13.7213 6.25939 13.7213 7.74061 12.6818 7.97542L11.9102 8.14971C11.2365 8.3019 10.9162 9.07505 11.285 9.65906L11.7073 10.3279C12.2764 11.229 11.229 12.2764 10.3279 11.7073L9.65906 11.285C9.07505 10.9162 8.3019 11.2365 8.14971 11.9102L7.97542 12.6818C7.74061 13.7213 6.25939 13.7213 6.02458 12.6818L5.85029 11.9102C5.6981 11.2365 4.92495 10.9162 4.34094 11.285L3.67212 11.7073C2.771 12.2764 1.72363 11.229 2.29266 10.3279L2.715 9.65906C3.08379 9.07505 2.76354 8.3019 2.08981 8.14971L1.31824 7.97542C0.278689 7.74061 0.278688 6.25939 1.31824 6.02458L2.08981 5.85029C2.76354 5.6981 3.08379 4.92495 2.715 4.34094L2.29266 3.67212C1.72363 2.771 2.771 1.72363 3.67212 2.29266L4.34094 2.715C4.92495 3.08379 5.6981 2.76354 5.85029 2.08981L6.02458 1.31824Z"
												fill="#E11D48"
											/>
										</svg>

										<span>15</span>
									</a>
								</button>
							</>
						) : (
							<button className="generator__input-actions-login">
								<a href="/login">
									<svg
										width="15"
										height="15"
										viewBox="0 0 15 15"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5.625 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H5.625"
											stroke="#818181"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M10 10.625L13.125 7.5L10 4.375"
											stroke="#818181"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M13.125 7.5H5.625"
											stroke="#818181"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>

									<span>Sign In</span>
								</a>
							</button>
						)}
					</div>

					{/* Title */}
					<div className="generator__input-title">
						<img className="profile" src={Header} alt="" />
						<p>
							Enter Your Information and the job listing, generate
							a cover letter specifically for that job
						</p>
					</div>

					{/* Form */}
					<form
						className="generator__input-form"
						id="coverLetterForm"
						onSubmit={handleSubmit}
					>
						<div className="generator__input-form-row">
							<div className="generator__input-form-row-input">
								<label htmlFor="fullname">
									Full Name <span>*</span>
								</label>
								<input
									type="text"
									name="fullname"
									id="fullname"
									placeholder="John Doe."
								/>
							</div>
							<div className="generator__input-form-row-input">
								<label htmlFor="email">
									E-mail <span>*</span>
								</label>
								<input
									type="email"
									name="email"
									id="email"
									placeholder="johndoe@gmail.com"
								/>
							</div>
						</div>
						<div className="generator__input-form-row">
							<div className="generator__input-form-row-input">
								<label htmlFor="phoneNumber">
									Phone Number
								</label>
								<input
									type="text"
									name="phoneNumber"
									id="phoneNumber"
									placeholder="+212 6XXXXXXXX"
								/>
							</div>
							<div className="generator__input-form-row-input">
								<label htmlFor="language">Language</label>
								<input
									type="text"
									name="language"
									id="language"
									placeholder="french"
								/>
							</div>
						</div>
						<div className="generator__input-form-row">
							<div className="generator__input-form-row-input">
								<label htmlFor="jobdescription">
									Job Posting <span>*</span>
								</label>
								<textarea
									name="jobdescription"
									id="jobdescription"
									placeholder="Paste Job Posting Here or Describe it..."
								></textarea>
							</div>
						</div>
						<button
							className="generator__input-form-submit"
							id="generate"
						>
							Generate Cover Letter
						</button>
					</form>
					<div className="generator__input-info">
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0_1_70)">
								<path
									d="M7.99998 14.6667C11.6819 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6819 1.33334 7.99998 1.33334C4.31808 1.33334 1.33331 4.31811 1.33331 8.00001C1.33331 11.6819 4.31808 14.6667 7.99998 14.6667Z"
									stroke="black"
									strokeOpacity="0.5"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M8 10.6667V8"
									stroke="black"
									strokeOpacity="0.5"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M8 5.33334H8.00708"
									stroke="black"
									strokeOpacity="0.5"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</g>
							<defs>
								<clipPath id="clip0_1_70">
									<rect width="16" height="16" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<div className="generator__input-info-text">
							<p>Generating a cover letter consumes a star</p>
							<svg
								width="7"
								height="7"
								viewBox="0 0 7 7"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3.00164 1.20627C3.12161 0.67514 3.87839 0.67514 3.99836 1.20627C4.07612 1.55049 4.47113 1.71411 4.76952 1.52569C5.22992 1.23496 5.76504 1.77008 5.47431 2.23048C5.28589 2.52887 5.44951 2.92388 5.79373 3.00164C6.32486 3.12161 6.32486 3.87839 5.79373 3.99836C5.44951 4.07612 5.28589 4.47113 5.47431 4.76952C5.76504 5.22992 5.22992 5.76504 4.76952 5.47431C4.47113 5.28589 4.07612 5.44951 3.99836 5.79373C3.87839 6.32486 3.12161 6.32486 3.00164 5.79373C2.92388 5.44951 2.52887 5.28589 2.23048 5.47431C1.77008 5.76504 1.23496 5.22992 1.52569 4.76952C1.71411 4.47113 1.55049 4.07612 1.20627 3.99836C0.67514 3.87839 0.67514 3.12161 1.20627 3.00164C1.55049 2.92388 1.71411 2.52887 1.52569 2.23048C1.23496 1.77008 1.77008 1.23496 2.23048 1.52569C2.52887 1.71411 2.92388 1.55049 3.00164 1.20627Z"
									fill="#E11D48"
								/>
							</svg>
							<a href="#">Get More Stars</a>
						</div>
					</div>
				</div>
				<div className="generator__output">
					<div className="generator__output-buttons">
						<button>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g clipPath="url(#clip0_1_106)">
									<path
										d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
										stroke="white"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M3.33334 10H2.66668C2.31305 10 1.97392 9.85953 1.72387 9.60949C1.47382 9.35944 1.33334 9.0203 1.33334 8.66668V2.66668C1.33334 2.31305 1.47382 1.97392 1.72387 1.72387C1.97392 1.47382 2.31305 1.33334 2.66668 1.33334H8.66668C9.0203 1.33334 9.35944 1.47382 9.60949 1.72387C9.85953 1.97392 10 2.31305 10 2.66668V3.33334"
										stroke="white"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_1_106">
										<rect
											width="16"
											height="16"
											fill="white"
										/>
									</clipPath>
								</defs>
							</svg>
							<span>Copy To Clipboard</span>
						</button>
						<button>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M4.66666 6.66666L7.99999 9.99999L11.3333 6.66666"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M8 10V2"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span>Download PDF</span>
						</button>
					</div>
					<div className="generator__output-field">
						<textarea
							name="output_field"
							id="output_field"
							placeholder="Here Goes The Cover Letter"
						></textarea>
					</div>
				</div>
			</main>
			{isProcessing && (
				<Popup
					title="Processing Data"
					paragraph="Generating Your New Cover Letter..."
				/>
			)}
		</>
	);
};

export default Generator;
