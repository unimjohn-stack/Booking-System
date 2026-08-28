import User from '../models/userModel.js';
import bcrypt from "bcrypt";
import Business from '../models/businessModel.js';

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, businessName, category } = req.body;
        if (!fullName || !email || !phone || !password || !businessName) {
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
}