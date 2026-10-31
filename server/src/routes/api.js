import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'MobillsPro',
    city: 'Muriaé/MG',
    database: db.isPostgres() ? 'PostgreSQL' : 'JSON Persistent Engine',
    timestamp: new Date().toISOString()
  });
});

// Profile / Configurations
router.get('/profile', (req, res) => {
  res.json(db.getProfile());
});

router.put('/profile', (req, res) => {
  const updated = db.updateProfile(req.body);
  res.json(updated);
});

// Dashboard Summary & Real-time Magic Number
router.get('/dashboard/summary', (req, res) => {
  const month = req.query.month || '2026-10';
  const period = req.query.period || 'CURRENT_MONTH';
  const excludeAtypical = req.query.excludeAtypical !== 'false';
  const useNewApartment = req.query.useNewApartment === 'true';

  const balance = db.calculateMagicNumber(month, excludeAtypical, useNewApartment, period);
  const profile = db.getProfile();
  const investments = db.getInvestments();
  const cardsAudit = db.getCreditCardsAudit();
  const pixList = db.getPixTransactions(month);
  const cashflow = db.getCashFlowHistory();
  const networthHistory = db.getNetWorthHistory();
  const budgets = db.getBudgets();

  const totalNetWorthBRL = investments.reduce((acc, curr) => acc + Number(curr.balanceBRL), 0);
  const nomadAsset = investments.find(i => i.assetType === 'USD_OFFSHORE');
  const pixAlerts = pixList.filter(p => p.isAlert);

  res.json({
    profile,
    balance,
    cardsAuditSummary: cardsAudit.supermarketBenchmark,
    investmentsSummary: {
      totalNetWorthBRL,
      nomadUSD: nomadAsset ? nomadAsset.balanceOriginal : 0,
      nomadBRL: nomadAsset ? nomadAsset.balanceBRL : 0,
      exchangeRateUSD: nomadAsset ? nomadAsset.exchangeRate : 5.75,
      selicRate: "13.75% a.a."
    },
    pixAlertsCount: pixAlerts.length,
    recentPixAlerts: pixAlerts.slice(0, 3),
    cashflow,
    networthHistory,
    budgetsOverview: {
      totalTarget: budgets.reduce((a, b) => a + b.targetAmount, 0),
      totalSpent: budgets.reduce((a, b) => a + b.spentAmount, 0),
      alertsCount: budgets.filter(b => b.status === 'ALERT').length
    }
  });
});

// Budgets (Metas por Centro de Custo)
router.get('/budgets', (req, res) => {
  res.json(db.getBudgets());
});

router.put('/budgets/:id', (req, res) => {
  const updated = db.updateBudget(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Meta não encontrada" });
  res.json(updated);
});

// Credit Cards Detailed (Invoices, Timeline, Limits)
router.get('/cards/detailed', (req, res) => {
  res.json(db.getCreditCardsDetailed());
});

router.get('/cards/audit', (req, res) => {
  res.json(db.getCreditCardsAudit());
});

router.get('/cards/transactions', (req, res) => {
  const month = req.query.month || '2026-10';
  const cardId = req.query.cardId || null;
  res.json(db.getCardTransactions(month, cardId));
});

router.patch('/cards/transactions/:id/toggle-atypical', (req, res) => {
  const updated = db.toggleAtypicalTransaction(req.params.id);
  if (!updated) return res.status(404).json({ error: "Transação de cartão não encontrada" });
  res.json(updated);
});

// iPhone 17 Pro Max Push / SMS Capture Engine & Apple Shortcuts Webhook
router.get('/sms/history', (req, res) => {
  res.json(db.getSmsPushHistory());
});

router.post('/sms/parse', (req, res) => {
  const { text, source } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Texto da notificação / SMS não fornecido" });
  }
  const result = db.parseAndRecordSmsPush(text, source || "iPhone 17 Pro Max Simulator");
  res.status(201).json(result);
});

// Webhook endpoint specifically designed for Apple Shortcuts (iOS Shortcuts)
router.post('/shortcuts/webhook', (req, res) => {
  const rawText = req.body.message || req.body.text || req.body.body || JSON.stringify(req.body);
  const result = db.parseAndRecordSmsPush(rawText, "Apple Shortcuts (iPhone 17 Pro Max)");
  res.status(201).json({
    status: "SUCCESS",
    message: "Capturado e sincronizado no MobillsPro",
    capture: result
  });
});

// Analytics (Cashflow & Net Worth)
router.get('/analytics/cashflow', (req, res) => {
  res.json(db.getCashFlowHistory());
});

router.get('/analytics/networth', (req, res) => {
  res.json(db.getNetWorthHistory());
});

// Incomes
router.get('/incomes', (req, res) => {
  const month = req.query.month || '2026-10';
  res.json(db.getIncomes(month));
});

// Wellhub
router.get('/wellhub', (req, res) => {
  const month = req.query.month || '2026-10';
  const reimbursements = db.getWellhubReimbursements(month);
  const total = reimbursements.reduce((acc, curr) => acc + Number(curr.amount), 0);
  res.json({ reimbursements, total });
});

// Fixed Expenses
router.get('/fixed-expenses', (req, res) => {
  const month = req.query.month || '2026-10';
  const expenses = db.getFixedExpenses(month);
  res.json({ expenses });
});

router.patch('/fixed-expenses/:id/toggle', (req, res) => {
  const updated = db.toggleFixedExpense(req.params.id);
  if (!updated) return res.status(404).json({ error: "Despesa fixa não encontrada" });
  res.json(updated);
});

// Pix Transactions
router.get('/pix', (req, res) => {
  const month = req.query.month || '2026-10';
  const transactions = db.getPixTransactions(month);
  const totalIn = transactions.filter(t => t.direction === 'ENTRADA').reduce((a, b) => a + Number(b.amount), 0);
  const totalOut = transactions.filter(t => t.direction === 'SAIDA').reduce((a, b) => a + Number(b.amount), 0);
  const alerts = transactions.filter(t => t.isAlert);
  res.json({ transactions, summary: { totalIn, totalOut, netFlow: totalIn - totalOut, alertsCount: alerts.length, alerts } });
});

// Housing Simulation
router.get('/housing/simulation', (req, res) => {
  res.json(db.getHousingSimulation());
});

router.put('/housing/simulation', (req, res) => {
  const updated = db.updateHousingSimulation(req.body);
  res.json(updated);
});

// Investments
router.get('/investments', (req, res) => {
  const list = db.getInvestments();
  const totalNetWorthBRL = list.reduce((acc, curr) => acc + Number(curr.balanceBRL), 0);
  const totalOffshoreUSD = list.filter(i => i.assetType === 'USD_OFFSHORE').reduce((a, b) => a + Number(b.balanceOriginal), 0);
  const totalFixedIncomeBRL = list.filter(i => i.assetType === 'RENDA_FIXA_POS').reduce((a, b) => a + Number(b.balanceBRL), 0);
  const totalRealEstateBRL = list.filter(i => i.assetType === 'PATRIMONIO_IMOVEL').reduce((a, b) => a + Number(b.balanceBRL), 0);
  res.json({ investments: list, summary: { totalNetWorthBRL, totalOffshoreUSD, totalFixedIncomeBRL, totalRealEstateBRL } });
});

router.put('/investments/:id', (req, res) => {
  const updated = db.updateInvestment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Investimento não encontrado" });
  res.json(updated);
});

// Reset
router.post('/system/reset', (req, res) => {
  const result = db.resetDatabase();
  res.json(result);
});

export default router;
