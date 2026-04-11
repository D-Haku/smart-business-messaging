/**
 * Simulated AI - provides intelligent responses without an API key.
 * Uses customer data and rule-based logic to mimic AI behavior.
 */

function simulatedChat(user, message) {
  const msg = message.toLowerCase();
  const name = user.name || 'there';
  const cart = user.cart || [];
  const purchases = user.purchaseHistory || [];
  const browse = user.browseHistory || [];
  const cartTotal = cart.reduce((s, i) => s + i.price, 0).toFixed(2);

  // Order / purchase queries
  if (msg.includes('order') || msg.includes('purchase') || msg.includes('bought')) {
    if (purchases.length === 0) {
      return `Hi ${name}! You haven't made any purchases yet. Would you like me to recommend some products based on your browsing history?`;
    }
    const recent = purchases[purchases.length - 1];
    return `Hi ${name}! Your most recent purchase was "${recent.name}" on ${recent.date} for $${recent.amount}. You've made ${purchases.length} purchase(s) total. Need help with anything else?`;
  }

  // Cart queries
  if (msg.includes('cart')) {
    if (cart.length === 0) {
      return `Your cart is currently empty, ${name}. Based on your browsing (${browse.slice(-3).join(', ')}), I'd recommend checking out some of our popular items!`;
    }
    const items = cart.map(i => `• ${i.name} — $${i.price}`).join('\n');
    return `Here's what's in your cart, ${name}:\n${items}\n\nTotal: $${cartTotal}\n\nWould you like to complete your purchase? I can help with any questions about these items!`;
  }

  // Recommendation queries
  if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('what should')) {
    const interests = browse.slice(-3);
    if (interests.length > 0) {
      return `Based on your interest in ${interests.join(', ')}, I'd recommend checking out our related products in those categories! You seem to have great taste in ${user.segments?.[1] || 'quality items'}. Want me to help you find something specific?`;
    }
    return `I'd love to help you find something great, ${name}! What kind of products are you interested in? We have electronics, fashion, and home decor.`;
  }

  // Discount / deal queries
  if (msg.includes('discount') || msg.includes('deal') || msg.includes('offer') || msg.includes('coupon')) {
    if (cart.length > 0) {
      return `Great news, ${name}! Use code COMEBACK10 for 10% off your cart of $${cartTotal}. That would save you $${(cartTotal * 0.1).toFixed(2)}!`;
    }
    return `We have some active promotions, ${name}! New customers get 15% off with code WELCOME15, and returning customers can use COMEBACK10 for 10% off. Want to browse our latest deals?`;
  }

  // Shipping queries
  if (msg.includes('ship') || msg.includes('deliver') || msg.includes('track')) {
    return `We offer free shipping on orders over $50, ${name}! Standard delivery takes 3-5 business days, and express is 1-2 days. Would you like to know more about a specific order?`;
  }

  // Return / refund queries
  if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
    return `We have a 30-day return policy, ${name}. Items must be in original condition. Refunds are processed within 5-7 business days. Would you like to start a return for a specific item?`;
  }

  // Greeting
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.length < 5) {
    return `Hey ${name}! 👋 I'm your shopping assistant. I can help with:\n• Your cart and orders\n• Product recommendations\n• Deals and discounts\n• Shipping and returns\n\nWhat can I help you with?`;
  }

  // Help
  if (msg.includes('help') || msg.includes('what can you')) {
    return `I can help you with:\n• 🛒 Cart info and checkout\n• 📦 Order status and history\n• 🎯 Personalized recommendations\n• 💰 Deals and discount codes\n• 🚚 Shipping and delivery info\n• 🔄 Returns and refunds\n\nJust ask away, ${name}!`;
  }

  // Default
  return `Thanks for your message, ${name}! I'm here to help with your shopping experience. You can ask me about your cart, orders, product recommendations, deals, or shipping. What would you like to know?`;
}

module.exports = { simulatedChat };
