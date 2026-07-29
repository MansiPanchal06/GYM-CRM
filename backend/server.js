import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import clientRoutes from "./routes/clients.js";
import dailyUpdateRoutes from "./routes/dailyUpdates.js";
import weightRoutes from "./routes/weightHistory.js";
import notificationRoutes from "./routes/notifications.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
    res.send("Gym CRM Backend Running 🚀");
});

// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend Running",
        timestamp: new Date().toISOString(),
    });
});

// ======================
// API Routes
// ======================

// Clients
app.use("/api/clients", clientRoutes);

// Daily Updates
app.use("/api/daily-updates", dailyUpdateRoutes);

// Weight History & Weight Table
app.use("/api/weight", weightRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// Chat Messages
app.use("/api/chat-messages", chatRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});