import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateIncome,
  calculateWellhubCredits,
  calculateTotalAvailable,
  calculateFixedExpensesShares,
  calculateCardProjection,
  calculatePixTotals,
  calculateSelicCompoundInterest,
  calculateConsolidatedWealth,
  calculateHousingComparison,
  calculateMagicNumber,
  calculateBudget503020
} from '../../shared/financeEngine.js';

describe('MobillsPro - Regras de Negócio e Funções Puras de Finanças', () => {

  it('Critério 1: Receita total deve ser exatamente R$ 11.096,21 (Salário 9.996,21 + Monitoria 1.100,00)', () => {
    const total = calculateIncome(9996.21, 1100.00);
    assert.equal(total, 11096.21, 'Receita de Alexandre deve ser R$ 11.096,21');
  });

  it('Critério 2: Reembolsos Wellhub devem somar exatamente R$ 549,90 e entrar como crédito na renda', () => {
    const reembolsos = [
      { beneficiary: 'Amanda', amount: 183.30 },
      { beneficiary: 'Taiana', amount: 183.30 },
      { beneficiary: 'Nilvana', amount: 183.30 }
    ];
    const { total, items } = calculateWellhubCredits(reembolsos);
    assert.equal(total, 549.90, 'Total de reembolsos deve ser R$ 549,90');
    assert.equal(items.length, 3);

    const disponibilidade = calculateTotalAvailable(11096.21, total);
    assert.equal(disponibilidade, 11646.11, 'Disponibilidade total deve ser R$ 11.646,11');
  });

  it('Critério 3: Divisão 50/50 em fixas exceto Unimed e Academia Alexandre (Aluguel 810,50 e Terreno 1.343,26)', () => {
    const fixedExpenses = [
      { title: 'Aluguel', totalAmount: 1621.00, isSplit5050: true, dueDay: 5, status: 'PAGO' },
      { title: 'Parcela do Terreno', totalAmount: 2686.52, isSplit5050: true, dueDay: 10, status: 'PENDENTE' },
      { title: 'Energia (Cemig)', totalAmount: 280.00, isSplit5050: true, dueDay: 12, status: 'PENDENTE' },
      { title: 'Água (Copasa)', totalAmount: 120.00, isSplit5050: true, dueDay: 15, status: 'PENDENTE' },
      { title: 'Internet', totalAmount: 120.00, isSplit5050: true, dueDay: 20, status: 'PENDENTE' },
      { title: 'Unimed (individual)', totalAmount: 690.00, isSplit5050: false, dueDay: 8, status: 'PAGO' },
      { title: 'Academia Alexandre', totalAmount: 129.90, isSplit5050: false, dueDay: 10, status: 'PAGO' },
      { title: 'Wellhub (4 planos)', totalAmount: 733.20, isSplit5050: false, dueDay: 1, status: 'PAGO' }
    ];

    const result = calculateFixedExpensesShares(fixedExpenses);

    const aluguel = result.items.find(i => i.title === 'Aluguel');
    assert.equal(aluguel.alexandreShare, 810.50, 'Metade do aluguel deve ser R$ 810,50');

    const terreno = result.items.find(i => i.title === 'Parcela do Terreno');
    assert.equal(terreno.alexandreShare, 1343.26, 'Metade da parcela do terreno deve ser R$ 1.343,26');

    const unimed = result.items.find(i => i.title.includes('Unimed'));
    assert.equal(unimed.alexandreShare, 690.00, 'Unimed deve ser 100% Alexandre');

    const academia = result.items.find(i => i.title.includes('Academia'));
    assert.equal(academia.alexandreShare, 129.90, 'Academia deve ser 100% Alexandre');

    assert.equal(result.totalAlexandre, 3966.86, 'Total da parte do Alexandre nas fixas deve ser R$ 3.966,86');
    assert.ok(result.paidAlexandre > 0, 'Parte paga deve ser positiva');
    assert.ok(result.pendingAlexandre > 0, 'Parte pendente deve ser positiva');
    assert.equal(
      Number((result.paidAlexandre + result.pendingAlexandre).toFixed(2)),
      result.totalAlexandre,
      'Soma de pago + pendente deve ser rigorosamente igual ao total'
    );
  });

  it('Critério 4: Média de mercado deve ser R$ 1.533,28 com pico de R$ 2.600,10 e projeção excluindo atípicos', () => {
    const marketHistory = [1300.00, 1350.00, 1280.00, 1400.00, 1269.58, 2600.10];
    const recurring = [
      { name: 'Posto/combustível', amount: 480.00 },
      { name: 'iFood', amount: 220.00 },
      { name: 'Streaming', amount: 55.90 },
      { name: 'Farmácia', amount: 150.00 }
    ];
    const excluded = [
      { name: 'Funilaria', amount: 1000.00, reason: 'Atípico' },
      { name: 'Parcela Magazine', amount: 389.90, reason: 'Encerrada' }
    ];

    const projection = calculateCardProjection(marketHistory, recurring, excluded);

    assert.equal(projection.marketAverage, 1533.28, 'Média dos 6 meses de supermercados deve ser R$ 1.533,28');
    assert.equal(projection.marketPeak, 2600.10, 'Pico de supermercados em outubro deve ser R$ 2.600,10');
    assert.equal(projection.recurringTotal, 905.90, 'Total de outros gastos recorrentes deve ser R$ 905,90');
    assert.equal(projection.cardProjection, 2439.18, 'Projeção de cartões deve ser 1533,28 + 905,90 = R$ 2.439,18');
    assert.equal(projection.totalExcluded, 1389.90, 'Total de exclusões auditadas deve ser R$ 1.389,90');
  });

  it('Critério 5: Movimentações Pix do mês atual (+350 OLX, -180 diarista, -45 barbeiro)', () => {
    const pix = [
      { description: 'Venda OLX', amount: 350.00, direction: 'IN' },
      { description: 'Diarista', amount: 180.00, direction: 'OUT' },
      { description: 'Barbeiro', amount: 45.00, direction: 'OUT' }
    ];

    const result = calculatePixTotals(pix);
    assert.equal(result.entries, 350.00, 'Entradas Pix devem ser R$ 350,00');
    assert.equal(result.outflows, 225.00, 'Saídas Pix devem ser R$ 225,00');
    assert.equal(result.net, 125.00, 'Saldo líquido Pix deve ser +R$ 125,00');
  });

  it('Critério 6: Selic 10.000 em 12 meses a 13,75% a.a. com juros compostos deve ser exatamente R$ 11.375,00', () => {
    const result = calculateSelicCompoundInterest(10000, 0.1375, 12);
    assert.equal(result.montante, 11375.00, 'Montante final após 12 meses à Selic 13,75% deve ser R$ 11.375,00');
    assert.equal(result.rendimento, 1375.00, 'Rendimento acumulado deve ser R$ 1.375,00');
  });

  it('Critério 7: Comparação de Moradia (Atual vs Novo Centro com economia de combustível R$ 390,00)', () => {
    const comparison = calculateHousingComparison();

    assert.equal(comparison.current.rentShare, 810.50, 'Aluguel atual metade deve ser R$ 810,50');
    assert.equal(comparison.current.landShare, 1343.26, 'Terreno atual metade deve ser R$ 1.343,26');
    assert.equal(comparison.current.fuelExpense, 480.00, 'Combustível atual deve ser R$ 480,00');
    assert.equal(comparison.current.total, 2633.76, 'Custo atual total deve ser R$ 2.633,76');

    assert.equal(comparison.newCenter.financingShare, 3231.32, 'Financiamento Caixa SAC deve ser R$ 3.231,32');
    assert.equal(comparison.newCenter.condoShare, 250.00, 'Condomínio centro deve ser R$ 250,00');
    assert.equal(comparison.newCenter.fuelExpense, 90.00, 'Combustível centro deve ser R$ 90,00');
    assert.equal(comparison.newCenter.total, 3571.32, 'Custo novo total deve ser R$ 3.571,32');

    assert.equal(comparison.fuelSavings, 390.00, 'Economia de combustível destacada deve ser R$ 390,00');
    assert.equal(comparison.monthlyDifference, 937.56, 'Diferença líquida mensal deve ser +R$ 937,56');
  });

  it('Critério 8: Número Mágico (Saldo Livre Real) e atualização dinâmica de fixas quitadas', () => {
    // Caso 1: Todas as fixas ainda pendentes
    const magicPending = calculateMagicNumber({
      income: 11096.21,
      wellhubCredits: 549.90,
      pixIn: 350.00,
      myFixedShare: 3966.86,
      myPaidFixed: 0.00,
      pixOut: 225.00,
      cardProjection: 2439.18,
      useNewApartment: false
    });

    // 11996.11 - 3966.86 - 225.00 - 2439.18 = 5365.07
    assert.equal(magicPending.magicNumber, 5365.07, 'Número Mágico projetado do mês deve ser R$ 5.365,07');
    assert.equal(magicPending.myPendingFixed, 3966.86, 'Total pendente das fixas deve ser R$ 3.966,86');

    // Caso 2: Aluguel (810,50) quitado
    const magicPaidPartial = calculateMagicNumber({
      income: 11096.21,
      wellhubCredits: 549.90,
      pixIn: 350.00,
      myFixedShare: 3966.86,
      myPaidFixed: 810.50,
      pixOut: 225.00,
      cardProjection: 2439.18,
      useNewApartment: false
    });

    assert.equal(magicPaidPartial.magicNumber, 5365.07, 'Número Mágico projetado preserva balanço total do mês');
    assert.equal(magicPaidPartial.myPaidFixed, 810.50, 'Parte paga registrada com sucesso');
    assert.equal(magicPaidPartial.myPendingFixed, 3156.36, 'Restante pendente atualizado imediatamente');
  });

  it('Critério 9: Patrimônio Líquido Consolidado (Nomad USD 2.500 @ 5,40 + CDB 15k + Selic 10k = R$ 38.500,00)', () => {
    const wealth = calculateConsolidatedWealth();
    assert.equal(wealth.totalWealthBrl, 38500.00, 'Patrimônio total consolidado deve ser R$ 38.500,00');
    const nomad = wealth.items.find(i => i.name.includes('Nomad'));
    assert.equal(nomad.valueBrl, 13500.00, 'Nomad convertido a R$ 5,40 deve ser R$ 13.500,00');
  });

  it('Critério 10: Método 50/30/20 (Planejamento Financeiro da Planilha de Muriaé)', () => {
    const budget = calculateBudget503020(11096.21, 3966.86, 2439.18, 2000.00);

    assert.equal(budget.essential50.target, 5548.10, 'Teto de 50% para fixas essenciais deve ser R$ 5.548,10');
    assert.equal(budget.lifestyle30.target, 3328.86, 'Teto de 30% para variáveis/cartões deve ser R$ 3.328,86');
    assert.equal(budget.investment20.target, 2219.24, 'Meta de 20% para investimentos deve ser R$ 2.219,24');

    assert.equal(budget.essential50.actual, 3966.86);
    assert.equal(budget.essential50.status, 'OK', 'Fixas devem estar dentro do teto de 50%');
    assert.equal(budget.essential50.diff, 1581.24, 'Sobrou R$ 1.581,24 da margem de 50%');

    assert.equal(budget.lifestyle30.actual, 2439.18);
    assert.equal(budget.lifestyle30.status, 'OK', 'Variáveis devem estar dentro do teto de 30%');
    assert.equal(budget.lifestyle30.diff, 889.68, 'Sobrou R$ 889,68 da margem de 30%');

    assert.equal(budget.availableToInvest, 4690.17, 'Disponibilidade real para investir/poupar deve ser R$ 4.690,17');
    assert.equal(budget.isBalanced, true, 'Orçamento familiar deve estar equilibrado');
  });

});

