import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Wallet, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  UserCheck, 
  Users, 
  Plus, 
  Gift, 
  HelpCircle,
  FileCheck,
  Calculator
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function DivisionIncomesView({ wellhubData, incomesData, fixedExpensesData }) {
  const [calcTotal, setCalcTotal] = useState('');
  const [calcCategory, setCalcCategory] = useState('Despesa Compartilhada');

  // Breakdown figures
  const salario = 9996.21;
  const bolsa = 1100.00;
  const totalReceitasAlexandre = salario + bolsa; // 11096.21
  const wellhubTotal = 549.90; // 183.30 * 3
  const unimedIndividual = 485.00;
  const academiaIndividual = 140.00;
  const totalIndividuaisAlexandre = unimedIndividual + academiaIndividual; // 625.00

  // Quick 50/50 calculator logic
  const numericCalc = parseFloat(calcTotal.replace(',', '.')) || 0;
  const alexandreCalcShare = numericCalc / 2;
  const amandaCalcShare = numericCalc / 2;

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Regra 50/50 Alexandre & Amanda
              </span>
              <span className="text-xs text-gray-400">Muriaé/MG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Receitas Pessoais e Divisão de Contas
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Estrutura financeira bilateral: divisão equitativa das contas de moradia, mercado e consumo comum, 
              com blindagem das despesas estritamente individuais de Alexandre e compensação automática dos créditos Wellhub.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 text-center min-w-[180px]">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Receitas Alexandre
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {formatBRL(totalReceitasAlexandre)}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Salário R$ 9.996,21 + Bolsa R$ 1.100,00
              </span>
            </div>

            <div className="bg-gray-900/90 border border-emerald-500/30 rounded-2xl p-4 text-center min-w-[180px]">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Crédito Wellhub Terceiros
              </span>
              <span className="text-2xl font-black text-white font-mono mt-1 block">
                +{formatBRL(wellhubTotal)}
              </span>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">
                3 cotas de R$ 183,30 creditadas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: Fontes de Receita vs Wellhub Automático */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Composição das Receitas de Alexandre */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Receitas Líquidas de Alexandre</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              {formatBRL(totalReceitasAlexandre)}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Salário Líquido Mensal</span>
                <span className="text-xs text-gray-400">Contrato profissional principal</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400 font-mono block">R$ 9.996,21</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Mensal Fixo</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Bolsa de Monitoria Acadêmica</span>
                <span className="text-xs text-gray-400">Atividade docente/acadêmica auxiliar</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400 font-mono block">R$ 1.100,00</span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Mensal Fixo</span>
              </div>
            </div>
          </div>

          {/* Subtotal Callout */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Entrada Garantida Alexandre:</strong>
              O total mensal de <strong>R$ 11.096,21</strong> serve como lastro principal para cobrir 
              sua metade nas despesas compartilhadas (50%), seus custos estritamente pessoais e investimentos.
            </div>
          </div>
        </div>

        {/* Card 2: Reembolsos Automáticos Wellhub (Crédito na Fatura) */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Reembolsos Automáticos de Wellhub</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              +{formatBRL(wellhubTotal)}/mês
            </span>
          </div>

          <p className="text-xs text-gray-300">
            Como o benefício corporativo está no nome de Alexandre, terceiros utilizam o plano familiar e repassam 
            exatamente <strong>R$ 183,30</strong> cada via Pix/crédito, abatendo o valor cobrado na fatura do cartão:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Amanda (Parceira)</span>
                  <span className="text-[11px] text-gray-400">Wellhub Plano Silver</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 font-mono block">+R$ 183,30</span>
                <span className="text-[10px] text-emerald-500 font-semibold uppercase">Creditado</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  T
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Taiana</span>
                  <span className="text-[11px] text-gray-400">Wellhub Plano Silver</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 font-mono block">+R$ 183,30</span>
                <span className="text-[10px] text-emerald-500 font-semibold uppercase">Creditado</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  N
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Nilvana</span>
                  <span className="text-[11px] text-gray-400">Wellhub Plano Silver</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 font-mono block">+R$ 183,30</span>
                <span className="text-[10px] text-emerald-500 font-semibold uppercase">Creditado</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 font-mono bg-gray-900 p-2.5 rounded-xl border border-gray-800">
            <strong>Impacto Contábil:</strong> O cartão debita as assinaturas, mas a compensação de <strong>R$ 549,90</strong> 
            neutraliza a despesa no cálculo do "Número Mágico" mensal.
          </div>
        </div>
      </div>

      {/* REGRAS DE EXCEÇÃO (INDIVIDUAIS ALEXANDRE) & CALCULADORA 50/50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 3: Blindagem das Despesas Individuais (Não entram na divisão 50/50) */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Despesas 100% Individuais (Exceções ao 50/50)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg">
              {formatBRL(totalIndividuaisAlexandre)}
            </span>
          </div>

          <p className="text-xs text-gray-300">
            Conforme pactuado, estas despesas <strong>NÃO</strong> entram no rateio meio a meio com a Amanda 
            e são assumidas integralmente (100%) por Alexandre:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Unimed Individual Alexandre</span>
                <span className="text-[11px] text-gray-400">Plano de saúde exclusivo individual</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-300 font-mono block">R$ 485,00</span>
                <span className="text-[10px] text-amber-400 font-semibold uppercase">100% Alexandre</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Academia Alexandre</span>
                <span className="text-[11px] text-gray-400">Mensalidade treino individual</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-300 font-mono block">R$ 140,00</span>
                <span className="text-[10px] text-amber-400 font-semibold uppercase">100% Alexandre</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-400">
            <span className="text-amber-400 font-semibold">Nota de Auditoria:</span> O checklist mensal aplica 
            automaticamente a bandeira "INDIVIDUAL" para estas contas, não gerando cobrança para Amanda.
          </div>
        </div>

        {/* Card 4: Calculadora Rápida 50/50 para Novas Despesas */}
        <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Calculadora Instantânea 50/50</h3>
          </div>

          <p className="text-xs text-gray-300">
            Vai realizar uma nova compra compartilhada no cartão ou pagar uma conta avulsa de casa em Muriaé? 
            Veja a divisão em tempo real:
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1">
                Valor Total da Despesa (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono font-bold text-sm">
                  R$
                </span>
                <input
                  type="text"
                  placeholder="Ex: 350,00"
                  value={calcTotal}
                  onChange={(e) => setCalcTotal(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-gray-900 border border-emerald-500/30 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Cota Alexandre (50%)
                </span>
                <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                  {formatBRL(alexandreCalcShare)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-900 border border-blue-500/30 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Cota Amanda (50%)
                </span>
                <span className="text-lg font-black text-blue-400 font-mono mt-0.5 block">
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

