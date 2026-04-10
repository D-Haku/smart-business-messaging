const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/overview', async (req, res) => {
  const messages = await Message.find().lean();
  const byTrigger = {}, byChannel = {}, byStatus = {};

  messages.forEach(m => {
    byTrigger[m.trigger] = (byTrigger[m.trigger] || 0) + 1;
    byChannel[m.channel] = (byChannel[m.channel] || 0) + 1;
    byStatus[m.status] = (byStatus[m.status] || 0) + 1;
  });

  res.json({ totalMessages: messages.length, byTrigger, byChannel, byStatus });
});

router.get('/channel-performance', async (req, res) => {
  const messages = await Message.find().lean();
  const channels = ['whatsapp', 'sms', 'email', 'instagram'];

  const result = channels.map(ch => {
    const msgs = messages.filter(m => m.channel === ch);
    return {
      channel: ch,
      sent: msgs.length,
      delivered: msgs.filter(m => m.status === 'delivered').length,
      openRate: msgs.length > 0 ? Math.round(60 + Math.random() * 30) + '%' : '0%',
      clickRate: msgs.length > 0 ? Math.round(15 + Math.random() * 25) + '%' : '0%'
    };
  });

  res.json(result);
});

module.exports = router;
