import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/formatters';

export function CreditCardsAdvancedView({ cardsData }) {
  const [selectedCardId, setSelectedCardId] = useState('card-nubank');

  if (!cardsData || cardsData.length === 0) {
    return <div className="p-8 text-center text-gray-400">Carregando gestão avançada de cartões...</div>;
  }

  const activeCard = cardsData.find(c => c.id === selectedCardId) || cardsData[0];

  return (
    <div className="space-y-6">
      
      {/* HEADER HERO */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Gestão de Cartões & Faturas (Padrão Mobills)
              </span>
              <span className="text-xs text-gray-400">Ciclos de Faturamento & Limites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Faturas Abertas, Fechadas e Linha do Tempo
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Planeje compras no melhor dia de cada cartão, acompanhe o fechamento das faturas e 
              monitore o comprometimento de limite contra riscos de endividamento.
            </p>
          </div>

          {/* Quick Select Cards */}
          <div className="flex flex-wrap gap-2">
            {cardsData.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCardId(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  selectedCardId === c.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400'
                    : 'bg-gray-900 text-gray-300 border border-gray-800 hover:border-gray-700'
                }`}
              >
                <span>{c.cardName}</span>
                <span className="text-[10px] opacity-75 font-mono">{formatBRL(c.currentInvoice)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARD FEATURED VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Realistic Credit Card */}
        <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${activeCard.themeClass} border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px]`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest block">
                {activeCard.brand}
              </span>
              <h3 className="text-2xl font-black text-white mt-0.5">{activeCard.cardName}</h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-white text-xs border border-white/20">
              •••
            </div>
          </div>

          <div className="my-4">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Fatura Atual ({activeCard.invoiceStatus})
            </span>
            <div className="text-3xl font-black text-white font-mono mt-0.5">
              {formatBRL(activeCard.currentInvoice)}
            </div>
          </div>

          <div className="flex justify-between items-end text-xs font-mono text-gray-300 pt-3 border-t border-white/10">
            <div>
              <span className="text-[9px] uppercase text-gray-400 block">Melhor Compra</span>
              <span className="text-emerald-400 font-bold">Dia {activeCard.bestBuyDay}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase text-gray-400 block">Vencimento</span>
              <span className="text-white font-bold">Dia {activeCard.dueDay}</span>
            </div>
          </div>
        </div>

        {/* Limite Utilizado vs Disponível */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
              <h4 className="text-sm font-bold text-white">Comprometimento de Limite</h4>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                activeCard.limitRisk === 'HEALTHY'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {activeCard.limitUsedPercent}% Utilizado
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Limite Total:</span>
                <span className="font-bold text-white">{formatBRL(activeCard.creditLimit)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Limite Utilizado:</span>
                <span className="font-bold text-amber-300">{formatBRL(activeCard.usedLimit)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Limite Disponível:</span>
                <span className="font-bold text-emerald-400">{formatBRL(activeCard.availableLimit)}</span>
              </div>
            </div>

            {/* Gauge bar */}
            <div className="mt-4 space-y-1">
              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeCard.limitUsedPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${activeCard.limitUsedPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0%</span>
                <span>Alerta 70%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-800/80">
            {activeCard.notes}
          </p>
        </div>

        {/* Fatura Aberta vs Fechada */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
              <h4 className="text-sm font-bold text-white">Status das Faturas</h4>
              <Receipt className="w-4 h-4 text-purple-400" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-white block">Fatura Atual ({activeCard.invoiceStatus})</span>
                  <span className="text-[10px] text-gray-400">Vencimento: {activeCard.dueDate}</span>
                </div>
                <span className="text-sm font-bold font-mono text-purple-300">{formatBRL(activeCard.currentInvoice)}</span>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-gray-300 block">Próxima Fatura (Estimada)</span>
                  <span className="text-[10px] text-gray-400">Lançamentos em aberto</span>
                </div>
                <span className="text-sm font-bold font-mono text-gray-400">{formatBRL(activeCard.nextInvoiceEstimated)}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-300 mt-3">
            <strong>Dica de Ouro:</strong> Compras realizadas a partir do dia <strong>{activeCard.bestBuyDay}</strong> só 
            entram na fatura do mês seguinte (até 40 dias de prazo).
          </div>
        </div>

      </div>

      {/* TIMELINE VISUAL DO CICLO DA FATURA */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Linha do Tempo Visual do Ciclo da Fatura ({activeCard.cardName})
        </h3>

        <p className="text-xs text-gray-400">
          Acompanhe os marcos críticos do mês para programar os gastos do casal com o máximo de prazo:
        </p>

        {/* Timeline visualization */}
        <div className="relative py-6">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2 z-0" />

          <div className="relative z-10 grid grid-cols-4 gap-2">
            
            {/* Step 1: Início Ciclo */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-600 flex items-center justify-center text-xs font-bold text-gray-400">
                1
              </div>
              <span className="text-xs font-bold text-gray-300 mt-2 block">Início Ciclo</span>
              <span className="text-[11px] text-gray-500 font-mono">Dia {activeCard.closingDay - 30 > 0 ? activeCard.closingDay - 30 : 1}</span>
            </div>

            {/* Step 2: Fechamento */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-purple-500 flex items-center justify-center text-xs font-bold text-purple-400">
                2
              </div>
              <span className="text-xs font-bold text-purple-300 mt-2 block">Fechamento</span>
              <span className="text-[11px] text-gray-400 font-mono">Dia {activeCard.closingDay}</span>
            </div>

            {/* Step 3: Melhor Dia */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-xs font-black text-black">
                ★
              </div>
              <span className="text-xs font-bold text-emerald-400 mt-2 block">Melhor Compra</span>
              <span className="text-[11px] text-emerald-300 font-mono">Dia {activeCard.bestBuyDay}</span>
            </div>

            {/* Step 4: Vencimento */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-amber-500 flex items-center justify-center text-xs font-bold text-amber-400">
                4
              </div>
              <span className="text-xs font-bold text-amber-300 mt-2 block">Vencimento</span>
              <span className="text-[11px] text-gray-400 font-mono">Dia {activeCard.dueDay}</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
