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
  const excludeAtypical = req.query.excludeAtypical !== 'false';
  const useNewApartment = req.query.useNewApartment === 'true';

  const balance = db.calculateMagicNumber(month, excludeAtypical, useNewApartment);
  const profile = db.getProfile();
  const investments = db.getInvestments();
  const cardsAudit = db.getCreditCardsAudit();
  const pixList = db.getPixTransactions(month);

  // Total Net Worth (Patrimônio Líquido Consolidado)
  const totalNetWorthBRL = investments.reduce((acc, curr) => acc + Number(curr.balanceBRL), 0);
  const nomadAsset = investments.find(i => i.assetType === 'USD_OFFSHORE');

  // Pix Alerts
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
    recentPixAlerts: pixAlerts.slice(0, 3)
  });
});

// Incomes
router.get('/incomes', (req, res) => {
  const month = req.query.month || '2026-10';
  res.json(db.getIncomes(month));
});

router.post('/incomes', (req, res) => {
  const item = db.addIncome(req.body);
  res.status(201).json(item);
});

// Wellhub Reimbursements
router.get('/wellhub', (req, res) => {
  const month = req.query.month || '2026-10';
  const reimbursements = db.getWellhubReimbursements(month);
  const total = reimbursements.reduce((acc, curr) => acc + Number(curr.amount), 0);
  res.json({
    reimbursements,
    total,
    rule: "Reembolso automático de terceiros (Amanda, Taiana, Nilvana) de R$ 549,90 creditado mensalmente"
  });
});

router.post('/wellhub', (req, res) => {
  const item = db.addWellhubReimbursement(req.body);
  res.status(201).json(item);
});

// Fixed Expenses & Checklist
router.get('/fixed-expenses', (req, res) => {
  const month = req.query.month || '2026-10';
  const expenses = db.getFixedExpenses(month);
  
  const totalShared = expenses
    .filter(e => e.isSplit5050)
    .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
  
  const totalIndividual = expenses
    .filter(e => !e.isSplit5050)
    .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);

  const totalPaid = expenses
    .filter(e => e.status === 'PAGO')
    .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);

  const totalPending = expenses
    .filter(e => e.status === 'PENDENTE')
    .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);

  res.json({
    expenses,
    summary: {
      totalAlexandre: totalShared + totalIndividual,
      totalShared,
      totalIndividual,
      totalPaid,
      totalPending,
      paidCount: expenses.filter(e => e.status === 'PAGO').length,
      pendingCount: expenses.filter(e => e.status === 'PENDENTE').length
    }
  });
});

router.patch('/fixed-expenses/:id/toggle', (req, res) => {
  const updated = db.toggleFixedExpense(req.params.id);
  if (!updated) return res.status(404).json({ error: "Despesa fixa não encontrada" });
  res.json(updated);
});

router.put('/fixed-expenses/:id', (req, res) => {
  const updated = db.updateFixedExpense(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Despesa fixa não encontrada" });
  res.json(updated);
});

router.post('/fixed-expenses', (req, res) => {
  const item = db.addFixedExpense(req.body);
  res.status(201).json(item);
});

// Credit Cards & Historical Audit (Maio a Outubro de 2026)
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

router.post('/cards/transactions', (req, res) => {
  const item = db.addCardTransaction(req.body);
  res.status(201).json(item);
});

// Pix Transactions (Detector e Alertas)
router.get('/pix', (req, res) => {
  const month = req.query.month || '2026-10';
  const transactions = db.getPixTransactions(month);
  
  const totalIn = transactions
    .filter(t => t.direction === 'ENTRADA')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalOut = transactions
    .filter(t => t.direction === 'SAIDA')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const alerts = transactions.filter(t => t.isAlert);

  res.json({
    transactions,
    summary: {
      totalIn,
      totalOut,
      netFlow: totalIn - totalOut,
      alertsCount: alerts.length,
      alerts
    }
  });
});

router.post('/pix', (req, res) => {
  const item = db.addPixTransaction(req.body);
  res.status(201).json(item);
});

// Housing Transition Simulator (Moradia Atual vs Centro Caixa SBPE SAC)
router.get('/housing/simulation', (req, res) => {
  res.json(db.getHousingSimulation());
});

router.put('/housing/simulation', (req, res) => {
  const updated = db.updateHousingSimulation(req.body);
  res.json(updated);
});

// Investments & Assets (Nomad USD, Tesouro Selic 13.75%, CDB)
router.get('/investments', (req, res) => {
  const list = db.getInvestments();
  const totalNetWorthBRL = list.reduce((acc, curr) => acc + Number(curr.balanceBRL), 0);
  const totalOffshoreUSD = list
    .filter(i => i.assetType === 'USD_OFFSHORE')
    .reduce((acc, curr) => acc + Number(curr.balanceOriginal), 0);
  const totalFixedIncomeBRL = list
    .filter(i => i.assetType === 'RENDA_FIXA_POS')
    .reduce((acc, curr) => acc + Number(curr.balanceBRL), 0);
  const totalRealEstateBRL = list
    .filter(i => i.assetType === 'PATRIMONIO_IMOVEL')
    .reduce((acc, curr) => acc + Number(curr.balanceBRL), 0);

  res.json({
    investments: list,
    summary: {
      totalNetWorthBRL,
      totalOffshoreUSD,
      totalFixedIncomeBRL,
      totalRealEstateBRL
    }
  });
});

router.put('/investments/:id', (req, res) => {
  const updated = db.updateInvestment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Investimento não encontrado" });
  res.json(updated);
});

router.post('/investments', (req, res) => {
  const item = db.addInvestment(req.body);
  res.status(201).json(item);
});

// Reset database to initial state
router.post('/system/reset', (req, res) => {
  const result = db.resetDatabase();
  res.json(result);
});

export default router;
