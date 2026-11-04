import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import v1Router from './routes/v1/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Standard Healthcheck endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'MobillsPro Core Backend'
  });
});

// API Routes (v1 e retrocompatibilidade /api)
app.use('/api/v1', v1Router);
app.use('/api', v1Router);
app.use('/api', apiRouter);

// Serve Static Frontend if built
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <head><title>MobillsPro Backend</title></head>
          <body style="font-family:sans-serif; background:#0B0F19; color:#fff; padding:2rem; text-align:center;">
            <h1 style="color:#10B981;">MobillsPro Backend Online</h1>
            <p>API disponível em <a style="color:#34D399;" href="/api/health">/api/health</a></p>
            <p>Para visualizar a interface React, execute o Vite ou rode o build do cliente.</p>
          </body>
        </html>
      `);
    }
  });
});

if (process.env.NODE_ENV !== 'test' && !process.argv.some(arg => arg.includes('test'))) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  🚀 MobillsPro Backend rodando na porta ${PORT}`);
    console.log(`  📍 Local: http://localhost:${PORT}`);
    console.log(`  📊 Health check: http://localhost:${PORT}/health`);
    console.log(`  🌆 Alexandre & Amanda - Muriaé/MG`);
    console.log(`=======================================================`);
  });
}

export { app };

