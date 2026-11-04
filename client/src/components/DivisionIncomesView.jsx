import React, { useState } from 'react';
import { CoupleSettlementCard } from './CoupleSettlementCard';
import {
  Wallet,
  ShieldAlert,
  Sparkles,
  Users,
  Plus,
  Gift,
  Calculator,
  Trash2
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function DivisionIncomesView({ wellhubData, incomesData, fixedExpensesData, onDeleteIncome, onOpenNewModal }) {
  const [calcTotal, setCalcTotal] = useState('');
  const [calcCategory, setCalcCategory] = useState('Despesa Compartilhada');

  const salario = 9996.21;
  const bolsa = 1100.00;
  const totalReceitasAlexandre = incomesData && incomesData.length > 0
    ? incomesData.reduce((acc, curr) => acc + Number(curr.amount), 0)
    : salario + bolsa;
  const wellhubTotal = 549.90;
  const unimedIndividual = 690.00;
  const academiaIndividual = 129.90;
  const totalIndividuaisAlexandre = unimedIndividual + academiaIndividual;

  const numericCalc = parseFloat(calcTotal.replace(',', '.')) || 0;
  const alexandreCalcShare = numericCalc / 2;
  const amandaCalcShare = numericCalc / 2;

  const handleDelete = (id, desc) => {
    if (window.confirm(`Tem certeza que deseja remover "${desc}"?`)) {
      if (onDeleteIncome) onDeleteIncome(id);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50 flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                ESTRUTURA 50/50 BILATERAL
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">MURIAÉ/MG • ALEXANDRE & AMANDA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Receitas Pessoais e Divisão de Contas
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Estrutura bilateral: divisão equitativa das contas de moradia, mercado e consumo comum,
              com blindagem das despesas estritamente individuais de Alexandre e compensação automática dos créditos Wellhub.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3 text-center min-w-[170px]">
              <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block">
                Total Receitas Alexandre
              </span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums mt-0.5 block">
                {formatBRL(totalReceitasAlexandre)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono mt-0.5 block">
                Salário + Monitoria
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3 text-center min-w-[170px]">
              <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider block">
                Crédito Wellhub
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-zinc-100 font-mono tabular-nums mt-0.5 block">
                +{formatBRL(wellhubTotal)}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block font-semibold">
                3 cotas creditadas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RELATÓRIO DINÂMICO DE ACERTO 50/50 DO CASAL */}
      <CoupleSettlementCard selectedMonth="2026-10" />

      {/* 2-COLUMN SECTION: Fontes de Receita vs Wellhub Automático */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Card 1: Composição das Receitas de Alexandre */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Receitas Líquidas de Alexandre</h3>
            </div>

            <button
              onClick={onOpenNewModal}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3" /> Nova Receita
            </button>
          </div>

          <div className="space-y-2">
            {incomesData && incomesData.map((inc) => (
              <div key={inc.id} className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 block">{inc.description}</span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">{inc.category} • {inc.userName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums block">{formatBRL(inc.amount)}</span>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-mono">Mensal</span>
                  </div>

                  {incomesData.length > 2 && (
                    <button
                      onClick={() => handleDelete(inc.id, inc.description)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 transition"
                      title="Excluir receita"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-[#141822] border border-emerald-100 dark:border-[#222838] text-xs font-mono text-slate-700 dark:text-zinc-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-slate-900 dark:text-zinc-100 block">Entrada Garantida Alexandre:</strong>
              O total de <strong>R$ 11.096,21</strong> serve como lastro principal para cobrir
              sua metade nas despesas compartilhadas (50%), custos pessoais blindados e investimentos.
            </div>
          </div>
        </div>

        {/* Card 2: Reembolsos Automáticos Wellhub */}
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Reembolsos de Wellhub</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800/40 px-2 py-0.5 rounded">
              +{formatBRL(wellhubTotal)}/mês
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Como o benefício corporativo está no nome de Alexandre, terceiros utilizam o plano e repassam
            exatamente <strong>R$ 183,30</strong> cada via Pix/crédito, abatendo o débito da fatura:
          </p>

          <div className="space-y-2">
            {[
              { name: 'Amanda (Parceira)', plan: 'Wellhub Silver', letter: 'A' },
              { name: 'Taiana', plan: 'Wellhub Silver', letter: 'T' },
              { name: 'Nilvana', plan: 'Wellhub Silver', letter: 'N' }
            ].map((u, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-[#1A1F2C] border border-slate-300 dark:border-[#2B3346] text-slate-800 dark:text-zinc-300 flex items-center justify-center font-mono font-bold text-[11px]">
                    {u.letter}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 block">{u.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">{u.plan}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums block">+R$ 183,30</span>
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono uppercase">Creditado</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-600 dark:text-zinc-400 font-mono bg-slate-50 dark:bg-[#10131A] p-2.5 rounded-lg border border-slate-200 dark:border-[#1F232D]">
            <strong className="text-slate-900 dark:text-zinc-200">Impacto Contábil:</strong> O cartão debita as assinaturas, mas a compensação de <strong>R$ 549,90</strong>
            neutraliza a despesa no cálculo do "Número Mágico".
          </div>
        </div>
      </div>

      {/* REGRAS DE EXCEÇÃO & CALCULADORA 50/50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F232D]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Despesas 100% Individuais (Blindadas)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-950/60 dark:border-amber-800/40 px-2 py-0.5 rounded">
              {formatBRL(totalIndividuaisAlexandre)}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Conforme pactuado, estas despesas <strong>NÃO</strong> entram no rateio meio a meio com a Amanda
            e são assumidas integralmente (100%) por Alexandre:
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 block">Unimed Individual Alexandre</span>
                <span className="text-[10px] text-slate-500">Plano de saúde individual</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 tabular-nums block">R$ 690,00</span>
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase">100% Alexandre</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 block">Academia Alexandre</span>
                <span className="text-[10px] text-slate-500">Mensalidade treino individual</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 tabular-nums block">R$ 129,90</span>
                <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase">100% Alexandre</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-[#1F232D]">
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Calculadora Instantânea 50/50</h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Vai realizar uma nova compra compartilhada ou pagar uma conta avulsa de casa em Muriaé?
            Veja a divisão em tempo real:
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 block mb-1">
                Valor Total da Despesa (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 font-mono text-xs">
                  R$
                </span>
                <input
                  type="text"
                  placeholder="Ex: 350,00"
                  value={calcTotal}
                  onChange={(e) => setCalcTotal(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 pl-9 py-2 text-slate-900 dark:text-zinc-100 font-mono text-xs focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] text-center font-mono">
                <span className="text-[9px] uppercase font-semibold text-slate-500 dark:text-zinc-500 block">
                  Cota Alexandre (50%)
                </span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5 block">
                  {formatBRL(alexandreCalcShare)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] text-center font-mono">
                <span className="text-[9px] uppercase font-semibold text-slate-500 dark:text-zinc-500 block">
                  Cota Amanda (50%)
                </span>
                <span className="text-base font-bold text-slate-800 dark:text-zinc-200 tabular-nums mt-0.5 block">
                  {formatBRL(amandaCalcShare)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
