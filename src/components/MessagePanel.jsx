import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import ConsentManager from './ConsentManager';
import './MessagePanel.css';

const TRIGGERS = [
  { id: 'cart_abandonment', icon: '🛒', label: 'Cart Abandonment', desc: 'Remind about items left in cart' },
  { id: 'browse_nudge', icon: '👀', label: 'Browse Nudge', desc: 'Personalized recommendations' },
  { id: 'post_purchase', icon: '🎉', label: 'Post Purchase', desc: 'Thank you + cross-sell' },
  { id: 'win_back', icon: '💛', label: 'Win Back', desc: 'Re-engage inactive customers' },
  { id: 'welcome', icon: '👋', label: 'Welcome', desc: 'Onboard new customers' }
];

const CHANNELS = ['whatsapp', 'sms', 'email', 'instagram'];
const CHANNEL_ICONS = { whatsapp: '💬', sms: '📱', email: '📧', instagram: '📸' };

export default function MessagePanel({ user, onSend }) {
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(null);
  const [tab, setTab] = useState('send');

  useEffect(() => {
    if (user) {
      setChannel(user.preferredChannel);
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;
    const msgs = await api.getMessages(user._id);
    setMessages(msgs);
  };

  const handleSend = async (trigger) => {
    setSending(trigger);
    await api.sendMessage(user._id, trigger, channel);
    await loadMessages();
    onSend?.();
    setSending(null);
  };

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💬</div>
        <h2>Select a customer</h2>
        <p>Choose a customer from the sidebar to start sending personalized messages</p>
      </div>
    );
  }

  return (
    <div className="message-panel">
      <div className="panel-header">
        <div className="panel-user">
          <div className="panel-avatar">{user.name[0]}</div>
          <div>
            <h2 className="panel-name">{user.name}</h2>
            <p className="panel-meta">{user.segments?.join(' · ')} · Last active {new Date(user.lastActive).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="panel-tabs">
          <button className={`tab-btn ${tab === 'send' ? 'active' : ''}`} onClick={() => setTab('send')}>Send</button>
          <button className={`tab-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History ({messages.length})</button>
          <button className={`tab-btn ${tab === 'consent' ? 'active' : ''}`} onClick={() => setTab('consent')}>Consent</button>
        </div>
      </div>

      {tab === 'send' && (
        <div className="send-section">
          <div className="channel-bar">
            <span className="channel-label">Channel:</span>
            {CHANNELS.map(ch => (
              <button
                key={ch}
                className={`channel-chip ${channel === ch ? 'active' : ''} ${!user.consent?.[ch] ? 'disabled' : ''}`}
                onClick={() => user.consent?.[ch] && setChannel(ch)}
                disabled={!user.consent?.[ch]}
              >
                {CHANNEL_ICONS[ch]} {ch}
              </button>
            ))}
          </div>

          <div className="trigger-grid">
            {TRIGGERS.map(t => (
              <motion.button
                key={t.id}
                className="trigger-card"
                onClick={() => handleSend(t.id)}
                disabled={sending !== null}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="trigger-icon">{t.icon}</div>
                <div className="trigger-label">{t.label}</div>
                <div className="trigger-desc">{t.desc}</div>
                {sending === t.id && <div className="sending-indicator">Sending...</div>}
              </motion.button>
            ))}
          </div>

          {user.cart?.length > 0 && (
            <div className="cart-preview">
              <h4>🛒 Cart ({user.cart.length} items)</h4>
              {user.cart.map((item, i) => (
                <div key={i} className="cart-row">
                  <span>{item.name}</span>
                  <span className="cart-price">${item.price}</span>
                </div>
              ))}
              <div className="cart-row cart-total">
                <span>Total</span>
                <span className="cart-price">${user.cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="history-section">
          <AnimatePresence>
            {messages.length === 0 ? (
              <p className="no-messages">No messages sent yet</p>
            ) : (
              messages.map((m, i) => (
                <motion.div
                  key={m._id || i}
                  className="message-bubble"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="bubble-header">
                    <span className={`channel-tag ${m.channel}`}>{CHANNEL_ICONS[m.channel]} {m.channel}</span>
                    <span className="trigger-tag">{m.trigger?.replace(/_/g, ' ')}</span>
                    <span className="msg-status">{m.status}</span>
                  </div>
                  <div className="bubble-content">{m.message}</div>
                  <div className="bubble-time">{new Date(m.createdAt).toLocaleString()}</div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {tab === 'consent' && <ConsentManager user={user} />}
    </div>
  );
}
