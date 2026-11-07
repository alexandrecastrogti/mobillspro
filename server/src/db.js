import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { initialData } from './seedData.js';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'mobillspro.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('[MobillsPro DB] Notice creating data directory:', err.message);
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
      // Ensure all collections exist
      if (!state.budgets) state.budgets = JSON.parse(JSON.stringify(initialData.budgets));
      if (!state.cashFlowHistory) state.cashFlowHistory = JSON.parse(JSON.stringify(initialData.cashFlowHistory));
      if (!state.netWorthHistory) state.netWorthHistory = JSON.parse(JSON.stringify(initialData.netWorthHistory));
      if (!state.smsPushCaptures) state.smsPushCaptures = JSON.parse(JSON.stringify(initialData.smsPushCaptures));
      if (!state.profile) state.profile = JSON.parse(JSON.stringify(initialData.profile));
      if (state.profile.currentAccountBalance === undefined) state.profile.currentAccountBalance = 11935.12;
      if (!state.cardTransactions) state.cardTransactions = JSON.parse(JSON.stringify(initialData.cardTransactions || []));
      return;
    }
  } catch (err) {
    console.warn('[MobillsPro DB] Error reading JSON DB, fallback to initial seed:', err.message);
  }
  state = JSON.parse(JSON.stringify(initialData));
  if (state.profile && state.profile.currentAccountBalance === undefined) {
    state.profile.currentAccountBalance = 11935.12;
  }
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
    if (!state.profile) state.profile = JSON.parse(JSON.stringify(initialData.profile));
    if (state.profile.currentAccountBalance === undefined) state.profile.currentAccountBalance = 11935.12;
    return state.profile;
  },

  updateProfile(updates) {
    if (!state.profile) state.profile = JSON.parse(JSON.stringify(initialData.profile));
    if (updates.currentAccountBalance !== undefined) {
      updates.currentAccountBalance = Number(Number(updates.currentAccountBalance).toFixed(2));
    }
    state.profile = { ...state.profile, ...updates };
    saveToFile();
    return state.profile;
  },

  // Incomes (CRUD)
  ensureMonthInitialized(month) {
    if (!month) return;

    // 1. Incomes Rollover (Salário R$ 9.996,21 + Monitoria R$ 1.100,00)
    const hasIncomes = state.incomes.some(i => i.referenceMonth === month);
    if (!hasIncomes) {
      const baseIncomes = state.incomes.filter(i => i.isRecurring && (i.referenceMonth === '2026-10' || !i.referenceMonth));
      const template = baseIncomes.length > 0 ? baseIncomes : [
        { userName: "Alexandre", description: "Salário Líquido Alexandre", amount: 9996.21, category: "Salário", isRecurring: true },
        { userName: "Alexandre", description: "Monitoria", amount: 1100.00, category: "Monitoria", isRecurring: true }
      ];
      template.forEach((inc, idx) => {
        state.incomes.push({
          id: `inc-${month}-${idx + 1}`,
          userName: inc.userName,
          description: inc.description,
          amount: Number(inc.amount),
          category: inc.category,
          isRecurring: true,
          referenceMonth: month
        });
      });
    }

    // 2. Wellhub Reimbursements Rollover (Amanda R$ 183,30, Taiana R$ 183,30, Nilvana R$ 183,30)
    const hasWellhub = state.wellhubReimbursements.some(w => w.referenceMonth === month);
    if (!hasWellhub) {
      const baseWellhub = state.wellhubReimbursements.filter(w => w.referenceMonth === '2026-10' || !w.referenceMonth);
      const template = baseWellhub.length > 0 ? baseWellhub : [
        { beneficiary: "Amanda", planName: "Wellhub Silver", amount: 183.30, description: "Reembolso Wellhub Amanda (crédito em conta/fatura)" },
        { beneficiary: "Taiana", planName: "Wellhub Silver", amount: 183.30, description: "Reembolso Wellhub Taiana (crédito via Pix recebido)" },
        { beneficiary: "Nilvana", planName: "Wellhub Silver", amount: 183.30, description: "Reembolso Wellhub Nilvana (crédito via Pix recebido)" }
      ];
      template.forEach((wh, idx) => {
        state.wellhubReimbursements.push({
          id: `wh-${month}-${idx + 1}`,
          beneficiary: wh.beneficiary,
          planName: wh.planName,
          amount: Number(wh.amount),
          status: "CREDITADO",
          referenceMonth: month,
          description: wh.description
        });
      });
    }

    // 3. Fixed Expenses Rollover (As 8 despesas fixas reais com status PENDENTE)
    const hasFixed = state.fixedExpenses.some(f => f.referenceMonth === month);
    if (!hasFixed) {
      const baseFixed = state.fixedExpenses.filter(f => f.referenceMonth === '2026-10' || !f.referenceMonth);
      const template = baseFixed.length > 0 ? baseFixed : [
        { title: "Aluguel", category: "Moradia", totalAmount: 1621.00, alexandreShare: 810.50, amandaShare: 810.50, isSplit5050: true, beneficiary: "COMPARTILHADO", dueDay: 5, paymentMethod: "PIX", pixCode: "PIX-ALUGUEL-MURIAE" },
        { title: "Parcela do Terreno", category: "Patrimônio", totalAmount: 2686.52, alexandreShare: 1343.26, amandaShare: 1343.26, isSplit5050: true, beneficiary: "COMPARTILHADO", dueDay: 10, paymentMethod: "BOLETO", pixCode: "BOL-TERRENO" },
        { title: "Energia (Cemig)", category: "Consumo", totalAmount: 280.00, alexandreShare: 140.00, amandaShare: 140.00, isSplit5050: true, beneficiary: "COMPARTILHADO", dueDay: 12, paymentMethod: "PIX", pixCode: "CEMIG-PIX" },
        { title: "Água (Copasa)", category: "Consumo", totalAmount: 120.00, alexandreShare: 60.00, amandaShare: 60.00, isSplit5050: true, beneficiary: "COMPARTILHADO", dueDay: 15, paymentMethod: "PIX", pixCode: "COPASA-PIX" },
        { title: "Internet", category: "Consumo", totalAmount: 120.00, alexandreShare: 60.00, amandaShare: 60.00, isSplit5050: true, beneficiary: "COMPARTILHADO", dueDay: 20, paymentMethod: "PIX", pixCode: "INTERNET-PIX" },
        { title: "Unimed (individual)", category: "Saúde", totalAmount: 690.00, alexandreShare: 690.00, amandaShare: 0.00, isSplit5050: false, beneficiary: "ALEXANDRE", dueDay: 8, paymentMethod: "BOLETO", pixCode: "UNIMED-BOL" },
        { title: "Academia Alexandre", category: "Saúde & Fitness", totalAmount: 129.90, alexandreShare: 129.90, amandaShare: 0.00, isSplit5050: false, beneficiary: "ALEXANDRE", dueDay: 10, paymentMethod: "CARTAO", pixCode: "ACADEMIA-REC" },
        { title: "Wellhub (4 planos)", category: "Benefícios & Saúde", totalAmount: 733.20, alexandreShare: 733.20, amandaShare: 0.00, isSplit5050: false, beneficiary: "ALEXANDRE", dueDay: 1, paymentMethod: "CARTAO", pixCode: "WELLHUB-REC" }
      ];

      template.forEach((exp, idx) => {
        const dayStr = String(exp.dueDay || 10).padStart(2, '0');
        state.fixedExpenses.push({
          ...exp,
          id: `fix-${month}-${idx + 1}`,
          dueDate: `${month}-${dayStr}`,
          status: 'PENDENTE',
          paidAt: null,
          referenceMonth: month
        });
      });
    }

    saveToFile();
  },

  getIncomes(month = "2026-10") {
    this.ensureMonthInitialized(month);
    return state.incomes.filter(i => !i.referenceMonth || i.referenceMonth === month);
  },

  addIncome(item) {
    const newIncome = {
      id: `inc-${Date.now()}`,
      userName: item.userName || state.profile.userName,
      description: item.description || "Receita Avulsa",
      amount: Number(item.amount) || 0,
      category: item.category || "Outros",
      isRecurring: item.isRecurring !== undefined ? item.isRecurring : true,
      referenceMonth: item.referenceMonth || state.profile.currentMonth
    };
    state.incomes.push(newIncome);
    saveToFile();
    return newIncome;
  },

  deleteIncome(id) {
    const idx = state.incomes.findIndex(i => i.id === id);
    if (idx === -1) return false;
    state.incomes.splice(idx, 1);
    saveToFile();
    return true;
  },

  // Wellhub (CRUD)
  getWellhubReimbursements(month = "2026-10") {
    this.ensureMonthInitialized(month);
    return state.wellhubReimbursements.filter(w => !w.referenceMonth || w.referenceMonth === month);
  },

  addWellhubReimbursement(item) {
    const newItem = {
      id: `wh-${Date.now()}`,
      beneficiary: item.beneficiary || "Terceiro",
      planName: item.planName || "Wellhub Silver",
      amount: Number(item.amount) || 183.30,
      status: "CREDITADO",
      referenceMonth: item.referenceMonth || state.profile.currentMonth,
      description: item.description || `Reembolso Wellhub ${item.beneficiary}`
    };
    state.wellhubReimbursements.push(newItem);
    saveToFile();
    return newItem;
  },

  deleteWellhubReimbursement(id) {
    const idx = state.wellhubReimbursements.findIndex(w => w.id === id);
    if (idx === -1) return false;
    state.wellhubReimbursements.splice(idx, 1);
    saveToFile();
    return true;
  },

  // Fixed Expenses (CRUD)
  getFixedExpenses(month = "2026-10") {
    this.ensureMonthInitialized(month);
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
    const current = state.fixedExpenses[index];

    let totalAmount = updates.totalAmount !== undefined ? Number(Number(updates.totalAmount).toFixed(2)) : current.totalAmount;
    let isSplit5050 = updates.isSplit5050 !== undefined ? updates.isSplit5050 : current.isSplit5050;
    let alexandreShare = updates.alexandreShare !== undefined 
      ? Number(Number(updates.alexandreShare).toFixed(2)) 
      : (isSplit5050 ? Number((totalAmount / 2).toFixed(2)) : totalAmount);
    let amandaShare = updates.amandaShare !== undefined 
      ? Number(Number(updates.amandaShare).toFixed(2)) 
      : (isSplit5050 ? Number((totalAmount - alexandreShare).toFixed(2)) : 0);

    let dueDay = updates.dueDay !== undefined ? Number(updates.dueDay) : current.dueDay;
    let dueDate = updates.dueDate || current.dueDate;
    if (updates.dueDay && current.referenceMonth) {
      dueDate = `${current.referenceMonth}-${String(dueDay).padStart(2, '0')}`;
    }

    state.fixedExpenses[index] = { 
      ...current, 
      ...updates,
      totalAmount,
      isSplit5050,
      alexandreShare,
      amandaShare,
      dueDay,
      dueDate
    };
    saveToFile();
    return state.fixedExpenses[index];
  },

  addFixedExpense(item) {
    const totalAmount = Number(item.totalAmount) || 0;
    const isSplit = item.isSplit5050 !== undefined ? item.isSplit5050 : true;
    const alexShare = isSplit ? Number((totalAmount / 2).toFixed(2)) : totalAmount;
    const amandaShare = isSplit ? Number((totalAmount / 2).toFixed(2)) : 0;

    const newItem = {
      id: `fix-${Date.now()}`,
      title: item.title || "Nova Despesa Fixa",
      category: item.category || "Moradia",
      totalAmount,
      alexandreShare: Number(item.alexandreShare) || alexShare,
      amandaShare: Number(item.amandaShare) || amandaShare,
      isSplit5050: isSplit,
      beneficiary: item.beneficiary || (isSplit ? "COMPARTILHADO" : "ALEXANDRE"),
      dueDay: Number(item.dueDay) || 10,
      dueDate: item.dueDate || `2026-10-${String(item.dueDay || 10).padStart(2, '0')}`,
      status: item.status || 'PENDENTE',
      paymentMethod: item.paymentMethod || 'PIX',
      paidAt: item.status === 'PAGO' ? new Date().toISOString() : null,
      pixCode: item.pixCode || `PIX-${Date.now().toString().slice(-6)}`,
      referenceMonth: item.referenceMonth || state.profile.currentMonth
    };
    state.fixedExpenses.push(newItem);
    saveToFile();
    return newItem;
  },

  deleteFixedExpense(id) {
    const idx = state.fixedExpenses.findIndex(f => f.id === id);
    if (idx === -1) return false;
    state.fixedExpenses.splice(idx, 1);
    saveToFile();
    return true;
  },

  // Credit Cards & Transactions (CRUD)
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
      const bestBuyDay = c.bestBuyDay || (c.closingDay ? (c.closingDay % 30) + 1 : 1);
      const usedLimit = c.usedLimit !== undefined ? c.usedLimit : 0;
      const creditLimit = c.creditLimit || 10000;
      const availableLimit = c.availableLimit !== undefined ? c.availableLimit : (creditLimit - usedLimit);
      const currentInvoice = c.currentInvoice !== undefined ? c.currentInvoice : 0;
      const limitUsedPercent = Number(((usedLimit / creditLimit) * 100).toFixed(1));
      let limitRisk = "HEALTHY";
      if (limitUsedPercent > 70) limitRisk = "WARNING";
      if (limitUsedPercent > 85) limitRisk = "CRITICAL";

      return {
        ...c,
        bestBuyDay,
        usedLimit,
        creditLimit,
        availableLimit,
        currentInvoice,
        limitUsedPercent,
        limitRisk,
        closingDate: `2026-10-${String(c.closingDay || 1).padStart(2, '0')}`,
        dueDate: c.dueDay === 1 ? '2026-11-01' : `2026-10-${String(c.dueDay || 10).padStart(2, '0')}`,
        bestBuyDate: `2026-10-${String(bestBuyDay).padStart(2, '0')}`
      };
    });
  },

  updateCreditCard(id, updates) {
    const card = state.creditCards.find(c => c.id === id);
    if (!card) return null;
    if (updates.creditLimit !== undefined) {
      card.creditLimit = Number(updates.creditLimit);
      card.availableLimit = Number((card.creditLimit - card.usedLimit).toFixed(2));
    }
    if (updates.closingDay !== undefined) card.closingDay = Number(updates.closingDay);
    if (updates.dueDay !== undefined) card.dueDay = Number(updates.dueDay);
    if (updates.bestBuyDay !== undefined) card.bestBuyDay = Number(updates.bestBuyDay);
    if (updates.notes !== undefined) card.notes = updates.notes;
    saveToFile();
    return card;
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

  addCardTransaction(item) {
    const amount = Number(Number(item.amount).toFixed(2)) || 0;
    const cardId = item.cardId || "card-nubank";
    let cardName = item.cardName;
    if (!cardName) {
      if (cardId === 'card-bradesco') cardName = "Bradesco Visa Platinum";
      else if (cardId === 'card-mercadopago') cardName = "Mercado Pago Visa";
      else cardName = "Nubank Ultravioleta";
    }

    const newItem = {
      id: `tx-c-${Date.now()}`,
      cardId,
      cardName,
      establishment: item.establishment || "Estabelecimento Muriaé",
      category: item.category || "Supermercados Muriaé",
      amount,
      transactionDate: item.transactionDate || new Date().toISOString().split('T')[0],
      installmentInfo: item.installmentInfo || "À vista",
      isAtypical: !!item.isAtypical,
      atypicalReason: item.atypicalReason || null,
      referenceMonth: item.referenceMonth || state.profile.currentMonth || "2026-10",
      isShared: item.isShared !== undefined ? item.isShared : true
    };

    if (!state.cardTransactions) state.cardTransactions = [];
    state.cardTransactions.push(newItem);

    // Update usedLimit on the card
    if (state.creditCards) {
      const card = state.creditCards.find(c => c.id === newItem.cardId);
      if (card) {
        card.usedLimit = Number(((card.usedLimit || 0) + amount).toFixed(2));
        card.availableLimit = Number(((card.creditLimit || 10000) - card.usedLimit).toFixed(2));
        card.currentInvoice = Number(((card.currentInvoice || 0) + amount).toFixed(2));
      }
    }

    saveToFile();
    return newItem;
  },

  deleteCardTransaction(id) {
    const idx = state.cardTransactions.findIndex(t => t.id === id);
    if (idx === -1) return false;
    const removed = state.cardTransactions.splice(idx, 1)[0];

    // Revert used limit
    const card = state.creditCards.find(c => c.id === removed.cardId);
    if (card) {
      card.usedLimit = Math.max(0, Number((card.usedLimit - removed.amount).toFixed(2)));
      card.availableLimit = Number((card.creditLimit - card.usedLimit).toFixed(2));
      card.currentInvoice = Math.max(0, Number((card.currentInvoice - removed.amount).toFixed(2)));
    }

    saveToFile();
    return true;
  },

  toggleAtypicalTransaction(id) {
    const tx = state.cardTransactions.find(t => t.id === id);
    if (!tx) return null;
    tx.isAtypical = !tx.isAtypical;
    saveToFile();
    return tx;
  },

  // Budgets & Centros de Custo (CRUD)
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

  addBudget(item) {
    const newBudget = {
      id: `bg-${Date.now()}`,
      category: item.category || "Nova Categoria",
      description: item.description || "Teto mensal planejado",
      targetAmount: Number(item.targetAmount) || 500,
      spentAmount: Number(item.spentAmount) || 0,
      percentage: 0,
      status: "OK",
      alertNote: item.alertNote || "Meta criada recentemente.",
      shared5050: item.shared5050 !== undefined ? item.shared5050 : true
    };
    state.budgets.push(newBudget);
    saveToFile();
    return newBudget;
  },

  updateBudget(id, updates) {
    const index = state.budgets.findIndex(b => b.id === id);
    if (index === -1) return null;
    state.budgets[index] = { ...state.budgets[index], ...updates };
    saveToFile();
    return state.budgets[index];
  },

  deleteBudget(id) {
    const idx = state.budgets.findIndex(b => b.id === id);
    if (idx === -1) return false;
    state.budgets.splice(idx, 1);
    saveToFile();
    return true;
  },

  // Pix Transactions (CRUD)
  getPixTransactions(month = "2026-10") {
    let list = state.pixTransactions;
    if (month) {
      list = list.filter(p => p.referenceMonth === month);
    }
    return list.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
  },

  addPixTransaction(item) {
    const amount = Number(Number(item.amount).toFixed(2)) || 0;
    const newItem = {
      id: `pix-${Date.now()}`,
      direction: item.direction || 'SAIDA',
      amount,
      partyName: item.partyName || "Favorecido Pix",
      category: item.category || "Geral / Avulso",
      description: item.description || "Transação Pix",
      transactionDate: item.transactionDate || new Date().toISOString(),
      e2eId: item.e2eId || `E${Date.now().toString().padStart(24, '0')}`,
      isAlert: item.isAlert !== undefined ? item.isAlert : (item.direction === 'SAIDA' && amount > 200),
      alertReason: item.alertReason || (item.direction === 'SAIDA' ? "Pix avulso registrado pelo usuário" : null),
      referenceMonth: item.referenceMonth || state.profile.currentMonth || "2026-10"
    };
    if (!state.pixTransactions) state.pixTransactions = [];
    state.pixTransactions.push(newItem);

    // REGRA: "quando eu fizer um lançamento pix atualize o saldo"
    if (!state.profile) state.profile = JSON.parse(JSON.stringify(initialData.profile));
    if (state.profile.currentAccountBalance === undefined) state.profile.currentAccountBalance = 11935.12;
    if (newItem.direction === 'ENTRADA') {
      state.profile.currentAccountBalance = Number((state.profile.currentAccountBalance + amount).toFixed(2));
    } else {
      state.profile.currentAccountBalance = Number((state.profile.currentAccountBalance - amount).toFixed(2));
    }

    saveToFile();
    return newItem;
  },

  deletePixTransaction(id) {
    const idx = state.pixTransactions.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const removed = state.pixTransactions.splice(idx, 1)[0];

    // Reverte impacto no saldo atual ao excluir lançamento Pix
    if (removed && state.profile && state.profile.currentAccountBalance !== undefined) {
      if (removed.direction === 'ENTRADA') {
        state.profile.currentAccountBalance = Number((state.profile.currentAccountBalance - removed.amount).toFixed(2));
      } else {
        state.profile.currentAccountBalance = Number((state.profile.currentAccountBalance + removed.amount).toFixed(2));
      }
    }

    saveToFile();
    return true;
  },

  // Push / SMS Captures
  getSmsPushHistory() {
    return state.smsPushCaptures || [];
  },

  parseAndRecordSmsPush(rawText, source = "iPhone 17 Pro Max Push") {
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

    if (detectedCard !== "Pix Direto Conta" && detectedAmount > 0) {
      let cardId = "card-nubank";
      if (/bradesco/i.test(detectedCard)) cardId = "card-bradesco";
      if (/mercado pago/i.test(detectedCard)) cardId = "card-mercadopago";

      this.addCardTransaction({
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
    
    let cardAlexandreTotal = eligibleCards.reduce((acc, curr) => {
      const share = curr.isShared ? (Number(curr.amount) / 2) : Number(curr.amount);
      return acc + share;
    }, 0);

    // Se o mês ainda não tiver lançamentos individuais de cartão cadastrados,
    // aplicar a Projeção Inteligente de Cartões (Média Supermercado R$ 1.533,28 + Recorrentes R$ 905,90)
    // Parcela auditada de Alexandre: R$ 1.848,25 para manter o balanço fiel e sem falsas ilusões
    if (cards.length === 0) {
      cardAlexandreTotal = 1848.25;
    }

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

    const totalExpensesMonth = totalFixedAlexandre + cardAlexandreTotal + pixOutflowsExtra + (useNewApartment ? housingAdjustment : 0);

    const annualProjectedSavings = Number((magicNumber * 12).toFixed(2));
    const annualProjectedIncome = Number((totalAvailableAlexandre * 12).toFixed(2));

    const savingsRate = totalAvailableAlexandre > 0 ? Number(((magicNumber / totalAvailableAlexandre) * 100).toFixed(1)) : 0;
    const fixedCommitment = totalAvailableAlexandre > 0 ? Number(((totalFixedAlexandre / totalAvailableAlexandre) * 100).toFixed(1)) : 0;

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

  // Relatório de Acerto 50/50 do Casal (Quem deve para quem?)
  calculateCoupleSettlement(month = "2026-10") {
    const formatCurrency = (val) => 'R$ ' + Number(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fixed = this.getFixedExpenses(month);
    const sharedFixed = fixed.filter(f => f.isSplit5050);
    
    // Total de fixas divididas que foram pagas pelo Alexandre
    const sharedFixedPaidByAlex = sharedFixed
      .filter(f => f.beneficiary !== 'AMANDA')
      .reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
    
    // Metade da Amanda nessas fixas pagas pelo Alexandre
    const amandaFixedShareDue = sharedFixed
      .filter(f => f.beneficiary !== 'AMANDA')
      .reduce((acc, curr) => acc + Number(curr.amandaShare), 0);

    // Fixas divididas pagas diretamente pela Amanda
    const sharedFixedPaidByAmanda = sharedFixed
      .filter(f => f.beneficiary === 'AMANDA')
      .reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

    const alexFixedShareDueToAmanda = sharedFixed
      .filter(f => f.beneficiary === 'AMANDA')
      .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);

    // Cartões compartilhados
    const cards = this.getCardTransactions(month);
    const sharedCards = cards.filter(c => c.isShared && !c.isAtypical);
    const totalSharedCards = sharedCards.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const amandaCardShareDue = Number((totalSharedCards / 2).toFixed(2));

    // Wellhub da Amanda pago pelo Alexandre
    const wellhubItems = this.getWellhubReimbursements(month);
    const amandaWellhubItem = wellhubItems.find(w => /amanda/i.test(w.beneficiary));
    const amandaWellhubDue = amandaWellhubItem ? Number(amandaWellhubItem.amount) : 183.30;

    // Outros reembolsos Wellhub recebidos na conta de Alexandre
    const thirdPartyWellhub = wellhubItems
      .filter(w => !/amanda/i.test(w.beneficiary))
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Cálculo líquido final
    // Amanda deve: amandaFixedShareDue + amandaCardShareDue + amandaWellhubDue
    // Menos: alexFixedShareDueToAmanda
    const grossDueAmandaToAlex = Number((amandaFixedShareDue + amandaCardShareDue + amandaWellhubDue).toFixed(2));
    const netDueAmandaToAlex = Number((grossDueAmandaToAlex - alexFixedShareDueToAmanda).toFixed(2));

    const payer = netDueAmandaToAlex >= 0 ? "Amanda" : "Alexandre";
    const receiver = netDueAmandaToAlex >= 0 ? "Alexandre" : "Amanda";
    const netAmount = Math.abs(netDueAmandaToAlex);

    return {
      referenceMonth: month,
      summary: {
        payer,
        receiver,
        netAmount,
        actionText: `${payer} deve transferir ${formatCurrency(netAmount)} para ${receiver} via Pix`,
        pixKey: "alexandre@muriae.financas",
        isSettled: false
      },
      breakdown: {
        sharedFixed: {
          totalShared: sharedFixedPaidByAlex + sharedFixedPaidByAmanda,
          paidByAlexandre: sharedFixedPaidByAlex,
          paidByAmanda: sharedFixedPaidByAmanda,
          amandaLiability: amandaFixedShareDue,
          alexandreLiability: alexFixedShareDueToAmanda
        },
        sharedCards: {
          totalShared: totalSharedCards,
          amandaLiability: amandaCardShareDue,
          count: sharedCards.length
        },
        wellhub: {
          amandaShare: amandaWellhubDue,
          thirdPartyReceived: thirdPartyWellhub,
          totalCredits: amandaWellhubDue + thirdPartyWellhub
        }
      }
    };
  },

  // Motor de Importação de Extratos Bancários (OFX e CSV)
  importStatementTransactions(fileContent, fileName = "extrato.ofx", targetCardId = "card-nubank") {
    const isOfx = fileName.toLowerCase().endsWith('.ofx') || fileContent.includes('<OFX>') || fileContent.includes('<STMTTRN>');
    const transactionsParsed = [];

    const card = state.creditCards.find(c => c.id === targetCardId) || state.creditCards[0];
    const cardName = card.cardName;

    if (isOfx) {
      // Parser Regex para blocos <STMTTRN>
      const trnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
      let match;

      while ((match = trnRegex.exec(fileContent)) !== null) {
        const block = match[1];

        const trnAmtMatch = block.match(/<TRNAMT>([\d\.\-]+)/i);
        const dtPostedMatch = block.match(/<DTPOSTED>(\d{8})/i);
        const memoMatch = block.match(/<MEMO>(.*?)(?:<|$)/i);
        const nameMatch = block.match(/<NAME>(.*?)(?:<|$)/i);

        if (trnAmtMatch && dtPostedMatch) {
          let rawAmount = parseFloat(trnAmtMatch[1]);
          // No cartão de crédito OFX, despesas costumam vir positivas ou negativas dependendo do banco
          let amount = Math.abs(rawAmount);

          const rawDate = dtPostedMatch[1]; // YYYYMMDD
          const year = rawDate.slice(0, 4);
          const month = rawDate.slice(4, 6);
          const day = rawDate.slice(6, 8);
          const transactionDate = `${year}-${month}-${day}`;

          const description = (memoMatch ? memoMatch[1] : (nameMatch ? nameMatch[1] : "Compra no Cartão")).trim();

          transactionsParsed.push({
            establishment: description,
            amount,
            transactionDate,
            rawDate
          });
        }
      }
    } else {
      // Parser CSV (linhas separadas por vírgula ou ponto-e-vírgula)
      const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Pular cabeçalho
        if (i === 0 && (/data|date|valor|amount|title/i.test(line))) continue;

        const separator = line.includes(';') ? ';' : ',';
        const cols = line.split(separator).map(c => c.replace(/["']/g, '').trim());

        if (cols.length >= 3) {
          // Detectar data (YYYY-MM-DD ou DD/MM/YYYY)
          let dateStr = cols[0];
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
            const parts = dateStr.split('/');
            dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }

          // Detectar valor
          let amtStr = cols[cols.length - 1].replace('R$', '').trim();
          if (amtStr.includes(',') && amtStr.includes('.')) {
            amtStr = amtStr.replace('.', '').replace(',', '.');
          } else if (amtStr.includes(',')) {
            amtStr = amtStr.replace(',', '.');
          }
          const amount = Math.abs(parseFloat(amtStr)) || 0;

          // Descrição / Estabelecimento
          const description = cols[1] || cols[2] || "Compra no Cartão";

          if (amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            transactionsParsed.push({
              establishment: description,
              amount,
              transactionDate: dateStr
            });
          }
        }
      }
    }

    // Categorização inteligente para Muriaé/MG & Deduplicação
    let importedCount = 0;
    let skippedCount = 0;
    const addedItems = [];

    for (const item of transactionsParsed) {
      const lower = item.establishment.toLowerCase();

      let category = "Outros / Diversos";
      if (/bahamas|supermercados bh|bh muriae|top frut|mercado|hortifruti/i.test(lower)) {
        category = "Supermercados Muriaé";
      } else if (/faisao|posto dm|combustivel|ipiranga|shell|gasolina/i.test(lower)) {
        category = "Combustível & Transporte";
      } else if (/indiana|drogaria|farmacia|medicamentos/i.test(lower)) {
        category = "Farmácia & Medicamentos";
      } else if (/unimed/i.test(lower)) {
        category = "Saúde Individual (Alexandre)";
      } else if (/academia|smart fit/i.test(lower)) {
        category = "Saúde & Fitness";
      } else if (/demsur|energisa|fibra/i.test(lower)) {
        category = "Contas de Consumo";
      }

      // Checar se já existe transação igual (mesma data, mesmo valor aproximado e mesmo estabelecimento)
      const isDuplicate = state.cardTransactions.some(existing => 
        existing.cardId === targetCardId &&
        existing.transactionDate === item.transactionDate &&
        Math.abs(existing.amount - item.amount) < 0.05 &&
        existing.establishment.toLowerCase() === item.establishment.toLowerCase()
      );

      if (isDuplicate) {
        skippedCount++;
        continue;
      }

      const referenceMonth = item.transactionDate.slice(0, 7) || "2026-10";
      const isAtypical = /funilaria|reforma|reparo emergencial/i.test(lower);

      const newTx = {
        id: `tx-imp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        cardId: targetCardId,
        cardName,
        establishment: item.establishment,
        category,
        amount: item.amount,
        transactionDate: item.transactionDate,
        installmentInfo: "Importado via Extrato",
        isAtypical,
        atypicalReason: isAtypical ? "Despesa classificada como atípica" : null,
        referenceMonth,
        isShared: true
      };

      state.cardTransactions.push(newTx);
      addedItems.push(newTx);
      importedCount++;

      // Atualizar limites do cartão
      card.usedLimit = Number((card.usedLimit + item.amount).toFixed(2));
      card.availableLimit = Number((card.creditLimit - card.usedLimit).toFixed(2));
      card.currentInvoice = Number((card.currentInvoice + item.amount).toFixed(2));
    }

    saveToFile();

    return {
      status: "SUCCESS",
      cardId: targetCardId,
      cardName,
      totalParsed: transactionsParsed.length,
      importedCount,
      skippedCount,
      transactions: addedItems
    };
  },

  resetDatabase() {
    state = JSON.parse(JSON.stringify(initialData));
    saveToFile();
    return { success: true, message: "Database reset to initial pre-loaded state" };
  }
};
