const mongoose = require('mongoose');

const consentTypeSchema = new mongoose.Schema({
  MARKETING: { type: Boolean, default: false },
  TRANSACTIONAL: { type: Boolean, default: false },
  SUPPORT: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  preferredChannel: { type: String, enum: ['whatsapp', 'sms', 'email', 'instagram'], default: 'whatsapp' },
  consent: {
    whatsapp: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    instagram: { type: Boolean, default: false }
  },
  consentTypes: {
    whatsapp: { type: consentTypeSchema, default: () => ({}) },
    sms: { type: consentTypeSchema, default: () => ({}) },
    email: { type: consentTypeSchema, default: () => ({}) },
    instagram: { type: consentTypeSchema, default: () => ({}) }
  },
  segments: [String],
  browseHistory: [String],
  purchaseHistory: [{
    productId: String,
    name: String,
    date: String,
    amount: Number
  }],
  cart: [{
    productId: String,
    name: String,
    price: Number,
    addedAt: String
  }],
  consentAuditTrail: [{
    action: String,
    timestamp: String,
    reason: String,
    initiatedBy: String,
    channel: String,
    consentType: String
  }],
  lastActive: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
