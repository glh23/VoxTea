const express = require("express");
const bcrypt = require("@node-rs/bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const router = express.Router();

// Secret key for JWT in production change to .env secret 
const JWT_SECRET = 'qwertyuiopasdfghjklzxcvbnm'; 

// Login Route
router.post("/login", async (req, res) => {

    console.log("In /login")

    console.log(JWT_SECRET);

    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password." });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        // Respond with token
        res.json({ token });
        console.log("Login Success")

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

module.exports = router;
