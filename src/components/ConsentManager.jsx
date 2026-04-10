import React, { useState, useEffect } from 'react';
import { api } from '../api';
import './ConsentManager.css';

const CHANNELS = ['whatsapp', 'sms', 'email', 'instagram'];

export default function ConsentManager({ user }) {
  const [consent, setConsent] = useState({});
  const [audit, setAudit] = useState([]);

  useEffect(() => {
    if (user) {
      setConsent({ ...user.consent });
      api.getConsentAudit(user._id).then(setAudit);
    }
  }, [user]);

  const toggle = async (channel) => {
    const newVal = !consent[channel];
    setConsent(prev => ({ ...prev, [channel]: newVal }));
    await api.updateConsent(user._id, { [channel]: newVal });
    const updatedAudit = await api.getConsentAudit(user._id);
    setAudit(updatedAudit);
  };

  return (
    <div className="consent-manager">
      <h3 className="consent-title">🔒 Consent Preferences</h3>
      <p className="consent-desc">Manage which channels this customer has opted into for messaging.</p>

      <div className="consent-grid">
        {CHANNELS.map(ch => (
          <div key={ch} className={`consent-card ${consent[ch] ? 'on' : 'off'}`}>
            <div className="consent-channel">{ch}</div>
            <label className="toggle" aria-label={`Toggle ${ch} consent`}>
              <input type="checkbox" checked={!!consent[ch]} onChange={() => toggle(ch)} />
              <span className="toggle-slider" />
            </label>
            <div className="consent-status">{consent[ch] ? 'Opted In' : 'Opted Out'}</div>
          </div>
        ))}
      </div>

      <h4 className="audit-title">📋 Audit Trail</h4>
      <div className="audit-list">
        {audit.length === 0 ? (
          <p className="no-audit">No audit entries yet</p>
        ) : (
          audit.slice(-20).reverse().map((entry, i) => (
            <div key={i} className={`audit-entry ${entry.action?.toLowerCase()}`}>
              <span className="audit-action">{entry.action}</span>
              <span className="audit-channel">{entry.channel || 'all'}</span>
              <span className="audit-reason">{entry.reason}</span>
              <span className="audit-time">{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
