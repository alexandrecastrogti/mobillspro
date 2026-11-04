/**
 * MobillsPro - Motor de Regras Financeiras Puras
 * Alexandre & Amanda - Muriaé/MG
 * 
 * Todas as funções são puras (sem efeitos colaterais, determinísticas e testáveis).
 */

/**
 * 1. Calcula a Receita Mensal Total
 * @param {number} salario - Salário líquido do Alexandre (ex: 9996.21)
 * @param {number} monitoria - Bolsa de monitoria acadêmica (ex: 1100.00)
 * @returns {number} Receita própria total (ex: 11096.21)
 */
export function calculateIncome(salario, monitoria) {
  const s = Number(salario) || 0;
  const m = Number(monitoria) || 0;
  return Number((s + m).toFixed(2));
}

/**
 * 2. Calcula Reembolsos Wellhub
 * "Reembolsos Wellhub somam como crédito na renda, não como receita nova."
 * @param {Array<{beneficiary: string, amount: number}>} reembolsos
 * @returns {{ total: number, items: Array<{beneficiary: string, amount: number}> }}
 */
export function calculateWellhubCredits(reembolsos = []) {
  const total = reembolsos.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  return {
    total: Number(total.toFixed(2)),
    items: reembolsos.map(r => ({ ...r, amount: Number(Number(r.amount).toFixed(2)) }))
  };
}

/**
 * 3. Calcula Disponibilidade Financeira Total
 * Receita + Créditos de Reembolso
 */
export function calculateTotalAvailable(income, wellhubCredits) {
  const inc = Number(income) || 0;
  const wh = Number(wellhubCredits) || 0;
  return Number((inc + wh).toFixed(2));
}

/**
 * 4. Divisão e Cálculo de Contas Fixas
 * "Divisão 50/50 em todas as fixas, exceto Unimed individual e Academia Alexandre (pagas integralmente pelo Alexandre)."
 * @param {Array<{title: string, totalAmount: number, isSplit5050?: boolean, status?: string, dueDay?: number}>} expenses
 * @returns {{
 *   totalFull: number,
 *   totalAlexandre: number,
 *   paidAlexandre: number,
 *   pendingAlexandre: number,
 *   items: Array<any>
 * }}
 */
export function calculateFixedExpensesShares(expenses = []) {
  let totalFull = 0;
  let totalAlexandre = 0;
  let paidAlexandre = 0;
  let pendingAlexandre = 0;

  const processed = expenses.map(exp => {
    const full = Number(exp.totalAmount) || 0;
    const isUnimed = /unimed/i.test(exp.title || '');
    const isAcademia = /academia/i.test(exp.title || '');
    const isWellhubPlan = /wellhub/i.test(exp.title || '');

    // Se é 50/50: divide por 2; se Unimed ou Academia ou plano titular individual pago por ele: 100% Alexandre
    const isSplit = exp.isSplit5050 !== undefined ? exp.isSplit5050 : (!isUnimed && !isAcademia && !isWellhubPlan);
    
    const alexShare = isSplit ? Number((full / 2).toFixed(2)) : full;
    const amandaShare = isSplit ? Number((full - alexShare).toFixed(2)) : 0;
    const isPaid = exp.status === 'PAGO';

    totalFull += full;
    totalAlexandre += alexShare;

    if (isPaid) {
      paidAlexandre += alexShare;
    } else {
      pendingAlexandre += alexShare;
    }

    return {
      ...exp,
      totalAmount: full,
      alexandreShare: alexShare,
      amandaShare: amandaShare,
      isSplit5050: isSplit,
      status: isPaid ? 'PAGO' : 'PENDENTE'
    };
  });

  return {
    totalFull: Number(totalFull.toFixed(2)),
    totalAlexandre: Number(totalAlexandre.toFixed(2)),
    paidAlexandre: Number(paidAlexandre.toFixed(2)),
    pendingAlexandre: Number(pendingAlexandre.toFixed(2)),
    items: processed
  };
}

