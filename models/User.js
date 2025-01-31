// const mongoose = require("mongoose");
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "agent"]
    }
});

export const User = mongoose.model("User", userSchema, "users");
// module.exports = mongoose.model("User", userSchema, "users");