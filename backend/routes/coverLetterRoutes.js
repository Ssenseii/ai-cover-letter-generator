const express = require("express");
const router = express.Router();
const coverLetterController = require("../controllers/coverLetterController");
const authController = require("../controllers/authController");

// Generate a cover letter (Protected)
router.post(
	"/generate",
	authController.protect,
	coverLetterController.generateCoverLetter
);


module.exports = router;
