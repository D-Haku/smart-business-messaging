const { v4: uuidv4 } = require('uuid');
const { MessageTemplates } = require('./templates');

/**
 * Messaging Engine - core logic for context-aware, personalized messaging.
 * Handles trigger-based messaging, channel routing, consent checks, and campaign management.
 */
class MessagingEngine {
  constructor(userStore, catalog, analytics) {
    this.userStore = userStore;
    this.catalog = catalog;
    this.analytics = analytics;
    this.campaigns = [];
    this.templates = new MessageTemplates();
  }

  /**
   * Send a message to a user based on a trigger event.
   * Respects consent, selects best channel, personalizes content.
   */
  sendMessage(userId, trigger, preferredChannel) {
    const user = this.userStore.get(userId);
    if (!user) return { error: 'User not found' };

    // Determine channel (prefer user's choice, fall back to their default, then first consented)
    const channel = this._resolveChannel(user, preferredChannel);
    if (!channel) {
      return { error: 'No consented channel available for this user' };
    }

    // Build personalized message
    const context = this._buildContext(user, trigger);
    const message = this.templates.render(trigger, context, channel);

    const record = {
      id: uuidv4(),
      userId,
      channel,
      trigger,
      message,
      personalizedFor: user.name,
      segments: user.segments,
      sentAt: new Date().toISOString(),
      status: 'delivered'
    };

    this.analytics.recordMessage(record);
    return record;
  }

  /**
   * Process a user event and auto-trigger relevant messages.
   */
  processEvent(userId, eventType, data) {
    const triggers = [];

    if (eventType === 'cart_abandoned') {
      const result = this.sendMessage(userId, 'cart_abandonment');
      if (!result.error) triggers.push(result);
    }

    if (eventType === 'browse' && data?.product) {
      // After 3+ browses without purchase, send a nudge
      const user = this.userStore.get(userId);
      if (user && user.browseHistory.length >= 3 && user.purchaseHistory.length === 0) {
        const result = this.sendMessage(userId, 'browse_nudge');
        if (!result.error) triggers.push(result);
      }
    }

    if (eventType === 'purchase') {
      const result = this.sendMessage(userId, 'post_purchase');
      if (!result.error) triggers.push(result);
    }

    if (eventType === 'inactivity') {
      const result = this.sendMessage(userId, 'win_back');
      if (!result.error) triggers.push(result);
    }

    return triggers;
  }

  /**
   * Get personalized product recommendations for a user.
   */
  getRecommendations(userId) {
    const user = this.userStore.get(userId);
    if (!user) return [];
    return this.catalog.getRecommendations(user.browseHistory, user.purchaseHistory);
  }

  /**
   * Resolve the best messaging channel respecting user consent.
   */
  _resolveChannel(user, preferred) {
    if (preferred && user.consent[preferred]) return preferred;
    if (user.consent[user.preferredChannel]) return user.preferredChannel;
    const channels = ['whatsapp', 'sms', 'email', 'instagram'];
    return channels.find(ch => user.consent[ch]) || null;
  }

  /**
   * Build context object for message personalization.
   */
  _buildContext(user, trigger) {
    const recommendations = this.catalog.getRecommendations(
      user.browseHistory, user.purchaseHistory, 2
    );
    return {
      userName: user.name,
      cartItems: user.cart,
      cartTotal: user.cart.reduce((sum, item) => sum + item.price, 0).toFixed(2),
      recommendations,
      lastPurchase: user.purchaseHistory[user.purchaseHistory.length - 1] || null,
      browseHistory: user.browseHistory.slice(-3),
      segments: user.segments
    };
  }

  // --- Campaign Management ---

  getCampaigns() {
    return this.campaigns;
  }

  createCampaign(config) {
    const campaign = {
      id: uuidv4(),
      name: config.name || 'Untitled Campaign',
      trigger: config.trigger,
      targetSegments: config.targetSegments || [],
      channel: config.channel || 'all',
      status: 'active',
      createdAt: new Date().toISOString(),
      messagesSent: 0
    };
    this.campaigns.push(campaign);
    return campaign;
  }
}

module.exports = { MessagingEngine };
