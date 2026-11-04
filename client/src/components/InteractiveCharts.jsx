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

  // Paleta vibrante inspirada no Mobills Web (Azul, Laranja, Roxo, Esmeralda, Rosa)
  const colors = [
    '#0284C7', // Sky Blue (Mobills)
    '#F97316', // Orange (Mobills)
    '#8B5CF6', // Purple (Mobills)
    '#10B981', // Emerald
    '#F43F5E', // Rose
    '#0D9488', // Teal
    '#6366F1', // Indigo
    '#EAB308', // Amber
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
    const pathData = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const circumference = 2 * Math.PI * 70;
    const strokeDasharray = `${(angle / 360) * circumference} ${circumference}`;
    const strokeDashoffset = -((startAngle / 360) * circumference);

    return {
      ...cat,
      color: colors[idx % colors.length],
      pathData,
      percentage: (percentage * 100).toFixed(1),
      strokeDasharray,
      strokeDashoffset
    };
  });

  // Net worth curve
  const netWorthList = netWorthData || [
    { month: "2026-05", label: "Mai", totalBRL: 192400 },
    { month: "2026-06", label: "Jun", totalBRL: 201100 },
    { month: "2026-07", label: "Jul", totalBRL: 212800 },
    { month: "2026-08", label: "Ago", totalBRL: 224300 },
    { month: "2026-09", label: "Set", totalBRL: 235900 },
    { month: "2026-10", label: "Out", totalBRL: 247000 }
  ];

  const minNW = Math.min(...netWorthList.map(d => d.totalBRL)) * 0.95;
  const maxNW = Math.max(...netWorthList.map(d => d.totalBRL)) * 1.05;
  const nwWidth = 400;
  const nwHeight = 160;

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
    { label: "Mai", inflow: 11646.11, outflow: 5794.56, balance: 5851.55 },
    { label: "Jun", inflow: 11646.11, outflow: 5744.26, balance: 5901.85 },
    { label: "Jul", inflow: 11646.11, outflow: 5864.76, balance: 5781.35 },
    { label: "Ago", inflow: 11646.11, outflow: 5853.76, balance: 5792.35 },
    { label: "Set", inflow: 11646.11, outflow: 5794.06, balance: 5852.05 },
    { label: "Out", inflow: 11646.11, outflow: 5334.26, balance: 6311.85 }
  ];

  const maxCF = 13000;

  return (
    <div className="space-y-5">
      
      {/* 2-COLUMN SECTION: Rosca de Despesas & Evolução Patrimonial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Gráfico 1: Despesas por Categoria (Rosca Interativa Estilo Mobills) */}
        <div className="workbench-panel rounded-2xl p-5 border border-slate-100 dark:border-[#1F232D] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">Despesas por Categoria</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tabular-nums">
                Total: {formatBRL(totalExpenses)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 my-2">
              {/* SVG Donut */}
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    className="stroke-slate-100 dark:stroke-[#191D26]"
                    strokeWidth="20"
                  />
                  {donutSegments.map((seg, idx) => (
                    <circle
                      key={idx}
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={selectedDonutIndex === idx ? "24" : "20"}
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      onMouseEnter={() => setSelectedDonutIndex(idx)}
                      onMouseLeave={() => setSelectedDonutIndex(null)}
                      className="transition-all duration-200 cursor-pointer"
                    />
                  ))}
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4 font-mono">
                  {selectedDonutIndex !== null ? (
                    <>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-zinc-400 truncate max-w-[100px]">
                        {donutSegments[selectedDonutIndex].name}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                        {formatBRL(donutSegments[selectedDonutIndex].value)}
                      </span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                        {donutSegments[selectedDonutIndex].percentage}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] uppercase text-slate-400 dark:text-zinc-500">Despesas</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                        {formatBRL(totalExpenses)}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">Muriaé/MG</span>
                    </>
                  )}
                </div>
              </div>

              {/* Legend List (Accessible via Pointer & Keyboard) */}
              <div className="space-y-1 w-full max-h-44 overflow-y-auto pr-1">
                {donutSegments.slice(0, 6).map((seg, idx) => (
                  <div
                    key={idx}
                    tabIndex={0}
                    role="button"
                    aria-label={`${seg.name}: ${formatBRL(seg.value)}, ${seg.percentage}% do total`}
                    onMouseEnter={() => setSelectedDonutIndex(idx)}
                    onMouseLeave={() => setSelectedDonutIndex(null)}
                    onFocus={() => setSelectedDonutIndex(idx)}
                    onBlur={() => setSelectedDonutIndex(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-all duration-150 focus:outline-none ${
                      selectedDonutIndex === idx ? 'bg-purple-50 text-purple-900 dark:bg-[#1D212B] dark:text-white shadow-2xs' : 'hover:bg-slate-50 dark:hover:bg-[#141720]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                      <span className="text-slate-700 dark:text-zinc-300 truncate text-[11px] font-medium">{seg.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 tabular-nums text-[11px]">{formatBRL(seg.value)}</span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-400 w-8 text-right font-medium">{seg.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 dark:border-[#1F232D] text-[11px] font-mono text-slate-500 dark:text-zinc-500 flex justify-between items-center">
            <span>Classificação automatizada</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Outubro/2026</span>
          </div>
        </div>

        {/* Gráfico 2: Evolução Patrimonial Familiar */}
        <div className="workbench-panel rounded-2xl p-5 bg-white dark:bg-[#111318] border border-slate-100 dark:border-[#1F232D] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 dark:border-[#1F232D]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">Evolução Patrimonial</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                +28.4% em 6 meses
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-2">
              Patrimônio familiar líquido consolidado (Nomad USD + Selic + Terreno Muriaé):
            </p>

            {/* SVG Area Chart */}
            <div className="w-full h-40 relative">
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${nwWidth} ${nwHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area */}
                <path d={nwArea} fill="url(#nwGradient)" />
                {/* Line */}
                <path d={nwPath} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Points */}
                {nwPoints.map((pt, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />
                    <text
                      x={pt.x}
                      y={pt.y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-mono fill-slate-700 dark:fill-zinc-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {formatBRL(pt.totalBRL)}
                    </text>
                  </g>
                ))}
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] font-medium text-slate-500 dark:text-zinc-500 px-3 mt-1">
                {netWorthList.map((pt, idx) => (
                  <span key={idx}>{pt.label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 dark:border-[#1F232D] text-[11px] font-mono text-slate-500 dark:text-zinc-500 flex justify-between items-center">
            <span>Patrimônio Atual Consolidado:</span>
            <strong className="text-slate-800 dark:text-zinc-200 font-mono text-xs tabular-nums">{formatBRL(netWorthList[netWorthList.length - 1].totalBRL)}</strong>
          </div>
        </div>

      </div>

      {/* Gráfico 3: Fluxo de Caixa Mensal (Entradas vs Saídas) */}
      <div className="workbench-panel rounded-2xl p-5 bg-white dark:bg-[#111318] border border-slate-100 dark:border-[#1F232D] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-100 dark:border-[#1F232D]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">Fluxo de Caixa Mensal (Entradas vs Saídas)</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Comparativo mês a mês com taxa média de sobra superior a 50%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span className="text-slate-600 dark:text-zinc-300 text-[11px] font-medium">Entradas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-rose-500" />
              <span className="text-slate-600 dark:text-zinc-300 text-[11px] font-medium">Saídas Reais</span>
            </div>
          </div>
        </div>

        {/* Bar chart grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 pt-2">
          {cfList.map((item, idx) => {
            const inHeight = (item.inflow / maxCF) * 100;
            const outHeight = (item.outflow / maxCF) * 100;

            return (
              <div key={idx} className="bg-slate-50 dark:bg-[#0E1015] p-2.5 rounded-xl border border-slate-100 dark:border-[#1F232D] flex flex-col justify-between font-mono">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 text-center block mb-1">{item.label}</span>
                
                {/* Visual Bars Container */}
                <div className="h-28 flex items-end justify-center gap-2 my-1">
                  {/* Inflow Bar */}
                  <div className="w-3 bg-slate-200 dark:bg-[#191D26] rounded-t relative flex items-end h-full">
                    <div 
                      className="w-full bg-emerald-500 rounded-t transition-all duration-300" 
                      style={{ height: `${inHeight}%` }}
                      title={`Entradas: ${formatBRL(item.inflow)}`}
                    />
                  </div>

                  {/* Outflow Bar */}
                  <div className="w-3 bg-slate-200 dark:bg-[#191D26] rounded-t relative flex items-end h-full">
                    <div 
                      className="w-full bg-rose-500 rounded-t transition-all duration-300" 
                      style={{ height: `${outHeight}%` }}
                      title={`Saídas: ${formatBRL(item.outflow)}`}
                    />
                  </div>
                </div>

                <div className="text-center pt-1.5 border-t border-slate-100 dark:border-[#1F232D] text-[10px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums block">+{formatBRL(item.balance)}</span>
                  <span className="text-slate-400 dark:text-zinc-500 font-medium">Sobra Livre</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
