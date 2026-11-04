import { Router } from 'express';
import {
  auditCardTransactions,
  explainMonthlyVariations,
  suggestBudgetOptimizations
} from '../../utils/geminiAi.js';
import { exactSeedData } from '../../seedDataExact.js';

const router = Router();

/**
 * POST /api/v1/ai/audit
 * Audita lançamentos e classifica anomalias
 */
router.post('/audit', async (req, res) => {
  try {
    const transactions = req.body?.transactions || exactSeedData.excludedTransactions;
    const result = await auditCardTransactions(transactions);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar auditoria IA', details: err.message });
  }
});

/**
 * POST /api/v1/ai/explain
 * Explica variações do mês e pico em supermercados
 */
router.post('/explain', async (req, res) => {
  try {
    const { month = '2026-10', data = {} } = req.body;
    const result = await explainMonthlyVariations(month, data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar explicação IA', details: err.message });
  }
});

/**
 * POST /api/v1/ai/suggest
 * Sugere cortes de despesas sem perda de qualidade de vida
 */
router.post('/suggest', async (req, res) => {
  try {
    const result = await suggestBudgetOptimizations(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar sugestões IA', details: err.message });
  }
});

export default router;

