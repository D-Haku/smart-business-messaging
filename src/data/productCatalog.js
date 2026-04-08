/**
 * Product Catalog - provides product data and recommendation logic.
 */
class ProductCatalog {
  constructor() {
    this.products = new Map();
  }

  seed() {
    const items = [
      { id: 'prod-001', name: 'Wireless Mouse', category: 'electronics', price: 29.99, tags: ['accessories', 'computer'] },
      { id: 'prod-002', name: 'Mechanical Keyboard', category: 'electronics', price: 89.99, tags: ['accessories', 'computer', 'gaming'] },
      { id: 'prod-003', name: 'USB-C Hub', category: 'electronics', price: 49.99, tags: ['accessories', 'computer'] },
      { id: 'prod-004', name: 'Laptop Stand', category: 'electronics', price: 39.99, tags: ['accessories', 'ergonomic'] },
      { id: 'prod-005', name: 'Noise Cancelling Headphones', category: 'electronics', price: 199.99, tags: ['audio', 'premium'] },
      { id: 'prod-006', name: 'Running Sneakers', category: 'fashion', price: 119.99, tags: ['shoes', 'sports'] },
      { id: 'prod-007', name: 'Denim Jacket', category: 'fashion', price: 79.99, tags: ['outerwear', 'casual'] },
      { id: 'prod-008', name: 'Cotton T-Shirt Pack', category: 'fashion', price: 34.99, tags: ['basics', 'casual'] },
      { id: 'prod-010', name: 'Scented Candle Set', category: 'home-decor', price: 34.99, tags: ['fragrance', 'gift'] },
      { id: 'prod-011', name: 'Throw Blanket', category: 'home-decor', price: 59.99, tags: ['cozy', 'living-room'] },
      { id: 'prod-012', name: 'Ceramic Vase', category: 'home-decor', price: 44.99, tags: ['decorative', 'gift'] },
      { id: 'prod-013', name: 'Floor Lamp', category: 'home-decor', price: 129.99, tags: ['lighting', 'living-room'] },
      { id: 'prod-014', name: 'Woven Rug', category: 'home-decor', price: 199.99, tags: ['flooring', 'living-room'] },
      { id: 'prod-015', name: 'Smart Watch', category: 'electronics', price: 249.99, tags: ['wearable', 'premium', 'fitness'] }
    ];
    items.forEach(p => this.products.set(p.id, p));
  }

  get(productId) {
    return this.products.get(productId) || null;
  }

  getByCategory(category) {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  getRecommendations(browseHistory, purchaseHistory, limit = 3) {
    const purchased = new Set(purchaseHistory.map(p => p.productId));
    const allProducts = Array.from(this.products.values());

    // Score products based on relevance to browse history
    const scored = allProducts
      .filter(p => !purchased.has(p.id))
      .map(p => {
        let score = 0;
        browseHistory.forEach(term => {
          if (p.name.toLowerCase().includes(term.toLowerCase())) score += 3;
          if (p.category.toLowerCase().includes(term.toLowerCase())) score += 2;
          if (p.tags.some(t => t.toLowerCase().includes(term.toLowerCase()))) score += 1;
        });
        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  }
}

module.exports = { ProductCatalog };
