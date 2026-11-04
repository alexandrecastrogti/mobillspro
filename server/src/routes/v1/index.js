import { Router } from 'express';
import authRoutes from './authRoutes.js';
import financeRoutes from './financeRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

// Healthcheck v1
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    api: 'MobillsPro REST API',
    version: 'v1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    location: 'Muriaé/MG',
    couple: 'Alexandre & Amanda'
  });
});

// Sub-rotas
router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/', financeRoutes);

export default router;

