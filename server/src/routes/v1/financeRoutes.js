import { Router } from 'express';
import { exactSeedData } from '../../seedDataExact.js';
import {
  calculateIncome,
  calculateWellhubCredits,
  calculateFixedExpensesShares,
  calculateCardProjection,
  calculatePixTotals,
  calculateSelicCompoundInterest,
  calculateConsolidatedWealth,
  calculateHousingComparison,
  calculateMagicNumber,
  calculateBudget503020
} from '../../financeEngine.js';

const router = Router();

// Estado persistente em memória/runtime (inicializado com seed exato)
let currentIncomes = JSON.parse(JSON.stringify(exactSeedData.incomes));
let currentReimbursements = JSON.parse(JSON.stringify(exactSeedData.reimbursements));
let currentFixedExpenses = JSON.parse(JSON.stringify(exactSeedData.fixedExpenses));
let currentPix = JSON.parse(JSON.stringify(exactSeedData.pixTransactions));
let currentMarketHistory = JSON.parse(JSON.stringify(exactSeedData.marketHistory));
let currentRecurringExpenses = JSON.parse(JSON.stringify(exactSeedData.recurringExpenses));
let currentExcludedTransactions = JSON.parse(JSON.stringify(exactSeedData.excludedTransactions));
let currentInvestments = JSON.parse(JSON.stringify(exactSeedData.investments));

/**
 * Função interna para calcular o estado consolidado
 */
function getConsolidatedBalance(useNewApartment = false) {
  const salario = currentIncomes.find(i => /salário/i.test(i.description))?.amount || 9996.21;
  const monitoria = currentIncomes.find(i => /monitoria/i.test(i.description))?.amount || 1100.00;
  const income = calculateIncome(salario, monitoria);

  const wellhub = calculateWellhubCredits(currentReimbursements);
  const fixed = calculateFixedExpensesShares(currentFixedExpenses);
  const cards = calculateCardProjection(
    currentMarketHistory.map(m => m.amount),
    currentRecurringExpenses,
    currentExcludedTransactions
  );
  const pix = calculatePixTotals(currentPix);
  const housing = calculateHousingComparison();

  const magic = calculateMagicNumber({
    income,
    wellhubCredits: wellhub.total,
    pixIn: pix.entries,
    myFixedShare: fixed.totalAlexandre,
    myPaidFixed: fixed.paidAlexandre,
    pixOut: pix.outflows,
    cardProjection: cards.cardProjection,
    useNewApartment: Boolean(useNewApartment),
    housingDifference: housing.monthlyDifference
  });

  const budget503020 = calculateBudget503020(
    income,
    fixed.totalAlexandre,
    cards.cardProjection + pix.outflows,
    2000.00
  );

  return {
    income,
    wellhub,
    fixed,
    cards,
    pix,
    housing,
    balance: magic,
    budget503020
  };
}

/**
 * GET /api/v1/budget-50-30-20
 * Demonstrativo do Método 50/30/20 (Planilha Muriaé)
 */
router.get('/budget-50-30-20', (req, res) => {
  const data = getConsolidatedBalance();
  res.json(data.budget503020);
});

/**
 * GET /api/v1/balance
 * Painel consolidado e Número Mágico
 */
router.get('/balance', (req, res) => {
  const useNewApartment = req.query.useNewApartment === 'true';
  const data = getConsolidatedBalance(useNewApartment);
  res.json(data);
});

/**
 * GET /api/v1/incomes
 */
router.get('/incomes', (req, res) => {
  const total = currentIncomes.reduce((acc, c) => acc + Number(c.amount), 0);
  res.json({
    total: Number(total.toFixed(2)),
    items: currentIncomes
  });
});

/**
 * GET /api/v1/reimbursements
 */
router.get('/reimbursements', (req, res) => {
  const result = calculateWellhubCredits(currentReimbursements);
  res.json(result);
});

/**
 * GET /api/v1/fixed-expenses
 */
router.get('/fixed-expenses', (req, res) => {
  const result = calculateFixedExpensesShares(currentFixedExpenses);
  res.json(result);
});

/**
 * POST /api/v1/fixed-expenses/:id/toggle
 * Marca como PAGO / PENDENTE e atualiza o Número Mágico imediatamente
 */
