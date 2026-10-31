import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  FileText, 
  CreditCard, 
  Filter, 
  Sparkles,
  ExternalLink,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { formatBRL, formatDateBR } from '../utils/formatters';

export function FixedExpensesChecklist({ 
  expenses, 
  onToggleStatus, 
  selectedMonth 
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'PAID'
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  if (!expenses || expenses.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-gray-400">
        Nenhuma despesa fixa encontrada para este período.
      </div>
    );
  }

  // Filter items
  const filteredList = expenses.filter(item => {
    if (filter === 'PENDING' && item.status !== 'PENDENTE') return false;
    if (filter === 'PAID' && item.status !== 'PAGO') return false;
    if (categoryFilter !== 'ALL' && item.beneficiary !== categoryFilter) return false;
    return true;
  });

  // Calculate metrics
  const totalAlexandre = expenses.reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
  const paidAlexandre = expenses
    .filter(e => e.status === 'PAGO')
    .reduce((acc, curr) => acc + Number(curr.alexandreShare), 0);
  const pendingAlexandre = totalAlexandre - paidAlexandre;
  const paidCount = expenses.filter(e => e.status === 'PAGO').length;
  const percentagePaid = ((paidCount / expenses.length) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION WITH PROGRESS METRICS */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                Checklist Oficial de Despesas Fixas
              </span>
              <span className="text-xs text-gray-400">Mês de Referência: {selectedMonth}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Controle e Status de Quitação Mensal
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Monitore cada boleto e Pix fixo com 1 clique. O balanço do "Número Mágico" 
              se ajusta automaticamente conforme as obrigações são liquidadas.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-gray-900/90 border border-gray-800 rounded-2xl p-4 min-w-[320px]">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Total Alexandre
              </span>
              <span className="text-lg font-black text-white font-mono mt-0.5 block">
                {formatBRL(totalAlexandre)}
              </span>
            </div>

            <div className="text-center border-x border-gray-800">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                Quitado ({percentagePaid}%)
              </span>
              <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                {formatBRL(paidAlexandre)}
              </span>
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Pendente
              </span>
              <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                {formatBRL(pendingAlexandre)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t border-gray-800/80">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
            <span>Progresso de Liquidação ({paidCount} de {expenses.length} contas pagas)</span>
            <span className="font-bold text-emerald-400 font-mono">{percentagePaid}% Concluído</span>
          </div>
          <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/20" 
              style={{ width: `${percentagePaid}%` }}
            />
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-900/60 p-3 rounded-2xl border border-gray-800">
        
        {/* Status filters */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Todos ({expenses.length})
          </button>
          <button
            onClick={() => setFilter('PAID')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'PAID'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Quitados ({paidCount})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'PENDING'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Pendentes ({expenses.length - paidCount})
          </button>
        </div>

        {/* Division type filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold">Tipo:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-900 text-xs text-gray-200 border border-gray-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="ALL">Todas as Despesas</option>
            <option value="COMPARTILHADO">Compartilhadas (50/50 Amanda)</option>
            <option value="ALEXANDRE">Individuais Alexandre (100%)</option>
          </select>
        </div>
      </div>

      {/* CHECKLIST TABLE / CARDS */}
      <div className="space-y-3">
        {filteredList.map((item) => {
          const isPaid = item.status === 'PAGO';
          const isShared = item.isSplit5050;

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isPaid 
                  ? 'bg-gray-900/70 border-emerald-500/30 hover:border-emerald-500/50' 
                  : 'bg-gray-900/90 border-amber-500/40 hover:border-amber-500/70 shadow-lg shadow-amber-950/20'
              }`}
            >
              
              {/* Left Column: Toggle Checkbox + Title + Metadata */}
              <div className="flex items-start gap-4">
                
                {/* 1-Click Interactive Toggle Button */}
                <button
                  onClick={() => onToggleStatus(item.id)}
                  title={isPaid ? "Clique para marcar como Pendente" : "Clique para marcar como Quitado"}
                  className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isPaid
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : 'border-2 border-gray-600 hover:border-emerald-400 bg-gray-800/80 text-transparent hover:text-emerald-400'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm sm:text-base font-bold ${isPaid ? 'text-gray-200' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    
                    {/* Badge: 50/50 vs Individual */}
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isShared 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {isShared ? '50/50 Amanda' : '100% Alexandre'}
                    </span>

                    {/* Category tag */}
                    <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Secondary info: Due date, payment method, pix ref */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      Vencimento: Dia {item.dueDay} ({formatDateBR(item.dueDate)})
                    </span>

                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                      Método: <strong className="text-gray-300 font-semibold">{item.paymentMethod}</strong>
                    </span>

                    {item.pixCode && (
                      <span className="font-mono text-[11px] text-emerald-400/90 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        Ref: {item.pixCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Values + Status Badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                    Cota Alexandre
                  </span>
                  <span className="text-base sm:text-lg font-black text-white font-mono">
                    {formatBRL(item.alexandreShare)}
                  </span>
                  {isShared && (
                    <span className="text-[10px] text-gray-500 block">
                      Total: {formatBRL(item.totalAmount)}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mt-1 sm:mt-1.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isPaid
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                  }`}>
                    {isPaid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Quitado
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> Pendente
                      </>
                    )}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
