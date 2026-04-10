const User = require('./models/User');
const Product = require('./models/Product');

async function seedData() {
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  console.log('Seeding demo data...');

  await User.insertMany([
    {
      name: 'Alice', email: 'alice@example.com', phone: '+1234567890',
      preferredChannel: 'whatsapp',
      consent: { whatsapp: true, sms: true, email: true, instagram: false },
      consentTypes: {
        whatsapp: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true },
        sms: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true },
        email: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true },
        instagram: { MARKETING: false, TRANSACTIONAL: false, SUPPORT: false }
      },
      segments: ['frequent-buyer', 'electronics'],
      browseHistory: ['laptop', 'headphones', 'keyboard'],
      purchaseHistory: [
        { productId: 'prod-001', name: 'Wireless Mouse', date: '2026-03-15', amount: 29.99 },
        { productId: 'prod-003', name: 'USB-C Hub', date: '2026-03-28', amount: 49.99 }
      ],
      cart: [{ productId: 'prod-002', name: 'Mechanical Keyboard', price: 89.99, addedAt: '2026-04-08T10:00:00Z' }],
      consentAuditTrail: [{ action: 'GRANTED', timestamp: '2026-04-01T09:00:00Z', reason: 'Demo seed', initiatedBy: 'SYSTEM' }],
      lastActive: '2026-04-09T08:30:00Z'
    },
    {
      name: 'Bob', email: 'bob@example.com', phone: '+1234567891',
      preferredChannel: 'sms',
      consent: { whatsapp: false, sms: true, email: true, instagram: true },
      consentTypes: {
        whatsapp: { MARKETING: false, TRANSACTIONAL: false, SUPPORT: false },
        sms: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true },
        email: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true },
        instagram: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true }
      },
      segments: ['new-customer', 'fashion'],
      browseHistory: ['sneakers', 'jacket', 't-shirt'],
      purchaseHistory: [], cart: [],
      consentAuditTrail: [{ action: 'GRANTED', timestamp: '2026-04-01T09:00:00Z', reason: 'Demo seed', initiatedBy: 'SYSTEM' }],
      lastActive: '2026-04-07T14:20:00Z'
    },
    {
      name: 'Carol', email: 'carol@example.com', phone: '+1234567892',
      preferredChannel: 'instagram',
      consent: { whatsapp: true, sms: false, email: true, instagram: true },
      consentTypes: {
        whatsapp: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true },
        sms: { MARKETING: false, TRANSACTIONAL: false, SUPPORT: false },
        email: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true },
        instagram: { MARKETING: true, TRANSACTIONAL: true, SUPPORT: true }
      },
      segments: ['vip', 'home-decor'],
      browseHistory: ['lamp', 'rug', 'cushion', 'candle'],
      purchaseHistory: [
        { productId: 'prod-010', name: 'Scented Candle Set', date: '2026-02-20', amount: 34.99 },
        { productId: 'prod-011', name: 'Throw Blanket', date: '2026-03-10', amount: 59.99 },
        { productId: 'prod-012', name: 'Ceramic Vase', date: '2026-04-01', amount: 44.99 }
      ],
      cart: [
        { productId: 'prod-013', name: 'Floor Lamp', price: 129.99, addedAt: '2026-04-08T16:00:00Z' },
        { productId: 'prod-014', name: 'Woven Rug', price: 199.99, addedAt: '2026-04-08T16:05:00Z' }
      ],
      consentAuditTrail: [{ action: 'GRANTED', timestamp: '2026-04-01T09:00:00Z', reason: 'Demo seed', initiatedBy: 'SYSTEM' }],
      lastActive: '2026-04-09T09:00:00Z'
    }
  ]);

  await Product.insertMany([
    { productId: 'prod-001', name: 'Wireless Mouse', category: 'electronics', price: 29.99, tags: ['accessories', 'computer'] },
    { productId: 'prod-002', name: 'Mechanical Keyboard', category: 'electronics', price: 89.99, tags: ['accessories', 'gaming'] },
    { productId: 'prod-003', name: 'USB-C Hub', category: 'electronics', price: 49.99, tags: ['accessories', 'computer'] },
    { productId: 'prod-004', name: 'Laptop Stand', category: 'electronics', price: 39.99, tags: ['ergonomic'] },
    { productId: 'prod-005', name: 'Noise Cancelling Headphones', category: 'electronics', price: 199.99, tags: ['audio', 'premium'] },
    { productId: 'prod-006', name: 'Running Sneakers', category: 'fashion', price: 119.99, tags: ['shoes', 'sports'] },
    { productId: 'prod-007', name: 'Denim Jacket', category: 'fashion', price: 79.99, tags: ['outerwear'] },
    { productId: 'prod-008', name: 'Cotton T-Shirt Pack', category: 'fashion', price: 34.99, tags: ['basics'] },
    { productId: 'prod-010', name: 'Scented Candle Set', category: 'home-decor', price: 34.99, tags: ['fragrance', 'gift'] },
    { productId: 'prod-011', name: 'Throw Blanket', category: 'home-decor', price: 59.99, tags: ['cozy'] },
    { productId: 'prod-012', name: 'Ceramic Vase', category: 'home-decor', price: 44.99, tags: ['decorative', 'gift'] },
    { productId: 'prod-013', name: 'Floor Lamp', category: 'home-decor', price: 129.99, tags: ['lighting'] },
    { productId: 'prod-014', name: 'Woven Rug', category: 'home-decor', price: 199.99, tags: ['flooring'] },
    { productId: 'prod-015', name: 'Smart Watch', category: 'electronics', price: 249.99, tags: ['wearable', 'premium'] }
  ]);

  console.log('Seed complete');
}

module.exports = { seedData };
