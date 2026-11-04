# 🚀 MobillsPro - Sistema de Controle Financeiro Doméstico
**Alexandre & Amanda — Muriaé/MG**

O **MobillsPro** é um sistema completo, pronto para rodar em produção, desenvolvido para proporcionar a Alexandre e Amanda um único local para ver, todo mês, quanto sobra de verdade depois de contas fixas, cartões, Pix e reembolsos — com simulação da transição para um apartamento no Centro.

---

## 🎯 1. Dados Reais e Regras de Negócio (Seed Oficial)

* **Receita Mensal de Alexandre:**
  * Salário Líquido: **R$ 9.996,21**
  * Bolsa Monitoria: **R$ 1.100,00**
  * **Total da Receita:** **R$ 11.096,21**
* **Reembolsos Wellhub (Crédito na Renda):**
  * Amanda (R$ 183,30) + Taiana (R$ 183,30) + Nilvana (R$ 183,30) = **R$ 549,90**
  * **Disponibilidade Total:** **R$ 11.646,11**
* **Contas Fixas (Divisão 50/50 e Individuais):**
  * Aluguel: R$ 1.621,00 (50/50, Venc. 5) $\rightarrow$ Metade: **R$ 810,50**
  * Parcela do Terreno: R$ 2.686,52 (50/50, Venc. 10) $\rightarrow$ Metade: **R$ 1.343,26**
  * Energia (Cemig): R$ 280,00 (50/50, Venc. 12) $\rightarrow$ Metade: **R$ 140,00**
  * Água (Copasa): R$ 120,00 (50/50, Venc. 15) $\rightarrow$ Metade: **R$ 60,00**
  * Internet: R$ 120,00 (50/50, Venc. 20) $\rightarrow$ Metade: **R$ 60,00**
  * Unimed (Individual): **R$ 690,00** (100% Alexandre, Venc. 8)
  * Academia Alexandre: **R$ 129,90** (100% Alexandre, Venc. 10)
  * Wellhub (4 planos): **R$ 733,20** (100% Alexandre, Venc. 1)
  * **Total Fixas de Alexandre:** **R$ 3.966,86**
* **Cartões (Nubank, Bradesco, Mercado Pago):**
  * Histórico de Mercado (Maio a Out/2026): `[1300.00, 1350.00, 1280.00, 1400.00, 1269.58, 2600.10]`
  * **Média dos 6 meses:** **R$ 1.533,28** (Pico em Outubro: R$ 2.600,10)
  * Outros Recorrentes: Posto (R$ 480,00) + iFood (R$ 220,00) + Streaming (R$ 55,90) + Farmácia (R$ 150,00) = **R$ 905,90**
  * **Projeção de Cartões:** 1.533,28 + 905,90 = **R$ 2.439,18**
  * **Exclusões da Projeção:** Funilaria (R$ 1.000,00 - atípico) e Parcela Magazine (R$ 389,90 - encerrada)
* **Pix (Mês Atual):**
  * Entradas: Venda OLX (+R$ 350,00)
  * Saídas: Diarista (-R$ 180,00) + Barbeiro (-R$ 45,00) = **R$ 225,00**
  * Saldo Líquido Pix: **+R$ 125,00**
* **Moradia (Comparação de Cenários):**
  * Atual (Metade): Aluguel (810,50) + Terreno (1.343,26) + Combustível (480,00) = **R$ 2.633,76**
  * Novo Centro (Metade): Financiamento Caixa SBPE SAC (3.231,32) + Condomínio (250,00) + Combustível (90,00) = **R$ 3.571,32**
  * **Economia de Combustível:** **R$ 390,00** (destacada separadamente)
  * **Diferença Mensal Líquida:** **+R$ 937,56**
* **Investimentos e Patrimônio Consolidado:**
  * Nomad do Augusto: US$ 2.500,00 @ R$ 5,40 = **R$ 13.500,00**
  * CDB: **R$ 15.000,00**
  * Tesouro Selic: **R$ 10.000,00**
  * **Patrimônio Familiar:** **R$ 38.500,00**
  * Rendimento Composto Selic (13,75% a.a. em 12 meses): **R$ 10.000,00 $\rightarrow$ R$ 11.375,00**
* **Número Mágico (Saldo Livre Real):**
  $$\text{Livre} = \text{Receita} + \text{Reembolsos} + \text{PixIn} - \text{MinhaParteFixas} - \text{PixOut} - \text{ProjecaoCartoes}$$
  $$\text{Livre} = 11.096,21 + 549,90 + 350,00 - 3.966,86 - 225,00 - 2.439,18 = \mathbf{R\$\ 5.365,07}$$
  *Atualiza dinamicamente em tempo real ao marcar qualquer conta fixa como quitada!*

