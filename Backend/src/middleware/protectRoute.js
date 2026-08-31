import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized" });
    }
}