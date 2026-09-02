import Business from '../models/businessModel.js';
import Service from '../models/serviceModel.js';

export const createService = async (req, res) => {
    try {
        const { name, description, price, duration, } = req.body;
        if ( !name || !description || price === undefined || duration === undefined ) {
            return res.status(400).json({ message: "All fields required" });
        }
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found "});
        }
        if (business.isActive !== true) {
            return res.status(403).json({ message: "An inactive business can not create a service" });
        }
        const service = await Service.create({ name, description, price, duration, business: business._id });
        return res.status(201).json({ success: true, message: "Service created successfully", service, });
     } catch (error) {
        console.error("Error in createService Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMyServices = async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const services = await Service.find({ business: business._id });
        if (services.length === 0) {
            return res.status(200).json({ success: true, message: "No Services for this Business yet", services: [], });
        }
        return res.status(200).json({ success: true, message: "Services found successfully", services });
    } catch (error) {
        console.error("Error in getMyServcices Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}