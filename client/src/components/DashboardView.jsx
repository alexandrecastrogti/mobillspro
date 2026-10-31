import React from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  DollarSign, 
  Percent, 
  ShieldCheck, 
  Car,
  ShoppingCart,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Target,
  Smartphone
} from 'lucide-react';
import { formatBRL, formatUSD, formatPercent } from '../utils/formatters';
import { InteractiveCharts } from './InteractiveCharts';

export function DashboardView({
  summaryData,
  excludeAtypical,
  setExcludeAtypical,
  useNewApartment,
  setUseNewApartment,
  setActiveTab,
  onToggleFixedExpense,
  period,
  setPeriod,
  fixedExpenses,
  cardTransactions
}) {
  if (!summaryData || !summaryData.balance) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
        Carregando painel modular Mobills...
      </div>
    );
  }

  const { balance, profile, cardsAuditSummary, investmentsSummary, recentPixAlerts, cashflow, networthHistory, budgetsOverview } = summaryData;

  const periods = [
    { id: 'CURRENT_MONTH', label: 'Mês Atual' },
    { id: 'PREVIOUS_MONTH', label: 'Mês Anterior' },
    { id: 'LAST_3_MONTHS', label: 'Últimos 3 Meses' },
    { id: 'CURRENT_YEAR', label: 'Ano Corrente (2026)' },
  ];

  return (
    <div className="space-y-6">
      
      {/* QUICK PERIOD FILTER BAR (Mês Atual / Mês Anterior / Últimos 3 Meses / Ano Corrente) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-900/60 p-2 sm:p-3 rounded-2xl border border-gray-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod && setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                period === p.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Referência: <strong className="text-gray-200">Outubro/2026</strong></span>
        </div>
      </div>

      {/* TOP FLOATING SUMMARY CARDS (PADRÃO MOBILLS WEB) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Receitas Totais */}
        <div 
          onClick={() => setActiveTab('incomes')}
          className="cursor-pointer glass-card rounded-2xl p-5 hover:border-emerald-500/50 transition group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Receitas Totais
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white font-mono">
              {formatBRL(balance.totalAvailableAlexandre)}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex justify-between">
              <span>Salário + Monitoria:</span>
              <span className="font-semibold text-gray-200">{formatBRL(balance.totalIncomeAlexandre)}</span>
            </p>
            <p className="text-xs text-emerald-400 mt-0.5 flex justify-between">
              <span>+ Wellhub Terceiros:</span>
              <span className="font-semibold font-mono">+{formatBRL(balance.totalWellhubCredit)}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Despesas Totais */}
        <div 
          onClick={() => setActiveTab('checklist')}
          className="cursor-pointer glass-card rounded-2xl p-5 hover:border-rose-500/50 transition group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Despesas Totais
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white font-mono">
              {formatBRL(balance.totalExpensesMonth)}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex justify-between">
              <span>Fixas + Cartões + Pix:</span>
              <span className="font-semibold text-gray-200">{balance.fixedExpenses.totalItems} obrigações</span>
            </p>
            <p className="text-xs text-rose-400 mt-0.5 flex justify-between">
              <span>Comprometimento:</span>
              <span className="font-semibold font-mono">{balance.health.fixedCommitment}% da renda</span>
            </p>
          </div>
        </div>

        {/* Card 3: Saldo do Mês (Número Mágico) */}
        <div 
          className="glass-card rounded-2xl p-5 border-emerald-500/40 shadow-lg relative overflow-hidden bg-gradient-to-br from-gray-900 to-[#072418]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Saldo do Mês (Livre)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-300 font-mono">
              {formatBRL(balance.magicNumber)}
            </h3>
            <p className="text-xs text-gray-300 mt-1 flex justify-between">
              <span>Taxa de Sobra:</span>
              <span className="font-bold text-emerald-400">{balance.health.savingsRate}% livre</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5 flex justify-between">
              <span>Saúde Financeira:</span>
              <span className="font-bold text-emerald-400">{balance.health.status}</span>
            </p>
          </div>
        </div>

        {/* Card 4: Projeção Anual (12 Meses) */}
        <div 
          onClick={() => setActiveTab('investments')}
          className="cursor-pointer glass-card rounded-2xl p-5 hover:border-amber-500/50 transition group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Projeção Anual
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-300 font-mono">
              {formatBRL(balance.annualProjection.savings)}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex justify-between">
              <span>Capacidade Anual:</span>
              <span className="font-semibold text-gray-200">12x Sobra Mensal</span>
            </p>
            <p className="text-xs text-amber-400 mt-0.5 flex justify-between">
              <span>Patrimônio Atual:</span>
              <span className="font-semibold font-mono">{formatBRL(investmentsSummary.totalNetWorthBRL)}</span>
            </p>
          </div>
        </div>

      </div>

      {/* QUICK WHAT-IF SIMULATORS HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-[#0E1526] to-[#062419] border border-emerald-500/30 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Simuladores de Impacto Imediato
              </span>
              <span className="text-xs text-gray-400">Alexandre & Amanda (Muriaé/MG)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Ajuste Dinâmico do Balanço & Cenários
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Isole eventos extraordinários e simule a aquisição do imóvel no Centro com amortização da Caixa e economia de transporte a pé.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gray-950/80 border border-gray-800 min-w-[240px]">
              <div>
                <span className="text-xs font-bold text-white block">Eliminar Atípicos Outubro</span>
                <span className="text-[11px] text-gray-400">Funilaria R$ 1.000 + Bradesco</span>
              </div>
              <button
                type="button"
                onClick={() => setExcludeAtypical(!excludeAtypical)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  excludeAtypical ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    excludeAtypical ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gray-950/80 border border-gray-800 min-w-[240px]">
              <div>
                <span className="text-xs font-bold text-white block">Simular Apto Centro (Caixa)</span>
                <span className="text-[11px] text-gray-400">SAC + Economia Gasolina</span>
              </div>
              <button
                type="button"
                onClick={() => setUseNewApartment(!useNewApartment)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  useNewApartment ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    useNewApartment ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CHARTS (ROSCA DE CATEGORIAS, EVOLUÇÃO PATRIMONIAL, FLUXO DE CAIXA) */}
      <InteractiveCharts
        cashFlowData={cashflow}
        netWorthData={networthHistory}
        fixedExpenses={fixedExpenses}
        cardTransactions={cardTransactions}
      />

      {/* 2-COLUMN SECTION: Resumo do Orçamento & Benchmark de Supermercados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 1: Resumo de Metas / Centros de Custo */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Metas por Centro de Custo</h3>
              </div>
              <button
                onClick={() => setActiveTab('budgets')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center"
              >
                Ver todos <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              Acompanhamento de tetos de gastos com código de cores inteligente do Mobills.
            </p>

            <div className="space-y-3">
              {/* Categoria 1: Supermercados */}
              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-rose-500/40">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-white">Supermercados Muriaé</span>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                    167% (Estourado)
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-1.5">
                  <span>Gasto: <strong className="text-rose-300">R$ 2.600,10</strong></span>
                  <span>Meta: R$ 1.550,00</span>
                </div>
              </div>

              {/* Categoria 2: Moradia */}
              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-white">Moradia & Habitação</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    100% (No limite)
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-1.5">
                  <span>Gasto: R$ 880,50</span>
                  <span>Meta: R$ 880,50</span>
                </div>
              </div>

              {/* Categoria 3: Farmácia */}
              <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-white">Farmácia & Medicamentos</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    55% (Saudável)
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '55%' }} />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-1.5">
                  <span>Gasto: R$ 110,90</span>
                  <span>Meta: R$ 200,00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
            <span>Alertas orçamentários: <strong className="text-rose-400 font-bold">{budgetsOverview.alertsCount}</strong></span>
            <button onClick={() => setActiveTab('budgets')} className="text-emerald-400 font-semibold hover:underline">
              Gerenciar Tetos
            </button>
          </div>
        </div>

        {/* Widget 2: Auditoria Supermercados Muriaé */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Auditoria Supermercados Muriaé</h3>
              </div>
              <button
                onClick={() => setActiveTab('cards')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center"
              >
                Faturas 6 meses <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              Consolidação real: Supermercados BH (Centro e Barra) + Bahamas Mix + Top Frut Gourmet.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Média Histórica
                </span>
                <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
                  {formatBRL(cardsAuditSummary.historicalAverage)}
                </span>
                <span className="text-[10px] text-gray-500">Média de 5 meses</span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/90 border border-amber-500/30">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Pico de Outubro
                </span>
                <span className="text-xl font-bold text-amber-300 font-mono mt-1 block">
                  {formatBRL(cardsAuditSummary.octoberPeak)}
                </span>
                <span className="text-[10px] text-rose-400">+{formatBRL(cardsAuditSummary.octoberExcess)} acima</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-300 font-mono">
              <div className="flex justify-between py-1 border-b border-gray-800/60 font-sans">
                <span className="text-gray-400">Supermercados BH Muriaé:</span>
                <span className="font-mono font-bold text-white">R$ 1.250,50</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60 font-sans">
                <span className="text-gray-400">Bahamas Mix Muriaé:</span>
                <span className="font-mono font-bold text-white">R$ 890,60</span>
              </div>
              <div className="flex justify-between py-1 font-sans">
                <span className="text-gray-400">Top Frut Gourmet Muriaé:</span>
                <span className="font-mono font-bold text-white">R$ 459,00</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
            <span className="text-gray-400">Atípicos isoláveis de Outubro:</span>
            <span className="font-mono font-bold text-emerald-400">{formatBRL(cardsAuditSummary.atypicalTotalOctober)}</span>
          </div>
        </div>

      </div>

      {/* BANNER ENGINE IPHONE 17 PRO MAX */}
      <div 
        onClick={() => setActiveTab('iphone')}
        className="cursor-pointer rounded-3xl bg-gradient-to-r from-sky-950/60 via-blue-950/40 to-gray-900 border border-sky-500/30 p-5 hover:border-sky-400/60 transition shadow-xl flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">
                Motor de Captura Automática por SMS e Push (iPhone 17 Pro Max)
              </h4>
              <span className="text-[10px] uppercase font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
                Apple Shortcuts
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl">
              Captura instantânea de compras no Nubank, Bradesco e Pix em Muriaé diretamente pelas notificações do iOS, 
              sem necessidade de digitação manual.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase text-gray-400 block font-semibold">Status do Webhook</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">Conectado / Pronto</span>
          </div>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-300">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

    </div>
  );
}
