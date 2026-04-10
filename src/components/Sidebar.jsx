import React from 'react';
import './Sidebar.css';

const CHANNEL_COLORS = {
  whatsapp: '#25D366', sms: '#FF9F43', email: '#54A0FF', instagram: '#E1306C'
};

export default function Sidebar({ users, selectedUser, onSelect }) {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Customers</h3>
      <div className="user-list">
        {users.map(u => (
          <div
            key={u._id}
            className={`user-card ${selectedUser?._id === u._id ? 'active' : ''}`}
            onClick={() => onSelect(u)}
            role="button"
            tabIndex={0}
            aria-label={`Select ${u.name}`}
          >
            <div className="user-avatar">{u.name[0]}</div>
            <div className="user-info">
              <div className="user-name">{u.name}</div>
              <div className="user-meta">
                {u.preferredChannel} · {u.cart?.length || 0} in cart
              </div>
              <div className="user-segments">
                {u.segments?.map(s => <span key={s} className="segment">{s}</span>)}
              </div>
              <div className="consent-dots">
                {['whatsapp', 'sms', 'email', 'instagram'].map(ch => (
                  <span
                    key={ch}
                    className="consent-dot"
                    style={{
                      background: u.consent?.[ch] ? CHANNEL_COLORS[ch] : '#333',
                      opacity: u.consent?.[ch] ? 1 : 0.3
                    }}
                    title={`${ch}: ${u.consent?.[ch] ? 'on' : 'off'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
