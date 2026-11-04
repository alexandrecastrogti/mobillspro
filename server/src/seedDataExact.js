/**
 * MobillsPro - Dataset Exato de Seed Idempotente
 * Alexandre & Amanda - Muriaé/MG
 * 
 * Regra: "Não invente valores: use exatamente os números da Seção 3".
 */

export const exactSeedData = {
  users: [
    {
      id: "usr-alexandre",
      email: "alexandre@mobillspro.com",
      name: "Alexandre",
      // Muriae2026!
      passwordHash: "$2b$08$rQhTGJvRi4n85mconlK1PuMrOlv/4vMj7AMO5zfDMK7S//24bJ41u",
      role: "owner"
    },
    {
      id: "usr-amanda",
      email: "amanda@mobillspro.com",
      name: "Amanda",
      passwordHash: "$2b$08$rQhTGJvRi4n85mconlK1PuMrOlv/4vMj7AMO5zfDMK7S//24bJ41u",
      role: "partner"
    },
    {
      id: "usr-viewer",
      email: "viewer@mobillspro.com",
      name: "Visitante",
      passwordHash: "$2b$08$rQhTGJvRi4n85mconlK1PuMrOlv/4vMj7AMO5zfDMK7S//24bJ41u",
      role: "viewer"
    }
  ],

  incomes: [
    {
      id: "inc-salario",
      userName: "Alexandre",
      description: "Salário Líquido Alexandre",
      amount: 9996.21,
      category: "Salário",
      isRecurring: true,
      referenceMonth: "2026-10"
    },
    {
      id: "inc-monitoria",
      userName: "Alexandre",
      description: "Monitoria",
      amount: 1100.00,
      category: "Monitoria",
      isRecurring: true,
      referenceMonth: "2026-10"
    }
  ],

  reimbursements: [
    {
      id: "wh-amanda",
      beneficiary: "Amanda",
      planName: "Wellhub Silver",
      amount: 183.30,
      status: "CREDITADO",
      referenceMonth: "2026-10"
    },
    {
      id: "wh-taiana",
      beneficiary: "Taiana",
      planName: "Wellhub Silver",
      amount: 183.30,
      status: "CREDITADO",
      referenceMonth: "2026-10"
    },
    {
      id: "wh-nilvana",
      beneficiary: "Nilvana",
      planName: "Wellhub Silver",
      amount: 183.30,
      status: "CREDITADO",
      referenceMonth: "2026-10"
    }
  ],

  fixedExpenses: [
    {
      id: "fix-aluguel",
      title: "Aluguel",
      category: "Moradia",
      totalAmount: 1621.00,
      alexandreShare: 810.50,
      amandaShare: 810.50,
      isSplit5050: true,
      beneficiary: "COMPARTILHADO",
      dueDay: 5,
      referenceMonth: "2026-10",
      status: "PAGO",
      paidAt: "2026-10-05T10:00:00Z"
    },
    {
      id: "fix-terreno",
      title: "Parcela do Terreno",
      category: "Patrimônio",
      totalAmount: 2686.52,
      alexandreShare: 1343.26,
      amandaShare: 1343.26,
      isSplit5050: true,
      beneficiary: "COMPARTILHADO",
      dueDay: 10,
      referenceMonth: "2026-10",
      status: "PAGO",
      paidAt: "2026-10-10T11:00:00Z"
    },
    {
      id: "fix-energia",
      title: "Energia (Cemig)",
      category: "Consumo",
      totalAmount: 280.00,
      alexandreShare: 140.00,
      amandaShare: 140.00,
      isSplit5050: true,
      beneficiary: "COMPARTILHADO",
      dueDay: 12,
      referenceMonth: "2026-10",
      status: "PAGO",
      paidAt: "2026-10-12T14:30:00Z"
    },
    {
      id: "fix-agua",
      title: "Água (Copasa)",
      category: "Consumo",
      totalAmount: 120.00,
      alexandreShare: 60.00,
      amandaShare: 60.00,
      isSplit5050: true,
      beneficiary: "COMPARTILHADO",
      dueDay: 15,
      referenceMonth: "2026-10",
      status: "PENDENTE",
      paidAt: null
    },
    {
      id: "fix-internet",
      title: "Internet",
      category: "Consumo",
      totalAmount: 120.00,
      alexandreShare: 60.00,
      amandaShare: 60.00,
      isSplit5050: true,
      beneficiary: "COMPARTILHADO",
      dueDay: 20,
      referenceMonth: "2026-10",
      status: "PENDENTE",
      paidAt: null
    },
    {
      id: "fix-unimed",
      title: "Unimed (individual)",
      category: "Saúde",
      totalAmount: 690.00,
      alexandreShare: 690.00,
      amandaShare: 0.00,
      isSplit5050: false,
      beneficiary: "ALEXANDRE",
      dueDay: 8,
      referenceMonth: "2026-10",
      status: "PAGO",
      paidAt: "2026-10-08T09:00:00Z"
    },
    {
      id: "fix-academia",
      title: "Academia Alexandre",
      category: "Saúde & Fitness",
      totalAmount: 129.90,
      alexandreShare: 129.90,
      amandaShare: 0.00,
      isSplit5050: false,
      beneficiary: "ALEXANDRE",
      dueDay: 10,
      referenceMonth: "2026-10",
      status: "PAGO",
      paidAt: "2026-10-10T08:30:00Z"
    },
    {
      id: "fix-wellhub",
      title: "Wellhub (4 planos)",
      category: "Benefícios & Saúde",
      totalAmount: 733.20,
      alexandreShare: 733.20,
      amandaShare: 0.00,
      isSplit5050: false,
      beneficiary: "ALEXANDRE",
      dueDay: 1,
      referenceMonth: "2026-10",
      status: "PAGO",
      paidAt: "2026-10-01T07:00:00Z"
    }
  ],

  // Histórico de Mercado (Maio a Outubro/2026)
  marketHistory: [
    { month: "2026-05", label: "Maio/2026", amount: 1300.00, isPeak: false },
    { month: "2026-06", label: "Junho/2026", amount: 1350.00, isPeak: false },
    { month: "2026-07", label: "Julho/2026", amount: 1280.00, isPeak: false },
    { month: "2026-08", label: "Agosto/2026", amount: 1400.00, isPeak: false },
    { month: "2026-09", label: "Setembro/2026", amount: 1269.58, isPeak: false },
    { month: "2026-10", label: "Outubro/2026", amount: 2600.10, isPeak: true }
  ],

  // Outros gastos mensais recorrentes
  recurringExpenses: [
    { id: "rec-posto", name: "Posto/combustível", amount: 480.00, category: "Transporte" },
    { id: "rec-ifood", name: "iFood", amount: 220.00, category: "Alimentação Fora" },
    { id: "rec-streaming", name: "Streaming", amount: 55.90, category: "Assinaturas" },
    { id: "rec-farmacia", name: "Farmácia", amount: 150.00, category: "Saúde" }
  ],

  // Lançamentos Excluídos da Projeção (com auditoria)
  excludedTransactions: [
    {
      id: "card-funilaria",
      cardName: "Nubank Ultravioleta",
      month: "2026-10",
      merchant: "Oficina Funilaria Muriaé",
      category: "Veículo / Atípico",
      amount: 1000.00,
      isExcluded: true,
      exclusionReason: "Reparo emergencial de pintura e lataria (gasto atípico não recorrente)",
      isAtypical: true,
      isShared: false
    },
    {
      id: "card-magazine",
      cardName: "Bradesco Visa",
      month: "2026-10",
      merchant: "Magazine Luiza",
      category: "Eletrodomésticos",
      amount: 389.90,
      isExcluded: true,
      exclusionReason: "Última parcela quitada (compromisso encerrado que não se repetirá)",
      isAtypical: false,
      isShared: false
    }
  ],

  // Movimentações Pix do mês atual
  pixTransactions: [
    {
      id: "pix-olx",
      date: "2026-10-18",
      description: "Recebido venda OLX",
      amount: 350.00,
      direction: "IN",
      category: "Vendas / Receitas Extras",
      referenceMonth: "2026-10"
    },
    {
      id: "pix-diarista",
      date: "2026-10-22",
      description: "Enviado diarista",
      amount: 180.00,
      direction: "OUT",
      category: "Serviços Domésticos",
      referenceMonth: "2026-10"
    },
    {
      id: "pix-barbeiro",
      date: "2026-10-24",
      description: "Enviado barbeiro",
      amount: 45.00,
      direction: "OUT",
      category: "Cuidados Pessoais",
      referenceMonth: "2026-10"
    }
  ],

  // Cenários de Moradia
  housingScenarios: {
    current: {
      id: "house-current",
      name: "Moradia Atual",
      rentShare: 810.50,
      landShare: 1343.26,
      financingShare: 0.00,
      condoShare: 0.00,
      fuelExpense: 480.00,
      isCurrent: true
    },
    newCenter: {
      id: "house-center",
      name: "Novo Apto Centro (Caixa SAC)",
      rentShare: 0.00,
      landShare: 0.00,
      financingShare: 3231.32,
      condoShare: 250.00,
      fuelExpense: 90.00,
      fuelSavings: 390.00,
      isCurrent: false
    }
  },

  // Investimentos
  investments: [
    {
      id: "inv-nomad",
      name: "Nomad do Augusto",
      type: "Dólar / Internacional",
      amount: 2500.00,
      currency: "USD",
      exchangeRate: 5.40,
      selicAnnualRate: 13.75,
      maturityMonths: 12
    },
    {
      id: "inv-cdb",
      name: "CDB",
      type: "Renda Fixa Pós-Fixada",
      amount: 15000.00,
      currency: "BRL",
      exchangeRate: 1.0,
      selicAnnualRate: 13.75,
      maturityMonths: 12
    },
    {
      id: "inv-selic",
      name: "Tesouro Selic",
      type: "Título Público",
      amount: 10000.00,
      currency: "BRL",
      exchangeRate: 1.0,
      selicAnnualRate: 13.75,
      maturityMonths: 12
    }
  ]
};

