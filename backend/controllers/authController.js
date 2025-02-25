const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Secure key

// 🛠️ **User Registration**
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        user = new User({ email, password: hashedPassword });
        await user.save();

        res.json({ msg: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// 🔐 **Login User**
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log("🔹 Email received:", email);
    console.log("🔹 Password received:", password);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found in DB");
            return res.status(400).json({ error: "User does not exist" });
        }

        console.log("✅ User found in DB:", user);
        console.log("🔹 Hashed Password in DB:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔹 Password Match:", isMatch);

        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(400).json({ error: "Incorrect password" });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        console.log("✅ Token generated:", token);
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Export controllers
module.exports = { registerUser, loginUser };