/**
 * 5. Projeção de Gastos em Cartões
 * "Projeção de cartões = média de mercado (1.533,28) + média dos outros gastos recorrentes,
 * ignorando atípicos e parcelas encerradas."
 * @param {number[]} marketHistory - Histórico mensal de supermercados [1300, 1350, 1280, 1400, 1269.58, 2600.10]
 * @param {Array<{name: string, amount: number}>} recurringExpenses - Outros gastos recorrentes
 * @param {Array<{name: string, amount: number, reason: string}>} excludedTransactions - Lançamentos excluídos
 */
export function calculateCardProjection(
  marketHistory = [1300.00, 1350.00, 1280.00, 1400.00, 1269.58, 2600.10],
  recurringExpenses = [
    { name: 'Posto/combustível', amount: 480.00 },
    { name: 'iFood', amount: 220.00 },
    { name: 'Streaming', amount: 55.90 },
    { name: 'Farmácia', amount: 150.00 }
  ],
  excludedTransactions = [
    { name: 'Funilaria', amount: 1000.00, month: '2026-10', reason: 'Atípico' },
    { name: 'Parcela Magazine', amount: 389.90, card: 'Bradesco', reason: 'Encerrada' }
  ]
) {
  const sumMarket = marketHistory.reduce((a, b) => a + Number(b), 0);
  const countMarket = marketHistory.length || 1;
  const marketAverage = Number((sumMarket / countMarket).toFixed(2));
  const marketPeak = Math.max(...marketHistory);

  const recurringTotal = recurringExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const cardProjection = Number((marketAverage + recurringTotal).toFixed(2));

  const totalExcluded = excludedTransactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return {
    marketAverage,
    marketPeak,
    marketHistory,
    recurringExpenses,
    recurringTotal: Number(recurringTotal.toFixed(2)),
    cardProjection,
    excludedTransactions,
    totalExcluded: Number(totalExcluded.toFixed(2))
  };
}

/**
 * 6. Totais e Balanço de Lançamentos Pix
 * @param {Array<{description: string, amount: number, direction: 'IN' | 'OUT'}>} transactions
 */
export function calculatePixTotals(transactions = []) {
  let entries = 0;
  let outflows = 0;

  for (const t of transactions) {
    const isEntry = t.direction ? t.direction === 'IN' : Number(t.amount) > 0;
    const val = Math.abs(Number(t.amount) || 0);
    if (isEntry) {
      entries += val;
    } else {
      outflows += val;
    }
  }

  return {
    entries: Number(entries.toFixed(2)),
    outflows: Number(outflows.toFixed(2)),
    net: Number((entries - outflows).toFixed(2))
  };
}

/**
 * 7. Rendimento Selic / CDB com Juros Compostos
 * "Selic/CDB renderizam 13,75% ao ano com juros compostos:
 * montante = principal × (1 + taxa)^meses, onde taxa = (1 + 0,1375)^(1/12) − 1."
 * @param {number} principal - Valor inicial investido
 * @param {number} annualRate - Taxa anual (ex: 0.1375 para 13,75%)
 * @param {number} months - Número de meses (ex: 12)
 * @returns {{ montante: number, rendimento: number, monthlyRate: number }}
 */
export function calculateSelicCompoundInterest(principal = 10000, annualRate = 0.1375, months = 12) {
  const p = Number(principal) || 0;
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  const montante = p * Math.pow(1 + monthlyRate, months);
  const rendimento = montante - p;

  return {
    principal: p,
    annualRate,
    months,
    monthlyRate,
    montante: Number(montante.toFixed(2)),
    rendimento: Number(rendimento.toFixed(2))
  };
}

/**
 * 8. Consolidação de Investimentos e Patrimônio Total da Família
 * @param {Array<{name: string, amount: number, currency: string, exchangeRate?: number}>} investments
 */
