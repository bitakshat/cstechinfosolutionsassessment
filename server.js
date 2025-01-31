import agentRoutes from './routes/agentRoutes.js';
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors())
app.use("/api/agents", agentRoutes);
// app.use("/api/agents", require("./routes/agentRoutes"));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in .env");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err)
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// app.use("/", require("./routes/userRoutes"));

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Case-insensitive email search
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        console.log("User Found in DB:", user);
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Verify users collection exists
        const usersCollection = mongoose.connection.db.collection("users");
        if (!usersCollection) {
            return res.status(500).json({ message: "Users collection not found" });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // JWT token generation
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});