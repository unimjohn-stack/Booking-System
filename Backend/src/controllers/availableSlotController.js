import Service from "../models/serviceModel.js";
import Business from "../models/businessModel.js";
import Booking from "../models/bookingModel.js";
import Availability from "../models/availablityModel.js";

export const getAvailableSlots = async (req, res) => {
    try {
        const { businessId, serviceId, date } = req.query;
        if (!businessId || !serviceId || !date) {
            return res.status(400).json({ message: "Business, Service and Date required" });
        }
        const business = await Business.findById( businessId );
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        if (!business.isActive) {
            return res.status(400).json({ message: "Business is inactive" });
        }
        const service = await Service.findOne({ _id: serviceId, business: business._id, });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        if (!service.isActive) {
            return res.status(400).json({ message: "Service is inactive" });
        }
        const selectedDate = new Date(date);
        if (isNaN(selectedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date" });
        }
        const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = days[selectedDate.getDay()];
        const availability = await Availability.findOne({ business: business._id, dayOfWeek });
        if (!availability || !availability.isAvailable) {
            return res.status(200).json({ success: true, message: "Business is not available on this day", slots: [], });
        }
        const bookings = await Booking.find({ business: business._id, date: selectedDate, status: { $in: ["Pending", "Confirmed"]}})
        const [openHour, openMinute] = availability.openTime.split(":").map(Number);
        const [closeHour, closeMinute] = availability.closeTime.split(":").map(Number);
        const openingMinutes = openHour * 60 + openMinute;
        const closingMinutes = closeHour * 60 + closeMinute;

        const slots = [];
        for ( let currentMinutes = openingMinutes; currentMinutes + service.duration <= closingMinutes; currentMinutes += service.duration) {
            const startHour = Math.floor(currentMinutes / 60);
            const startMinute = currentMinutes % 60;
            const endMinutes = currentMinutes + service.duration;
            const endHour = Math.floor(endMinutes / 60);
            const endMinute = endMinutes % 60;

            const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
            const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

            const isBooked = bookings.some((booking) => {
                return ( booking.startTime < endTime && booking.endTime > startTime);
            });
            if (!isBooked) {
                slots.push({ startTime, endTime });
            }
        }
        return res.status(200).json({ success: true, date, dayOfWeek, serviceDuration: service.duration, slots });
    } catch(error) {
        console.error("Error in getAvailableSlots Controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}