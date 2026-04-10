const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trigger: String,
  targetSegments: [String],
  channel: { type: String, default: 'all' },
  status: { type: String, default: 'active' },
  messagesSent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
