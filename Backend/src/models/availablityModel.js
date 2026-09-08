import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
    },
    dayOfWeek: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ],
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    openTime: {
        type: String,
    },
    closeTime: {
        type: String,
    },
}, {
    timestamps: true,
});

availabilitySchema.index(
    { business: 1, dayOfWeek: 1 },
    { unique: true }
);

const Availability = mongoose.model("Availability", availabilitySchema);
export default Availability;