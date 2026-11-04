import React, { useState } from 'react';
import { 
  Terminal, 
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
  Smartphone,
  Plus,
  Users,
  Receipt,
  Sparkles,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  ArrowRightLeft,
  Copy,
  Check
} from 'lucide-react';
import { formatBRL, formatUSD, formatPercent } from '../utils/formatters';
import { Landmark, ArrowUp, ArrowDown } from 'lucide-react';
import { InteractiveCharts } from './InteractiveCharts';
import { CashflowCalendarWidget } from './CashflowCalendarWidget';
import { DashboardSkeleton } from './DashboardSkeleton';

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
  cardTransactions,
  onOpenNewModal,
  onResetSystem
}) {
  const [copiedPix, setCopiedPix] = useState(false);

  if (!summaryData || !summaryData.balance) {
    return <DashboardSkeleton />;
  }

  const { balance, profile, cardsAuditSummary, investmentsSummary, recentPixAlerts, cashflow, networthHistory, budgetsOverview } = summaryData;

  const periods = [
    { id: 'CURRENT_MONTH', label: 'Mês Atual', shortLabel: 'Mês' },
    { id: 'PREVIOUS_MONTH', label: 'Mês Anterior', shortLabel: 'Ant' },
    { id: 'LAST_3_MONTHS', label: 'Últimos 3 Meses', shortLabel: '3M' },
    { id: 'CURRENT_YEAR', label: 'Ano (2026)', shortLabel: '2026' },
  ];

  const handleCopyPix = () => {
    try {
      navigator.clipboard.writeText('alexandre@muriae.fin');
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    } catch (err) {
      console.warn('Clipboard write fallback:', err);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* =========================================================================
          MOBILLS HEADER: TÍTULO DA PÁGINA + ALAVANCAS DE CENÁRIO
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Visão financeira unificada Alexandre & Amanda • Muriaé/MG
          </p>
        </div>

        {/* Executive Levers & Scenario Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Switch 1: Isolar Atípicos */}
          <button
            type="button"
            onClick={() => setExcludeAtypical(!excludeAtypical)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              excludeAtypical
                ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                : 'bg-white text-slate-600 border-slate-200 dark:bg-[#141720] dark:text-zinc-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${excludeAtypical ? 'bg-purple-600' : 'bg-slate-300'}`} />
            <span>Isolar Atípicos (R$ 1.480)</span>
          </button>

          {/* Switch 2: Simular Apto Centro Caixa SAC */}
          <button
            type="button"
            onClick={() => setUseNewApartment(!useNewApartment)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              useNewApartment
                ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                : 'bg-white text-slate-600 border-slate-200 dark:bg-[#141720] dark:text-zinc-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${useNewApartment ? 'bg-sky-500' : 'bg-slate-300'}`} />
            <span>Apto Centro Caixa SAC</span>
          </button>

          {onResetSystem && (
            <button
              onClick={onResetSystem}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#141720] text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-[#252B39] text-xs font-medium hover:border-slate-300 transition flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Restaurar dados originais do seed oficial"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          THE 4 BIG KPI CARDS (MOBILLS WEB STYLE: CARTOES BRANCOS COM ICONES CIRCULARES)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Saldo Livre Real (Número Mágico) */}
        <div 
          onClick={() => setActiveTab('budget503020')}
          className="workbench-card p-4 sm:p-5 flex items-center justify-between cursor-pointer group hover:border-sky-300 transition-all"
          role="button"
          tabIndex={0}
          title="Saldo Livre Real apurado após fixas e cartões"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
              <Landmark className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                <span>Saldo livre real</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tabular-nums mt-0.5 tracking-tight font-mono">
                {formatBRL(balance.magicNumber)}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Receitas */}
        <div 
          onClick={() => setActiveTab('incomes')}
          className="workbench-card p-4 sm:p-5 flex items-center justify-between cursor-pointer group hover:border-emerald-300 transition-all"
          role="button"
          tabIndex={0}
          title="Salário Líquido R$ 9.996,21 + Bolsa R$ 1.100 + Wellhub R$ 549,90"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0">
              <ArrowUp className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                <span>Receitas</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tabular-nums mt-0.5 tracking-tight font-mono">
                {formatBRL(balance.totalAvailableAlexandre)}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Despesas Fixas */}
        <div 
          onClick={() => setActiveTab('checklist')}
          className="workbench-card p-4 sm:p-5 flex items-center justify-between cursor-pointer group hover:border-rose-300 transition-all"
          role="button"
          tabIndex={0}
          title="Minha cota nas contas fixas (Aluguel, Terreno, Cemig, Copasa, Unimed...)"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#EF4444] text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
              <ArrowDown className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                <span>Despesas</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tabular-nums mt-0.5 tracking-tight font-mono">
                {formatBRL(balance.fixedExpenses.total)}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Cartão de Crédito */}
        <div 
          onClick={() => setActiveTab('cards')}
          className="workbench-card p-4 sm:p-5 flex items-center justify-between cursor-pointer group hover:border-teal-300 transition-all"
          role="button"
          tabIndex={0}
          title="Projeção limpa de faturas de cartões (Nubank, Bradesco, Mercado Pago)"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#0D9488] text-white flex items-center justify-center shadow-md shadow-teal-600/25 shrink-0">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                <span>Cartão de crédito</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tabular-nums mt-0.5 tracking-tight font-mono">
                {formatBRL(balance.cards.totalAlexandre)}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MOBILLS SUB-LINK: MEU DESEMPENHO */}
      <div className="flex items-center justify-between pt-0.5 pb-1">
        <button
          onClick={() => setActiveTab('budget503020')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition cursor-pointer"
        >
          <span>Meu Desempenho (Método 50/30/20)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans hidden sm:inline">
          Salário R$ 9.996,21 + Bolsa R$ 1.100,00 + Wellhub R$ 549,90
        </span>
      </div>

      {/* =========================================================================
          MÉTODO 50/30/20 SPOTLIGHT (DIRETAMENTE DA PLANILHA MENSAL ALEXANDRE & AMANDA)
         ========================================================================= */}
      <div 
        onClick={() => setActiveTab('budget503020')}
        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#11141B] border border-slate-200 dark:border-[#1F232D] shadow-sm hover:border-emerald-400 dark:hover:border-emerald-600/50 transition-all duration-150 cursor-pointer group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-[#1F232D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Target className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                  Método 50 / 30 / 20 • Planilha Mensal
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300">
                  Sob Controle
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Divisão orçamentária do casal calculada sobre a receita líquida de R$ 11.096,21
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('budget503020');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1F2B] dark:hover:bg-[#252B3B] text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-[#2D3341] text-xs font-mono flex items-center gap-1.5 self-start sm:self-auto transition"
          >
            <span>Ver Planilha 50/30/20</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3 Pillars Visual Progress Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141720] border border-slate-200/70 dark:border-[#202532]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-slate-600 dark:text-zinc-400 font-semibold">50% Essenciais</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">35,7% / 50%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '71.5%' }} />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-zinc-400 mt-1.5">
              <span>Gasto: R$ 3.966,86</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Margem: +R$ 1.581,24</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141720] border border-slate-200/70 dark:border-[#202532]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-slate-600 dark:text-zinc-400 font-semibold">30% Estilo de Vida</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">24,0% / 30%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: '80%' }} />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-zinc-400 mt-1.5">
              <span>Gasto: R$ 2.664,18</span>
              <span className="text-sky-600 dark:text-sky-400 font-medium">Margem: +R$ 664,68</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141720] border border-slate-200/70 dark:border-[#202532]">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-slate-600 dark:text-zinc-400 font-semibold">20% Reserva & Aportes</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">40,2% / 20%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }} />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-zinc-400 mt-1.5">
              <span>Capacidade: R$ 4.465,17</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">+20,2% acima meta</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ZONE 3: OPERATIONAL COUPLING STRIP (ACERTO 50/50 AMANDA & 3 CARTÕES)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Bilateral Settlement Summary Card (5 Columns) */}
        <div className="lg:col-span-5 workbench-card p-4 sm:p-5 border border-slate-200 dark:border-[#1F232D] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                  Conciliação Bilateral 50/50
                </h3>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300">
                Pendente
              </span>
            </div>

            <div className="my-3 font-mono">
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase block font-semibold">Repasse Amanda &rarr; Alexandre (Outubro):</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                R$ 4.642,56
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans mt-1">
                Compensação exata das despesas fixas da casa, faturas compartilhadas de mercado e cota do Wellhub.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-[#1F232D] flex items-center justify-between gap-2 font-mono text-xs">
            <button
              onClick={handleCopyPix}
              className="px-3 py-2 min-h-[44px] rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#161922] dark:hover:bg-[#1E232F] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-[#262B37] hover:border-slate-300 dark:hover:border-zinc-500 flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-emerald-500/70 focus:outline-none cursor-pointer text-xs shadow-sm"
              title="Copiar chave Pix alexandre@muriae.fin para transferência do acerto"
            >
              {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />}
              <span>{copiedPix ? 'Chave Copiada' : 'Copiar Pix'}</span>
            </button>

            <button
              onClick={() => setActiveTab('incomes')}
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 min-h-[44px] px-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-150 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-emerald-500/70 focus:outline-none cursor-pointer"
            >
              Relatório Completo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Credit Cards Status Strip (7 Columns) */}
        <div className="lg:col-span-7 workbench-card p-4 sm:p-5 border border-slate-200 dark:border-[#1F232D] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">
                  Faturas dos 3 Cartões de Crédito
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('cards-advanced')}
                className="text-xs font-mono text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 min-h-[44px] px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1A1E29] transition-all duration-150 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-emerald-500/70 focus:outline-none cursor-pointer"
              >
                Detalhar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3 font-mono">
              {/* Nubank */}
              <div 
                onClick={() => setActiveTab('cards-advanced')}
                className="p-3 rounded-lg bg-slate-50 dark:bg-[#10131B] border border-slate-200 dark:border-[#1F232D] hover:border-purple-500/60 hover:bg-slate-100 dark:hover:bg-[#121522] transition-all duration-150 cursor-pointer min-h-[44px] active:scale-[0.99] focus-visible:ring-1 focus-visible:ring-emerald-500/70 focus:outline-none group shadow-sm"
                tabIndex={0}
                role="button"
                aria-label="Fatura Nubank Ultravioleta: R$ 1.820,40. Fecha dia 24. Pressione Enter para detalhar"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab('cards-advanced');
                  }
                }}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 mb-1">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">Nubank UV</span>
                  <span>Fecha: 24</span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                  R$ 1.820,40
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-between">
                  <span>Melhor compra: Dia 25</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Bradesco */}
              <div 
                onClick={() => setActiveTab('cards-advanced')}
                className="p-3 rounded-lg bg-slate-50 dark:bg-[#10131B] border border-slate-200 dark:border-[#1F232D] hover:border-rose-500/60 hover:bg-slate-100 dark:hover:bg-[#151218] transition-all duration-150 cursor-pointer min-h-[44px] active:scale-[0.99] focus-visible:ring-1 focus-visible:ring-emerald-500/70 focus:outline-none group shadow-sm"
                tabIndex={0}
                role="button"
                aria-label="Fatura Bradesco Visa: R$ 1.780,00. Fecha dia 18. Pressione Enter para detalhar"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab('cards-advanced');
                  }
                }}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400 mb-1">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">Bradesco Visa</span>
                  <span>Fecha: 18</span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                  R$ 1.780,00
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center justify-between">
                  <span>Melhor compra: Dia 19</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>

              {/* Mercado Pago */}
              <div 
                onClick={() => setActiveTab('cards-advanced')}
                className="p-3 rounded-lg bg-slate-50 dark:bg-[#10131B] border border-slate-200 dark:border-[#1F232D] hover:border-sky-500/60 hover:bg-slate-100 dark:hover:bg-[#101522] transition-all duration-150 cursor-pointer min-h-[44px] active:scale-[0.99] focus-visible:ring-1 focus-visible:ring-emerald-500/70 focus:outline-none group shadow-sm"
                tabIndex={0}
                role="button"
                aria-label="Fatura Mercado Pago: R$ 1.520,00. Fecha dia 10. Pressione Enter para detalhar"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab('cards-advanced');
                  }
                }}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                  <span className="font-semibold text-sky-400 group-hover:text-sky-300 transition-colors">Mercado Pago</span>
                  <span>Fecha: 10</span>
                </div>
                <div className="text-base font-bold text-zinc-100 tabular-nums">
                  R$ 1.520,00
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center justify-between">
                  <span>Melhor compra: Dia 11</span>
                  <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#1F232D] flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Total consolidado Outubro:</span>
            <span className="font-bold text-zinc-200 tabular-nums">R$ 5.120,40</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ZONE 4: ANALYTICS & BUDGET INTELLIGENCE (GRÁFICOS, METAS & BENCHMARK)
         ========================================================================= */}
      <InteractiveCharts
        cashFlowData={cashflow}
        netWorthData={networthHistory}
        fixedExpenses={fixedExpenses}
        cardTransactions={cardTransactions}
      />

      {/* 2-COLUMN SECTION: Metas vs Benchmark de Supermercados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Widget 1: Resumo de Metas */}
        <div className="workbench-panel p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111318] border border-slate-100 dark:border-[#1F232D] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">Metas por Centro de Custo</h3>
              </div>
              <button
                onClick={() => setActiveTab('budgets')}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 min-h-[44px] px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1A1E29] transition-all duration-150 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-purple-500/70 focus:outline-none cursor-pointer"
              >
                Ver todas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 font-mono">
              {/* Categoria 1: Supermercados */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1015] border border-slate-100 dark:border-[#1F232D]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Supermercados Muriaé</span>
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-800/40">
                    167% (Estourado)
                  </span>
                </div>
                <div 
                  className="w-full bg-slate-200 dark:bg-[#181B22] h-1.5 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label="Orçamento Supermercados Muriaé"
                  aria-valuenow={167}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: '100%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                  <span>Gasto: <strong className="text-rose-600 dark:text-rose-300 tabular-nums">R$ 2.600,10</strong></span>
                  <span className="tabular-nums">Meta: R$ 1.550,00</span>
                </div>
              </div>

              {/* Categoria 2: Moradia */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1015] border border-slate-100 dark:border-[#1F232D]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Moradia & Habitação</span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800/40">
                    100% (No limite)
                  </span>
                </div>
                <div 
                  className="w-full bg-slate-200 dark:bg-[#181B22] h-1.5 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label="Orçamento Moradia e Habitação"
                  aria-valuenow={100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: '100%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                  <span className="tabular-nums">Gasto: R$ 880,50</span>
                  <span className="tabular-nums">Meta: R$ 880,50</span>
                </div>
              </div>

              {/* Categoria 3: Farmácia */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1015] border border-slate-100 dark:border-[#1F232D]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Farmácia & Medicamentos</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/40">
                    55% (Saudável)
                  </span>
                </div>
                <div 
                  className="w-full bg-slate-200 dark:bg-[#181B22] h-1.5 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label="Orçamento Farmácia e Medicamentos"
                  aria-valuenow={55}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: '55%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                  <span className="tabular-nums">Gasto: R$ 110,90</span>
                  <span className="tabular-nums">Meta: R$ 200,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: Benchmark de Supermercados */}
        <div className="workbench-panel p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111318] border border-slate-100 dark:border-[#1F232D] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">Benchmark Supermercados Muriaé</h3>
              </div>
              <button
                onClick={() => setActiveTab('cards')}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 min-h-[44px] px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1A1E29] transition-all duration-150 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-purple-500/70 focus:outline-none cursor-pointer"
              >
                Faturas 6 meses <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1015] border border-slate-100 dark:border-[#1F232D]">
                <span className="text-[9px] uppercase text-slate-500 dark:text-zinc-400 block font-medium">
                  Média Histórica
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 block">
                  {formatBRL(cardsAuditSummary.historicalAverage)}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500">Média 5 meses</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1015] border border-amber-200 dark:border-amber-800/40">
                <span className="text-[9px] uppercase text-amber-700 dark:text-amber-400 block font-medium">
                  Pico de Outubro
                </span>
                <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-300 tabular-nums mt-0.5 block">
                  {formatBRL(cardsAuditSummary.octoberPeak)}
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">+{formatBRL(cardsAuditSummary.octoberExcess)} excesso</span>
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1A1D26]">
                <span className="text-slate-500 dark:text-zinc-400">Supermercados BH Muriaé:</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200 tabular-nums">R$ 1.250,50</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#1A1D26]">
                <span className="text-slate-500 dark:text-zinc-400">Bahamas Mix Muriaé:</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200 tabular-nums">R$ 890,60</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-zinc-400">Top Frut Gourmet Muriaé:</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200 tabular-nums">R$ 459,00</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1F232D] flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500 dark:text-zinc-400">Atípicos isoláveis de Outubro:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatBRL(cardsAuditSummary.atypicalTotalOctober)}</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ZONE 5: TEMPORAL CADENCE & AUTONOMOUS CAPTURE (AGENDA & IPHONE WEBHOOK)
         ========================================================================= */}
      <CashflowCalendarWidget />

      {/* BANNER ENGINE IPHONE 17 PRO MAX */}
      <div 
        onClick={() => setActiveTab('iphone')}
        className="cursor-pointer rounded-2xl bg-white dark:bg-[#11141B] border border-slate-100 dark:border-[#1F232D] hover:border-purple-300 dark:hover:border-[#2F3646] p-4 transition-all duration-150 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 min-h-[48px] active:scale-[0.99] shadow-xs group"
        tabIndex={0}
        role="button"
        aria-label="Motor de Captura por Notificações iPhone 17 Pro Max: Abrir console do webhook"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveTab('iphone');
          }
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#181B24] text-zinc-300 border border-[#252A36] group-hover:border-[#343B4C] transition-colors shrink-0">
            <Smartphone className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wide group-hover:text-white transition-colors">
                Motor de Captura por Notificações (iPhone 17 Pro Max)
              </h4>
              <span className="text-[10px] uppercase font-mono font-semibold bg-[#1C202B] text-zinc-300 px-1.5 py-0.2 rounded border border-[#293040]">
                Apple Shortcuts
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sincronização passiva de transações via atalhos e notificações locais do iOS.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 font-mono pt-2 md:pt-0 border-t md:border-t-0 border-[#1F232D]">
          <div className="text-left md:text-right">
            <span className="text-[9px] uppercase text-zinc-500 block font-semibold">Status do Webhook</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 md:justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Conectado / Pronto
            </span>
          </div>
          <div className="p-1 rounded bg-[#181B24] text-zinc-400 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-all">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

    </div>
  );
}
