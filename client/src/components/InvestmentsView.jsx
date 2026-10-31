import React, { useState } from 'react';
import { 
  TrendingUp, 
  Globe2, 
  DollarSign, 
  Landmark, 
  ShieldCheck, 
  Sparkles, 
  PieChart, 
  ArrowUpRight, 
  RefreshCw, 
  Percent, 
  Layers,
  MapPin,
  Building
} from 'lucide-react';
import { formatBRL, formatUSD, formatPercent } from '../utils/formatters';

export function InvestmentsView({ 
  investmentsData, 
  onUpdateInvestment 
}) {
  const [exchangeRateInput, setExchangeRateInput] = useState('5.75');
  const [editingRate, setEditingRate] = useState(false);

  if (!investmentsData) {
    return <div className="p-8 text-center text-gray-400">Carregando carteira de investimentos...</div>;
  }

  const { investments, summary } = investmentsData;
  const nomadAsset = investments.find(i => i.assetType === 'USD_OFFSHORE');

  // Handle live exchange rate recalculation
  const handleRateUpdate = () => {
    const rate = parseFloat(exchangeRateInput.replace(',', '.')) || 5.75;
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
  const pctOffshore = ((summary.totalOffshoreUSD * (nomadAsset?.exchangeRate || 5.75) / totalBRL) * 100).toFixed(1);
  const pctFixedIncome = ((summary.totalFixedIncomeBRL / totalBRL) * 100).toFixed(1);
  const pctRealEstate = ((summary.totalRealEstateBRL / totalBRL) * 100).toFixed(1);

  // Total estimated monthly yield
  const totalMonthlyYield = investments.reduce((acc, curr) => acc + (Number(curr.monthlyYieldEst) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                Patrimônio Líquido Consolidado
              </span>
              <span className="text-xs text-gray-400">Internacional & Nacional</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Gestão de Ativos e Carteira de Investimentos
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Consolidação global dos ativos da família: Conta Nomad Internacional em dólares (ETFs VT e S&P 500), 
              reserva de emergência em Tesouro Selic a 13,75% a.a., CDB 110% CDI e patrimônio no Terreno de Muriaé.
            </p>
          </div>

          {/* Master Net Worth Display */}
          <div className="bg-gray-900/90 border border-amber-500/30 rounded-2xl p-5 min-w-[280px] text-center">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Patrimônio Líquido Total
            </span>
            <span className="text-3xl font-black text-white font-mono mt-1 block">
              {formatBRL(summary.totalNetWorthBRL)}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Rendimento passivo est.: ~{formatBRL(totalMonthlyYield)}/mês
            </span>
          </div>
        </div>

        {/* Allocation Progress Bar */}
        <div className="mt-6 pt-4 border-t border-gray-800/80">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
            <span>Alocação da Carteira: Offshore USD ({pctOffshore}%) • Renda Fixa Selic/CDB ({pctFixedIncome}%) • Imobiliário ({pctRealEstate}%)</span>
            <span className="font-bold text-amber-400 font-mono">100% Coberto</span>
          </div>
          <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${pctOffshore}%` }} title="Offshore Dólar" />
            <div className="bg-blue-500 h-full" style={{ width: `${pctFixedIncome}%` }} title="Renda Fixa" />
            <div className="bg-amber-500 h-full" style={{ width: `${pctRealEstate}%` }} title="Terreno Muriaé" />
          </div>
        </div>
      </div>

      {/* CARD INTERNACIONAL EM DESTAQUE: CONTA NOMAD GLOBAL */}
      {nomadAsset && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c2419] via-[#081b17] to-[#04100c] border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-900/40">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Globe2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">
                    {nomadAsset.accountName}
                  </h3>
                  <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Offshore USD
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">
                  Custódia DriveWealth LLC (USA) • Dólar líquido e ETFs globais de valor
                </p>
              </div>
            </div>

            {/* Currency conversion box */}
            <div className="flex items-center gap-4 bg-gray-950/70 p-3.5 rounded-2xl border border-emerald-500/30">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Saldo em Dólar</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {formatUSD(nomadAsset.balanceOriginal)}
                </span>
              </div>

              <div className="text-gray-600 font-mono text-xl">×</div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Cotação USD/BRL</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {editingRate ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={exchangeRateInput}
                        onChange={(e) => setExchangeRateInput(e.target.value)}
                        className="w-16 bg-gray-900 border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-white font-mono"
                      />
                      <button
                        onClick={handleRateUpdate}
                        className="px-2 py-0.5 bg-emerald-500 text-black text-xs font-bold rounded"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <span 
                      onClick={() => setEditingRate(true)}
                      className="cursor-pointer text-sm font-bold text-white font-mono bg-gray-900 px-2 py-0.5 rounded border border-gray-700 hover:border-emerald-400 transition"
                      title="Clique para editar cotação do dólar"
                    >
                      R$ {nomadAsset.exchangeRate.toFixed(2)} ✎
                    </span>
                  )}
                </div>
              </div>

              <div className="text-gray-600 font-mono text-xl">=</div>

              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Convertido BRL</span>
                <span className="text-xl font-black text-white font-mono">
                  {formatBRL(nomadAsset.balanceBRL)}
                </span>
              </div>
            </div>
          </div>

          {/* Nomad Holdings Breakdown */}
          {nomadAsset.holdings && (
            <div className="mt-6">
              <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-3">
                Distribuição dos Ativos em Dólar (Holdings)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nomadAsset.holdings.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-gray-950/60 border border-emerald-900/30 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-white block">{h.ticker}</span>
                      <span className="text-[10px] text-gray-400">Alocação: {h.allocation}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {formatUSD(h.valueUSD)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* OUTROS ATIVOS DA CARTEIRA: RENDA FIXA (TESOURO SELIC 13,75% E CDB) + TERRENO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {investments.filter(i => i.assetType !== 'USD_OFFSHORE').map((item) => {
          const isSelic = item.assetType === 'RENDA_FIXA_POS';
          const isRealEstate = item.assetType === 'PATRIMONIO_IMOVEL';

          return (
            <div 
              key={item.id}
              className={`glass-panel rounded-2xl p-5 shadow-xl flex flex-col justify-between border ${
                isRealEstate ? 'border-amber-500/30' : 'border-blue-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isRealEstate 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {item.institution}
                  </span>
                  {item.monthlyYieldEst > 0 && (
                    <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                      +{formatBRL(item.monthlyYieldEst)}/mês
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white">{item.accountName}</h4>
                <p className="text-xs text-gray-400 mt-1">{item.notes}</p>

                <div className="mt-4 pt-3 border-t border-gray-800">
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                    Saldo Patrimonial
                  </span>
                  <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                    {formatBRL(item.balanceBRL)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/60 text-xs flex justify-between items-center text-gray-300">
                <span className="text-gray-400">Rentabilidade:</span>
                <span className="font-semibold text-emerald-400">{item.annualRate}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
