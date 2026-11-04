import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  CreditCard, 
  Sparkles, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  Star
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function CashflowCalendarWidget() {
  const [filterType, setFilterType] = useState('ALL');
  const today = new Date().getDate();

  const calendarEvents = [
    {
      day: 5,
      title: "Salário Alexandre + Bolsa Monitoria",
      category: "ENTRADA",
      type: "income",
      amount: 11096.21,
      badge: "Receita Própria",
      color: "emerald"
    },
    {
      day: 10,
      title: "Fechamento Mercado Pago & DEMSUR Água",
      category: "FECHAMENTO_E_FIXA",
      type: "card_and_bill",
      amount: 115.00,
      badge: "DEMSUR + Fatura MP Fecha",
      color: "sky"
    },
    {
      day: 12,
      title: "Vencimento Energisa Muriaé (Luz)",
      category: "FIXA",
      type: "bill",
      amount: 280.00,
      badge: "50/50 Amanda",
      color: "amber"
    },
    {
      day: 15,
      title: "Vencimento Aluguel Residencial",
      category: "FIXA",
      type: "bill",
      amount: 1621.00,
      share: 810.50,
      badge: "50/50 Amanda",
      color: "amber"
    },
    {
      day: 17,
      title: "Vencimento Fatura Mercado Pago",
      category: "FATURA",
      type: "card_due",
      amount: 1520.00,
      badge: "Vencimento MP",
      color: "purple"
    },
    {
      day: 18,
      title: "Fechamento Fatura Bradesco Visa",
      category: "FECHAMENTO",
      type: "card_close",
      badge: "Fatura Bradesco Fecha",
      color: "rose"
    },
    {
      day: 19,
      title: "Melhor Dia Bradesco Visa Platinum",
      category: "MELHOR_DIA",
      type: "best_buy",
      badge: "★ Melhor Compra Bradesco",
      color: "emerald"
    },
    {
      day: 20,
      title: "Vencimento Parcela do Terreno",
      category: "FIXA",
      type: "bill",
      amount: 2686.52,
      share: 1343.26,
      badge: "50/50 Amanda",
      color: "amber"
    },
    {
      day: 24,
      title: "Fechamento Fatura Nubank Ultravioleta",
      category: "FECHAMENTO",
      type: "card_close",
      badge: "Fatura Nubank Fecha",
      color: "purple"
    },
    {
      day: 25,
      title: "Melhor Dia Nubank & Vencimento Bradesco",
      category: "MELHOR_DIA_E_FATURA",
      type: "card_due_and_best",
      amount: 1780.00,
      badge: "★ Melhor Compra Nubank + Venc Bradesco",
      color: "emerald"
    },
    {
      day: 1,
      title: "Vencimento Fatura Nubank Ultravioleta",
      category: "FATURA",
      type: "card_due",
      amount: 1820.40,
      badge: "Vencimento Nubank (Dia 1)",
      color: "purple"
    }
  ].sort((a, b) => a.day - b.day);

  const filteredEvents = calendarEvents.filter(e => {
    if (filterType === 'INCOME') return e.type === 'income';
    if (filterType === 'BILLS') return e.category.includes('FIXA');
    if (filterType === 'CARDS') return e.category.includes('FATURA') || e.category.includes('FECHAMENTO') || e.category.includes('MELHOR_DIA');
    return true;
  });

  return (
    <div className="workbench-panel rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#111318] border border-slate-100 dark:border-[#1F232D] shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-slate-100 dark:border-[#1F232D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50 flex items-center gap-1.5">
              <CalendarIcon className="w-3 h-3" />
              AGENDA FINANCEIRA & FLUXO DE CAIXA MENSAL
            </span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">MURIAÉ/MG</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
            Calendário de Vencimentos, Salários e Fechamentos
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Marcos críticos de vencimento, fechamento de faturas e liquidez em Muriaé/MG.
          </p>
        </div>

        {/* Filter Pills (Touch targets >= 44px) */}
        <div className="w-full sm:w-auto grid grid-cols-4 sm:flex items-center gap-1 bg-slate-50 dark:bg-[#12141B] p-1 rounded-full border border-slate-200/80 dark:border-[#1F232D] font-mono text-xs">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'INCOME', label: 'Entradas' },
            { id: 'BILLS', label: 'Boletos' },
            { id: 'CARDS', label: 'Cartões' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 min-h-[44px] sm:min-h-[34px] flex items-center justify-center rounded-full text-xs transition-all duration-150 cursor-pointer text-center active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-purple-500/70 focus:outline-none ${
                filterType === f.id
                  ? 'bg-white dark:bg-[#1E232F] text-purple-700 dark:text-zinc-100 font-bold shadow-xs border border-slate-200/60 dark:border-zinc-500'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-[#161922]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Dates / Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredEvents.map((evt, idx) => {
          const isToday = evt.day === today;

          let badgeTheme = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#161922] dark:text-zinc-400 dark:border-[#242A38]";

          if (evt.type === 'income') {
            badgeTheme = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40";
          } else if (evt.category.includes('MELHOR_DIA')) {
            badgeTheme = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40";
          } else if (evt.category.includes('FECHAMENTO')) {
            badgeTheme = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/40";
          } else {
            badgeTheme = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40";
          }

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#0E1015] border transition-all duration-150 flex items-start gap-3 ${
                isToday ? 'border-purple-400 dark:border-sky-500 bg-purple-50/30 dark:bg-[#141A25] shadow-xs' : 'border-slate-100 dark:border-[#1F232D] hover:border-slate-300 dark:hover:border-[#2D3341] hover:bg-white dark:hover:bg-[#151822]'
              }`}
            >
              {/* Day Badge */}
              <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-[#0D0F14] border border-slate-200/80 dark:border-[#1F232D] shrink-0 text-center font-mono shadow-xs">
                <span className="text-[8px] uppercase text-slate-400 dark:text-zinc-400 font-semibold leading-none">Dia</span>
                <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 mt-0.5 leading-none">
                  {String(evt.day).padStart(2, '0')}
                </span>
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${badgeTheme}`}>
                    {evt.badge}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold text-purple-600 dark:text-sky-400 font-mono">
                      HOJE
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                  {evt.title}
                </h4>

                {evt.amount && (
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono text-xs">
                    <span className={`tabular-nums font-bold ${evt.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-zinc-200'}`}>
                      {evt.type === 'income' ? '+' : ''}{formatBRL(evt.amount)}
                    </span>
                    {evt.share && (
                      <span className="text-[10px] text-slate-500 dark:text-zinc-500 tabular-nums">
                        (Cota: {formatBRL(evt.share)})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
