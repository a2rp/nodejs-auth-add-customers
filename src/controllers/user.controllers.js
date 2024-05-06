const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
    try {
        // console.log(req.body, "req body");
        const { email, password, passwordVerify } = req.body;
        if (!email || !password || !passwordVerify) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password at least 6 characters required." });
        }

        if (password !== passwordVerify)
            return res.status(400).json({ success: false, message: "Passwords do not match." });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ success: false, message: "Email already exists." });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({ email, password: passwordHash });
        console.log(newUser, "newUser");

        const token = jwt.sign({ user: newUser._id }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.json({
            success: true,
            message: "User saved successfully",
            user: { _id: newUser._id, email: newUser.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Email not found."
            });
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!passwordCorrect) {
            return res.status(401).json({ success: false, message: "Incorrect password." });
        }

        const token = jwt.sign({ user: existingUser._id, }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.json({
            success: true, message: "Logged in successfully", user: {
                _id: existingUser._id,
                email: existingUser.email,
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

module.exports.logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
    });
    res.json({ success: true, message: "Logged out successfully" });
};

module.exports.isLoggedIn = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json(false);
        jwt.verify(token, process.env.JWT_SECRET);
        res.send(true);
    } catch (err) {
        res.json(false);
    }
};

