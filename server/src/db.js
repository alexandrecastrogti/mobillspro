import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { initialData } from './seedData.js';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'mobillspro.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let pgPool = null;
let usePostgres = false;

// Check if PostgreSQL is configured via env
if (process.env.DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log('[MobillsPro DB] DATABASE_URL provided. Testing PostgreSQL connection...');
  } catch (err) {
    console.warn('[MobillsPro DB] Error initializing pg pool:', err.message);
  }
}

// In-Memory state with File persistence fallback
let state = null;

function loadFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      state = JSON.parse(content);
      console.log('[MobillsPro DB] Loaded database from persistent storage:', DATA_FILE);
      return;
    }
  } catch (err) {
    console.warn('[MobillsPro DB] Error reading JSON DB, fallback to initial seed:', err.message);
  }
  // Initialize with seedData
  state = JSON.parse(JSON.stringify(initialData));
  saveToFile();
  console.log('[MobillsPro DB] Initialized database with preloaded business rules & 6-month historical audit data.');
}

function saveToFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('[MobillsPro DB] Error saving data to file:', err.message);
  }
}

// Initialize on module load
loadFromFile();

export const db = {
  // Check if PG is active
  isPostgres() {
    return usePostgres;
  },

  // Profile and Configuration
  getProfile() {
    return state.profile;
  },

  updateProfile(updates) {
    state.profile = { ...state.profile, ...updates };
    saveToFile();
    return state.profile;
  },

  // Incomes
  getIncomes(month = "2026-10") {
    return state.incomes.filter(i => !i.referenceMonth || i.referenceMonth === month);
  },

  addIncome(item) {
    const newIncome = {
      id: `inc-${Date.now()}`,
      ...item,
      referenceMonth: item.referenceMonth || state.profile.currentMonth
    };
    state.incomes.push(newIncome);
    saveToFile();
    return newIncome;
  },

  // Wellhub Reimbursements
  getWellhubReimbursements(month = "2026-10") {
    return state.wellhubReimbursements.filter(w => !w.referenceMonth || w.referenceMonth === month);
  },

  addWellhubReimbursement(item) {
    const newItem = {
      id: `wh-${Date.now()}`,
      ...item,
      status: item.status || "CREDITADO",
      referenceMonth: item.referenceMonth || state.profile.currentMonth
    };
    state.wellhubReimbursements.push(newItem);
    saveToFile();
    return newItem;
  },

  // Fixed Expenses & Checklist
  getFixedExpenses(month = "2026-10") {
    return state.fixedExpenses.filter(f => !f.referenceMonth || f.referenceMonth === month);
  },

  toggleFixedExpense(id) {
    const exp = state.fixedExpenses.find(f => f.id === id);
    if (!exp) return null;
    
    if (exp.status === 'PAGO') {
      exp.status = 'PENDENTE';
      exp.paidAt = null;
    } else {
      exp.status = 'PAGO';
      exp.paidAt = new Date().toISOString();
    }
    saveToFile();
    return exp;
  },

  updateFixedExpense(id, updates) {
    const index = state.fixedExpenses.findIndex(f => f.id === id);
    if (index === -1) return null;
    state.fixedExpenses[index] = { ...state.fixedExpenses[index], ...updates };
    saveToFile();
    return state.fixedExpenses[index];
  },

  addFixedExpense(item) {
    const newItem = {
      id: `fix-${Date.now()}`,
      status: 'PENDENTE',
      referenceMonth: item.referenceMonth || state.profile.currentMonth,
      ...item
    };
    state.fixedExpenses.push(newItem);
    saveToFile();
    return newItem;
  },

  // Credit Cards and 6-Month Historical Audit
  getCreditCardsAudit() {
    return {
      cards: state.creditCards,
      history: state.monthlyAuditSummary,
      supermarketBenchmark: state.supermarketBenchmark,
      transactions: state.cardTransactions
    };
  },

  getCardTransactions(month = "2026-10", cardId = null) {
    let list = state.cardTransactions;
    if (month) {
      list = list.filter(t => t.referenceMonth === month);
    }
    if (cardId) {
      list = list.filter(t => t.cardId === cardId);
    }
    return list;
  },

  toggleAtypicalTransaction(id) {
    const tx = state.cardTransactions.find(t => t.id === id);
    if (!tx) return null;
    tx.isAtypical = !tx.isAtypical;
    saveToFile();
    return tx;
  },

  addCardTransaction(item) {
    const newItem = {
      id: `tx-c-${Date.now()}`,
      referenceMonth: item.referenceMonth || state.profile.currentMonth,
      isAtypical: !!item.isAtypical,
      isShared: item.isShared !== undefined ? item.isShared : true,
      ...item
    };
    state.cardTransactions.push(newItem);
    saveToFile();
    return newItem;
  },

  // Pix Transactions (Detector and Alerts)
  getPixTransactions(month = "2026-10") {
    let list = state.pixTransactions;
    if (month) {
      list = list.filter(p => p.referenceMonth === month);
    }
    return list.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
  },

  addPixTransaction(item) {
    const newItem = {
      id: `pix-${Date.now()}`,
      transactionDate: item.transactionDate || new Date().toISOString(),
      referenceMonth: item.referenceMonth || state.profile.currentMonth,
      isAlert: !!item.isAlert,
      ...item
    };
    state.pixTransactions.push(newItem);
    saveToFile();
    return newItem;
  },

  // Housing Transition Simulator (Caixa SBPE SAC Centro vs Atual)
  getHousingSimulation() {
    return state.housingSimulation;
  },

  updateHousingSimulation(updates) {
    state.housingSimulation = {
      current: { ...state.housingSimulation.current, ...(updates.current || {}) },
      newCenterApartment: { ...state.housingSimulation.newCenterApartment, ...(updates.newCenterApartment || {}) }
    };
    saveToFile();
    return state.housingSimulation;
  },

  // Investments & Assets
  getInvestments() {
    return state.investments;
  },

  updateInvestment(id, updates) {
    const index = state.investments.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    const current = state.investments[index];
    const updated = { ...current, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
    
    // Auto calculate balanceBRL if original or exchangeRate changes
    if (updated.currency === 'USD') {
      const rate = updated.exchangeRate || 5.75;
      updated.balanceBRL = Number((updated.balanceOriginal * rate).toFixed(2));
    } else {
      updated.balanceBRL = updated.balanceOriginal;
    }

    state.investments[index] = updated;
    saveToFile();
    return updated;
  },

  addInvestment(item) {
    const rate = item.currency === 'USD' ? (item.exchangeRate || 5.75) : 1;
    const newItem = {
      id: `inv-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      exchangeRate: rate,
      balanceBRL: Number((item.balanceOriginal * rate).toFixed(2)),
      ...item
    };
    state.investments.push(newItem);
    saveToFile();
    return newItem;
  },

  // Smart Balance Automation: Magic Number (Saldo Livre Real)
  calculateMagicNumber(month = "2026-10", excludeAtypical = true, useNewApartment = false) {
    // 1. Incomes Alexandre
    const incomes = this.getIncomes(month);
    const totalIncomeAlexandre = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);

    // 2. Wellhub Reimbursements (Credit)
    const wellhubs = this.getWellhubReimbursements(month);
    const totalWellhubCredit = wellhubs.reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Total Inflow for Alexandre
    const totalAvailableAlexandre = totalIncomeAlexandre + totalWellhubCredit;

    // 3. Fixed Expenses Checklist
    const fixed = this.getFixedExpenses(month);
    const totalFixedAlexandre = fixed.reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
    const fixedPaidAlexandre = fixed
      .filter(f => f.status === 'PAGO')
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
    const fixedPendingAlexandre = fixed
      .filter(f => f.status === 'PENDENTE')
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);

    // Individual vs Shared breakdown for Alexandre
    const fixedIndividualAlexandre = fixed
      .filter(f => !f.isSplit5050 && f.beneficiary === 'ALEXANDRE')
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
    const fixedSharedAlexandre = fixed
      .filter(f => f.isSplit5050)
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);

    // 4. Cards
    const cards = this.getCardTransactions(month);
    let eligibleCards = cards;
    if (excludeAtypical) {
      eligibleCards = cards.filter(c => !c.isAtypical);
    }
    
    // Alexandre's share in cards (50% of shared, 100% of individual)
    const cardAlexandreTotal = eligibleCards.reduce((acc, curr) => {
      const share = curr.isShared ? (Number(curr.amount) / 2) : Number(curr.amount);
      return acc + share;
    }, 0);

    const totalAtypicalDiscounted = cards
      .filter(c => c.isAtypical)
      .reduce((acc, curr) => acc + (curr.isShared ? (Number(curr.amount) / 2) : Number(curr.amount)), 0);

    // 5. Pix Outflows (not already accounted in fixed expenses checklist)
    const pixList = this.getPixTransactions(month);
    const pixOutflowsExtra = pixList
      .filter(p => p.direction === 'SAIDA' && p.isAlert) // Extra / avulsos
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // 6. Housing adjustment (if switching to New Apartment)
    let housingAdjustment = 0;
    const sim = state.housingSimulation;
    if (useNewApartment) {
      // Delta = New housing cost (SAC + Condo - Fuel Savings) - Current housing cost (Rent + Land)
      const currentHousingCost = sim.current.rentShare + sim.current.landShare; // 810.50 + 1343.26 = 2153.76
      const newHousingCost = sim.newCenterApartment.caixaSacFirstInstallment + sim.newCenterApartment.condoShare - sim.newCenterApartment.fuelSavings; // 3231.32 + 250 - 360 = 3121.32
      housingAdjustment = newHousingCost - currentHousingCost;
    }

    // Magic Number Calculation
    const magicNumber = totalAvailableAlexandre - totalFixedAlexandre - cardAlexandreTotal - pixOutflowsExtra - housingAdjustment;

    // Financial Health Indicators
    const savingsRate = ((magicNumber / totalAvailableAlexandre) * 100).toFixed(1);
    const fixedCommitment = ((totalFixedAlexandre / totalAvailableAlexandre) * 100).toFixed(1);

    return {
      referenceMonth: month,
      totalIncomeAlexandre,
      totalWellhubCredit,
      totalAvailableAlexandre,
      fixedExpenses: {
        total: totalFixedAlexandre,
        paid: fixedPaidAlexandre,
        pending: fixedPendingAlexandre,
        individual: fixedIndividualAlexandre,
        shared: fixedSharedAlexandre,
        totalItems: fixed.length,
        paidItems: fixed.filter(f => f.status === 'PAGO').length
      },
      cards: {
        totalAlexandre: cardAlexandreTotal,
        atypicalExcluded: excludeAtypical,
        atypicalSavings: totalAtypicalDiscounted
      },
      pixExtraOutflows: pixOutflowsExtra,
      housingSimulationApplied: useNewApartment,
      housingAdjustment,
      magicNumber: Number(magicNumber.toFixed(2)),
      health: {
        savingsRate: Number(savingsRate),
        fixedCommitment: Number(fixedCommitment),
        status: magicNumber > 2500 ? "EXCELENTE" : (magicNumber > 1000 ? "EQUILIBRADO" : "ATENÇÃO")
      }
    };
  },

  // Reset to initial seed data
  resetDatabase() {
    state = JSON.parse(JSON.stringify(initialData));
    saveToFile();
    return { success: true, message: "Database reset to initial pre-loaded state" };
  }
};
