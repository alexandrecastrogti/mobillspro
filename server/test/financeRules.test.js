import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/db.js';

describe('Regras de Negócio e Cálculos Financeiros (Alexandre & Amanda)', () => {

  it('1. Deve apurar corretamente as receitas e a disponibilidade total de Alexandre', () => {
    const incomes = db.getIncomes('2026-10');
    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
    assert.equal(totalIncome, 11096.21, 'Renda própria deve ser R$ 11.096,21 (Salário + Bolsa)');

    const wellhubs = db.getWellhubReimbursements('2026-10');
    const totalWellhub = wellhubs.reduce((acc, curr) => acc + Number(curr.amount), 0);
    assert.equal(Number(totalWellhub.toFixed(2)), 549.90, 'Reembolso Wellhub deve ser R$ 549,90');

    const totalAvailable = totalIncome + totalWellhub;
    assert.equal(Number(totalAvailable.toFixed(2)), 11646.11, 'Disponibilidade total deve ser R$ 11.646,11');
  });

  it('2. Deve calcular o Número Mágico (Saldo Livre Real) com isolamento de atípicos', () => {
    const balance = db.calculateMagicNumber('2026-10', true, false, 'CURRENT_MONTH');
    assert.ok(balance, 'Balanço deve ser gerado');
    assert.equal(balance.magicNumber, 6219.1, 'Número Mágico padrão de Outubro deve ser R$ 6.219,10');
    assert.ok(balance.health.savingsRate > 50, 'Taxa de poupança livre deve ser superior a 50%');
    assert.equal(balance.health.status, 'EXCELENTE');
  });

  it('3. Deve reduzir o Saldo Livre quando atípicos não são isolados', () => {
    const balanceWithAtypical = db.calculateMagicNumber('2026-10', false, false, 'CURRENT_MONTH');
    const balanceIsolated = db.calculateMagicNumber('2026-10', true, false, 'CURRENT_MONTH');

    assert.ok(
      balanceWithAtypical.magicNumber < balanceIsolated.magicNumber,
      'Número Mágico sem isolar atípicos deve ser menor do que o isolado'
    );
  });

  it('4. Deve simular o impacto financeiro da transição para apartamento Centro (Caixa SAC)', () => {
    const baseBalance = db.calculateMagicNumber('2026-10', true, false, 'CURRENT_MONTH');
    const simulatedBalance = db.calculateMagicNumber('2026-10', true, true, 'CURRENT_MONTH');

    assert.ok(
      simulatedBalance.magicNumber < baseBalance.magicNumber,
      'A transição para parcela maior da Caixa SAC deve reduzir temporariamente a sobra líquida'
    );
    assert.equal(simulatedBalance.housingSimulationApplied, true, 'Flag de simulação de moradia deve ser true');
    assert.ok(simulatedBalance.housingAdjustment > 0, 'Ajuste de moradia deve ser positivo (maior custo)');
  });

  it('5. Deve apurar os valores consolidados dos 3 cartões de crédito (Nubank, Bradesco, MP)', () => {
    const cardsDetailed = db.getCreditCardsDetailed();
    assert.equal(cardsDetailed.length, 3, 'Devem existir exatamente 3 cartões cadastrados');

    const nubank = cardsDetailed.find(c => c.id === 'card-nubank');
    const bradesco = cardsDetailed.find(c => c.id === 'card-bradesco');
    const mercadopago = cardsDetailed.find(c => c.id === 'card-mercadopago');

    assert.ok(nubank, 'Cartão Nubank Ultravioleta deve existir');
    assert.ok(bradesco, 'Cartão Bradesco Visa deve existir');
    assert.ok(mercadopago, 'Cartão Mercado Pago deve existir');

    // Valida dias de fechamento e melhor compra
    assert.equal(nubank.closingDay, 24);
    assert.equal(nubank.bestBuyDay, 25);
    assert.equal(bradesco.closingDay, 18);
    assert.equal(bradesco.bestBuyDay, 19);
    assert.equal(mercadopago.closingDay, 10);
    assert.equal(mercadopago.bestBuyDay, 11);
  });

  it('6. Deve calcular os tetos orçamentários e identificar o estouro em supermercados', () => {
    const budgets = db.getBudgets();
    const groceryBudget = budgets.find(b => b.category.includes('Supermercados'));
    assert.ok(groceryBudget, 'Centro de custo de Supermercados deve existir');
    assert.equal(groceryBudget.targetAmount, 1550, 'Meta de supermercados deve ser R$ 1.550,00');
    assert.ok(groceryBudget.spentAmount > groceryBudget.targetAmount, 'Gasto de Outubro deve exceder o teto');
    assert.equal(groceryBudget.status, 'ALERT', 'Status deve ser ALERT (Estourado)');
  });

  it('7. Deve calcular o acerto 50/50 do casal com liquidação transparente (Amanda -> Alexandre)', () => {
    const settlement = db.calculateCoupleSettlement('2026-10');
    assert.ok(settlement, 'Relatório de acerto deve ser calculado');
    assert.equal(settlement.summary.payer, 'Amanda');
    assert.equal(settlement.summary.receiver, 'Alexandre');
    assert.equal(settlement.summary.netAmount, 4735.31, 'Amanda deve transferir R$ 4.735,31 para Alexandre');
    assert.equal(settlement.breakdown.sharedFixed.amandaLiability, 2703.76, 'Parcela de despesas fixas 50/50 da Amanda');
    assert.equal(settlement.breakdown.sharedCards.amandaLiability, 1848.25, 'Parcela de cartões 50/50 da Amanda');
    assert.equal(settlement.breakdown.wellhub.amandaShare, 183.30, 'Reembolso do Wellhub da Amanda');
  });

});
