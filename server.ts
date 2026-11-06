import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for Ask AI (Gemini 3.8 Flash)
  app.post('/api/ask-ai', async (req, res) => {
    try {
      const { message, history, studentClass, subject } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'AI service is currently not configured with an API key. Please check your GEMINI_API_KEY.',
          missingKey: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are AURIX AI, a patient, encouraging, and friendly AI tutor for school students in Classes 6 to 12.
Current student context: ${studentClass || 'Class 10'}, Subject: ${subject || 'General Studies'}.
Guidelines:
1. Explain concepts in clear, simple English that a school student can easily understand.
2. Break down math and science questions step-by-step with formulas and clear logic.
3. Be positive, warm, and helpful. Praise effort and motivate the student.
4. If asked "Why is my answer wrong?", explain the underlying reason without making them feel bad.
5. Provide helpful examples and quick practice hints when useful.
6. Use clear headings, bullet points, and numbered lists.`;

      // Build multi-turn context
      const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'ai') {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      // Attempt call with retry and fallback on temporary high demand (503)
      let response;
      const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
      let lastError: any = null;

      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
            },
          });
          if (response?.text) break;
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${model} request encountered issue:`, err.message || err);
          // Small pause before trying fallback
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }

      if (!response && lastError) {
        throw lastError;
      }

      const replyText = response?.text || 'I could not generate an answer right now. Please try asking again.';
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Error in /api/ask-ai:', err);

      let cleanMsg = 'Failed to process AI request. Please try again.';
      if (typeof err?.message === 'string') {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error?.message) {
            cleanMsg = parsed.error.message;
          }
        } catch {
          cleanMsg = err.message;
        }
      }

      if (cleanMsg.includes('high demand') || cleanMsg.includes('503')) {
        cleanMsg = 'The AI tutor is currently experiencing high demand. Please try asking again in a moment.';
      }

      return res.status(500).json({
        error: cleanMsg,
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Development vs production handling
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURIX server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
