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
  Clock
} from 'lucide-react';
import { formatBRL, formatDateBR } from '../utils/formatters';

export function PixDetectorView({ pixData, onAddPix }) {
  const [filterDirection, setFilterDirection] = useState('ALL'); // 'ALL' | 'ENTRADA' | 'SAIDA' | 'ALERT'
  const [searchQuery, setSearchQuery] = useState('');

  if (!pixData) {
    return <div className="p-8 text-center text-gray-400">Carregando detector de Pix...</div>;
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

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-teal-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                Detector Inteligente de Transações Pix
              </span>
              <span className="text-xs text-gray-400">Bacen Instant Payment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Monitoramento e Separação de Fluxo Pix
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Distingue instantaneamente movimentações diretas da conta bancária de compras no cartão de crédito. 
              Alerta transações avulsas ou atípicas para evitar vazamentos no saldo livre mensal ("Número Mágico").
            </p>
          </div>

          {/* Quick Flow Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-900/90 border border-gray-800 rounded-2xl p-4 min-w-[320px]">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-teal-400 block tracking-wider">
                Pix Entradas
              </span>
              <span className="text-lg font-black text-white font-mono mt-0.5 block">
                +{formatBRL(summary.totalIn)}
              </span>
              <span className="text-[10px] text-gray-400">Wellhub / Créditos</span>
            </div>

            <div className="text-center border-l border-gray-800 sm:border-r">
              <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">
                Pix Saídas
              </span>
              <span className="text-lg font-black text-white font-mono mt-0.5 block">
                -{formatBRL(summary.totalOut)}
              </span>
              <span className="text-[10px] text-gray-400">Fixas + Avulsos</span>
            </div>

            <div className="text-center col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Alertas
              </span>
              <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                {summary.alertsCount}
              </span>
              <span className="text-[10px] text-gray-400">Pix atípicos</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-gray-900/60 p-3 rounded-2xl border border-gray-800">
        
        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterDirection('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterDirection === 'ALL'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Todos ({transactions.length})
          </button>
          <button
            onClick={() => setFilterDirection('ENTRADA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterDirection === 'ENTRADA'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Entradas (Créditos)
          </button>
          <button
            onClick={() => setFilterDirection('SAIDA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterDirection === 'SAIDA'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Saídas (Pagamentos)
          </button>
          <button
            onClick={() => setFilterDirection('ALERT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterDirection === 'ALERT'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            ⚠ Alertas ({summary.alertsCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 transition"
          />
        </div>
      </div>

      {/* PIX TRANSACTIONS LIST */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isEntry = item.direction === 'ENTRADA';
          
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.isAlert
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/20'
                  : isEntry
                  ? 'bg-gray-900/80 border-teal-500/30 hover:border-teal-500/50'
                  : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Visual Icon Badge */}
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  item.isAlert
                    ? 'bg-amber-500/20 text-amber-400'
                    : isEntry
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'bg-gray-800 text-gray-300'
                }`}>
                  {isEntry ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {item.partyName}
                    </h3>

                    {/* Official Pix Badge */}
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isEntry
                        ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                        : 'bg-gray-800 text-gray-300 border border-gray-700'
                    }`}>
                      <Zap className="w-3 h-3 text-teal-400" />
                      PIX {item.direction}
                    </span>

                    <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {new Date(item.transactionDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    {item.e2eId && (
                      <span className="font-mono text-gray-500">
                        ID: {item.e2eId.slice(0, 18)}...
                      </span>
                    )}
                  </div>

                  {item.isAlert && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.alertReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-800 shrink-0">
                <span className={`text-lg font-black font-mono block ${
                  isEntry ? 'text-teal-400' : 'text-white'
                }`}>
                  {isEntry ? '+' : '-'}{formatBRL(item.amount)}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">
                  Conta Corrente Instantâneo
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

