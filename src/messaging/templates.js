/**
 * Message Templates - generates personalized, channel-appropriate messages.
 * Supports cross-platform formatting (WhatsApp rich text, SMS plain text, etc.)
 */
class MessageTemplates {
  constructor() {
    this.templates = {
      cart_abandonment: {
        whatsapp: (ctx) => `Hey ${ctx.userName}! 👋 You left some items in your cart:\n${ctx.cartItems.map(i => `• ${i.name} - $${i.price}`).join('\n')}\n\nTotal: $${ctx.cartTotal}\n\nComplete your order now and get 10% off! 🎉`,
        sms: (ctx) => `Hi ${ctx.userName}, you have $${ctx.cartTotal} in your cart. Complete your order for 10% off! Reply SHOP to continue.`,
        email: (ctx) => `Hi ${ctx.userName},\n\nYou left ${ctx.cartItems.length} item(s) in your cart worth $${ctx.cartTotal}.\n\nItems:\n${ctx.cartItems.map(i => `- ${i.name}: $${i.price}`).join('\n')}\n\nUse code COMEBACK10 for 10% off.\n\nHappy shopping!`,
        instagram: (ctx) => `Hey ${ctx.userName}! 🛒 Don't forget about your cart ($${ctx.cartTotal}). Tap the link in bio to complete your order with 10% off! ✨`
      },
      browse_nudge: {
        whatsapp: (ctx) => `Hi ${ctx.userName}! 👀 We noticed you've been checking out some great items. Here are picks just for you:\n${ctx.recommendations.map(r => `• ${r.name} - $${r.price}`).join('\n')}\n\nReady to treat yourself?`,
        sms: (ctx) => `Hi ${ctx.userName}, based on your browsing: ${ctx.recommendations.map(r => r.name).join(', ')}. Check them out! Reply VIEW for details.`,
        email: (ctx) => `Hi ${ctx.userName},\n\nWe curated these recommendations based on your interests:\n${ctx.recommendations.map(r => `- ${r.name}: $${r.price}`).join('\n')}\n\nDiscover more at our store!`,
        instagram: (ctx) => `${ctx.userName}, we picked these just for you! 🎯\n${ctx.recommendations.map(r => `✨ ${r.name}`).join('\n')}\nLink in bio to shop!`
      },
      post_purchase: {
        whatsapp: (ctx) => `Thank you ${ctx.userName}! 🎉 Your order is confirmed.\n\nYou might also like:\n${ctx.recommendations.map(r => `• ${r.name} - $${r.price}`).join('\n')}\n\nThanks for shopping with us! 💙`,
        sms: (ctx) => `Thanks ${ctx.userName}! Order confirmed. You might like: ${ctx.recommendations.map(r => r.name).join(', ')}. Reply RECS for more.`,
        email: (ctx) => `Hi ${ctx.userName},\n\nThank you for your purchase!\n\nBased on your order, you might enjoy:\n${ctx.recommendations.map(r => `- ${r.name}: $${r.price}`).join('\n')}\n\nSee you again soon!`,
        instagram: (ctx) => `Thanks for your order ${ctx.userName}! 🙌\nCheck out what other customers love:\n${ctx.recommendations.map(r => `💫 ${r.name}`).join('\n')}`
      },
      win_back: {
        whatsapp: (ctx) => `Hey ${ctx.userName}, we miss you! 💛 Come back and check out what's new:\n${ctx.recommendations.map(r => `• ${r.name} - $${r.price}`).join('\n')}\n\nUse code WELCOME15 for 15% off!`,
        sms: (ctx) => `Hi ${ctx.userName}, it's been a while! Here's 15% off with code WELCOME15. Reply SHOP to browse.`,
        email: (ctx) => `Hi ${ctx.userName},\n\nWe haven't seen you in a while and wanted to share some new arrivals:\n${ctx.recommendations.map(r => `- ${r.name}: $${r.price}`).join('\n')}\n\nUse code WELCOME15 for 15% off your next order!`,
        instagram: (ctx) => `We miss you ${ctx.userName}! 💫 New arrivals are here + 15% off with code WELCOME15. Link in bio! 🛍️`
      },
      welcome: {
        whatsapp: (ctx) => `Welcome ${ctx.userName}! 🎉 Thanks for joining us. Here are some popular picks to get you started:\n${ctx.recommendations.map(r => `• ${r.name} - $${r.price}`).join('\n')}`,
        sms: (ctx) => `Welcome ${ctx.userName}! Thanks for signing up. Reply DEALS to see today's top picks.`,
        email: (ctx) => `Welcome ${ctx.userName}!\n\nWe're excited to have you. Here are some items to explore:\n${ctx.recommendations.map(r => `- ${r.name}: $${r.price}`).join('\n')}\n\nHappy shopping!`,
        instagram: (ctx) => `Welcome to the fam ${ctx.userName}! 🎊 Check out our top picks in the link in bio ✨`
      }
    };
  }

  render(trigger, context, channel) {
    const triggerTemplates = this.templates[trigger];
    if (!triggerTemplates) {
      return `Hi ${context.userName}, thanks for being a valued customer!`;
    }
    const fn = triggerTemplates[channel] || triggerTemplates.whatsapp;
    return fn(context);
  }
}

module.exports = { MessageTemplates };
