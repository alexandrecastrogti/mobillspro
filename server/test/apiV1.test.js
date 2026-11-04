process.env.NODE_ENV = 'test';
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/index.js';

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe('MobillsPro - Testes Automatizados de API REST v1', () => {

  it('1. GET /health deve retornar status 200 e serviço saudável', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'healthy');
  });

  it('2. GET /api/v1/health deve retornar status 200 e metadados de Muriaé', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.location, 'Muriaé/MG');
    assert.equal(data.couple, 'Alexandre & Amanda');
  });

  it('3. POST /api/v1/auth/login deve autenticar Alexandre e retornar JWT', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alexandre@mobillspro.com',
        password: 'Muriae2026!'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.accessToken, 'Deve retornar accessToken');
    assert.ok(data.refreshToken, 'Deve retornar refreshToken');
    assert.equal(data.user.role, 'owner');
    assert.equal(data.user.name, 'Alexandre');
  });

  it('4. GET /api/v1/balance deve apurar os dados reais consolidados', async () => {
    const res = await fetch(`${baseUrl}/api/v1/balance`);
    assert.equal(res.status, 200);
    const data = await res.json();

    assert.equal(data.income, 11096.21, 'Receita total deve ser R$ 11.096,21');
    assert.equal(data.wellhub.total, 549.90, 'Reembolsos Wellhub devem somar R$ 549,90');
    assert.equal(data.cards.marketAverage, 1533.28, 'Média de mercado deve ser R$ 1.533,28');
    assert.equal(data.cards.cardProjection, 2439.18, 'Projeção de cartões deve ser R$ 2.439,18');
    assert.ok(data.balance.magicNumber > 0, 'Número Mágico deve ser positivo');
  });

  it('5. POST /api/v1/fixed-expenses/:id/toggle deve alternar status e atualizar o balanço imediatamente', async () => {
    // Alterna a despesa de água
    const toggleRes = await fetch(`${baseUrl}/api/v1/fixed-expenses/fix-agua/toggle`, {
      method: 'POST'
    });
    assert.equal(toggleRes.status, 200);
    const data = await toggleRes.json();
    assert.equal(data.expense.status, 'PAGO');
    assert.ok(data.fixedSummary.paidAlexandre >= 60.00);

    // Desfaz a alteração para manter idempotência
    await fetch(`${baseUrl}/api/v1/fixed-expenses/fix-agua/toggle`, { method: 'POST' });
  });

  it('6. GET /api/v1/housing deve retornar os cenários de moradia e economia de combustível', async () => {
    const res = await fetch(`${baseUrl}/api/v1/housing`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.fuelSavings, 390.00, 'Economia de combustível no centro deve ser R$ 390,00');
    assert.equal(data.monthlyDifference, 937.56, 'Diferença mensal deve ser +R$ 937,56');
  });

  it('7. GET /api/v1/investments deve calcular Selic 10k a 13,75% a.a. em 12 meses = R$ 11.375,00', async () => {
    const res = await fetch(`${baseUrl}/api/v1/investments`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.selicExample10k.montante, 11375.00);
    assert.equal(data.totalWealthBrl, 38500.00, 'Patrimônio familiar deve ser R$ 38.500,00');
  });

  it('8. POST /api/v1/ai/audit deve retornar auditoria com rotulagem de sugestão', async () => {
    const res = await fetch(`${baseUrl}/api/v1/ai/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: [] })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.isAiSuggestion, true, 'Deve conter a flag isAiSuggestion: true');
    assert.ok(data.disclaimer.includes('Inteligência Artificial'), 'Deve exibir disclaimer legal de IA');
  });

});
