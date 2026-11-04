import React, { useState } from 'react';
import { 
  Zap, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  Search, 
  Clock,
  Plus, 
  Trash2
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function PixDetectorView({ pixData, onDeletePix, onOpenNewModal }) {
  const [filterDirection, setFilterDirection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!pixData) {
    return <div className="p-8 text-center text-slate-500 dark:text-zinc-400 font-mono text-xs">Carregando detector de Pix...</div>;
  }

  const { transactions, summary } = pixData;

  const filtered = transactions.filter(item => {
    if (filterDirection === 'ENTRADA' && item.direction !== 'ENTRADA') return false;
    if (filterDirection === 'SAIDA' && item.direction !== 'SAIDA') return false;
    if (filterDirection === 'ALERT' && !item.isAlert) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchParty = item.partyName.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchParty && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const handleDelete = (id, party) => {
    if (window.confirm(`Tem certeza que deseja excluir o Pix de "${party}"?`)) {
      if (onDeletePix) onDeletePix(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/50 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                DETECTOR DE FLUXO PIX (BACEN SPI)
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">AUDITORIA DE SALDO BANCÁRIO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Monitoramento e Separação de Fluxo Pix
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Distingue movimentações diretas da conta bancária de compras no cartão de crédito. 
              Alerta transações avulsas ou atípicas para evitar vazamentos no saldo livre ("Número Mágico").
            </p>
          </div>

          {/* Quick Flow Metrics & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3 min-w-[310px] font-mono">
              <div className="text-center">
                <span className="text-[9px] uppercase font-semibold text-teal-700 dark:text-teal-400 block">
                  Pix Entradas
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tabular-nums mt-0.5 block">
                  +{formatBRL(summary.totalIn)}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-500">Venda OLX / Repasses</span>
              </div>

              <div className="text-center border-l border-slate-200 dark:border-[#1F232D] sm:border-r">
                <span className="text-[9px] uppercase font-semibold text-rose-700 dark:text-rose-400 block">
                  Pix Saídas
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tabular-nums mt-0.5 block">
                  -{formatBRL(summary.totalOut)}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-500">Diarista / Barbeiro</span>
              </div>

              <div className="text-center col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-[#1F232D]">
                <span className="text-[9px] uppercase font-semibold text-amber-700 dark:text-amber-400 block">
                  Alertas
                </span>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300 tabular-nums mt-0.5 block">
                  {summary.alertsCount}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-500">Atípicos</span>
              </div>
            </div>

            <button
              onClick={onOpenNewModal}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Novo Pix
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#12141B] p-3 rounded-xl border border-slate-200 dark:border-[#1F232D] shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDirection('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              filterDirection === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-black font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
            }`}
          >
            Todos ({transactions.length})
          </button>
          <button
            onClick={() => setFilterDirection('ENTRADA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              filterDirection === 'ENTRADA'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFilterDirection('SAIDA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              filterDirection === 'SAIDA'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
            }`}
          >
            Saídas
          </button>
          <button
            onClick={() => setFilterDirection('ALERT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
              filterDirection === 'ALERT'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
            }`}
          >
            ⚠ Alertas ({summary.alertsCount})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por favorecido ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-slate-50 dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded-lg px-3 pl-9 py-1.5 text-xs text-slate-900 dark:text-zinc-100 font-mono outline-none focus:border-teal-500 transition"
          />
        </div>
      </div>

      {/* PIX TRANSACTIONS LIST */}
      <div className="space-y-2.5">
        {filtered.map((item) => {
          const isEntry = item.direction === 'ENTRADA';
          
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                item.isAlert
                  ? 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/50'
                  : 'bg-white dark:bg-[#13161F] border-slate-200 dark:border-[#1F232D] hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 border ${
                  item.isAlert
                    ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/40'
                    : isEntry
                    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/40'
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-[#181C26] dark:text-zinc-400 dark:border-[#2A3142]'
                }`}>
                  {isEntry ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                      {item.partyName}
                    </h3>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      isEntry
                        ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/40'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#181C26] dark:text-zinc-400 dark:border-[#282F3E]'
                    }`}>
                      <Zap className="w-2.5 h-2.5 text-teal-600 dark:text-teal-400" />
                      PIX {item.direction}
                    </span>

                    <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-[#161922] px-2 py-0.5 rounded border border-slate-200 dark:border-[#242A38]">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-zinc-400">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                      {new Date(item.transactionDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    {item.e2eId && (
                      <span className="text-slate-400 dark:text-zinc-600">
                        E2E: {item.e2eId.slice(0, 16)}...
                      </span>
                    )}
                  </div>

                  {item.isAlert && (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-mono bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40 font-medium">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{item.alertReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount & Delete */}
              <div className="flex sm:flex-row items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-[#1F232D] shrink-0 font-mono">
                <div className="text-left sm:text-right">
                  <span className={`text-base font-bold tabular-nums block ${
                    isEntry ? 'text-teal-700 dark:text-teal-400' : 'text-slate-900 dark:text-zinc-100'
                  }`}>
                    {isEntry ? '+' : '-'}{formatBRL(item.amount)}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase">
                    Conta Corrente
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item.id, item.partyName)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="Excluir Pix"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
