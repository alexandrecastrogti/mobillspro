import React, { useState } from 'react';
import { 
  Target, 
  AlertTriangle, 
  Edit3, 
  Trash2,
  Plus
} from 'lucide-react';
import { formatBRL } from '../utils/formatters';

export function BudgetsMetasView({ budgetsData, onUpdateBudget, onDeleteBudget, onOpenNewModal }) {
  const [filter, setFilter] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  if (!budgetsData || budgetsData.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-8 text-center text-slate-500 dark:text-zinc-400 font-mono text-xs space-y-3 shadow-sm">
        <p>Nenhuma meta orçamentária cadastrada.</p>
        <button
          onClick={onOpenNewModal}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Criar Primeira Meta
        </button>
      </div>
    );
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

  const handleDelete = (id, cat) => {
    if (window.confirm(`Tem certeza que deseja excluir a meta de "${cat}"?`)) {
      if (onDeleteBudget) onDeleteBudget(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER HERO */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#1F232D] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50 flex items-center gap-1.5">
                <Target className="w-3 h-3" />
                PLANEJAMENTO ORÇAMENTÁRIO (TETOS & METAS)
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">CENTROS DE CUSTO • MURIAÉ/MG</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
              Gestão de Tetos de Gastos & Metas
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Monitore o consumo das categorias com semáforo rigoroso: 
              verde até 75%, amarelo de 75% a 90%, e vermelho nos estouros orçamentários.
            </p>
          </div>

          {/* Quick Budget Metrics & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 dark:bg-[#12151D] border border-slate-200 dark:border-[#222838] rounded-xl p-3 min-w-[310px]">
              <div className="text-center font-mono">
                <span className="text-[9px] uppercase font-semibold text-slate-500 block">
                  Orçamento Total
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tabular-nums mt-0.5 block">
                  {formatBRL(totalTarget)}
                </span>
                <span className="text-[10px] text-slate-400">Planejado</span>
              </div>

              <div className="text-center border-l border-slate-200 dark:border-[#1F232D] sm:border-r font-mono">
                <span className="text-[9px] uppercase font-semibold text-amber-700 dark:text-amber-400 block">
                  Realizado
                </span>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300 tabular-nums mt-0.5 block">
                  {formatBRL(totalSpent)}
                </span>
                <span className="text-[10px] text-slate-400">Consumido</span>
              </div>

              <div className="text-center col-span-2 sm:col-span-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-[#1F232D] font-mono">
                <span className="text-[9px] uppercase font-semibold text-rose-700 dark:text-rose-400 block">
                  Estouros
                </span>
                <span className="text-sm font-bold text-rose-700 dark:text-rose-400 tabular-nums mt-0.5 block">
                  {alertCount}
                </span>
                <span className="text-[10px] text-rose-500">Alertas</span>
              </div>
            </div>

            <button
              onClick={onOpenNewModal}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Nova Meta
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1F232D] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-semibold">Semáforo:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-700 dark:text-zinc-300">Normal (&le; 75%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-700 dark:text-zinc-300">Atenção (75% a 90%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-rose-600 dark:text-rose-400 font-bold">Estouro (&gt; 90%)</span>
            </div>
          </div>

          <span className="text-slate-600 dark:text-zinc-400 tabular-nums text-[11px]">
            Saldo geral de metas: <strong className={totalDifference >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
              {formatBRL(totalDifference)}
            </strong>
          </span>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-[#12141B] p-2.5 rounded-xl border border-slate-200 dark:border-[#1F232D] shadow-sm">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
            filter === 'ALL' ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-black font-semibold' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
          }`}
        >
          Todas ({budgetsData.length})
        </button>
        <button
          onClick={() => setFilter('ALERT')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
            filter === 'ALERT' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
          }`}
        >
          ⚠ Alertas ({alertCount})
        </button>
        <button
          onClick={() => setFilter('WARN')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
            filter === 'WARN' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
          }`}
        >
          Atenção (75%-90%)
        </button>
        <button
          onClick={() => setFilter('OK')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
            filter === 'OK' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-[#181B24]'
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

          let barBg = "bg-emerald-600";
          let badgeBorder = "border-emerald-200 text-emerald-800 bg-emerald-50 dark:border-emerald-800/40 dark:text-emerald-400 dark:bg-emerald-950/40";
          if (item.colorCode === 'YELLOW') {
            barBg = "bg-amber-500";
            badgeBorder = "border-amber-200 text-amber-800 bg-amber-50 dark:border-amber-800/40 dark:text-amber-300 dark:bg-amber-950/40";
          } else if (item.colorCode === 'RED') {
            barBg = "bg-rose-600";
            badgeBorder = "border-rose-200 text-rose-800 bg-rose-50 dark:border-rose-800/40 dark:text-rose-300 dark:bg-rose-950/40";
          }

          const clampedPercent = Math.min(100, item.percentage);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between shadow-xs ${
                isOver 
                  ? 'bg-rose-50/50 dark:bg-[#181116] border-rose-200 dark:border-rose-900/50' 
                  : 'bg-white dark:bg-[#13161F] border-slate-200 dark:border-[#1F232D] hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-100">{item.category}</h3>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${badgeBorder}`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-16 bg-white dark:bg-[#0D0F14] border border-slate-300 dark:border-[#2B303E] rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-zinc-100 font-mono outline-none"
                        />
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-mono font-bold rounded cursor-pointer"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-[#1A1E29] transition cursor-pointer"
                        title="Editar meta orçamentária"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item.id, item.category)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Excluir meta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-zinc-400">Gasto: <strong className="text-slate-900 dark:text-zinc-200 tabular-nums">{formatBRL(item.spentAmount)}</strong></span>
                    <span className="text-slate-500 dark:text-zinc-500 tabular-nums">Meta: {formatBRL(item.targetAmount)}</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-[#181C25] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-transparent">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${barBg}`}
                      style={{ width: `${clampedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Alert Note */}
                <div className="mt-2.5 text-xs font-mono">
                  {isOver ? (
                    <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40 text-[11px] font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                      <span>{item.alertNote}</span>
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-zinc-500 text-[11px]">{item.alertNote}</p>
                  )}
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#1F232D] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  {isOver ? 'Extrapolado em:' : 'Saldo restante:'}
                </span>
                <span className={`font-bold tabular-nums ${isOver ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
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
