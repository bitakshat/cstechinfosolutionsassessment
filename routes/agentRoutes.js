// const express = require("express");
// const router = express.Router();
// const Agent = require("../models/Agent");
// const { authMiddleware, authorizeAdmin } = require("../middleware/authMiddleware")
// const bcrypt = require('bcryptjs');
// import jwt from "jsonwebtoken";


import Agent from "../models/Agent.js"; // Adjust path as needed
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware, authorizeAdmin } from '../middleware/authMiddleware.js'
import express from 'express'


const router = express.Router();
// router.post("/add", authMiddleware, authorizeAdmin, async (req, res) => {
//     try {
//         const { name, email, phone } = req.body;
//         const newAgent = new Agent({ name, email, phone });
//         await newAgent.save();

//         res.status(201).json({ message: "Agent created successfully", agent: newAgent });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

router.post("/add", authMiddleware, authorizeAdmin, async (req, res) => {
    try {
        // Destructure data from request body
        const { name, email, phone, password } = req.body;

        // Check for missing required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "Name, email, and phone are required." });
        }

        // Create a new agent instance
        const newAgent = new Agent({ name, email, phone, password });

        // Save the new agent to the database
        await newAgent.save();
        // Send success response
        res.status(201).json({ message: "Agent created successfully", agent: newAgent });

    } catch (error) {
        // Enhanced error logging for better debugging
        console.error("Error creating agent:", error);

        // Return detailed error information to client for deb
        await newAgent.save();
        res.status(500).json({
            message: "Server error",
            error: error.message || error,
            stack: error.stack // Only include stack in dev mode, or hide in prod
        });
    }
});


// GET all agents
router.get("/", authMiddleware, async (req, res) => {
    try {
        const agents = await Agent.find();
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Agent Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const agent = await Agent.findOne({ email });

        if (!agent) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, agent.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: agent._id, role: agent.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        console.log("TOKEN ====>: ", token)

        res.json({ token, agent: { _id: agent._id, name: agent.name, email: agent.email } });

    } catch (error) {
        res.status(500).json({ message: "Server Error".concat(error) });
    }
});

router.get("/api/agents", async (req, res) => {
    try {
        const agents = await Agent.find();
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching agents" });
    }
});


// module.exports = router;
export default router;
