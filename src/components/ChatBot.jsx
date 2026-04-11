import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatBot.css';

export default function ChatBot({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Hi ${user?.name || 'there'}! I'm your AI shopping assistant. Ask me about your orders, cart, product recommendations, or anything else!`
    }]);
  }, [user?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await api.chat(user._id, userMsg.content, history);
      setMessages(prev => [...prev, reply]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Make sure your OpenAI API key is configured.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-messages">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`chat-msg ${msg.role}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="msg-avatar">{msg.role === 'user' ? user?.name?.[0] || '?' : '🤖'}</div>
              <div className="msg-bubble">{msg.content}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="chat-msg assistant">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-bar">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about orders, products, recommendations..."
          className="chat-input"
          aria-label="Chat message input"
        />
        <button onClick={send} disabled={loading || !input.trim()} className="chat-send">
          Send
        </button>
      </div>
    </div>
  );
}
