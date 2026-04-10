const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

router.get('/', async (req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();
  res.json(campaigns);
});

router.post('/', async (req, res) => {
  const campaign = await Campaign.create({
    name: req.body.name || 'Untitled Campaign',
    trigger: req.body.trigger,
    targetSegments: req.body.targetSegments || [],
    channel: req.body.channel || 'all'
  });
  res.json(campaign);
});

module.exports = router;
