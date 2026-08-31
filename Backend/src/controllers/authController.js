import User from '../models/userModel.js';
import bcrypt from "bcrypt";
import {generateToken, setCookie} from '../utils/generateToken.js';
import Business from '../models/businessModel.js';

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, businessName, category } = req.body;
        if (!fullName || !email || !phone || !password || !businessName || !category) {
            return res.status(400).json({ message: "All fields required"});
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email:normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: "This user exists already"});
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" });
        }
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ fullName, email: normalizedEmail, phone, password: hashedPassword, });
        const business = await Business.create({ name: businessName, category, phone, owner: user._id, timezone: "Africa/Lagos" });
        user.business = business._id;
        await user.save();
        return res.status(201).json({ success: true, message: "User registered successfully", user: { fullName, email, phone, business }, });
    } catch(error) {
        console.error("Error in registerUser controller:", error.message );
        return res.status(500).json({  success: false, message: "Internal Server Error", });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password ) {
            return res.status(400).json({ message: "All fields required" });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });

        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: "Account is inactive" });
        }
        const token = generateToken(user._id);
        setCookie(res, token);
        return res.status(200).json({ success: true, message: "You have logged In successfully", });
    } catch(error) {
        console.error("Error in loginUser:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logoutUser = async (req, res) => {
    try {
        // res.cookie("token", "", { maxAge: 0 });
        res.clearCookie("token");
        return res.status(200).json({ success: true, message: "Logged Out Successfully" });
    } catch (error) {
        console.error("Error in logoutUser controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkAuth = async  (req, res) => {
    try {
        return res.status(200).json({ success: true, user: req.user, })
    } catch(error) {
        console.error("Error in checkAuth controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}