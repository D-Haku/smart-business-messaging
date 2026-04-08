const express = require('express');
const cors = require('cors');
const path = require('path');
const { MessagingEngine } = require('./messaging/engine');
const { UserProfileStore } = require('./data/userProfileStore');
const { ProductCatalog } = require('./data/productCatalog');
const { AnalyticsTracker } = require('./analytics/tracker');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const userStore = new UserProfileStore();
const catalog = new ProductCatalog();
const analytics = new AnalyticsTracker();
const engine = new MessagingEngine(userStore, catalog, analytics);

// Seed demo data
userStore.seed();
catalog.seed();

// --- API Routes ---

// Get all users
app.get('/api/users', (req, res) => {
  res.json(userStore.getAll());
});

// Get user profile
app.get('/api/users/:userId', (req, res) => {
  const user = userStore.get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update user consent preferences
app.put('/api/users/:userId/consent', (req, res) => {
  const user = userStore.get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  userStore.updateConsent(req.params.userId, req.body);
  res.json({ success: true, consent: req.body });
});

// Trigger context-aware message for a user
app.post('/api/messages/send', (req, res) => {
  const { userId, trigger, channel } = req.body;
  if (!userId || !trigger) {
    return res.status(400).json({ error: 'userId and trigger are required' });
  }
  const result = engine.sendMessage(userId, trigger, channel);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Get message history for a user
app.get('/api/messages/:userId', (req, res) => {
  res.json(analytics.getMessagesForUser(req.params.userId));
});

// Simulate user events (cart abandonment, browse, purchase)
app.post('/api/events', (req, res) => {
  const { userId, eventType, data } = req.body;
  if (!userId || !eventType) {
    return res.status(400).json({ error: 'userId and eventType are required' });
  }
  userStore.recordEvent(userId, eventType, data);
  // Auto-trigger messaging based on event
  const autoMessages = engine.processEvent(userId, eventType, data);
  res.json({ success: true, triggeredMessages: autoMessages });
});

// Get product recommendations for a user
app.get('/api/recommendations/:userId', (req, res) => {
  const user = userStore.get(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const recs = engine.getRecommendations(userId);
  res.json(recs);
});

// Analytics dashboard data
app.get('/api/analytics/overview', (req, res) => {
  res.json(analytics.getOverview());
});

app.get('/api/analytics/channel-performance', (req, res) => {
  res.json(analytics.getChannelPerformance());
});

// Campaign management
app.get('/api/campaigns', (req, res) => {
  res.json(engine.getCampaigns());
});

app.post('/api/campaigns', (req, res) => {
  const campaign = engine.createCampaign(req.body);
  res.json(campaign);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Smart Messaging Platform running on http://localhost:${PORT}`);
});
