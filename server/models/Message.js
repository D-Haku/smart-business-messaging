const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  channel: { type: String, enum: ['whatsapp', 'sms', 'email', 'instagram'], required: true },
  trigger: { type: String, required: true },
  intent: String,
  message: { type: String, required: true },
  personalizedFor: String,
  segments: [String],
  status: { type: String, default: 'delivered' },
  consentVerified: { type: Boolean, default: true },
  aiGenerated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
