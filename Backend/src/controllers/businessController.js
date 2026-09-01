import Business from "../models/businessModel.js";

export const getMyBusiness = async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        return res.status(200).json({ success: true, message: "Business found successfully", business, });
    } catch(error) {
        console.error("Error in getMyBusiness Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error"});

    }
}

export const getAllBusinesses = async (req, res) => {
    try {
        const business = await Business.find();
        if (business.length === 0) {
            return res.status(200).json({ success: true, message: "No businesses yet", business: [], });
        }
        return res.status(200).json({ success: true, message: "Businesses found successfully", business, })
    } catch(error) {
        console.error("Error in getAllBusinesses Controller:", error.message );
        return res.status(500).json({ message: "Internal Server Error" });
    }
}