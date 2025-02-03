// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        console.error("No Authorization header found");
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
        console.error("Empty token after Bearer removal");
        return res.status(401).json({ message: "Malformed token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Token verification failed",
            error: error.message,
            hint: "Check token expiration and secret"
        });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Forbidden: Admins Only" });
    }
    next();
};