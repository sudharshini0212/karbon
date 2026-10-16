import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './backend/routes/api.ts';
import { connectDB, getMongoConnectionState } from './backend/config/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // Dev server must strictly run on port 3000 per AI Studio environment constraints
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Connect to MongoDB Atlas (dbName: karbonDB)
  await connectDB();

  // Middleware
  app.use(express.json());

  // Mount KARBON REST API routes
  app.use('/api', apiRouter);

  // Health check endpoint reporting real MongoDB status
  app.get('/api/health', (_req, res) => {
    const mongo = getMongoConnectionState();
    res.json({
      status: mongo.isConnected ? 'operational' : 'database_disconnected',
      app: 'KARBON Coal Mine Carbon Management Platform',
      version: '1.0.0',
      database: mongo.database,
      mongodb: {
        connected: mongo.isConnected,
        status: mongo.state,
        host: mongo.host,
        database: mongo.database,
        activeCollections: mongo.activeCollections,
        lastError: mongo.lastError,
      },
      timestamp: new Date().toISOString(),
    });
  });

  if (!isProduction) {
    // Development mode: attach Vite middleware (HMR is disabled in AI Studio preview environment)
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    console.log('[KARBON] Vite middleware mounted for development.');
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KARBON] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[KARBON] Failed to start server:', err);
  process.exit(1);
});
