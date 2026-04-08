/**
 * Analytics Tracker - tracks message delivery, engagement, and channel performance.
 * Provides measurable impact data for the dashboard.
 */
class AnalyticsTracker {
  constructor() {
    this.messages = [];
  }

  recordMessage(record) {
    this.messages.push(record);
  }

  getMessagesForUser(userId) {
    return this.messages.filter(m => m.userId === userId);
  }

  getOverview() {
    const total = this.messages.length;
    const byTrigger = {};
    const byChannel = {};
    const byStatus = {};

    this.messages.forEach(m => {
      byTrigger[m.trigger] = (byTrigger[m.trigger] || 0) + 1;
      byChannel[m.channel] = (byChannel[m.channel] || 0) + 1;
      byStatus[m.status] = (byStatus[m.status] || 0) + 1;
    });

    return { totalMessages: total, byTrigger, byChannel, byStatus };
  }

  getChannelPerformance() {
    const channels = ['whatsapp', 'sms', 'email', 'instagram'];
    return channels.map(ch => {
      const msgs = this.messages.filter(m => m.channel === ch);
      return {
        channel: ch,
        sent: msgs.length,
        delivered: msgs.filter(m => m.status === 'delivered').length,
        // Simulated engagement rates for demo
        openRate: msgs.length > 0 ? Math.round(60 + Math.random() * 30) + '%' : '0%',
        clickRate: msgs.length > 0 ? Math.round(15 + Math.random() * 25) + '%' : '0%'
      };
    });
  }
}

module.exports = { AnalyticsTracker };
