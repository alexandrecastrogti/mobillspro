import React, { useState } from 'react';
import { 
  CreditCard, 
  ShoppingCart, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Filter, 
  Trash2, 
  Layers, 
  ShieldCheck,
  Building,
  Store,
  ChevronDown
} from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/formatters';

export function CardsAuditView({ 
  auditData, 
  excludeAtypical, 
  setExcludeAtypical,
  onToggleAtypicalTransaction 
}) {
  const [selectedCardFilter, setSelectedCardFilter] = useState('ALL');

  if (!auditData) {
    return <div className="p-8 text-center text-gray-400">Carregando auditoria dos cartões...</div>;
  }

  const { cards, history, supermarketBenchmark, transactions } = auditData;

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    if (selectedCardFilter !== 'ALL' && t.cardId !== selectedCardFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Auditoria Histórica de 6 Meses (Maio a Outubro/2026)
              </span>
              <span className="text-xs text-gray-400">Nubank • Bradesco • Mercado Pago</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Controle de Faturas e Análise de Atípicos
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Consolidação analítica das faturas nos 3 cartões de crédito. Isolamento automático do pico extraordinário 
              de Supermercados e eliminação dos gastos que não se repetirão a partir de Novembro.
            </p>
          </div>

          {/* Master Toggle: Eliminar Atípicos */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between min-w-[280px]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Eliminar Gastos Atípicos
                </span>
                <span className="text-[11px] text-gray-400">
                  Funilaria R$ 1.000 + Fim Bradesco R$ 480
                </span>
              </div>
              <button
                type="button"
                onClick={() => setExcludeAtypical(!excludeAtypical)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  excludeAtypical ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    excludeAtypical ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-800 text-[11px] text-emerald-400 font-mono">
              {excludeAtypical ? '✓ Atípicos desconsiderados no balanço' : '• Total bruto mantido na fatura'}
            </div>
          </div>
        </div>
      </div>

      {/* BENCHMARK DE SUPERMERCADOS MURIAÉ (BH + BAHAMAS + TOP FRUT) */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Média Histórica Real de Mercado vs Pico de Outubro
              </h3>
              <p className="text-xs text-gray-400">
                Consolidação: Supermercados BH (Centro e Barra) + Bahamas Mix Muriaé + Top Frut Gourmet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Média Histórica</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {formatBRL(supermarketBenchmark.historicalAverage)}
              </span>
            </div>
            <div className="text-right pl-4 border-l border-gray-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Pico de Outubro</span>
              <span className="text-lg font-black text-amber-300 font-mono">
                {formatBRL(supermarketBenchmark.octoberPeak)}
              </span>
            </div>
          </div>
        </div>

        {/* Visual comparison bar */}
        <div className="mt-5 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-medium">Média Real dos Meses Anteriores (Maio a Setembro):</span>
              <span className="font-mono text-emerald-400 font-bold">{formatBRL(supermarketBenchmark.historicalAverage)}/mês</span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '58%' }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">Pico de Outubro (Evento Atípico Extraordinário):</span>
              <span className="font-mono text-amber-300 font-bold">{formatBRL(supermarketBenchmark.octoberPeak)} (+{formatBRL(supermarketBenchmark.octoberExcess)})</span>
            </div>
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-gray-900/80 border border-gray-800 text-xs text-gray-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Conclusão da Auditoria:</strong> O orçamento familiar deve calibrar a provisão de mercado em <strong>R$ 1.533,28</strong>. 
            O estouro de Outubro (R$ 2.600,10) decorreu de compras acumuladas de despensa que não irão se manter como patamar regular.
          </span>
        </div>
      </div>

      {/* OS 3 CARTÕES: CARDS VISUAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Cartão 1: Nubank */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1d0a33] to-[#0d0319] border border-purple-500/40 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider block">Cartão de Crédito</span>
              <h3 className="text-xl font-black text-white">Nubank Roxo</h3>
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-xs border border-purple-500/30">
              Nu
            </div>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Fatura Outubro:</span>
              <span className="font-bold text-white">R$ 1.820,40</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Fechamento:</span>
              <span>Dia 24</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Vencimento:</span>
              <span className="text-purple-300 font-semibold">Dia 01</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-900/40 text-[11px] text-purple-300">
            Foco: Supermercados BH, Top Frut e Farmácia Indiana
          </div>
        </div>

        {/* Cartão 2: Bradesco */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#2b080c] to-[#120204] border border-red-500/40 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider block">Cartão de Crédito</span>
              <h3 className="text-xl font-black text-white">Bradesco</h3>
            </div>
            <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 font-bold text-xs border border-red-500/30">
              B
            </div>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Fatura Outubro:</span>
              <span className="font-bold text-white">R$ 1.780,00</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Fechamento:</span>
              <span>Dia 18</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Vencimento:</span>
              <span className="text-rose-300 font-semibold">Dia 25</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-red-900/40 text-[11px] text-amber-300">
            ✓ Parcela 10/10 encerrada (R$ 480 aliviado em Novembro)
          </div>
        </div>

        {/* Cartão 3: Mercado Pago */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#051c2e] to-[#010912] border border-sky-500/40 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-300 tracking-wider block">Cartão de Crédito</span>
              <h3 className="text-xl font-black text-white">Mercado Pago</h3>
            </div>
            <div className="w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-300 font-bold text-xs border border-sky-500/30">
              MP
            </div>
          </div>
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Fatura Outubro:</span>
              <span className="font-bold text-white">R$ 1.520,00</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Fechamento:</span>
              <span>Dia 10</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Vencimento:</span>
              <span className="text-sky-300 font-semibold">Dia 17</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-sky-900/40 text-[11px] text-amber-300">
            ⚠ Contém Funilaria R$ 1.000 (Atípico a isolar)
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE 6 MESES CONSOLIDADO */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          Histórico Comparativo de Faturas (Maio a Outubro de 2026)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Mês</th>
                <th className="pb-3 font-semibold">Supermercados</th>
                <th className="pb-3 font-semibold">Nubank</th>
                <th className="pb-3 font-semibold">Bradesco</th>
                <th className="pb-3 font-semibold">Mercado Pago</th>
                <th className="pb-3 font-semibold">Total Faturas</th>
                <th className="pb-3 font-semibold text-right">Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {history.map((m) => {
                const isOctober = m.month === '2026-10';
                return (
                  <tr key={m.month} className={`hover:bg-gray-800/30 transition ${isOctober ? 'bg-amber-500/5' : ''}`}>
                    <td className="py-3 font-bold text-white font-sans">{m.label}</td>
                    <td className={`py-3 ${isOctober ? 'text-amber-400 font-bold' : 'text-gray-300'}`}>
                      {formatBRL(m.supermarketTotal)}
                    </td>
                    <td className="py-3 text-purple-300">{formatBRL(m.nubankTotal)}</td>
                    <td className="py-3 text-rose-300">{formatBRL(m.bradescoTotal)}</td>
                    <td className="py-3 text-sky-300">{formatBRL(m.mercadoPagoTotal)}</td>
                    <td className="py-3 font-bold text-white">{formatBRL(m.totalCards)}</td>
                    <td className="py-3 text-right font-sans">
                      {isOctober ? (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          Pico Extraordinário
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Estável
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETALHAMENTO DE TRANSAÇÕES E GASTOS ATÍPICOS DE OUTUBRO */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white">Transações Detalhadas nos Estabelecimentos</h3>
            <p className="text-xs text-gray-400">Classificação por estabelecimento de Muriaé e detecção de atípicos</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold">Filtrar Cartão:</span>
            <select
              value={selectedCardFilter}
              onChange={(e) => setSelectedCardFilter(e.target.value)}
              className="bg-gray-900 text-xs text-gray-200 border border-gray-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="ALL">Todos os 3 Cartões</option>
              <option value="card-nubank">Nubank Roxo</option>
              <option value="card-bradesco">Bradesco</option>
              <option value="card-mercadopago">Mercado Pago</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                tx.isAtypical
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                  : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  tx.isAtypical ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-300'
                }`}>
                  {tx.isAtypical ? <Wrench className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">{tx.establishment}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                      {tx.category}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {tx.cardName}
                    </span>
                    {tx.installmentInfo && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        {tx.installmentInfo}
                      </span>
                    )}
                  </div>

                  {tx.isAtypical ? (
                    <p className="text-xs text-amber-300/90 font-medium mt-1">
                      ⚠ ATÍPICO: {tx.atypicalReason}
                    </p>
                  ) : (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Data da compra: {tx.transactionDate} • Despesa ordinária compartilhada
                    </p>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-800">
                <span className={`text-base font-bold font-mono ${tx.isAtypical ? 'text-amber-300' : 'text-white'}`}>
                  {formatBRL(tx.amount)}
                </span>
                
                {tx.isAtypical && (
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full mt-1">
                    Não Repetível
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
