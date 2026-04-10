const BASE = '/api';

async function fetchJSON(url, opts) {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  return res.json();
}

export const api = {
  getUsers: () => fetchJSON('/users'),
  getUser: (id) => fetchJSON(`/users/${id}`),
  updateConsent: (id, consent) => fetchJSON(`/users/${id}/consent`, { method: 'PUT', body: JSON.stringify(consent) }),
  getConsentAudit: (id) => fetchJSON(`/users/${id}/consent-audit`),
  sendMessage: (userId, trigger, channel) => fetchJSON('/messages/send', { method: 'POST', body: JSON.stringify({ userId, trigger, channel }) }),
  getMessages: (userId) => fetchJSON(`/messages/${userId}`),
  getOverview: () => fetchJSON('/analytics/overview'),
  getChannelPerformance: () => fetchJSON('/analytics/channel-performance'),
  getCampaigns: () => fetchJSON('/campaigns'),
  createCampaign: (data) => fetchJSON('/campaigns', { method: 'POST', body: JSON.stringify(data) })
};
