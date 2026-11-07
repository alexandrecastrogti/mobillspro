import express from 'express';
import { db } from '../db.js';
import { calculateBudget503020 } from '../financeEngine.js';

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

router.put('/profile/balance', (req, res) => {
  const { currentAccountBalance } = req.body;
  const num = Number(currentAccountBalance);
  if (isNaN(num)) return res.status(400).json({ error: "Saldo inválido" });
  const updated = db.updateProfile({ currentAccountBalance: num });
  res.json({ success: true, profile: updated });
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

  const budget503020 = calculateBudget503020(
    balance.inflow,
    balance.outflowFixed,
    balance.outflowCards + (balance.outflowPix || 0),
    2000.00
  );

  res.json({
    profile,
    balance,
    budget503020,
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

// Budgets (Metas por Centro de Custo) - CRUD Completo
router.get('/budgets', (req, res) => {
  res.json(db.getBudgets());
});

router.post('/budgets', (req, res) => {
  const created = db.addBudget(req.body);
  res.status(201).json(created);
});

router.put('/budgets/:id', (req, res) => {
  const updated = db.updateBudget(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Meta não encontrada" });
  res.json(updated);
});

router.delete('/budgets/:id', (req, res) => {
  const deleted = db.deleteBudget(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Meta não encontrada" });
  res.json({ success: true });
});

// Credit Cards & Transactions - CRUD Completo
router.get('/cards/detailed', (req, res) => {
  res.json(db.getCreditCardsDetailed());
});

router.put('/cards/:id', (req, res) => {
  const updated = db.updateCreditCard(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Cartão não encontrado" });
  res.json(updated);
});

router.get('/cards/audit', (req, res) => {
  res.json(db.getCreditCardsAudit());
});

router.get('/cards/transactions', (req, res) => {
  const month = req.query.month || '2026-10';
  const cardId = req.query.cardId || null;
  res.json(db.getCardTransactions(month, cardId));
});

router.post('/cards/transactions', (req, res) => {
  const created = db.addCardTransaction(req.body);
  res.status(201).json(created);
});

router.delete('/cards/transactions/:id', (req, res) => {
  const deleted = db.deleteCardTransaction(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Transação não encontrada" });
  res.json({ success: true });
});

router.patch('/cards/transactions/:id/toggle-atypical', (req, res) => {
  const updated = db.toggleAtypicalTransaction(req.params.id);
  if (!updated) return res.status(404).json({ error: "Transação de cartão não encontrada" });
  res.json(updated);
});

// Importador de Extratos Bancários (OFX e CSV)
router.post('/cards/import-statement', (req, res) => {
  const { fileContent, fileName, targetCardId } = req.body;
  if (!fileContent) {
    return res.status(400).json({ error: "Conteúdo do arquivo de extrato não fornecido" });
  }
  const result = db.importStatementTransactions(fileContent, fileName, targetCardId);
  res.status(201).json(result);
});

// Relatório de Acerto 50/50 do Casal (Quem deve para quem?)
router.get('/reconciliation/settlement', (req, res) => {
  const month = req.query.month || '2026-10';
  res.json(db.calculateCoupleSettlement(month));
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

// Incomes - CRUD Completo
router.get('/incomes', (req, res) => {
  const month = req.query.month || '2026-10';
  res.json(db.getIncomes(month));
});

router.post('/incomes', (req, res) => {
  const created = db.addIncome(req.body);
  res.status(201).json(created);
});

router.delete('/incomes/:id', (req, res) => {
  const deleted = db.deleteIncome(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Receita não encontrada" });
  res.json({ success: true });
});

// Wellhub - CRUD Completo
router.get('/wellhub', (req, res) => {
  const month = req.query.month || '2026-10';
  const reimbursements = db.getWellhubReimbursements(month);
  const total = reimbursements.reduce((acc, curr) => acc + Number(curr.amount), 0);
  res.json({ reimbursements, total });
});

router.post('/wellhub', (req, res) => {
  const created = db.addWellhubReimbursement(req.body);
  res.status(201).json(created);
});

router.delete('/wellhub/:id', (req, res) => {
  const deleted = db.deleteWellhubReimbursement(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Reembolso não encontrado" });
  res.json({ success: true });
});

// Fixed Expenses - CRUD Completo
router.get('/fixed-expenses', (req, res) => {
  const month = req.query.month || '2026-10';
  const expenses = db.getFixedExpenses(month);
  res.json({ expenses });
});

router.post('/fixed-expenses', (req, res) => {
  const created = db.addFixedExpense(req.body);
  res.status(201).json(created);
});

router.put('/fixed-expenses/:id', (req, res) => {
  const updated = db.updateFixedExpense(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Despesa fixa não encontrada" });
  res.json(updated);
});

router.delete('/fixed-expenses/:id', (req, res) => {
  const deleted = db.deleteFixedExpense(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Despesa fixa não encontrada" });
  res.json({ success: true });
});

router.patch('/fixed-expenses/:id/toggle', (req, res) => {
  const updated = db.toggleFixedExpense(req.params.id);
  if (!updated) return res.status(404).json({ error: "Despesa fixa não encontrada" });
  res.json(updated);
});

// Pix Transactions - CRUD Completo
router.get('/pix', (req, res) => {
  const month = req.query.month || '2026-10';
  const transactions = db.getPixTransactions(month);
  const totalIn = transactions.filter(t => t.direction === 'ENTRADA').reduce((a, b) => a + Number(b.amount), 0);
  const totalOut = transactions.filter(t => t.direction === 'SAIDA').reduce((a, b) => a + Number(b.amount), 0);
  const alerts = transactions.filter(t => t.isAlert);
  res.json({ transactions, summary: { totalIn, totalOut, netFlow: totalIn - totalOut, alertsCount: alerts.length, alerts } });
});

router.post('/pix', (req, res) => {
  const created = db.addPixTransaction(req.body);
  res.status(201).json(created);
});

router.delete('/pix/:id', (req, res) => {
  const deleted = db.deletePixTransaction(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Pix não encontrado" });
  res.json({ success: true });
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
