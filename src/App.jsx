import React, { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MessagePanel from './components/MessagePanel';
import './App.css';

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [overview, setOverview] = useState(null);
  const [view, setView] = useState('messages');

  useEffect(() => {
    api.getUsers().then(setUsers);
    api.getOverview().then(setOverview);
  }, []);

  const refreshOverview = () => api.getOverview().then(setOverview);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">💬</span>
          <div>
            <h1 className="header-title">Smart Messaging</h1>
            <p className="header-sub">Ecommerce Engagement Platform</p>
          </div>
        </div>
        <nav className="header-nav">
          <button className={`nav-btn ${view === 'messages' ? 'active' : ''}`} onClick={() => setView('messages')}>Messages</button>
          <button className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>Dashboard</button>
        </nav>
        {overview && (
          <div className="header-stats">
            <div className="stat-pill"><span className="stat-num">{overview.totalMessages}</span> messages</div>
            <div className="stat-pill"><span className="stat-num">{users.length}</span> customers</div>
          </div>
        )}
      </header>
      <div className="app-body">
        <Sidebar users={users} selectedUser={selectedUser} onSelect={setSelectedUser} />
        <main className="main-content">
          {view === 'messages' ? (
            <MessagePanel user={selectedUser} onSend={refreshOverview} />
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </div>
  );
}
