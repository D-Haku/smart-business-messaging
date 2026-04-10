require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const analyticsRoutes = require('./routes/analytics');
const campaignRoutes = require('./routes/campaigns');
const { seedData } = require('./seed');

const app = express();
app.use(cors());
app.use(express.json());

// Serve built React app in production
app.use(express.static(path.join(__dirname, '../dist')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/campaigns', campaignRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  await seedData();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
