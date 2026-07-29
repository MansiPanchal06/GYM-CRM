import express from "express";
import { DailyUpdate } from "../models.js";

const router = express.Router();

// Get all daily updates
router.get("/", async (req, res) => {
    try {
        const updates = await DailyUpdate.find().sort({ _id: -1 });
        res.json(updates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add daily update
router.post("/", async (req, res) => {
    try {
        const update = await DailyUpdate.create(req.body);
        res.status(201).json(update);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;