const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  price: Number,
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
