# 🚀 MobillsPro - Sistema Definitivo de Controle Financeiro Pessoal
**Alexandre & Amanda — Muriaé/MG**

O **MobillsPro** é um PWA full-stack responsivo de alta performance projetado para controle financeiro cirúrgico, auditoria de cartões, simulação imobiliária Caixa SBPE e consolidação de patrimônio internacional.

---

## 🌟 Principais Recursos e Regras de Negócio

### 1. Receitas e Regra 50/50 com Blindagem Individual
- **Receita Líquida Alexandre:** R$ 9.996,21 (Salário) + R$ 1.100,00 (Bolsa Monitoria) = **R$ 11.096,21**.
- **Divisão 50/50 Amanda:** Aplicada estritamente às contas compartilhadas (Aluguel, Terreno, Luz Energisa, Internet, Condomínio, Água DEMSUR, Diarista e despesas de mercado).
- **Exceções Individuais Blindadas:** Unimed Individual Alexandre (R$ 485,00) e Academia Alexandre (R$ 140,00) são 100% de responsabilidade de Alexandre.
- **Compensação Automática de Wellhub:** R$ 549,90 mensais (Amanda R$ 183,30, Taiana R$ 183,30, Nilvana R$ 183,30) que entram como crédito/abatimento na fatura do cartão.

### 2. Auditoria Histórica de 6 Meses e 3 Cartões (Nubank, Bradesco, Mercado Pago)
- Histórico completo de faturas de **Maio a Outubro de 2026**.
- **Média Histórica Real de Supermercados:** R$ 1.533,28/mês (Supermercados BH + Bahamas Mix + Top Frut Gourmet Muriaé), isolando o pico de Outubro de R$ 2.600,10.
- **Eliminação Automática de Gastos Atípicos:** Botão toggle interativo que remove a Funilaria (R$ 1.000,00) e a parcela encerrada no Bradesco (R$ 480,00), recalculando a projeção real sem distorção.

### 3. Simulador de Transição de Moradia: Centro (Caixa SBPE SAC)
- **Moradia Atual:** Aluguel (R$ 810,50) + Terreno (R$ 1.343,26) + Combustível atual (R$ 480,00) = R$ 2.633,76.
- **Apartamento no Centro:** Caixa SAC (R$ 3.231,32) + Condomínio (R$ 250,00) - Economia de combustível andando a pé (-R$ 360,00) = Custo líquido de R$ 3.121,32.
- **Curva Interativa de Amortização SAC:** Simulação mês a mês da queda contínua das parcelas (~R$ 9,85/mês de alívio).

### 4. Checklist de Quitação das Despesas Fixas
- Marcadores visuais em tempo real ("PAGO" em verde / "PENDENTE" em âmbar).
- Quitação interativa com 1 clique (atualização instantânea do saldo livre).
- Códigos Pix e comprovantes de liquidação.

### 5. Detector e Alerta Inteligente de Transações Pix
- Badges estilizados com distinção entre compras no cartão vs fluxo bancário via Pix.
- Detecção e alerta visual para transações avulsas ou fora da rotina cadastrada.

### 6. Automação do Balanço ("Número Mágico")
- Recálculo dinâmico em tempo real do saldo livre disponível.
- Fórmula: `Receitas Alexandre + Reembolsos Wellhub - Fixas Pagas/Pendentes - Cartões Limpos - Pix Avulsos - Impacto Habitacional = Saldo Livre`.
- Indicadores de saúde financeira e taxa de poupança (> 50%).

### 7. Investimentos e Ativos (Nomad USD, Tesouro Selic, CDB)
- **Conta Nomad Internacional em USD:** US$ 4.250,00 em ETFs globais (VT Vanguard, S&P 500) com conversão dinâmica em BRL (R$ 5,75 = R$ 24.437,50).
- **Tesouro Selic 2029 (13,75% a.a.):** R$ 35.000,00.
- **CDB 110% do CDI:** R$ 18.450,00.
- **Terreno Muriaé (Fração Quitada):** R$ 48.500,00.
- **Patrimônio Líquido Total Consolidado:** R$ 126.387,50.

---

## 🛠️ Arquitetura Técnica

- **Frontend:** React 18, Tailwind CSS, Lucide Icons, Vite, PWA (Service Worker + Web App Manifest).
- **Backend:** Node.js, Express, REST API modular.
- **Persistência de Dados Dual-Engine:**
  - Suporte nativo a **PostgreSQL** (`pg.Pool`) configurável via `DATABASE_URL` (Supabase, Neon, Render, Railway).
  - Motor de persistência local contínuo em JSON (`server/data/mobillspro.json`) para operação imediata autônoma e offline.
  - Scripts SQL completos: `server/src/schema.sql` e `server/src/seeds.sql`.

---

## 🏃 Como Executar

### 1. Iniciar em Produção (Backend + Frontend Unificados na porta 3001)
```bash
npm start
```
Acesse: [http://localhost:3001](http://localhost:3001)

### 2. Modo Desenvolvimento
```bash
npm run dev
```
Inicia o backend na porta `3001` e o Vite Dev Server na porta `5173`.

---

## 📱 Instalação PWA no Celular
1. Abra o navegador do celular no endereço da aplicação.
2. Toque no menu de opções e selecione **"Adicionar à tela de início"**.
3. O MobillsPro funcionará como um aplicativo nativo full-screen.
