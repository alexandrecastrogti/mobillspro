import React, { useState } from 'react';
import { StatementImportModal } from './StatementImportModal';
import { downloadCSV } from '../utils/csvExporter';
import { 
  CreditCard, 
  ShoppingCart, 
  Wrench, 
  Store,
  Plus,
  UploadCloud,
  Download,
  Trash2
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function CardsAuditView({ 
  auditData, 
  excludeAtypical, 
  setExcludeAtypical,
  onToggleAtypicalTransaction,
  onDeleteTransaction,
  onOpenNewModal,
  onRefresh
}) {
  const [selectedCardFilter, setSelectedCardFilter] = useState('ALL');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  if (!auditData) {
    return <div className="p-8 text-center text-slate-500 dark:text-zinc-400 font-mono text-xs">Carregando auditoria dos cartões...</div>;
  }

  const { cards, history, supermarketBenchmark, transactions } = auditData;

  const filteredTransactions = transactions.filter(t => {
    if (selectedCardFilter !== 'ALL' && t.cardId !== selectedCardFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const rows = filteredTransactions.map(t => ({
      Data: t.transactionDate,
      Cartao: t.cardName,
      Estabelecimento: t.establishment,
      Categoria: t.category,
      Valor_R$: t.amount,
      Atipico: t.isAtypical ? 'SIM' : 'NAO',
      Compartilhado_5050: t.isShared ? 'SIM' : 'NAO',
      MesReferencia: t.referenceMonth || '2026-10'
    }));
    downloadCSV(`mobillspro_faturas_${selectedCardFilter.toLowerCase()}.csv`, rows);
  };

  const handleDelete = (id, establishment) => {
    if (window.confirm(`Tem certeza que deseja excluir o lançamento de "${establishment}"?`)) {
      if (onDeleteTransaction) onDeleteTransaction(id);
    }
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
                AUDITORIA 6 MESES • MAIO A OUTUBRO/2026
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">NUBANK • BRADESCO • MERCADO PAGO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Controle de Faturas e Análise de Atípicos
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Consolidação analítica das faturas nos 3 cartões de crédito. Isolamento automático do pico extraordinário 
              de Supermercados e eliminação dos gastos que não se repetirão a partir de Novembro.
            </p>
          </div>

          {/* Master Toggle: Eliminar Atípicos & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3 flex flex-col justify-between min-w-[270px]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-semibold text-slate-900 dark:text-zinc-200 block">
                    Eliminar Gastos Atípicos
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                    Funilaria R$ 1.000 + Fim Bradesco R$ 389,90
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setExcludeAtypical(!excludeAtypical)}
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                    excludeAtypical ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      excludeAtypical ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-[#1F232D] text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                {excludeAtypical ? '✓ Atípicos desconsiderados na projeção' : '• Total bruto mantido na fatura'}
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#141720] dark:hover:bg-[#1A1E29] text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-[#2B303E] text-xs font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Exportar dados filtrados para CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span>CSV</span>
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="w-full sm:w-auto px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-[#161B26] dark:hover:bg-[#1E2535] dark:text-purple-300 dark:border-purple-800/40 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Importar fatura em formato OFX ou CSV"
              >
                <UploadCloud className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Importar</span>
              </button>

              <button
                onClick={onOpenNewModal}
                className="w-full sm:w-auto px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Lançamento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BENCHMARK DE SUPERMERCADOS MURIAÉ */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1F232D]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800/40 dark:text-amber-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-mono uppercase tracking-wide">
                Média Histórica Real de Mercado vs Pico de Outubro
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Consolidação: Supermercados BH (Centro e Barra) + Bahamas Mix Muriaé + Top Frut Gourmet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-zinc-500 block">Média Histórica</span>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                {formatBRL(supermarketBenchmark.historicalAverage)}
              </span>
            </div>
            <div className="text-right pl-4 border-l border-slate-200 dark:border-[#1F232D]">
              <span className="text-[10px] uppercase font-mono text-amber-700 dark:text-amber-400 block font-semibold">Pico de Outubro</span>
              <span className="text-base font-bold text-amber-700 dark:text-amber-300 font-mono tabular-nums">
                {formatBRL(supermarketBenchmark.octoberPeak)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual comparison bar */}
        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-zinc-400">Média Real Anterior (Maio a Setembro):</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">{formatBRL(supermarketBenchmark.historicalAverage)}/mês</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-transparent">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '58%' }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-amber-800 dark:text-amber-300 font-medium">Pico de Outubro (Evento Atípico Extraordinário):</span>
              <span className="text-amber-800 dark:text-amber-300 font-semibold tabular-nums">{formatBRL(supermarketBenchmark.octoberPeak)} (+{formatBRL(supermarketBenchmark.octoberExcess)})</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-transparent">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* DETALHAMENTO DE TRANSAÇÕES E GASTOS ATÍPICOS DE OUTUBRO */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#1F232D]">
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wide">Transações Detalhadas nos Estabelecimentos</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Classificação por estabelecimento de Muriaé e detecção de atípicos</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">Filtrar Cartão:</span>
            <select
              value={selectedCardFilter}
              onChange={(e) => setSelectedCardFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#0D0F14] text-xs font-mono text-slate-900 dark:text-zinc-200 border border-slate-300 dark:border-[#2B303E] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="ALL">Todos os 3 Cartões</option>
              <option value="card-nubank">Nubank Roxo</option>
              <option value="card-bradesco">Bradesco</option>
              <option value="card-mercadopago">Mercado Pago</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                tx.isAtypical
                  ? 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-600/30'
                  : 'bg-white dark:bg-[#12141B] border-slate-200 dark:border-[#1F232D] hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  tx.isAtypical 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/40' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#191D27] dark:text-zinc-400 dark:border-[#2B3142]'
                }`}>
                  {tx.isAtypical ? <Wrench className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">{tx.establishment}</span>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-[#161922] px-2 py-0.5 rounded border border-slate-200 dark:border-[#242A38]">
                      {tx.category}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-purple-700 bg-purple-50 border border-purple-200 dark:text-purple-300 dark:bg-purple-950/60 dark:border-purple-800/40 px-2 py-0.5 rounded">
                      {tx.cardName}
                    </span>
                    {tx.installmentInfo && (
                      <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                        {tx.installmentInfo}
                      </span>
                    )}
                  </div>

                  {tx.isAtypical ? (
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 font-mono mt-1 font-semibold">
                      ⚠ ATÍPICO: {tx.atypicalReason}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono mt-0.5">
                      {tx.transactionDate} • Despesa ordinária compartilhada
                    </p>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-row items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-[#1F232D]">
                <span className={`text-base font-bold font-mono tabular-nums ${tx.isAtypical ? 'text-amber-700 dark:text-amber-300' : 'text-slate-900 dark:text-zinc-100'}`}>
                  {formatBRL(tx.amount)}
                </span>
                
                <button
                  onClick={() => handleDelete(tx.id, tx.establishment)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="Excluir lançamento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Importação de Extratos */}
      <StatementImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />

    </div>
  );
}