export function calculateConsolidatedWealth(
  investments = [
    { name: 'Nomad do Augusto', amount: 2500.00, currency: 'USD', exchangeRate: 5.40 },
    { name: 'CDB', amount: 15000.00, currency: 'BRL', exchangeRate: 1.0 },
    { name: 'Tesouro Selic', amount: 10000.00, currency: 'BRL', exchangeRate: 1.0 }
  ],
  selicAnnualRate = 0.1375
) {
  let totalBrl = 0;
  const items = investments.map(inv => {
    const exRate = inv.currency === 'USD' ? (inv.exchangeRate || 5.40) : 1.0;
    const valueBrl = Number((inv.amount * exRate).toFixed(2));
    totalBrl += valueBrl;

    let projection12m = valueBrl;
    if (inv.currency === 'BRL') {
      projection12m = calculateSelicCompoundInterest(valueBrl, selicAnnualRate, 12).montante;
    }

    return {
      ...inv,
      exchangeRate: exRate,
      valueBrl,
      projection12m: Number(projection12m.toFixed(2))
    };
  });

  return {
    totalWealthBrl: Number(totalBrl.toFixed(2)),
    items
  };
}

/**
 * 9. Comparação de Cenários Habitacionais (Atual vs Novo Apto Centro Caixa SAC)
 * "Moradia: comparação sempre na metade de quem paga 50/50; mostre a economia de combustível separadamente."
 */
export function calculateHousingComparison(
  current = {
    rentFull: 1621.00,
    landFull: 2686.52,
    fuelExpense: 480.00
  },
  newCenter = {
    financingSac: 3231.32,
    condoShare: 250.00,
    fuelExpense: 90.00
  }
) {
  const currentRentShare = Number((current.rentFull / 2).toFixed(2)); // 810.50
  const currentLandShare = Number((current.landFull / 2).toFixed(2)); // 1343.26
  const currentFuel = Number(current.fuelExpense.toFixed(2)); // 480.00
  const currentTotal = Number((currentRentShare + currentLandShare + currentFuel).toFixed(2)); // 2633.76

  const newFinancingShare = Number(newCenter.financingSac.toFixed(2)); // 3231.32
  const newCondoShare = Number(newCenter.condoShare.toFixed(2)); // 250.00
  const newFuel = Number(newCenter.fuelExpense.toFixed(2)); // 90.00
  const newTotal = Number((newFinancingShare + newCondoShare + newFuel).toFixed(2)); // 3571.32

  const fuelSavings = Number((currentFuel - newFuel).toFixed(2)); // 390.00 de economia
  const monthlyDifference = Number((newTotal - currentTotal).toFixed(2)); // +937.56

  return {
    current: {
      rentShare: currentRentShare,
      landShare: currentLandShare,
      fuelExpense: currentFuel,
      total: currentTotal
    },
    newCenter: {
      financingShare: newFinancingShare,
      condoShare: newCondoShare,
      fuelExpense: newFuel,
      total: newTotal
    },
    fuelSavings,
    monthlyDifference
  };
}

/**
 * 10. Cálculo Oficial do Número Mágico (Saldo Livre Real)
 * livre = receita + reembolsos + pixEntradas − minhaParteFixas − pixSaídas − projecaoCartoes
 */
