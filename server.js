import agentRoutes from './routes/agentRoutes.js';
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Task } from './models/Task.js';
import Agent from './models/Agent.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors())
app.use("/api/agents", agentRoutes);
// app.use("/api/agents", require("./routes/agentRoutes"));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

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

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // JWT token generation
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
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

app.post("/api/agents/add", async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const newAgent = new Agent({ name, email, phone, password });
        await newAgent.save();
        res.status(201).json({ message: "Agent added successfully", agent: newAgent });
    } catch (error) {
        console.log("Add endoint error: ", error);
        res.status(500).json({ message: "Error adding agent".concat(error) });
    }
});
// ✅ Distribute Tasks Among Agents
app.post("/api/tasks/distribute", async (req, res) => {
    const { distributedTasks } = req.body;
    try {
        for (const agentId in distributedTasks) {
            for (const task of distributedTasks[agentId]) {
                await Task.create({ ...task, agentId });
            }
        }
        res.status(200).json({ message: "Tasks distributed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error distributing tasks".concat(error) });
    }
});

// GET endpoint for fetching all tasks
app.get("/api/tasks", async (req, res) => {
    try {
        // Find all tasks and populate the agent details
        const tasks = await Task.find({})
            .populate('agentId', 'name email phone')
            .lean();

        // If no tasks found, return empty array
        if (!tasks) {
            return res.status(200).json([]);
        }

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            message: "Error fetching tasks",
            error: error.message
        });
    }
});

// GET endpoint to fetch agents with their tasks
app.get("/api/agents/with-tasks", authenticateToken, async (req, res) => {
    try {
        // Find all agents
        const agents = await Agent.find({})
            .select('-password')
            .lean();

        // Find all tasks - add await here
        const tasks = await Task.find({}).lean();

        // Create a map of tasks by agent ID
        const tasksByAgent = tasks.reduce((acc, task) => {
            // Convert ObjectId to string for comparison
            const agentId = task.agentId.toString();
            if (!acc[agentId]) {
                acc[agentId] = [];
            }
            acc[agentId].push(task);
            return acc;
        }, {});

        // Combine agents with their tasks
        const agentsWithTasks = agents.map(agent => ({
            ...agent,
            tasks: tasksByAgent[agent._id.toString()] || []
        }));

        res.status(200).json(agentsWithTasks);
    } catch (error) {
        console.error("Error fetching agents with tasks:", error);
        res.status(500).json({
            message: "Error fetching agents with tasks",
            error: error.message
        });
    }
});

// Get tasks for specific agent
app.get("/api/tasks/agent/:agentId", authenticateToken, async (req, res) => {
    try {
        const agentId = new mongoose.Types.ObjectId(req.params.agentId);
        console.log("agentId xxxxxxx ======> ", agentId);
        const tasks = await Task.find({ agentId }) // Use find() instead of findOne()
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching agent tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Update task status
app.put("/api/tasks/:taskId/status", authenticateToken, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        ).lean();

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: "Error updating task status" });
    }
});