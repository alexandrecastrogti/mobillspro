import React, { useState } from 'react';
import { formatBRL, formatPercent } from '../utils/formatters';
import { PieChart, TrendingUp, BarChart3, Info } from 'lucide-react';

export function InteractiveCharts({ cashFlowData, netWorthData, fixedExpenses, cardTransactions }) {
  const [selectedDonutIndex, setSelectedDonutIndex] = useState(null);

  // Group expenses by category for Donut chart
  const categoriesMap = {};
  
  if (fixedExpenses) {
    fixedExpenses.forEach(f => {
      const cat = f.category || 'Outros';
      categoriesMap[cat] = (categoriesMap[cat] || 0) + Number(f.alexandreShare);
    });
  }

  if (cardTransactions) {
    cardTransactions.forEach(c => {
      if (!c.isAtypical) {
        const cat = c.category || 'Cartão';
        const share = c.isShared ? Number(c.amount) / 2 : Number(c.amount);
        categoriesMap[cat] = (categoriesMap[cat] || 0) + share;
      }
    });
  }

  const categoryEntries = Object.entries(categoriesMap)
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  const totalExpenses = categoryEntries.reduce((a, b) => a + b.value, 0) || 1;

  // Color palette for Donut
  const colors = [
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#6366F1', // Indigo
    '#F97316', // Orange
    '#64748B'  // Slate
  ];

  // Donut SVG path calculations
  let accumulatedAngle = 0;
  const donutSegments = categoryEntries.map((cat, idx) => {
    const percentage = cat.value / totalExpenses;
    const angle = percentage * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (accumulatedAngle - 90) * (Math.PI / 180);

    const x1 = 100 + 70 * Math.cos(startRad);
    const y1 = 100 + 70 * Math.sin(startRad);
    const x2 = 100 + 70 * Math.cos(endRad);
    const y2 = 100 + 70 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2}`;

    return {
      ...cat,
      percentage: (percentage * 100).toFixed(1),
      color: colors[idx % colors.length],
      pathData,
      strokeDasharray: `${percentage * 440} 440`,
      strokeDashoffset: -startAngle * (440 / 360)
    };
  });

  // Net Worth Evolution Points
  const netWorthList = netWorthData || [
    { label: "Mai", totalBRL: 98400 },
    { label: "Jun", totalBRL: 104200 },
    { label: "Jul", totalBRL: 109800 },
    { label: "Ago", totalBRL: 115400 },
    { label: "Set", totalBRL: 120900 },
    { label: "Out", totalBRL: 126387.5 }
  ];

  const minNW = Math.min(...netWorthList.map(n => n.totalBRL)) * 0.95;
  const maxNW = Math.max(...netWorthList.map(n => n.totalBRL)) * 1.05;
  const nwHeight = 140;
  const nwWidth = 400;

  const nwPoints = netWorthList.map((pt, idx) => {
    const x = (idx / (netWorthList.length - 1)) * (nwWidth - 60) + 30;
    const y = nwHeight - ((pt.totalBRL - minNW) / (maxNW - minNW)) * (nwHeight - 40) - 20;
    return { ...pt, x, y };
  });

  const nwPath = nwPoints.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }, '');

  const nwArea = `${nwPath} L ${nwPoints[nwPoints.length - 1].x} ${nwHeight} L ${nwPoints[0].x} ${nwHeight} Z`;

  // Cashflow history
  const cfList = cashFlowData || [
    { label: "Mai", inflow: 11646.11, outflow: 5794.56 },
    { label: "Jun", inflow: 11646.11, outflow: 5744.26 },
    { label: "Jul", inflow: 11646.11, outflow: 5864.76 },
    { label: "Ago", inflow: 11646.11, outflow: 5853.76 },
    { label: "Set", inflow: 11646.11, outflow: 5794.06 },
    { label: "Out", inflow: 11646.11, outflow: 5334.26 }
  ];

  const maxCF = 13000;

  return (
    <div className="space-y-6">
      
      {/* 2-COLUMN SECTION: Rosca de Despesas & Evolução Patrimonial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Despesas por Categoria (Rosca Interativa) */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Despesas por Categoria</h3>
              </div>
              <span className="text-xs font-mono font-bold text-gray-400">
                Total: {formatBRL(totalExpenses)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
              {/* SVG Donut */}
              <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#1F2937"
                    strokeWidth="24"
                  />
                  {donutSegments.map((seg, idx) => (
                    <circle
                      key={idx}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={selectedDonutIndex === idx ? "28" : "24"}
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      onMouseEnter={() => setSelectedDonutIndex(idx)}
                      onMouseLeave={() => setSelectedDonutIndex(null)}
                      className="transition-all duration-300 cursor-pointer opacity-90 hover:opacity-100"
                    />
                  ))}
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                  {selectedDonutIndex !== null ? (
                    <>
                      <span className="text-[10px] uppercase font-bold text-gray-400 truncate max-w-[100px]">
                        {donutSegments[selectedDonutIndex].name}
                      </span>
                      <span className="text-sm font-black text-white font-mono">
                        {formatBRL(donutSegments[selectedDonutIndex].value)}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {donutSegments[selectedDonutIndex].percentage}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Despesas</span>
                      <span className="text-sm font-black text-white font-mono">
                        {formatBRL(totalExpenses)}
                      </span>
                      <span className="text-[10px] text-gray-500">Alexandre</span>
                    </>
                  )}
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 w-full max-h-48 overflow-y-auto pr-1">
                {donutSegments.slice(0, 6).map((seg, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setSelectedDonutIndex(idx)}
                    onMouseLeave={() => setSelectedDonutIndex(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition ${
                      selectedDonutIndex === idx ? 'bg-gray-800' : 'hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                      <span className="text-gray-300 truncate">{seg.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono shrink-0">
                      <span className="font-bold text-white">{formatBRL(seg.value)}</span>
                      <span className="text-[10px] text-gray-500 w-9 text-right">{seg.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800/80 text-[11px] text-gray-400 flex justify-between items-center">
            <span>Classificação automatizada MobillsPro</span>
            <span className="text-emerald-400 font-medium">Outubro/2026</span>
          </div>
        </div>

        {/* Gráfico 2: Evolução Patrimonial Familiar (SVG Curve) */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Evolução Patrimonial</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                +28.4% em 6 meses
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              Crescimento constante do patrimônio líquido da família (Nomad USD + Tesouro Selic + Terreno Muriaé):
            </p>

            {/* SVG Area Chart */}
            <div className="w-full h-44 relative">
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${nwWidth} ${nwHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area */}
                <path d={nwArea} fill="url(#nwGradient)" />
                {/* Line */}
                <path d={nwPath} fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Points */}
                {nwPoints.map((pt, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#111827" stroke="#F59E0B" strokeWidth="2.5" />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-gray-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {formatBRL(pt.totalBRL)}
                    </text>
                  </g>
                ))}
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[11px] font-mono text-gray-400 px-4 mt-1">
                {netWorthList.map((pt, idx) => (
                  <span key={idx}>{pt.label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800/80 text-[11px] text-gray-400 flex justify-between items-center">
            <span>Patrimônio Atual Consolidado:</span>
            <strong className="text-white font-mono text-xs">{formatBRL(netWorthList[netWorthList.length - 1].totalBRL)}</strong>
          </div>
        </div>

      </div>

      {/* Gráfico 3: Fluxo de Caixa Mensal (Entradas vs Saídas) */}
      <div className="glass-panel rounded-3xl p-6 shadow-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white">Fluxo de Caixa Mensal (Entradas vs Saídas)</h3>
              <p className="text-xs text-gray-400">Comparativo mês a mês com taxa média de sobra superior a 50%</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-gray-300">Entradas (R$ 11.646,11)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-rose-500/80" />
              <span className="text-gray-300">Saídas Reais</span>
            </div>
          </div>
        </div>

        {/* Bar chart grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-3">
          {cfList.map((item, idx) => {
            const inHeight = (item.inflow / maxCF) * 100;
            const outHeight = (item.outflow / maxCF) * 100;

            return (
              <div key={idx} className="bg-gray-900/60 p-3 rounded-2xl border border-gray-800/80 flex flex-col justify-between">
                <span className="text-xs font-bold text-white text-center block mb-2">{item.label}</span>
                
                {/* Visual Bars Container */}
                <div className="h-32 flex items-end justify-center gap-2 my-2">
                  {/* Inflow Bar */}
                  <div className="w-4 bg-gray-800/80 rounded-t-lg relative flex items-end h-full">
                    <div 
                      className="w-full bg-emerald-500 rounded-t-lg transition-all duration-500" 
                      style={{ height: `${inHeight}%` }}
                      title={`Entradas: ${formatBRL(item.inflow)}`}
                    />
                  </div>

                  {/* Outflow Bar */}
                  <div className="w-4 bg-gray-800/80 rounded-t-lg relative flex items-end h-full">
                    <div 
                      className="w-full bg-rose-500/80 rounded-t-lg transition-all duration-500" 
                      style={{ height: `${outHeight}%` }}
                      title={`Saídas: ${formatBRL(item.outflow)}`}
                    />
                  </div>
                </div>

                <div className="text-center pt-2 border-t border-gray-800 font-mono text-[11px]">
                  <span className="text-emerald-400 font-bold block">+{formatBRL(item.balance)}</span>
                  <span className="text-[10px] text-gray-500">Sobra Livre</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
