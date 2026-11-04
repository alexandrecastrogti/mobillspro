import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Receipt, 
  Edit2, 
  Save, 
  X,
  CheckCircle2
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function CreditCardsAdvancedView({ cardsData, onUpdateCard }) {
  const [selectedCardId, setSelectedCardId] = useState('card-nubank');
  const [isEditingCard, setIsEditingCard] = useState(false);

  // Edit form state
  const [editLimit, setEditLimit] = useState('');
  const [editClosingDay, setEditClosingDay] = useState('');
  const [editDueDay, setEditDueDay] = useState('');
  const [editBestBuyDay, setEditBestBuyDay] = useState('');

  if (!cardsData || cardsData.length === 0) {
    return <div className="p-8 text-center text-slate-500 dark:text-zinc-400 font-mono text-xs">Carregando gestão avançada de cartões...</div>;
  }

  const activeCard = cardsData.find(c => c.id === selectedCardId) || cardsData[0];

  // Current day calculation for dynamic timeline
  const todayDate = new Date();
  const currentDay = todayDate.getDate();

  const closingDay = activeCard.closingDay || 24;
  const dueDay = activeCard.dueDay || 3;
  const bestBuyDay = activeCard.bestBuyDay || 25;

  const isClosed = currentDay >= closingDay;
  const daysUntilClosing = isClosed ? (30 - currentDay + closingDay) : (closingDay - currentDay);
  const cycleProgressPercent = Math.min(100, Math.max(5, Math.round((currentDay / 30) * 100)));

  const handleStartEdit = () => {
    setEditLimit(activeCard.creditLimit);
    setEditClosingDay(activeCard.closingDay);
    setEditDueDay(activeCard.dueDay);
    setEditBestBuyDay(activeCard.bestBuyDay);
    setIsEditingCard(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (onUpdateCard) {
      onUpdateCard(activeCard.id, {
        creditLimit: parseFloat(editLimit) || activeCard.creditLimit,
        closingDay: parseInt(editClosingDay) || activeCard.closingDay,
        dueDay: parseInt(editDueDay) || activeCard.dueDay,
        bestBuyDay: parseInt(editBestBuyDay) || activeCard.bestBuyDay
      });
    }
    setIsEditingCard(false);
  };

  const getBrandAccent = (cardId) => {
    if (cardId?.includes('nubank')) return 'border-t-4 border-t-[#820AD1]';
    if (cardId?.includes('bradesco')) return 'border-t-4 border-t-[#CC092F]';
    if (cardId?.includes('mercado')) return 'border-t-4 border-t-[#009EE3]';
    return 'border-t-4 border-t-slate-400';
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/50 flex items-center gap-1.5">
                <CreditCard className="w-3 h-3" />
                CICLOS DE FATURAMENTO & LIMITES
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">GESTÃO DE CARTÕES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Faturas Abertas, Fechadas e Linha do Tempo
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Planeje compras no melhor dia de cada cartão, acompanhe o fechamento das faturas e 
              monitore o comprometimento de limite contra riscos de endividamento.
            </p>
          </div>

          {/* Quick Select Cards */}
          <div className="flex flex-wrap items-center gap-2">
            {cardsData.map((c) => {
              const isSelected = selectedCardId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCardId(c.id);
                    setIsEditingCard(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-black font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-[#12141A] dark:text-zinc-400 dark:border-[#222631] hover:bg-slate-100'
                  }`}
                >
                  <span>{c.cardName}</span>
                  <span className={`text-[11px] tabular-nums font-semibold ${isSelected ? 'text-emerald-400 dark:text-emerald-700' : 'text-slate-500 dark:text-zinc-500'}`}>
                    {formatBRL(c.currentInvoice)}
                  </span>
                </button>
              );
            })}

            <button
              onClick={handleStartEdit}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#141720] dark:hover:bg-[#1A1E29] dark:text-zinc-300 text-xs font-mono border border-slate-300 dark:border-[#2B303E] flex items-center gap-1.5 transition ml-1 cursor-pointer"
              title="Ajustar limite e datas do cartão selecionado"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>Editar</span>
            </button>
          </div>
        </div>
      </div>

      {/* EDIT DRAWER IF ACTIVE */}
      {isEditingCard && (
        <form onSubmit={handleSaveEdit} className="bg-slate-50 dark:bg-[#141822] p-5 rounded-xl border border-slate-300 dark:border-[#2F3545] space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-[#222631]">
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 flex items-center gap-2">
              <Edit2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              PARÂMETROS: {activeCard.cardName.toUpperCase()}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingCard(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 mb-1 text-[11px]">Limite Total (R$)</label>
              <input
                type="number"
                step="50"
                value={editLimit}
                onChange={(e) => setEditLimit(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-1.5 text-slate-900 dark:text-zinc-100 font-mono text-xs focus:border-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 mb-1 text-[11px]">Dia de Fechamento</label>
              <input
                type="number"
                min="1"
                max="31"
                value={editClosingDay}
                onChange={(e) => setEditClosingDay(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-1.5 text-slate-900 dark:text-zinc-100 font-mono text-xs focus:border-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 mb-1 text-[11px]">Melhor Dia de Compra</label>
              <input
                type="number"
                min="1"
                max="31"
                value={editBestBuyDay}
                onChange={(e) => setEditBestBuyDay(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-1.5 text-slate-900 dark:text-zinc-100 font-mono text-xs focus:border-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 mb-1 text-[11px]">Dia de Vencimento</label>
              <input
                type="number"
                min="1"
                max="31"
                value={editDueDay}
                onChange={(e) => setEditDueDay(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 py-1.5 text-slate-900 dark:text-zinc-100 font-mono text-xs focus:border-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-[#1F232D]">
            <button
              type="button"
              onClick={() => setIsEditingCard(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 dark:bg-[#161922] dark:text-zinc-400 text-xs font-mono hover:bg-slate-300 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Parâmetros
            </button>
          </div>
        </form>
      )}

      {/* CARD FEATURED VIEW (3-COLUMN HIGH DENSITY GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Chassis Credit Card */}
        <div className={`rounded-xl p-5 bg-white dark:bg-[#12151D] border border-slate-200 dark:border-[#242A38] ${getBrandAccent(activeCard.id)} relative flex flex-col justify-between min-h-[200px] shadow-sm`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 dark:text-zinc-400 block font-semibold">
                {activeCard.brand}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-0.5 tracking-tight">{activeCard.cardName}</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1C212D] text-[10px] font-mono text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-[#2D3344]">
              {activeCard.id}
            </span>
          </div>

          <div className="my-3">
            <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-zinc-500 block tracking-wider font-semibold">
              FATURA ATUAL ({isClosed ? 'FECHADA' : activeCard.invoiceStatus})
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-mono tabular-nums mt-0.5">
              {formatBRL(activeCard.currentInvoice)}
            </div>
          </div>

          <div className="flex justify-between items-end text-xs font-mono text-slate-700 dark:text-zinc-300 pt-3 border-t border-slate-100 dark:border-[#1F232D]">
            <div>
              <span className="text-[9px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">Melhor Compra</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Dia {activeCard.bestBuyDay}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">Vencimento</span>
              <span className="text-slate-900 dark:text-zinc-200 font-bold">Dia {activeCard.dueDay}</span>
            </div>
          </div>
        </div>

        {/* Comprometimento de Limite */}
        <div className="bg-white dark:bg-[#111318] rounded-xl p-5 border border-slate-200 dark:border-[#1F232D] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-[#1F232D]">
              <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Comprometimento de Limite</h4>
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                activeCard.limitRisk === 'HEALTHY'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40'
                  : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40'
              }`}>
                {activeCard.limitUsedPercent}% Utilizado
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Limite Total:</span>
                <span className="font-semibold text-slate-900 dark:text-zinc-200 tabular-nums">{formatBRL(activeCard.creditLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Limite Utilizado:</span>
                <span className="font-semibold text-amber-700 dark:text-amber-300 tabular-nums">{formatBRL(activeCard.usedLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Limite Disponível:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatBRL(activeCard.availableLimit)}</span>
              </div>
            </div>

            {/* Gauge bar */}
            <div className="mt-4 space-y-1">
              <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-transparent">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    activeCard.limitUsedPercent > 70 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, activeCard.limitUsedPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                <span>0%</span>
                <span>Alerta: 70%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono mt-3 pt-2 border-t border-slate-100 dark:border-[#1F232D]">
            {activeCard.notes}
          </p>
        </div>

        {/* Status das Faturas */}
        <div className="bg-white dark:bg-[#111318] rounded-xl p-5 border border-slate-200 dark:border-[#1F232D] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-[#1F232D]">
              <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Status das Faturas</h4>
              <Receipt className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0E1015] border border-slate-200 dark:border-[#1F232D] flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-zinc-200">Fatura Atual</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      isClosed 
                        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/40' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40'
                    }`}>
                      {isClosed ? 'FECHADA' : 'ABERTA'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">Vencimento: {activeCard.dueDate}</span>
                </div>
                <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-zinc-100">{formatBRL(activeCard.currentInvoice)}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0E1015] border border-slate-200 dark:border-[#1F232D] flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">Próxima Fatura (Estimada)</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">Lançamentos futuros</span>
                </div>
                <span className="text-sm font-semibold font-mono tabular-nums text-slate-600 dark:text-zinc-400">{formatBRL(activeCard.nextInvoiceEstimated)}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-[#141720] border border-emerald-200 dark:border-[#222838] text-[11px] text-slate-700 dark:text-zinc-300 font-mono mt-3">
            <strong className="text-emerald-700 dark:text-emerald-400">Regra de Ouro:</strong> Compras a partir do dia <strong>{activeCard.bestBuyDay}</strong> caem 
            na fatura seguinte (até 40 dias de prazo).
          </div>
        </div>

      </div>

      {/* TIMELINE VISUAL DINÂMICA DO CICLO DA FATURA */}
      <div className="bg-white dark:bg-[#111318] rounded-xl p-5 border border-slate-200 dark:border-[#1F232D] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[#1F232D]">
          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
            CRONÔMETRO DE CICLO: {activeCard.cardName.toUpperCase()}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#161922] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-[#262B37] font-mono">
              Hoje: Dia {currentDay}
            </span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-mono font-semibold border ${
              isClosed ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40' : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40'
            }`}>
              {isClosed ? 'Fatura Fechada' : `${daysUntilClosing} dias até Fechamento`}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-400">
          Acompanhe os marcos críticos do mês para programar os gastos com o máximo de prazo. A barra preenchida reflete o avanço atual do ciclo:
        </p>

        {/* Dynamic Progress Timeline */}
        <div className="relative py-6 px-4">
          
          {/* Background track */}
          <div className="absolute top-1/2 left-4 right-4 h-2 bg-slate-100 dark:bg-[#1F232D] -translate-y-1/2 rounded-full z-0 border border-slate-200 dark:border-transparent" />

          {/* Filled track */}
          <div 
            className="absolute top-1/2 left-4 h-2 bg-emerald-600 -translate-y-1/2 rounded-full z-0 transition-all duration-300"
            style={{ width: `calc(${cycleProgressPercent}% - 32px)` }}
          />

          <div className="relative z-10 grid grid-cols-4 gap-2">
            
            {/* Step 1: Início Ciclo */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#12151D] border-2 border-slate-300 dark:border-zinc-600 flex items-center justify-center text-xs font-mono font-bold text-slate-700 dark:text-zinc-300 shadow-xs">
                1
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-300 mt-2 block">Início Ciclo</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono">Dia 1</span>
            </div>

            {/* Step 2: Fechamento */}
            <div className="flex flex-col items-center text-center">
              <div className={`w-8 h-8 rounded-full bg-white dark:bg-[#12151D] border-2 ${
                currentDay >= closingDay ? 'border-purple-600 text-purple-700 dark:border-purple-400 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60' : 'border-slate-300 dark:border-[#2D3344] text-slate-400 dark:text-zinc-400'
              } flex items-center justify-center text-xs font-mono font-bold shadow-xs`}>
                {currentDay >= closingDay ? <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" /> : '2'}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-300 mt-2 block">Fechamento</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">Dia {activeCard.closingDay}</span>
            </div>

            {/* Step 3: Melhor Dia */}
            <div className="flex flex-col items-center text-center">
              <div className={`w-8 h-8 rounded-full ${
                currentDay >= bestBuyDay ? 'bg-emerald-600 text-white border-2 border-emerald-500 shadow-sm' : 'bg-white dark:bg-[#12151D] border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400'
              } flex items-center justify-center text-xs font-mono font-bold`}>
                ★
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-2 block">Melhor Compra</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">Dia {activeCard.bestBuyDay}</span>
            </div>

            {/* Step 4: Vencimento */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#12151D] border-2 border-amber-500 flex items-center justify-center text-xs font-mono font-bold text-amber-700 dark:text-amber-300 shadow-xs">
                4
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-300 mt-2 block">Vencimento</span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">Dia {activeCard.dueDay}</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
