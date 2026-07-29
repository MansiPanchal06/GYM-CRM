import express from "express";
import { ChatMessage } from "../models.js";

const router = express.Router();

// Get messages
router.get("/", async (req, res) => {
    try {
        const messages = await ChatMessage.find().sort({ _id: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add message
router.post("/", async (req, res) => {
    try {
        const message = await ChatMessage.create(req.body);
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;