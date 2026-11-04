import React, { useState } from 'react';
import {
  TrendingUp,
  Globe2,
  Sparkles,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { formatBRL, formatUSD } from '../utils/formatters';
import { FireWealthSimulator } from './FireWealthSimulator';

export function InvestmentsView({
  investmentsData,
  onUpdateInvestment
}) {
  const [exchangeRateInput, setExchangeRateInput] = useState('5.40');
  const [editingRate, setEditingRate] = useState(false);

  if (!investmentsData) {
    return <div className="p-8 text-center text-slate-500 dark:text-zinc-400 font-mono text-xs">Carregando carteira de investimentos...</div>;
  }

  const { investments, summary } = investmentsData;
  const nomadAsset = investments.find(i => i.assetType === 'USD_OFFSHORE');

  // Handle live exchange rate recalculation
  const handleRateUpdate = () => {
    const rate = parseFloat(exchangeRateInput.replace(',', '.')) || 5.40;
    if (nomadAsset && onUpdateInvestment) {
      onUpdateInvestment(nomadAsset.id, {
        exchangeRate: rate,
        balanceOriginal: nomadAsset.balanceOriginal
      });
    }
    setEditingRate(false);
  };

  // Asset allocation percentages
  const totalBRL = summary.totalNetWorthBRL || 1;
  const pctOffshore = ((summary.totalOffshoreUSD * (nomadAsset?.exchangeRate || 5.40) / totalBRL) * 100).toFixed(1);
  const pctFixedIncome = ((summary.totalFixedIncomeBRL / totalBRL) * 100).toFixed(1);
  const pctRealEstate = ((summary.totalRealEstateBRL / totalBRL) * 100).toFixed(1);

  // Total estimated monthly yield
  const totalMonthlyYield = investments.reduce((acc, curr) => acc + (Number(curr.monthlyYieldEst) || 0), 0);

  return (
    <div className="space-y-6">

      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50 flex items-center gap-1.5">
                <Globe2 className="w-3 h-3" />
                PATRIMÔNIO LÍQUIDO CONSOLIDADO
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">INTERNACIONAL & NACIONAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Gestão de Ativos e Carteira de Investimentos
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Consolidação global dos ativos da família: Conta Nomad Internacional em dólares (ETFs VT e S&P 500),
              reserva de emergência em Tesouro Selic a 13,75% a.a., CDB 110% CDI e patrimônio no Terreno de Muriaé.
            </p>
          </div>

          {/* Master Net Worth Display */}
          <div className="bg-amber-50/50 dark:bg-[#12151D] border border-amber-200 dark:border-[#222838] rounded-xl p-4 min-w-[270px] text-center shadow-xs">
            <span className="text-[10px] font-mono font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
              Patrimônio Líquido Total
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-zinc-100 font-mono tabular-nums mt-0.5 block">
              {formatBRL(summary.totalNetWorthBRL)}
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold mt-1 block flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> Rendimento: ~{formatBRL(totalMonthlyYield)}/mês
            </span>
          </div>
        </div>

        {/* Allocation Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1F232D]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-600 dark:text-zinc-400 mb-1.5">
            <span>Alocação: Offshore USD ({pctOffshore}%) • Renda Fixa ({pctFixedIncome}%) • Imobiliário ({pctRealEstate}%)</span>
            <span className="font-semibold text-amber-800 dark:text-amber-400 tabular-nums">100% Coberto</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden flex border border-slate-200 dark:border-transparent">
            <div className="bg-emerald-600 h-full" style={{ width: `${pctOffshore}%` }} title="Offshore Dólar" />
            <div className="bg-sky-500 h-full" style={{ width: `${pctFixedIncome}%` }} title="Renda Fixa" />
            <div className="bg-amber-500 h-full" style={{ width: `${pctRealEstate}%` }} title="Terreno Muriaé" />
          </div>
        </div>
      </div>

      {/* CARD INTERNACIONAL EM DESTAQUE: CONTA NOMAD GLOBAL */}
      {nomadAsset && (
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-4 border-b border-slate-200 dark:border-[#1F232D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 dark:bg-[#191E2B] dark:border-[#2B3346] dark:text-emerald-400 shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                    {nomadAsset.accountName}
                  </h3>
                  <span className="text-[10px] font-mono uppercase font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                    Offshore USD
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Custódia DriveWealth LLC (USA) • Dólar líquido e ETFs globais de valor
                </p>
              </div>
            </div>

            {/* Currency conversion box */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#12151D] p-3 rounded-xl border border-slate-200 dark:border-[#222838] font-mono">
              <div>
                <span className="text-[9px] uppercase text-slate-400 dark:text-zinc-500 block">Saldo em Dólar</span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatUSD(nomadAsset.balanceOriginal)}
                </span>
              </div>

              <div className="text-slate-400 dark:text-zinc-600 text-sm">×</div>

              <div>
                <span className="text-[9px] uppercase text-slate-400 dark:text-zinc-500 block">Cotação USD/BRL</span>
                <div className="flex items-center gap-1 mt-0.5">
                  {editingRate ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={exchangeRateInput}
                        onChange={(e) => setExchangeRateInput(e.target.value)}
                        className="w-16 bg-white dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-zinc-100 font-mono outline-none"
                      />
                      <button
                        onClick={handleRateUpdate}
                        className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded cursor-pointer"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => setEditingRate(true)}
                      className="cursor-pointer text-xs font-bold text-slate-800 dark:text-zinc-200 bg-white dark:bg-[#0D0F14] px-2 py-0.5 rounded border border-slate-300 dark:border-[#262B37] hover:border-emerald-500 transition"
                      title="Clique para editar cotação do dólar"
                    >
                      R$ {Number(nomadAsset.exchangeRate).toFixed(2)} ✎
                    </span>
                  )}
                </div>
              </div>

              <div className="text-slate-400 dark:text-zinc-600 text-sm">=</div>

              <div>
                <span className="text-[9px] uppercase text-slate-400 dark:text-zinc-500 block">Convertido BRL</span>
                <span className="text-base font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                  {formatBRL(nomadAsset.balanceBRL)}
                </span>
              </div>
            </div>
          </div>

          {/* Nomad Holdings Breakdown */}
          {nomadAsset.holdings && (
            <div>
              <h4 className="text-[10px] uppercase font-mono font-bold text-slate-500 dark:text-zinc-400 tracking-wider mb-2.5">
                Distribuição dos Ativos em Dólar (Holdings)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {nomadAsset.holdings.map((h, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-[#12141B] border border-slate-200 dark:border-[#1F232D] flex justify-between items-center font-mono">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-200 block">{h.ticker}</span>
                      <span className="text-[10px] text-slate-500">Alocação: {h.allocation}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {formatUSD(h.valueUSD)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* OUTROS ATIVOS DA CARTEIRA: RENDA FIXA + TERRENO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {investments.filter(i => i.assetType !== 'USD_OFFSHORE').map((item) => {
          const isRealEstate = item.assetType === 'PATRIMONIO_IMOVEL';

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#15181F] rounded-xl p-5 border border-slate-200 dark:border-[#1F232D] flex flex-col justify-between shadow-sm hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full border ${isRealEstate
                    ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40'
                    : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/40'
                    }`}>
                    {item.institution}
                  </span>
                  {item.monthlyYieldEst > 0 && (
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono tabular-nums font-semibold">
                      +{formatBRL(item.monthlyYieldEst)}/mês
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{item.accountName}</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{item.notes}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1F232D]">
                  <span className="text-[9px] uppercase font-mono text-slate-400 dark:text-zinc-500 block">
                    Saldo Patrimonial
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-zinc-100 font-mono tabular-nums mt-0.5 block">
                    {formatBRL(item.balanceBRL)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1F232D] text-xs font-mono flex justify-between items-center text-slate-600 dark:text-zinc-400">
                <span>Rentabilidade:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{item.annualRate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIMULADOR FIRE E PROJEÇÃO DE ENRIQUECIMENTO */}
      <FireWealthSimulator
        initialNetWorth={summary.totalNetWorthBRL || 247000}
        defaultMonthlyContribution={2000}
      />

    </div>
  );
}
