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
router.post("/add", authMiddleware, authorizeAdmin, async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const newAgent = new Agent({ name, email, phone });
        await newAgent.save();

        res.status(201).json({ message: "Agent created successfully", agent: newAgent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET all agents
router.get("/", authMiddleware, async (req, res) => {
    try {
        const agents = await Agent.find();
        res.json(agents);
        console.log("Agents: ", agents)
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
        console.log("AGENT: ", agent)
        console.log("=====>", agent.password, '\n')

        const isMatch = await bcrypt.compare(password, agent.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: agent._id, role: agent.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        console.log("TOKEN ====>: ", token)

        res.json({ token, agent: { id: agent._id, name: agent.name, email: agent.email } });

    } catch (error) {
        res.status(500).json({ message: "Server Error".concat(error) });
    }
});

// module.exports = router;
export default router;
