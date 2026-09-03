import Customer from '../models/customerModel.js';
import Business from '../models/businessModel.js';
import Service from '../models/serviceModel.js';
import Booking from '../models/bookingModel.js';

export const createBooking = async (req, res) => {
    try {
        const { fullName, email, phone, businessId, serviceId, date, startTime, } = req.body;
        if (!fullName || !phone || !businessId || !serviceId ||!date || !startTime) {
            return res.status(400).json({ message: "All fields required" });
        }
        const business  = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        if (!business.isActive) {
            return res.status(400).json({ message: "This business is inactive" });
        }
        const service = await Service.findOne({ _id:serviceId, business: business._id });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        if (!service.isActive) {
            return res.status(400).json({ message: "This service is inactive" });
        }
        let customer = await Customer.findOne({ phone, business: business._id });
        if (!customer) {
            customer = await Customer.create({ fullName, phone, email, business: business._id });
        }
        const [hours, minutes] = startTime.split(":");
        const hoursNumber = Number(hours);
        const minutesNumber = Number(minutes);

        const start = new Date();
        start.setHours(hoursNumber, minutesNumber, 0, 0);
        start.setMinutes(start.getMinutes() + service.duration);

        const endHours = start.getHours();
        const endMinutes = start.getMinutes();

        const endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
        
        const conflictBooking = await Booking.findOne({ business: business._id, date, status: {$in: ["Pending", "Confirmed"]}, startTime: { $lt: endTime}, endTime: { $gt: startTime }, });
        if (conflictBooking) {
            return res.status(409).json({ message: "This time is already booked" });
        }
        const booking = await Booking.create({ customer: customer._id, business: business._id, service: service._id, date, startTime, endTime, });
        return res.status(201).json({ success: true, message: "Booking created successfully", booking });
    } catch (error) {
        console.error("Error found in createBooking Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


