import express from "express";
import { Client } from "../models.js";

const router = express.Router();

// Get all clients
router.get("/", async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add client
router.post("/", async (req, res) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update client
router.put("/:id", async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete client
router.delete("/:id", async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;