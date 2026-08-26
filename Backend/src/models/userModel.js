import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["Business_Owner", "Staff", "Admin"],
        default: "Business_Owner",
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;