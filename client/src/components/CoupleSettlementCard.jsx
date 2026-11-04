import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowRightLeft, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle, 
  Receipt, 
  CreditCard, 
  Gift, 
  Sparkles
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function CoupleSettlementCard({ selectedMonth }) {
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    async function fetchSettlement() {
      try {
        setLoading(true);
        const res = await fetch(`/api/reconciliation/settlement?month=${selectedMonth || '2026-10'}`);
        if (res.ok) {
          const data = await res.json();
          setSettlement(data);
        }
      } catch (err) {
        console.error('Erro ao buscar acerto do casal:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettlement();
  }, [selectedMonth]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#111318] p-5 rounded-xl border border-slate-200 dark:border-[#1F232D] text-center font-mono text-xs text-slate-500 dark:text-zinc-400 shadow-sm">
        Calculando acerto bilateral 50/50 Alexandre & Amanda...
      </div>
    );
  }

  if (!settlement) return null;

  const { summary, breakdown } = settlement;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(summary.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#111318] rounded-xl p-5 border border-slate-200 dark:border-[#1F232D] space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1F232D]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50 flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              CONCILIAÇÃO BILATERAL (REGRA 50/50)
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">REF: {settlement.referenceMonth}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
            Acerto de Contas Mensal do Casal
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 max-w-xl">
            Consolidação das contas fixas, faturas de cartão e plano Wellhub com apuração do saldo líquido exato para liquidação via Pix.
          </p>
        </div>

        {/* Status Toggle */}
        <div>
          <button
            onClick={() => setIsSettled(!isSettled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-2 border cursor-pointer ${
              isSettled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/60'
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60 hover:bg-amber-100'
            }`}
          >
            {isSettled ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Acerto Liquidado</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Pendente de Repasse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Callout Result */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 dark:bg-[#191E2B] dark:border-[#2B3346] dark:text-emerald-400">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">
              Resultado Líquido Apurado
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 font-mono tabular-nums mt-0.5">
              {summary.actionText}
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block font-semibold">
              Valor líquido: <strong>{formatBRL(summary.netAmount)}</strong>
            </span>
          </div>
        </div>

        {/* Pix action block */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="bg-white dark:bg-[#0D0F14] px-3 py-2 rounded-lg border border-slate-200 dark:border-[#262B37] text-xs text-slate-700 dark:text-zinc-300 font-mono shadow-xs">
            Chave Pix: <strong className="text-slate-900 dark:text-zinc-100">{summary.pixKey}</strong>
          </div>
          <button
            onClick={handleCopyPix}
            className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Chave Copiada' : 'Copiar Chave Pix'}</span>
          </button>
        </div>
      </div>

      {/* Breakdown Grid (3 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Item 1: Despesas Fixas */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              1. Fixas Compartilhadas
            </span>
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-zinc-100">
            {formatBRL(breakdown.sharedFixed.amandaLiability)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono leading-tight">
            Metade da Amanda (Aluguel R$ 810,50 + Terreno R$ 1.343,26 + Cemig, Copasa, internet pagos por Alexandre).
          </p>
        </div>

        {/* Item 2: Cartões de Crédito */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              2. Cartões Compartilhados
            </span>
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-purple-700 dark:text-purple-300">
            {formatBRL(breakdown.sharedCards.amandaLiability)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono leading-tight">
            Metade da Amanda em mercado (BH, Bahamas, Top Frut), combustível e farmácia.
          </p>
        </div>

        {/* Item 3: Wellhub Amanda */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              3. Assinatura Wellhub
            </span>
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-sky-700 dark:text-sky-300">
            {formatBRL(breakdown.wellhub.amandaShare)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono leading-tight">
            Cota mensal da Amanda no plano Wellhub debitada no cartão de Alexandre (+R$ 183,30).
          </p>
        </div>

      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-[#1F232D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-zinc-500">
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
          <Sparkles className="w-3 h-3" />
          <span>Fórmula: (Fixas Pagas + Cartões Compartilhados + Wellhub) - Pagamentos Diretos</span>
        </div>
        <span className="text-slate-600 dark:text-zinc-500">Blindagem: Unimed R$ 690 e Academia R$ 129,90 ficam 100% isoladas.</span>
      </div>

    </div>
  );
}
