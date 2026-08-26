import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String, 
        lowercase: true,
        trim: true,
    }, 
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
    },
}, {
    timestamps: true
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;