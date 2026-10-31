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
  Info
} from 'lucide-react';
import { formatBRL, formatUSD, formatPercent } from '../utils/formatters';

export function DashboardView({
  summaryData,
  excludeAtypical,
  setExcludeAtypical,
  useNewApartment,
  setUseNewApartment,
  setActiveTab,
  onToggleFixedExpense
}) {
  if (!summaryData || !summaryData.balance) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
        Carregando balanço inteligente...
      </div>
    );
  }

  const { balance, profile, cardsAuditSummary, investmentsSummary, recentPixAlerts } = summaryData;

  return (
    <div className="space-y-6">
      
      {/* HERO SECTION: Saldo Livre ("Número Mágico") com Controles Interativos */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-[#0E1526] to-[#062419] border border-emerald-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Número Mágico Display */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Automação Inteligente de Balanço
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                balance.health.status === 'EXCELENTE'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
              }`}>
                Saúde: {balance.health.status} ({balance.health.savingsRate}% de sobra)
              </span>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-400">
                Saldo Livre Mensal Real de Alexandre ("Número Mágico"):
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-mono">
                  {formatBRL(balance.magicNumber)}
                </h2>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-1 rounded-lg">
                  Líquido Disponível
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              Calculado em tempo real: Salário (R$ 9.996,21) + Bolsa Monitoria (R$ 1.100) + Reembolsos Wellhub (+{formatBRL(balance.totalWellhubCredit)}) 
              menos Despesas Fixas (Alexandre), Faturas e Pix.
            </p>
          </div>

          {/* Right: Quick Interactive Toggles (What-If Simulation) */}
          <div className="bg-gray-950/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-gray-800 shadow-xl space-y-3.5 min-w-[300px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Simuladores de Impacto Imediato
            </h3>

            {/* Toggle 1: Eliminar Atípicos de Outubro */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition">
              <div>
                <span className="text-xs font-bold text-gray-200 block">
                  Eliminar Atípicos Outubro
                </span>
                <span className="text-[11px] text-gray-400 block">
                  Funilaria R$ 1.000 + Fim Bradesco
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExcludeAtypical(!excludeAtypical)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  excludeAtypical ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    excludeAtypical ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Simular Apartamento Novo no Centro (Caixa SBPE SAC) */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition">
              <div>
                <span className="text-xs font-bold text-gray-200 block">
                  Simular Apto Centro (Caixa SAC)
                </span>
                <span className="text-[11px] text-gray-400 block">
                  Financiamento + Economia Gasolina
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUseNewApartment(!useNewApartment)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  useNewApartment ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    useNewApartment ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Note on simulation impact */}
            <div className="text-[11px] text-emerald-400/90 font-mono bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
              {excludeAtypical ? '✓ Atípicos eliminados (+ R$ 740 na sua cota)' : '• Gastos extraordinários incluídos'}
              <br />
              {useNewApartment ? '✓ Cenário Centro ativo (Impacto líquido: -R$ 967,56)' : '• Cenário Moradia Atual ativo'}
            </div>
          </div>
        </div>
      </div>

      {/* 4 CARDS DE INDICADORES CHAVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Receitas Alexandre + Wellhub */}
        <div 
          onClick={() => setActiveTab('incomes')}
          className="cursor-pointer glass-card rounded-2xl p-5 hover:border-emerald-500/50 transition group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Entradas Alexandre
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white font-mono">
              {formatBRL(balance.totalAvailableAlexandre)}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex items-center justify-between">
              <span>Salário + Monitoria:</span>
              <span className="font-semibold text-gray-200">{formatBRL(balance.totalIncomeAlexandre)}</span>
            </p>
            <p className="text-xs text-emerald-400 flex items-center justify-between mt-0.5">
              <span>+ Wellhub Terceiros:</span>
              <span className="font-semibold font-mono">+{formatBRL(balance.totalWellhubCredit)}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Despesas Fixas (Alexandre) */}
        <div 
          onClick={() => setActiveTab('checklist')}
          className="cursor-pointer glass-card rounded-2xl p-5 hover:border-emerald-500/50 transition group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Fixas Alexandre
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white font-mono">
              {formatBRL(balance.fixedExpenses.total)}
            </h3>
            <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(balance.fixedExpenses.paidItems / balance.fixedExpenses.totalItems) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
              <span className="text-emerald-400 font-semibold">
                {balance.fixedExpenses.paidItems}/{balance.fixedExpenses.totalItems} Quitados
              </span>
              <span>{formatBRL(balance.fixedExpenses.pending)} pendente</span>
            </div>
          </div>
        </div>

        {/* Card 3: Fatura Cartões Alexandre */}
        <div 
          onClick={() => setActiveTab('cards')}
          className="cursor-pointer glass-card rounded-2xl p-5 hover:border-emerald-500/50 transition group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Cartões Alexandre
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white font-mono">
              {formatBRL(balance.cards.totalAlexandre)}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex items-center justify-between">
              <span>Status Faturas:</span>
              <span className="text-purple-300 font-semibold">3 Cartões Ativos</span>
            </p>
            <p className="text-xs text-amber-400 flex items-center justify-between mt-0.5">
              <span>Economia Atípicos:</span>
              <span className="font-semibold font-mono">
                {excludeAtypical ? `-${formatBRL(balance.cards.atypicalSavings)}` : 'R$ 0,00'}
              </span>
            </p>
          </div>
        </div>

        {/* Card 4: Patrimônio Líquido Total */}
        <div 
          onClick={() => setActiveTab('investments')}
          className="cursor-pointer glass-card rounded-2xl p-5 hover:border-emerald-500/50 transition group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Patrimônio Total
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white font-mono">
              {formatBRL(investmentsSummary.totalNetWorthBRL)}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex items-center justify-between">
              <span>Nomad Global USD:</span>
              <span className="text-emerald-400 font-semibold font-mono">
                {formatUSD(investmentsSummary.nomadUSD)} ({formatBRL(investmentsSummary.nomadBRL)})
              </span>
            </p>
            <p className="text-xs text-gray-400 flex items-center justify-between mt-0.5">
              <span>Selic 2029:</span>
              <span className="text-amber-300 font-semibold">{investmentsSummary.selicRate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: Checklist Rápido + Auditoria de Supermercados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 1: Resumo do Checklist de Fixas */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Checklist de Quitação das Fixas
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('checklist')}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center font-semibold"
              >
                Ver todos <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              Acompanhamento mensal com marcadores visuais. Clique na aba correspondente para quitar ou alterar boletos.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold text-gray-200 block">
                      Aluguel Moradia Atual (50/50)
                    </span>
                    <span className="text-[11px] text-gray-400">Venceu dia 10 • Imobiliária Muriaé</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white font-mono block">R$ 810,50</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Pago
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold text-gray-200 block">
                      Prestação do Terreno (50/50)
                    </span>
                    <span className="text-[11px] text-gray-400">Venceu dia 15 • Boleto Loteadora</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white font-mono block">R$ 1.343,26</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Pago
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold text-gray-200 block">
                      Unimed Individual Alexandre
                    </span>
                    <span className="text-[11px] text-gray-400">100% Alexandre • Boleto Saúde</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white font-mono block">R$ 485,00</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Pago
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <span>Total Fixas Alexandre: <strong className="text-white font-mono">{formatBRL(balance.fixedExpenses.total)}</strong></span>
            <span className="text-emerald-400 font-semibold">100% dos boletos de Outubro liquidados</span>
          </div>
        </div>

        {/* Widget 2: Auditoria Supermercados Muriaé (Benchmark) */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Auditoria Supermercados Muriaé
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('cards')}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center font-semibold"
              >
                Ver histórico 6 meses <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              Média consolidada real (BH + Bahamas + Top Frut Gourmet) comparada com o pico atípico registrado em Outubro/2026.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
                <span className="text-[11px] uppercase font-bold text-gray-400 block tracking-wider">
                  Média Histórica Real
                </span>
                <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
                  {formatBRL(cardsAuditSummary.historicalAverage)}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Referência normal de 5 meses
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-900/90 border border-amber-500/30">
                <span className="text-[11px] uppercase font-bold text-amber-400 block tracking-wider">
                  Pico de Outubro
                </span>
                <span className="text-xl font-bold text-amber-300 font-mono mt-1 block">
                  {formatBRL(cardsAuditSummary.octoberPeak)}
                </span>
                <span className="text-[10px] text-red-400 mt-0.5 block">
                  +{formatBRL(cardsAuditSummary.octoberExcess)} acima da média
                </span>
              </div>
            </div>

            {/* Lojas de Muriaé breakdown */}
            <div className="space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between items-center py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Supermercados BH (Centro + Barra):</span>
                <span className="font-mono font-semibold text-white">R$ 1.250,50</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Bahamas Mix Muriaé:</span>
                <span className="font-mono font-semibold text-white">R$ 890,60</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">Top Frut Gourmet Muriaé:</span>
                <span className="font-mono font-semibold text-white">R$ 459,00</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
            <span className="text-gray-400">Gastos atípicos elimináveis de Outubro:</span>
            <span className="font-mono font-bold text-emerald-400">{formatBRL(cardsAuditSummary.atypicalTotalOctober)}</span>
          </div>
        </div>
      </div>

      {/* BANNER TRANSITION CENTRO (CAIXA SBPE) */}
      <div 
        onClick={() => setActiveTab('housing')}
        className="cursor-pointer rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-gray-900 border border-blue-500/30 p-5 hover:border-blue-400/60 transition shadow-xl flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">
                Simulador de Transição: Apartamento no Centro (Caixa SBPE SAC)
              </h4>
              <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                Muriaé/MG
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl">
              Compare a Moradia Atual (Aluguel R$ 810,50 + Terreno R$ 1.343,26) com o Financiamento Caixa SAC (R$ 3.231,32) 
              e veja a economia automática de combustível rodando a pé no Centro (-R$ 360,00/mês).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase text-gray-400 block font-semibold">Economia Combustível</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">R$ 360,00/mês</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-300">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

    </div>
  );
}
