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

export const getMyBusinessBookings  = async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const bookings = await Booking.find({ business: business._id});
        if (bookings.length === 0) {
            return res.status(200).json({ success: true, message: "No Bookings Yet", bookings: [] });
        }
        return res.status(200).json({ success: true, message: "Bookings found Successfully", bookings });
    } catch (error) {
        console.error("Error in getMyBusinessBookings Controller:", error.message );
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMyBusinessBooking = async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        const booking = await Booking.findById({ _id: req.params.id , business: business._id });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({ success: true, message: "Booking found successfully", booking });
    } catch (error) {

        console.error("Error in getMyBusinessBooking Controller:", error.message );
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMyBookings = async (req, res) => {
    try {
        const {phone} = req.query; 
        const customer = await Customer.findOne({ phone }); 
        const bookings = await Booking.find({ customer: customer._id });
        if (bookings.length === 0) {
            return res.status(200).json({ success: true, message: "No Bookings Yet", bookings: [], });
        }
        return res.status(200).json({ success: true, message: "Bookings found successfully", bookings})
    } catch (error) {
        console.error("Error in getMyBookings Controller:", error.message );
        return res.status(500).json({ message: "Internal Server Error" });
    }
}