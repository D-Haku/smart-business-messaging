const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHANNEL_LIMITS = { whatsapp: 4096, sms: 160, email: 2000, instagram: 1000 };
const CHANNEL_STYLE = {
  whatsapp: 'Use emojis, casual friendly tone, bullet points for products. Keep it conversational.',
  sms: 'Ultra short, under 160 chars. Include a CTA like "Reply SHOP" or "Tap link". No emojis.',
  email: 'Professional but warm. Use greeting and sign-off. Can be longer and detailed.',
  instagram: 'Trendy, use emojis and hashtags. Mention "link in bio". Keep it visual and fun.'
};

/**
 * Generate a personalized message using GPT based on user context.
 */
async function generateMessage(user, trigger, channel, products) {
  const charLimit = CHANNEL_LIMITS[channel] || 500;
  const style = CHANNEL_STYLE[channel] || 'Friendly and concise.';

  const cartSummary = (user.cart || []).map(i => `${i.name} ($${i.price})`).join(', ');
  const cartTotal = (user.cart || []).reduce((s, i) => s + i.price, 0).toFixed(2);
  const recentBrowse = (user.browseHistory || []).slice(-5).join(', ');
  const purchaseHistory = (user.purchaseHistory || []).map(p => p.name).join(', ');
  const recProducts = (products || []).slice(0, 3).map(p => `${p.name} ($${p.price})`).join(', ');

  const triggerContext = {
    cart_abandonment: `The customer abandoned their cart with: ${cartSummary || 'items'}. Cart total: $${cartTotal}. Offer 10% off with code COMEBACK10.`,
    browse_nudge: `The customer has been browsing: ${recentBrowse}. Suggest these products: ${recProducts}.`,
    post_purchase: `The customer just made a purchase. Thank them and suggest: ${recProducts}.`,
    win_back: `The customer has been inactive. Offer 15% off with code WELCOME15. Suggest: ${recProducts}.`,
    welcome: `New customer just signed up. Welcome them and suggest popular items: ${recProducts}.`
  };

  const prompt = `You are a smart ecommerce messaging assistant. Generate a personalized ${channel} message for a customer.

Customer: ${user.name}
Segments: ${(user.segments || []).join(', ')}
Recent browsing: ${recentBrowse || 'none'}
Past purchases: ${purchaseHistory || 'none'}
Trigger: ${trigger}
Context: ${triggerContext[trigger] || 'General engagement message.'}

Channel rules for ${channel}:
${style}
Max ${charLimit} characters.

Generate ONLY the message text, nothing else.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.8
    });
    const text = response.choices[0]?.message?.content?.trim() || '';
    return text.slice(0, charLimit);
  } catch (err) {
    console.error('AI generation failed:', err.message);
    return null; // Fallback to template
  }
}

/**
 * AI chatbot for customer support conversations.
 */
async function chatResponse(user, userMessage, conversationHistory) {
  const systemPrompt = `You are a helpful ecommerce customer support chatbot for a smart messaging platform. 
You have access to the customer's profile:
- Name: ${user.name}
- Segments: ${(user.segments || []).join(', ')}
- Cart items: ${(user.cart || []).map(i => `${i.name} ($${i.price})`).join(', ') || 'empty'}
- Recent purchases: ${(user.purchaseHistory || []).map(p => `${p.name} on ${p.date}`).join(', ') || 'none'}
- Preferred channel: ${user.preferredChannel}

Be helpful, concise, and friendly. If asked about orders, products, or account details, use the profile info above.
If you don't know something, say so honestly. Keep responses under 200 words.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(conversationHistory || []).slice(-10),
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 250,
      temperature: 0.7
    });
    return response.choices[0]?.message?.content?.trim() || 'Sorry, I could not process that.';
  } catch (err) {
    console.error('Chat AI failed:', err.message);
    return 'Sorry, our AI assistant is temporarily unavailable. Please try again later.';
  }
}

module.exports = { generateMessage, chatResponse };
