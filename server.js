const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve frontend from /public if desired

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are WellNest, a compassionate AI therapy companion. Your role is to provide emotional support, active listening, and evidence-based coping strategies.

Core principles:
- Listen with deep empathy and reflect back what the user shares without judgment
- Use techniques from CBT, mindfulness, and acceptance-based therapies (ACT) naturally, never robotically
- Ask gentle, open-ended questions to help users explore their feelings
- Validate emotions before offering perspective or techniques
- Keep responses warm, grounded, and human — not clinical or stiff
- Never diagnose or prescribe. If someone is in crisis, gently direct them to professional help or a crisis line
- Be honest that you are an AI, but assure them this space is still safe and real

Tone: calm, unhurried, warm. Like talking to a caring friend who happens to know a lot about mental well-being.

Response length: conversational — typically 2–4 sentences. Never lecture. Prioritize questions over advice unless asked.

IMPORTANT: You are not a replacement for professional mental health care. If someone expresses thoughts of self-harm or suicide, immediately and warmly provide crisis resources (e.g., 988 Suicide & Crisis Lifeline in the US).`;

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  // Validate message structure
  const validMessages = messages.filter(m =>
    m.role && (m.role === 'user' || m.role === 'assistant') && m.content
  );

  if (validMessages.length === 0) {
    return res.status(400).json({ error: 'No valid messages provided.' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: validMessages,
    });

    const reply = response.content[0]?.text || '';
    res.json({ reply });

  } catch (err) {
    console.error('Anthropic API error:', err.message);

    if (err.status === 401) {
      return res.status(500).json({ error: 'API key invalid. Check your ANTHROPIC_API_KEY.' });
    }
    if (err.status === 529 || err.status === 503) {
      return res.status(503).json({ error: 'Service temporarily unavailable. Please try again.' });
    }

    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'WellNest API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🌿 WellNest backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Chat API:     POST http://localhost:${PORT}/chat\n`);
});
