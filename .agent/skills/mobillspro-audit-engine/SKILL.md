---
name: mobillspro-audit-engine
description: >-
  Auditor financeiro e copiloto de finanças pessoais de Alexandre e Amanda em Muriaé/MG.
  Utilize esta skill sempre que o usuário solicitar fechamento mensal, conciliação 50/50,
  auditoria de faturas e cartões, simulação do financiamento Caixa SBPE ou recálculo do
  Número Mágico (saldo livre real).
---

# MobillsPro Audit Engine — Muriaé/MG

Esta skill especializa o agente Antigravity nas regras de negócio, persistência e auditoria financeira do **MobillsPro**, ecossistema de gestão financeira familiar de **Alexandre e Amanda em Muriaé/MG**.

---

## 1. Regras de Negócio e Parâmetros Canônicos

### A. Receitas e Disponibilidade Financeira
- **Salário Líquido Alexandre:** R$ 9.996,21
- **Bolsa Monitoria:** R$ 1.100,00
- **Total Receitas Próprias:** **R$ 11.096,21**
- **Crédito de Reembolso Wellhub (Terceiros):** **+ R$ 549,90/mês**
  - Amanda: R$ 183,30
  - Taiana: R$ 183,30
  - Nilvana: R$ 183,30
  *(Esses valores entram na conta do Alexandre como crédito líquido compensatório).*
- **Disponibilidade Total do Alexandre:** **R$ 11.646,11**

### B. Divisão de Despesas e Exceções (Regra 50/50)
- **Contas Compartilhadas:** Divididas exatamente em **50% para Alexandre e 50% para Amanda**.
- **Despesas Exclusivas do Alexandre (NÃO divididas):**
  - **Unimed Individual Alexandre:** R$ 485,00 (100% Alexandre)
  - **Academia Individual Alexandre:** R$ 140,00 (100% Alexandre)

### C. Gestão de Cartões de Crédito (Muriaé/MG)
1. **Nubank Ultravioleta (Mastercard Black):**
   - Fechamento: Dia 24 | Vencimento: Dia 01 do mês seguinte | Melhor Dia: Dia 25
   - Limite padrão: R$ 14.000,00
2. **Bradesco Visa Platinum:**
   - Fechamento: Dia 18 | Vencimento: Dia 25 | Melhor Dia: Dia 19
   - Limite padrão: R$ 18.500,00 (última parcela de parcelamentos antigos quitada em Out/2026)
3. **Mercado Pago Visa:**
   - Fechamento: Dia 10 | Vencimento: Dia 17 | Melhor Dia: Dia 11
   - Limite padrão: R$ 8.500,00
- **Benchmark Histórico de Supermercados em Muriaé:**
  - Cesta: **Supermercados BH + Bahamas Mix + Top Frut Gourmet**
  - Média histórica real sustentável: **R$ 1.533,28/mês** (versus picos atípicos).
- **Tratamento de Despesas Atípicas:**
  - Excluir automaticamente eventos isolados (ex: Funilaria R$ 1.000,00) ao calcular o custo de vida recorrente.

### D. Simulador Habitacional Caixa SBPE SAC vs Moradia Atual
- **Cenário Atual (Sua Metade):**
  - Aluguel Atual (50%): R$ 810,50
  - Parcela Terreno (50%): R$ 1.343,26
  - **Custo Atual Moradia Alexandre:** **R$ 2.153,76/mês**
- **Cenário Apartamento Novo no Centro (Sua Metade):**
  - Financiamento Caixa SAC (1ª Parcela 50%): R$ 3.231,32
  - Condomínio no Centro (50%): R$ 250,00
  - Economia de Combustível rodando a pé no Centro: **- R$ 280,00**
  - **Custo Novo Moradia Alexandre:** **R$ 3.201,32/mês**
  - **Diferencial Líquido:** Acréscimo de **R$ 1.047,56/mês** na transição.

---

## 2. O "Número Mágico" (Saldo Livre Real)

A métrica central do ecossistema é o **Número Mágico**, calculado pela fórmula canônica:

$$\text{Número Mágico} = \text{Receitas Totais} + \text{Reembolsos Wellhub} - \text{Despesas Fixas (Sua Parte)} - \text{Cartões (Sua Parte)} - \text{Pix Avulsos (Saídas)} - \Delta_{\text{Habitação}}$$

- **Classificação de Saúde Financeira:**
  - $\ge \text{R\$\ } 2.500,00$: **EXCELENTE** (Capacidade robusta de aporte em Nomad USD / Selic).
  - $\text{R\$\ } 1.000,00 \text{ a } \text{R\$\ } 2.499,00$: **EQUILIBRADO**.
  - $< \text{R\$\ } 1.000,00$: **ALERTA DE ENDIVIDAMENTO**.

---

## 3. Protocolo de Auditoria e Fechamento pelo Agente

Sempre que o usuário solicitar auditoria ou fechamento, execute o seguinte roteiro:

1. **Verificar Conectividade da API Local:**
   - Faça uma requisição para `http://localhost:3001/api/health`.
   - Se o servidor não estiver respondendo, execute `node server/src/index.js` em segundo plano.

2. **Auditar os Indicadores do Mês:**
   - Obtenha os dados via `GET http://localhost:3001/api/dashboard/summary?month=YYYY-MM`.
   - Valide se todos os boletos fixos estão com status `PAGO` ou `PENDENTE` em `GET /api/fixed-expenses`.
   - Obtenha o Acerto Bilateral via `GET /api/reconciliation/settlement?month=YYYY-MM`.

3. **Gerar Relatório Executivo Estruturado:**
   - **Quadro de Entradas:** Salário + Bolsa + Reembolsos Wellhub (R$ 549,90).
   - **Quadro de Saídas:** Fixas (individuais e compartilhadas) + Faturas dos 3 cartões.
   - **Balanço 50/50:** Indicar com precisão quanto a Amanda deve transferir ao Alexandre (ou vice-versa).
   - **Alerta de Supermercados:** Comparar os gastos em Supermercados BH, Bahamas e Top Frut com a meta de R$ 1.533,28.
   - **Saldo Livre Final:** Apresentar o Número Mágico e a recomendação de investimento (Nomad USD / Tesouro Selic).

