import Availability from "../models/availablityModel.js";
import Business from "../models/businessModel.js";

export const createAvailability = async (req, res) => {
    try {
        const { dayOfWeek, isAvailable, openTime, closeTime } = req.body;
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message:"Business not found" });
        }
        if (!dayOfWeek) {
            return res.status(400).json({ message: "Day of Week is required" });
        }
        const validDays = ["Monday","Tuesday", "Wednesday","Thursday","Friday", "Saturday",  "Sunday"];
        if (!validDays.includes(dayOfWeek)) {
            return res.status(400).json({ message: "A valid day of week is required" });
        }
        // if (isAvailable !== false && (!openTime || !closeTime)) {
        //     return res.status(400).json({ message: "Opening and Closing time is required"});
        // }
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (isAvailable !== false && (!openTime || !closeTime)) {
            return res.status(400).json({ message: "Opening and Closing time is required" });
        }

        if ( isAvailable !== false &&(!timeRegex.test(openTime) || !timeRegex.test(closeTime))) {
            return res.status(400).json({ message: "Time must be in HH:mm format" });
        }
        if (isAvailable !== false && closeTime <= openTime) {
           return res.status(400).json({ message: "Closing time must be after opening time" });
        }
        const existingAvailability = await Availability.findOne({ business: business._id, dayOfWeek });
        if (existingAvailability) {
            return res.status(409).json({ message: `Availability for ${dayOfWeek} already exists`, });
        }
        const availability = await Availability.create({ business: business._id, dayOfWeek, isAvailable, openTime, closeTime });
        return res.status(201).json({ success: true, message: "Availability created successfully", availability });
    } catch (error){
        console.error("Error in createAvailability Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMyAvailability = async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const availability = await Availability.find({ business: business._id });
        return res.status(200).json({success: true, message: "Availability fetched successfully", availability, })
    } catch (error) {
        console.error("Error in getMyAvailability:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}