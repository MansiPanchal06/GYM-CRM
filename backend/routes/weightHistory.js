import express from "express";
import { WeightHistory, WeightTableData } from "../models.js";

const router = express.Router();

// Weight History
router.get("/history", async (req, res) => {
    try {
        const history = await WeightHistory.find().sort({ _id: 1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/history", async (req, res) => {
    try {
        const history = await WeightHistory.create(req.body);
        res.status(201).json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Weight Table
router.get("/table", async (req, res) => {
    try {
        const data = await WeightTableData.find().sort({ _id: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/table", async (req, res) => {
    try {
        const data = await WeightTableData.create(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;