import express from "express";
import { Notification } from "../models.js";

const router = express.Router();

// Get notifications
router.get("/", async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ _id: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add notification
router.post("/", async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark one as read
router.put("/:id/read", async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark all as read
router.put("/read-all", async (req, res) => {
    try {
        await Notification.updateMany({}, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;