/**
 * User Profile Store - manages user data, preferences, consent, and behavioral signals.
 * Supports context-aware intelligence by tracking browsing, purchase, and cart history.
 */
class UserProfileStore {
  constructor() {
    this.users = new Map();
  }

  seed() {
    const demoUsers = [
      {
        id: 'user-001',
        name: 'Alice',
        email: '[email]',
        phone: '[phone_number]',
        preferredChannel: 'whatsapp',
        consent: { whatsapp: true, sms: true, email: true, instagram: false },
        segments: ['frequent-buyer', 'electronics'],
        browseHistory: ['laptop', 'headphones', 'keyboard'],
        purchaseHistory: [
          { productId: 'prod-001', name: 'Wireless Mouse', date: '2026-03-15', amount: 29.99 },
          { productId: 'prod-003', name: 'USB-C Hub', date: '2026-03-28', amount: 49.99 }
        ],
        cart: [{ productId: 'prod-002', name: 'Mechanical Keyboard', price: 89.99, addedAt: '2026-04-08T10:00:00Z' }],
        events: [],
        lastActive: '2026-04-09T08:30:00Z'
      },
      {
        id: 'user-002',
        name: 'Bob',
        email: '[email]',
        phone: '[phone_number]',
        preferredChannel: 'sms',
        consent: { whatsapp: false, sms: true, email: true, instagram: true },
        segments: ['new-customer', 'fashion'],
        browseHistory: ['sneakers', 'jacket', 't-shirt'],
        purchaseHistory: [],
        cart: [],
        events: [],
        lastActive: '2026-04-07T14:20:00Z'
      },
      {
        id: 'user-003',
        name: 'Carol',
        email: '[email]',
        phone: '[phone_number]',
        preferredChannel: 'instagram',
        consent: { whatsapp: true, sms: false, email: true, instagram: true },
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
        events: [],
        lastActive: '2026-04-09T09:00:00Z'
      }
    ];

    demoUsers.forEach(u => this.users.set(u.id, u));
  }

  get(userId) {
    return this.users.get(userId) || null;
  }

  getAll() {
    return Array.from(this.users.values());
  }

  updateConsent(userId, consent) {
    const user = this.users.get(userId);
    if (user) {
      user.consent = { ...user.consent, ...consent };
    }
  }

  recordEvent(userId, eventType, data) {
    const user = this.users.get(userId);
    if (!user) return;
    user.events.push({ eventType, data, timestamp: new Date().toISOString() });

    if (eventType === 'browse' && data?.product) {
      user.browseHistory.push(data.product);
    }
    if (eventType === 'add_to_cart' && data?.product) {
      user.cart.push({ ...data.product, addedAt: new Date().toISOString() });
    }
    if (eventType === 'purchase' && data?.product) {
      user.purchaseHistory.push({ ...data.product, date: new Date().toISOString().split('T')[0] });
      user.cart = user.cart.filter(item => item.productId !== data.product.productId);
    }
    if (eventType === 'remove_from_cart' && data?.productId) {
      user.cart = user.cart.filter(item => item.productId !== data.productId);
    }
    user.lastActive = new Date().toISOString();
  }
}

module.exports = { UserProfileStore };
