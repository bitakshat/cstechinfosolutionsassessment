// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");


const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "agent",
        enum: ["user", "admin", "agent"]
    }
});

// Hash password before saving
// agentSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

const Agent = mongoose.model("Agent", agentSchema);
export default Agent; // ✅ Fix: Exporting as default
// module.exports = mongoose.model("Agent", agentSchema, "agents");