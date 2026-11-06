import React, { useState } from 'react';
import {
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  ShieldCheck,
  Search,
  Calendar,
  User,
  Tag,
  Plus,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import { formatBRL, formatDateBR } from '../utils/formatters';

export function PixDetectorView({ pixData, onDeletePix, onOpenNewModal }) {
  const [filterDirection, setFilterDirection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!pixData) {
    return <div className="p-8 text-center text-zinc-400 font-mono text-xs">Carregando detector de Pix...</div>;
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

      {/* HEADER SECTION (WORKBENCH PANEL) */}
      <div className="workbench-panel rounded-xl p-5 border border-[#1F232D]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-teal-950/60 text-teal-300 border border-teal-800/50 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-teal-400" />
                DETECTOR DE FLUXO PIX (BACEN SPI)
              </span>
              <span className="text-[11px] font-mono text-zinc-500">AUDITORIA DE SALDO BANCÁRIO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
              Monitoramento e Separação de Fluxo Pix
            </h2>
            <p className="text-xs text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Distingue movimentações diretas da conta bancária de compras no cartão de crédito.
              Alerta transações avulsas ou atípicas para evitar vazamentos no saldo livre ("Número Mágico").
            </p>
          </div>

          {/* Quick Flow Metrics & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#12151D] border border-[#222838] rounded-xl p-3 min-w-[310px] font-mono">
              <div className="text-center">
                <span className="text-[9px] uppercase font-semibold text-teal-400 block">
                  Pix Entradas
                </span>
                <span className="text-sm font-bold text-zinc-100 tabular-nums mt-0.5 block">
                  +{formatBRL(summary.totalIn)}
                </span>
                <span className="text-[10px] text-zinc-500">Wellhub / Repasses</span>
              </div>

              <div className="text-center border-l border-[#1F232D] sm:border-r">
                <span className="text-[9px] uppercase font-semibold text-rose-400 block">
                  Pix Saídas
                </span>
                <span className="text-sm font-bold text-zinc-100 tabular-nums mt-0.5 block">
                  -{formatBRL(summary.totalOut)}
                </span>
                <span className="text-[10px] text-zinc-500">Fixas + Avulsos</span>
              </div>

              <div className="text-center col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1F232D]">
                <span className="text-[9px] uppercase font-semibold text-amber-400 block">
                  Alertas
                </span>
                <span className="text-sm font-bold text-amber-300 tabular-nums mt-0.5 block">
                  {summary.alertsCount}
                </span>
                <span className="text-[10px] text-zinc-500">Atípicos</span>
              </div>
            </div>

            <button
              onClick={onOpenNewModal}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Novo Pix
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#12141B] p-2.5 rounded-xl border border-[#1F232D]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDirection('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${filterDirection === 'ALL'
              ? 'bg-[#1D212B] text-zinc-100 font-semibold border border-zinc-500'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181B24]'
              }`}
          >
            Todos ({transactions.length})
          </button>
          <button
            onClick={() => setFilterDirection('ENTRADA')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${filterDirection === 'ENTRADA'
              ? 'bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-700/60'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181B24]'
              }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFilterDirection('SAIDA')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${filterDirection === 'SAIDA'
              ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-800/60'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181B24]'
              }`}
          >
            Saídas
          </button>
          <button
            onClick={() => setFilterDirection('ALERT')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${filterDirection === 'ALERT'
              ? 'bg-amber-950/60 text-amber-300 font-semibold border border-amber-800/60'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181B24]'
              }`}
          >
            ⚠ Alertas ({summary.alertsCount})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por favorecido ou categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-[#0D0F14] border border-[#2B303E] rounded px-3 pl-8 py-1.5 text-xs text-zinc-100 font-mono outline-none focus:border-zinc-400 transition"
          />
        </div>
      </div>

      {/* PIX TRANSACTIONS LIST */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const isEntry = item.direction === 'ENTRADA';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${item.isAlert
                ? 'bg-amber-950/20 border-amber-800/50'
                : 'workbench-card border-[#1F232D]'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded shrink-0 mt-0.5 border ${item.isAlert
                  ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                  : isEntry
                    ? 'bg-teal-950/60 text-teal-300 border-teal-800/40'
                    : 'bg-[#181C26] text-zinc-400 border-[#2A3142]'
                  }`}>
                  {isEntry ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-bold text-zinc-100">
                      {item.partyName}
                    </h3>

                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border flex items-center gap-1 ${isEntry
                      ? 'bg-teal-950/60 text-teal-300 border-teal-800/40'
                      : 'bg-[#181C26] text-zinc-400 border-[#282F3E]'
                      }`}>
                      <Zap className="w-2.5 h-2.5 text-teal-400" />
                      PIX {item.direction}
                    </span>

                    <span className="text-[10px] font-mono text-zinc-400 bg-[#161922] px-1.5 py-0.2 rounded border border-[#242A38]">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {new Date(item.transactionDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    {item.e2eId && (
                      <span className="text-zinc-600">
                        E2E: {item.e2eId.slice(0, 16)}...
                      </span>
                    )}
                  </div>

                  {item.isAlert && (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-300 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{item.alertReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount & Delete */}
              <div className="flex sm:flex-row items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1F232D] shrink-0 font-mono">
                <div className="text-left sm:text-right">
                  <span className={`text-sm font-bold tabular-nums block ${isEntry ? 'text-teal-400' : 'text-zinc-100'
                    }`}>
                    {isEntry ? '+' : '-'}{formatBRL(item.amount)}
                  </span>
                  <span className="text-[9px] text-zinc-500 uppercase">
                    Conta Corrente
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item.id, item.partyName)}
                  className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                  title="Excluir Pix"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
