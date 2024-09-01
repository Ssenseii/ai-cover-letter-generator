const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { sequelize }= require('./models/index')
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

/**
 *
 * MiddleWare
 */

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

/**
 *
 *  Init Sequelize
 */


sequelize
	.authenticate()
	.then(() => console.log("Database connected"))
	.catch((err) => console.error("Database connection error:", err));

// Sync database (create tables if they don't exist)
sequelize
	.sync()
	.then(() => console.log("Database synced"))
	.catch((err) => console.error("Database sync error:", err));

/**
 * 
 * Routes
 */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cover-letters', require('./routes/coverLetterRoutes'));


// Start the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
