const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Helper function to generate a JWT token
const generateToken = (user) => {
	return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: "7h",
	});
};

// User registration
exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		if (!username) {
			return res.status(400).json({ message: "Username is required" });
		}

		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		const token = generateToken(user);

		console.log('User Successfully Created')
		res.status(201).json({ token, user });
		
	} catch (error) {
		res.status(500).json({ message: "Server error: Something Went Wrong... User Not Created", error });
	}
};


// User login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if(!email || !password){
			return res.status(400).json({
				message: "Username or Password Not Present"
			})
		}
		
		// Check if user exists
		const user = await User.findOne({ where: { email } });
		
		if (!user) {
			return res.status(400).json({ message: "User Does Not Exist" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Wrong Password or Email" });
		}

		// Generate a JWT token
		const token = generateToken(user);

		console.log("Login Succesfull...")
		res.json({ token, user });
	} catch (error) {
		res.status(500).json({ message: "Server error: Something went wrong... Login Not Successfull ", error });
	}
};


exports.protect = async (req, res, next) => {
    let token;

    // Check if token is in the header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID
            req.user = await User.findByPk(decoded.id);
            
            // Check if user exists
            if (!req.user) {
                return res.status(404).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized", error });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

exports.me = async (req, res) => {
	res.json(req.user);
}
