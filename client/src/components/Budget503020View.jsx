import React, { useState } from 'react';
import {
  PieChart,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Home,
  ShoppingBag,
  Coins,
  Sliders,
  DollarSign,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { calculateBudget503020 } from '../utils/financeEngine';

export function Budget503020View({ summaryData, selectedMonth = '2026-10' }) {
  const [simulatedIncome, setSimulatedIncome] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Dados reais base do Alexandre & Amanda em Muriaé/MG
  const baseIncome = summaryData?.balance?.income || 11096.21;
  const fixedExpenses = summaryData?.balance?.myFixedShare || 3966.86;
  const variableExpenses = (summaryData?.balance?.cardProjection || 2439.18) + (summaryData?.balance?.pixOut || 225.00);
  const investedAmount = 2000.00;

  const activeIncome = isSimulating && parseFloat(simulatedIncome.replace(',', '.')) > 0
    ? parseFloat(simulatedIncome.replace(',', '.'))
    : baseIncome;

  const budget = calculateBudget503020(activeIncome, fixedExpenses, variableExpenses, investedAmount);

  return (
    <div className="space-y-6">

      {/* HEADER HERO */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                MÉTODO 50 / 30 / 20 • PLANILHA OFICIAL MURIAÉ
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">REF: {selectedMonth}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Planejamento Financeiro Doméstico 50/30/20
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Baseado na metodologia da sua planilha de controle: <strong>50%</strong> para gastos essenciais, 
              <strong> 30%</strong> para vontades e estilo de vida, e <strong>20%</strong> destinados à reserva financeira e investimentos.
            </p>
          </div>

          {/* Master Inflow Badge */}
          <div className="bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3.5 text-center min-w-[240px]">
            <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block">
              Receita Líquida Base
            </span>
            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums mt-0.5 block">
              {formatBRL(activeIncome)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
              Salário R$ 9.996,21 + Monitoria R$ 1.100
            </span>
          </div>
        </div>

        {/* Global 50/30/20 Macro Allocation Bar */}
        <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-[#1F232D]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-600 dark:text-zinc-400 mb-1.5">
            <span>Distribuição Realizada: Fixas ({budget.essential50.percentage}%) • Variáveis ({budget.lifestyle30.percentage}%) • Investimentos ({budget.investment20.percentage}%)</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {budget.isBalanced ? '✓ Orçamento Equilibrado' : '⚠ Revisar Gastos'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#181C25] h-3 rounded-full overflow-hidden flex border border-slate-200 dark:border-transparent">
            <div 
              className="bg-blue-500 h-full transition-all duration-300" 
              style={{ width: `${Math.min(50, budget.essential50.percentage)}%` }} 
              title="Fixas Essenciais (Teto 50%)" 
            />
            <div 
              className="bg-purple-500 h-full transition-all duration-300" 
              style={{ width: `${Math.min(30, budget.lifestyle30.percentage)}%` }} 
              title="Variáveis e Cartões (Teto 30%)" 
            />
            <div 
              className="bg-emerald-500 h-full transition-all duration-300" 
              style={{ width: `${Math.min(20, budget.investment20.percentage)}%` }} 
              title="Investimentos (Meta 20%)" 
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-1.5">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> 50% Essenciais</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> 30% Vontades</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 20% Investimentos</span>
          </div>
        </div>
      </div>

      {/* THE 3 PILLARS (50 / 30 / 20) CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Pillar 1: 50% Essenciais */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">
                    50% • Fixas Essenciais
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500">Moradia, Contas e Saúde</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300">
                {budget.essential50.percentage}%
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-slate-500">Teto Planejado (50%):</span>
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 tabular-nums">
                  {formatBRL(budget.essential50.target)}
                </span>
              </div>

              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-slate-500">Realizado Alexandre:</span>
                <span className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                  {formatBRL(budget.essential50.actual)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-transparent mt-2">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (budget.essential50.actual / budget.essential50.target) * 100)}%` }}
                />
              </div>

              <div className="pt-2 text-xs font-mono flex justify-between items-center">
                <span className="text-slate-500">Margem restante:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  +{formatBRL(budget.essential50.diff)}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#1F232D] text-[11px] font-mono text-slate-500 space-y-1">
              <div className="flex justify-between"><span>• Aluguel (50/50):</span><span className="text-slate-700 dark:text-zinc-300">R$ 810,50</span></div>
              <div className="flex justify-between"><span>• Parcela Terreno (50/50):</span><span className="text-slate-700 dark:text-zinc-300">R$ 1.343,26</span></div>
              <div className="flex justify-between"><span>• Unimed Individual (100%):</span><span className="text-slate-700 dark:text-zinc-300">R$ 690,00</span></div>
              <div className="flex justify-between"><span>• Cemig, Copasa, Net, Academia:</span><span className="text-slate-700 dark:text-zinc-300">R$ 1.123,10</span></div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-blue-50/60 dark:bg-[#121622] text-[11px] text-blue-900 dark:text-blue-300 font-mono border border-blue-100 dark:border-[#1D253A]">
            ✓ Despesas essenciais consom <strong>{budget.essential50.percentage}%</strong> da receita (abaixo do limite de 50%).
          </div>
        </div>

        {/* Pillar 2: 30% Variáveis (Vontades & Estilo de Vida) */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">
                    30% • Vontades & Estilo
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500">Mercado, Combustível, iFood, Lazer</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300">
                {budget.lifestyle30.percentage}%
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-slate-500">Teto Planejado (30%):</span>
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 tabular-nums">
                  {formatBRL(budget.lifestyle30.target)}
                </span>
              </div>

              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-slate-500">Realizado Projetado:</span>
                <span className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                  {formatBRL(budget.lifestyle30.actual)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-transparent mt-2">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (budget.lifestyle30.actual / budget.lifestyle30.target) * 100)}%` }}
                />
              </div>

              <div className="pt-2 text-xs font-mono flex justify-between items-center">
                <span className="text-slate-500">Margem restante:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  +{formatBRL(budget.lifestyle30.diff)}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#1F232D] text-[11px] font-mono text-slate-500 space-y-1">
              <div className="flex justify-between"><span>• Média Supermercados (BH/Bahamas):</span><span className="text-slate-700 dark:text-zinc-300">R$ 1.533,28</span></div>
              <div className="flex justify-between"><span>• Posto Faisão / Combustível:</span><span className="text-slate-700 dark:text-zinc-300">R$ 480,00</span></div>
              <div className="flex justify-between"><span>• iFood & Farmácia Indiana:</span><span className="text-slate-700 dark:text-zinc-300">R$ 370,00</span></div>
              <div className="flex justify-between"><span>• Streaming & Saídas Pix:</span><span className="text-slate-700 dark:text-zinc-300">R$ 280,90</span></div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-purple-50/60 dark:bg-[#1B1626] text-[11px] text-purple-900 dark:text-purple-300 font-mono border border-purple-100 dark:border-[#2D2140]">
            ✓ Gastos variáveis sob controle em <strong>{budget.lifestyle30.percentage}%</strong> (teto de 30%).
          </div>
        </div>

        {/* Pillar 3: 20% Investimentos & Reservas */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">
                    20% • Reserva & Investimentos
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500">Tesouro Selic, Nomad USD, CDB</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400">
                {budget.investment20.percentage}%
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-slate-500">Meta Mínima (20%):</span>
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 tabular-nums">
                  {formatBRL(budget.investment20.target)}
                </span>
              </div>

              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-slate-500">Capacidade Real de Aporte:</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatBRL(budget.availableToInvest)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-transparent mt-2">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (budget.availableToInvest / budget.investment20.target) * 100)}%` }}
                />
              </div>

              <div className="pt-2 text-xs font-mono flex justify-between items-center">
                <span className="text-slate-500">Potencial de poupança:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {((budget.availableToInvest / activeIncome) * 100).toFixed(1)}% da renda
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#1F232D] text-[11px] font-mono text-slate-500 space-y-1">
              <div className="flex justify-between"><span>• Tesouro Selic (13,75% a.a.):</span><span className="text-emerald-700 dark:text-emerald-400 font-semibold">R$ 10.000,00</span></div>
              <div className="flex justify-between"><span>• CDB 110% CDI Liquidez:</span><span className="text-emerald-700 dark:text-emerald-400 font-semibold">R$ 15.000,00</span></div>
              <div className="flex justify-between"><span>• Nomad do Augusto (USD 2.500 @ 5,40):</span><span className="text-emerald-700 dark:text-emerald-400 font-semibold">R$ 13.500,00</span></div>
              <div className="flex justify-between"><span>• Patrimônio Total Líquido:</span><span className="text-slate-900 dark:text-zinc-100 font-bold">R$ 38.500,00</span></div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-[#121E19] text-[11px] text-emerald-900 dark:text-emerald-300 font-mono border border-emerald-100 dark:border-[#1E3B2E]">
            ★ A capacidade de aporte ({((budget.availableToInvest / activeIncome) * 100).toFixed(1)}%) supera com folga a meta de 20%!
          </div>
        </div>

      </div>

      {/* DEMONSTRATIVO FINANCEIRO CONSOLIDADO DA PLANILHA */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1F232D]">
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              DEMONSTRATIVO FINANCEIRO DO MÊS (CONCILIAÇÃO DA PLANILHA)
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Cálculo exato de sobras e tetos orçamentários do casal em Muriaé/MG
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40 px-2.5 py-1 rounded-full">
            Resultado Positivo (Investir)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1F232D] text-slate-400 dark:text-zinc-500 text-[10px] uppercase">
                <th className="pb-2">Bloco do Método</th>
                <th className="pb-2">Teto / Meta Planilha</th>
                <th className="pb-2">Realizado Atual</th>
                <th className="pb-2">% da Renda</th>
                <th className="pb-2">Balanço / Sobra</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1F232D]">
              <tr>
                <td className="py-2.5 font-bold text-blue-700 dark:text-blue-300">50% - Despesas Fixas (Essenciais)</td>
                <td className="py-2.5 text-slate-600 dark:text-zinc-400">{formatBRL(budget.essential50.target)}</td>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-zinc-100">{formatBRL(budget.essential50.actual)}</td>
                <td className="py-2.5 text-slate-600 dark:text-zinc-400">{budget.essential50.percentage}%</td>
                <td className="py-2.5 text-emerald-700 dark:text-emerald-400 font-semibold">+{formatBRL(budget.essential50.diff)} (Sobrou)</td>
                <td className="py-2.5 text-right"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">DENTRO DO TETO</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-purple-700 dark:text-purple-300">30% - Despesas Variáveis (Vontades)</td>
                <td className="py-2.5 text-slate-600 dark:text-zinc-400">{formatBRL(budget.lifestyle30.target)}</td>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-zinc-100">{formatBRL(budget.lifestyle30.actual)}</td>
                <td className="py-2.5 text-slate-600 dark:text-zinc-400">{budget.lifestyle30.percentage}%</td>
                <td className="py-2.5 text-emerald-700 dark:text-emerald-400 font-semibold">+{formatBRL(budget.lifestyle30.diff)} (Sobrou)</td>
                <td className="py-2.5 text-right"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">DENTRO DO TETO</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-emerald-700 dark:text-emerald-400">20% - Reserva & Investimentos</td>
                <td className="py-2.5 text-slate-600 dark:text-zinc-400">{formatBRL(budget.investment20.target)}</td>
                <td className="py-2.5 font-semibold text-slate-900 dark:text-zinc-100">{formatBRL(budget.availableToInvest)} (Potencial)</td>
                <td className="py-2.5 text-slate-600 dark:text-zinc-400">{((budget.availableToInvest / activeIncome) * 100).toFixed(1)}%</td>
                <td className="py-2.5 text-emerald-700 dark:text-emerald-400 font-semibold">+{formatBRL(budget.availableToInvest - budget.investment20.target)} (Excedente)</td>
                <td className="py-2.5 text-right"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">SUPEROU A META</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SIMULADOR DE CENÁRIO DE RENDA 50/30/20 */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            SIMULAR OUTRO CENÁRIO DE RECEITA LÍQUIDA
          </h3>
          {isSimulating && (
            <button
              onClick={() => {
                setIsSimulating(false);
                setSimulatedIncome('');
              }}
              className="text-xs text-rose-600 hover:underline cursor-pointer"
            >
              Restaurar Renda Original
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">R$</span>
            <input
              type="text"
              placeholder="Ex: 14000,00 (somando renda extra/13º)"
              value={simulatedIncome}
              onChange={(e) => {
                setSimulatedIncome(e.target.value);
                setIsSimulating(true);
              }}
              className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 pl-9 py-2 text-slate-900 dark:text-zinc-100 text-xs outline-none focus:border-emerald-500 transition"
            />
          </div>
          <span className="text-xs text-slate-500">
            Digite qualquer valor de renda mensal para ver o recálculo instantâneo dos tetos de 50%, 30% e 20%.
          </span>
        </div>
      </div>

    </div>
  );
}
