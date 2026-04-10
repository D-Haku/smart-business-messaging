import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const COLORS = ['#6c5ce7', '#00cec9', '#ff9f43', '#e1306c', '#54a0ff'];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    api.getOverview().then(setOverview);
    api.getChannelPerformance().then(setChannels);
  }, []);

  if (!overview) return <div className="loading">Loading analytics...</div>;

  const triggerData = Object.entries(overview.byTrigger).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    count: value
  }));

  const channelData = Object.entries(overview.byChannel).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="dashboard">
      <h2 className="dash-title">Analytics Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card accent">
          <div className="stat-value">{overview.totalMessages}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{overview.byStatus?.delivered || 0}</div>
          <div className="stat-label">Delivered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(overview.byChannel).length}</div>
          <div className="stat-label">Active Channels</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(overview.byTrigger).length}</div>
          <div className="stat-label">Trigger Types Used</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Messages by Trigger</h3>
          {triggerData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={triggerData}>
                <XAxis dataKey="name" tick={{ fill: '#8888aa', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8888aa', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#161630', border: '1px solid #2a2a50', borderRadius: 8, color: '#e8e8f0' }} />
                <Bar dataKey="count" fill="#6c5ce7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No data yet. Send some messages first.</p>}
        </div>

        <div className="chart-card">
          <h3>Channel Distribution</h3>
          {channelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {channelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#161630', border: '1px solid #2a2a50', borderRadius: 8, color: '#e8e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="no-data">No data yet.</p>}
        </div>
      </div>

      <div className="channel-table">
        <h3>Channel Performance</h3>
        <table>
          <thead>
            <tr><th>Channel</th><th>Sent</th><th>Delivered</th><th>Open Rate</th><th>Click Rate</th></tr>
          </thead>
          <tbody>
            {channels.map(ch => (
              <tr key={ch.channel}>
                <td className="ch-name">{ch.channel}</td>
                <td>{ch.sent}</td>
                <td>{ch.delivered}</td>
                <td>{ch.openRate}</td>
                <td>{ch.clickRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
