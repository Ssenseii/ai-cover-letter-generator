const { CoverLetter } = require("../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");


require("dotenv").config();

/**
 * GOOGLE AI
 */

const genAI = new GoogleGenerativeAI(process.env.GOOGLEAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.generateCoverLetter = async (req, res) => {
	try {
		const { jobDescriptionText, userInput } = req.body;

		if (req.user.balance < 1) {
			return res.status(400).json({ message: "You Have No More Coins" });
		}

		const { name, email, language, phone } = userInput;

		// Construct the prompt with more detail and user-specific information
		const prompt = `
Create a professional cover letter that contains no placeholder text or brackets in ${language} based on the following job description. The cover letter should be structured as follows:

${name}
${email}
${phone}
Date: Today's Date

Hiring Manager's Name from the job description, if not omit.
[Company Name: Extracted from the job description, if provided. If not, omit.]
[Company Address: Extracted from the job description, if provided. If not, omit.]
[City, State, ZIP Code: Extracted from the job description, if provided. If not, omit.]

use this Job Description:
${jobDescriptionText}

Please ensure the cover letter:
- Contains no placeholder text or brackets.
- Directly addresses the hiring manager.
- Highlights relevant skills and experiences aligned with the job description.
- Is well-structured and clear.
- Uses a polite and formal tone.
- Is concise, ideally under 3 paragraphs.

Avoid including any speculative or extra information beyond what is provided in the job description and user input.

Your cover letter should be tailored specifically to this job posting and reflect the information provided.
`;

		// Generate cover letter using the AI model
		const result = await model.generateContent(prompt);

		const coverLetterContent = result.response.text();

		// Deduct one coin from user balance
		req.user.balance -= 1;
		await req.user.save();

		res.status(201).json({ coverLetter: coverLetterContent });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Get all user cover letters
exports.getCoverLetters = async (req, res) => {
	try {
		const coverLetters = await CoverLetter.findAll({
			where: { userId: req.user.id },
		});
		res.json(coverLetters);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// /**
//  *
//  * OPENAI
//  */

// const openai = new OpenAI(process.env.OPENAI_API_KEY);

// exports.generateCoverLetter = async (req, res) => {
// 	try {
// 		const { jobDescriptionText, userInput } = req.body;

// 		// Ensure user has enough coins
// 		if (req.user.balance < 1) {
// 			return res.status(400).json({ message: "Insufficient balance" });
// 		}

// 		const { name, email, language, phone } = userInput;

// 		// Construct the prompt with more detail
// 		const prompt = `
// Create a professional cover letter in ${language} based on the following job description. The cover letter should include:

// [${name}]
// [${email}]
// [${phone}]
// [Date]

// Hiring Manager's Name
// [Company Name]
// [Company Address]
// [City, State, ZIP Code]

// Job Description:
// ${jobDescriptionText}

// Ensure the cover letter:
// - Directly addresses the hiring manager.
// - Highlights relevant skills and experiences aligned with the job description.
// - Is well-structured and clear.
// - Uses a polite and formal tone.
// - Contains no fillable spaces or extraneous information.
// - under 3 paragraphs

// Your cover letter should be concise, persuasive, and tailored to the job posting. Do not include any additional information beyond what is specified.
// `;

// 		// Generate cover letter using OpenAI API
// 		  const gptResponse = await openai.chat.completions.create({
// 				messages: [
// 					{
// 						role: "system",
// 						content: "You are a cover letter writer.",
// 					},
// 					{ role: "user", content: prompt },
// 				],
// 				model: "gpt-4o-mini",
// 			});

// 		const coverLetterContent = gptResponse.data.choices[0].message;

// 		// Save the generated cover letter
// 		const coverLetter = await CoverLetter.create({
// 			userId: req.user.id,
// 			content: coverLetterContent,
// 		});

// 		// Deduct one coin from user balance
// 		req.user.balance -= 1;
// 		await req.user.save();

// 		res.status(201).json({ coverLetter: coverLetter.coverLetterContent });
// 	} catch (error) {
// 		res.status(500).json({ message: "Server error", error });
// 	}
// };

// // Get all user cover letters
// exports.getCoverLetters = async (req, res) => {
// 	try {
// 		const coverLetters = await CoverLetter.findAll({
// 			where: { userId: req.user.id },
// 		});
// 		res.json(coverLetters);
// 	} catch (error) {
// 		res.status(500).json({ message: "Server error", error });
// 	}
// };
