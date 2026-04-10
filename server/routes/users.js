const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.put('/:id/consent', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const updates = req.body;
  Object.entries(updates).forEach(([channel, granted]) => {
    user.consent[channel] = Boolean(granted);
    if (user.consentTypes[channel]) {
      user.consentTypes[channel].MARKETING = Boolean(granted);
    }
    user.consentAuditTrail.push({
      action: granted ? 'GRANTED' : 'REVOKED',
      timestamp: new Date().toISOString(),
      reason: 'Updated via dashboard',
      initiatedBy: 'USER',
      channel,
      consentType: 'MARKETING'
    });
  });

  await user.save();
  res.json({ success: true, consent: user.consent });
});

router.get('/:id/consent-audit', async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user.consentAuditTrail || []);
});

module.exports = router;
