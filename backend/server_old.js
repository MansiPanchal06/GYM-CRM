import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { 
  Client, 
  DailyUpdate, 
  WeightHistory, 
  WeightTableData, 
  Notification, 
  ChatMessage 
} from './models.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-crm';

// CORS - allow all origins (you can restrict to your Vercel domain later)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize the database then start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }

  // Health check endpoint (useful for Render)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- Clients Endpoints ---
  app.get('/api/clients', async (req, res) => {
    try {
      const clients = await Client.find({});
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/clients', async (req, res) => {
    try {
      const newClient = new Client(req.body);
      const savedClient = await newClient.save();
      res.status(201).json(savedClient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/clients/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updatedClient = await Client.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedClient) {
        return res.status(404).json({ error: 'Client not found' });
      }
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/clients/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await Client.findByIdAndDelete(id);
      res.json({ message: 'Client deleted successfully', id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Daily Updates Endpoints ---
  app.get('/api/daily-updates', async (req, res) => {
    try {
      const updates = await DailyUpdate.find({}).sort({ _id: -1 });
      res.json(updates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/daily-updates', async (req, res) => {
    try {
      const newUpdate = new DailyUpdate(req.body);
      const savedUpdate = await newUpdate.save();
      res.status(201).json(savedUpdate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Weight History Endpoints ---
  app.get('/api/weight-history', async (req, res) => {
    try {
      const history = await WeightHistory.find({}).sort({ _id: 1 });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/weight-history', async (req, res) => {
    try {
      const newEntry = new WeightHistory({ date: req.body.date, weight: req.body.weight });
      const savedEntry = await newEntry.save();
      res.status(201).json(savedEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Weight Table Data Endpoints ---
  app.get('/api/weight-table-data', async (req, res) => {
    try {
      const data = await WeightTableData.find({}).sort({ _id: -1 });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/weight-table-data', async (req, res) => {
    try {
      const newEntry = new WeightTableData({
        date: req.body.date,
        weight: req.body.weight,
        change: req.body.change,
        bmi: req.body.bmi
      });
      const savedEntry = await newEntry.save();
      res.status(201).json(savedEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Notifications Endpoints ---
  app.get('/api/notifications', async (req, res) => {
    try {
      const notifs = await Notification.find({}).sort({ _id: -1 });
      res.json(notifs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/notifications', async (req, res) => {
    try {
      const newNotif = new Notification({
        message: req.body.message,
        time: req.body.time || 'Just now',
        read: false,
        type: req.body.type || 'info'
      });
      const savedNotif = await newNotif.save();
      res.status(201).json(savedNotif);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/notifications/:id/read', async (req, res) => {
    const { id } = req.params;
    try {
      await Notification.findByIdAndUpdate(id, { read: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/notifications/read-all', async (req, res) => {
    try {
      await Notification.updateMany({}, { read: true });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Chat Messages Endpoints ---
  app.get('/api/chat-messages', async (req, res) => {
    try {
      const messages = await ChatMessage.find({}).sort({ _id: 1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/chat-messages', async (req, res) => {
    try {
      const newMsg = new ChatMessage({
        text: req.body.text,
        sender: req.body.sender,
        senderName: req.body.senderName,
        timestamp: req.body.timestamp,
        time: req.body.time
      });
      const savedMsg = await newMsg.save();
      res.status(201).json(savedMsg);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