---

## 💻 2. Stack Tecnológica

* **Frontend:** React 18/19, TypeScript/Vite, Tailwind CSS, Lucide Icons, PWA (Manifest, Service Worker, Standalone, Offline básico, Mobile-First 360px).
* **Backend:** Node.js, Express, REST API versionada em `/api/v1` com healthcheck em `/health`.
* **Banco de Dados & Prisma:** PostgreSQL com Prisma ORM (`prisma/schema.prisma` e `prisma/seed.js` idempotente) + persistência local contínua para inicialização autônoma instantânea.
* **Autenticação:** JWT (Access Token de 2h + Refresh Token de 7d), hash de senha com bcrypt.
  * Perfis de acesso: `owner` (Alexandre), `partner` (Amanda), `viewer` (Visitante).
  * Senha padrão pré-configurada: `Muriae2026!`
* **IA com Google Gemini:**
  * Endpoint `/api/v1/ai/audit`: auditoria de faturas e anomalias.
  * Endpoint `/api/v1/ai/explain`: diagnóstico do pico de mercado em outubro.
  * Endpoint `/api/v1/ai/suggest`: sugestões de cortes orçamentários.
  * Anonimização obrigatória antes do envio e rótulo explícito de sugestão.
* **Qualidade e Testes:** Suíte de 24 testes automatizados cobrindo todas as funções puras de negócio e todos os endpoints de API (100% PASS).

---

## 📱 3. As 6 Telas Oficiais

1. **Balanço:** Destaque gigante do Número Mágico (verde positivo / vermelho negativo), cards de receita, reembolsos, Pix entradas/saídas, parte nas fixas, projeção de cartões, lista de reembolsos e botão de restauração do dataset original.
2. **Fixas:** Tabela com valor cheio, parte Alexandre, vencimento, botão interativo Pago/Pendente com data e barra de progresso do mês.
3. **Cartões:** Gráfico mensal de supermercados com pico em outubro, média histórica, projeção e auditoria detalhada de exclusões (Funilaria e Magazine Luiza).
4. **Pix:** Lançamento rápido de transações, filtro por direção (entradas/saídas) e totais consolidados.
5. **Moradia:** Lado a lado Moradia Atual vs Novo Apto Centro (Caixa SAC), destaque da economia de combustível (R$ 390,00) e impacto no Número Mágico.
6. **Investimentos:** Patrimônio familiar consolidado, conversão cambial USD/BRL, simulação de juros compostos Selic 13,75% e projeção em 12 meses.

---

## 🏃 4. Como Executar Localmente

### Pré-requisitos
* Node.js v20+ ou v24+
* npm

### Passo a Passo
```bash
# 1. Instalar dependências do servidor e cliente
npm run install:all

# 2. Configurar variáveis de ambiente (opcional - defaults já inclusos)
cp .env.example .env

# 3. Executar o servidor de desenvolvimento
npm run dev:server    # Terminal 1: Backend na porta 3001
npm run dev:client    # Terminal 2: Frontend Vite na porta 5173
```
Abra o navegador em: **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 5. Execução dos Testes Automatizados

O sistema conta com 24 testes automatizados cobrindo o motor puro de finanças e a API v1:

```bash
# Executar todos os testes do servidor
npm test --prefix server
```

Resultado verificado:
```text
✔ MobillsPro - Testes Automatizados de API REST v1 (8 testes - 100% pass)
✔ MobillsPro - Regras de Negócio e Funções Puras de Finanças (9 testes - 100% pass)
✔ Regras de Negócio e Cálculos Financeiros (Alexandre & Amanda) (7 testes - 100% pass)
ℹ tests 24 | suites 3 | pass 24 | fail 0
```

---

## 🐳 6. Deploy com Docker e Nuvem (Render / Railway / Fly.io)

### Com Docker Compose (App + PostgreSQL)
```bash
docker-compose up --build -d
```
Acesse o healthcheck em: `http://localhost:3001/health`

### Deploy no Railway / Render / Fly.io
1. Conecte o repositório Git ao provedor.
2. Defina as variáveis de ambiente baseadas no `.env.example`:
   * `NODE_ENV=production`
   * `DATABASE_URL` (fornecido pelo Postgres do Render/Railway)
   * `JWT_SECRET` e `JWT_REFRESH_SECRET`
   * `GEMINI_API_KEY` (opcional para IA ativa)
3. Comando de build: `npm run install:all && npm run build:client`
4. Comando de inicialização: `npm start`
5. Healthcheck path: `/health`