export function calculateMagicNumber({
  income = 11096.21,
  wellhubCredits = 549.90,
  pixIn = 350.00,
  myFixedShare = 3966.86,
  myPaidFixed = 0,
  pixOut = 225.00,
  cardProjection = 2439.18,
  useNewApartment = false,
  housingDifference = 937.56
}) {
  const totalInflows = Number((income + wellhubCredits + pixIn).toFixed(2));
  const myPendingFixed = Number((myFixedShare - myPaidFixed).toFixed(2));

  const baseOutflows = Number((myFixedShare + pixOut + cardProjection).toFixed(2));
  const housingImpact = useNewApartment ? housingDifference : 0;
  const totalOutflows = Number((baseOutflows + housingImpact).toFixed(2));

  const magicNumber = Number((totalInflows - totalOutflows).toFixed(2));

  const currentDisbursedOutflows = Number((myPaidFixed + pixOut + cardProjection + housingImpact).toFixed(2));
  const currentFreeCash = Number((totalInflows - currentDisbursedOutflows).toFixed(2));

  return {
    totalInflows,
    income,
    wellhubCredits,
    pixIn,
    myFixedShare,
    myPaidFixed,
    myPendingFixed,
    pixOut,
    cardProjection,
    useNewApartment,
    housingImpact,
    totalOutflows,
    magicNumber,
    currentFreeCash,
    isPositive: magicNumber >= 0,
    statusText: magicNumber >= 0 ? 'SALDO LIVRE POSITIVO' : 'DÉFICIT PROJETADO'
  };
}

/**
 * 11. Método 50/30/20 (Planejamento Financeiro Doméstico - Baseado na Planilha do Alexandre & Amanda)
 * 50% - Despesas Fixas (Essenciais)
 * 30% - Despesas Variáveis / Vontades (Lifestyle, Cartões, Lazer)
 * 20% - Reserva Financeira / Investimentos (Selic, Nomad USD, Ações)
 * 
 * @param {number} netIncome - Receita líquida mensal total
 * @param {number} fixedExpenses - Total realizado em despesas fixas (essenciais)
 * @param {number} variableExpenses - Total realizado em variáveis (cartões/vontades)
 * @param {number} investments - Total realizado em reservas/investimentos
 */
export function calculateBudget503020(netIncome, fixedExpenses, variableExpenses, investments = 0) {
  const income = Number(netIncome) || 0;
  const fixed = Number(fixedExpenses) || 0;
  const variable = Number(variableExpenses) || 0;
  const invested = Number(investments) || 0;

  // Tetos ideais segundo a regra clássica 50/30/20
  const target50 = Number((income * 0.50).toFixed(2));
  const target30 = Number((income * 0.30).toFixed(2));
  const target20 = Number((income * 0.20).toFixed(2));

  // Percentuais reais realizados sobre a receita líquida
  const pct50 = income > 0 ? Number(((fixed / income) * 100).toFixed(1)) : 0;
  const pct30 = income > 0 ? Number(((variable / income) * 100).toFixed(1)) : 0;
  const pct20 = income > 0 ? Number(((invested / income) * 100).toFixed(1)) : 0;

  // Sobras ou estouros por categoria (positivo = dentro do teto / economizou, negativo = extrapolou)
  const diff50 = Number((target50 - fixed).toFixed(2));
  const diff30 = Number((target30 - variable).toFixed(2));
  const diff20 = Number((invested - target20).toFixed(2)); // >= 0 meta atingida

  const totalSpent = Number((fixed + variable).toFixed(2));
  const availableToInvest = Number((income - totalSpent).toFixed(2));

  return {
    netIncome: income,
    essential50: {
      target: target50,
      actual: fixed,
      percentage: pct50,
      targetPercentage: 50,
      diff: diff50,
      status: fixed <= target50 ? 'OK' : 'EXCEEDED',
      label: '50% - Despesas Fixas (Essenciais)'
    },
    lifestyle30: {
      target: target30,
      actual: variable,
      percentage: pct30,
      targetPercentage: 30,
      diff: diff30,
      status: variable <= target30 ? 'OK' : 'EXCEEDED',
      label: '30% - Despesas Variáveis (Vontades)'
    },
    investment20: {
      target: target20,
      actual: invested,
      percentage: pct20,
      targetPercentage: 20,
      diff: diff20,
      status: invested >= target20 ? 'OK' : 'BELOW_TARGET',
      label: '20% - Reserva Financeira (Investimentos)'
    },
    totalSpent,
    availableToInvest,
    isBalanced: fixed <= target50 && variable <= target30
  };
}
