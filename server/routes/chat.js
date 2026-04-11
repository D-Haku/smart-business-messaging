const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { chatResponse } = require('../ai/aiService');

router.post('/:userId', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
    return res.status(503).json({ error: 'AI not configured. Add OPENAI_API_KEY to .env' });
  }

  const user = await User.findById(req.params.userId).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const reply = await chatResponse(user, message, history || []);
  res.json({ role: 'assistant', content: reply });
});

module.exports = router;
