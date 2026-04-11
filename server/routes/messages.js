const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const Product = require('../models/Product');
const { renderTemplate } = require('../messaging/templates');

const TRIGGER_INTENT = {
  cart_abandonment: 'RECOVERY',
  browse_nudge: 'PROMOTION',
  post_purchase: 'TRANSACTIONAL',
  win_back: 'PROMOTION',
  welcome: 'TRANSACTIONAL'
};

router.post('/send', async (req, res) => {
  const { userId, trigger, channel: preferredChannel } = req.body;
  if (!userId || !trigger) return res.status(400).json({ error: 'userId and trigger required' });

  const user = await User.findById(userId).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const channel = resolveChannel(user, preferredChannel);
  if (!channel) return res.status(400).json({ error: 'No consented channel available' });

  const intent = TRIGGER_INTENT[trigger] || 'PROMOTION';
  const consentType = intent === 'TRANSACTIONAL' ? 'TRANSACTIONAL' : intent === 'SUPPORT' ? 'SUPPORT' : 'MARKETING';
  if (!user.consentTypes?.[channel]?.[consentType] && !user.consent?.[channel]) {
    return res.status(403).json({ error: `Consent not granted for ${consentType} on ${channel}` });
  }

  const products = await Product.find().lean();
  const context = buildContext(user, products);
  const message = renderTemplate(trigger, context, channel);

  const record = await Message.create({
    userId, channel, trigger, intent, message,
    personalizedFor: user.name,
    segments: user.segments,
    consentVerified: true
  });

  res.json(record);
});

router.get('/:userId', async (req, res) => {
  const messages = await Message.find({ userId: req.params.userId }).sort({ createdAt: -1 }).lean();
  res.json(messages);
});

function resolveChannel(user, preferred) {
  if (preferred && user.consent[preferred]) return preferred;
  if (user.consent[user.preferredChannel]) return user.preferredChannel;
  return ['whatsapp', 'sms', 'email', 'instagram'].find(ch => user.consent[ch]) || null;
}

function getRecommendations(user, products) {
  const purchased = new Set((user.purchaseHistory || []).map(p => p.productId));
  return products
    .filter(p => !purchased.has(p.productId))
    .map(p => {
      let score = 0;
      (user.browseHistory || []).forEach(term => {
        if (p.name.toLowerCase().includes(term.toLowerCase())) score += 3;
        if (p.category?.toLowerCase().includes(term.toLowerCase())) score += 2;
      });
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function buildContext(user, products) {
  const recs = getRecommendations(user, products);
  return {
    userName: user.name,
    cartItems: user.cart || [],
    cartTotal: (user.cart || []).reduce((s, i) => s + i.price, 0).toFixed(2),
    recommendations: recs,
    lastPurchase: user.purchaseHistory?.[user.purchaseHistory.length - 1] || null,
    browseHistory: (user.browseHistory || []).slice(-3),
    segments: user.segments
  };
}

module.exports = router;
