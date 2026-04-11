const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { simulatedChat } = require('../ai/simulatedAI');

router.post('/:userId', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  const user = await User.findById(req.params.userId).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const reply = simulatedChat(user, message);
  res.json({ role: 'assistant', content: reply });
});

module.exports = router;
