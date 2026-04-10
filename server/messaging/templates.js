const templates = {
  cart_abandonment: {
    whatsapp: (c) => `Hey ${c.userName}! 👋 You left some items in your cart:\n${c.cartItems.map(i => `• ${i.name} - $${i.price}`).join('\n')}\n\nTotal: $${c.cartTotal}\nComplete your order now and get 10% off! 🎉`,
    sms: (c) => `Hi ${c.userName}, you have $${c.cartTotal} in your cart. Complete your order for 10% off! Reply SHOP`,
    email: (c) => `Hi ${c.userName},\n\nYou left ${c.cartItems.length} item(s) worth $${c.cartTotal}.\n\nItems:\n${c.cartItems.map(i => `- ${i.name}: $${i.price}`).join('\n')}\n\nUse code COMEBACK10 for 10% off.`,
    instagram: (c) => `Hey ${c.userName}! 🛒 Don't forget your cart ($${c.cartTotal}). Tap link in bio for 10% off! ✨`
  },
  browse_nudge: {
    whatsapp: (c) => `Hi ${c.userName}! 👀 Picks just for you:\n${c.recommendations.map(r => `• ${r.name} - $${r.price}`).join('\n')}\n\nReady to treat yourself?`,
    sms: (c) => `Hi ${c.userName}, recommended: ${c.recommendations.map(r => r.name).join(', ')}. Reply VIEW`,
    email: (c) => `Hi ${c.userName},\n\nCurated for you:\n${c.recommendations.map(r => `- ${r.name}: $${r.price}`).join('\n')}`,
    instagram: (c) => `${c.userName}, picked for you! 🎯\n${c.recommendations.map(r => `✨ ${r.name}`).join('\n')}\nLink in bio!`
  },
  post_purchase: {
    whatsapp: (c) => `Thank you ${c.userName}! 🎉 Order confirmed.\n\nYou might like:\n${c.recommendations.map(r => `• ${r.name} - $${r.price}`).join('\n')}`,
    sms: (c) => `Thanks ${c.userName}! Order confirmed. Try: ${c.recommendations.map(r => r.name).join(', ')}`,
    email: (c) => `Hi ${c.userName},\n\nThank you for your purchase!\n\nYou might enjoy:\n${c.recommendations.map(r => `- ${r.name}: $${r.price}`).join('\n')}`,
    instagram: (c) => `Thanks ${c.userName}! 🙌\nOthers love:\n${c.recommendations.map(r => `💫 ${r.name}`).join('\n')}`
  },
  win_back: {
    whatsapp: (c) => `Hey ${c.userName}, we miss you! 💛\n${c.recommendations.map(r => `• ${r.name} - $${r.price}`).join('\n')}\n\nUse code WELCOME15 for 15% off!`,
    sms: (c) => `Hi ${c.userName}, it's been a while! 15% off with WELCOME15. Reply SHOP`,
    email: (c) => `Hi ${c.userName},\n\nNew arrivals:\n${c.recommendations.map(r => `- ${r.name}: $${r.price}`).join('\n')}\n\nUse WELCOME15 for 15% off!`,
    instagram: (c) => `We miss you ${c.userName}! 💫 New arrivals + 15% off with WELCOME15. Link in bio! 🛍️`
  },
  welcome: {
    whatsapp: (c) => `Welcome ${c.userName}! 🎉 Popular picks:\n${c.recommendations.map(r => `• ${r.name} - $${r.price}`).join('\n')}`,
    sms: (c) => `Welcome ${c.userName}! Reply DEALS for top picks.`,
    email: (c) => `Welcome ${c.userName}!\n\nExplore:\n${c.recommendations.map(r => `- ${r.name}: $${r.price}`).join('\n')}`,
    instagram: (c) => `Welcome ${c.userName}! 🎊 Check top picks in link in bio ✨`
  }
};

function renderTemplate(trigger, context, channel) {
  const t = templates[trigger];
  if (!t) return `Hi ${context.userName}, thanks for being a valued customer!`;
  return (t[channel] || t.whatsapp)(context);
}

module.exports = { renderTemplate };
