import Business from '../models/businessModel.js';
import Service from '../models/serviceModel.js';

export const createService = async (req, res) => {
    try {
        const { name, description, price, duration, } = req.body;
        if ( !name || price === undefined || duration === undefined ) {
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

export const getMyService = async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const service = await Service.findOne({ _id: req.params.id, business: business._id });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        // if (service.business._id !== business._id) {
        //     return res.status(403).json({ message: "This service does not belong to your business" });
        // }
        return res.status(200).json({ success: true, message: "Service found successfully", service, });
    } catch (error) {
        console.error("Error in getMyService Controller", error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const getService = async (req, res) => {
    try {
        const service = await Service.findOne({ _id: req.params.id, isActive: true });
        if (!service) {
            return res.status(404).json({ message: "Services not found" });
        }
        return res.status(200).json({ success: true, message: "Service found successfully", service, });
    } catch (error) {
        console.error("Error in getService Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getServices = async (req, res) => {
    try {
        const services = await Service.find({ isActive: true });
        if (services.length === 0) {
            return res.status(200).json({ message: "No Services Yet" });
        }
        return res.status(200).json({ success:true, message: "Services found", services })
    } catch(error) {
        console.error("Error in getServices controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error"})
    }
}

export const updateService = async (req, res) => {
    try {
        const { name, description, price, duration } = req.body;
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const service = await Service.findOneAndUpdate({ _id: req.params.id, business: business._id, }, { name, description, price, duration }, { new: true, runValidators: true })
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        return res.status(200).json({ success: true, message: "Service Updated Successfully", service });
    } catch(error) {
        console.error("Error in updateService Controller:", error.message );
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// export const deleteService = async (req, res) => {
//     try {
//         const business = await Business.findOne({ owner: req.user._id });
//         if (!business) {
//             return res.status(404).json({ message: "Business not found" });
//         }
//         const service = await Service.findOneAndDelete({ _id: req.params.id, business: business._id });
//         if (!service) {
//             return res.status(404).json({ message: "Service not found" });
//         }
//         return res.status(200).json({ success: true, message: "Service deleted sucessfully" });
//     } catch (error) {
//         console.error("Error in deleteService Controller:", error.message);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }

export const deactivateService = async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const service = await Service.findOne({ _id: req.params.id, business: business._id });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        if (service.isActive !== true) {
            return res.status(400).json({ message: "This service is deactivated already" });
        }
        service.isActive = false;
        await service.save();
        return res.status(200).json({ success: true, message: "Service deactivated successfully", service })
    } catch (error) {
        console.error("Error in deactivateService Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}