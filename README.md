# Smart Business Messaging Platform

Context-aware ecommerce engagement platform that delivers personalized messaging across WhatsApp, SMS, Email, and Instagram — powered by AI.

## Features

- **AI-Powered Messaging** — GPT-generated personalized messages per customer, or smart template fallback
- **AI Chatbot** — Customer support chatbot with context-aware responses using customer profile data
- **Context-Aware Intelligence** — Leverages browsing, purchase, and cart data for hyper-relevant messaging
- **Cross-Platform Messaging** — Unified experience across WhatsApp, SMS, Email, Instagram
- **Consent Management** — Ethical data handling with per-channel opt-in/opt-out and full audit trail
- **Smart Triggers** — Cart abandonment, browse nudges, post-purchase, win-back, welcome messages
- **Analytics Dashboard** — Interactive charts, channel performance, message tracking, engagement metrics
- **Campaign Management** — Create and manage targeted campaigns by segment
- **MongoDB Persistence** — All data persisted to database

## Tech Stack

- **Frontend** — React 18, Vite, Framer Motion, Recharts
- **Backend** — Node.js, Express
- **Database** — MongoDB (Mongoose)
- **AI** — OpenAI GPT-3.5 (optional, works without API key)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (`brew services start mongodb-community`)

### Setup

```bash
git clone https://github.com/D-Haku/smart-business-messaging.git
cd smart-business-messaging
npm install
```

### Configure (optional)

Add your OpenAI API key for AI-powered messages and chatbot:

```bash
# Edit .env file
MONGODB_URI=mongodb://localhost:27017/smart-messaging
PORT=3000
OPENAI_API_KEY=sk-your-key-here   # Optional — works without it
```

### Run

```bash
# Terminal 1 — Backend
npm start

# Terminal 2 — React Frontend
npm run dev:client
```

Open http://localhost:5173 in your browser.

## Project Structure

```
smart-messaging/
├── server/                 # Express backend
│   ├── ai/                 # AI service (OpenAI + simulated fallback)
│   ├── models/             # Mongoose schemas (User, Message, Product, Campaign)
│   ├── routes/             # API routes
│   ├── messaging/          # Message templates
│   ├── db.js               # MongoDB connection
│   └── seed.js             # Demo data seeder
├── src/                    # React frontend
│   ├── components/         # UI components (Sidebar, MessagePanel, Dashboard, ChatBot, ConsentManager)
│   ├── api.js              # API client
│   └── App.jsx             # Main app
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all customers |
| GET | `/api/users/:id` | Get customer profile |
| PUT | `/api/users/:id/consent` | Update consent preferences |
| GET | `/api/users/:id/consent-audit` | Get consent audit trail |
| POST | `/api/messages/send` | Send personalized message |
| GET | `/api/messages/:userId` | Get message history |
| POST | `/api/chat/:userId` | AI chatbot conversation |
| GET | `/api/analytics/overview` | Analytics summary |
| GET | `/api/analytics/channel-performance` | Channel metrics |
| GET/POST | `/api/campaigns` | Campaign management |
| GET | `/api/health` | Health check |