router.post('/fixed-expenses/:id/toggle', (req, res) => {
  const { id } = req.params;
  const expense = currentFixedExpenses.find(f => f.id === id);

  if (!expense) {
    return res.status(404).json({ error: 'Despesa fixa não encontrada' });
  }

  // Alterna o status
  if (expense.status === 'PAGO') {
    expense.status = 'PENDENTE';
    expense.paidAt = null;
  } else {
    expense.status = 'PAGO';
    expense.paidAt = new Date().toISOString();
  }

  const updatedShares = calculateFixedExpensesShares(currentFixedExpenses);
  const updatedBalance = getConsolidatedBalance(req.query.useNewApartment === 'true');

  res.json({
    message: `Despesa ${expense.title} atualizada para ${expense.status}`,
    expense,
    fixedSummary: updatedShares,
    newBalance: updatedBalance.balance
  });
});

/**
 * GET /api/v1/cards/projection
 */
router.get('/cards/projection', (req, res) => {
  const result = calculateCardProjection(
    currentMarketHistory.map(m => m.amount),
    currentRecurringExpenses,
    currentExcludedTransactions
  );
  res.json(result);
});

/**
 * GET /api/v1/cards
 */
router.get('/cards', (req, res) => {
  const projection = calculateCardProjection(
    currentMarketHistory.map(m => m.amount),
    currentRecurringExpenses,
    currentExcludedTransactions
  );
  res.json({
    marketHistory: currentMarketHistory,
    recurringExpenses: currentRecurringExpenses,
    excludedTransactions: currentExcludedTransactions,
    ...projection
  });
});

/**
 * GET /api/v1/pix
 */
router.get('/pix', (req, res) => {
  const totals = calculatePixTotals(currentPix);
  res.json({
    totals,
    items: currentPix
  });
});

/**
 * POST /api/v1/pix
 * Lançamento rápido de Pix
 */
router.post('/pix', (req, res) => {
  const { description, amount, direction, category = 'Outros', date } = req.body;

  if (!description || !amount || !direction) {
    return res.status(400).json({ error: 'Descrição, valor e direção (IN ou OUT) são obrigatórios' });
  }

  const newPix = {
    id: `pix-${Date.now()}`,
    date: date || new Date().toISOString().split('T')[0],
    description,
    amount: Math.abs(Number(amount)),
    direction: direction.toUpperCase() === 'IN' ? 'IN' : 'OUT',
    category,
    referenceMonth: '2026-10'
  };

  currentPix.unshift(newPix);
  const totals = calculatePixTotals(currentPix);

  res.status(201).json({
    message: 'Transação Pix registrada com sucesso',
    transaction: newPix,
    totals
  });
});

/**
 * GET /api/v1/housing
 */
router.get('/housing', (req, res) => {
  const comparison = calculateHousingComparison();
  res.json(comparison);
});

/**
 * GET /api/v1/investments
 */
router.get('/investments', (req, res) => {
  const wealth = calculateConsolidatedWealth(currentInvestments, 0.1375);
  const selicExample10k = calculateSelicCompoundInterest(10000, 0.1375, 12);

  res.json({
    ...wealth,
    selicExample10k
  });
});

/**
 * POST /api/v1/reset
 * Restaura dados originais do seed exato
 */
router.post('/reset', (req, res) => {
  currentIncomes = JSON.parse(JSON.stringify(exactSeedData.incomes));
  currentReimbursements = JSON.parse(JSON.stringify(exactSeedData.reimbursements));
  currentFixedExpenses = JSON.parse(JSON.stringify(exactSeedData.fixedExpenses));
  currentPix = JSON.parse(JSON.stringify(exactSeedData.pixTransactions));
  currentMarketHistory = JSON.parse(JSON.stringify(exactSeedData.marketHistory));
  currentRecurringExpenses = JSON.parse(JSON.stringify(exactSeedData.recurringExpenses));
  currentExcludedTransactions = JSON.parse(JSON.stringify(exactSeedData.excludedTransactions));
  currentInvestments = JSON.parse(JSON.stringify(exactSeedData.investments));

  const freshBalance = getConsolidatedBalance(false);

  res.json({
    message: 'Sistema restaurado para o dataset original com sucesso',
    balance: freshBalance
  });
});

export default router;
