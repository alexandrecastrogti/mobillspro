import React, { useState } from 'react';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Filter, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/formatters';

export function BudgetsMetasView({ budgetsData, onUpdateBudget }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ALERT' | 'WARN' | 'OK'
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  if (!budgetsData || budgetsData.length === 0) {
    return <div className="p-8 text-center text-gray-400">Carregando metas orçamentárias...</div>;
  }

  const filtered = budgetsData.filter(b => {
    if (filter === 'ALERT' && b.status !== 'ALERT') return false;
    if (filter === 'WARN' && b.status !== 'WARN') return false;
    if (filter === 'OK' && b.status !== 'OK') return false;
    return true;
  });

  const totalTarget = budgetsData.reduce((acc, curr) => acc + Number(curr.targetAmount), 0);
  const totalSpent = budgetsData.reduce((acc, curr) => acc + Number(curr.spentAmount), 0);
  const totalDifference = totalTarget - totalSpent;
  const alertCount = budgetsData.filter(b => b.status === 'ALERT').length;

  const handleStartEdit = (b) => {
    setEditingId(b.id);
    setEditValue(String(b.targetAmount));
  };

  const handleSaveEdit = (id) => {
    const num = parseFloat(editValue.replace(',', '.')) || 0;
    if (num > 0 && onUpdateBudget) {
      onUpdateBudget(id, { targetAmount: num });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER HERO */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Planejamento Orçamentário (Padrão Mobills)
              </span>
              <span className="text-xs text-gray-400">Centros de Custo • Muriaé/MG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Gestão de Tetos de Gastos & Metas
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
              Monitore o consumo das categorias com o sistema de semáforo inteligente do Mobills: 
              verde até 75%, amarelo de 75% a 90%, e vermelho com alertas visuais nos estouros orçamentários.
            </p>
          </div>

          {/* Quick Budget Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-900/90 border border-gray-800 rounded-2xl p-4 min-w-[320px]">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Orçamento Total
              </span>
              <span className="text-lg font-black text-white font-mono mt-0.5 block">
                {formatBRL(totalTarget)}
              </span>
              <span className="text-[10px] text-gray-500">Planejado mês</span>
            </div>

            <div className="text-center border-l border-gray-800 sm:border-r">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Gasto Realizado
              </span>
              <span className="text-lg font-black text-amber-300 font-mono mt-0.5 block">
                {formatBRL(totalSpent)}
              </span>
              <span className="text-[10px] text-gray-500">Consumido</span>
            </div>

            <div className="text-center col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-800">
              <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">
                Alertas Críticos
              </span>
              <span className="text-lg font-black text-rose-400 font-mono mt-0.5 block">
                {alertCount}
              </span>
              <span className="text-[10px] text-rose-400/80">Estouros</span>
            </div>
          </div>
        </div>

        {/* Smart Color Code Legend */}
        <div className="mt-6 pt-4 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 font-semibold">Semáforo Mobills:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-300">Verde (&le; 75%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-gray-300">Amarelo (75% a 90%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-400 font-bold">Vermelho (&gt; 90% ou Estouro)</span>
            </div>
          </div>

          <span className="text-gray-400 font-mono text-[11px]">
            Saldo geral de metas: <strong className={totalDifference >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {formatBRL(totalDifference)}
            </strong>
          </span>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-2 bg-gray-900/60 p-2.5 rounded-2xl border border-gray-800">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === 'ALL' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Todas as Metas ({budgetsData.length})
        </button>
        <button
          onClick={() => setFilter('ALERT')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === 'ALERT' ? 'bg-rose-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          ⚠ Estourados / Alerta ({alertCount})
        </button>
        <button
          onClick={() => setFilter('WARN')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === 'WARN' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          No Limite (75%-90%)
        </button>
        <button
          onClick={() => setFilter('OK')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === 'OK' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Saudáveis (&le; 75%)
        </button>
      </div>

      {/* BUDGET CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isOver = item.isOverBudget;
          const isEditing = editingId === item.id;

          // Color classes
          let barBg = "bg-emerald-500";
          let badgeBorder = "border-emerald-500/30 text-emerald-300 bg-emerald-500/10";
          if (item.colorCode === 'YELLOW') {
            barBg = "bg-amber-500";
            badgeBorder = "border-amber-500/30 text-amber-300 bg-amber-500/10";
          } else if (item.colorCode === 'RED') {
            barBg = "bg-rose-500";
            badgeBorder = "border-rose-500/40 text-rose-300 bg-rose-500/15";
          }

          const clampedPercent = Math.min(100, item.percentage);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isOver 
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/20' 
                  : 'glass-panel border-gray-800 hover:border-gray-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{item.category}</h3>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeBorder}`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>

                  {/* Edit Target Button */}
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 bg-gray-900 border border-emerald-500 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-2 py-1 bg-emerald-500 text-black text-xs font-bold rounded"
                      >
                        Salvar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition"
                      title="Editar meta orçamentária"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-300">Gasto: <strong className="text-white">{formatBRL(item.spentAmount)}</strong></span>
                    <span className="text-gray-400">Meta: {formatBRL(item.targetAmount)}</span>
                  </div>

                  <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${clampedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Alert or Status Note */}
                <div className="mt-3 text-xs leading-relaxed">
                  {isOver ? (
                    <div className="flex items-center gap-1.5 text-rose-300 font-semibold bg-rose-950/40 p-2 rounded-xl border border-rose-500/30">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{item.alertNote}</span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-[11px]">{item.alertNote}</p>
                  )}
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">
                  {isOver ? 'Extrapolado em:' : 'Saldo restante:'}
                </span>
                <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isOver ? `+${formatBRL(Math.abs(item.remaining))}` : formatBRL(item.remaining)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
