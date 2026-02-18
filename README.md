# 🌿 WellNest — AI Therapy Chatbot

A minimal, beautiful AI-powered mental wellness companion.

## Project Structure

```
wellnest/
├── index.html      # Welcome/landing page
├── chat.html       # Chat interface
├── server.js       # Express backend (Anthropic API)
├── package.json
└── .env.example
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Start the backend
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 4. Open the frontend
Open `index.html` in your browser, or serve the files with any static server:
```bash
npx serve .
```

The backend runs on `http://localhost:3001` by default.
The frontend chat page calls `http://localhost:3001/chat`.

## API

### POST /chat
Send a conversation and receive a response.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "I've been feeling anxious lately." }
  ]
}
```

**Response:**
```json
{
  "reply": "I hear you — anxiety can feel really overwhelming..."
}
```

### GET /health
Returns service status.

## Notes
- WellNest is a supportive companion, not a replacement for professional care.
- Crisis resources (988 Lifeline) are surfaced automatically when needed.
- No user data is stored; conversations are stateless per session.
