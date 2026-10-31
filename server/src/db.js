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

let state = null;

function loadFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      state = JSON.parse(content);
      // Ensure new collections exist in state if loaded from older json
      if (!state.budgets) state.budgets = JSON.parse(JSON.stringify(initialData.budgets));
      if (!state.cashFlowHistory) state.cashFlowHistory = JSON.parse(JSON.stringify(initialData.cashFlowHistory));
      if (!state.netWorthHistory) state.netWorthHistory = JSON.parse(JSON.stringify(initialData.netWorthHistory));
      if (!state.smsPushCaptures) state.smsPushCaptures = JSON.parse(JSON.stringify(initialData.smsPushCaptures));
      return;
    }
  } catch (err) {
    console.warn('[MobillsPro DB] Error reading JSON DB, fallback to initial seed:', err.message);
  }
  state = JSON.parse(JSON.stringify(initialData));
  saveToFile();
}

function saveToFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('[MobillsPro DB] Error saving data to file:', err.message);
  }
}

loadFromFile();

export const db = {
  isPostgres() {
    return usePostgres;
  },

  getProfile() {
    return state.profile;
  },

  updateProfile(updates) {
    state.profile = { ...state.profile, ...updates };
    saveToFile();
    return state.profile;
  },

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

  getWellhubReimbursements(month = "2026-10") {
    return state.wellhubReimbursements.filter(w => !w.referenceMonth || w.referenceMonth === month);
  },

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

  // Credit Cards and Invoices with Timeline & Limits
  getCreditCardsAudit() {
    return {
      cards: state.creditCards,
      history: state.monthlyAuditSummary,
      supermarketBenchmark: state.supermarketBenchmark,
      transactions: state.cardTransactions
    };
  },

  getCreditCardsDetailed() {
    return state.creditCards.map(c => {
      const limitUsedPercent = Number(((c.usedLimit / c.creditLimit) * 100).toFixed(1));
      let limitRisk = "HEALTHY";
      if (limitUsedPercent > 70) limitRisk = "WARNING";
      if (limitUsedPercent > 85) limitRisk = "CRITICAL";

      return {
        ...c,
        limitUsedPercent,
        limitRisk,
        closingDate: `2026-10-${String(c.closingDay).padStart(2, '0')}`,
        dueDate: c.dueDay === 1 ? '2026-11-01' : `2026-10-${String(c.dueDay).padStart(2, '0')}`,
        bestBuyDate: `2026-10-${String(c.bestBuyDay).padStart(2, '0')}`
      };
    });
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

  // Budgets & Centros de Custo (Metas)
  getBudgets() {
    return state.budgets.map(b => {
      const remaining = Number((b.targetAmount - b.spentAmount).toFixed(2));
      const percentage = Number(((b.spentAmount / b.targetAmount) * 100).toFixed(1));
      
      let colorCode = "GREEN";
      let status = "OK";
      if (percentage > 75 && percentage <= 90) {
        colorCode = "YELLOW";
        status = "WARN";
      } else if (percentage > 90) {
        colorCode = "RED";
        status = "ALERT";
      }

      return {
        ...b,
        remaining,
        percentage,
        colorCode,
        status,
        isOverBudget: remaining < 0
      };
    });
  },

  updateBudget(id, updates) {
    const index = state.budgets.findIndex(b => b.id === id);
    if (index === -1) return null;
    state.budgets[index] = { ...state.budgets[index], ...updates };
    saveToFile();
    return state.budgets[index];
  },

  // Motor de Captura SMS / Push (iPhone 17 Pro Max)
  getSmsPushHistory() {
    return state.smsPushCaptures || [];
  },

  parseAndRecordSmsPush(rawText, source = "iPhone 17 Pro Max Push") {
    // Regex parsing for bank SMS / push
    // Examples:
    // "Compra de R$ 85,00 aprovada no Nubank em BAHAMAS MIX MURIAE"
    // "Pix enviado com sucesso! R$ 45,00 para DEMSUR MURIAE AGUA"
    // "Bradesco Cartoes: Compra aprovada de R$ 240,00 no POSTO FAISAO MURIAE"

    let detectedAmount = 0;
    const amountMatch = rawText.match(/R\$\s*([\d\.,]+)/i);
    if (amountMatch) {
      const cleanStr = amountMatch[1].replace('.', '').replace(',', '.');
      detectedAmount = parseFloat(cleanStr) || 0;
    }

    let detectedMerchant = "Estabelecimento Comercial Muriaé";
    if (/bahamas/i.test(rawText)) detectedMerchant = "Bahamas Mix Muriaé";
    else if (/supermercados bh|bh muriae/i.test(rawText)) detectedMerchant = "Supermercados BH Muriaé";
    else if (/top frut/i.test(rawText)) detectedMerchant = "Top Frut Gourmet Muriaé";
    else if (/faisao/i.test(rawText)) detectedMerchant = "Posto Faisão Muriaé";
    else if (/posto dm/i.test(rawText)) detectedMerchant = "Posto DM Combustíveis";
    else if (/indiana/i.test(rawText)) detectedMerchant = "Farmácia Indiana Muriaé";
    else if (/demsur/i.test(rawText)) detectedMerchant = "DEMSUR Muriaé Água";
    else if (/energisa/i.test(rawText)) detectedMerchant = "Energisa Muriaé";
    else if (/unimed/i.test(rawText)) detectedMerchant = "Unimed Muriaé";

    let detectedCard = "Cartão de Crédito";
    if (/nubank/i.test(rawText)) detectedCard = "Nubank Ultravioleta";
    else if (/bradesco/i.test(rawText)) detectedCard = "Bradesco Visa Platinum";
    else if (/mercado pago/i.test(rawText)) detectedCard = "Mercado Pago Visa";
    else if (/pix/i.test(rawText)) detectedCard = "Pix Direto Conta";

    let assignedCategory = "Outros / Diversos";
    if (/bahamas|bh|top frut|mercado/i.test(detectedMerchant)) assignedCategory = "Supermercados Muriaé";
    else if (/faisao|dm|combustivel/i.test(detectedMerchant)) assignedCategory = "Combustível & Transporte";
    else if (/indiana|drogaria/i.test(detectedMerchant)) assignedCategory = "Farmácia & Medicamentos";
    else if (/demsur|energisa|fibra/i.test(detectedMerchant)) assignedCategory = "Contas de Consumo";
    else if (/unimed/i.test(detectedMerchant)) assignedCategory = "Saúde Individual (Alexandre)";

    const newCapture = {
      id: `sms-${Date.now()}`,
      source,
      rawText,
      parsedAmount: detectedAmount,
      parsedMerchant: detectedMerchant,
      detectedCard,
      assignedCategory,
      capturedAt: new Date().toISOString(),
      status: "SYNCED",
      device: "iPhone 17 Pro Max"
    };

    if (!state.smsPushCaptures) state.smsPushCaptures = [];
    state.smsPushCaptures.unshift(newCapture);

    // If it's a card purchase, also append to cardTransactions
    if (detectedCard !== "Pix Direto Conta" && detectedAmount > 0) {
      let cardId = "card-nubank";
      if (/bradesco/i.test(detectedCard)) cardId = "card-bradesco";
      if (/mercado pago/i.test(detectedCard)) cardId = "card-mercadopago";

      state.cardTransactions.push({
        id: `tx-c-${Date.now()}`,
        cardId,
        cardName: detectedCard,
        establishment: detectedMerchant,
        category: assignedCategory,
        amount: detectedAmount,
        transactionDate: new Date().toISOString().split('T')[0],
        installmentInfo: "Captura Automática iPhone",
        isAtypical: false,
        atypicalReason: null,
        referenceMonth: "2026-10",
        isShared: true
      });
    }

    saveToFile();
    return newCapture;
  },

  // Pix Transactions
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

  // Housing Simulation
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

  // Analytics: Cashflow & Net Worth History
  getCashFlowHistory() {
    return state.cashFlowHistory || [];
  },

  getNetWorthHistory() {
    return state.netWorthHistory || [];
  },

  // Smart Balance Automation: Magic Number (Saldo Livre Real)
  calculateMagicNumber(month = "2026-10", excludeAtypical = true, useNewApartment = false, period = "CURRENT_MONTH") {
    const incomes = this.getIncomes(month);
    const totalIncomeAlexandre = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);

    const wellhubs = this.getWellhubReimbursements(month);
    const totalWellhubCredit = wellhubs.reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalAvailableAlexandre = totalIncomeAlexandre + totalWellhubCredit;

    const fixed = this.getFixedExpenses(month);
    const totalFixedAlexandre = fixed.reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
    const fixedPaidAlexandre = fixed
      .filter(f => f.status === 'PAGO')
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
    const fixedPendingAlexandre = fixed
      .filter(f => f.status === 'PENDENTE')
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);

    const fixedIndividualAlexandre = fixed
      .filter(f => !f.isSplit5050 && f.beneficiary === 'ALEXANDRE')
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
    const fixedSharedAlexandre = fixed
      .filter(f => f.isSplit5050)
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);

    const cards = this.getCardTransactions(month);
    let eligibleCards = cards;
    if (excludeAtypical) {
      eligibleCards = cards.filter(c => !c.isAtypical);
    }
    
    const cardAlexandreTotal = eligibleCards.reduce((acc, curr) => {
      const share = curr.isShared ? (Number(curr.amount) / 2) : Number(curr.amount);
      return acc + share;
    }, 0);

    const totalAtypicalDiscounted = cards
      .filter(c => c.isAtypical)
      .reduce((acc, curr) => acc + (curr.isShared ? (Number(curr.amount) / 2) : Number(curr.amount)), 0);

    const pixList = this.getPixTransactions(month);
    const pixOutflowsExtra = pixList
      .filter(p => p.direction === 'SAIDA' && p.isAlert)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    let housingAdjustment = 0;
    const sim = state.housingSimulation;
    if (useNewApartment) {
      const currentHousingCost = sim.current.rentShare + sim.current.landShare;
      const newHousingCost = sim.newCenterApartment.caixaSacFirstInstallment + sim.newCenterApartment.condoShare - sim.newCenterApartment.fuelSavings;
      housingAdjustment = newHousingCost - currentHousingCost;
    }

    const magicNumber = totalAvailableAlexandre - totalFixedAlexandre - cardAlexandreTotal - pixOutflowsExtra - housingAdjustment;

    // Despesas Totais consolidadas
    const totalExpensesMonth = totalFixedAlexandre + cardAlexandreTotal + pixOutflowsExtra + (useNewApartment ? housingAdjustment : 0);

    // Projeção Anual (12 Meses)
    const annualProjectedSavings = Number((magicNumber * 12).toFixed(2));
    const annualProjectedIncome = Number((totalAvailableAlexandre * 12).toFixed(2));

    const savingsRate = ((magicNumber / totalAvailableAlexandre) * 100).toFixed(1);
    const fixedCommitment = ((totalFixedAlexandre / totalAvailableAlexandre) * 100).toFixed(1);

    return {
      referenceMonth: month,
      period,
      totalIncomeAlexandre,
      totalWellhubCredit,
      totalAvailableAlexandre,
      totalExpensesMonth: Number(totalExpensesMonth.toFixed(2)),
      annualProjection: {
        savings: annualProjectedSavings,
        income: annualProjectedIncome
      },
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

  resetDatabase() {
    state = JSON.parse(JSON.stringify(initialData));
    saveToFile();
    return { success: true, message: "Database reset to initial pre-loaded state" };
  }
};
