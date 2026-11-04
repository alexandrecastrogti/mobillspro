import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function FireWealthSimulator({ initialNetWorth = 247000, defaultMonthlyContribution = 2000 }) {
  const [monthlyContribution, setMonthlyContribution] = useState(defaultMonthlyContribution);
  const [annualRate, setAnnualRate] = useState(13.75); // Exactly Selic 13.75% as per section 3

  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;

  // Função de cálculo de juros compostos com aportes mensais
  const calculateFutureValue = (months) => {
    let fv = initialNetWorth;
    for (let i = 0; i < months; i++) {
      fv = (fv + monthlyContribution) * (1 + monthlyRate);
    }
    return Math.round(fv);
  };

  const proj1Year = calculateFutureValue(12);
  const proj3Years = calculateFutureValue(36);
  const proj5Years = calculateFutureValue(60);
  const proj10Years = calculateFutureValue(120);

  // Estimativa de tempo para marcos (milestones)
  const calculateMonthsToTarget = (targetAmount) => {
    if (initialNetWorth >= targetAmount) return 0;
    if (monthlyContribution <= 0 && monthlyRate <= 0) return 999;

    let balance = initialNetWorth;
    let months = 0;
    while (balance < targetAmount && months < 600) {
      balance = (balance + monthlyContribution) * (1 + monthlyRate);
      months++;
    }
    return months;
  };

  const milestones = [
    {
      title: "Reserva Blindada & Aportes Iniciais",
      target: 300000,
      monthlyPassiveIncome: 3000,
      badge: "Curto Prazo"
    },
    {
      title: "Meio Milhão (Renda Passiva R$ 5.000/mês)",
      target: 500000,
      monthlyPassiveIncome: 5000,
      badge: "Médio Prazo"
    },
    {
      title: "Independência Financeira (R$ 1 Milhão)",
      target: 1000000,
      monthlyPassiveIncome: 10000,
      badge: "Liberdade Plena"
    }
  ];

  return (
    <div className="bg-white dark:bg-[#111318] rounded-xl p-5 border border-slate-200 dark:border-[#1F232D] space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1F232D]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50 flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              SIMULADOR FIRE & PROJEÇÃO DE RIQUEZA
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">JUROS COMPOSTOS (SELIC 13,75% + NOMAD USD)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Projeção de Liberdade Financeira de Alexandre & Amanda
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 max-w-2xl">
            Simule o acúmulo de patrimônio reinvestindo o seu <strong>Número Mágico</strong> mensal em ativos de alta rentabilidade (13,75% Selic e S&P 500 em dólar).
          </p>
        </div>

        {/* Current Net Worth Pill */}
        <div className="bg-amber-50/50 dark:bg-[#12151D] border border-amber-200 dark:border-[#222838] px-3.5 py-2.5 rounded-xl text-right font-mono">
          <span className="text-[9px] font-semibold text-amber-800 dark:text-zinc-500 uppercase tracking-wider block">
            Patrimônio Familiar Base
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-amber-400 tabular-nums">
            {formatBRL(initialNetWorth)}
          </span>
        </div>
      </div>

      {/* Controls: Aporte Mensal & Taxa de Retorno */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <label className="text-slate-800 dark:text-zinc-300 font-semibold">
              Aporte Mensal Reinvestido (R$)
            </label>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {formatBRL(monthlyContribution)}/mês
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="6000"
            step="250"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-[#1F232D] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
            <span>R$ 500</span>
            <span>R$ 2.000</span>
            <span>R$ 4.000</span>
            <span>R$ 6.000</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <label className="text-slate-800 dark:text-zinc-300 font-semibold">
              Rentabilidade Média Ponderada
            </label>
            <span className="font-bold text-amber-700 dark:text-amber-400 tabular-nums">
              {annualRate.toFixed(2)}% a.a.
            </span>
          </div>
          <input
            type="range"
            min="8"
            max="16"
            step="0.25"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-[#1F232D] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
            <span>8% (Conservador)</span>
            <span>13.75% (Selic)</span>
            <span>16% (Otimista)</span>
          </div>
        </div>
      </div>

      {/* Projection Horizon Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-1 font-mono">
          <span className="text-[9px] uppercase text-slate-500 dark:text-zinc-500 block">Em 1 Ano (12 meses)</span>
          <div className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
            {formatBRL(proj1Year)}
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 tabular-nums block font-semibold">
            +{formatBRL(proj1Year - initialNetWorth)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-1 font-mono">
          <span className="text-[9px] uppercase text-slate-500 dark:text-zinc-500 block">Em 3 Anos (36 meses)</span>
          <div className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
            {formatBRL(proj3Years)}
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 tabular-nums block font-semibold">
            +{formatBRL(proj3Years - initialNetWorth)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-1 font-mono">
          <span className="text-[9px] uppercase text-amber-700 dark:text-amber-400 block font-semibold">Em 5 Anos (60 meses)</span>
          <div className="text-base font-bold text-slate-900 dark:text-amber-300 tabular-nums">
            {formatBRL(proj5Years)}
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 tabular-nums block font-semibold">
            +{formatBRL(proj5Years - initialNetWorth)}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-1 font-mono">
          <span className="text-[9px] uppercase text-emerald-700 dark:text-emerald-400 block font-semibold">Em 10 Anos (120 meses)</span>
          <div className="text-base font-bold text-slate-900 dark:text-emerald-300 tabular-nums">
            {formatBRL(proj10Years)}
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 tabular-nums block font-semibold">
            +{formatBRL(proj10Years - initialNetWorth)}
          </span>
        </div>

      </div>

      {/* Milestones to Financial Freedom */}
      <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-[#1F232D]">
        <h4 className="text-[10px] font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          Marcos de Liberdade Financeira (Tempo Estimado):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {milestones.map((m, idx) => {
            const monthsNeeded = calculateMonthsToTarget(m.target);
            const years = (monthsNeeded / 12).toFixed(1);

            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-2">
                <div className="flex justify-between items-start font-mono">
                  <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-200 dark:bg-[#181C26] dark:text-amber-400 dark:border-amber-800/40">
                    {m.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 tabular-nums">
                    {formatBRL(m.target)}
                  </span>
                </div>

                <h5 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 leading-snug">
                  {m.title}
                </h5>

                <div className="pt-2 border-t border-slate-200 dark:border-[#1F232D] flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-500 text-[11px]">Tempo estimado:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {monthsNeeded === 0 ? "Atingido!" : `${monthsNeeded} meses (~${years} anos)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
