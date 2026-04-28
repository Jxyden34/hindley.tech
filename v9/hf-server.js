// hf-server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const fetch = global.fetch; // Node.js v18+ built-in

const app = express();

// CORS: only allow requests from the configured origin(s)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://hindley.tech')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (e.g. same-origin, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
}));
app.use(express.json());

// Log every incoming request
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.path}`);
  next();
});

// Serve static files from the parent directory (project root)
const path = require('path');
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// Rate limiter for the static-file fallback route (prevents abuse of file-system lookups)
const staticFallbackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

// Fallback to try mapping extensionless URLs to .html files
app.get(/(.*)/, staticFallbackLimiter, (req, res, next) => {
  // If request has no extension and is not an API route
  if (!path.extname(req.path) && !req.path.startsWith('/api')) {
    // Strip any character that is not a safe path component to prevent path traversal
    const safePath = req.path.replace(/[^/a-zA-Z0-9_-]/g, '');
    if (!safePath || safePath !== req.path) {
      return next();
    }
    const candidate = path.resolve(projectRoot, safePath.replace(/^\//, '') + '.html');
    // Ensure the resolved path stays within projectRoot
    const rel = path.relative(projectRoot, candidate);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      return next();
    }
    return res.sendFile(candidate, (err) => {
      if (err) {
        // If .html file doesn't exist, just 404 naturally or pass to next
        next();
      }
    });
  }
  next();
});

const HF_TOKEN = process.env.HF_TOKEN;
// Default to a model supported by the router
const MODEL = process.env.HF_MODEL || 'HuggingFaceH4/zephyr-7b-beta';
const API_URL = 'https://router.huggingface.co/v1/chat/completions';

if (!HF_TOKEN) {
  console.error('Missing HF_TOKEN in environment');
  process.exit(1);
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided.' });
  }

  try {
    const payload = {
      model: MODEL,
      messages: [
        { role: 'user', content: message }
      ],
      max_tokens: 500
    };

    const hfRes = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!hfRes.ok) {
      const errBody = await hfRes.text();
      console.error('HF API error:', hfRes.status, errBody);
      return res
        .status(hfRes.status)
        .json({ error: 'Upstream API request failed.' });
    }

    const data = await hfRes.json();
    console.log('HF raw response:', JSON.stringify(data, null, 2));

    let reply = '';
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      reply = data.choices[0].message.content;
    } else {
      reply = 'Sorry, I couldn’t generate a response.';
    }

    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

const port = process.env.PORT || 3000;
// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`HF proxy listening on http://0.0.0.0:${port}/api/chat`);
});
