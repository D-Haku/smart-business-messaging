const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { simulatedChat } = require('../ai/simulatedAI');

const hasOpenAI = () => process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here';

router.post('/:userId', async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  const user = await User.findById(req.params.userId).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });

  let reply;

  if (hasOpenAI()) {
    const { chatResponse } = require('../ai/aiService');
    reply = await chatResponse(user, message, history || []);
  } else {
    reply = simulatedChat(user, message);
  }

  res.json({ role: 'assistant', content: reply });
});

module.exports = router;
