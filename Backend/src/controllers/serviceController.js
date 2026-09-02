import Business from '../models/businessModel.js';
import Service from '../models/serviceModel.js';

export const createService = async (req, res) => {
    try {
        const { name, description, price, duration, } = req.body;
        if ( !name || !description || !price || !duration) {
            return res.status(400).json({ message: "All fields required" });
        }
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found "});
        }
        const service = await Service.create({ name, description, price, duration });
        return res.status(200).json({ success: true, message: "Service created successfully", service, });
     } catch (error) {
        console.error("Error in createService Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}